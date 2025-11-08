import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

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

export const generateBotResponse = async (currentProduct: Product, sellerProducts: Product[], question: string): Promise<string> => {
    if (!API_KEY) {
        return "🤖 Bot: The AI assistant is currently unavailable.";
    }

    const otherItemsList = sellerProducts
        .filter(p => p.id !== currentProduct.id)
        .map(p => `- ${p.name}`)
        .join('\n');

    const prompt = `You are an automated assistant for an online auction seller named ${currentProduct.seller.name}.

You are in a chat with a buyer about this specific item:
---
Item Name: "${currentProduct.name}"
Item Description: "${currentProduct.description}"
---

For additional context, here is a list of ALL other items the seller is currently listing:
---
${otherItemsList.length > 0 ? otherItemsList : "No other items are listed."}
---

The buyer has just asked the following question: "${question}"

Your task is to answer the buyer's question.
- Use the information from the specific item description first.
- If the question seems to be about other items (e.g., "do you have other jackets?", "what else are you selling?"), use the list of all items to answer. You can mention items from the list.
- Be friendly, helpful, and concise.
- If you cannot answer the question using any of the provided information, politely state that you do not have that detail.
- Always start your response with '🤖 Bot:'.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        return response.text;
    } catch (error) {
        console.error("Error generating bot response with Gemini API:", error);
        return "🤖 Bot: I encountered an error. Please ask the seller directly.";
    }
};