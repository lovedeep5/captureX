import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import prismadb from "@/lib/prismadb";

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
    const recording = await prismadb.Recordings.findUnique({
      where: {
        uuid: key,
      },
    });

    const command = new GetObjectCommand({
      Bucket,
      Key: recording?.s3_key,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL expires in 1 hour

    return new NextResponse(JSON.stringify({ url: signedUrl }), {
      status: 200,
    });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
