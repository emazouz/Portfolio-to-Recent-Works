export interface TranslationContextType {
  t: (text: string, key?: string) => string;
  currentLanguage: string;
  isTranslating: boolean;
}

// Translation Context Types
export interface TranslationContextType {
  // Core translation function
  t: (text: string, key?: string) => string;

  // Language state
  currentLanguage: string;
  isTranslating: boolean;
  error: string | null;

  // Additional language utilities
  isRTL: boolean;
  direction: "ltr" | "rtl";
  languageLabel: string;

  // Language management
  setLanguage: (language: string) => void;
  supportedLanguages: { code: string; name: string; flag: string }[];

  // Translation functions
  translate: (
    text: string,
    options?: {
      sourceLanguage?: string;
      targetLanguage?: string;
      key?: string;
    }
  ) => Promise<string>;

  translateBatch: (
    texts: string[],
    options?: {
      sourceLanguage?: string;
      targetLanguage?: string;
    }
  ) => Promise<string[]>;

  detectLanguage: (text: string) => Promise<string>;
  clearCache: () => void;

  // Store access
  translations: Record<string, Translation>;
}

// Core translation interface
export interface Translation {
  key: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: number;
}

// Translation request/response types
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

// Hook return types
export interface UseTranslatedTextReturn {
  translatedText: string;
  isLoading: boolean;
  error: string | null;
}

export interface UseBatchTranslatedTextsReturn {
  translatedTexts: string[];
  isLoading: boolean;
  error: string | null;
}

// Language configuration
export interface LanguageMetadata {
  dir: "ltr" | "rtl";
  label: string;
}

export interface SupportedLanguage {
  code: string;
  name: string;
  flag: string;
}
