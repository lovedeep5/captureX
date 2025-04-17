// pages/api/listVideos.ts
import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsCommandOutput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";

import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { trackActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

const Bucket = process.env.AMPLIFY_BUCKET as string;
const s3 = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("file") as File[];
    let uuid = "";

    if (!files || files.length === 0) {
      return new NextResponse("No files found", { status: 400 });
    }

    const response = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const Body = Buffer.from(arrayBuffer);
        uuid = crypto.randomUUID();
        const fileName = `${userId}/${uuid}/${file.name}`;

        const recording = await prismadb.recordings.create({
          data: {
            userId,
            s3_key: fileName,
            uuid,
            title: file.name,
          },
        });

        // Track the creation activity
        await trackActivity(userId, "RECORDING_CREATED", {
          videoId: uuid,
          title: file.name,
        });

        const upload = new Upload({
          client: s3,
          params: {
            Bucket,
            Key: fileName,
            Body,
            ContentType: file.type,
            ContentDisposition: "inline",
          },
        });

        upload.on("httpUploadProgress", (progress) => {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        });

        const result = await upload.done();
        return result;
      })
    );

    // Revalidate both the library page and the API route
    revalidatePath("/library");
    revalidatePath("/api/videos");

    return NextResponse.json({ response, uuid });
  } catch (error) {
    console.error("[VIDEO_CREATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }
    const listCommand = new ListObjectsCommand({ Bucket, Prefix: userId });
    const response: ListObjectsCommandOutput = await s3.send(listCommand);

    const signedUrls = await Promise.all(
      (response.Contents || []).map(async (item) => {
        if (item.Key) {
          const url = await getSignedUrl(
            s3,
            new GetObjectCommand({
              Bucket,
              Key: item.Key,
              ResponseContentDisposition: "inline",
              ResponseContentType: "video/webm",
            }),
            { expiresIn: 3600 }
          );

          const recording = await prismadb.recordings.findFirst({
            where: {
              s3_key: item.Key,
              userId,
            },
          });

          return {
            Key: item.Key,
            url,
            uuid: recording?.uuid,
            title: recording?.title,
          };
        }
      })
    );

    return NextResponse.json(signedUrls.filter(Boolean));
  } catch (error) {
    return NextResponse.json(
      { error: "Error listing objects" },
      { status: 500 }
    );
  }
}
