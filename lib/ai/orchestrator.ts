import { groq, GROQ_MODEL } from "./groq";
import { getDemoPricesIfTestnet } from "@/lib/services/pricing/demoPrice";
import { gemini } from "./gemini";
import { searchFlights } from "@/lib/services/flights/flightService";
import { searchHotels } from "@/lib/services/hotels/hotelService";
import {
  searchActivities,
  geocodeCity,
} from "@/lib/services/activities/activityService";
import { getFlightStatus } from "@/lib/services/flights/aviationstackService";
import { getBchRate, usdToBch } from "@/lib/services/bchRate";
import { buildContextSummary } from "./contextExtractor";
import { sanitizeChat } from "@/lib/utils/sanitize";
import type { ConversationContext } from "@/lib/types/context";
import type {
  ChatMessage,
  ComponentType,
  FlightData,
  HotelData,
  ActivityData,
  ItineraryData,
  DayData,
  ItineraryItemData,
  MacroMapData,
  RouteMapData,
  RadiusMapData,
  ItineraryCostBreakdown,
} from "@/lib/types/chat";
import {
  AIRPORT_TO_HOTEL_CITY,
  CITY_TO_IATA,
  cityNameToIata,
  getCheckOutDate,
  getDefaultDepartureDate,
} from "@/utils/travel";

// Intent Types

type Intent =
  | "search_flights"
  | "search_hotels"
  | "search_activities"
  | "plan_trip"
  | "flight_status"
  | "destination_info"
  | "destination_suggest"
  | "general_chat";

interface ParsedIntent {
  intent: Intent;
  params: {
    origin?: string;
    destination?: string;
    destinationCity?: string;
    departureDate?: string;
    returnDate?: string;
    checkInDate?: string;
    checkOutDate?: string;
    adults?: number;
    budget?: number;
    days?: number;
    travelClass?: "ECONOMY" | "BUSINESS" | "FIRST";
    travelStyle?: string; // "beach", "adventure", "luxury" etc
    flightNumber?: string;
  };
}

// System Prompt

const SYSTEM_PROMPT = `
You are Voyager, TripFi's AI travel assistant.
You are not a bot — you are a well-travelled
friend who knows everything about flights,
hotels, and destinations worldwide.

════════════════════════════════════════
PERSONALITY
════════════════════════════════════════

- Warm, witty, and genuinely excited about travel
- Adapt tone to match the user's energy:
  Excited message    → match their excitement
  Curious message    → be exploratory and thoughtful
  Casual message     → relaxed and conversational
  Stressed/urgent    → calm and reassuring
  Funny message      → playful back
  Business-like      → efficient and concise
  Short message      → keep it short
  Long message       → be more thorough

════════════════════════════════════════
STRICT RULES — NEVER BREAK THESE
════════════════════════════════════════

NEVER:
- Introduce yourself unless directly asked
- Say "Hi there! I'm TripFi's AI assistant"
- Say "As an AI" or "As your travel assistant"
- Start with "Certainly!", "Absolutely!",
  "Of course!", "Great question!", "Sure thing!"
- Sound robotic or scripted
- Repeat the same opening twice in a row
- Mention BCH, Bitcoin Cash, or payment
  unless the user is explicitly ready to book
  or asks about payment directly
- Say "I found X results" robotically
- Confirm a booking, price, or schedule
  without a real-time API check
- Invent deals, prices, or availability
  that did not come from the API
- Present a total cost that excludes taxes
  or fees — always be upfront about estimates
- Make the user feel bad about their budget
  ever — treat a $300 trip with the same
  enthusiasm as a $30,000 trip
- Present more than 3 flight or hotel options
  at once — always offer to show more after

ALWAYS:
- Jump straight into the answer
- Use casual contractions naturally
- Show genuine enthusiasm for destinations
- Remember everything the user told you
  earlier in the conversation — never ask
  for info already provided
- Explain WHY you are suggesting something
  when relevant (e.g. "This flight gets you
  there right at check-in time")
- If a user's budget does not match their
  destination or luxury level, gently explain
  and offer the closest realistic alternative
  without making them feel judged
- After showing 3 results say naturally:
  "Want me to pull up more options?"

════════════════════════════════════════
PROACTIVE BEHAVIOUR
════════════════════════════════════════

Anticipate needs before the user asks:

LATE NIGHT ARRIVALS (after midnight only):
If a flight lands after midnight, always add:
"This lands pretty late — worth arranging
a pickup in advance. Grab/Uber/local taxis
usually run 24hrs but can be scarce at that
hour in some cities."

BUDGET VS DESTINATION MISMATCH:
If user wants luxury on a tight budget say:
"That destination can get pricey — but I
can find you the best value version of it,
or suggest somewhere with a similar vibe
that stretches your budget further. Which
would you prefer?"

VAGUE TRIP REQUESTS:
If user says "I want to travel somewhere"
or "suggest places" with no destination,
never default to a single city — always
generate diverse global suggestions with
QUICK_PICKS chips so they can tap to choose.

════════════════════════════════════════
ITINERARY RULES
════════════════════════════════════════

PHYSICAL ACTIVITY FLAG:
Always add a brief note at the end of any
itinerary that involves significant walking,
hiking, stairs, or physical exertion. Keep
it light and helpful, not alarming:
"Heads up — Day 2 and 3 involve a fair
amount of walking. Comfortable shoes are
a must."

FLEXIBILITY:
Always remind users they can modify any
part of the itinerary conversationally:
"Don't like something? Just tell me and
I'll swap it out."

COST TRANSPARENCY:
Always clarify that prices shown are
estimates from live data and may vary
slightly at checkout. Never hide fees.

════════════════════════════════════════
MULTI-CURRENCY
════════════════════════════════════════

If user asks about price in BCH or crypto,
calculate and show both USD and BCH using
the live rate. Keep it natural:
"That's roughly 0.45 BCH at today's rate."
Only bring up BCH payment at checkout or
when the user asks — never before.

════════════════════════════════════════
TONE EXAMPLES
════════════════════════════════════════

User: "omg I want to go to Tokyo so bad"
Wrong: "I'd be happy to help you plan a trip!"
Right: "Tokyo is absolutely worth the hype.
        When are you thinking of going?"

User: "find me flights to london"
Wrong: "Certainly! I'll search for flights."
Right: "On it — let me see what's available."

User: "I'm stressed, need a vacation asap"
Wrong: "I understand. Let me help you!"
Right: "You clearly need some sun and a good
        view. Where are you flying from?"

User: "what's fun to do in bali"
Wrong: "Here are some activities in Bali."
Right: "Bali has layers — are you more into
        temples, beach clubs, or trekking
        through the rice terraces?"

User: "I only have $400 for a week trip"
Wrong: "That budget may be quite limiting..."
Right: "We can work with $400 — Southeast
        Asia and parts of Eastern Europe
        are incredible on that budget.
        Which direction appeals more?"

User: "change the museum on day 3 to a beach"
Wrong: "I'll need to regenerate your itinerary."
Right: "Done — swapped the museum for Kuta
        Beach on Day 3. Everything else stays
        the same."

════════════════════════════════════════
RESPONSE FORMAT
════════════════════════════════════════

Always write responses in Markdown format.
Use formatting intentionally to enhance
clarity and expressiveness — not just for
the sake of it.

When to use formatting:
- **Bold** for destination names, key facts,
  or anything worth emphasising
- *Italic* for atmosphere, vibes, or poetic
  descriptions ("*the kind of sunset that
  makes you forget your name*")
- Use line breaks generously — short punchy
  paragraphs feel more conversational
- Bullet points ONLY for lists of 3+ items
  like packing tips, activity options, or
  quick comparisons
- Never use bullet points for normal
  conversational replies — just paragraphs
- ### Headings only for structured content
  like itinerary summaries or multi-section
  responses — never for short replies
- > Blockquotes for travel quotes, tips,
  or standout facts worth highlighting
- Emoji used sparingly for personality —
  1 or 2 max per response, never spammed

Tone still drives everything — markdown is
just how you express it more beautifully.
A short excited reply can just be two bold
words and a line break. A destination
breakdown deserves headers and bullets.
Use your judgement.

════════════════════════════════════════
MAP BEHAVIOUR
════════════════════════════════════════

TripFi has an interactive map panel that
slides in from the left on desktop and
pops up as a bottom sheet on mobile.
It never blocks the chat experience.

When a map is shown alongside your response:
- Keep your text SHORT — the map is doing
  the visual heavy lifting
- Reference the map naturally:
  "Here's where everything sits on the map"
  "You can see the route laid out visually"
  "The map shows exactly how close these are"
- Never describe distances or routes in
  text when a map is already being shown
- Never say "I've triggered a map" or
  reference technical implementation

When you suggest multiple destinations,
a map will automatically show all of them
relative to the user's starting point.
Just describe the destinations — the map
handles the spatial context.

When an itinerary is generated, a route
map of Day 1 will automatically appear.
Don't re-describe the route in text.
`;

// Intent Detection

async function detectIntent(
  userMessage: string,
  conversationHistory: ChatMessage[],
  userOriginIata?: string,
  contextSummary?: string,
): Promise<ParsedIntent> {
  const historyText = conversationHistory
    .slice(-4)
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const today = new Date().toISOString().split("T")[0];

  const prompt = `
You are an intent parser for a travel planning app.
Analyze the user message and return structured data.

Today: ${today}
User's detected departure city IATA code: ${userOriginIata ?? "unknown"}
History:
${historyText}
${
  contextSummary
    ? `
Known context from this conversation:
${contextSummary}

Use this context to fill in params.
If destination is known, use it.
If budget is known, use it.
Never ask for info already in context.
`
    : ""
}
User: "${userMessage}"

Return ONLY valid JSON. No explanation.
No markdown. No code blocks. Raw JSON only.

{
  "intent": one of [
    "search_flights", "search_hotels",
    "search_activities", "plan_trip",
    "flight_status", "destination_info",
    "general_chat"
  ],
  "params": {
    "origin": "IATA code or null",
    "destination": "IATA airport/city code. Convert city names to IATA: Abuja=ABV, Lagos=LOS, Dubai=DXB, London=LHR, Tokyo=TYO, Paris=CDG, New York=JFK, Accra=ACC, Nairobi=NBO, Johannesburg=JNB, Cairo=CAI. Return null only if truly unknown.",
    "destinationCity": "Full city name or null",
    "departureDate": "YYYY-MM-DD or null",
    "returnDate": "YYYY-MM-DD or null",
    "checkInDate": "YYYY-MM-DD or null",
    "checkOutDate": "YYYY-MM-DD or null",
    "adults": number or 1,
    "budget": number in USD or null,
    "days": number of days or null,
    "travelClass": "ECONOMY|BUSINESS|FIRST or null",
    "flightNumber": "e.g. EK101 or null"
    "travelStyle": "beach|adventure|luxury|budget|cultural|city|nature or null"
  }
}

Rules:
- HIGHEST PRIORITY RULE: If the message is a
  short destination-focused phrase like:
  "I want to go to X"
  "Take me to X"
  "Let's do X"
  "I'm thinking X"
  "I'd love to visit X"
  "X sounds amazing"
  Where X is a city or country name →
  ALWAYS return plan_trip with destination
  extracted from X. Never return general_chat
  for these patterns. Never ask for destination
  again — it is in the message.
- No departure date mentioned → use 30 days from today
- No itinerary length or days mentioned → assume 7 days
- No origin mentioned → use detected IATA code above
- If detected code is unknown and user didn't mention start → ask: 'Where will you be flying from?'
- No adults mentioned → assume 1
- If context from this conversation includes travelStyle, days, or departureDate AND the user message references a specific city or destination (e.g. "I want to go to Tokyo", "Take me to Bali", "Let's do Rome", "Book me a trip to X", "Let's head to X"), treat as plan_trip and carry ALL existing context forward — never discard days, month, or style already known.
- If no prior context exists and user says "I want to go to X", "Take me to X", or similar destination-picking phrases, treat as plan_trip. Ask only for the missing minimum: departure city if unknown.
- ONLY use plan_trip if user EXPLICITLY asks to "plan a trip", "create an itinerary", or "book a full trip", OR if user picks a specific destination in a casual phrase as described above
- ONLY use search_flights if user EXPLICITLY mentions "flights", "fly", "flying"
- ONLY use search_hotels if user EXPLICITLY mentions "hotel", "stay", "accommodation"
- ONLY use search_activities if user asks about "things to do", "activities", "places to visit", "attractions"
- ONLY use destination_info if user asks "tell me about [city]" or "what is [city] like"
- ONLY use flight_status if user mentions a flight number
- USE general_chat for EVERYTHING else: greetings, casual questions, map requests, weather questions, currency questions, vague messages, any message that does NOT clearly request flights/hotels/trips
  Examples of general_chat:
  "Show me a map" → general_chat
  "What's the weather in Dubai" → general_chat
  "How much is $100 in BCH" → general_chat
  "Hi" → general_chat
  "Thanks" → general_chat
  "Tell me about Dubai" → destination_info
  "I want to go to Dubai" → plan_trip (user picked a destination — use context if available, otherwise ask for departure city only)
- USE destination_suggest when user wants ideas,
  inspiration, or recommendations WITHOUT a
  specific destination mentioned.
  Examples:
  "Where should I go for 2 weeks in March?" → destination_suggest
  "Suggest places for a beach holiday" → destination_suggest
  "I want to travel somewhere in April" → destination_suggest
  "Best places to visit in summer" → destination_suggest
  "I have 10 days, where should I go?" → destination_suggest
  Extract travelStyle, days, departureDate if mentioned.
  Never default to a single city for these.

When intent is general_chat, respond conversationally and helpfully. If the user seems interested in travel but their message is vague, ask ONE clarifying question like "Would you like me to search for flights, hotels, or plan a full itinerary?"
Never assume trip planning intent from casual or ambiguous messages.
`;

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 500,
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    return JSON.parse(raw.trim()) as ParsedIntent;
  } catch (error: any) {
    console.warn("[Orchestrator] Intent detection failed:", error.message);
    return { intent: "general_chat", params: {} };
  }
}
// Generate Response Text

async function generateResponseText(
  userMessage: string,
  intent: Intent,
  summary: string,
  context?: ConversationContext,
  resultCount?: number,
): Promise<string> {
  const showMoreHint =
    resultCount !== undefined && resultCount > 3
      ? `There are more results available beyond the 3 shown. End your response with a natural offer like "Want me to pull up more options?" — keep it casual.`
      : "";

  const toneHint = /(!{2,}|omg|omfg|so excited|can't wait|amazing|love)/i.test(
    userMessage,
  )
    ? "The user is excited — match their energy."
    : /(\?{2,}|wonder|curious|not sure|what do you think|any ideas)/i.test(
          userMessage,
        )
      ? "The user is curious — be thoughtful and engaging."
      : /(\bhelp\b|stressed|asap|urgent|need.*now|worried)/i.test(userMessage)
        ? "The user seems stressed — be calm and reassuring."
        : /(\blol\b|\bhaha\b|funny|joke|\bwtf\b|crazy)/i.test(userMessage)
          ? "The user is playful — be fun and light."
          : "Be natural and conversational.";

  const prompt = `
You are Voyager, a well-travelled AI friend.
You just helped with: ${intent}
Result: ${summary}
The user said: "${userMessage}"

Tone instruction: ${toneHint}
${showMoreHint}

Write a response (2-3 sentences max) that:
- Reacts naturally to what the user said
- Confirms the result in a human specific way
- Explains WHY the top result is good if relevant
  (e.g. "best value", "shortest layover", "central location")
- Does NOT start with "I found", "Here are",
  "Certainly", "Sure", "Absolutely", "Great"
- Does NOT mention BCH or payment
- Sounds like a real person not a bot
- Matches the tone instruction above
- Ends naturally — offer more options if hinted above

Just write the response. No labels. No quotes.
`;

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 120,
      temperature: 0.9,
    });

    const text = completion.choices[0]?.message?.content;
    if (text && text.length > 0) return text;
    throw new Error("Empty response");
  } catch (error: any) {
    console.warn("[Orchestrator] Response text failed:", error.message);
    return getFallbackMessage(intent, summary);
  }
}

// Static fallback messages — no API needed
function getFallbackMessage(intent: Intent, summary: string): string {
  const messages: Record<string, string> = {
    plan_trip:
      `Here's your trip plan! I found ${summary}. ` +
      `You can pay for everything with BCH.`,
    search_flights:
      `Here are the available flights I found. ` +
      `${summary}. Pay instantly with BCH.`,
    search_hotels:
      `Here are hotels matching your search. ` +
      `${summary}. BCH payments accepted.`,
    search_activities: `Here are top things to do. ${summary}.`,
    destination_info: `Here's what I found. ${summary}.`,
    general_chat: `I'm here to help you plan your next trip!`,
  };
  return messages[intent] ?? `Here's what I found: ${summary}.`;
}

// Destination Suggestions
// Called when user wants inspiration with no destination

async function generateDestinationSuggestions(
  userMessage: string,
  travelStyle?: string,
  days?: number,
  departureDate?: string,
  origin?: string,
): Promise<string> {
  const prompt = `
${SYSTEM_PROMPT}

The user wants destination inspiration.
They said: "${userMessage}"

Travel style: ${travelStyle ?? "not specified"}
Trip length: ${days ? `${days} days` : "not specified"}
Travel period: ${departureDate ?? "not specified"}
Flying from: ${origin ?? "not specified"}

Suggest 4 destinations from different parts
of the world that could genuinely excite them.

For each destination write ONE punchy sentence
that sells it — make them feel something.
Write descriptions in markdown:
- Start each with the **city name in bold**
- Use *italic* for the single most evocative phrase
- Keep it to one short sentence per destination
No bullet points. No numbered lists.
Write it like you are texting a friend.

Then on a new line write EXACTLY this format:
QUICK_PICKS: ["I want to go to [City1]", "Take me to [City2]", "Let's do [City3]", "I want to go to [City4]"]

Vary the phrasing naturally across the 4 picks.
Use different openers — do not repeat the same phrase for all 4.
Good openers: "I want to go to", "Take me to", "Let's do", "Book me a trip to", "Let's head to", "I'm thinking"
The city names in QUICK_PICKS must match the 4 destinations
mentioned above exactly.
Do NOT add any text after the QUICK_PICKS line.
`;

  try {
    const result = await gemini.generateContent(prompt);
    return result.response.text();
  } catch {
    const fallback = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400,
      temperature: 0.9,
    });
    return (
      fallback.choices[0]?.message?.content ??
      `Tokyo will rewire your brain, Bali will reset your soul, Barcelona will steal your heart, and Cape Town will ruin every other view for you.\n\nQUICK_PICKS: ["I want to go to Tokyo", "Take me to Bali", "Let's do Barcelona", "Book me a trip to Cape Town"]`
    );
  }
}

// Build Itinerary from Real Data

async function buildItinerary(
  params: ParsedIntent["params"],
  flightData: FlightData | null,
  hotelData: HotelData | null,
  activityData: ActivityData | null,
): Promise<ItineraryData> {
  const bchRate = await getBchRate();
  const days = params.days ?? 7;
  const destination = params.destinationCity ?? params.destination ?? "Unknown";
  const startDate = params.departureDate ?? getDefaultDepartureDate();

  const dayLabels = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dayCards: DayData[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    const dayLabel = dayLabels[date.getDay()];

    const items: ItineraryItemData[] = [];

    if (i === 0) {
      // Day 1: Real flight + real hotel
      const flight = flightData?.flights?.[0] ?? null;
      if (flight) {
        items.push({
          id: `item-${i}-flight`,
          time: "08:00 AM",
          type: "flight",
          title: `Fly ${flight.origin} → ${flight.destination}`,
          description:
            `${flight.airline} ${flight.flightNumber} ` +
            `• ${flight.duration}`,
          costUsd: flight.priceUsd,
          costBch: flight.priceBch,
        });
      }

      const hotel = hotelData?.hotels?.[0] ?? null;
      if (hotel) {
        items.push({
          id: `item-${i}-hotel`,
          time: "03:00 PM",
          type: "hotel",
          title: `Check in — ${hotel.name}`,
          description: hotel.location,
          costUsd: hotel.pricePerNightUsd,
          costBch: hotel.pricePerNightBch,
        });
      }
    } else if (i === days - 1) {
      // Last day: Check-out + return flight
      items.push({
        id: `item-${i}-checkout`,
        time: "11:00 AM",
        type: "hotel",
        title: "Check out",
        description: "Pack up and head to airport",
      });

      const returnFlight =
        flightData?.flights?.[1] ?? flightData?.flights?.[0] ?? null;

      if (returnFlight) {
        items.push({
          id: `item-${i}-return`,
          time: "02:00 PM",
          type: "flight",
          title: `Return flight to ` + `${params.origin ?? "home"}`,
          description:
            `${returnFlight.airline} ` + `• ${returnFlight.duration}`,
        });
      }
    } else {
      // Middle days: Real OSM activities
      const allActivities = activityData?.activities ?? [];
      const dayActivities = allActivities.slice((i - 1) * 2, (i - 1) * 2 + 3);

      dayActivities.forEach((activity, idx) => {
        const times = ["09:00 AM", "12:30 PM", "03:00 PM"];
        items.push({
          id: `item-${i}-activity-${idx}`,
          time: times[idx] ?? "10:00 AM",
          type: "activity",
          title: activity.name,
          description: activity.description,
          location: activity.location,
          // undefined means free — show as 0
          costUsd: activity.priceUsd ?? 0,
          costBch: activity.priceBch ?? 0,
          latitude: activity.latitude,
          longitude: activity.longitude,
        } as ItineraryItemData);
      });

      // Add estimated daily spending
      items.push({
        id: `item-${i}-daily`,
        time: "12:00 PM",
        type: "food",
        title: "Meals & Local Transport",
        description: "Estimated daily expenses",
        costUsd: 80,
        costBch: usdToBch(80, bchRate),
      });
    }

    const totalCostUsd = items.reduce(
      (sum, item) => sum + (item.costUsd ?? 0),
      0,
    );

    dayCards.push({
      day: i + 1,
      date: dateStr,
      dayLabel:
        `Day ${i + 1} — ${dayLabel}, ` +
        new Date(dateStr).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        }),
      items,
      totalCostUsd,
    });
  }

  // Totals from real API data
  // After building flights and hotels,
  // calculate each cost separately

  const realFlightCost = (() => {
    const flight = flightData?.flights?.[0];
    if (!flight) return 0;
    const raw =
      (flight as any).price?.total ??
      (flight as any).price?.amount ??
      (flight as any).totalPrice ??
      flight.priceUsd ??
      0;
    return typeof raw === "string" ? parseFloat(raw) : raw;
  })();

  const realHotelCost = (() => {
    const hotel = hotelData?.hotels?.[0];
    if (!hotel) return 0;
    const perNight =
      (hotel as any).price?.perNight ??
      (hotel as any).pricePerNight ??
      (hotel as any).price?.amount ??
      hotel.pricePerNightUsd ??
      0;
    const nights = days ?? 1;
    const raw = typeof perNight === "string" ? parseFloat(perNight) : perNight;
    return raw * nights;
  })();

  const realActivitiesCost = (() => {
    const acts = dayCards?.flatMap((d) => d.items ?? []) ?? [];
    return acts.reduce((sum, a) => {
      const price = (a as any).price ?? (a as any).cost ?? a.costUsd ?? 0;
      const raw = typeof price === "string" ? parseFloat(price) : price;
      return sum + (isNaN(raw) ? 0 : raw);
    }, 0);
  })();

  const realTaxesAndFees = Math.round(
    (realFlightCost + realHotelCost + realActivitiesCost) * 0.15,
  );

  const realTotal =
    realFlightCost + realHotelCost + realActivitiesCost + realTaxesAndFees;

  const bchRateValue = bchRate || 450;

  // Demo price override: on testnet, replace real prices with small
  // randomized amounts so tBCH amounts are tiny and testable.
  // On mainnet getDemoPricesIfTestnet returns null and real prices are used.
  const nights = days ?? 1;
  const activityCount = dayCards.reduce(
    (sum, d) =>
      sum +
      d.items.filter((it) => it.type === "activity" || it.type === "food")
        .length,
    0,
  );

  const demoPrices = getDemoPricesIfTestnet({ nights, activityCount });

  let costs: ItineraryCostBreakdown;

  if (demoPrices) {
    costs = demoPrices;
    console.log(
      "[Orchestrator] TESTNET demo prices:",
      `$${demoPrices.total} USD`,
      `/ ${(demoPrices.total / bchRateValue).toFixed(8)} BCH`,
    );
  } else {
    if (realTotal > 50000) {
      console.error(
        "[Price Guard] total seems wrong:",
        realTotal,
        "— check price fields above",
      );
    }
    console.log(
      "[Orchestrator] Total cost check:",
      `$${realTotal} USD /`,
      `${realTotal / bchRateValue} BCH`,
      `(Rate: ${bchRateValue})`,
    );
    costs = {
      flightCost: Math.round(realFlightCost * 100) / 100,
      hotelCost: Math.round(realHotelCost * 100) / 100,
      activitiesCost: Math.round(realActivitiesCost * 100) / 100,
      taxesAndFees: Math.round(realTaxesAndFees * 100) / 100,
      total: Math.round(realTotal * 100) / 100,
    };
  }

  return {
    title: `${destination} Trip`,
    destination,
    startDate,
    endDate: dayCards[dayCards.length - 1]?.date ?? startDate,
    totalDays: days,
    travelers: params.adults ?? 1,
    days: dayCards,
    costs,
    totalCostUsd: costs.total, // keep in sync
    totalCostBch: Math.round((costs.total / bchRateValue) * 1e8) / 1e8,
    isSaved: false,
  };
}

// User-Friendly Error Messages

function getErrorMessage(intent: Intent, error: any): string {
  const base = error?.message?.includes("No flights")
    ? "I couldn't find flights for that route and date."
    : error?.message?.includes("No hotels")
      ? "I couldn't find hotels for that city and dates."
      : error?.message?.includes("No activities")
        ? "I couldn't find activities for that destination."
        : error?.message?.includes("geocode")
          ? "I don't recognize that city name. Could you check the spelling?"
          : "I had trouble with that request.";

  return `${base} Please try adjusting your dates or destination and I'll search again.`;
}

// Extract City From Natural Message
// Last resort when intent parser doesn't extract a destination.
// Strips common chip-style openers and treats the remainder as
// a city name for IATA lookup via cityNameToIata().

function extractCityFromMessage(message: string): string | null {
  const openers = [
    /^i want to go to\s+/i,
    /^take me to\s+/i,
    /^let'?s do\s+/i,
    /^book me a trip to\s+/i,
    /^let'?s head to\s+/i,
    /^i'?m thinking\s+/i,
    /^i'?d love to visit\s+/i,
    /^plan my trip to\s+/i,
    /^plan a trip to\s+/i,
    /^i'?d like to go to\s+/i,
  ];

  const trimmed = message.trim();
  for (const pattern of openers) {
    if (pattern.test(trimmed)) {
      // Strip opener, take remaining text, clean trailing punctuation
      return (
        trimmed
          .replace(pattern, "")
          .replace(/[.!?]+$/, "")
          .trim() || null
      );
    }
  }
  return null;
}

// Extract Cities From Quick Picks
// Parses QUICK_PICKS JSON array from the AI suggestion
// response and extracts city names from natural phrases.

function extractCitiesFromQuickPicks(text: string): string[] {
  const match = text.match(/QUICK_PICKS:\s*(\[[\s\S]*?\])/);
  if (!match?.[1]) return [];
  try {
    const picks: string[] = JSON.parse(match[1]);
    return picks
      .map((pick) => {
        const cityMatch = pick.match(
          /(?:go to|to|do|visit|thinking|take me to)\s+([A-Z][a-zA-Z\s]+?)(?:\s*[,!?.]|$)/i,
        );
        return cityMatch?.[1]?.trim() ?? pick;
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

// Main Orchestrator

export interface OrchestratorResponse {
  message: string;
  component: ComponentType;
  data: unknown;
  secondaryComponent?: ComponentType;
  secondaryData?: unknown;
  contextUpdate?: Partial<ConversationContext>;
}

export async function orchestrate(
  userMessage: string,
  conversationHistory: ChatMessage[],
  userOriginIata?: string,
  context?: ConversationContext,
): Promise<OrchestratorResponse> {
  // Last line of defense: sanitize before any intent detection or AI call
  const { value: safeMessage } = sanitizeChat(userMessage);

  if (!safeMessage) {
    return {
      message: "I could not process that message. Please try rephrasing.",
      component: null,
      data: null,
    };
  }

  const contextSummary = context ? buildContextSummary(context) : "";

  const parsed = await detectIntent(
    safeMessage,
    conversationHistory,
    userOriginIata,
    contextSummary || undefined,
  );

  const { intent, params } = parsed;

  console.log("\n[Orchestrator] ─────────────────────");
  console.log("[Orchestrator] Intent:", intent);
  console.log("[Orchestrator] Params:", params);
  console.log("[Orchestrator] User Origin:", userOriginIata);
  console.log("[Orchestrator] ─────────────────────\n");

  switch (intent) {
    // Flights
    case "search_flights": {
      try {
        const origin =
          params.origin ?? context?.origin ?? userOriginIata ?? "JFK";
        const destination =
          params.destination ??
          cityNameToIata(params.destinationCity) ??
          context?.destination ??
          "DXB";
        const departureDate =
          params.departureDate ??
          context?.departureDate ??
          getDefaultDepartureDate();

        const flightData = await searchFlights({
          origin,
          destination,
          departureDate,
          returnDate: params.returnDate ?? context?.returnDate,
          adults: params.adults ?? context?.travelers ?? 1,
          travelClass: (params.travelClass ?? context?.travelClass) as any,
          maxResults: 5,
        });

        const message = await generateResponseText(
          userMessage,
          intent,
          `${flightData.flights.length} flights from ${origin} to ${destination}`,
          context,
          flightData.flights.length,
        );

        return {
          message,
          component: "FlightSearchResults",
          data: {
            ...flightData,
            flights: flightData.flights.slice(0, 3),
            hasMore: flightData.flights.length > 3,
          },
          contextUpdate: {
            origin,
            destination,
            departureDate,
            shownFlights: `${flightData.flights.length} flights ${origin}→${destination}`,
            lastIntent: "search_flights",
            messageCount: (context?.messageCount ?? 0) + 1,
          },
        };
      } catch (error: any) {
        console.error("[Orchestrator] Flight search error:", error.message);
        return {
          message: getErrorMessage(intent, error),
          component: null,
          data: null,
        };
      }
    }

    // Destination Suggestions
    case "destination_suggest": {
      const suggestionText = await generateDestinationSuggestions(
        userMessage,
        params.travelStyle,
        params.days,
        params.departureDate,
        context?.origin ?? userOriginIata,
      );

      // MacroMap trigger: geocode suggested cities
      const cities = extractCitiesFromQuickPicks(suggestionText);

      const geoResults = await Promise.allSettled(
        cities.map((city) => geocodeCity(city)),
      );

      const destinations = cities
        .map((city, i) => {
          const result = geoResults[i];
          if (result.status !== "fulfilled") return null;
          return {
            city,
            iata: cityNameToIata(city) ?? city,
            lat: result.value.lat,
            lng: result.value.lng,
          };
        })
        .filter(
          (d): d is { city: string; iata: string; lat: number; lng: number } =>
            d !== null,
        );

      // Get origin coords if available
      const originIata = context?.origin ?? userOriginIata;
      const originCoords = originIata
        ? await geocodeCity(originIata).catch(() => null)
        : null;

      const macroMapData: MacroMapData = {
        origin:
          originCoords && originIata
            ? {
                iata: originIata,
                city: originIata,
                lat: originCoords.lat,
                lng: originCoords.lng,
              }
            : undefined,
        destinations,
        zoom: destinations.length > 3 ? "global" : "regional",
      };

      // Return MacroMap if we have geocoded destinations
      const hasMapData = destinations.length > 0;

      return {
        message: suggestionText,
        component: null,
        data: null,
        secondaryComponent: hasMapData ? "MacroMap" : null,
        secondaryData: hasMapData ? macroMapData : null,
        contextUpdate: {
          days: params.days,
          departureDate: params.departureDate,
          lastIntent: "destination_suggest",
          messageCount: (context?.messageCount ?? 0) + 1,
        },
      };
    }

    // Hotels
    case "search_hotels": {
      try {
        const hotelDestination =
          params.destination ??
          cityNameToIata(params.destinationCity) ??
          context?.destination ??
          "DXB";

        const checkIn =
          params.checkInDate ??
          params.departureDate ??
          context?.departureDate ??
          getDefaultDepartureDate();

        const checkOut =
          params.checkOutDate ??
          getCheckOutDate(checkIn, params.days ?? context?.days ?? 3);

        const hotelData = await searchHotels({
          cityCode: hotelDestination,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          adults: params.adults ?? context?.travelers ?? 1,
          maxResults: 5,
        });

        const message = await generateResponseText(
          userMessage,
          intent,
          `${hotelData.hotels.length} hotels in ${params.destinationCity ?? context?.destinationCity ?? hotelDestination}`,
          context,
          hotelData.hotels.length,
        );

        return {
          message,
          component: "HotelSearchResults",
          data: {
            ...hotelData,
            hotels: hotelData.hotels.slice(0, 3),
            hasMore: hotelData.hotels.length > 3,
          },
          contextUpdate: {
            destination: hotelDestination,
            shownHotels: `${hotelData.hotels.length} hotels in ${params.destinationCity ?? context?.destinationCity ?? hotelDestination}`,
            lastIntent: "search_hotels",
            messageCount: (context?.messageCount ?? 0) + 1,
          },
        };
      } catch (error: any) {
        console.error("[Orchestrator] Hotel search error:", error.message);
        return {
          message: getErrorMessage(intent, error),
          component: null,
          data: null,
        };
      }
    }

    // Activities
    case "search_activities": {
      try {
        const cityName =
          params.destinationCity ?? params.destination ?? "Dubai";

        const coords = await geocodeCity(cityName);

        const activityData = await searchActivities({
          destination: cityName,
          latitude: coords.lat,
          longitude: coords.lng,
          maxResults: 10,
        });

        const message = await generateResponseText(
          userMessage,
          intent,
          `${activityData.activities.length} activities found`,
        );

        return {
          message,
          component: "ActivitySearchResults",
          data: activityData,
        };
      } catch (error: any) {
        console.error("[Orchestrator] Activity search error:", error.message);
        return {
          message: getErrorMessage(intent, error),
          component: null,
          data: null,
        };
      }
    }

    // Full Trip Plan
    case "plan_trip": {
      try {
        const origin =
          params.origin ?? context?.origin ?? userOriginIata ?? "LOS";

        // Destination resolution chain
        // 1. Direct IATA from intent detection
        // 2. City name → IATA lookup
        // 3. Extract city name from raw message
        //    as last resort before giving up

        let destination =
          params.destination ??
          cityNameToIata(params.destinationCity) ??
          context?.destination ??
          null;

        // Last resort — extract city directly from
        // the user message if all else fails
        if (!destination) {
          const cityFromMessage = extractCityFromMessage(userMessage);
          destination = cityFromMessage
            ? cityNameToIata(cityFromMessage)
            : null;
        }

        if (!destination) {
          return {
            message:
              "Where would you like to travel to? " +
              "Just mention a city and I'll get started.",
            component: null,
            data: null,
          };
        }

        const cityName =
          params.destinationCity ?? context?.destinationCity ?? destination;
        const departureDate =
          params.departureDate ??
          context?.departureDate ??
          getDefaultDepartureDate();
        const days = params.days ?? context?.days ?? 7;
        const adults = params.adults ?? context?.travelers ?? 1;
        const checkOut = getCheckOutDate(departureDate, days);

        console.log("[Orchestrator] Running parallel API calls...");

        const hotelCityCode = AIRPORT_TO_HOTEL_CITY[destination] ?? destination;

        // Use Promise.allSettled to handle partial failures
        const [flightResult, hotelResult, coordsResult] =
          await Promise.allSettled([
            searchFlights({
              origin,
              destination,
              departureDate,
              returnDate: checkOut,
              adults,
              maxResults: 3,
            }),
            searchHotels({
              cityCode: hotelCityCode,
              checkInDate: departureDate,
              checkOutDate: checkOut,
              adults,
              maxResults: 3,
            }),
            geocodeCity(cityName),
          ]);

        // Extract results safely
        const flightData =
          flightResult.status === "fulfilled" ? flightResult.value : null;

        const hotelData =
          hotelResult.status === "fulfilled" ? hotelResult.value : null;

        const coords =
          coordsResult.status === "fulfilled" ? coordsResult.value : null;

        // Log failures
        if (flightResult.status === "rejected") {
          console.warn(
            "[Orchestrator] Flights unavailable:",
            flightResult.reason?.message,
          );
        }
        if (hotelResult.status === "rejected") {
          console.warn(
            "[Orchestrator] Hotels unavailable:",
            hotelResult.reason?.message,
          );
        }
        if (coordsResult.status === "rejected") {
          console.warn(
            "[Orchestrator] Geocoding failed:",
            coordsResult.reason?.message,
          );
        }

        // Honest summary for the AI (built early for parallel execution)
        const summary = [
          flightData
            ? `${flightData.flights.length} flights found`
            : "flights unavailable",
          hotelData
            ? `${hotelData.hotels.length} hotels found`
            : "hotels unavailable",
        ].join(", ");

        const activityPromise = coords
          ? searchActivities({
              destination: cityName,
              latitude: coords.lat,
              longitude: coords.lng,
              maxResults: 15,
            }).catch((err) => {
              console.warn(
                "[Orchestrator] Activities unavailable:",
                err.message,
              );
              return null;
            })
          : Promise.resolve(null);

        // Run itinerary build setup and AI text in parallel
        // We need activity data for the full itinerary, but we can start AI now
        const [activityData, message] = await Promise.all([
          activityPromise,
          generateResponseText(userMessage, intent, summary),
        ]);

        const hasFlights = (flightData?.flights?.length ?? 0) > 0;
        const hasHotels = (hotelData?.hotels?.length ?? 0) > 0;
        const hasActivities = (activityData?.activities?.length ?? 0) > 0;

        if (!hasFlights && !hasHotels) {
          return {
            message:
              `I wasn't able to find flights or hotels ` +
              `for this route right now. Try a different ` +
              `date or a major city like Dubai or London.`,
            component: null,
            data: null,
          };
        }

        const itineraryParams: ParsedIntent["params"] = {
          ...params,
          origin,
          destination,
          destinationCity: cityName,
          departureDate,
          days,
          adults,
          budget: params.budget ?? context?.budget ?? undefined,
          travelClass: (params.travelClass ??
            context?.travelClass) as ParsedIntent["params"]["travelClass"],
        };

        const itineraryData = await buildItinerary(
          itineraryParams,
          flightData,
          hotelData,
          activityData,
        );

        // RouteMap trigger: extract Day 1 waypoints
        const day1 = itineraryData.days[0];
        const waypoints = day1
          ? day1.items
              .filter(
                (item) =>
                  item.latitude !== undefined && item.longitude !== undefined,
              )
              .map((item) => ({
                id: item.id,
                name: item.title,
                type: item.type as
                  | "hotel"
                  | "flight"
                  | "activity"
                  | "food"
                  | "transport",
                lat: item.latitude!,
                lng: item.longitude!,
                time: item.time,
                description: item.description,
              }))
          : [];

        // Add hotel as first waypoint if available
        if (hotelData?.hotels?.[0]) {
          const hotelCoords = await geocodeCity(cityName).catch(() => null);
          if (hotelCoords) {
            waypoints.unshift({
              id: "hotel-checkin",
              name: hotelData.hotels[0].name,
              type: "hotel",
              lat: hotelCoords.lat,
              lng: hotelCoords.lng,
              time: "03:00 PM",
              description: "Check in",
            });
          }
        }

        const routeMapData: RouteMapData = {
          city: cityName,
          date: day1?.date,
          dayLabel: day1?.dayLabel,
          waypoints,
          travelMode: "walking",
        };

        // Return RouteMap as primary component for MVP
        // Post-MVP: return ItineraryCard as primary + RouteMap as secondary
        const hasRouteData = waypoints.length > 0;

        return {
          message,
          component: "ItineraryCard",
          data: itineraryData,
          secondaryComponent: hasRouteData ? "RouteMap" : null,
          secondaryData: hasRouteData ? routeMapData : null,
          contextUpdate: {
            origin,
            destination,
            destinationCity: cityName,
            departureDate,
            days,
            travelers: adults,
            shownFlights: flightData
              ? `${flightData.flights.length} flights ${origin}→${destination}`
              : undefined,
            shownHotels: hotelData
              ? `${hotelData.hotels.length} hotels in ${cityName}`
              : undefined,
            shownItinerary: true,
            lastIntent: "plan_trip",
            messageCount: (context?.messageCount ?? 0) + 1,
          },
        };
      } catch (error: any) {
        console.error("[Orchestrator] Trip plan error:", error.message);
        return {
          message: getErrorMessage(intent, error),
          component: null,
          data: null,
        };
      }
    }

    // Destination Info
    case "destination_info": {
      try {
        const cityName =
          params.destinationCity ?? params.destination ?? "Dubai";

        const coords = await geocodeCity(cityName);

        const activityData = await searchActivities({
          destination: cityName,
          latitude: coords.lat,
          longitude: coords.lng,
          maxResults: 8,
          categories: ["tourism", "museum", "attraction", "beach"],
        });

        const message = await generateResponseText(
          userMessage,
          intent,
          `${activityData.activities.length} activities found`,
        );

        return {
          message,
          component: "ActivitySearchResults",
          data: activityData,
        };
      } catch (error: any) {
        console.error("[Orchestrator] Destination info error:", error.message);
        return {
          message: getErrorMessage(intent, error),
          component: null,
          data: null,
        };
      }
    }

    // Flight Status
    case "flight_status": {
      try {
        const flightNumber = params.flightNumber;
        if (!flightNumber) {
          return {
            message:
              "I need a flight number (e.g., BA117) to check the status.",
            component: null,
            data: null,
          };
        }

        const status = await getFlightStatus(flightNumber);
        if (!status) {
          return {
            message: `I couldn't find any active flight info for ${flightNumber}.`,
            component: null,
            data: null,
          };
        }

        const message = await generateResponseText(
          userMessage,
          intent,
          "Flight status found",
        );

        return {
          message,
          component: "FlightStatusCard",
          data: status,
        };
      } catch (error: any) {
        console.error("[Orchestrator] Flight status error:", error.message);
        return {
          message: getErrorMessage(intent, error),
          component: null,
          data: null,
        };
      }
    }

    // General Chat
    case "general_chat":
    default: {
      // RadiusMap trigger: detect hotel neighborhood queries
      const isRadiusQuery =
        /near(?:by)?|around|walking distance|close to|neighbourhood|neighborhood|surroundings|area|cafes?|restaurants? near|pharmacy near|atm near/i.test(
          userMessage,
        );

      const mentionsHotel =
        /hotel|accommodation|where (?:i'm|i am|we're) staying|my hotel|the hotel/i.test(
          userMessage,
        );

      if (isRadiusQuery && mentionsHotel && context?.destination) {
        const hotelName = context?.shownHotels
          ? context.shownHotels
          : (context.destinationCity ?? "hotel area");

        const radiusCoords = await geocodeCity(
          context.destinationCity ?? context.destination,
        ).catch(() => null);

        if (radiusCoords) {
          // Extract POI types from user message
          const poiTypes: string[] = [];
          if (/cafe|coffee/i.test(userMessage)) poiTypes.push("cafe");
          if (/restaurant|food|eat/i.test(userMessage))
            poiTypes.push("restaurant");
          if (/pharmacy|medicine/i.test(userMessage)) poiTypes.push("pharmacy");
          if (/atm|cash|money/i.test(userMessage)) poiTypes.push("atm");
          if (/safe|safety/i.test(userMessage))
            poiTypes.push("police", "hospital");
          if (poiTypes.length === 0)
            poiTypes.push("cafe", "restaurant", "atm", "pharmacy");

          const radiusData: RadiusMapData = {
            centerName: hotelName,
            lat: radiusCoords.lat,
            lng: radiusCoords.lng,
            radiusMinutes: 15,
            poiTypes,
          };

          const radiusMessage = await generateResponseText(
            userMessage,
            "general_chat",
            `neighborhood map around ${hotelName}`,
            context,
          );

          return {
            message: radiusMessage,
            component: "RadiusMap",
            data: radiusData,
          };
        }
      }

      // If no radius match — fall through to normal Gemini general_chat
      try {
        const result = await gemini.generateContent(
          `${SYSTEM_PROMPT}\n\n` +
            `${contextSummary ? `Context:\n${contextSummary}\n\n` : ""}` +
            `User: "${userMessage}"\n\n` +
            `Respond naturally in 1-3 sentences. ` +
            `Do NOT introduce yourself. ` +
            `Do NOT start with a greeting if the ` +
            `conversation is already going. ` +
            `Match the user's tone and energy. ` +
            `Only mention BCH or payment if the ` +
            `user explicitly asks about booking.`,
        );
        return {
          message: result.response.text(),
          component: null,
          data: null,
        };
      } catch {
        const fallback = await groq.chat.completions.create({
          model: GROQ_MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content:
                `${userMessage}\n\n` +
                `Do not introduce yourself. ` +
                `Match my tone. Be natural.`,
            },
          ],
          max_tokens: 150,
          temperature: 0.9,
        });
        return {
          message:
            fallback.choices[0]?.message?.content ??
            "Not sure I caught that — what are you thinking for your next trip?",
          component: null,
          data: null,
        };
      }
    }
  }
}
