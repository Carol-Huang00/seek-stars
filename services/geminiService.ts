import { GoogleGenAI } from "@google/genai";
import { ConstellationData } from "../types";

const getApiKey = (): string | undefined => {
  return process.env.API_KEY;
}

export const generateInterpretation = async (
  constellation: ConstellationData, 
  birthDate: string
): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("No API Key found in environment.");
    return "星宿指引人生方向，福祸相依，唯心所造。";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      用户生日: ${birthDate}
      计算得出的中国二十八星宿: ${constellation.fullName}
      所属: ${constellation.direction}
      传统描述: ${constellation.description}

      请扮演一位精通中国传统文化的国学大师。
      请基于以上信息，为该用户生成一段“星宿启示”。
      要求：
      1. 文笔优美，古风与现代结合。
      2. 包含对性格的简短分析。
      3. 提供一句今日或近期的人生建议。
      4. 篇幅控制在100字左右。
      5. 不要解释计算过程，直接给出结果。
      6. 语气神秘而温暖。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "星光照耀，前程似锦。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "星云流转，万物生辉。心存善念，必有回响。";
  }
};