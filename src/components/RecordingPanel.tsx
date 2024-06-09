"use client";
import { Pause, Play, StopCircle } from "lucide-react";
import { useVideoRecording } from "@/lib/hooks/useVideoRecording";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RecordingPanel: React.FC = () => {
  const {
    isRecording,
    isRecordingPaused,
    startRecording,
    pauseRecording,
    stopRecording,
  } = useVideoRecording();

  return (
    <div className="flex p-2 rounded-lg fixed z-[100] bottom-20 right-5 bg-primary">
      <Button
        variant="primary"
        size="sm"
        onClick={startRecording}
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
