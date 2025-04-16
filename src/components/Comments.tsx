import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Reply, ThumbsUp, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
  replies: Comment[];
  likes: { userId: string; id: string }[];
}

interface CommentsProps {
  videoId: string;
}

export default function Comments({ videoId }: CommentsProps) {
  const { userId } = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReplyLoading, setIsReplyLoading] = useState(false);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?videoId=${videoId}`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !newComment.trim() || !user) return;

    // Create optimistic comment
    const optimisticComment: Comment = {
      id: Date.now().toString(), // Temporary ID
      content: newComment,
      userId,
      userName:
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.username || "Anonymous",
      createdAt: new Date().toISOString(),
      replies: [],
      likes: [],
    };

    // Update UI optimistically
    setComments((prev) => [optimisticComment, ...prev]);
    setNewComment("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: optimisticComment.content,
          videoId,
        }),
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setComments((prev) =>
          prev.filter((comment) => comment.id !== optimisticComment.id)
        );
        const error = await response.json();
        throw new Error(error.error || "Failed to post comment");
      }

      // Update with real data from server
      await fetchComments();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!userId || !replyContent.trim() || !user) return;

    // Create optimistic reply
    const optimisticReply: Comment = {
      id: Date.now().toString(), // Temporary ID
      content: replyContent,
      userId,
      userName:
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.username || "Anonymous",
      createdAt: new Date().toISOString(),
      replies: [],
      likes: [],
    };

    // Update UI optimistically
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [optimisticReply, ...comment.replies],
          };
        }
        return comment;
      })
    );

    setReplyContent("");
    setReplyingTo(null);
    setIsReplyLoading(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: optimisticReply.content,
          videoId,
          parentId,
        }),
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setComments((prev) =>
          prev.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: comment.replies.filter(
                  (reply) => reply.id !== optimisticReply.id
                ),
              };
            }
            return comment;
          })
        );
        const error = await response.json();
        throw new Error(error.error || "Failed to post reply");
      }

      // Update with real data from server
      await fetchComments();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to post reply",
        variant: "destructive",
      });
    } finally {
      setIsReplyLoading(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!userId) return;

    // Update UI optimistically
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          const hasLiked = comment.likes.some((like) => like.userId === userId);
          return {
            ...comment,
            likes: hasLiked
              ? comment.likes.filter((like) => like.userId !== userId)
              : [...comment.likes, { userId, id: Date.now().toString() }],
          };
        }
        // Check in replies too
        if (comment.replies.some((reply) => reply.id === commentId)) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === commentId) {
                const hasLiked = reply.likes.some(
                  (like) => like.userId === userId
                );
                return {
                  ...reply,
                  likes: hasLiked
                    ? reply.likes.filter((like) => like.userId !== userId)
                    : [...reply.likes, { userId, id: Date.now().toString() }],
                };
              }
              return reply;
            }),
          };
        }
        return comment;
      })
    );

    try {
      const response = await fetch("/api/comments/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });

      if (!response.ok) {
        // Revert optimistic update on error
        await fetchComments(); // Fetch real state from server
        const error = await response.json();
        throw new Error(error.error || "Failed to toggle like");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to like comment",
        variant: "destructive",
      });
    }
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div
      key={comment.id}
      className={`p-4 rounded-lg bg-gray-800/50 ${
        isReply ? "ml-8 mt-2" : "mb-4"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <p className="font-medium text-white">{comment.userName}</p>
        <span className="text-xs text-gray-400">
          {formatDistanceToNow(new Date(comment.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>
      <p className="text-gray-300 mb-3">{comment.content}</p>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-gray-300"
          onClick={() => handleLike(comment.id)}
        >
          <ThumbsUp
            className={`w-4 h-4 mr-1 ${
              comment.likes.some((like) => like.userId === userId)
                ? "text-purple-400"
                : ""
            }`}
          />
          {comment.likes.length}
        </Button>
        {!isReply && (
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-300"
            onClick={() => setReplyingTo(comment.id)}
          >
            <Reply className="w-4 h-4 mr-1" />
            Reply
          </Button>
        )}
      </div>

      {replyingTo === comment.id && (
        <div className="mt-4">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="bg-[#1E293B] border-gray-700 text-white mb-2"
            disabled={isReplyLoading}
          />
          <div className="flex gap-2">
            <Button
              onClick={() => handleSubmitReply(comment.id)}
              disabled={isReplyLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isReplyLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Reply"
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setReplyingTo(null);
                setReplyContent("");
              }}
              disabled={isReplyLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {comment.replies?.length > 0 && (
        <div className="mt-4">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {userId ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="bg-[#1E293B] border-gray-700 text-white mb-2"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !newComment.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </Button>
        </form>
      ) : (
        <p className="text-gray-400 text-center py-4">
          Please sign in to leave a comment
        </p>
      )}

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => renderComment(comment))
        ) : (
          <p className="text-gray-400 text-center py-4">No comments yet</p>
        )}
      </div>
    </div>
  );
}
