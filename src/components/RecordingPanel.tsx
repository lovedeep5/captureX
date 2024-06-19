"use client";
import { useReactMediaRecorder } from "react-media-recorder-2";
import { useRouter } from "next/navigation";

import { Mic, MicOff, Pause, Play, StopCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { uploadVideo } from "@/gatways/video";

const RecordingPanel: React.FC = () => {
  const router = useRouter();
  const onStopRecording = async (url: string, blob: Blob) => {
    const file = new File([blob], `screen-recording-${Date.now()}.webm`, {
      type: "video/webm",
    });

    const formData = new FormData();
    formData.append("file", file);

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
  };
  const {
    status,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    isAudioMuted,
    muteAudio,
    unMuteAudio
  } = useReactMediaRecorder({
    video: true,
    screen: true,
    blobPropertyBag: { type: "video/webm" },
    onStop: onStopRecording,
  });

  const { userId } = useAuth();
  const { toast } = useToast();

  const startRecordingHandler = () => {
    if (!userId) {
      toast({
        title: "📹 Record and Share Your Video!",
        description:
          "Please log in to start recording and sharing videos with the community!",

        action: (
          <ToastAction altText="Login">
            <Link href="/sign-in">Login</Link>
          </ToastAction>
        ),
      });
      return;
    }
    startRecording();
  };

  

  return (
    <div className="flex p-2 rounded-lg fixed z-[100] bottom-20 right-5 bg-primary">
      <Button
        variant="primary"
        size="sm"
        onClick={status === "paused" ? resumeRecording : startRecordingHandler}
        className={cn("text-transparent", {
          hidden: status === "recording",
        })}
      >
        <Play className="fill-white" />
      </Button>

      <Button
        variant="primary"
        size="sm"
        onClick={pauseRecording}
        className={cn("text-transparent", {
          hidden: status !== "recording",
        })}
      >
        <Pause className="fill-green-500" />
      </Button>

      <Button
        variant="primary"
        size="sm"
        onClick={stopRecording}
        className={cn("text-transparent", {
          hidden: status !== "recording" && status !== "paused",
          "animate-pulse": status === "recording",
        })}
      >
        <StopCircle className="fill-red-500" />
      </Button>

      <Button
        variant="primary"
        size="sm"
        onClick={muteAudio}
        className={cn({ hidden: isAudioMuted })}
        disabled={status !== 'recording'}
        
      >
        <Mic />
      </Button>
      <Button
        variant="primary"
        size="sm"
        onClick={unMuteAudio}
        className={cn({ hidden: !isAudioMuted })}
        disabled={status !== 'recording'}
      >
        <MicOff />
      </Button>
    </div>
  );
};

export default RecordingPanel;
