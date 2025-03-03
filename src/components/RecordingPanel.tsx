"use client";

import { useEffect, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder-2";
import Draggable from "react-draggable";
import { useRouter } from "next/navigation";
import { Mic, Pause, Play, StopCircle, Video, Monitor } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import { uploadVideo } from "@/gatways/video";
import useTimer from "@/hooks/timer";

const RecordingPanel: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordOptions, setRecordOptions] = useState({
    screen: true,
    audio: true,
    frontCamera: false,
  });

  const cameraStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<number>(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { userId } = useAuth();
  const { toast } = useToast();
  const { timer, startTimer, stopTimer, pauseTimer } = useTimer();

  const {
    status,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    isAudioMuted,
  } = useReactMediaRecorder({
    onStart: () => {
      startTimer();
      timerRef.current = timer;
    },
    video: recordOptions.screen,
    screen: recordOptions.screen,
    audio: recordOptions.audio
      ? {
          noiseSuppression: true,
          echoCancellation: true,
          autoGainControl: true,
        }
      : false,
    blobPropertyBag: { type: "video/webm;codecs=vp9" },
    onStop: async (url, blob) => {
      stopTimer();
      timerRef.current = 0;
      const file = new File([blob], `screen-recording-${Date.now()}.webm`, {
        type: "video/webm",
      });
      const formData = new FormData();
      formData.append("file", file);

      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
        cameraStreamRef.current = null;
      }

      setRecordOptions((prev) => ({ ...prev, frontCamera: false }));

      try {
        const response = await uploadVideo(formData);
        if (response.status === 200) {
          router.push(`/share/${response?.data?.uuid}`);
        }
      } catch (error) {
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = url;
        a.download = `screen-recording-${Date.now()}.webm`;
        a.click();
      }
    },
  });

  useEffect(() => {
    if (recordOptions.frontCamera && !cameraStreamRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          cameraStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          toast({
            title: "Camera Error",
            description: "Unable to access the front camera.",
          });
        });
    } else if (!recordOptions.frontCamera && cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordOptions.frontCamera]);

  const handleStartRecording = () => {
    if (!userId) {
      toast({
        title: "📹 Record and Share Your Video!",
        description: "Please log in to start recording and sharing videos.",
        action: (
          <ToastAction altText="Login">
            <Link href="/sign-in">Login</Link>
          </ToastAction>
        ),
      });
      return;
    }
    setIsModalOpen(true);
  };

  const confirmRecordingOptions = (options: {
    screen: boolean;
    audio: boolean;
    frontCamera: boolean;
  }) => {
    setRecordOptions(options);
    setIsModalOpen(false);
    startRecording();
  };

  const handlerPauseRecording = () => {
    pauseRecording();
    pauseTimer();
  };

  const handleResmeRecording = () => {
    resumeRecording();
    startTimer();
  };
  return (
    <>
      <Draggable bounds="#dragable-bounds">
        <div
          ref={panelRef}
          className="flex items-center p-2 rounded-lg fixed z-[100] bottom-20 right-5 bg-primary cursor-move"
        >
          {recordOptions.frontCamera && (
            <div className="absolute left-[-100px]">
              <div className="w-[100px] h-[100px] rounded-full border-2 border-white overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              </div>
            </div>
          )}

          {recordOptions.audio && (
            <span
              className={`mr-2 ${
                isAudioMuted ? "text-red-500" : "text-green-500"
              }`}
            >
              {isAudioMuted ? "Audio Off" : "Audio On"} <br />
              {timer > 0
                ? `${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(
                    timer % 60
                  ).padStart(2, "0")}`
                : `00:00`}
            </span>
          )}

          {status !== "recording" && status !== "paused" && (
            <Button variant="primary" size="sm" onClick={handleStartRecording}>
              <Play className="fill-white" />
            </Button>
          )}
          {status === "recording" && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={handlerPauseRecording}
              >
                <Pause className="fill-green-500" />
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={stopRecording}
                className="animate-pulse"
              >
                <StopCircle className="fill-red-500" />
              </Button>
            </>
          )}
          {status === "paused" && (
            <Button variant="primary" size="sm" onClick={handleResmeRecording}>
              <Play className="fill-green-500" />
            </Button>
          )}
        </div>
      </Draggable>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Recording Options</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={recordOptions.screen}
                onChange={(e) =>
                  setRecordOptions({
                    ...recordOptions,
                    screen: e.target.checked,
                  })
                }
              />
              <Monitor className="ml-2" />
              <span className="ml-2">Screen</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={recordOptions.audio}
                onChange={(e) =>
                  setRecordOptions({
                    ...recordOptions,
                    audio: e.target.checked,
                  })
                }
              />
              <Mic className="ml-2" />
              <span className="ml-2">Audio</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={recordOptions.frontCamera}
                onChange={(e) =>
                  setRecordOptions({
                    ...recordOptions,
                    frontCamera: e.target.checked,
                  })
                }
              />
              <Video className="ml-2" />
              <span className="ml-2">Front Camera</span>
            </label>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => confirmRecordingOptions(recordOptions)}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecordingPanel;
