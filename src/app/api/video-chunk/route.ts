import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { auth } from "@clerk/nextjs";

export async function POST(request: NextRequest) {
  const { userId } = auth();
  const chunk = await request.arrayBuffer();

  const uploadDir = path.join(process.cwd(), "uploads");

  // Create the uploads directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const userDir = path.join(uploadDir, `${userId}`);

  // Create the user-specific directory
  fs.mkdirSync(userDir, { recursive: true });

  const chunkPath = path.join(userDir, `${uuidv4()}.webm`);
  fs.writeFileSync(chunkPath, new Uint8Array(chunk));

  return NextResponse.json({ message: "Chunk received", userId });
}
