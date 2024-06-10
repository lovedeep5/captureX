"use client";
import React, { useEffect, useState } from "react";
import useGetSharedLink from "@/lib/hooks/useGetSharedLink";

const ShareVideo = ({ params: { key } }: { params: { key: string } }) => {
  const { isVideoLoading, video } = useGetSharedLink(key);

  return (
    <div>
      {video && <video src={video} className="w-full h-full" controls />}
    </div>
  );
};

export default ShareVideo;
