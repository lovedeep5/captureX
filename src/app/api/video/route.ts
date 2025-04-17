import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@clerk/nextjs";
import { trackActivity } from "@/lib/activity";
import prismadb from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

const Bucket = process.env.AMPLIFY_BUCKET as string;
const s3 = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key || typeof key !== "string") {
      return new NextResponse("File name is required!", { status: 400 });
    }

    const recording = await prismadb.recordings.findUnique({
      where: {
        uuid: key,
      },
    });

    if (!recording || !recording.s3_key) {
      return new NextResponse(
        JSON.stringify({ error: "Recording not found" }),
        { status: 404 }
      );
    }

    const command = new GetObjectCommand({
      Bucket,
      Key: recording.s3_key,
      ResponseContentType: "video/webm",
      ResponseCacheControl: "max-age=31536000",
      ResponseExpires: new Date(Date.now() + 3600 * 1000), // 1 hour from now
    });

    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 3600,
      // Allow range requests for seeking
      signableHeaders: new Set([
        "range",
        "if-match",
        "if-none-match",
        "if-modified-since",
        "if-unmodified-since",
      ]),
    });

    return new NextResponse(
      JSON.stringify({
        url: signedUrl,
        title: recording.title,
        uuid: recording.uuid,
        createdAt: recording.createdAt,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "range",
        },
      }
    );
  } catch (err) {
    console.error("Error generating signed URL:", err);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch video" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key || typeof key !== "string") {
      return new NextResponse("Key is required to delete the video", {
        status: 400,
      });
    }
    const recording = await prismadb.recordings.findUnique({
      where: {
        uuid: key,
      },
    });

    if (!recording) {
      return new NextResponse("Recording not found", { status: 404 });
    }

    const response = await s3.send(
      new DeleteObjectCommand({
        Bucket,
        Key: recording.s3_key,
      })
    );

    await prismadb.recordings.delete({
      where: {
        uuid: key,
      },
    });

    // Track the delete activity
    await trackActivity(userId, "RECORDING_DELETED", {
      videoId: key,
      title: recording.title,
    });

    // Revalidate both the library page and the API routes
    revalidatePath("/library");
    revalidatePath("/api/videos");
    revalidatePath("/api/video");

    return NextResponse.json({ response });
  } catch (error) {
    console.error("[VIDEO_DELETE]", error);
    return new NextResponse("Internal server error", {
      status: 500,
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth();
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    const formData = await request.formData();
    const title = formData.get("title") as string;

    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    if (!id || !title) {
      return new NextResponse("Missing required file, either id or title", {
        status: 402,
      });
    }

    const response = await prismadb.recordings.update({
      where: {
        uuid: id,
      },
      data: {
        title,
      },
    });

    // Track the rename activity
    await trackActivity(userId, "RECORDING_RENAMED", {
      videoId: id,
      newTitle: title,
      oldTitle: response.title,
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error("[VIDEO_RENAME]", error);
    return new NextResponse("Internal server error", { status: 501 });
  }
}
