"use client";

import { motion } from "framer-motion";
import { Plane, Hotel, Map, Utensils, Coffee, Bus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ItineraryItemData, ItineraryItemType } from "@/lib/types/chat";

interface ItineraryItemProps {
  item: ItineraryItemData;
  isLast?: boolean;
}

const icons: Record<ItineraryItemType, any> = {
  flight: Plane,
  hotel: Hotel,
  activity: Map,
  food: Utensils,
  transport: Bus,
  free: Coffee,
};

const colors: Record<ItineraryItemType, string> = {
  flight: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  hotel: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  activity: "text-primary bg-primary/10 border-primary/20",
  food: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  transport: "text-gray-400 bg-gray-400/10 border-gray-400/20",
  free: "text-green-400 bg-green-400/10 border-green-400/20",
};

export function ItineraryItem({ item, isLast }: ItineraryItemProps) {
  const Icon = icons[item.type] || Map;
  const colorClass = colors[item.type] || colors.activity;

  return (
    <div className="relative flex gap-4">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-4.75 top-8 bottom-0 w-0.5 bg-linear-to-b from-[#1F1F1F] to-transparent z-0" />
      )}

      {/* Icon Bubble */}
      <div
        className={cn(
          "relative z-10 flex h-8 sm:h-10 w-8 sm:w-10 shrink-0 items-center justify-center rounded-full border",
          colorClass,
        )}
      >
        <Icon className="h-4 sm:h-5 w-4 sm:w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-heading font-semibold text-foreground">
              {item.title}
            </div>
            <div className="text-sm font-medium text-text-secondary">
              {item.time}
            </div>
          </div>
          {item.costUsd !== undefined && item.costUsd !== null && (
            <div className="text-right">
              <div className="text-sm font-bold text-foreground">
                {item.costUsd > 0 ? `$${item.costUsd}` : "Free"}
              </div>
              {item.costBch !== undefined &&
                item.costBch !== null &&
                item.costBch > 0 && (
                  <div className="text-xs text-primary">{item.costBch} BCH</div>
                )}
            </div>
          )}
        </div>

        {item.description && (
          <p className="mt-1 text-sm text-text-secondary leading-relaxed max-w-[90%]">
            {item.description}
          </p>
        )}

        {item.location && (
          <div className="mt-2 text-xs text-text-secondary/70 flex items-center gap-1">
            <Map className="h-3 w-3" />
            {item.location}
          </div>
        )}
      </div>
    </div>
  );
}
