"use client"; // Mark as Client Component

import { useState, useRef, useEffect, useCallback } from "react";
import useRecorder from "@/hooks/recorder"; // Custom hook
import { Button } from "@/components/ui/button"; // shadcn Button
import { openSocket, closeSocket } from "@/lib/socket/sockets";
import close from "@/lib/socket/close";
import open from "@/lib/socket/open";
import error from "@/lib/socket/error";
import send from "@/lib/socket/send";

const RecorderComponent = () => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);

  const { start, stop, pause, resume, blobURL, cameraStream } = useRecorder({
    onChunkAvailable: async (chunk, socket) => {
      console.log("New chunk available:", chunk);
      const arrayBuffer = await chunk.arrayBuffer();
      if (socket) {
        send(socket, arrayBuffer);
      }
    },
    onStartCallback: openSocket,
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  // Update video source when blobURL changes
  useEffect(() => {
    if (videoRef.current && blobURL) {
      videoRef.current.src = blobURL;
    }
  }, [blobURL]);

  return (
    <div className="p-4 space-y-4">
      {/* Media Selection Checkboxes */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={cameraEnabled}
            onChange={(e) => setCameraEnabled(e.target.checked)}
            className="w-4 h-4"
          />
          <span>Enable Camera</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={micEnabled}
            onChange={(e) => setMicEnabled(e.target.checked)}
            className="w-4 h-4"
          />
          <span>Enable Microphone</span>
        </label>
      </div>

      {/* Recording Controls */}
      <div className="flex space-x-2">
        <Button
          onClick={() => start({ camera: cameraEnabled, mic: micEnabled })}
        >
          Start
        </Button>
        <Button onClick={stop} variant="destructive">
          Stop
        </Button>
        <Button onClick={pause} variant="secondary">
          Pause
        </Button>
        <Button onClick={resume} variant="secondary">
          Resume
        </Button>
      </div>

      {/* Display Screen + Mic Recording */}
      {blobURL && (
        <video
          ref={videoRef}
          controls
          className="w-full max-w-2xl rounded-lg shadow-md"
        />
      )}

      {/* Display Camera Feed (if enabled) */}
      {cameraStream && (
        <video
          ref={(video) => {
            if (video) video.srcObject = cameraStream;
          }}
          autoPlay
          muted
          className="w-48 h-36 rounded-full shadow-md fixed bottom-4 right-4 border-2 border-gray-200"
        />
      )}
    </div>
  );
};

export default RecorderComponent;
