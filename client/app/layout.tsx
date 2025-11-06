import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "../assets/styles/globals.css";
import { Toaster } from "@/components/ui/Toaster";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { TranslationProvider } from "@/components/provider/TranslationProvider";
import {
  APP_NAME,
  APP_DESCRIPTION,
  SERVER_URL,
} from "@/constants/index.constants";
import { BackToTop } from "@/components/back-to-top";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },

  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
  keywords: [
    "developer",
    "portfolio",
    "templates",
    "web development",
    "frontend",
    "backend",
  ],
  authors: [{ name: "Emazouz Portfolio" }],
  openGraph: {
    title: {
      template: `%s | ${APP_NAME}`,
      default: APP_NAME,
    },
    description: APP_DESCRIPTION,
    type: "website",
  },
};

const font = Geist({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TranslationProvider>
            <Suspense fallback={null}>{children}</Suspense>
            <Analytics />
            <Toaster />
            <BackToTop />
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
