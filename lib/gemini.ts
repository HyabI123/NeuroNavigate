/**
 * Google Gemini API client (REST). Works in Expo/React Native.
 * Get an API key: https://aistudio.google.com/apikey
 */

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export type GeminiModel =
  | 'gemini-2.5-flash'
  | 'gemini-2.0-flash'
  | 'gemini-1.5-flash'
  | 'gemini-1.5-pro'
  | 'gemini-1.5-flash-8b';

export interface GenerateContentOptions {
  model?: GeminiModel;
  maxOutputTokens?: number;
  temperature?: number;
  systemInstruction?: string;
}

export interface GenerateContentResult {
  text: string;
  raw?: unknown;
}

function getApiKey(): string {
  const key = process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim();
  if (!key) {
    throw new Error(
      'Missing EXPO_PUBLIC_GEMINI_API_KEY. Add it to .env and restart. Get a key at https://aistudio.google.com/apikey'
    );
  }
  return key;
}

/**
 * Generate text from Gemini. Uses fetch so it works in Expo/React Native.
 */
export async function generateContent(
  prompt: string,
  options: GenerateContentOptions = {}
): Promise<GenerateContentResult> {
  const apiKey = getApiKey();
  const model = options.model ?? 'gemini-2.5-flash';
  const url = `${GEMINI_BASE}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const body: Record<string, unknown> = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      maxOutputTokens: options.maxOutputTokens ?? 1024,
      temperature: options.temperature ?? 0.7,
    },
  };
  if (options.systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: options.systemInstruction }],
    };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    let message = `Gemini API error ${res.status}`;
    try {
      const errJson = JSON.parse(errText);
      message = errJson?.error?.message ?? errText ?? message;
    } catch {
      message = errText || message;
    }
    throw new Error(message);
  }

  interface GeminiResponse {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  }
  const data: GeminiResponse = await res.json();
  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';

  return { text, raw: data };
}

export type ApiCheckResult = { ok: true } | { ok: false; error: string };

let apiCheckPromise: Promise<ApiCheckResult> | null = null;

/**
 * Quick check that the Gemini API key works. Only calls the API once per app session;
 * later calls get the cached result (avoids 429 from repeated checks).
 */
export async function checkGeminiApi(): Promise<ApiCheckResult> {
  if (apiCheckPromise) return apiCheckPromise;
  apiCheckPromise = (async () => {
    try {
      await generateContent('Reply with exactly: OK', {
        model: 'gemini-2.5-flash',
        maxOutputTokens: 10,
      });
      return { ok: true };
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      return { ok: false, error };
    }
  })();
  return apiCheckPromise;
}
