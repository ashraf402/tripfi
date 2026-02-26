"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { FlightData } from "@/lib/types/chat";
import { motion } from "framer-motion";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { FlightCard } from "./FlightCard";
import { FlightCardSkeleton } from "./FlightCardSkeleton";
import { FlightFilters } from "./FlightFilters";

interface FlightSearchResultsProps {
  data: FlightData;
  isLoading?: boolean;
}

export function FlightSearchResults({
  data,
  isLoading,
}: FlightSearchResultsProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full space-y-3">
        <FlightCardSkeleton />
        <FlightCardSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header Summary */}
      <div className="flex items-center justify-between rounded-xl bg-surface-card border border-border px-4 py-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <span>{data.searchParams.origin}</span>
            <ArrowRight className="h-4 w-4 text-text-secondary" />
            <span>{data.searchParams.destination}</span>
          </div>
          <div className="text-xs text-text-secondary">
            {data.searchParams.date} • {data.searchParams.passengers} Adult
            {data.searchParams.passengers > 1 ? "s" : ""}
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
            <FlightFilters onClose={() => setIsFilterOpen(false)} />
          </PopoverContent>
        </Popover>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {data.flights.map((flight, index) => (
          <motion.div
            key={flight.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <FlightCard flight={flight} />
          </motion.div>
        ))}
      </div>

      {/* Show more button */}
      <Button
        variant="ghost"
        className="w-full text-text-secondary hover:text-primary hover:bg-transparent text-sm"
      >
        Show more flights
      </Button>
    </div>
  );
}
