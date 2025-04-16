"use client";
import { Button } from "@/components/ui/button";
import { uploadVideoChunk } from "@/gatways/video";
import Draggable from "react-draggable"; // The default
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import {
  Mic,
  MicOff,
  MonitorOff,
  Pause,
  Play,
  ScreenShare,
  Square,
  Video,
  VideoOff,
} from "lucide-react";
import React, { use, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface UserPreferences {
  mic: boolean;
  camera: boolean;
  screen: boolean;
}

const StartRecordingPage = () => {
  const router = useRouter();
  const { userId, getToken } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const liveVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const userMediaStream = useRef<MediaStream | null>(null);
  const cameraStream = useRef<MediaStream | null>(null);
  const screenStream = useRef<MediaStream | null>(null);
  const recording_id = useRef<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [timer, setTimer] = useState(0);
  const [userPrerences, setUserPrefrences] = useState<UserPreferences>({
    mic: true,
    camera: false,
    screen: true,
  });

  const startRecording = async () => {
    if (
      userPrerences.screen === false &&
      userPrerences.camera === false &&
      userPrerences.mic === false
    ) {
      alert(
        "Please enable at least one of the options: camera, screen, or mic."
      );
      return;
    }
    const token = await getToken({ template: "capture-x-recoording-api" });
    if (!token) {
      alert("Please login to start recording.");
      return;
    }
    if (recording_id) {
      recording_id.current = crypto.randomUUID();
    }

    let camera, screen;
    camera =
      userPrerences.camera || userPrerences.mic
        ? await navigator.mediaDevices.getUserMedia({
            video: userPrerences.camera,
            audio: userPrerences.mic,
          })
        : null;

    screen = userPrerences.screen
      ? await navigator.mediaDevices.getDisplayMedia({
          video: userPrerences.screen,
        })
      : null;

    const screenVideoTrack = screen?.getVideoTracks()[0];
    if (screenVideoTrack) {
      screenVideoTrack.onended = () => {
        stopRecording();
      };
    }
    cameraStream.current = camera;
    screenStream.current = screen;

    // combine streams
    const combinedStream = new MediaStream([
      ...(camera?.getAudioTracks() || []),
      ...(screen?.getVideoTracks() || []),
    ]);

    if (liveVideoRef.current && userPrerences.camera) {
      const hasVideo = camera && camera?.getVideoTracks()?.length > 0;
      if (hasVideo) {
        liveVideoRef.current.srcObject = camera;
        liveVideoRef.current
          .play()
          .catch((err) => console.error("Video playback error:", err));
      }
    }
    mediaRecorder.current = new MediaRecorder(combinedStream, {
      mimeType: "video/webm; codecs=vp8,opus",
    });

    userMediaStream.current = combinedStream;
    mediaRecorder.current.start(4000);

    mediaRecorder.current.ondataavailable = async (e) => {
      if (e.data.size > 0) {
        console.log("Chunk", e.data);

        const formData = new FormData();
        formData.append("video", e.data, "video.webm");
        formData.append("recording_id", recording_id.current!);
        formData.append("event", "upload_chunk");
        formData.append("userId", userId!);
        formData.append("token", token!);

        await uploadVideoChunk(formData);
      }
    };

    mediaRecorder.current.onstop = async () => {
      const formData = new FormData();
      formData.append("recording_id", recording_id.current!);
      formData.append("event", "end_recording");
      formData.append("userId", userId!);
      formData.append("token", token!);

      await uploadVideoChunk(formData);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setTimer(0);
    };

    mediaRecorder.current.onstart = async () => {
      const formData = new FormData();
      formData.append("recording_id", recording_id.current!);
      formData.append("event", "start_recording");
      formData.append("userId", userId!);
      formData.append("token", token!);

      await uploadVideoChunk(formData);

      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    };

    setIsRecording(true);
  };
  const stopRecording = async () => {
    mediaRecorder.current?.stop();
    userMediaStream.current?.getTracks().forEach((track) => track.stop());
    cameraStream.current?.getTracks().forEach((track) => track.stop());
    screenStream.current?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
    setUserPrefrences((prev) => {
      return { ...prev, camera: false };
    });

    router.push(`/share/${recording_id.current}`);
  };

  const handlePauseRecording = () => {
    if (isPaused) {
      mediaRecorder.current?.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      mediaRecorder.current?.pause();
      setIsPaused(true);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleUserPrefrences = (device: keyof UserPreferences) => {
    setUserPrefrences((prev) => {
      return { ...prev, [device]: !prev[device] };
    });
  };

  return (
    <>
      {!isRecording && (
        <Draggable handle=".ui-handle" bounds="body">
          <div className="ui-handle flex flex-col gap-2 w-[350px] bg-neutral-300/10 backdrop-blur-md rounded-lg shadow-lg border fixed bottom-12 right-12 z-50">
            <div className="w-full h-12  bg-muted/20 backdrop-blur-md border-b flex items-center justify-between px-4 cursor-move ">
              <div className="text-sm text-muted-foreground">Recoording</div>
            </div>
            <div className="p-2 step-2 flex gap-2 justify-between">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full"
                onClick={() => handleUserPrefrences("camera")}
              >
                <Video
                  className={cn("w-7 h-7", { hidden: !userPrerences.camera })}
                  strokeWidth={1.2}
                />
                <VideoOff
                  className={cn("w-7 h-7", { hidden: userPrerences.camera })}
                  strokeWidth={1.2}
                />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="rounded-full"
                onClick={() => handleUserPrefrences("screen")}
              >
                <ScreenShare
                  className={cn("w-7 h-7", { hidden: !userPrerences.screen })}
                  strokeWidth={1.2}
                />
                <MonitorOff
                  className={cn("w-7 h-7", { hidden: userPrerences.screen })}
                  strokeWidth={1.2}
                />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="rounded-full"
                onClick={() => handleUserPrefrences("mic")}
              >
                <Mic
                  strokeWidth={1.2}
                  className={cn("w-7 h-7", { hidden: !userPrerences.mic })}
                />
                <MicOff
                  className={cn("w-7 h-7", { hidden: userPrerences.mic })}
                  strokeWidth={1.2}
                />
              </Button>
            </div>
            <div className="p-2 step-1">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-full"
                onClick={startRecording}
              >
                Start Recording
              </Button>
            </div>
          </div>
        </Draggable>
      )}
      {isRecording && (
        <>
          <Draggable handle=".ui-handle" bounds="body">
            <div className="z-50 ui-handle flex flex-col gap-2 w-[350px] bg-muted rounded-lg shadow-lg border absolute bottom-12 right-12">
              <div className="w-full h-12  bg-muted border-b flex items-center justify-between px-4">
                <div className="text-sm text-muted-foreground">Recoording</div>
                <div className="text-sm text-muted-foreground recording-timer p-2 border bg-orange-400 rounded-full text-center text-white w-20 ">
                  {Math.floor(timer / 60)
                    .toString()
                    .padStart(2, "0")}
                  {":"}
                  {Math.floor(timer % 60)
                    .toString()
                    .padStart(2, "0")}
                </div>
              </div>
              <div className="flex gap-1 justify-between">
                <div className="p-2 step-2 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn("rounded-full", {
                      hidden: !userPrerences.camera,
                    })}
                    disabled
                  >
                    <Video className="w-7 h-7" strokeWidth={1.2} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn("rounded-full", {
                      hidden: !userPrerences.screen,
                    })}
                    disabled
                  >
                    <ScreenShare className="w-7 h-7" strokeWidth={1.2} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn("rounded-full", {
                      hidden: !userPrerences.mic,
                    })}
                    disabled
                  >
                    <Mic className={cn("w-7 h-7")} strokeWidth={1.2} />
                  </Button>
                </div>

                <div className="p-2 step-2 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full relative"
                    onClick={stopRecording}
                  >
                    <Square
                      className="w-7 h-7 fill-orange-600 "
                      strokeWidth={0.2}
                    />
                    <span
                      className={cn(
                        "absolute inset-0 rounded-full bg-red-500/30 animate-ping",
                        { hidden: isPaused }
                      )}
                    />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className={cn("rounded-full", {
                      hidden: !isRecording,
                    })}
                    onClick={handlePauseRecording}
                  >
                    <Pause
                      className={cn("w-7 h-7", { hidden: isPaused })}
                      strokeWidth={1.2}
                    />
                    <Play
                      className={cn("w-7 h-7", { hidden: !isPaused })}
                      strokeWidth={1.2}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </Draggable>
        </>
      )}

      {userPrerences.camera && (
        <Draggable handle=".camera-handle" bounds="body">
          <div className="camera-handle inline-block absolute left-12 bottom-12 z-50">
            <div className="w-[200px] h-[200px] rounded-full overflow-hidden shadow-lg border ">
              <video
                ref={liveVideoRef}
                muted
                className="w-full h-full object-cover"
                autoPlay
                playsInline
              >
                Your browser does not support HTML video.
              </video>
            </div>
          </div>
        </Draggable>
      )}
    </>
  );
};

export default StartRecordingPage;
