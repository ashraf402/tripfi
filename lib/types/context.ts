export interface ConversationContext {
  // Trip basics
  origin?: string; // IATA: "LOS"
  destination?: string; // IATA: "DXB"
  destinationCity?: string; // "Dubai"
  departureDate?: string; // "2026-03-22"
  returnDate?: string; // "2026-03-27"
  days?: number; // 5
  travelers?: number; // 1
  budget?: number; // 3000 (USD)
  travelClass?: string; // "BUSINESS"

  // User preferences
  preferences?: string[]; // ["luxury", "beach"]
  dietary?: string[]; // ["vegetarian"]
  interests?: string[]; // ["museums", "hiking"]

  // What AI has already shown
  shownFlights?: string; // "3 flights LOS→DXB"
  shownHotels?: string; // "3 hotels in Dubai"
  shownActivities?: string; // "10 activities"
  shownItinerary?: boolean; // true if plan shown

  // Conversation meta
  lastIntent?: string; // "plan_trip"
  messageCount?: number; // 6
  lastUpdated?: string; // ISO timestamp
}
