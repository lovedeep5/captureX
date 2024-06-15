"use client";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";
import { getVideo } from "@/gatways/video";

const ShareVideo = ({ params: { key } }: { params: { key: string } }) => {
  const { data, isLoading, error } = useSWR("/api/video", () => getVideo(key));

  if (error) {
    return (
      <p className="p-4 text-red-600">Error occured while fetching video</p>
    );
  }

  return (
    <div className="w-screen h-screen mt-[-56px] flex justify-center items-center">
      {isLoading ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        <video src={data?.data?.url} className="w-2/4 rounded-xl" controls />
      )}
    </div>
  );
};

export default ShareVideo;
