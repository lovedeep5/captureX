"use client";
import { Button } from "@/components/ui/button";
import { uploadVideoChunk } from "@/gatways/video";
import React, { useRef } from "react";

const StartRecordingPage = () => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const userMediaStream = useRef<MediaStream | null>(null);
  const recording_id = useRef<string | null>(null);

  const startRecording = async () => {
    if (recording_id) {
      recording_id.current = crypto.randomUUID();
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: { ideal: 48000, min: 44100 },
      },
    });

    mediaRecorder.current = new MediaRecorder(stream, {
      mimeType: "video/webm; codecs=vp8,opus",
    });

    userMediaStream.current = stream;
    mediaRecorder.current.start(4000);

    mediaRecorder.current.ondataavailable = async (e) => {
      if (e.data.size > 0) {
        console.log("Chunk", e.data);

        const formData = new FormData();
        formData.append("video", e.data, "video.webm");
        formData.append("recording_id", recording_id.current!);
        formData.append("event", "upload_chunk");

        await uploadVideoChunk(formData);
      }
    };

    mediaRecorder.current.onstop = async () => {
      const formData = new FormData();
      formData.append("recording_id", recording_id.current!);
      formData.append("event", "end_recording");
      await uploadVideoChunk(formData);
    };

    mediaRecorder.current.onstart = async () => {
      const formData = new FormData();
      formData.append("recording_id", recording_id.current!);
      formData.append("event", "start_recording");
      await uploadVideoChunk(formData);
    };
  };

  const stopRecording = async () => {
    mediaRecorder.current?.stop();
    userMediaStream.current?.getTracks().forEach((track) => track.stop());
  };

  return (
    <div>
      <Button onClick={startRecording}>Start Recording</Button>
      <Button onClick={stopRecording}>Stop Recording</Button>
    </div>
  );
};

export default StartRecordingPage;
