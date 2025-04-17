"use client";
import { ChangeEvent, useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import { Camera, Copy, Edit, ExternalLink, Loader, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { deleteVideo, getAllVideos, updateVideoTitle } from "@/gatways/video";
import { RenameAlertType, deleteAlertType, recordingsType } from "@/types";
import { Button } from "@/components/ui/button";

import { S3_VIDEOS } from "@/constants";
import Alert from "@/components/Alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DasboardHeader from "@/components/DasboardHeader";

const Library = () => {
  const { toast } = useToast();
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState<deleteAlertType>({
    open: false,
    id: null,
    inProgress: false,
  });
  const [isRenameAlertOpen, setIsRenameAlertOpen] = useState<RenameAlertType>({
    open: false,
    id: null,
    title: null,
    inProgress: false,
  });

  const {
    data,
    error,
    isLoading,
    mutate: refreshData,
  } = useSWR(S3_VIDEOS, getAllVideos, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateIfStale: true,
    revalidateOnMount: true,
    dedupingInterval: 0,
  });

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteClick = (key: string) => {
    setIsDeleteAlertOpen({ open: true, id: key, inProgress: false });
  };

  const handleDeleteVideoConfirm = async () => {
    if (!isDeleteAlertOpen.id) return;
    try {
      setIsDeleteAlertOpen((prev) => ({ ...prev, inProgress: true }));
      await deleteVideo(isDeleteAlertOpen.id);
      await refreshData();
      toast({
        title: "Success",
        description: "Recording deleted successfully",
        className: "bg-[#1E293B] text-white border-gray-800",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete recording",
        variant: "destructive",
      });
    } finally {
      setIsDeleteAlertOpen({ open: false, inProgress: false, id: null });
    }
  };

  const renameVideo = (key: string, currentTitle: string) => {
    setIsRenameAlertOpen({
      open: true,
      id: key,
      title: currentTitle || "",
      inProgress: false,
    });
  };

  const handleRenameVideoConfirm = async () => {
    if (!isRenameAlertOpen.title || !isRenameAlertOpen.id) return;

    try {
      setIsRenameAlertOpen((prev) => ({ ...prev, inProgress: true }));
      const formData = new FormData();
      formData.append("title", isRenameAlertOpen.title);
      await updateVideoTitle(isRenameAlertOpen.id, formData);
      await refreshData();
      toast({
        title: "Success",
        description: "Recording renamed successfully",
        className: "bg-[#1E293B] text-white border-gray-800",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rename recording",
        variant: "destructive",
      });
    } finally {
      setIsRenameAlertOpen({
        open: false,
        title: null,
        id: null,
        inProgress: false,
      });
    }
  };

  const handleCopyClick = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    toast({
      title: "Link Copied!",
      description: "Share URL has been copied to your clipboard",
      className: "bg-[#1E293B] text-white border-gray-800",
    });
  };

  if (error)
    return (
      <div className="text-red-400 p-6">
        Error loading videos. Please try again.
      </div>
    );

  return (
    <div className="p-6 space-y-6 bg-[#0F172A] min-h-screen">
      <DasboardHeader
        title="Your Library"
        descreption="Access and manage all your recordings"
        icon={Camera}
        iconColor="text-purple-400"
        bgColor="bg-purple-500/10"
      />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader className="animate-spin text-purple-400 w-8 h-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.data?.length ? (
            data.data.map((video: recordingsType) => (
              <Card
                key={video.Key}
                className="rounded-xl border border-gray-800 bg-[#1E293B] shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
              >
                <div className="relative pb-[56.25%] rounded-t-xl overflow-hidden bg-black/20">
                  <video
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    src={video.url}
                    controls={false}
                    preload="metadata"
                  ></video>
                </div>
                <CardHeader>
                  <CardTitle className="text-base font-medium text-white truncate">
                    {video?.title?.replaceAll("-", " ")}
                  </CardTitle>
                  <CardDescription>
                    <div className="flex justify-between items-center mt-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                        asChild
                      >
                        <Link href={"/share/" + video?.uuid}>
                          <ExternalLink className="w-4 h-4 mr-2" /> View
                        </Link>
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            handleCopyClick("/share/" + video?.uuid)
                          }
                          className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => renameVideo(video?.uuid, video?.title)}
                          className="h-8 w-8 text-gray-400 hover:text-gray-300 hover:bg-gray-500/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteClick(video?.uuid)}
                          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <div className="bg-[#1E293B] rounded-xl p-8 border border-gray-800">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No Recordings Yet
                </h3>
                <p className="text-gray-400 mb-4">
                  Start recording your screen to see your content here.
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Link href="/">Start Recording →</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <Alert
        open={isDeleteAlertOpen.open}
        title="Delete Recording"
        discription="This action cannot be undone. This recording will be permanently deleted."
        cancleHandler={() =>
          setIsDeleteAlertOpen({ open: false, id: null, inProgress: false })
        }
        confirmHandler={handleDeleteVideoConfirm}
        inProgress={isDeleteAlertOpen.inProgress}
      />

      <Alert
        discription="Choose a memorable name for your recording"
        open={isRenameAlertOpen.open}
        title="Rename Recording"
        cancleHandler={() =>
          setIsRenameAlertOpen({
            open: false,
            title: null,
            id: null,
            inProgress: false,
          })
        }
        confirmHandler={handleRenameVideoConfirm}
        inProgress={isRenameAlertOpen.inProgress}
      >
        <Label htmlFor="video_title" className="block text-gray-300 mb-2">
          New name
        </Label>
        <Input
          id="video_title"
          type="text"
          className="bg-[#1E293B] border-gray-700 text-white"
          placeholder="Enter a new name for your recording"
          onChange={(e) =>
            setIsRenameAlertOpen((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </Alert>
    </div>
  );
};

export default Library;
