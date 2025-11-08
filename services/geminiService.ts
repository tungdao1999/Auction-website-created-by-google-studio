
import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is available
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateDescription = async (itemName: string): Promise<string> => {
  if (!API_KEY) {
    return "AI service is not available. Please enter a description manually.";
  }

  const prompt = `Write a compelling and concise auction description for the following item: "${itemName}". 
  Highlight its potential key features and create a sense of value and urgency for bidders. 
  The description should be no more than 3-4 sentences.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating description with Gemini API:", error);
    return "Failed to generate AI description. Please write one manually.";
  }
};
