"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { HotelCard } from "./HotelCard";
import { HotelFilters } from "./HotelFilters";
import { HotelCardSkeleton } from "./HotelCardSkeleton";
import type { HotelData } from "@/lib/types/chat";

interface HotelSearchResultsProps {
  data: HotelData;
  isLoading?: boolean;
}

export function HotelSearchResults({
  data,
  isLoading,
}: HotelSearchResultsProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        <HotelCardSkeleton />
        <HotelCardSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header Summary */}
      <div className="flex items-center justify-between rounded-xl bg-surface-card border border-border px-4 py-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{data.searchParams.destination}</span>
          </div>
          <div className="text-xs text-text-secondary">
            {data.searchParams.checkIn} - {data.searchParams.checkOut} •{" "}
            {data.searchParams.guests} Guests
          </div>
        </div>

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-border text-text-secondary hover:text-primary hover:border-primary/50 gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-75 p-0 bg-surface border-border"
          >
            <HotelFilters onClose={() => setIsFilterOpen(false)} />
          </PopoverContent>
        </Popover>
      </div>

      {/* Results Grid - Horizontal scroll on mobile, grid on desktop */}
        <ScrollArea className="w-full pb-4">
          <div className="w-max sm:w-full flex gap-4 sm:grid sm:grid-cols-2">
            {data.hotels.map((hotel, index) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="w-full min-w-70 sm:min-w-0"
              >
                <HotelCard hotel={hotel} />
              </motion.div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

      {/* Show more button */}
      <Button
        variant="ghost"
        className="w-full text-text-secondary hover:text-primary hover:bg-transparent text-sm"
      >
        View more hotels
      </Button>
    </div>
  );
}
