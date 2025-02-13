"use client";
import { ChangeEvent, useState } from "react";
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

  const { data, error, isLoading } = useSWR(S3_VIDEOS, getAllVideos);

  const handleDeleteClick = (key: string) => {
    setIsDeleteAlertOpen({ open: true, id: key, inProgress: false });
  };

  const handleDeleteVideoConfirm = async () => {
    if (!isDeleteAlertOpen.id) return;
    setIsDeleteAlertOpen((prev) => ({ ...prev, inProgress: true }));
    await deleteVideo(isDeleteAlertOpen.id);
    mutate(S3_VIDEOS);
    setIsDeleteAlertOpen({ open: false, inProgress: false, id: null });
  };

  const renameVideo = (key: string) => {
    setIsRenameAlertOpen({ open: true, id: key, title: "", inProgress: false });
  };

  const handleRenameVideoConfirm = async () => {
    if (!isRenameAlertOpen.title || !isRenameAlertOpen.id) return;

    setIsRenameAlertOpen((prev) => ({ ...prev, inProgress: true }));

    const formData = new FormData();
    formData.append("title", isRenameAlertOpen.title);

    await updateVideoTitle(isRenameAlertOpen.id, formData);

    mutate(S3_VIDEOS);
    setIsRenameAlertOpen({
      open: false,
      title: null,
      id: null,
      inProgress: false,
    });
  };

  const handleCopyClick = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    toast({ title: "Success", description: "URL copied to clipboard" });
  };

  if (error) return error;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <DasboardHeader
        title="Library"
        descreption="Find all your videos here"
        icon={Camera}
        iconColor="text-violet-500"
        bgColor="bg-teal-100"
      />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader className="animate-spin text-gray-700" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.data?.length ? (
            data.data.map((video: recordingsType) => (
              <Card
                key={video.Key}
                className="rounded-lg shadow-md bg-white transition hover:shadow-lg"
              >
                <video
                  className="w-full rounded-t-lg"
                  src={video.url}
                  controls={false}
                ></video>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-semibold text-center text-gray-900 truncate">
                    {video?.title?.replaceAll("-", " ")}
                  </CardTitle>
                  <CardDescription>
                    <div className="flex justify-center gap-3 mt-4">
                      <Button size="icon" variant="ghost" asChild>
                        <Link href={"/share/" + video?.uuid}>
                          <ExternalLink className="w-5 h-5 text-blue-600" />
                        </Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteClick(video?.uuid)}
                      >
                        <Trash className="w-5 h-5 text-red-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => renameVideo(video?.uuid)}
                      >
                        <Edit className="w-5 h-5 text-gray-700" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleCopyClick("/share/" + video?.uuid)}
                      >
                        <Copy className="w-5 h-5 text-green-600" />
                      </Button>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-600">No Recordings found...</p>
          )}
        </div>
      )}

      <Alert
        open={isDeleteAlertOpen.open}
        title="Are you sure?"
        discription="This action cannot be undone. Your video will be permanently removed."
        cancleHandler={() =>
          setIsDeleteAlertOpen({ open: false, id: null, inProgress: false })
        }
        confirmHandler={handleDeleteVideoConfirm}
        inProgress={isDeleteAlertOpen.inProgress}
      />

      <Alert
        discription="Name whatever you think is best for this video."
        open={isRenameAlertOpen.open}
        title="Rename Video"
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
        <Label htmlFor="video_title" className="block text-gray-700 mb-2">
          Enter new name
        </Label>
        <Input
          id="video_title"
          type="text"
          onChange={(e) =>
            setIsRenameAlertOpen((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </Alert>
    </div>
  );
};

export default Library;
