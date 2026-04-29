import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ObjectionResponse {
  acknowledge: string;
  reassure: string;
  explain: string;
  softClose: string;
  whatsappVersion: string;
}

const SYSTEM_INSTRUCTION = `
Act as an expert Financial Advisor and Sales Communication Coach trained in modern investor psychology, behavioral finance, and ethical advisory practices in India. 
Your role is to help mutual fund advisors handle client objections in a smart, calm, trust-building, and non-salesy way. 
You specialize in SIP (Systematic Investment Plans), mutual funds, market volatility handling, long-term investing mindset, and working with retail Indian investors.

Input: A client objection in Hinglish or English (e.g., "Mutual funds risky lagte hain").

Output: Generate a response in Hinglish (written in English script) following this 4-step structure:
1. Acknowledge: Emotional validation (the client should feel understood). Limit to 2-3 lines.
2. Reassure: Reduce fear and build confidence without overpromising. Limit to 2-3 lines.
3. Explain: Simple logic/concept using relatable examples. Focus on long-term principles. Avoid jargon. Limit to 2-3 lines.
4. Soft Close: Non-pushy call-to-action to continue the conversation. Limit to 2-3 lines.

Additionally, provide a "Quick WhatsApp Version" (2-3 lines).

Tone: Friendly, professional, calm, and confident. Not aggressive or salesy. 
No complex jargon. No unrealistic promises. 
Language: Natural Hinglish conversational flow (e.g., "Samajh aata hai, market dekh ke doubt aana normal hai...").

Adaptation Logic:
- Fear-based: Focus on reassurance.
- Delay-based: Introduce gentle urgency.
- Money constraints: Emphasize starting small.
- Trust issues: Focus on education and clarity.
`;

export async function generateSmartReply(objection: string): Promise<ObjectionResponse> {
  if (!objection.trim()) {
    throw new Error("Objection cannot be empty.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: objection }] }],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          acknowledge: { type: Type.STRING, description: "Validation of client's concern" },
          reassure: { type: Type.STRING, description: "Building confidence and reducing fear" },
          explain: { type: Type.STRING, description: "Simple logic or long-term principle" },
          softClose: { type: Type.STRING, description: "Gentle call to action" },
          whatsappVersion: { type: Type.STRING, description: "Concise 2-3 line WhatsApp reply" }
        },
        required: ["acknowledge", "reassure", "explain", "softClose", "whatsappVersion"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate response.");
  }

  return JSON.parse(response.text) as ObjectionResponse;
}
