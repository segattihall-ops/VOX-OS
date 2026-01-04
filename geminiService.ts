import { Groq } from "groq-sdk";
import { Lead, Opportunity } from "./types.ts";

// Use Vite-compatible env variable
const apiKey = import.meta.env.VITE_GROQ_API_KEY;

if (!apiKey) {
  console.warn("VITE_GROQ_API_KEY not set – AI features will return fallbacks.");
}

const groq = new Groq({ apiKey });

/**
 * Probability analysis for deals using Llama 3.1 70B (fast & accurate).
 */
export const analyzeOpportunityProbability = async (opp: Opportunity, lead?: Lead) => {
  try {
    const prompt = `Analyze closing probability for Deal: ${opp.name}, Stage: ${opp.stage}, Amount: $${opp.amount}. Lead context: ${lead?.niche}, Main Pain: ${lead?.mainPain}. Return ONLY valid JSON: {"probability": number, "reasoning": string, "recommendation": string}.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    return content ? JSON.parse(content) : { probability: 50, reasoning: "AI Offline", recommendation: "Manual audit required" };
  } catch (e) {
    console.error("Groq error:", e);
    return { probability: 50, reasoning: "Analysis Engine Offline", recommendation: "Manual audit required" };
  }
};

/**
 * High-quality outreach generation using Llama 3.1 70B.
 */
export const generateLeadInsights = async (leadName: string, company: string, painPoints: string[]) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an elite Sales Development Representative (SDR). Use a professional yet conversational tone. No fluff — be direct and value-first."
        },
        {
          role: "user",
          content: `Draft a high-conversion sales email for ${leadName} at ${company}. Focus on solving: ${painPoints.join(', ')}.`
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content ?? "Unable to generate outreach draft.";
  } catch (e) {
    console.error("Groq error:", e);
    return "Unable to generate outreach draft at this time.";
  }
};

/**
 * Dynamic re-engagement follow-ups.
 */
export const generateAutomatedFollowUp = async (leadName: string, company: string, status: string, lastTouch: string, painPoints: string[]) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Generate a short, punchy re-engagement message for ${leadName}. Current status: ${status}, Last Touch: ${lastTouch}. Reference: ${painPoints[0] || 'Business Growth'}.`
        }
      ],
      temperature: 0.6,
    });

    return response.choices[0]?.message?.content ?? "Follow-up logic paused.";
  } catch (e) {
    console.error("Groq error:", e);
    return "Follow-up logic paused.";
  }
};

/**
 * Market scanning simulation (hypothetical leads).
 */
export const scanNewLeads = async (industry: string) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Identify 5 hypothetical but realistic high-value enterprise leads in the ${industry} sector. Provide company name, likely contact, current market signal (e.g. hiring, funding), and DNA score (0-100). Return ONLY valid JSON array.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return [];

    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  } catch (e) {
    console.error("Groq error:", e);
    return [];
  }
};

/**
 * Objection handling suggestions.
 */
export const generateObjectionHandling = async (leadName: string, company: string, painPoints: string[]) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `List 3 likely objections for ${company} (${painPoints.join(', ')}) and how to handle them professionally.`
        }
      ],
      temperature: 0.6,
    });

    return response.choices[0]?.message?.content ?? "Unable to generate objections.";
  } catch (e) {
    console.error("Groq error:", e);
    return "Unable to generate objections.";
  }
};

/**
 * Long-term account growth strategy.
 */
export const generateSalesInsights = async (leadName: string, company: string, painPoints: string[]) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Create a 12-month account growth roadmap for ${company} based on these pain points: ${painPoints.join(', ')}. Be strategic and actionable.`
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content ?? "Unable to generate insights.";
  } catch (e) {
    console.error("Groq error:", e);
    return "Unable to generate insights.";
  }
};