import type { Request, Response } from "express";

const LIBRE_URL =
  process.env.LIBRE_TRANSLATE_URL || "https://libretranslate.com";

async function libreTranslate(text: string, source: string, target: string) {
  try {
    const res = await fetch(`${LIBRE_URL}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, source, target, format: "text" }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data: any = await res.json();
    // API may return { translatedText } or array; normalize
    const translatedText =
      data?.translatedText ?? data?.[0]?.translatedText ?? text;
    return translatedText as string;
  } catch {
    // Fallback: return original text when translation fails
    return text;
  }
}

async function libreDetect(text: string) {
  try {
    const res = await fetch(`${LIBRE_URL}/detect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data: any = await res.json();
    const language =
      Array.isArray(data) && data[0]?.language ? data[0].language : "en";
    return language as string;
  } catch {
    return "en";
  }
}

export const translateText = async (req: Request, res: Response) => {
  const { text, sourceLanguage, targetLanguage } = req.body || {};
  if (typeof text !== "string" || !sourceLanguage || !targetLanguage) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const translatedText = await libreTranslate(
    text,
    sourceLanguage,
    targetLanguage
  );
  return res.json({ translatedText, sourceLanguage, targetLanguage });
};

export const translateBatch = async (req: Request, res: Response) => {
  const { requests } = req.body || {};
  if (!Array.isArray(requests)) {
    return res.status(400).json({ message: "Invalid request body" });
  }
  const results = await Promise.all(
    requests.map(async (r: any) => {
      const text = String(r?.text ?? "");
      const source = String(r?.sourceLanguage ?? "en");
      const target = String(r?.targetLanguage ?? "en");
      const translatedText = await libreTranslate(text, source, target);
      return { translatedText, sourceLanguage: source, targetLanguage: target };
    })
  );
  return res.json(results);
};

export const detectLanguage = async (req: Request, res: Response) => {
  const { text } = req.body || {};
  if (typeof text !== "string") {
    return res.status(400).json({ message: "Invalid request body" });
  }
  const language = await libreDetect(text);
  return res.json({ language });
};
