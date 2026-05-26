import type { Metadata } from "next";
import { Inter, Coming_Soon } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppShell } from "@/components/AppShell";
import { ToastProvider } from "@/components/Toast";
import { MotionProvider } from "@/components/MotionProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const comingSoon = Coming_Soon({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vero — The calm way to follow stocks",
  description:
    "A calm, AI-powered companion for understanding Indian stock markets. Built for beginners.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vero",
  },
};

export const viewport = {
  themeColor: "#9b7ec8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${comingSoon.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <MotionProvider>
            <ToastProvider>
              <AppShell>{children}</AppShell>
            </ToastProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
