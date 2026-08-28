import { GoogleGenAI } from "@google/genai";

const REQUEST_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS || 60000);
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  timeout_ms: REQUEST_TIMEOUT_MS,
  retry_config: { strategy: "none" },
});

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not configured. AI evaluation requests will fail.");
}

// The model to use
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-3.6-flash";

/**
 * Helper to call the Gemini API and enforce JSON response
 */
export async function callGemini(systemPrompt, promptText) {
  const startedAt = Date.now();
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.2, // Low temperature for more deterministic/factual output
      },
    });

    const text = typeof response.text === "function" ? response.text() : response.text;
    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    // Attempt to parse it as JSON to ensure validity before returning
    try {
      const parsed = JSON.parse(text);
      return parsed;
    } catch (e) {
      console.error("Failed to parse Gemini JSON output:", text);
      throw new Error("Invalid JSON returned from model");
    }
  } catch (error) {
    console.error(`Error calling Gemini after ${Date.now() - startedAt}ms:`, error);
    throw error;
  }
}
