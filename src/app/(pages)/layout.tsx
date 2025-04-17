import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Recoording.com - Professional Screen & Camera Recording Platform",
    template: "%s | Recoording.com",
  },
  description:
    "Create and share professional screen recordings instantly. Record your screen, camera, and voice with one click. Perfect for tutorials, presentations, and bug reports.",
  keywords:
    "screen recording, video sharing, screen capture, voice over, presentation recording, video messaging, tutorial creation, bug reporting",
  authors: [{ name: "Recoording.com" }],
  creator: "Recoording.com",
  publisher: "Recoording.com",
  metadataBase: new URL("https://recoording.com"),
  openGraph: {
    type: "website",
    siteName: "Recoording.com",
    title: "Recoording.com - Professional Screen Recording Made Easy",
    description:
      "Create and share professional screen recordings instantly. Record your screen, camera, and voice with one click.",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Recoording.com - Screen Recording Platform",
      },
      {
        url: "/images/og-square.png",
        width: 800,
        height: 800,
        alt: "Recoording.com - Screen Recording Platform",
      },
    ],
    locale: "en_US",
    url: "https://recoording.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recoording.com - Professional Screen Recording Made Easy",
    description:
      "Create and share professional screen recordings instantly. Record your screen, camera, and voice with one click.",
    site: "@recoording",
    creator: "@recoording",
    images: ["/images/og-banner.png"],
  },
  icons: {
    icon: [
      {
        url: "/images/favicon/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      { url: "/images/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/images/favicon/favicon.ico",
    apple: [
      {
        url: "/images/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/images/favicon/site.webmanifest",
  appleWebApp: {
    title: "Recoording.com",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://recoording.com",
  },
};

const PagesLayouts = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default PagesLayouts;
