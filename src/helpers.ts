import { uploadVideo } from "./gatways/video";

export const getStringByPatren = (str: string, pattren: RegExp) => {
  return str.match(pattren)?.[1] || "";
};

export const uploadFile = async (blob: Blob) => {
  const file = new File([blob], `screen-recording-${Date.now()}.webm`, {
    type: "video/webm",
  });

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await uploadVideo(formData);
    console.log("Video uploaded successfully:", response.data);
  } catch (error) {
    console.error("Error uploading Video:", error);
  }
};
