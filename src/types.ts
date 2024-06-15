import { AxiosResponse } from "axios";

export interface useVideoRecordingType {
  isRecording: Boolean;
  isRecordingPaused: Boolean;
  startRecording: () => void;
  pauseRecording: () => void;
  stopRecording: () => void;
}

export interface recordingsType {
  title: string;
  Key: string;
  url: string;
  uuid: string;
}

export interface videoUrl {
  video: string | null;
}

export interface deleteAlertType {
  open: boolean;
  id: string | null;
  inProgress: boolean;
}

export interface RenameAlertType {
  open: boolean;
  id: string | null;
  title: string | null;
  inProgress: boolean;
}

export interface AlertType {
  open: boolean;
  title: string;
  discription: string;
  cancleHandler: () => void;
  confirmHandler: () => void;
  inProgress: boolean;
  children?: React.ReactNode;
}
