"use client";

import { Globe, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useOpenMap } from "@/lib/store/mapStore";
import type { MacroMapData, MapMarker } from "@/lib/types/chat";

interface MacroMapProps {
  data: MacroMapData;
}

export function MacroMap({ data }: MacroMapProps) {
  const openMap = useOpenMap();

  const handleViewOnMap = () => {
    const markers: MapMarker[] = [];

    // Add origin marker if available
    if (data.origin) {
      markers.push({
        id: "origin",
        name: `${data.origin.city} (Your Origin)`,
        type: "airport",
        latitude: data.origin.lat,
        longitude: data.origin.lng,
        description: `Flying from ${data.origin.iata}`,
      });
    }

    // Add destination markers
    data.destinations.forEach((dest, i) => {
      markers.push({
        id: `dest-${i}`,
        name: dest.city,
        type: "activity",
        latitude: dest.lat,
        longitude: dest.lng,
        description: dest.label ?? `Option ${i + 1}`,
      });
    });

    // Center on average of all coords
    const allLats = [
      ...(data.origin ? [data.origin.lat] : []),
      ...data.destinations.map((d) => d.lat),
    ];
    const allLngs = [
      ...(data.origin ? [data.origin.lng] : []),
      ...data.destinations.map((d) => d.lng),
    ];
    const centerLat = allLats.reduce((a, b) => a + b, 0) / allLats.length;
    const centerLng = allLngs.reduce((a, b) => a + b, 0) / allLngs.length;

    openMap({
      destination: data.destinations[0]?.city ?? "Destinations",
      centerLat,
      centerLng,
      markers,
      zoom: data.zoom === "global" ? 2 : 4,
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
          <Globe className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-foreground text-sm font-semibold">
            Destination Overview
          </p>
          <p className="text-secondary text-xs">
            {data.destinations.length} destination
            {data.destinations.length !== 1 ? "s" : ""}
            {data.origin ? ` from ${data.origin.city}` : ""}
          </p>
        </div>
      </div>

      {/* Destination pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {data.destinations.map((dest, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 bg-background border border-border rounded-full px-3 py-1"
          >
            <MapPin className="w-3 h-3 text-primary shrink-0" />
            <span className="text-foreground text-xs font-medium">
              {dest.city}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={handleViewOnMap}
        className="w-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium rounded-xl py-2.5 hover:bg-primary/20 hover:border-primary transition-all duration-200"
      >
        View all on map →
      </button>
    </motion.div>
  );
}
