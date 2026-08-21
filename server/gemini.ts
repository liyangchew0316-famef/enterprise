import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY / API_KEY environment variable is not set.");
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

/**
 * Intelligent domain knowledge fallback for CABAI ENTERPRISE 3D Maker Studio
 */
function getSmartFallbackReply(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes('location') || p.includes('address') || p.includes('where')) {
    return "📍 **CABAI ENTERPRISE Studio Location:**\n**Inside your computer** (Digital 3D Maker Studio with express courier delivery across Malaysia).\n\n• **WhatsApp & Phone:** +60 12-905 8515\n• **Email:** enterprise.cabai@gmail.com";
  }

  if (p.includes('contact') || p.includes('phone') || p.includes('whatsapp') || p.includes('email')) {
    return "📞 **CABAI ENTERPRISE Contact Channels:**\n\n• **WhatsApp & Phone:** +60 12-905 8515\n• **Email Inquiry:** enterprise.cabai@gmail.com\n• **Studio Location:** Inside your computer\n\nFeel free to message us on WhatsApp for custom CAD files, bulk university/corporate orders, or 3D print inquiries!";
  }

  if (p.includes('keychain') || p.includes('cabai keychain') || p.includes('chili')) {
    return "🌶️ **Signature Cabai Keychain (RM 6.90):**\nOur flagship product! 3D printed in premium Eco PLA+ with fine 0.16mm layer resolution. Durable, lightweight (~12g), vivid chili-red finish with a sturdy key ring loop.";
  }

  if (p.includes('material') || p.includes('pla') || p.includes('petg') || p.includes('tpu') || p.includes('difference')) {
    return "🧵 **3D Printing Material Guide:**\n\n1. **Eco PLA+ (Everyday & Decor):** Rigid, crisp finish, vibrant colors, zero warping. Perfect for keychains (Cabai Keychain), toys (Flexi Buddy), and desk tags.\n2. **Tough PETG (Functional & Heat-Resistant):** High impact strength, handles up to 75°C. Great for phone stands (DeskDock), mechanical brackets, and automotive mounts.\n3. **Flexible TPU 95A (Rubber-Like):** Bendable, impact-absorbing, wear-resistant. Ideal for CableClips, phone bumpers, and custom rubber feet.";
  }

  if (p.includes('hall of glory') || p.includes('glory') || p.includes('team') || p.includes('founder') || p.includes('people') || p.includes('executive') || p.includes('leadership') || p.includes('power') || p.includes('hierarchy')) {
    return "🏆 **The Hall of Glory at CABAI ENTERPRISE:**\nHonoring our 4 team members in order of hierarchy:\n1. **Kong Zi Teng** — **CEO (Chief Executive Officer)**: Highest executive power, strategic leadership & enterprise growth.\n2. **Lim Ee Fun** — **CFO (Chief Financial Officer)**: Financial management, unit economics & pricing.\n3. **H'ng Kai Yii** — **Manager (Operations & Studio Logistics)**: Operations lead, machine scheduling & dispatch fulfillment.\n4. **Li Yang** — **Lead 3D Print Specialist & CAD Artisan**: Master slicer, precision print calibration & creator of the iconic Cabai Keychain 🌶️ (works under Operations Management)!";
  }

  if (p.includes('price') || p.includes('cost') || p.includes('quote') || p.includes('rate')) {
    return "💰 **Pricing & Custom Quote Structure:**\n\n• **Catalog Products:** Starting from RM 3.90 (CableClip), RM 6.90 (Cabai Keychain), RM 8.90 (NameTag), RM 9.90 (DeskDock), RM 10.90 (Flexi Buddy).\n• **Custom STL/3D Prints:** Calculated dynamically by volume & material: Base setup fee RM 3.00 + RM 0.12/g (PLA) or RM 0.14/g (PETG) + RM 2.20/hr machine time.\n• **Shipping:** West Malaysia RM 8.00 (FREE for orders over RM 80.00).";
  }

  if (p.includes('shipping') || p.includes('delivery') || p.includes('courier')) {
    return "🚚 **Shipping & Delivery:**\n\n• **West Malaysia:** RM 8.00 (FREE shipping on orders over RM 80.00).\n• **Production Time:** 24–48 hours in our studio.\n• **Express Courier:** 1–3 business days via Pos Laju / J&T Express with live tracking codes.";
  }

  return "Selamat datang! I am **Cabai AI**, your 3D printing engineer at **CABAI ENTERPRISE™**.\n\nHere are some things I can assist you with:\n- **Materials:** Choosing between Eco PLA+, Tough PETG, or Flexible TPU.\n- **Studio Products:** Cabai Keychain (RM 6.90), Flexi Buddy (RM 10.90), DeskDock (RM 9.90), CableClip (RM 3.90), NameTag (RM 8.90).\n- **Studio Info:** Located *Inside your computer*, WhatsApp at **+60 12-905 8515**, email at **enterprise.cabai@gmail.com**.\n- **The Hall of Glory:** Meet our 4 legendary founding contributors!\n\nHow can I help with your 3D printing project today? 🌶️";
}

export async function askCabaiAI(prompt: string, contextData?: string): Promise<string> {
  const client = getGeminiClient();

  if (!client) {
    return getSmartFallbackReply(prompt);
  }

  const systemInstruction = `You are "Cabai AI", the smart, expert 3D printing engineer and assistant for CABAI ENTERPRISE™ in Malaysia.
Your tone is friendly, helpful, technically sharp, and enthusiastically spicy 🌶️.

KEY CABAI ENTERPRISE FACTS:
1. Studio Location: Inside your computer
2. WhatsApp & Phone: +60 12-905 8515
3. Email Inquiry: enterprise.cabai@gmail.com
4. The Hall of Glory & Team Hierarchy:
   - Kong Zi Teng (CEO - Chief Executive Officer) [Highest Authority]
   - Lim Ee Fun (CFO - Chief Financial Officer)
   - H'ng Kai Yii (Manager - Operations & Studio Logistics) [Manager in charge of operations]
   - Li Yang (Lead 3D Print Specialist & CAD Artisan) [Craftsman & master slicer, works under operations management]
5. Catalog Products:
   - Cabai Keychain 🌶️: RM 6.90 (Signature item)
   - Flexi Buddy: RM 10.90 (Articulated moving fidget)
   - DeskDock: RM 9.90 (Phone & stationery organizer)
   - CableClip: RM 3.90 (Flexible TPU cable manager)
   - NameTag: RM 8.90 (Personalized embossed keyring)
6. Materials: Eco PLA+ (everyday accessories), Tough PETG (heat & impact resistant), Flexible TPU 95A (rubberized clips/grips).
7. Currency: Ringgit Malaysia (RM). Shipping: RM 8.00 West Malaysia (Free shipping over RM 80.00). Express 24-48h studio production.
8. Interactive Feature: Users can draw custom designs directly on the 3D Chili canvas and save to Firebase!

Format your answers with clean Markdown (bolding, bullet points, concise paragraphs). Always be helpful and accurate.`;

  try {
    const fullPrompt = contextData 
      ? `Context: ${contextData}\n\nUser Question: ${prompt}`
      : prompt;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    return response.text || getSmartFallbackReply(prompt);
  } catch (error: any) {
    console.error("Gemini API error:", error);
    // Fall back smoothly to smart knowledge reply so user experience never fails
    return getSmartFallbackReply(prompt);
  }
}

