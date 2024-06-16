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

  const handleCopyClick = (url : string) => {
    const domain = window?.location?.origin;
    navigator.clipboard.writeText(domain + url)

     toast({
        title: "Success",
        description:
          "Url copied to the cliboard"
        });
  }
 
  if (error) {
    return error;
  }

  return (
    <div className="p-4">
      <DasboardHeader title="Library" descreption="You can find all your videos here" icon={Camera} iconColor="text-violet-500" bgColor="bg-teal-100"/>
     {
      isLoading ? <div className="p-4 text-gray-900">
        <Loader className="animate-spin" />
      </div> : <div>
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 pb-10">
        {data?.data?.length ? (
          data?.data?.map((video: recordingsType) => {
            return (
              <Card
                key={video.Key}
                className="rounded-xl hover:bg-muted/20 transition cursor-pointer overflow-hidden"
              >
                <video
                  className="w-full rounded-t-sm"
                  src={video.url}
                  controls={false}
                ></video>
                <CardHeader>
                  <CardTitle className="text-sm text-center font-medium">
                    {video?.title?.replaceAll("-", " ")}
                  </CardTitle>

                  <CardDescription>
                    <div className="flex gap-1 mt-2 justify-center items-center">
                      <Button variant="gradient" size="rounded" asChild>
                        <Link href={"/share/" + video?.uuid}>
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                      </Button>
                      <Button
                        variant="gradient" size="rounded"
                        onClick={() => handleDeleteClick(video?.uuid)}
                      >
                        <Trash className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="gradient" size="rounded"
                        onClick={() => renameVideo(video?.uuid)}
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="gradient" size="rounded"
                        onClick={() => handleCopyClick("/share/" + video?.uuid)}
                      >
                        <Copy className="w-5 h-5" />
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
     }
    </div>
  );
};

export default Library;
