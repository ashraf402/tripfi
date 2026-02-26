export interface TravelStyle {
  id: string;
  emoji: string; // Changed from icon: ElementType to emoji string for serializability in data layer
  label: string;
  description: string;
}

export const TRAVEL_STYLES: TravelStyle[] = [
  {
    id: "beach",
    emoji: "🏖️",
    label: "Beach & Relaxation",
    description: "Sun, sand, and slow mornings",
  },
  {
    id: "adventure",
    emoji: "🏔️",
    label: "Adventure & Outdoors",
    description: "Hikes, thrills, and wild places",
  },
  {
    id: "culture",
    emoji: "🏛️",
    label: "Culture & History",
    description: "Museums, ruins, and local life",
  },
  {
    id: "food",
    emoji: "🍜",
    label: "Food & Nightlife",
    description: "Markets, restaurants, and vibes",
  },
];

export interface BCHBenefit {
  icon: string; // lucide icon name
  text: string;
}

export const BCH_BENEFITS: BCHBenefit[] = [
  {
    icon: "Zap",
    text: "Payments settle in under 2 seconds",
  },
  {
    icon: "Clock",
    text: "Network fees under $0.001",
  },
  {
    icon: "Shield",
    text: "Blockchain receipt for every booking",
  },
];
