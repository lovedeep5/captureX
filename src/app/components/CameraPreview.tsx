import { useEffect, useRef } from "react";
import { Rnd } from "react-rnd";

interface CameraPreviewProps {
  stream: MediaStream | null;
  isRecording: boolean;
}

export function CameraPreview({ stream, isRecording }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) return null;

  return (
    <Rnd
      default={{
        x: window.innerWidth - 320,
        y: window.innerHeight - 240,
        width: 280,
        height: 210,
      }}
      minWidth={160}
      minHeight={120}
      bounds="window"
      lockAspectRatio={4/3}
      className={`rounded-xl overflow-hidden shadow-2xl transition-opacity duration-200 ${
        isRecording ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{
        border: "2px solid rgba(255, 255, 255, 0.1)",
        background: "#000",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
    </Rnd>
  );
} 