"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { getVideo } from "@/gatways/video";
import { videoUrl } from "@/types";

const ShareVideo = ({ params: { key } }: { params: { key: string } }) => {
  const { userId } = useAuth();
  const [video, setVideo] = useState<videoUrl>();

  useEffect(() => {
    const getFile = async () => {
      if (!userId || !key) return;
      const request = await getVideo(`${userId}/${key}.webm`);
      if (request.status === 200) {
        setVideo(request?.data?.url);
      }
    };
    getFile();
  }, [userId, key]);

  return (
    <div>
      {video && <video src={video} className="w-full h-full" controls />}
    </div>
  );
};

export default ShareVideo;
