import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const MODEL = "gemini-3.1-flash-image-preview";

async function compressImage(base64: string): Promise<{ data: string; mimeType: string }> {
  const buffer = Buffer.from(base64, "base64");
  const compressed = await sharp(buffer)
    .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toBuffer();
  return { data: compressed.toString("base64"), mimeType: "image/jpeg" };
}

async function callGemini(parts: { inlineData?: { mimeType: string; data: string }; text?: string }[]): Promise<{ mimeType: string; data: string }> {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts }],
    config: {
      responseModalities: ["IMAGE", "TEXT"],
    },
  });

  const candidates = response.candidates || [];
  console.log("Gemini candidates:", candidates.length, "finishReasons:", candidates.map(c => c.finishReason));

  let textResponse = "";
  for (const cand of candidates) {
    for (const part of cand.content?.parts || []) {
      if (part.text) textResponse += part.text;
      if (part.inlineData?.data) {
        return {
          mimeType: part.inlineData.mimeType || "image/png",
          data: part.inlineData.data,
        };
      }
    }
  }

  const reason = candidates[0]?.finishReason || "UNKNOWN";
  throw new Error(`No image from Gemini. finishReason=${reason}. text=${textResponse.slice(0, 200)}`);
}

export async function generateImage({
  prompt,
  referenceImages,
}: {
  prompt: string;
  referenceImages: { mimeType: string; data: string }[];
}): Promise<{ mimeType: string; data: string }> {
  const compressed = await Promise.all(
    referenceImages.map((img) => compressImage(img.data))
  );

  const parts: { inlineData?: { mimeType: string; data: string }; text?: string }[] = [
    ...compressed.map((img) => ({
      inlineData: { mimeType: img.mimeType, data: img.data },
    })),
    { text: prompt },
  ];

  // Try up to 2 times — keep total under 60s for Vercel free plan
  let lastError: Error = new Error("Unknown error");
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`Gemini attempt ${attempt}/2`);
      return await callGemini(parts);
    } catch (err) {
      lastError = err as Error;
      console.error(`Gemini attempt ${attempt} failed:`, lastError.message);
      if (attempt < 2) await new Promise(r => setTimeout(r, 1000));
    }
  }

  throw lastError;
}
