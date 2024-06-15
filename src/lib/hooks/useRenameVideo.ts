import { S3_SINGLE_VIDEO } from "@/constants";
import { updateVideoTitle } from "@/gatways/video";
import useSWR from "swr";

const useRenameVideo = (id: string, title: string) => {
  const formData = new FormData();
  formData.append("title", title);
  const {
    isLoading: isRenameInProgress,
    data: renameData,
    error: renameError,
  } = useSWR(S3_SINGLE_VIDEO, () => updateVideoTitle(id, formData));
  return [isRenameInProgress, renameData, renameError];
};

export default useRenameVideo;
