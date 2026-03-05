// Message Types

export type MessageRole = "user" | "assistant";

export type ComponentType =
  | "FlightSearchResults"
  | "HotelSearchResults"
  | "ItineraryCard"
  | "DestinationGrid"
  | "ActivitySearchResults"
  | "PriceSummaryCard"
  | "WeatherCard"
  | "TripMap"
  | "FlightStatusCard"
  | "MacroMap"
  | "RouteMap"
  | "RadiusMap"
  | null;

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  component?: ComponentType;
  data?:
    | FlightData
    | HotelData
    | ItineraryData
    | DestinationData
    | ActivityData
    | PriceData
    | WeatherData
    | MapData
    | FlightStatusData
    | MacroMapData
    | RouteMapData
    | RadiusMapData
    | null;
  secondaryComponent?: ComponentType;
  secondaryData?: MacroMapData | RouteMapData | RadiusMapData | null;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
}

// Flight Types

export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopsCities?: string[];
  priceUsd: number;
  priceBch: number;
  cabin: "Economy" | "Business" | "First";
  seatsLeft?: number;
  bookingUrl: string;
}

export interface FlightData {
  flights: Flight[];
  searchParams: {
    origin: string;
    destination: string;
    date: string;
    passengers: number;
  };
}

// Hotel Types

export interface Hotel {
  id: string;
  name: string;
  stars: number;
  location: string;
  city: string;
  imageUrl?: string;
  amenities: string[];
  pricePerNightUsd: number;
  pricePerNightBch: number;
  totalPriceUsd: number;
  totalPriceBch: number;
  nights: number;
  rating?: number;
  reviewCount?: number;
  bookingUrl: string;
  latitude?: number;
  longitude?: number;
}

export interface HotelData {
  hotels: Hotel[];
  searchParams: {
    destination: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  };
}

// Itinerary Types

export type ItineraryItemType =
  | "flight"
  | "hotel"
  | "activity"
  | "food"
  | "transport"
  | "free";

export interface ItineraryItemData {
  id: string;
  time: string;
  type: ItineraryItemType;
  title: string;
  description?: string;
  location?: string;
  costUsd?: number;
  costBch?: number;
  bookingUrl?: string;
  latitude?: number;
  longitude?: number;
}

export interface DayData {
  day: number;
  date: string;
  dayLabel: string;
  items: ItineraryItemData[];
  totalCostUsd: number;
}

export interface ItineraryCostBreakdown {
  flightCost: number;
  hotelCost: number;
  activitiesCost: number;
  taxesAndFees: number;
  total: number;
}

export interface ItineraryData {
  tripId?: string;
  title: string;
  origin?: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  travelers: number;
  days: DayData[];
  costs: ItineraryCostBreakdown; // ← replaces flat fields
  totalCostUsd: number; // ← keep for backwards compat
  totalCostBch: number; // ← keep for backwards compat
  isSaved?: boolean;
  bookedTripId?: string;
}

// Destination Types

export interface Destination {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  imageUrl?: string;
  highlights: string[];
  bestTimeToVisit: string;
  visaRequirement: "Visa Free" | "Visa on Arrival" | "Visa Required";
  averageBudgetUsd: number;
  averageBudgetBch: number;
  tags: string[];
  latitude?: number;
  longitude?: number;
}

export interface DestinationData {
  destinations: Destination[];
}

// Activity Types

export interface Activity {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  imageUrl?: string;
  openingHours?: string;
  priceUsd?: number;
  priceBch?: number;
  latitude?: number;
  longitude?: number;
}

export interface ActivityData {
  activities: Activity[];
  destination: string;
}

// Price Types

export interface PriceItem {
  label: string;
  amountUsd: number;
  amountBch: number;
  type: "flight" | "hotel" | "activity" | "other";
}

export interface PriceData {
  items: PriceItem[];
  totalUsd: number;
  totalBch: number;
  bchRate: number;
  currency: string;
}

// Weather Types

export interface WeatherDay {
  date: string;
  dayLabel: string;
  icon: string;
  high: number;
  low: number;
  description: string;
}

export interface WeatherData {
  destination: string;
  currentTemp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  packingTip: string;
  forecast: WeatherDay[];
}

// Map Types

export interface MapMarker {
  id: string;
  type: "hotel" | "activity" | "airport" | "restaurant";
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
}

export interface MapData {
  destination: string;
  centerLat: number;
  centerLng: number;
  zoom: number;
  markers: MapMarker[];
}

// Spatial Map Types

// Shown when suggesting multiple destinations
// so user can see them on a globe/region map
export interface MacroMapData {
  origin?: {
    iata: string;
    city: string;
    lat: number;
    lng: number;
  };
  destinations: Array<{
    city: string;
    iata: string;
    lat: number;
    lng: number;
    label?: string; // "The Safe Bet", "Wildcard" etc
  }>;
  zoom?: "global" | "regional";
}

// Shown when itinerary is generated or
// user asks about a day's route
export interface RouteMapData {
  city: string;
  date?: string;
  dayLabel?: string;
  waypoints: Array<{
    id: string;
    name: string;
    type: "hotel" | "flight" | "activity" | "food" | "transport";
    lat: number;
    lng: number;
    time?: string;
    description?: string;
  }>;
  travelMode: "walking" | "transit" | "driving";
}

// Shown when user asks about hotel surroundings
export interface RadiusMapData {
  centerName: string; // hotel name
  lat: number;
  lng: number;
  radiusMinutes: number; // default 15
  poiTypes: string[]; // ["cafe", "restaurant", "pharmacy", "atm"]
}

// Chat Store Types

export interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
}

// Quick Action Types

export interface QuickAction {
  id: string;
  label: string;
  emoji: string;
  icon?: string;
  prompt: string;
  description?: string;
}

// Flight Status Types

export interface FlightStatusData {
  flightNumber: string;
  airline: string;
  status: string;
  departure: {
    airport: string;
    iataCode: string;
    scheduled: string;
    estimated?: string;
    actual?: string;
    delay?: number;
  };
  arrival: {
    airport: string;
    iataCode: string;
    scheduled: string;
    estimated?: string;
    actual?: string;
    delay?: number;
  };
}
