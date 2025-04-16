import { useState, useRef, useEffect } from "react";
import { uploadVideoChunk } from "@/gatways/video";

interface UseRecorderProps {
  onRecordingStop?: () => void;
}

export type RecordingState = "initial" | "options" | "recording" | "paused";

export const useRecorder = ({ onRecordingStop }: UseRecorderProps = {}) => {
  const [state, setState] = useState<RecordingState>("initial");
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isScreenEnabled, setIsScreenEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [availableDevices, setAvailableDevices] = useState<{
    audioInputs: MediaDeviceInfo[];
    videoInputs: MediaDeviceInfo[];
  }>({ audioInputs: [], videoInputs: [] });
  const [selectedDevices, setSelectedDevices] = useState<{
    audioInput?: string;
    videoInput?: string;
  }>({});

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const combinedStreamRef = useRef<MediaStream | null>(null);
  const recording_id = useRef<string | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Load devices after permissions are granted
  const loadDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const audioInputs = devices.filter(
        (device) => device.kind === "audioinput"
      );
      const videoInputs = devices.filter(
        (device) => device.kind === "videoinput"
      );

      setAvailableDevices({ audioInputs, videoInputs });

      // Set default devices
      if (audioInputs.length > 0) {
        setSelectedDevices((prev) => ({
          ...prev,
          audioInput: audioInputs[0].deviceId,
        }));
      }
      if (videoInputs.length > 0) {
        setSelectedDevices((prev) => ({
          ...prev,
          videoInput: videoInputs[0].deviceId,
        }));
      }
    } catch (err) {
      console.error("Error loading devices:", err);
    }
  };

  const cleanup = () => {
    // Stop and cleanup screen stream
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      screenStreamRef.current = null;
    }

    // Stop and cleanup camera stream
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      cameraStreamRef.current = null;
    }

    // Stop and cleanup audio stream
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      audioStreamRef.current = null;
    }

    // Stop and cleanup combined stream
    if (combinedStreamRef.current) {
      combinedStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      combinedStreamRef.current = null;
    }

    // Clear recording timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Reset recording chunks
    chunksRef.current = [];
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // Handle countdown timer and recording start
  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdown === 0) {
      setShowCountdown(false);
      handleStartRecording();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCountdown, countdown]);

  // Handle recording timer
  useEffect(() => {
    if (state === "recording" && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state, isPaused]);

  const resetToInitial = () => {
    cleanup();
    setIsMicEnabled(true);
    setIsScreenEnabled(true);
    setIsCameraEnabled(false);
    setIsPaused(false);
    setRecordingTime(0);
    setState("initial");
    onRecordingStop?.();
  };

  const beginRecording = () => {
    setCountdown(3);
    setShowCountdown(true);
  };

  const handleStartRecording = async () => {
    try {
      if (state === "recording") return;

      // Request permissions first
      const constraints = {
        audio: isMicEnabled ? { deviceId: selectedDevices.audioInput } : false,
        video: isCameraEnabled
          ? { deviceId: selectedDevices.videoInput }
          : false,
      };

      // Only request permissions for enabled devices
      if (isMicEnabled || isCameraEnabled) {
        await navigator.mediaDevices.getUserMedia(constraints);
        await loadDevices();
      }

      // Start screen capture if enabled
      if (isScreenEnabled) {
        screenStreamRef.current = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
      }

      // Start camera if enabled
      if (isCameraEnabled) {
        cameraStreamRef.current = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: selectedDevices.videoInput },
        });
      }

      // Start audio if enabled
      if (isMicEnabled) {
        audioStreamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: selectedDevices.audioInput },
        });
      }

      // Create combined stream
      const tracks: MediaStreamTrack[] = [];
      if (screenStreamRef.current) {
        tracks.push(...screenStreamRef.current.getVideoTracks());
      }
      if (cameraStreamRef.current) {
        tracks.push(...cameraStreamRef.current.getVideoTracks());
      }
      if (audioStreamRef.current) {
        tracks.push(...audioStreamRef.current.getAudioTracks());
      }

      combinedStreamRef.current = new MediaStream(tracks);

      // Set up MediaRecorder with combined stream
      const mediaRecorder = new MediaRecorder(combinedStreamRef.current, {
        mimeType: "video/webm;codecs=vp9",
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Generate a unique recording ID
      recording_id.current = Date.now().toString();

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          // Upload the chunk
          try {
            const chunk = new Blob([event.data], { type: "video/webm" });
            const formData = new FormData();
            formData.append("chunk", chunk);
            await uploadVideoChunk(formData);
          } catch (error) {
            console.error("Error uploading video chunk:", error);
          }
        }
      };

      mediaRecorder.onstart = () => {
        setState("recording");
        setRecordingTime(0);
      };

      mediaRecorder.onstop = () => {
        cleanup();
        resetToInitial();
      };

      // Start recording
      mediaRecorder.start(1000); // Capture chunks every second
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Failed to start recording. Please check your permissions.");
      resetToInitial();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const togglePause = () => {
    if (!mediaRecorderRef.current || state !== "recording") return;

    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      setState("recording");
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      setState("paused");
    }
  };

  return {
    state,
    setState,
    isMicEnabled,
    setIsMicEnabled,
    isScreenEnabled,
    setIsScreenEnabled,
    isCameraEnabled,
    setIsCameraEnabled,
    isPaused,
    recordingTime,
    showCountdown,
    countdown,
    availableDevices,
    selectedDevices,
    setSelectedDevices,
    beginRecording,
    stopRecording,
    togglePause,
  };
};
