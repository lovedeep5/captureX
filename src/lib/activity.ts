import prismadb from "./prismadb";

export type ActivityType =
  | "RECORDING_CREATED"
  | "RECORDING_RENAMED"
  | "RECORDING_DELETED"
  | "LOGIN"
  | "LOGOUT"
  | "COMMENT_ADDED"
  | "COMMENT_LIKED";

export async function trackActivity(
  userId: string,
  type: ActivityType,
  metadata: Record<string, any> = {}
) {
  console.log("[TRACK_ACTIVITY] Starting activity tracking:", {
    userId,
    type,
    metadata,
  });

  try {
    // Extract resourceId from metadata if it exists
    const { videoId, ...otherMetadata } = metadata;

    console.log("[TRACK_ACTIVITY] Creating activity with data:", {
      userId,
      type,
      resourceId: videoId,
      details: otherMetadata,
    });

    const result = await prismadb.activity.create({
      data: {
        userId,
        type,
        resourceId: videoId,
        details: otherMetadata,
      },
    });

    console.log("[TRACK_ACTIVITY] Activity tracked successfully:", result);
    return result;
  } catch (error) {
    console.error("[TRACK_ACTIVITY] Error tracking activity:", {
      error,
      userId,
      type,
      metadata,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    // Don't throw the error - just log it and continue
    // This way, if activity tracking fails, it won't affect the main operation
  }
}
