import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is missing.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

export async function askCabaiAI(prompt: string, contextData?: string): Promise<string> {
  const client = getGeminiClient();
  if (!client) {
    return "The CABAI AI Assistant is currently operating in offline mode. Please set your GEMINI_API_KEY in Settings > Secrets to enable intelligent 3D print consultations.";
  }

  const systemInstruction = `You are "Cabai AI", the expert 3D printing engineer and assistant for CABAI ENTERPRISE™ in Malaysia.
Your tone is friendly, professional, and technical yet accessible. You know all about:
1. CABAI ENTERPRISE products: Cabai Keychain (RM 6.90), Flexi Buddy (RM 10.90), DeskDock (RM 9.90), CableClip (RM 3.90), NameTag (RM 8.90).
2. Materials: Eco PLA+ (everyday accessories), Tough PETG (heat resistant desk items), Flexible TPU (cable clips & grips).
3. 3D Printing parameters: layer height (0.16mm fine vs 0.20mm standard), infill density (15-20% standard, 40%+ structural), slicing, and print time calculations.
4. Malaysian currency: Ringgit Malaysia (RM). Shipping rates: West Malaysia RM 8.00 (Free over RM 80).

Provide concise, helpful, and beautifully formatted responses in Markdown. Keep responses brief and relevant.`;

  try {
    const fullPrompt = contextData 
      ? `Context: ${contextData}\n\nUser Question: ${prompt}`
      : prompt;

    const response = await client.models.generateContent({
      model: "gemini-3.6-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    return response.text || "Sorry, I could not generate a response at this moment.";
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return `Error consulting Cabai AI: ${error?.message || 'Unexpected server error'}`;
  }
}
