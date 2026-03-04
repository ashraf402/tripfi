"use client";

import { Button } from "@/components/ui/button";
import type { Flight } from "@/lib/types/chat";
import { getAirlineLogoUrl } from "@/lib/utils/imageHelpers";
import { motion } from "framer-motion";
import { ChevronDown, Plane, User } from "lucide-react";

interface FlightCardProps {
  flight: Flight;
}

export function FlightCard({ flight }: FlightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,208,132,0.1)" }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface-card transition-all duration-300 hover:border-primary/30 w-full"
    >
      <div className="p-5">
        {/* Header: Airline & Time */}
        <div className="flex items-start justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white p-1">
              <span className="absolute text-xs font-bold text-black uppercase">
                {flight.airlineCode}
              </span>
              <img
                src={getAirlineLogoUrl(flight.airlineCode)}
                alt={flight.airline}
                width={36}
                height={36}
                className="rounded-full bg-white p-0.5 object-contain relative z-10"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            <div>
              <div className="font-semibold text-foreground">
                {flight.airline}
              </div>
              <div className="text-xs text-text-secondary">
                {flight.flightNumber} • {flight.cabin}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-foreground font-heading">
              ${flight.priceUsd}
            </div>
            <div className="text-xs text-primary font-medium">
              {flight.priceBch} BCH
            </div>
          </div>
        </div>

        {/* Flight Path Visualization */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-center w-1/4">
            <div className="text-2xl font-bold text-foreground font-heading">
              {flight.origin}
            </div>
            <div className="text-sm font-medium text-text-secondary">
              {flight.originCity}
            </div>
            <div className="text-xs text-text-secondary/60 truncate max-w-20 mx-auto">
              {flight.departureTime}
            </div>
          </div>

          <div className="flex-1 h-0.5 bg-gray-700 mx-2 relative">
            <div className="absolute right-0 top-1/2 -translate-y-px text-gray-700">
              {flight.duration}
            </div>
            <div className="relative w-full flex items-center">
              <div className="h-0.5 w-full bg-border group-hover:bg-border/60 transition-colors" />
              <Plane className="absolute left-1/2 -translate-x-1/2 -translate-y-px h-4 w-4 text-primary rotate-90" />
              {flight.stops > 0 && (
                <div className="absolute left-1/2 -translate-x-1/2 top-2">
                  <span className="text-[10px] text-text-secondary bg-surface-card px-1 py-0.5 rounded border border-border">
                    {flight.stops} stop{flight.stops > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="text-center w-1/4">
            <div className="text-2xl font-bold text-foreground font-heading">
              {flight.destination}
            </div>
            <div className="text-sm font-medium text-text-secondary">
              {flight.destinationCity}
            </div>
            <div className="text-xs text-text-secondary/60 truncate max-w-20 mx-auto">
              {flight.arrivalTime}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t border-border bg-surface-card/50 px-5 py-3">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          {flight.seatsLeft && flight.seatsLeft < 5 && (
            <span className="text-red-500 font-medium flex items-center gap-1">
              <User className="h-3 w-3" />
              Only {flight.seatsLeft} seats left
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          className="text-sm font-medium text-primary hover:text-primary-hover hover:bg-transparent px-0 h-auto transition-colors flex items-center gap-1"
        >
          View Details <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
