import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import StoreProvider from "@/app/(pages)/(redux)/StoreProvider";

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import StartRecordingPage from "@/app/(pages)/(pages)/start-recording/page";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
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
