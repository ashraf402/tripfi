import { groq, GROQ_MODEL } from "@/lib/ai/groq";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const month = new Date().toLocaleString("en-US", { month: "long" });
    const season = ["December", "January", "February"].includes(month)
      ? "winter"
      : ["March", "April", "May"].includes(month)
        ? "spring"
        : ["June", "July", "August"].includes(month)
          ? "summer"
          : "autumn";

    const prompt = `
You are a travel AI assistant.
Generate 4 short, exciting travel prompt
suggestions for ${month} (${season} season).

Each suggestion should:
- Be a complete natural message a user
  would type to a travel AI
- Be specific and enticing
- Cover different trip styles:
  one luxury, one budget, one adventure,
  one cultural/city break
- Mention real destinations relevant
  to ${season} travel
- Be under 12 words each

Return ONLY a valid JSON array.
No explanation. No markdown. Raw JSON only.

Example format:
[
  "Plan a 5-day luxury trip to Dubai in March",
  "Find cheap flights to Bali under $500",
  "Adventure trip to Iceland for 7 days",
  "Weekend cultural getaway to Istanbul"
]
`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      max_tokens: 200,
    });

    const raw = completion.choices[0]?.message?.content ?? "[]";

    // Strip markdown code blocks if present
    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const suggestions = JSON.parse(cleaned);

    // Validate it's an array of strings
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      throw new Error("Invalid suggestions format");
    }

    return NextResponse.json({
      suggestions: suggestions.slice(0, 4),
    });
  } catch (error: any) {
    console.warn("[Suggestions] Failed:", error.message);
    // Static fallback — never show empty chips
    return NextResponse.json({
      suggestions: [
        "Plan a 5-day trip to Dubai next month",
        "Find flights from Lagos to London",
        "Budget trip to Bali for 7 days",
        "Luxury weekend getaway in Paris",
      ],
    });
  }
}
