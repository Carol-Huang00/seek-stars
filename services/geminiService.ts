import { GoogleGenAI } from "@google/genai";
import { ConstellationData } from "../types";

const getApiKey = (): string | undefined => {
  return process.env.API_KEY;
}

// Generate Image using Gemini 2.5 Flash Image (Nano Banana)
export const generateStarImage = async (prompt: string): Promise<string | undefined> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("No API Key found. Cannot generate image.");
    return undefined;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Call the model
    // Using 'gemini-2.5-flash-image' as requested (Nano Banana)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4", // Portrait for cards
          // imageSize: "1K" // Optional for Pro models
        }
      }
    });

    // Extract image
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    return undefined;
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    return undefined;
  }
};
