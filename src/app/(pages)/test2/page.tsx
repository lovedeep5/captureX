"use client";
import { useRef, useState } from "react";
import useRecorder from "@/hooks/recorder";
import { Button } from "@/components/ui/button";
import VideoJS from "@/components/VideoPlayer";

const videoJsOptions = {
  autoplay: true,
  controls: true,
  responsive: true,
  fluid: true,
  sources: [
    {
      src: "https://capturex-local.s3.ap-southeast-2.amazonaws.com/videos/hsl/user_2dbSjatI0Ge1iqsViDIuskdWCxY_1738150174888_h2q5j/playlist.m3u8",
      type: "application/mpegURL",
    },
  ],
};

const TestPage = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { startRecording, stopRecording, pauseRecording, resumeRecording } =
    useRecorder({
      onStreamDataAvailable: async (event: BlobEvent) => {
        if (event.data.size > 0) {
          try {
            console.log("Video Chunk Ready:", event.data);
            const arrayBuffer = await event.data.arrayBuffer();
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(arrayBuffer);
            } else {
              console.warn("WebSocket is not open, chunk not sent");
            }
          } catch (error) {
            console.error("Error sending video chunk:", error);
          }
        }
      },
      onStreamStop: () => {
        closeSocketConnection();
      },
    });

  const openSocketConnection = () => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("Connected to WebSocket");

      // socket.send(JSON.stringify({ message: "Recording started" }));
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    wsRef.current = socket;
    setWs(socket);
  };

  const closeSocketConnection = () => {
    setTimeout(() => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    }, 5000);
  };

  const handleStartRecording = () => {
    openSocketConnection();
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
    closeSocketConnection();
  };

  return (
    <div>
      <div>Videos</div>
      {/* <VideoJS options={videoJsOptions} ready={() => {}} /> */}
      <VideoJS options={videoJsOptions} ready={() => {}} />
      <div className="flex gap-4">
        <Button onClick={handleStartRecording}>Record</Button>
        <Button onClick={handleStopRecording}>Stop</Button>
        <Button onClick={pauseRecording}>Pause</Button>
        <Button onClick={resumeRecording}>Resume</Button>
      </div>
    </div>
  );
};

export default TestPage;
