import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { auth } from "@clerk/nextjs";

const Bucket = process.env.AMPLIFY_BUCKET;
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
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
        const Body = (await file.arrayBuffer()) as Buffer;

        return s3.send(
          new PutObjectCommand({
            Bucket,
            Key: file.name,
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
  const response = await s3.send(new ListObjectsCommand({ Bucket }));
  console.log("response", response);

  return NextResponse.json(response?.Contents ?? []);
}
