import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(request: NextRequest) {
  //   const formData = await request.formData();
  const { userId } = auth();
  console.log("data ===>>", userId);

  const user = await prismadb.users.create({
    data: {
      email: "tes4443t@gmail.com",
      userId: "1234444563",
    },
  });
  return NextResponse.json({ name: user });
}
