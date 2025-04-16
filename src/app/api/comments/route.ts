import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

// Get comments for a video
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return new NextResponse("Video ID is required", { status: 400 });
    }

    const comments = await prismadb.comment.findMany({
      where: {
        videoId,
        parentId: null, // Only fetch top-level comments
      },
      include: {
        replies: {
          include: {
            likes: true,
          },
        },
        likes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// Create a new comment
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    const { content, videoId, parentId } = await request.json();

    if (!content || !videoId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if video exists
    const video = await prismadb.recordings.findUnique({
      where: { uuid: videoId },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // If this is a reply, check if parent comment exists
    if (parentId) {
      const parentComment = await prismadb.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 }
        );
      }
    }

    const comment = await prismadb.comment.create({
      data: {
        content,
        videoId,
        userId,
        userName:
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.username || "Anonymous",
        parentId: parentId || null,
      },
      include: {
        replies: true,
        likes: true,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
