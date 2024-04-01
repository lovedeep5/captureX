"use client";
import React, { useState, useRef } from "react";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setRecording } from "@/lib/features/recordingSlice";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RecordButton: React.FC = () => {
  const streamRef = useRef<MediaStream | null>(null);
  const dispatch = useAppDispatch();
  const { isRecording } = useAppSelector((state) => state?.recording);

  const startRecording = async () => {
    dispatch(setRecording(true));

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = url;
        a.download = "screen-recording.webm";
        a.click();

        window.URL.revokeObjectURL(url);
        dispatch(setRecording(false));
      };

      recorder.start();
      dispatch(setRecording(true));
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  return (
    <div>
      <Button
        variant={isRecording ? "destructive" : "primary"}
        size="lg"
        className={cn("relative")}
        onClick={startRecording}
        disabled={isRecording}
      >
        {isRecording ? "Recording..." : "Start Recording"}
      </Button>
    </div>
  );
};

export default RecordButton;
