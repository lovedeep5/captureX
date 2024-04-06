import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import StoreProvider from "./(redux)/StoreProvider";

import "./globals.css";
import RecordButton from "@/components/RecordButton";
import RecordingPanel from "@/components/RecordingPanel";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Capture",
  description: "Record video and share easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <StoreProvider>
            <RecordingPanel />
            {children}
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
