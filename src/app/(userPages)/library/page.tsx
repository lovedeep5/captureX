"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import { Edit, ExternalLink, Loader, Trash } from "lucide-react";

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

const Library = () => {
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

  const renameVideo = async (key: string) => {
    if (!key) return;
    setIsRenameAlertOpen((prev) => ({
      ...prev,
      open: true,
      id: key,
    }));
  };

  const handleRenameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsRenameAlertOpen((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  const handleRenameVideoCancle = () => {
    setIsRenameAlertOpen({
      open: false,
      title: null,
      id: null,
      inProgress: false,
    });
  };

  const handleRenameVideoConfirm = async () => {
    if (!isRenameAlertOpen.title || !isRenameAlertOpen.id) {
      return;
    }
    setIsRenameAlertOpen((prev) => ({
      ...prev,
      inProgress: true,
    }));
    const formData = new FormData();
    formData.append("title", isRenameAlertOpen.title);

    const response = await updateVideoTitle(isRenameAlertOpen.id, formData);
    mutate(S3_VIDEOS);
    setIsRenameAlertOpen({
      open: false,
      title: null,
      id: null,
      inProgress: false,
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 text-gray-900">
        <Loader className="animate-spin" />
      </div>
    );
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
                        onClick={() => renameVideo(video?.uuid)}
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
      <Alert
        open={isDeleteAlertOpen.open}
        title="❌ Are you absolutely sure?"
        discription="This action cannot be undone. Your video will be permanently
        removed from our servers."
        cancleHandler={handleDeleteAlertCancle}
        confirmHandler={handleDeleteVideoConfirm}
        inProgress={isDeleteAlertOpen?.inProgress}
      />
      <Alert
        open={isRenameAlertOpen.open}
        title=" ✏️ Want to rename your video?"
        discription=""
        cancleHandler={handleRenameVideoCancle}
        confirmHandler={handleRenameVideoConfirm}
        inProgress={isRenameAlertOpen?.inProgress}
      >
        <div>
          <Label
            htmlFor="video_title"
            className="text-sm text-muted-foreground"
          >
            Enter new name and press continue
          </Label>
          <Input
            type="text"
            name="video_title"
            id="video_title"
            onChange={handleRenameInputChange}
          />
        </div>
      </Alert>
    </div>
  );
};

export default Library;
