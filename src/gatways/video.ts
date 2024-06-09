import { S3_VIDEOS, S3_SINGLE_VIDEO } from "@/constants";
import axios, { AxiosResponse } from "axios";

export const uploadVideo = async (
  payload: FormData
): Promise<AxiosResponse<any>> => await axios.post(S3_VIDEOS, payload);

export const getAllVideos = async (): Promise<AxiosResponse<any>> =>
  await axios.get(S3_VIDEOS);

export const getVideo = async (filename: string): Promise<AxiosResponse<any>> =>
  await axios.get(`${S3_SINGLE_VIDEO}?key=${filename}`);
