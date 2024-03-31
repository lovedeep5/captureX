"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RecordButton: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startRecording = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      setStream(stream);

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
        setStream(null);
        setIsRecording(false);
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div>
      {/* Button if recording already started */}
      <Button
        variant="destructive"
        size="lg"
        className={cn("relative", { hidden: !isRecording })}
        onClick={stopRecording}
      >
        Stop Recording
      </Button>
      {/* Button if recording yet to start */}
      <Button
        variant="primary"
        size="lg"
        className={cn("relative", { hidden: isRecording })}
        onClick={startRecording}
      >
        Start Recording
      </Button>
    </div>
  );
};

export default RecordButton;
