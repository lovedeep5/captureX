"use client";
import { Pause, Play, StopCircle } from "lucide-react";
import { useVideoRecording } from "@/lib/hooks/useVideoRecording";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const RecordingPanel: React.FC = () => {
  const {
    isRecording,
    isRecordingPaused,
    startRecording,
    pauseRecording,
    stopRecording,
  } = useVideoRecording();
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
        onClick={startRecordingHandler}
        className={cn("text-transparent", {
          hidden: isRecording && !isRecordingPaused,
        })}
      >
        <Play className="fill-white" />
      </Button>

      <Button
        variant="primary"
        size="sm"
        onClick={pauseRecording}
        className={cn("text-transparent", {
          hidden: !isRecording || isRecordingPaused,
        })}
      >
        <Pause className="fill-green-500" />
      </Button>

      <Button
        variant="primary"
        size="sm"
        onClick={stopRecording}
        className={cn("text-transparent", {
          hidden: !isRecording,
          "animate-pulse": !isRecordingPaused,
        })}
      >
        <StopCircle className="fill-red-500" />
      </Button>
    </div>
  );
};

export default RecordingPanel;
