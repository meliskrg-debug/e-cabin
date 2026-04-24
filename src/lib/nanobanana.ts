import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const MODEL = "gemini-3.1-flash-image-preview";

async function compressImage(base64: string): Promise<{ data: string; mimeType: string }> {
  const buffer = Buffer.from(base64, "base64");
  const compressed = await sharp(buffer)
    .resize(512, 512, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 72 })
    .toBuffer();
  return { data: compressed.toString("base64"), mimeType: "image/jpeg" };
}

export async function generateImage({
  prompt,
  referenceImages,
}: {
  prompt: string;
  referenceImages: { mimeType: string; data: string }[];
}): Promise<{ mimeType: string; data: string }> {
  // Compress all reference images before sending
  const compressed = await Promise.all(
    referenceImages.map((img) => compressImage(img.data))
  );

  const parts: { inlineData?: { mimeType: string; data: string }; text?: string }[] = [
    ...compressed.map((img) => ({
      inlineData: { mimeType: img.mimeType, data: img.data },
    })),
    { text: prompt },
  ];

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts }],
    config: {
      responseModalities: ["IMAGE", "TEXT"],
    },
  });

  const candidates = response.candidates || [];
  console.log("Gemini candidates count:", candidates.length);
  for (const cand of candidates) {
    console.log("Candidate finishReason:", cand.finishReason);
    const parts = cand.content?.parts || [];
    console.log("Parts count:", parts.length);
    for (const part of parts) {
      if (part.text) console.log("Text part:", part.text.slice(0, 200));
      if (part.inlineData?.data) {
        return {
          mimeType: part.inlineData.mimeType || "image/png",
          data: part.inlineData.data,
        };
      }
    }
  }
  console.log("Full response:", JSON.stringify(response).slice(0, 500));
  throw new Error("Nano Banana 2 returned no image.");
}
