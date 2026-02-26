import type { ActivityData } from "@/lib/types/chat";

export const MOCK_ACTIVITY_DATA: ActivityData = {
  destination: "Dubai",
  activities: [
    {
      id: "activity-mock-1",
      name: "Burj Khalifa Observation Deck",
      category: "Attraction",
      location: "Downtown Dubai, Dubai",
      description:
        "Visit the world's tallest building and enjoy " +
        "panoramic views of Dubai from the 124th floor.",
      openingHours: "09:00 - 23:00",
      priceUsd: 35,
      priceBch: 0.07,
      latitude: 25.1972,
      longitude: 55.2744,
    },
    {
      id: "activity-mock-2",
      name: "Dubai Mall",
      category: "Shopping",
      location: "Downtown Dubai, Dubai",
      description:
        "The world's largest mall with over 1,200 stores, " +
        "an aquarium, ice rink, and countless dining options.",
      openingHours: "10:00 - 00:00",
      priceUsd: 0,
      priceBch: 0,
      latitude: 25.1985,
      longitude: 55.2796,
    },
    {
      id: "activity-mock-3",
      name: "Desert Safari",
      category: "Adventure",
      location: "Dubai Desert Conservation Reserve",
      description:
        "Experience dune bashing, camel riding, " +
        "sandboarding, and a traditional Bedouin dinner.",
      openingHours: "14:00 - 22:00",
      priceUsd: 65,
      priceBch: 0.13,
      latitude: 24.8925,
      longitude: 55.5105,
    },
    {
      id: "activity-mock-4",
      name: "Dubai Creek & Gold Souk",
      category: "Culture",
      location: "Deira, Dubai",
      description:
        "Explore the historic creek by abra boat and " +
        "browse the famous Gold and Spice Souks.",
      openingHours: "09:00 - 22:00",
      priceUsd: 5,
      priceBch: 0.01,
      latitude: 25.2697,
      longitude: 55.3094,
    },
    {
      id: "activity-mock-5",
      name: "Palm Jumeirah Monorail",
      category: "Transport",
      location: "Palm Jumeirah, Dubai",
      description:
        "Ride the monorail across Palm Jumeirah " +
        "for stunning views of the artificial island.",
      openingHours: "09:00 - 22:00",
      priceUsd: 8,
      priceBch: 0.016,
      latitude: 25.1124,
      longitude: 55.139,
    },
  ],
};

// Skeleton count for loading state
export const ACTIVITY_SKELETON_COUNT = 4;
