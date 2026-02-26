export interface VibeOption {
  id: string;
  emoji: string;
  label: string;
  sublabel: string;
  gradient: string; // Tailwind gradient classes
  prompt: string; // What gets sent to AI
  destinations: string[]; // Example destinations shown on hover
}

export const VIBE_OPTIONS: VibeOption[] = [
  {
    id: "beach",
    emoji: "🏖️",
    label: "Beach & Chill",
    sublabel: "Sun, sand, do nothing",
    gradient: "from-amber-500/20 to-orange-500/10",
    prompt: "beach holiday",
    destinations: ["Bali", "Maldives", "Zanzibar"],
  },
  {
    id: "adventure",
    emoji: "🏔️",
    label: "Adventure",
    sublabel: "Hike, explore, discover",
    gradient: "from-emerald-500/20 to-green-500/10",
    prompt: "adventure trip",
    destinations: ["Iceland", "Nepal", "Patagonia"],
  },
  {
    id: "culture",
    emoji: "🏛️",
    label: "Culture & City",
    sublabel: "Art, food, architecture",
    gradient: "from-purple-500/20 to-violet-500/10",
    prompt: "cultural city break",
    destinations: ["Rome", "Tokyo", "Istanbul"],
  },
  {
    id: "party",
    emoji: "🎉",
    label: "Party & Nightlife",
    sublabel: "Music, clubs, energy",
    gradient: "from-pink-500/20 to-rose-500/10",
    prompt: "party and nightlife trip",
    destinations: ["Ibiza", "Bangkok", "Miami"],
  },
];

export const DURATION_OPTIONS = [
  { label: "Weekend", days: 3 },
  { label: "1 Week", days: 7 },
  { label: "2 Weeks", days: 14 },
  { label: "1 Month", days: 30 },
];

export const MONTH_OPTIONS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
