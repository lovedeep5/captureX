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
import { auth } from "@clerk/nextjs";

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

    const response = await Promise.all(
      files.map(async (file) => {
        const Body = await file.arrayBuffer();

        return s3.send(
          new PutObjectCommand({
            Bucket,
            Key: `${userId}/${file.name}`,
            Body,
          })
        );
      })
    );

    return NextResponse.json(response);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }
    // const userId = "user_2dbSjatI0Ge1iqsViDIuskdWCxY";
    const listCommand = new ListObjectsCommand({ Bucket, Prefix: userId });
    const response: ListObjectsCommandOutput = await s3.send(listCommand);

    const signedUrls = await Promise.all(
      (response.Contents || []).map(async (item) => {
        if (item.Key) {
          const url = await getSignedUrl(
            s3,
            new GetObjectCommand({ Bucket, Key: item.Key }),
            { expiresIn: 3600 }
          );
          return { Key: item.Key, url };
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
