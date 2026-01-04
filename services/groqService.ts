import { Groq } from "groq-sdk";
import { Lead, Opportunity } from "./types.ts";

// Vite-exposed environment variable
const apiKey = import.meta.env.VITE_GROQ_API_KEY;

if (!apiKey) {
  console.warn("VITE_GROQ_API_KEY not set – AI features will use fallback responses.");
}

// IMPORTANT: Allow browser usage (safe for development only!)
const groq = new Groq({ 
  apiKey,
  dangerouslyAllowBrowser: true  // ← This fixes the crash
});

const CURRENT_MODEL = "llama-3.3-70b-versatile"; // Confirmed working

// ... rest of your functions remain exactly the same ...

export const analyzeOpportunityProbability = async (opp: Opportunity, lead?: Lead) => {
  try {
    const prompt = `Analyze closing probability for Deal: ${opp.name}, Stage: ${opp.stage}, Amount: $${opp.amount}. Lead context: ${lead?.niche || 'N/A'}, Main Pain: ${lead?.mainPain || 'N/A'}. Return ONLY valid JSON: {"probability": number, "reasoning": string, "recommendation": string}.`;

    const response = await groq.chat.completions.create({
      model: CURRENT_MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 512,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) throw new Error("Empty response");

    return JSON.parse(content);
  } catch (e) {
    console.error("Groq error (analyzeOpportunityProbability):", e);
    return {
      probability: 50,
      reasoning: "Analysis Engine Offline",
      recommendation: "Manual audit required",
    };
  }
};

// Keep all other functions exactly as in the previous version (generateLeadInsights, generateAutomatedFollowUp, scanNewLeads, etc.)
// Just make sure they all use CURRENT_MODEL

export const generateLeadInsights = async (leadName: string, company: string, painPoints: string[]) => {
  try {
    const response = await groq.chat.completions.create({
      model: CURRENT_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an elite Sales Development Representative (SDR). Write direct, value-first, personalized outreach. No fluff — focus on the prospect's specific pain.",
        },
        {
          role: "user",
          content: `Draft a high-conversion sales email for ${leadName} at ${company}. Key pain points: ${painPoints.join(", ")}.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    return response.choices[0]?.message?.content?.trim() ?? "Unable to generate outreach draft.";
  } catch (e) {
    console.error("Groq error (generateLeadInsights):", e);
    return "Unable to generate outreach draft at this time.";
  }
};

// ... include all other functions from previous version with CURRENT_MODEL ...

export const generateAutomatedFollowUp = async (
  leadName: string,
  company: string,
  status: string,
  lastTouch: string,
  painPoints: string[]
) => {
  try {
    const response = await groq.chat.completions.create({
      model: CURRENT_MODEL,
      messages: [
        {
          role: "user",
          content: `Write a short, punchy re-engagement email for ${leadName} at ${company}. Current status: ${status}. Last touch: ${lastTouch}. Reference this pain/growth area: ${painPoints[0] || "Business Growth"}.`,
        },
      ],
      temperature: 0.6,
      max_tokens: 512,
    });

    return response.choices[0]?.message?.content?.trim() ?? "Follow-up generation paused.";
  } catch (e) {
    console.error("Groq error (generateAutomatedFollowUp):", e);
    return "Follow-up generation paused.";
  }
};

export const scanNewLeads = async (industry: string) => {
  try {
    const response = await groq.chat.completions.create({
      model: CURRENT_MODEL,
      messages: [
        {
          role: "user",
          content: `Return ONLY a valid JSON array of 5 hypothetical but realistic high-value enterprise leads in the ${industry} sector. Each object must have: "company", "contact", "signal", "dnaScore" (0-100). No extra text.`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 1024,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) return [];

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      return [];
    }

    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === "object") {
      const keys = Object.keys(parsed);
      const arrayKey = keys.find((k) => Array.isArray(parsed[k]));
      return arrayKey ? parsed[arrayKey] : [];
    }

    return [];
  } catch (e) {
    console.error("Groq error (scanNewLeads):", e);
    return [];
  }
};

export const generateObjectionHandling = async (leadName: string, company: string, painPoints: string[]) => {
  try {
    const response = await groq.chat.completions.create({
      model: CURRENT_MODEL,
      messages: [
        {
          role: "user",
          content: `List the 3 most likely objections ${company} might have given these pain points: ${painPoints.join(", ")}. For each, provide a concise, professional handling response.`,
        },
      ],
      temperature: 0.6,
      max_tokens: 768,
    });

    return response.choices[0]?.message?.content?.trim() ?? "Unable to generate objection handling.";
  } catch (e) {
    console.error("Groq error (generateObjectionHandling):", e);
    return "Unable to generate objection handling.";
  }
};

export const generateSalesInsights = async (leadName: string, company: string, painPoints: string[]) => {
  try {
    const response = await groq.chat.completions.create({
      model: CURRENT_MODEL,
      messages: [
        {
          role: "user",
          content: `Create a strategic 12-month account expansion roadmap for ${company} based on these key pain points/growth opportunities: ${painPoints.join(", ")}. Be specific, phased, and actionable.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    return response.choices[0]?.message?.content?.trim() ?? "Unable to generate growth roadmap.";
  } catch (e) {
    console.error("Groq error (generateSalesInsights):", e);
    return "Unable to generate growth roadmap.";
  }
};