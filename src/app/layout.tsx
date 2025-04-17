import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import StoreProvider from "./(redux)/StoreProvider";

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import StartRecordingPage from "./(pages)/start-recording/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Recoording.com - Professional Screen & Camera Recording Platform",
    template: "%s | Recoording.com",
  },
  description:
    "Create and share professional screen recordings instantly. Record your screen, camera, and voice with one click. No downloads required.",
  keywords:
    "screen recording, video sharing, screen capture, voice over, presentation recording, video messaging",
  metadataBase: new URL("https://recoording.com"),
  openGraph: {
    title: "Recoording.com - Professional Screen Recording Platform",
    description:
      "Create and share professional screen recordings instantly. No downloads required.",
    type: "website",
    siteName: "Recoording.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recoording.com - Professional Screen Recording Platform",
    description:
      "Create and share professional screen recordings instantly. No downloads required.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" suppressHydrationWarning>
        <head>
          <title>CaptureX - Screen Recording Made Easy</title>
          <meta
            name="description"
            content="Record, share, and manage your screen recordings with ease. Features include camera overlay, audio recording, and instant sharing."
          />
          <meta
            name="keywords"
            content="screen recording, video capture, screen capture, video sharing"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta
            property="og:title"
            content="CaptureX - Screen Recording Made Easy"
          />
          <meta
            property="og:description"
            content="Record, share, and manage your screen recordings with ease."
          />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
        </head>
        <body
          className={`${inter.className} bg-[#0F172A]`}
          id="dragable-bounds"
        >
          <StoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              forcedTheme="dark"
              disableTransitionOnChange
              storageKey="capturex-theme"
            >
              <StartRecordingPage />
              {children}
            </ThemeProvider>
            <Toaster />
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
