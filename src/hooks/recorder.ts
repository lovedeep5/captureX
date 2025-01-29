"use client";
import React, { useState, useRef } from "react";
import {
  initialRecordingOptionsType,
  UserRecorderTypes,
  UseRecorderPropTypes,
} from "../../types/recorder";

const initialRecordingOptions = {
  camera: true,
  audio: true,
  screen: true,
};

const useRecorder = ({
  onStreamDataAvailable,
  onStreamStop,
}: UseRecorderPropTypes): UserRecorderTypes => {
  const [recordingOptions, setRecordingOptions] =
    useState<initialRecordingOptionsType>(initialRecordingOptions);

  const userScreenStream = useRef<MediaStream | null>(null);
  const userScreenRecorder = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    if (recordingOptions.camera === false && recordingOptions.screen === false)
      return;

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: recordingOptions.screen,
        audio: recordingOptions.audio,
      });

      userScreenStream.current = screenStream;
      const screenRecorder = new MediaRecorder(screenStream, {
        mimeType: "video/webm; codecs=vp9 ",
        videoBitsPerSecond: 5000000,
      });
      userScreenRecorder.current = screenRecorder;

      screenRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // console.log("Screen recording chunk:", event.data);

          if (onStreamDataAvailable) {
            onStreamDataAvailable(event);
          }
        }
      };

      screenRecorder.onstop = () => {
        if (onStreamStop) {
          onStreamStop();
        }
      };

      screenRecorder.start(1000 * 5);
    } catch (error) {
      console.error("Error occurred during the recording process:", error);
    }
  };

  const stopRecordingStream = (
    stream: React.MutableRefObject<MediaStream | null>,
    recorder: React.MutableRefObject<MediaRecorder | null>
  ) => {
    if (recorder?.current) {
      recorder?.current?.stop();
    }

    if (stream?.current) {
      stream?.current?.getTracks().forEach((track) => track.stop());
    }

    stream.current = null;
    recorder.current = null;
  };

  const pauseRecordingStream = (
    recorder: React.MutableRefObject<MediaRecorder | null>
  ) => {
    if (recorder.current) {
      recorder.current.pause();
    }
  };

  const resumeRecordingStream = (
    recorder: React.MutableRefObject<MediaRecorder | null>
  ) => {
    if (recorder.current) {
      recorder.current.resume();
    }
  };

  const stopRecording = async () => {
    stopRecordingStream(userScreenStream, userScreenRecorder);
  };

  const pauseRecording = () => {
    pauseRecordingStream(userScreenRecorder);
  };

  const resumeRecording = () => {
    resumeRecordingStream(userScreenRecorder);
  };

  return {
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    userScreenStream,
    recordingOptions,
    setRecordingOptions,
    screenRecorder: userScreenRecorder.current,
  };
};

export default useRecorder;
