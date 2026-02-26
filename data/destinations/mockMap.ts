import type { MapData } from "@/lib/types/chat";

export const MOCK_MAP_DATA: MapData = {
  destination: "Dubai",
  centerLat: 25.2048,
  centerLng: 55.2708,
  zoom: 12,
  markers: [
    {
      id: "1",
      type: "hotel" as const,
      name: "Atlantis",
      latitude: 25.1304,
      longitude: 55.1171,
    },
    {
      id: "2",
      type: "activity" as const,
      name: "Burj Khalifa",
      latitude: 25.1972,
      longitude: 55.2744,
    },
  ],
};
