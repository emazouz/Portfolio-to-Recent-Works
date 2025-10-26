"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useTranslation } from "@/hooks/use-translation";
import type { TranslationContextType } from "@/types/translation.types";

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

interface TranslationProviderProps {
  children: React.ReactNode;
  defaultLanguage?: string;
  onLanguageChange?: (language: string) => void;
}

// RTL languages configuration
const RTL_LANGUAGES = new Set(["ar", "he", "fa", "ur"]);

// Language metadata for better accessibility
const LANGUAGE_METADATA: Record<string, { dir: "ltr" | "rtl"; label: string }> =
  {
    en: { dir: "ltr", label: "English" },
    ar: { dir: "rtl", label: "العربية" },
    es: { dir: "ltr", label: "Español" },
    fr: { dir: "ltr", label: "Français" },
    de: { dir: "ltr", label: "Deutsch" },
    zh: { dir: "ltr", label: "中文" },
    ja: { dir: "ltr", label: "日本語" },
    he: { dir: "rtl", label: "עברית" },
    fa: { dir: "rtl", label: "فارسی" },
    ur: { dir: "rtl", label: "اردو" },
  };

export function TranslationProvider({
  children,
  defaultLanguage,
  onLanguageChange,
}: TranslationProviderProps) {
  const translation = useTranslation();
  const {
    t,
    currentLanguage,
    isTranslating,
    error,
    setLanguage,
    supportedLanguages,
  } = translation;

  // Set default language on mount if provided
  useEffect(() => {
    if (defaultLanguage && defaultLanguage !== currentLanguage) {
      setLanguage(defaultLanguage);
    }
  }, [defaultLanguage, currentLanguage, setLanguage]);

  // Determine if current language is RTL
  const isRTL = useMemo(() => {
    return RTL_LANGUAGES.has(currentLanguage);
  }, [currentLanguage]);

  // Get language metadata
  const languageMetadata = useMemo(() => {
    return (
      LANGUAGE_METADATA[currentLanguage] || {
        dir: "ltr",
        label: currentLanguage,
      }
    );
  }, [currentLanguage]);

  // Apply RTL/LTR styles and accessibility attributes
  useEffect(() => {
    const htmlElement = document.documentElement;

    try {
      // Set language attribute for accessibility and SEO
      htmlElement.setAttribute("lang", currentLanguage);

      // Set text direction
      const direction = languageMetadata.dir;
      htmlElement.setAttribute("dir", direction);

      // Apply/remove RTL class
      if (direction === "rtl") {
        htmlElement.classList.add("rtl");
        htmlElement.classList.remove("ltr");
      } else {
        htmlElement.classList.add("ltr");
        htmlElement.classList.remove("rtl");
      }

      // Set CSS custom property for direction-aware styling
      htmlElement.style.setProperty("--text-direction", direction);

      // Notify parent component of language change
      if (onLanguageChange) {
        onLanguageChange(currentLanguage);
      }
    } catch (err) {
      console.error("Error applying language attributes:", err);
    }

    // Cleanup function to prevent issues if provider unmounts
    return () => {
      try {
        // Only reset if this is the last TranslationProvider
        // (in case of nested providers)
        htmlElement.style.removeProperty("--text-direction");
      } catch (err) {
        console.error("Error during language cleanup:", err);
      }
    };
  }, [currentLanguage, languageMetadata.dir, onLanguageChange]);

  // Enhanced context value with additional utilities
  const contextValue = useMemo<TranslationContextType>(
    () => ({
      t,
      currentLanguage,
      isTranslating,
      error,
      isRTL,
      direction: languageMetadata.dir,
      languageLabel: languageMetadata.label,
      setLanguage,
      supportedLanguages,
      translate: translation.translate,
      translateBatch: translation.translateBatch,
      detectLanguage: translation.detectLanguage,
      clearCache: translation.clearCache,
      translations: translation.translations,
    }),
    [
      t,
      currentLanguage,
      isTranslating,
      error,
      isRTL,
      languageMetadata.dir,
      languageMetadata.label,
      setLanguage,
      supportedLanguages,
      translation.translate,
      translation.translateBatch,
      translation.detectLanguage,
      translation.clearCache,
      translation.translations,
    ]
  );

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext() {
  const context = useContext(TranslationContext);

  if (context === undefined) {
    throw new Error(
      "useTranslationContext must be used within a TranslationProvider. " +
        "Make sure to wrap your component tree with <TranslationProvider>."
    );
  }

  return context;
}

// Utility hook to check if a specific language is RTL
export function useIsRTL(language?: string): boolean {
  const { currentLanguage } = useTranslationContext();
  const targetLanguage = language || currentLanguage;
  return RTL_LANGUAGES.has(targetLanguage);
}

// Utility hook to get language direction
export function useLanguageDirection(language?: string): "ltr" | "rtl" {
  const { currentLanguage } = useTranslationContext();
  const targetLanguage = language || currentLanguage;
  return LANGUAGE_METADATA[targetLanguage]?.dir || "ltr";
}

// Hook for conditional rendering based on language
export function useLanguageAware<T>(
  values: { ltr: T; rtl: T } | Record<string, T>
): T {
  const { currentLanguage, isRTL } = useTranslationContext();

  return useMemo(() => {
    // If values have ltr/rtl keys, use direction-based selection
    if ("ltr" in values && "rtl" in values) {
      return isRTL ? values.rtl : values.ltr;
    }

    // Otherwise, use language-specific values
    return values[currentLanguage] || values["en"] || Object.values(values)[0];
  }, [values, currentLanguage, isRTL]);
}

// Export RTL languages set for external use
export { RTL_LANGUAGES, LANGUAGE_METADATA };
