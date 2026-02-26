import type { WeatherData } from "@/lib/types/chat";

export const MOCK_WEATHER_DATA: WeatherData = {
  destination: "Dubai",
  currentTemp: 28,
  description: "Sunny and clear",
  humidity: 45,
  windSpeed: 12,
  packingTip:
    "Pack light summer clothes, sunscreen SPF50+, " +
    "and a light layer for heavily air-conditioned malls.",
  forecast: [
    {
      date: "2025-03-10",
      dayLabel: "Mon",
      icon: "sun", // Changed to string "sun" to match expected type if not emoji
      high: 30,
      low: 22,
      description: "Sunny",
    },
    {
      date: "2025-03-11",
      dayLabel: "Tue",
      icon: "sun",
      high: 29,
      low: 21,
      description: "Partly cloudy",
    },
    {
      date: "2025-03-12",
      dayLabel: "Wed",
      icon: "sun",
      high: 31,
      low: 23,
      description: "Sunny",
    },
    {
      date: "2025-03-13",
      dayLabel: "Thu",
      icon: "wind",
      high: 27,
      low: 20,
      description: "Windy",
    },
    {
      date: "2025-03-14",
      dayLabel: "Fri",
      icon: "sun",
      high: 30,
      low: 22,
      description: "Sunny",
    },
  ],
};
