import type { QuickAction } from "@/lib/types/chat";

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "qa-1",
    emoji: "✈️",
    icon: "plane",
    label: "Plan a trip to Dubai",
    description: "Flights, hotels & 5-day itinerary",
    prompt: "Plan me a 5 day trip to Dubai from Lagos",
  },
  {
    id: "qa-2",
    emoji: "🏨",
    icon: "compass",
    label: "Best hotels in Bali under $100",
    description: "Find top-rated stays within budget",
    prompt: "Find me the best hotels in Bali under $100 per night",
  },
  {
    id: "qa-3",
    emoji: "💸",
    icon: "calendar",
    label: "Cheapest flights to London",
    description: "One-way and return options",
    prompt: "Find the cheapest flights from Lagos to London",
  },
  {
    id: "qa-4",
    emoji: "🌤️",
    icon: "map",
    label: "Weather in Tokyo this March",
    description: "Best time to pack and visit",
    prompt: "What is the weather like in Tokyo in March?",
  },
];

// Agent status messages shown while AI is working
export const AGENT_STATUS_MESSAGES: Record<string, string> = {
  search_flights: "Searching flights...",
  search_hotels: "Finding hotels...",
  search_activities: "Discovering activities...",
  plan_trip: "Building your itinerary...",
  destination_info: "Researching destination...",
  flight_status: "Checking flight status...",
  general_chat: "Thinking...",
  default: "Working on it...",
};
