import { useState, useCallback } from 'react';
import { generateContent, type GenerateContentOptions } from '@/lib/gemini';

export function useGemini(defaultOptions: GenerateContentOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const generate = useCallback(
    async (prompt: string, options?: GenerateContentOptions) => {
      setLoading(true);
      setError(null);
      setResult(null);
      try {
        const { text } = await generateContent(prompt, { ...defaultOptions, ...options });
        setResult(text);
        return text;
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Request failed';
        setError(message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clear = useCallback(() => {
    setError(null);
    setResult(null);
  }, []);

  return { generate, loading, error, result, clear };
}
