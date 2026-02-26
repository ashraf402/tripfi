"use client";

import { Route, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useOpenMap } from "@/lib/store/mapStore";
import type { RouteMapData, MapMarker } from "@/lib/types/chat";

interface RouteMapProps {
  data: RouteMapData;
}

// Map waypoint types to MapMarker types
function toMarkerType(type: string): MapMarker["type"] {
  switch (type) {
    case "hotel":
      return "hotel";
    case "flight":
      return "airport";
    case "food":
      return "restaurant";
    default:
      return "activity";
  }
}

export function RouteMap({ data }: RouteMapProps) {
  const openMap = useOpenMap();

  const handleViewRoute = () => {
    const markers: MapMarker[] = data.waypoints.map((wp, i) => ({
      id: wp.id ?? `wp-${i}`,
      name: wp.name,
      type: toMarkerType(wp.type),
      latitude: wp.lat,
      longitude: wp.lng,
      description: wp.time
        ? `${wp.time} — ${wp.description ?? ""}`
        : wp.description,
    }));

    const centerLat = data.waypoints[0]?.lat ?? 0;
    const centerLng = data.waypoints[0]?.lng ?? 0;

    openMap({
      destination: data.city,
      centerLat,
      centerLng,
      markers,
      zoom: 13,
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
          <Route className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-foreground text-sm font-semibold">
            {data.dayLabel ?? `Day in ${data.city}`}
          </p>
          <p className="text-secondary text-xs">
            {data.waypoints.length} stops • {data.travelMode}
          </p>
        </div>
      </div>

      {/* Waypoint timeline */}
      <div className="space-y-2 mb-4">
        {data.waypoints.slice(0, 4).map((wp, i) => (
          <div key={wp.id} className="flex items-center gap-3">
            {/* Time */}
            <div className="flex items-center gap-1 w-20 shrink-0">
              <Clock className="w-3 h-3 text-secondary" />
              <span className="text-secondary text-xs">{wp.time ?? "—"}</span>
            </div>

            {/* Dot connector */}
            <div className="relative flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
              {i < data.waypoints.slice(0, 4).length - 1 && (
                <div className="absolute top-2 w-px h-4 bg-border" />
              )}
            </div>

            {/* Name */}
            <span className="text-foreground text-xs truncate">{wp.name}</span>
          </div>
        ))}
        {data.waypoints.length > 4 && (
          <p className="text-secondary text-xs pl-24">
            +{data.waypoints.length - 4} more stops
          </p>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={handleViewRoute}
        className="w-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium rounded-xl py-2.5 hover:bg-primary/20 hover:border-primary transition-all duration-200"
      >
        View route on map →
      </button>
    </motion.div>
  );
}
