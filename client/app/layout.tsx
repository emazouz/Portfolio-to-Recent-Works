import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "../assets/styles/globals.css";
import { Toaster } from "@/components/ui/Toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { TranslationProvider } from "@/components/TranslationProvider";
import { APP_NAME, APP_DESCRIPTION, SERVER_URL } from "@/constants";

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },

  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
  generator: "v0.app",
  keywords: [
    "developer",
    "portfolio",
    "templates",
    "web development",
    "frontend",
    "backend",
  ],
  authors: [{ name: "Developer Portfolio" }],
  openGraph: {
    title: {
      template: `%s | ${APP_NAME}`,
      default: APP_NAME,
    },
    description: APP_DESCRIPTION,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}
      >
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
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
