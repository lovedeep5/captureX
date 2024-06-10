"use client";
import React, { useEffect, useState } from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

import { useVideoRecording } from "@/lib/hooks/useVideoRecording";

import { REGEX_VIDEO_NAME_FROM_S3_KEY } from "@/constants";
import { getStringByPatren } from "@/helpers";

const Library = () => {
  const { recordings } = useVideoRecording();

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 pb-10">
        {recordings?.length ? (
          recordings?.map((video) => {
            return (
              <Link key={video.Key} href={"/share/" + video?.uuid}>
                <Card className="rounded-sm hover:bg-muted/20 transition cursor-pointer">
                  <video
                    className="w-full rounded-t-sm"
                    src={video.url}
                    controls
                  ></video>
                  <CardHeader>
                    <CardTitle className="text-md">
                      {video?.Key?.split("/")[1]?.split(".")[0]}
                    </CardTitle>

                    <CardDescription>
                      <p>Card Description</p>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })
        ) : (
          <p className="text-sm">No Recordings found...</p>
        )}
      </div>
    </div>
  );
};

export default Library;
