import { GoogleGenAI, Type } from "@google/genai";
import { Lead, Opportunity } from "./types.ts";

// Initialize AI with the environment key
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Probability analysis for deals using Gemini 3 Flash for speed.
 */
export const analyzeOpportunityProbability = async (opp: Opportunity, lead?: Lead) => {
  try {
    const prompt = `Analyze closing probability for Deal: ${opp.name}, Stage: ${opp.stage}, Amount: $${opp.amount}. Lead context: ${lead?.niche}, Main Pain: ${lead?.mainPain}. Return JSON: {probability, reasoning, recommendation}.`;
    
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
    return { probability: 50, reasoning: "Analysis Engine Offline", recommendation: "Manual audit required" };
  }
};

/**
 * High-quality outreach generation using Gemini 3 Pro.
 */
export const generateLeadInsights = async (leadName: string, company: string, painPoints: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Draft a high-conversion, value-first sales email for ${leadName} at ${company}. Focus on solving: ${painPoints.join(', ')}. No fluff, be direct.`,
      config: { 
        systemInstruction: "You are an elite Sales Development Representative (SDR). Use a professional yet conversational tone." 
      }
    });
    return response.text;
  } catch (e) {
    return "Unable to generate outreach draft at this time.";
  }
};

/**
 * Dynamic re-engagement follow-ups.
 */
export const generateAutomatedFollowUp = async (leadName: string, company: string, status: string, lastTouch: string, painPoints: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a punchy re-engagement message for ${leadName}. Status: ${status}, Last Touch: ${lastTouch}. Mention: ${painPoints[0] || 'Business Growth'}.`,
    });
    return response.text;
  } catch (e) {
    return "Follow-up logic paused.";
  }
};

/**
 * Market scanning simulation.
 */
export const scanNewLeads = async (industry: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Identify 5 hypothetical but realistic high-value enterprise leads in the ${industry} sector. Provide company name, a likely contact person, a current market signal (like hiring or expansion), and a DNA score (0-100).`,
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
            },
            required: ["company", "contact", "signal", "dnaScore"]
          }
        }
      }
    });
    return JSON.parse(response.text ?? "[]");
  } catch (e) {
    return [];
  }
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
    contents: `Create a 12-month account growth roadmap for ${company} based on ${painPoints.join(', ')}.`,
  });
  return response.text;
};