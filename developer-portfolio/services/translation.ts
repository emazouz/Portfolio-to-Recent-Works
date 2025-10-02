import type { Translation } from "@/store/translationStore"

const BACKEND_URL = "http://localhost:3001"

export interface TranslateRequest {
  text: string
  sourceLanguage: string
  targetLanguage: string
  key?: string
}

export interface TranslateResponse {
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  confidence?: number
}

export class TranslationService {
  private static instance: TranslationService
  private cache = new Map<string, Translation>()

  static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService()
    }
    return TranslationService.instance
  }

  private generateCacheKey(text: string, sourceLanguage: string, targetLanguage: string): string {
    return `${sourceLanguage}-${targetLanguage}-${text.substring(0, 50)}`
  }

  async translateText(request: TranslateRequest): Promise<Translation> {
    const { text, sourceLanguage, targetLanguage, key } = request

    // Check cache first
    const cacheKey = this.generateCacheKey(text, sourceLanguage, targetLanguage)
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          sourceLanguage,
          targetLanguage,
        }),
      })

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`)
      }

      const data: TranslateResponse = await response.json()

      const translation: Translation = {
        key: key || cacheKey,
        originalText: text,
        translatedText: data.translatedText,
        sourceLanguage: data.sourceLanguage,
        targetLanguage: data.targetLanguage,
        timestamp: Date.now(),
      }

      // Cache the translation
      this.cache.set(cacheKey, translation)

      return translation
    } catch (error) {
      console.error("Translation error:", error)
      throw new Error(error instanceof Error ? error.message : "Translation failed")
    }
  }

  async translateBatch(requests: TranslateRequest[]): Promise<Translation[]> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/translate/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requests }),
      })

      if (!response.ok) {
        throw new Error(`Batch translation failed: ${response.statusText}`)
      }

      const data: TranslateResponse[] = await response.json()

      return data.map((item, index) => {
        const request = requests[index]
        const translation: Translation = {
          key: request.key || this.generateCacheKey(request.text, request.sourceLanguage, request.targetLanguage),
          originalText: request.text,
          translatedText: item.translatedText,
          sourceLanguage: item.sourceLanguage,
          targetLanguage: item.targetLanguage,
          timestamp: Date.now(),
        }

        // Cache each translation
        const cacheKey = this.generateCacheKey(request.text, request.sourceLanguage, request.targetLanguage)
        this.cache.set(cacheKey, translation)

        return translation
      })
    } catch (error) {
      console.error("Batch translation error:", error)
      throw new Error(error instanceof Error ? error.message : "Batch translation failed")
    }
  }

  async detectLanguage(text: string): Promise<string> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/translate/detect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error(`Language detection failed: ${response.statusText}`)
      }

      const data = await response.json()
      return data.language
    } catch (error) {
      console.error("Language detection error:", error)
      throw new Error(error instanceof Error ? error.message : "Language detection failed")
    }
  }

  clearCache(): void {
    this.cache.clear()
  }
}

export const translationService = TranslationService.getInstance()
