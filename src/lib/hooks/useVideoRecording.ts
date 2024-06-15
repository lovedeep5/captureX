import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { setRecording } from "@/lib/features/recordingSlice";
import { uploadFile } from "@/helpers";

import { useVideoRecordingType } from "@/types";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export const useVideoRecording = (): useVideoRecordingType => {
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null); // New ref for MediaRecorder
  const router = useRouter();
  const [isRecordingPaused, setIsRecordingPaused] = useState<boolean>(false);

  const { isRecording } = useAppSelector((state) => state?.recording);

  const dispatch = useAppDispatch();

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

      recorder.onstop = async () => {
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
        const uploadFileResponse = await uploadFile(blob);
        router.push(`/share/${uploadFileResponse?.uuid}`);
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

  return {
    isRecording,
    isRecordingPaused,
    startRecording,
    pauseRecording,
    stopRecording,
  };
};
