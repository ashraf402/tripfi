import { groq, GROQ_MODEL } from "./groq";
import type { ConversationContext } from "@/lib/types/context";

// Extract Context from Exchange

export async function extractContext(
  userMessage: string,
  assistantResponse: string,
  existingContext: ConversationContext,
): Promise<Partial<ConversationContext>> {
  const prompt = `
You are a context extractor for a travel app.
Extract structured travel data from this exchange.

Existing known context:
${JSON.stringify(existingContext, null, 2)}

User just said: "${userMessage}"
AI responded with summary: "${assistantResponse.slice(0, 200)}"

Extract ANY new information mentioned.
Only return fields where NEW info was found.
Do not return fields already in existing context
unless the user explicitly changed them.

Return ONLY valid JSON. No explanation.
No markdown. Raw JSON only.

{
  "origin": "IATA code or null",
  "destination": "IATA code or null",
  "destinationCity": "city name or null",
  "departureDate": "YYYY-MM-DD or null",
  "returnDate": "YYYY-MM-DD or null",
  "days": number or null,
  "travelers": number or null,
  "budget": number in USD or null,
  "travelClass": "ECONOMY|BUSINESS|FIRST or null",
  "preferences": ["array", "of", "prefs"] or null,
  "interests": ["array", "of", "interests"] or null
}

Rules:
- Return null for any field not mentioned
- Never guess or infer — only extract explicit info
- If user says "make it business class" → travelClass: "BUSINESS"
- If user says "for 2 people" → travelers: 2
- If user says "under $2000" → budget: 2000
- If user says "I like beaches" → preferences: ["beach"]
`;

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 300,
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const extracted = JSON.parse(cleaned);

    // Filter out null values — only return fields with actual new data
    const result = Object.fromEntries(
      Object.entries(extracted).filter(
        ([, v]) => v !== null && v !== undefined,
      ),
    ) as Partial<ConversationContext>;

    console.log("[ContextExtractor] Extracted:", result);
    return result;
  } catch (error: any) {
    console.warn("[ContextExtractor] Failed:", error.message);
    return {};
  }
}

// Build Context Summary for Injection

export function buildContextSummary(context: ConversationContext): string {
  if (Object.keys(context).length === 0) {
    return "";
  }

  const lines: string[] = ["── Known context from this conversation ──"];

  if (context.origin) lines.push(`Origin: ${context.origin}`);

  if (context.destinationCity || context.destination)
    lines.push(
      `Destination: ${context.destinationCity ?? ""} ` +
        `(${context.destination ?? "unknown IATA"})`,
    );

  if (context.departureDate) lines.push(`Departure: ${context.departureDate}`);

  if (context.returnDate) lines.push(`Return: ${context.returnDate}`);

  if (context.days) lines.push(`Duration: ${context.days} days`);

  if (context.travelers) lines.push(`Travelers: ${context.travelers}`);

  if (context.budget) lines.push(`Budget: $${context.budget} USD`);

  if (context.travelClass) lines.push(`Class: ${context.travelClass}`);

  if (context.preferences?.length)
    lines.push(`Preferences: ${context.preferences.join(", ")}`);

  if (context.interests?.length)
    lines.push(`Interests: ${context.interests.join(", ")}`);

  if (context.shownFlights)
    lines.push(`Previously shown: ${context.shownFlights}`);

  if (context.shownHotels) lines.push(`Hotels shown: ${context.shownHotels}`);

  if (context.shownItinerary) lines.push(`Full itinerary was already shown`);

  lines.push("─────────────────────────────────────────");
  lines.push("Use this context to answer follow-up questions.");
  lines.push("Never ask for info already provided above.");

  return lines.join("\n");
}
