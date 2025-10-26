import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Translation {
  key: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: number;
}

export interface TranslationState {
  currentLanguage: string;
  supportedLanguages: { code: string; name: string; flag: string }[];
  translations: Record<string, Translation>;
  isTranslating: boolean;
  error: string | null;

  // Actions
  setLanguage: (language: string) => void;
  addTranslation: (translation: Translation) => void;
  getTranslation: (key: string, targetLanguage: string) => Translation | null;
  clearTranslations: () => void;
  setTranslating: (isTranslating: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTranslationStore = create<TranslationState>()(
  persist(
    (set, get) => ({
      currentLanguage: "en",
      supportedLanguages: [
        { code: "en", name: "English", flag: "🇺🇸" },
        { code: "ar", name: "العربية", flag: "🇸🇦" },
        { code: "es", name: "Español", flag: "🇪🇸" },
        { code: "fr", name: "Français", flag: "🇫🇷" },
        { code: "de", name: "Deutsch", flag: "🇩🇪" },
        { code: "zh", name: "中文", flag: "🇨🇳" },
        { code: "ja", name: "日本語", flag: "🇯🇵" },
      ],
      translations: {},
      isTranslating: false,
      error: null,

      setLanguage: (language: string) => {
        const normalized = language.toLowerCase().split("-")[0];
        const allowed = ["en", "ar", "es", "fr", "de", "zh", "ja"];
        set({
          currentLanguage: allowed.includes(normalized) ? normalized : "en",
          error: null,
        });
      },

      addTranslation: (translation: Translation) => {
        const key = `${translation.key}_${translation.targetLanguage}`;
        set((state) => ({
          translations: {
            ...state.translations,
            [key]: translation,
          },
        }));
      },

      getTranslation: (key: string, targetLanguage: string) => {
        const translationKey = `${key}_${targetLanguage}`;
        return get().translations[translationKey] || null;
      },

      clearTranslations: () => {
        set({ translations: {}, error: null });
      },

      setTranslating: (isTranslating: boolean) => {
        set({ isTranslating });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: "translation-store",
      partialize: (state) => ({
        currentLanguage: state.currentLanguage,
        translations: state.translations,
      }),
    }
  )
);

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_CACHE_SIZE = 1000;
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours

export interface TranslateRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  key?: string;
}

export interface TranslateResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence?: number;
}

interface CachedTranslation extends Translation {
  expiresAt: number;
}

export class TranslationService {
  private static instance: TranslationService;
  private cache = new Map<string, CachedTranslation>();

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  private generateCacheKey(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): string {
    // Use full text for cache key to avoid collisions
    const textHash = this.hashString(text);
    return `${sourceLanguage}-${targetLanguage}-${textHash}`;
  }

  private hashString(str: string): string {
    // Simple hash function for cache keys
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private validateLanguageCode(code: string): boolean {
    const validCodes = ["en", "ar", "es", "fr", "de", "zh", "ja"];
    return validCodes.includes(code.toLowerCase());
  }

  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (value.expiresAt < now) {
        this.cache.delete(key);
      }
    }
  }

  private enforceCacheLimit(): void {
    if (this.cache.size > MAX_CACHE_SIZE) {
      // Remove oldest entries
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toRemove = entries.slice(0, this.cache.size - MAX_CACHE_SIZE);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number = REQUEST_TIMEOUT
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout - please try again");
      }
      throw error;
    }
  }

  async translateText(request: TranslateRequest): Promise<Translation> {
    const { text, sourceLanguage, targetLanguage, key } = request;

    // Validate input
    if (!text || text.trim().length === 0) {
      throw new Error("Text cannot be empty");
    }

    if (!this.validateLanguageCode(sourceLanguage)) {
      throw new Error(`Invalid source language: ${sourceLanguage}`);
    }

    if (!this.validateLanguageCode(targetLanguage)) {
      throw new Error(`Invalid target language: ${targetLanguage}`);
    }

    if (sourceLanguage === targetLanguage) {
      // Return original text if languages are the same
      return {
        key: key || this.generateCacheKey(text, sourceLanguage, targetLanguage),
        originalText: text,
        translatedText: text,
        sourceLanguage,
        targetLanguage,
        timestamp: Date.now(),
      };
    }

    // Clean expired cache entries
    this.cleanExpiredCache();

    // Check cache first
    const cacheKey = this.generateCacheKey(text, sourceLanguage, targetLanguage);
    const cachedTranslation = this.cache.get(cacheKey);
    
    if (cachedTranslation && cachedTranslation.expiresAt > Date.now()) {
      return {
        key: cachedTranslation.key,
        originalText: cachedTranslation.originalText,
        translatedText: cachedTranslation.translatedText,
        sourceLanguage: cachedTranslation.sourceLanguage,
        targetLanguage: cachedTranslation.targetLanguage,
        timestamp: cachedTranslation.timestamp,
      };
    }

    try {
      const response = await this.fetchWithTimeout(
        `${BACKEND_URL}/api/translate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            sourceLanguage,
            targetLanguage,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Translation failed: ${response.statusText}`
        );
      }

      const data: TranslateResponse = await response.json();

      const translation: Translation = {
        key: key || cacheKey,
        originalText: text,
        translatedText: data.translatedText,
        sourceLanguage: data.sourceLanguage,
        targetLanguage: data.targetLanguage,
        timestamp: Date.now(),
      };

      // Cache the translation with expiry
      this.cache.set(cacheKey, {
        ...translation,
        expiresAt: Date.now() + CACHE_EXPIRY_TIME,
      });

      this.enforceCacheLimit();

      return translation;
    } catch (error) {
      console.error("Translation error:", error);
      throw new Error(
        error instanceof Error ? error.message : "Translation failed"
      );
    }
  }

  async translateBatch(requests: TranslateRequest[]): Promise<Translation[]> {
    if (!requests || requests.length === 0) {
      throw new Error("Batch requests cannot be empty");
    }

    // Validate all requests
    for (const req of requests) {
      if (!req.text || req.text.trim().length === 0) {
        throw new Error("All texts must be non-empty");
      }
      if (!this.validateLanguageCode(req.sourceLanguage)) {
        throw new Error(`Invalid source language: ${req.sourceLanguage}`);
      }
      if (!this.validateLanguageCode(req.targetLanguage)) {
        throw new Error(`Invalid target language: ${req.targetLanguage}`);
      }
    }

    try {
      const response = await this.fetchWithTimeout(
        `${BACKEND_URL}/api/translate/batch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requests }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Batch translation failed: ${response.statusText}`
        );
      }

      const data: TranslateResponse[] = await response.json();

      return data.map((item, index) => {
        const request = requests[index];
        const cacheKey = this.generateCacheKey(
          request.text,
          request.sourceLanguage,
          request.targetLanguage
        );

        const translation: Translation = {
          key: request.key || cacheKey,
          originalText: request.text,
          translatedText: item.translatedText,
          sourceLanguage: item.sourceLanguage,
          targetLanguage: item.targetLanguage,
          timestamp: Date.now(),
        };

        // Cache each translation with expiry
        this.cache.set(cacheKey, {
          ...translation,
          expiresAt: Date.now() + CACHE_EXPIRY_TIME,
        });

        return translation;
      });
    } catch (error) {
      console.error("Batch translation error:", error);
      throw new Error(
        error instanceof Error ? error.message : "Batch translation failed"
      );
    } finally {
      this.enforceCacheLimit();
    }
  }

  async detectLanguage(text: string): Promise<string> {
    if (!text || text.trim().length === 0) {
      throw new Error("Text cannot be empty");
    }

    try {
      const response = await this.fetchWithTimeout(
        `${BACKEND_URL}/api/translate/detect`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Language detection failed: ${response.statusText}`
        );
      }

      const data = await response.json();
      
      if (!data.language) {
        throw new Error("Invalid response from language detection");
      }

      return data.language;
    } catch (error) {
      console.error("Language detection error:", error);
      throw new Error(
        error instanceof Error ? error.message : "Language detection failed"
      );
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  getCacheStats(): { size: number; maxSize: number; expiryTime: number } {
    return {
      size: this.cache.size,
      maxSize: MAX_CACHE_SIZE,
      expiryTime: CACHE_EXPIRY_TIME,
    };
  }
}

export const translationService = TranslationService.getInstance();