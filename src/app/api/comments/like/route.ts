import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

// Toggle like on a comment
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    const { commentId } = await request.json();

    if (!commentId) {
      return new NextResponse("Comment ID is required", { status: 400 });
    }

    // Check if the comment exists
    const comment = await prismadb.comment.findUnique({
      where: { id: commentId },
      include: { likes: true },
    });

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }

    // Check if the user has already liked the comment
    const existingLike = await prismadb.like.findFirst({
      where: {
        userId,
        commentId,
      },
    });

    if (existingLike) {
      // Unlike if already liked
      await prismadb.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      // Create new like
      await prismadb.like.create({
        data: {
          userId,
          commentId,
        },
      });
    }

    // Get updated comment with likes
    const updatedComment = await prismadb.comment.findUnique({
      where: { id: commentId },
      include: { likes: true },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error toggling like:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
