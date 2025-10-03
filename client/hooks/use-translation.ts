"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslationStore } from "@/store/translationStore";
import {
  translationService,
  type TranslateRequest,
} from "@/services/translation";

export function useTranslation() {
  const {
    currentLanguage,
    supportedLanguages,
    translations,
    isTranslating,
    error,
    setLanguage,
    addTranslation,
    getTranslation,
    setTranslating,
    setError,
  } = useTranslationStore();

  const translate = useCallback(
    async (
      text: string,
      options?: {
        sourceLanguage?: string;
        targetLanguage?: string;
        key?: string;
      }
    ) => {
      const sourceLanguage = options?.sourceLanguage || "en";
      const targetLanguage = options?.targetLanguage || currentLanguage;
      const key =
        options?.key ||
        `${sourceLanguage}-${targetLanguage}-${text.substring(0, 20)}`;

      // Return original text if target language is the same as source
      if (sourceLanguage === targetLanguage) {
        return text;
      }

      // Check if translation already exists
      const existingTranslation = getTranslation(key, targetLanguage);
      if (existingTranslation) {
        return existingTranslation.translatedText;
      }

      setTranslating(true);
      setError(null);

      try {
        const request: TranslateRequest = {
          text,
          sourceLanguage,
          targetLanguage,
          key,
        };

        const translation = await translationService.translateText(request);
        addTranslation(translation);
        return translation.translatedText;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Translation failed";
        setError(errorMessage);
        console.error("Translation error:", err);
        return text; // Return original text on error
      } finally {
        setTranslating(false);
      }
    },
    [currentLanguage, getTranslation, addTranslation, setTranslating, setError]
  );

  const translateBatch = useCallback(
    async (
      texts: string[],
      options?: {
        sourceLanguage?: string;
        targetLanguage?: string;
      }
    ) => {
      const sourceLanguage = options?.sourceLanguage || "en";
      const targetLanguage = options?.targetLanguage || currentLanguage;

      if (sourceLanguage === targetLanguage) {
        return texts;
      }

      setTranslating(true);
      setError(null);

      try {
        const requests: TranslateRequest[] = texts.map((text, index) => ({
          text,
          sourceLanguage,
          targetLanguage,
          key: `batch-${index}-${text.substring(0, 20)}`,
        }));

        const translations = await translationService.translateBatch(requests);
        translations.forEach((translation) => addTranslation(translation));

        return translations.map((t) => t.translatedText);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Batch translation failed";
        setError(errorMessage);
        console.error("Batch translation error:", err);
        return texts; // Return original texts on error
      } finally {
        setTranslating(false);
      }
    },
    [currentLanguage, addTranslation, setTranslating, setError]
  );

  const t = useCallback(
    (text: string, key?: string) => {
      if (currentLanguage === "en") {
        return text;
      }

      const translationKey = key || `${text.substring(0, 20)}`;
      const existingTranslation = getTranslation(
        translationKey,
        currentLanguage
      );

      if (existingTranslation) {
        return existingTranslation.translatedText;
      }

      // Trigger translation in background
      translate(text, { key: translationKey }).catch(console.error);

      return text; // Return original text while translating
    },
    [currentLanguage, getTranslation, translate]
  );

  return {
    currentLanguage,
    supportedLanguages,
    isTranslating,
    error,
    setLanguage,
    translate,
    translateBatch,
    t, // Short alias for quick translations
  };
}

export function useTranslatedText(
  text: string,
  options?: {
    sourceLanguage?: string;
    key?: string;
  }
) {
  const [translatedText, setTranslatedText] = useState(text);
  const { translate, currentLanguage } = useTranslation();

  useEffect(() => {
    if (currentLanguage === (options?.sourceLanguage || "en")) {
      setTranslatedText(text);
      return;
    }

    translate(text, {
      sourceLanguage: options?.sourceLanguage || "en",
      targetLanguage: currentLanguage,
      key: options?.key,
    })
      .then(setTranslatedText)
      .catch(() => setTranslatedText(text));
  }, [text, currentLanguage, translate, options?.sourceLanguage, options?.key]);

  return translatedText;
}
