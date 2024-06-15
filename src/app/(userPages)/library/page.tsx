"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import { Edit, ExternalLink, Trash } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { deleteVideo, getAllVideos, updateVideoTitle } from "@/gatways/video";
import { deleteAlertType, recordingsType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { S3_VIDEOS } from "@/constants";
import { rename } from "fs";

const Library = () => {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState<deleteAlertType>({
    open: false,
    id: null,
    inProgress: false,
  });

  const { data, error, isLoading } = useSWR(S3_VIDEOS, getAllVideos);

  const handleDeleteClick = (key: string) => {
    setIsDeleteAlertOpen((prev) => ({ ...prev, open: true, id: key }));
  };

  const handleDeleteVideoConfirm = async () => {
    if (!isDeleteAlertOpen.open || !isDeleteAlertOpen.id) {
      return;
    }

    setIsDeleteAlertOpen((prev) => ({ ...prev, inProgress: true }));

    await deleteVideo(isDeleteAlertOpen.id);

    mutate(S3_VIDEOS);

    setIsDeleteAlertOpen((prev) => ({
      open: false,
      inProgress: false,
      id: null,
    }));
  };

  const handleDeleteAlertCancle = () => {
    setIsDeleteAlertOpen({ open: false, id: null, inProgress: false });
  };

  const renameVideo = async (key: string, title: string) => {
    if (!key || !title) return;
    const formData = new FormData();
    formData.append("title", title);

    const response = await updateVideoTitle(key, formData);
    mutate(S3_VIDEOS);
  };

  if (isLoading) {
    return <p className="p-4 text-gray-900">Loading...</p>;
  }

  if (error) {
    return error;
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 pb-10">
        {data?.data?.length ? (
          data?.data?.map((video: recordingsType) => {
            return (
              <Card
                key={video.Key}
                className="rounded-sm hover:bg-muted/20 transition cursor-pointer"
              >
                <video
                  className="w-full rounded-t-sm"
                  src={video.url}
                  controls={false}
                ></video>
                <CardHeader>
                  <CardTitle className="text-md ">
                    {video?.title?.replaceAll("-", " ")}
                  </CardTitle>

                  <CardDescription>
                    <div className="flex gap-2 mt-5">
                      <Button variant="primary" asChild>
                        <Link href={"/share/" + video?.uuid}>
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => handleDeleteClick(video?.uuid)}
                      >
                        <Trash className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => renameVideo(video?.uuid, "name 123")}
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })
        ) : (
          <p className="text-sm">No Recordings found...</p>
        )}
      </div>
      <AlertDialog open={isDeleteAlertOpen?.open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle> ❌ Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this video? This action cannot be
              undone. Your video will be permanently removed from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteAlertCancle}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVideoConfirm}
              disabled={isDeleteAlertOpen?.inProgress}
            >
              {isDeleteAlertOpen?.inProgress ? "In Progresss" : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Library;
