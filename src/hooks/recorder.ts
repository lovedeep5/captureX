"use client"; // Mark as Client Component

import { useState, useCallback, useEffect, useRef } from "react";

type UseRecorderProps = {
  onChunkAvailable: (chunk: Blob) => void;
  onStartCallback?: () => WebSocket;
};

type UseRecorderReturn = {
  start: (options: { camera: boolean; mic: boolean }) => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  blobURL: string | null; // For screen + mic stream
  cameraStream: MediaStream | null; // For camera feed (if enabled)
  socketRef: WebSocket | null;
};

const useRecorder = ({
  onChunkAvailable,
  onStartCallback,
}: UseRecorderProps): UseRecorderReturn => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [blobURL, setBlobURL] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]); // Store chunks for final video
  const socketRef = useRef<WebSocket | null>(null);
  const start = useCallback(
    async (options: { camera: boolean; mic: boolean }) => {
      try {
        // Step 1: Get screen stream
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: options.mic, // Include mic if selected
        });

        // Step 2: Get camera stream (if enabled)
        let cameraStream: MediaStream | null = null;
        if (options.camera) {
          cameraStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false, // Camera mic is not included
          });
          setCameraStream(cameraStream);
        }

        // Step 3: Combine screen and mic streams (if mic is enabled)
        const streamsToRecord = [screenStream];
        if (options.mic) {
          const micStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          streamsToRecord.push(micStream);
        }

        const combinedStream = new MediaStream([
          ...streamsToRecord.flatMap((stream) => stream.getTracks()),
        ]);

        // Step 4: Initialize MediaRecorder for screen + mic stream
        const recorder = new MediaRecorder(combinedStream, {
          mimeType: "video/webm; codecs=vp9",
        });

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data); // Store chunks
            if (onChunkAvailable) {
              onChunkAvailable(event.data); // Notify parent component
            }
          }
        };
        if (onStartCallback) {
          const ws = onStartCallback();
          socketRef.current = ws;
        }

        recorder.onstop = () => {
          // Create a final blob from all chunks
          const finalBlob = new Blob(chunksRef.current, { type: "video/webm" });
          setBlobURL(URL.createObjectURL(finalBlob)); // Set final blob URL
          chunksRef.current = []; // Clear chunks

          // Clean up resources
          screenStream.getTracks().forEach((track) => track.stop());
          if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
          }
          combinedStream.getTracks().forEach((track) => track.stop());

          //Cleanup
          if (socketRef?.current) {
            socketRef.current = null;
          }
        };

        recorder.start(1000); // Emit a chunk every second
        setMediaRecorder(recorder);
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    },
    [onChunkAvailable, onStartCallback]
  );

  const stop = useCallback(() => {
    if (mediaRecorder) {
      mediaRecorder.stop(); // This will trigger the onstop event
      //Cleanup
      if (socketRef?.current) {
        socketRef.current = null;
      }
    }
  }, [mediaRecorder]);

  const pause = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.pause();
    }
  }, [mediaRecorder]);

  const resume = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === "paused") {
      mediaRecorder.resume();
    }
  }, [mediaRecorder]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stop(); // Stop recording on unmount
      }
    };
  }, [mediaRecorder]);

  return {
    start,
    stop,
    pause,
    resume,
    blobURL,
    cameraStream,
    socketRef: socketRef?.current,
  };
};

export default useRecorder;
