import axios, { AxiosResponse } from "axios";
import { EXTERNAL_API_HEALTH } from "@/constants";

export const checkHealth = async (): Promise<AxiosResponse<any>> => {
  try {
    return await axios.get(EXTERNAL_API_HEALTH);
  } catch (error) {
    console.error("Health check failed:", error);
    return Promise.reject(error);
  }
};
