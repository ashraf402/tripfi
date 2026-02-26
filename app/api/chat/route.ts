import { NextRequest, NextResponse } from "next/server";
import { orchestrate } from "@/lib/ai/orchestrator";
import { getUserLocationFromIP } from "@/lib/services/location/locationService";
import { saveMessage } from "@/lib/services/chat/chatService";
import { extractContext } from "@/lib/ai/contextExtractor";

export const maxDuration = 30; // Allow 30s for complex trip plans

// ── Location cache (per session) ──────────────────────
// Store in module scope — persists across requests
// in the same server instance
const locationCache = new Map<
  string,
  {
    iataCode: string | null;
    city: string | null;
    cachedAt: number;
  }
>();

const LOCATION_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages,
      conversationId,
      skipUserMessageSave,
      context,
      sessionId,
    } = body;

    // ── Location: read from cache first ───────────────
    let locationData = null;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 },
      );
    }

    const lastMessage = messages[messages.length - 1];
    const history = messages.slice(0, -1);

    // 0. Save User Message (if part of existing convo)
    if (conversationId && !skipUserMessageSave) {
      await saveMessage(conversationId, {
        ...lastMessage,
        role: "user",
        timestamp: new Date(),
      }).catch((err) =>
        console.error("[API] Failed to save user message:", err.message),
      );
    }

    // 1. Detect Location — cache-first to avoid hitting the API every request
    const cacheKey = sessionId ?? conversationId ?? "default";
    const cached = locationCache.get(cacheKey);
    const isFresh = cached && Date.now() - cached.cachedAt < LOCATION_CACHE_TTL;

    let location: { iataCode: string | null; city: string | null } | null =
      null;

    if (isFresh) {
      location = cached;
      console.log(`[Location] Cache hit: ${cached.city} (${cached.iataCode})`);
    } else {
      console.log("[Location] Detecting user location...");
      const detected = await getUserLocationFromIP();
      if (detected) {
        console.log(
          `[Location] ${detected.provider} → ` +
            `${detected.city}, ${detected.country} → ` +
            `${detected.iataCode ?? "No IATA"}`,
        );
      } else {
        console.log("[Location] All providers failed → asking user if needed");
      }
      location = detected
        ? { iataCode: detected.iataCode ?? null, city: detected.city ?? null }
        : null;
      locationCache.set(cacheKey, {
        iataCode: location?.iataCode ?? null,
        city: location?.city ?? null,
        cachedAt: Date.now(),
      });
    }

    // 2. Orchestrate with location context
    const response = await orchestrate(
      lastMessage.content,
      history,
      location?.iataCode ?? undefined,
      context ?? {},
    );

    // 3. Extract additional context from exchange (runs async, non-blocking on errors)
    const extractedContext = await extractContext(
      lastMessage.content,
      response.message,
      context ?? {},
    ).catch(() => ({}));

    // Merge: orchestrator's contextUpdate takes priority
    const mergedContextUpdate = {
      ...extractedContext,
      ...(response.contextUpdate ?? {}),
    };

    // 3. Save Assistant Message
    if (conversationId) {
      await saveMessage(conversationId, {
        id: `ai-${Date.now()}`, // Temporary ID, DB triggers will handle real one if needed
        role: "assistant",
        content: response.message,
        component: response.component,
        data: response.data,
        timestamp: new Date(),
      } as any).catch((err) =>
        console.error("[API] Failed to save assistant message:", err.message),
      );
    }

    // 4. Return structured response
    return NextResponse.json({
      message: response.message,
      component: response.component,
      data: response.data,
      contextUpdate: mergedContextUpdate,
    });
  } catch (error: any) {
    console.error("[API] Chat error:", error.message);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
