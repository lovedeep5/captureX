import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Library - Recoording.com",
  description:
    "Access and manage all your screen recordings in one place. Share, edit, and organize your video content easily.",
  keywords:
    "video library, screen recordings, video management, content sharing",
};

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
