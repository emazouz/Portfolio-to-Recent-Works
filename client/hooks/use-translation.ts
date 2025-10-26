"use client";

import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useTranslationStore } from "@/store/translationStore";
import {
  translationService,
  type TranslateRequest,
} from "@/store/translationStore";

export interface TranslateOptions {
  sourceLanguage?: string;
  targetLanguage?: string;
  key?: string;
}

export interface BatchTranslateOptions {
  sourceLanguage?: string;
  targetLanguage?: string;
}

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
    async (text: string, options?: TranslateOptions): Promise<string> => {
      // Validate input
      if (!text || text.trim().length === 0) {
        console.warn("Translation called with empty text");
        return text;
      }

      const sourceLanguage = (options?.sourceLanguage || "en")
        .toLowerCase()
        .split("-")[0];
      const targetLanguage = (options?.targetLanguage || currentLanguage)
        .toLowerCase()
        .split("-")[0];

      // Generate a proper key using full text hash
      const key =
        options?.key ||
        `${sourceLanguage}-${targetLanguage}-${generateTextHash(text)}`;

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
      options?: BatchTranslateOptions
    ): Promise<string[]> => {
      // Validate input
      if (!texts || texts.length === 0) {
        console.warn("Batch translation called with empty array");
        return [];
      }

      // Filter out empty texts
      const validTexts = texts.filter((text) => text && text.trim().length > 0);
      if (validTexts.length === 0) {
        console.warn("Batch translation called with all empty texts");
        return texts;
      }

      const sourceLanguage = (options?.sourceLanguage || "en")
        .toLowerCase()
        .split("-")[0];
      const targetLanguage = (options?.targetLanguage || currentLanguage)
        .toLowerCase()
        .split("-")[0];

      if (sourceLanguage === targetLanguage) {
        return texts;
      }

      // Check cache for existing translations
      const results: string[] = [];
      const untranslatedIndices: number[] = [];
      const untranslatedTexts: string[] = [];

      texts.forEach((text, index) => {
        if (!text || text.trim().length === 0) {
          results[index] = text;
          return;
        }

        const key = `${sourceLanguage}-${targetLanguage}-${generateTextHash(text)}`;
        const existingTranslation = getTranslation(key, targetLanguage);

        if (existingTranslation) {
          results[index] = existingTranslation.translatedText;
        } else {
          untranslatedIndices.push(index);
          untranslatedTexts.push(text);
        }
      });

      // If all translations are cached, return immediately
      if (untranslatedTexts.length === 0) {
        return results;
      }

      setTranslating(true);
      setError(null);

      try {
        const requests: TranslateRequest[] = untranslatedTexts.map(
          (text, idx) => ({
            text,
            sourceLanguage,
            targetLanguage,
            key: `${sourceLanguage}-${targetLanguage}-${generateTextHash(text)}`,
          })
        );

        const translations = await translationService.translateBatch(requests);
        translations.forEach((translation, idx) => {
          addTranslation(translation);
          const originalIndex = untranslatedIndices[idx];
          results[originalIndex] = translation.translatedText;
        });

        return results;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Batch translation failed";
        setError(errorMessage);
        console.error("Batch translation error:", err);

        // Fill in untranslated texts with originals on error
        untranslatedIndices.forEach((index, idx) => {
          results[index] = untranslatedTexts[idx];
        });

        return results;
      } finally {
        setTranslating(false);
      }
    },
    [currentLanguage, getTranslation, addTranslation, setTranslating, setError]
  );

  const t = useCallback(
    (text: string, key?: string): string => {
      if (!text || text.trim().length === 0) {
        return text;
      }

      if (currentLanguage === "en") {
        return text;
      }

      const translationKey =
        key || `${generateTextHash(text)}_${currentLanguage}`;
      const existingTranslation = getTranslation(
        translationKey,
        currentLanguage
      );

      if (existingTranslation) {
        return existingTranslation.translatedText;
      }

      // Return original text if no translation exists
      // Callers should prefetch translations via translate()/translateBatch()
      return text;
    },
    [currentLanguage, getTranslation]
  );

  const detectLanguage = useCallback(
    async (text: string): Promise<string> => {
      if (!text || text.trim().length === 0) {
        throw new Error("Text cannot be empty");
      }

      try {
        return await translationService.detectLanguage(text);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Language detection failed";
        setError(errorMessage);
        throw err;
      }
    },
    [setError]
  );

  const clearCache = useCallback(() => {
    translationService.clearCache();
  }, []);

  return {
    currentLanguage,
    supportedLanguages,
    translations,
    isTranslating,
    error,
    setLanguage,
    translate,
    translateBatch,
    detectLanguage,
    clearCache,
    t, // Short alias for quick translations
  };
}

export function useTranslatedText(
  text: string,
  options?: {
    sourceLanguage?: string;
    targetLanguage?: string;
    key?: string;
    enabled?: boolean;
  }
) {
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { translate, currentLanguage } = useTranslation();
  
  // Use ref to track if component is mounted
  const isMountedRef = useRef(true);
  
  // Use ref to prevent duplicate requests
  const lastRequestRef = useRef<string>("");

  const targetLanguage = options?.targetLanguage || currentLanguage;
  const sourceLanguage = options?.sourceLanguage || "en";
  const enabled = options?.enabled !== false;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Skip if disabled
    if (!enabled) {
      setTranslatedText(text);
      return;
    }

    // Skip if text is empty
    if (!text || text.trim().length === 0) {
      setTranslatedText(text);
      return;
    }

    // Skip if source and target languages are the same
    if (sourceLanguage === targetLanguage) {
      setTranslatedText(text);
      return;
    }

    // Create a unique request identifier
    const requestId = `${text}-${sourceLanguage}-${targetLanguage}`;
    
    // Skip if this exact request is already in progress
    if (lastRequestRef.current === requestId) {
      return;
    }

    lastRequestRef.current = requestId;
    setIsLoading(true);
    setError(null);

    translate(text, {
      sourceLanguage,
      targetLanguage,
      key: options?.key,
    })
      .then((result) => {
        if (isMountedRef.current) {
          setTranslatedText(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMountedRef.current) {
          const errorMessage =
            err instanceof Error ? err.message : "Translation failed";
          setError(errorMessage);
          setTranslatedText(text); // Fallback to original text
        }
      })
      .finally(() => {
        if (isMountedRef.current) {
          setIsLoading(false);
          lastRequestRef.current = "";
        }
      });
  }, [
    text,
    sourceLanguage,
    targetLanguage,
    translate,
    options?.key,
    enabled,
  ]);

  return { translatedText, isLoading, error };
}

export function useBatchTranslatedTexts(
  texts: string[],
  options?: {
    sourceLanguage?: string;
    targetLanguage?: string;
    enabled?: boolean;
  }
) {
  const [translatedTexts, setTranslatedTexts] = useState<string[]>(texts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { translateBatch, currentLanguage } = useTranslation();
  
  const isMountedRef = useRef(true);
  const lastRequestRef = useRef<string>("");

  const targetLanguage = options?.targetLanguage || currentLanguage;
  const sourceLanguage = options?.sourceLanguage || "en";
  const enabled = options?.enabled !== false;

  // Memoize texts array to prevent unnecessary rerenders
  const textsKey = useMemo(() => texts.join("|"), [texts]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled || texts.length === 0) {
      setTranslatedTexts(texts);
      return;
    }

    if (sourceLanguage === targetLanguage) {
      setTranslatedTexts(texts);
      return;
    }

    const requestId = `${textsKey}-${sourceLanguage}-${targetLanguage}`;
    
    if (lastRequestRef.current === requestId) {
      return;
    }

    lastRequestRef.current = requestId;
    setIsLoading(true);
    setError(null);

    translateBatch(texts, {
      sourceLanguage,
      targetLanguage,
    })
      .then((results) => {
        if (isMountedRef.current) {
          setTranslatedTexts(results);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMountedRef.current) {
          const errorMessage =
            err instanceof Error ? err.message : "Batch translation failed";
          setError(errorMessage);
          setTranslatedTexts(texts);
        }
      })
      .finally(() => {
        if (isMountedRef.current) {
          setIsLoading(false);
          lastRequestRef.current = "";
        }
      });
  }, [
    textsKey,
    texts,
    sourceLanguage,
    targetLanguage,
    translateBatch,
    enabled,
  ]);

  return { translatedTexts, isLoading, error };
}

// Utility function to generate consistent text hash
function generateTextHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}