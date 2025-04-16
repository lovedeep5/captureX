import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Share Recording - Recoording.com",
  description:
    "Share your screen recordings easily with anyone. Add comments and collaborate on content.",
  keywords:
    "video sharing, screen recording share, video collaboration, comments",
};

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
