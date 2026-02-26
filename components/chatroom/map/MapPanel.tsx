"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MapMarker as MapMarkerType } from "@/lib/types/chat";
import { AnimatePresence, motion } from "framer-motion";
import { Map as MapIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MapPopup } from "./MapPopup";
import { TripMap } from "./TripMap";

interface MapPanelProps {
  isOpen: boolean;
  onClose: () => void;
  destination: string;
  centerLat: number;
  centerLng: number;
  markers: MapMarkerType[];
  zoom?: number;
  className?: string;
}

export function MapPanel({
  isOpen,
  onClose,
  destination,
  centerLat,
  centerLng,
  markers,
  zoom = 12,
  className,
}: MapPanelProps) {
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

  // Reset active marker when destination changes
  useEffect(() => {
    setActiveMarkerId(null);
  }, [destination, markers]);

  const activeMarker = markers.find((m) => m.id === activeMarkerId);

  const counts = {
    hotel: markers.filter((m) => m.type === "hotel").length,
    activity: markers.filter((m) => m.type === "activity").length,
    airport: markers.filter((m) => m.type === "airport").length,
    restaurant: markers.filter((m) => m.type === "restaurant").length,
  };

  return (
    <div
      className={`flex flex-col h-full bg-surface border-l border-border ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
        <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
          <MapIcon className="w-4 h-4 text-primary" />
          <span>Map View</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-surface-hover text-text-secondary transition-colors"
          aria-label="Close map"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs & Content */}
      <div className="flex-1 relative flex flex-col min-h-0">
        {/* <div className="px-4 py-2 bg-surface border-b border-border/50">
          <Tabs defaultValue="map" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-8">
              <TabsTrigger value="map" className="text-xs">
                Map
              </TabsTrigger>
              <TabsTrigger value="satellite" className="text-xs">
                Satellite
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div> */}

        <div className="flex-1 relative bg-[#e5e5e5] dark:bg-[#1a1a1a]">
          <TripMap
            data={{
              destination,
              centerLat,
              centerLng,
              zoom,
              markers,
            }}
            activeMarkerId={activeMarkerId}
            onMarkerClick={(id) => setActiveMarkerId(id)}
          />

          {/* Popup Overlay */}
          <AnimatePresence>
            {activeMarker && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-4 left-4 right-4 z-10"
              >
                <MapPopup
                  marker={activeMarker}
                  onClose={() => setActiveMarkerId(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Legend */}
      <div className="px-4 py-3 bg-surface border-t border-border flex flex-col gap-2">
        <div className="text-xs text-text-secondary font-medium">
          {markers.length} locations found
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar mask-gradient-right">
          {counts.hotel > 0 && (
            <LegendChip
              label="Hotels"
              color="bg-[#00D084]"
              count={counts.hotel}
            />
          )}
          {counts.activity > 0 && (
            <LegendChip
              label="Activities"
              color="bg-[#3B82F6]"
              count={counts.activity}
            />
          )}
          {counts.airport > 0 && (
            <LegendChip
              label="Airports"
              color="bg-[#F97316]"
              count={counts.airport}
            />
          )}
          {counts.restaurant > 0 && (
            <LegendChip
              label="Restaurants"
              color="bg-[#A855F7]"
              count={counts.restaurant}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function LegendChip({
  label,
  color,
  count,
}: {
  label: string;
  color: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-surface-card border border-border text-[10px] text-text-secondary whitespace-nowrap">
      <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
      <span>
        {label} ({count})
      </span>
    </div>
  );
}
