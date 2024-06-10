"use client";
import { getVideo } from "@/gatways/video";
import { videoUrl } from "@/types";
import { useState, useEffect } from "react";

const useGetSharedLink = (key: string) => {
  const [video, setVideo] = useState<string>("");
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  useEffect(() => {
    const getFile = async () => {
      if (!key) return;
      setIsVideoLoading(true);
      const request = await getVideo(key);
      if (request.status === 200) {
        setVideo(request?.data?.url);
        setIsVideoLoading(false);
        return;
      }
      setIsVideoLoading(false);
    };
    getFile();
  }, [key]);

  return { video, isVideoLoading };
};

export default useGetSharedLink;
