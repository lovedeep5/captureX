"use client";
import React, { useState } from "react";
import useSWR from "swr";
import { getVideo } from "@/gatways/video";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send } from "lucide-react";

const ShareVideo = ({ params: { key } }: { params: { key: string } }) => {
  const { data, isLoading, error } = useSWR(`/api/video`, () => getVideo(key), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  });

  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Capture X Developer",
      comment: "Comments are in Development! 🎥",
    },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      { id: comments.length + 1, name: "You", comment: newComment },
    ]);
    setNewComment("");
  };

  if (error) {
    return <p className="p-4 text-red-600 text-center">Error loading video.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Video Section */}
      <div className="md:col-span-2 space-y-4">
        {isLoading ? (
          <Skeleton className="h-[320px] w-full rounded-xl" />
        ) : (
          <video
            src={data?.data?.url}
            className="w-full rounded-xl shadow-lg"
            controls
          />
        )}
        <h1 className="text-xl font-semibold text-gray-800">
          {data?.data?.title?.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
        </h1>

        {/* Comments Section */}
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3 flex items-center border-b pb-2">
            <MessageSquare className="mr-2 text-blue-500" /> Comments
          </h2>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="p-2 border-b">
                <p className="font-semibold text-gray-700">
                  {comment.name.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
                </p>
                <p className="text-sm text-gray-600">
                  {comment.comment.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              disabled
            />
            <Button
              onClick={handleAddComment}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* AI Features Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-gray-100 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            🚀 AI Features Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Soon, you&apos;ll be able to generate{" "}
            <strong>AI-powered captions</strong> and
            <strong> summaries</strong> for your videos. AI will analyze your
            recordings and create{" "}
            <strong>engaging, SEO-friendly descriptions</strong> in seconds.
          </p>
          <p className="mt-3 text-gray-500 italic">
            Stay tuned for updates! 🔥
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShareVideo;
