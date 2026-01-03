import { GoogleGenAI, Type } from "@google/genai";
import { Lead, Opportunity } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeOpportunityProbability = async (opp: Opportunity, lead?: Lead) => {
  try {
    const prompt = `Analyze closing probability for Deal: ${opp.name}, Stage: ${opp.stage}, Amount: $${opp.amount}. Lead Pain Points: ${lead?.painPoints?.join(', ') || 'N/A'}. Return JSON {probability, reasoning, recommendation}.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            probability: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            recommendation: { type: Type.STRING }
          },
          required: ["probability", "reasoning", "recommendation"]
        }
      }
    });
    return JSON.parse(response.text ?? "{}");
  } catch (e) {
    return { probability: 50, reasoning: "AI Offline", recommendation: "Follow standard procedure" };
  }
};

export const generateLeadInsights = async (leadName: string, company: string, painPoints: string[]) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a personalized high-conversion outreach for ${leadName} at ${company}. Pain points: ${painPoints.join(', ')}.`,
    config: { systemInstruction: "You are an elite SDR." }
  });
  return response.text;
};

export const generateObjectionHandling = async (leadName: string, company: string, painPoints: string[]) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `List 3 likely objections for ${company} (${painPoints.join(', ')}) and how to handle them.`,
  });
  return response.text;
};

export const generateSalesInsights = async (leadName: string, company: string, painPoints: string[]) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Create a 12-month expansion strategy for ${company} based on ${painPoints.join(', ')}.`,
  });
  return response.text;
};

export const generateAutomatedFollowUp = async (leadName: string, company: string, status: string, lastTouch: string, painPoints: string[]) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a short, punchy re-engagement email for ${leadName}. Status: ${status}.`,
  });
  return response.text;
};

export const scanNewLeads = async (industry: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Find 5 potential leads for ${industry}. Return JSON array of {company, contact, signal, dnaScore}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            company: { type: Type.STRING },
            contact: { type: Type.STRING },
            signal: { type: Type.STRING },
            dnaScore: { type: Type.NUMBER }
          }
        }
      }
    }
  });
  return JSON.parse(response.text ?? "[]");
};