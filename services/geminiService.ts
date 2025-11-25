
import { GoogleGenAI } from "@google/genai";

// 安全获取 API Key (适配 Vite 和本地环境)
const getApiKey = () => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    // @ts-ignore
    return process.env.API_KEY;
  }
  return '';
};

const apiKey = getApiKey();

// 只有当 Key 存在时才初始化，防止报错
const ai = apiKey ? new GoogleGenAI({ apiKey: apiKey }) : null;

export const generateStarImage = async (prompt: string): Promise<string | undefined> => {
  if (!ai) {
    console.warn("Gemini API Key 未配置。请在 .env 文件中设置 VITE_API_KEY，或确保环境变量已注入。");
    // 如果没有 Key，返回 undefined，UI 层会处理（不显示生成按钮或报错）
    return undefined;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        // High quality generation config
        temperature: 1.0, 
      }
    });

    // Extract image from response
    if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return undefined;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return undefined;
  }
};
