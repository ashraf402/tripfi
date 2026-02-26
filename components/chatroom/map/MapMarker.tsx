"use client";

import { MapPin, Hotel, Plane, Utensils, Zap } from "lucide-react";
import type { MapMarker as MapMarkerType } from "@/lib/types/chat";

interface MapMarkerProps {
  marker: MapMarkerType;
  isActive?: boolean;
  onClick?: (marker: MapMarkerType) => void;
}

const iconMap: Record<string, any> = {
  hotel: Hotel,
  activity: Zap, // Using Zap for activity/attraction
  airport: Plane,
  restaurant: Utensils,
};

const colorMap: Record<string, string> = {
  hotel: "rgba(0, 208, 132, 0.15)", // Greenish
  activity: "rgba(59, 130, 246, 0.15)", // Blueish
  airport: "rgba(249, 115, 22, 0.15)", // Orangeish
  restaurant: "rgba(168, 85, 247, 0.15)", // Purpleish
};

const borderColorMap: Record<string, string> = {
  hotel: "rgba(0, 208, 132, 0.8)",
  activity: "rgba(59, 130, 246, 0.8)",
  airport: "rgba(249, 115, 22, 0.8)",
  restaurant: "rgba(168, 85, 247, 0.8)",
};

export function MapMarker({ marker, isActive, onClick }: MapMarkerProps) {
  const Icon = iconMap[marker.type] || MapPin;
  const bg = colorMap[marker.type] || colorMap.hotel;
  const border = borderColorMap[marker.type] || borderColorMap.hotel;

  return (
    <div
      className={`
        relative flex items-center justify-center 
        w-9 h-9 rounded-full cursor-pointer transition-all duration-300
        ${isActive ? "scale-125 z-20 shadow-xl" : "scale-100 z-10 shadow-md"}
      `}
      style={{
        backgroundColor: bg,
        border: `2px solid ${isActive ? "#FFFFFF" : border}`,
        boxShadow: isActive ? `0 0 0 2px ${border}` : undefined,
      }}
      onClick={() => onClick?.(marker)}
    >
      <Icon
        className="w-4 h-4"
        style={{
          color: isActive ? border : "currentColor",
        }}
      />
      {isActive && (
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px]"
          style={{ borderTopColor: border }}
        />
      )}
    </div>
  );
}
