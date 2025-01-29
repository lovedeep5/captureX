export interface initialRecordingOptionsType {
  camera: boolean;
  audio: boolean;
  screen: boolean;
}

export interface UserRecorderTypes {
  startRecording: () => void;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  userScreenStream: React.MutableRefObject<MediaStream | null>;
  recordingOptions: initialRecordingOptionsType;
  setRecordingOptions: React.Dispatch<
    React.SetStateAction<initialRecordingOptionsType>
  >;
  screenRecorder: MediaRecorder | null;
}

export interface UseRecorderPropTypes {
  onStreamDataAvailable?: (event: BlobEvent) => void;
  onStreamStop?: () => void;
}
