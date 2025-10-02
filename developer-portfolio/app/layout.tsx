import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { TranslationProvider } from "@/components/TranslationProvider";
import CommonLayout from "../components/common/layout";

export const metadata: Metadata = {
  title: "Developer Portfolio - Premium Templates & Services",
  description:
    "Professional developer portfolio showcasing premium templates, web development services, and technical expertise.",
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
    title: "Developer Portfolio - Premium Templates & Services",
    description:
      "Professional developer portfolio showcasing premium templates, web development services, and technical expertise.",
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
            <CommonLayout>
              <Suspense fallback={null}>{children}</Suspense>
              <Analytics />
            </CommonLayout>
            <Toaster />
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
