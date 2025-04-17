"use client";

import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Sparkles, Edit, Check, X } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import ShareActions from "./ShareActions";
import { getVideo, updateVideoTitle } from "@/gatways/video";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Comments from "@/components/Comments";

export default function ShareVideo({
  params: { key },
}: {
  params: { key: string };
}) {
  const { userId } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const {
    data: videoData,
    error,
    isLoading,
    mutate,
  } = useSWR(`/api/video?key=${key}`, () => getVideo(key), {
    revalidateOnFocus: false, // Prevent revalidation when window regains focus
    revalidateOnReconnect: false, // Prevent revalidation on network reconnect
    revalidateIfStale: false, // Prevent automatic background revalidation
    dedupingInterval: 3600000, // Cache for 1 hour
    keepPreviousData: true, // Keep showing previous data while revalidating
  });

  // Check if the current user owns the video by comparing userId from the URL
  const isOwner = userId && videoData?.url?.includes(`/${userId}/`);

  const handleEditClick = () => {
    setNewTitle(videoData?.title || "");
    setIsEditing(true);
  };

  const handleSaveTitle = async () => {
    if (!newTitle.trim()) return;

    try {
      const formData = new FormData();
      formData.append("title", newTitle);
      await updateVideoTitle(key, formData);
      await mutate(); // Refresh the data
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Video title updated successfully",
        className: "bg-[#1E293B] text-white border-gray-800",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update video title",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewTitle("");
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0F172A] text-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-400 mb-2">
            Error Loading Recording
          </h2>
          <p className="text-gray-400">
            This recording might have been deleted or is no longer available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative group">
              {isLoading ? (
                <Skeleton className="aspect-video w-full rounded-xl bg-[#1E293B]" />
              ) : (
                <>
                  <VideoPlayer url={videoData?.url} />
                  <ShareActions url={videoData?.url} />
                </>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="flex-1 bg-[#1E293B] border-gray-700 text-white"
                      placeholder="Enter new title"
                      autoFocus
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleSaveTitle}
                      className="h-10 w-10 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                    >
                      <Check className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleCancelEdit}
                      className="h-10 w-10 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-semibold text-white flex-1">
                      {videoData?.title
                        ?.replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;") || "Untitled Recording"}
                    </h1>
                    {isOwner && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleEditClick}
                        className="h-10 w-10 text-gray-400 hover:text-gray-300 hover:bg-gray-500/10"
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                    )}
                  </>
                )}
              </div>

              {/* Comments Section */}
              <Card className="border-gray-800 bg-[#1E293B]">
                <CardHeader className="border-b border-gray-800">
                  <CardTitle className="text-lg flex items-center text-white">
                    <MessageSquare className="w-5 h-5 mr-2 text-purple-400" />
                    Comments
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <Comments videoId={key} />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* AI Features Section */}
          <div className="lg:col-span-1">
            <Card className="border-gray-800 bg-[#1E293B]">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                  AI Features Coming Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-gray-800/50">
                    <h3 className="font-medium text-white mb-2">
                      Smart Captions
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Automatically generate accurate captions for your
                      recordings.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-800/50">
                    <h3 className="font-medium text-white mb-2">
                      Video Summary
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Get AI-powered summaries of your video content.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-800/50">
                    <h3 className="font-medium text-white mb-2">
                      SEO Optimization
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Generate SEO-friendly titles and descriptions
                      automatically.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
