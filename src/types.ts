export interface useVideoRecordingType {
  isRecording: Boolean;
  isRecordingPaused: Boolean;
  startRecording: () => void;
  pauseRecording: () => void;
  stopRecording: () => void;
  recordings: recordingsType[];
}

export interface recordingsType {
  Key: string;
  url: string;
  uuid: string;
}

export interface videoUrl {
  video: string | null;
}
