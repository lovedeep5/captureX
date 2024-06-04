"use client";
import React, { useEffect, useState } from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";

interface recordingsType {
  Key: string;
  url: string;
}

const Library = () => {
  const [recordings, setRecordings] = useState<recordingsType[]>([]);
  useState(() => {
    const getRecordings = async () => {
      const request = await axios.get("/api/videos");
      if (request.status === 200) {
        setRecordings(request?.data);
      }
    };
    getRecordings();
  }, []);
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 pb-10">
        {recordings?.length ? (
          recordings?.map((video) => (
            <Card
              className="rounded-sm hover:bg-muted/20 transition cursor-pointer"
              key={video.Key}
            >
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
          ))
        ) : (
          <p className="text-sm">No Recordings found...</p>
        )}
      </div>
    </div>
  );
};

export default Library;
