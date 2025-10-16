"use client";

import type React from "react";
import { createContext, useContext, useEffect } from "react";
import { useTranslation } from "@/hooks/use-translation";

interface TranslationContextType {
  t: (text: string, key?: string) => string;
  currentLanguage: string;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t, currentLanguage, isTranslating } = useTranslation();

  // Apply RTL/LTR styles based on language; restrict to en/ar only
  useEffect(() => {
    // Set html lang attribute for accessibility and SEO
    document.documentElement.setAttribute(
      "lang",
      currentLanguage === "ar" ? "ar" : "en"
    );

    if (currentLanguage === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.classList.remove("rtl");
    }
  }, [currentLanguage]);

  return (
    <TranslationContext.Provider value={{ t, currentLanguage, isTranslating }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error(
      "useTranslationContext must be used within a TranslationProvider"
    );
  }
  return context;
}
