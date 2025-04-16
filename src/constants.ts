export const COMPANY_NAME = "Recoording";
export const COMPANY_EMAIL = `support@${COMPANY_NAME}.com`;
export const REGEX_VIDEO_NAME_FROM_S3_KEY = /\/([A-Za-z0-9\-]+)\.web/;
export const S3_VIDEOS = "/api/videos/";
export const S3_SINGLE_VIDEO = "/api/video/";

// External APIS
export const EXTERNAL_API_DOMAIN = process.env.NEXT_PUBLIC_API_URL;
export const EXTERNAL_API_VIDEO = `${EXTERNAL_API_DOMAIN}/api/v1/video-chunk`;
