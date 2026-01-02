
import { GoogleGenAI, Type } from "@google/genai";
import { Lead, Opportunity } from "../types";

// Initialization logic following strictly the @google/genai guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeOpportunityProbability = async (opp: Opportunity, lead?: Lead) => {
  try {
    const prompt = `
      Analyze the closing probability of this sales opportunity:
      Deal Name: ${opp.name}
      Amount: $${opp.amount}
      Stage: ${opp.stage}
      Lead Score: ${lead?.dnaScore || 'N/A'}
      Lead Pain Points: ${lead?.painPoints?.join(', ') || 'None stated'}

      Return a JSON object with:
      1. probability (0-100)
      2. reasoning (short summary)
      3. recommendation (one key action)
    `;

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

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Probability analysis failed", error);
    return { probability: 50, reasoning: "Unable to analyze at this time", recommendation: "Proceed with standard follow-up" };
  }
};

export const enrichAccountData = async (companyName: string, website: string) => {
  try {
    const prompt = `
      Enrich company data for ${companyName} (${website}). 
      Based on public knowledge as of late 2024, provide:
      1. Industry
      2. Size (employee range)
      3. Estimated Annual Revenue
      4. Core Product/Service description

      Return as JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            industry: { type: Type.STRING },
            size: { type: Type.STRING },
            revenue: { type: Type.NUMBER },
            description: { type: Type.STRING }
          },
          required: ["industry", "size", "revenue", "description"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Enrichment failed", error);
    return null;
  }
};

export const generateLeadInsights = async (leadName: string, company: string, painPoints: string[]) => {
  try {
    const prompt = `Analyze this sales lead: Name: ${leadName}, Company: ${company}, Stated Pain Points: ${painPoints.join(', ')}. Generate a personalized cold outreach email using the 'AIDA' (Attention, Interest, Desire, Action) framework. Focus on how our AI solutions solve their specific pain points.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class sales strategist and elite copywriter. Your goal is to generate high-intent outreach drafts.",
        temperature: 0.7
      }
    });

    return response.text || "Failed to generate insights.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI service.";
  }
};

export const generateObjectionHandling = async (leadName: string, company: string, painPoints: string[]) => {
  try {
    const prompt = `You are a master sales closer. Lead: ${leadName} at ${company}. Pain Points: ${painPoints.join(', ')}. 
    Identify 3 major objections this lead might have regarding price, integration, or status quo. 
    Provide a concise, empathetic, and powerful handling strategy for each. Format as: OBJECTION, THE PSYCHOLOGY, and THE REBUTTAL.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert in sales psychology and high-stakes negotiation.",
        temperature: 0.8
      }
    });

    return response.text || "Failed to generate objection handlers.";
  } catch (error) {
    console.error("Gemini Objection Error:", error);
    return "Error generating objection strategies.";
  }
};

export const generateSalesInsights = async (leadName: string, company: string, painPoints: string[]) => {
  try {
    const prompt = `Perform a Strategic Sales Audit for ${leadName} at ${company}. 
    Based on their known pain points (${painPoints.join(', ')}), generate a strategic sales playbook including:
    1. A 'Trojan Horse' Entry: A low-risk product or feature to win the initial contract.
    2. Expansion Strategy: How to grow this account over the next 12-24 months.
    3. Stakeholder Mapping: Which departments (IT, HR, Finance) need to be involved and why.
    4. Competitive Edge: Why our specific solution beats the status quo for their specific needs.
    5. High-Value Conversation Starter: A specific insight about their industry to use in the next call.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a Senior Strategic Sales Consultant. Your recommendations must be professional, insightful, and actionable.",
        temperature: 0.6
      }
    });

    return response.text || "Failed to generate strategic recommendations.";
  } catch (error) {
    console.error("Gemini Sales Insights Error:", error);
    return "Error generating strategic insights.";
  }
};

export const generateAutomatedFollowUp = async (leadName: string, company: string, status: string, lastTouch: string, painPoints: string[]) => {
  try {
    const prompt = `Generate a personalized follow-up for ${leadName} (${company}). Status: ${status}, Last touch: ${lastTouch}. Mention their pain point: ${painPoints[0] || 'operational efficiency'}. Propose a low-friction 10-minute check-in.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an elite Sales Development Representative.",
        temperature: 0.8
      }
    });

    return response.text || "Failed to generate follow-up content.";
  } catch (error) {
    console.error("Gemini Follow-up Error:", error);
    return "Error generating AI follow-up.";
  }
};

export const scanNewLeads = async (industry: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a list of 5 potential high-value sales leads for the ${industry} industry. For each lead, provide a company name, a contact person name, a potential 'signal' (recent news/event), and a DNA score (1-100).`,
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

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Scan Error:", error);
    return [];
  }
};
