import { useState, useRef, useEffect } from "react";

interface UseCameraProps {
  onCameraStop?: () => void;
}

export const useCamera = ({ onCameraStop }: UseCameraProps = {}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState(() => ({
    x: 20,
    y: window.innerHeight - 100,
  }));
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const cleanup = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      cameraStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const setupCamera = async () => {
    try {
      cleanup();

      if (isEnabled && !isMinimized) {
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
        });

        // Add stop handler
        cameraStream.getVideoTracks().forEach((track) => {
          track.onended = () => {
            setIsEnabled(false);
            onCameraStop?.();
          };
        });

        cameraStreamRef.current = cameraStream;
        if (videoRef.current) {
          videoRef.current.srcObject = cameraStream;
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setIsEnabled(false);
    }
  };

  useEffect(() => {
    setupCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled, isMinimized]);

  const toggle = () => {
    setIsEnabled(!isEnabled);
    if (!isEnabled) {
      setIsMinimized(false);
    }
  };

  const minimize = () => {
    setIsMinimized(true);
    cleanup();
  };

  const maximize = () => {
    setIsMinimized(false);
  };

  const getCameraStream = async () => {
    if (!cameraStreamRef.current) {
      await setupCamera();
    }
    return cameraStreamRef.current;
  };

  return {
    isEnabled,
    isMinimized,
    position,
    setPosition,
    videoRef,
    toggle,
    minimize,
    maximize,
    cleanup,
    getCameraStream,
  };
};
