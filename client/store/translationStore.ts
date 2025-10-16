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
      ],
      translations: {},
      isTranslating: false,
      error: null,

      setLanguage: (language: string) => {
        const normalized = language.toLowerCase().split("-")[0];
        const allowed = ["en", "ar"];
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
        set({ translations: {} });
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
