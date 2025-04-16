"use client";

import React from "react";

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer = ({ url }: VideoPlayerProps) => {
  return (
    <div className="relative w-full aspect-video bg-black/20 rounded-xl overflow-hidden">
      <video src={url} className="w-full h-full" controls playsInline />
    </div>
  );
};

export default VideoPlayer;
