"use client";
import React, { useState, useRef } from "react";
import { Pause, Play, StopCircle } from "lucide-react";
import axios from "axios";

import { cn } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";

import { setRecording } from "@/lib/features/recordingSlice";
import { Button } from "@/components/ui/button";

const RecordingPanel: React.FC = () => {
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null); // New ref for MediaRecorder

  const [isRecordingPaused, setIsRecordingPaused] = useState<boolean>(false);
  const { isRecording } = useAppSelector((state) => state?.recording);

  const dispatch = useAppDispatch();

  async function uploadFile(blob: Blob) {
    const file = new File([blob], `screen-recording-${Date.now()}.webm`, {
      type: "video/webm",
    });
    const apiUrl = "/api/videos";
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(apiUrl, formData);
      console.log("Video uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading Video:", error);
    }
  }

  const startRecording = async () => {
    if (isRecordingPaused) {
      pauseRecording();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      dispatch(setRecording(true));

      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder; // Store the recorder instance

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
        a.download = `screen-recording-${Date.now()}.webm`;
        a.click();

        window.URL.revokeObjectURL(url);
        dispatch(setRecording(false));
        uploadFile(blob);
      };

      recorder.start();
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      dispatch(setRecording(false));
    }
  };

  const pauseRecording = () => {
    if (recorderRef.current) {
      if (recorderRef.current.state === "paused") {
        recorderRef.current.resume();
        setIsRecordingPaused(false);
        return;
      }
      // In Case Recording is already in progress
      recorderRef.current.pause();
      setIsRecordingPaused(true);
      return;
    }
  };

  return (
    <div className="flex p-2 rounded-lg fixed z-[100] bottom-20 right-5 bg-primary">
      <Button
        variant="primary"
        size="sm"
        onClick={startRecording}
        className={cn("text-transparent", {
          hidden: isRecording && !isRecordingPaused,
        })}
      >
        <Play className="fill-white" />
      </Button>

      <Button
        variant="primary"
        size="sm"
        onClick={pauseRecording}
        className={cn("text-transparent", {
          hidden: !isRecording || isRecordingPaused,
        })}
      >
        <Pause className="fill-green-500" />
      </Button>

      <Button
        variant="primary"
        size="sm"
        onClick={stopRecording}
        className={cn("text-transparent", {
          hidden: !isRecording,
          "animate-pulse": !isRecordingPaused,
        })}
      >
        <StopCircle className="fill-red-500" />
      </Button>
    </div>
  );
};

export default RecordingPanel;
