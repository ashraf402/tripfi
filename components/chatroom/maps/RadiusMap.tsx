"use client";

import { MapPin, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import { useOpenMap } from "@/lib/store/mapStore";
import type { RadiusMapData, MapMarker } from "@/lib/types/chat";

interface RadiusMapProps {
  data: RadiusMapData;
}

const POI_EMOJI: Record<string, string> = {
  cafe: "☕",
  restaurant: "🍽️",
  pharmacy: "💊",
  atm: "🏧",
  police: "🚔",
  hospital: "🏥",
};

export function RadiusMap({ data }: RadiusMapProps) {
  const openMap = useOpenMap();

  const handleViewNeighborhood = () => {
    const markers: MapMarker[] = [
      {
        id: "center-hotel",
        name: data.centerName,
        type: "hotel",
        latitude: data.lat,
        longitude: data.lng,
        description: `${data.radiusMinutes} min walk radius`,
      },
    ];

    openMap({
      destination: data.centerName,
      centerLat: data.lat,
      centerLng: data.lng,
      markers,
      zoom: 15,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-border rounded-2xl p-4 mt-2"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Navigation className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-foreground text-sm font-semibold">
            Neighborhood View
          </p>
          <p className="text-secondary text-xs truncate max-w-50">
            {data.radiusMinutes} min walk from {data.centerName}
          </p>
        </div>
      </div>

      {/* POI type pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {data.poiTypes.map((poi, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 bg-background border border-border rounded-full px-3 py-1"
          >
            <span className="text-xs">{POI_EMOJI[poi] ?? "📍"}</span>
            <span className="text-foreground text-xs capitalize">{poi}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={handleViewNeighborhood}
        className="w-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium rounded-xl py-2.5 hover:bg-primary/20 hover:border-primary transition-all duration-200"
      >
        View neighborhood →
      </button>
    </motion.div>
  );
}
