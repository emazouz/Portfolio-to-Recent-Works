import type { Request, Response } from "express";

// Configuration
const LIBRE_URL =
  process.env.LIBRE_TRANSLATE_URL || "https://libretranslate.com";
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_TEXT_LENGTH = 10000; // 10k characters per request
const MAX_BATCH_SIZE = 50; // Maximum number of texts in batch

// Supported language codes
const SUPPORTED_LANGUAGES = new Set([
  "en", "ar", "es", "fr", "de", "zh", "ja", "he", "fa", "ur",
  "it", "pt", "ru", "ko", "nl", "pl", "tr", "vi", "th", "id"
]);

// Types
interface TranslateRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

interface TranslateResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence?: number;
}

interface DetectResponse {
  language: string;
  confidence?: number;
}

interface LibreTranslateResponse {
  translatedText?: string;
  [key: string]: any;
}

interface LibreDetectResponse {
  language?: string;
  confidence?: number;
  [key: string]: any;
}

// Utility: Fetch with timeout
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = REQUEST_TIMEOUT
): Promise<globalThis.Response> {
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
      throw new Error("Translation service timeout");
    }
    throw error;
  }
}

// Utility: Validate language code
function isValidLanguage(lang: string): boolean {
  return SUPPORTED_LANGUAGES.has(lang.toLowerCase());
}

// Utility: Sanitize and validate text
function sanitizeText(text: string, maxLength: number = MAX_TEXT_LENGTH): string {
  if (typeof text !== "string") {
    throw new Error("Text must be a string");
  }

  const trimmed = text.trim();
  
  if (trimmed.length === 0) {
    throw new Error("Text cannot be empty");
  }

  if (trimmed.length > maxLength) {
    throw new Error(`Text exceeds maximum length of ${maxLength} characters`);
  }

  return trimmed;
}

// Core translation function
async function libreTranslate(
  text: string,
  source: string,
  target: string
): Promise<string> {
  // Validate inputs
  const sanitizedText = sanitizeText(text);
  
  if (!isValidLanguage(source)) {
    throw new Error(`Unsupported source language: ${source}`);
  }
  
  if (!isValidLanguage(target)) {
    throw new Error(`Unsupported target language: ${target}`);
  }

  // If source and target are the same, return original text
  if (source.toLowerCase() === target.toLowerCase()) {
    return sanitizedText;
  }

  try {
    const response = await fetchWithTimeout(
      `${LIBRE_URL}/translate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          q: sanitizedText, 
          source: source.toLowerCase(), 
          target: target.toLowerCase(), 
          format: "text" 
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("LibreTranslate API error:", errorText);
      throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
    }

    const data: LibreTranslateResponse = await response.json();
    
    // API may return { translatedText } or array format
    const translatedText =
      data?.translatedText ?? 
      (Array.isArray(data) && data[0]?.translatedText) ?? 
      null;

    if (!translatedText) {
      throw new Error("Invalid response format from translation service");
    }

    return translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    // Re-throw the error instead of silently returning original text
    throw error instanceof Error 
      ? error 
      : new Error("Translation failed");
  }
}

// Core language detection function
async function libreDetect(text: string): Promise<DetectResponse> {
  const sanitizedText = sanitizeText(text);

  try {
    const response = await fetchWithTimeout(
      `${LIBRE_URL}/detect`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: sanitizedText }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("LibreTranslate detect error:", errorText);
      throw new Error(`Detection API error: ${response.status} ${response.statusText}`);
    }

    const data: LibreDetectResponse | LibreDetectResponse[] = await response.json();
    
    // Handle array response format
    if (Array.isArray(data) && data.length > 0) {
      return {
        language: data[0].language || "en",
        confidence: data[0].confidence,
      };
    }
    
    // Handle object response format (ensure it's not an array)
    if (!Array.isArray(data) && typeof data === "object" && (data as LibreDetectResponse).language) {
      const obj = data as LibreDetectResponse;
      return {
        language: obj.language || "en",
        confidence: obj.confidence,
      };
    }

    throw new Error("Invalid response format from detection service");
  } catch (error) {
    console.error("Language detection error:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Language detection failed");
  }
}

// Controller: Translate single text
export const translateText = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    // Validate request body
    if (!text || !sourceLanguage || !targetLanguage) {
      return res.status(400).json({ 
        error: "Missing required fields",
        message: "Request must include text, sourceLanguage, and targetLanguage" 
      });
    }

    if (typeof text !== "string") {
      return res.status(400).json({ 
        error: "Invalid text format",
        message: "Text must be a string" 
      });
    }

    if (typeof sourceLanguage !== "string" || typeof targetLanguage !== "string") {
      return res.status(400).json({ 
        error: "Invalid language format",
        message: "Language codes must be strings" 
      });
    }

    // Perform translation
    const translatedText = await libreTranslate(
      text,
      sourceLanguage,
      targetLanguage
    );

    const response: TranslateResponse = {
      translatedText,
      sourceLanguage: sourceLanguage.toLowerCase(),
      targetLanguage: targetLanguage.toLowerCase(),
    };

    return res.json(response);
  } catch (error) {
    console.error("Translation endpoint error:", error);
    
    const message = error instanceof Error ? error.message : "Translation failed";
    const statusCode = message.includes("timeout") ? 504 : 500;

    return res.status(statusCode).json({ 
      error: "Translation error",
      message 
    });
  }
};

// Controller: Translate batch of texts
export const translateBatch = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { requests } = req.body;

    // Validate requests array
    if (!Array.isArray(requests)) {
      return res.status(400).json({ 
        error: "Invalid request format",
        message: "Requests must be an array" 
      });
    }

    if (requests.length === 0) {
      return res.status(400).json({ 
        error: "Empty request",
        message: "Requests array cannot be empty" 
      });
    }

    if (requests.length > MAX_BATCH_SIZE) {
      return res.status(400).json({ 
        error: "Batch size exceeded",
        message: `Maximum batch size is ${MAX_BATCH_SIZE} requests` 
      });
    }

    // Validate each request
    for (let i = 0; i < requests.length; i++) {
      const req = requests[i];
      if (!req?.text || !req?.sourceLanguage || !req?.targetLanguage) {
        return res.status(400).json({ 
          error: "Invalid request item",
          message: `Request at index ${i} is missing required fields` 
        });
      }
    }

    // Process all translations
    const results = await Promise.allSettled(
      requests.map(async (r: TranslateRequest) => {
        const translatedText = await libreTranslate(
          r.text,
          r.sourceLanguage,
          r.targetLanguage
        );
        
        return {
          translatedText,
          sourceLanguage: r.sourceLanguage.toLowerCase(),
          targetLanguage: r.targetLanguage.toLowerCase(),
        } as TranslateResponse;
      })
    );

    // Separate successful and failed translations
    const successResults: TranslateResponse[] = [];
    const errors: Array<{ index: number; error: string }> = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        successResults.push(result.value);
      } else {
        errors.push({ 
          index, 
          error: result.reason?.message || "Translation failed" 
        });
      }
    });

    // If all translations failed, return error
    if (successResults.length === 0) {
      return res.status(500).json({ 
        error: "All translations failed",
        message: "No translations were successful",
        errors 
      });
    }

    // Return results with partial error information if some failed
    const response: any = successResults;
    
    if (errors.length > 0) {
      return res.status(207).json({ // 207 Multi-Status
        results: response,
        errors,
        message: `${successResults.length} of ${requests.length} translations succeeded`
      });
    }

    return res.json(response);
  } catch (error) {
    console.error("Batch translation endpoint error:", error);
    
    const message = error instanceof Error ? error.message : "Batch translation failed";
    
    return res.status(500).json({ 
      error: "Batch translation error",
      message 
    });
  }
};

// Controller: Detect language
export const detectLanguage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { text } = req.body;

    // Validate request body
    if (!text) {
      return res.status(400).json({ 
        error: "Missing text",
        message: "Request must include text field" 
      });
    }

    if (typeof text !== "string") {
      return res.status(400).json({ 
        error: "Invalid text format",
        message: "Text must be a string" 
      });
    }

    // Perform language detection
    const result = await libreDetect(text);

    return res.json(result);
  } catch (error) {
    console.error("Language detection endpoint error:", error);
    
    const message = error instanceof Error ? error.message : "Language detection failed";
    const statusCode = message.includes("timeout") ? 504 : 500;

    return res.status(statusCode).json({ 
      error: "Detection error",
      message 
    });
  }
};

// Health check endpoint (optional but recommended)
export const healthCheck = async (_req: Request, res: Response): Promise<Response> => {
  try {
    // Test connectivity to LibreTranslate
    const response = await fetchWithTimeout(
      `${LIBRE_URL}/languages`,
      { method: "GET" },
      5000 // 5 second timeout for health check
    );

    if (!response.ok) {
      return res.status(503).json({ 
        status: "unhealthy",
        message: "Translation service is unavailable" 
      });
    }

    return res.json({ 
      status: "healthy",
      service: "LibreTranslate",
      url: LIBRE_URL 
    });
  } catch (error) {
    return res.status(503).json({ 
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Service check failed" 
    });
  }
};