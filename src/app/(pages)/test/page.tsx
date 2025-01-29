"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

const initialRecordingOptions = {
  camera: true,
  microphone: true,
  screen: true,
};

const TestPage = () => {
  const [recordingOptions, setRecordingOptions] = useState(
    initialRecordingOptions
  );
  const userCameraStream = useRef<MediaStream | null>(null);
  const userScreenStream = useRef<MediaStream | null>(null);
  const userCameraRecorder = useRef<MediaRecorder | null>(null);
  const userScreenRecorder = useRef<MediaRecorder | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);

  const startRecording = async () => {
    if (recordingOptions.camera === false && recordingOptions.screen === false)
      return;

    try {
      if (recordingOptions.camera === true) {
        const userCamera = await navigator.mediaDevices.getUserMedia({
          video: recordingOptions.camera,
          audio: recordingOptions.microphone,
        });

        userCameraStream.current = userCamera;
        const cameraRecorder = new MediaRecorder(userCamera);
        userCameraRecorder.current = cameraRecorder;
        cameraRecorder.start(1000);

        if (cameraVideoRef.current) {
          cameraVideoRef.current.srcObject = userCamera;
        }
      }

      // Get screen stream with video
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: recordingOptions.screen,
        audio: true, // Attempt to capture system audio
      });

      // Get microphone stream if needed
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: recordingOptions.microphone,
      });

      // Combine screen video and microphone audio
      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...micStream.getAudioTracks(),
      ]);

      userScreenStream.current = combinedStream;
      const screenRecorder = new MediaRecorder(combinedStream);
      userScreenRecorder.current = screenRecorder;

      screenRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log("Screen recording chunk:", event.data);
        }
      };

      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = combinedStream;
      }

      screenRecorder.start(1000);
    } catch (error) {
      console.error("Error occurred during the recording process:", error);
    }
  };

  const stopRecording = async () => {
    if (userCameraRecorder.current) {
      userCameraRecorder.current.stop();
    }

    if (userScreenRecorder.current) {
      userScreenRecorder.current.stop();
    }

    if (userCameraStream.current) {
      userCameraStream.current.getTracks().forEach((track) => track.stop());
    }

    if (userScreenStream.current) {
      userScreenStream.current.getTracks().forEach((track) => track.stop());
    }

    userCameraStream.current = null;
    userScreenStream.current = null;

    userCameraRecorder.current = null;
    userScreenRecorder.current = null;
  };
  const pauseRecording = () => {
    if (userCameraRecorder.current) {
      userCameraRecorder.current.pause();
    }

    if (userScreenRecorder.current) {
      userScreenRecorder.current.pause();
    }
  };

  const resumeRecording = () => {
    if (userCameraRecorder.current) {
      userCameraRecorder.current.resume();
    }

    if (userScreenRecorder.current) {
      userScreenRecorder.current.resume();
    }
  };

  return (
    <div>
      <div>
        Videos
        <div className="flex gap-4 w-full max-w-2xl">
          <video
            className="w-1/2"
            autoPlay
            playsInline
            controls
            ref={screenVideoRef}
          ></video>
          <video
            className="w-1/2"
            autoPlay
            playsInline
            controls={false}
            muted
            ref={cameraVideoRef}
          ></video>
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={startRecording}>Record</Button>
        <Button onClick={stopRecording}>Stop</Button>
        <Button onClick={pauseRecording}>Pause</Button>
        <Button onClick={resumeRecording}>Resume</Button>
      </div>
    </div>
  );
};

export default TestPage;
