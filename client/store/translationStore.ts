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
        { code: "it", name: "Italiano", flag: "🇮🇹" },
        { code: "pt", name: "Português", flag: "🇵🇹" },
        { code: "ru", name: "Русский", flag: "🇷🇺" },
        { code: "ja", name: "日本語", flag: "🇯🇵" },
        { code: "ko", name: "한국어", flag: "🇰🇷" },
        { code: "zh", name: "中文", flag: "🇨🇳" },
        { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
      ],
      translations: {},
      isTranslating: false,
      error: null,

      setLanguage: (language: string) => {
        set({ currentLanguage: language, error: null });
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
