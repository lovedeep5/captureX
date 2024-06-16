import { AxiosResponse } from "axios";
import { uploadVideo } from "./gatways/video";
import Link from "next/link";

export const getStringByPatren = (str: string, pattren: RegExp) => {
  return str.match(pattren)?.[1] || "";
};

export const uploadFile = async (
  url: string,
  blob: Blob
): Promise<AxiosResponse<any> | Error > => {
  const file = new File([blob], `screen-recording-${Date.now()}.webm`, {
    type: "video/webm",
  });

  const formData = new FormData();
  formData.append("file", file);

  try {
    return await uploadVideo(formData);
  } catch (error) {
    return error;
  }
};
