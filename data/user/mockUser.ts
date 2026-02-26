import type { Profile } from "@/lib/types";

export const MOCK_USER: Profile = {
  id: "mock-user-id",
  name: "Traveler",
  avatar_url: null,
  travel_style: ["beach", "culture"],
  bch_wallet_address: null,
  onboarding_completed: true,
  username: null,
  website: null,
  updated_at: new Date().toISOString(),
};

// Sidebar recent conversations mock
export interface MockConversation {
  id: string;
  title: string;
  emoji: string;
  date: string;
  isActive?: boolean;
}

export const MOCK_CONVERSATIONS: MockConversation[] = [
  {
    id: "conv-1",
    title: "Dubai 5 Days",
    emoji: "✈️",
    date: "Feb 12",
  },
  {
    id: "conv-2",
    title: "Bali Budget Trip",
    emoji: "🏖️",
    date: "Feb 8",
  },
  {
    id: "conv-3",
    title: "London Flights",
    emoji: "🇬🇧",
    date: "Jan 30",
  },
  {
    id: "conv-4",
    title: "Tokyo in March",
    emoji: "🌸",
    date: "Jan 22",
  },
];
