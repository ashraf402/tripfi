"use client";

import { BookingModal } from "@/components/chatroom/booking/BookingModal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { ItineraryData } from "@/lib/types/chat";
import { getDestinationImage } from "@/lib/utils/imageHelpers";
import { motion } from "framer-motion";
import { Bitcoin, Plane, Hotel, MapPin, Receipt } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DayCard } from "./DayCard";
import { SaveItineraryButton } from "./SaveItineraryButton";

interface ItineraryCardProps {
  data: ItineraryData;
  onSave?: () => void;
}

export function ItineraryCard({ data, onSave }: ItineraryCardProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [heroImage, setHeroImage] = useState<string>(
    `https://source.unsplash.com/800x400/?${encodeURIComponent(data.destination)},city`,
  );
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    getDestinationImage(data.destination).then((url) => {
      setHeroImage(url);
      setImageLoaded(true);
    });
  }, [data.destination]);

  return (
    <div className="flex w-full flex-col gap-4 max-w-full lg:max-w-lg rounded-2xl border border-border bg-surface-card p-4 sm:p-5 overflow-hidden">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold bg-linear-to-r from-primary to-primary-hover bg-clip-text text-transparent">
          {data.title}
        </h2>
        <SaveItineraryButton
          isSaved={data.isSaved}
          onSave={onSave || (() => {})}
        />
      </div>

      {/* Hero Image Section */}
      <div className="relative w-full h-32 rounded-xl overflow-hidden mt-1 mb-1">
        <Image
          src={heroImage}
          alt={data.destination}
          fill
          sizes="(max-width: 1024px) 100vw, 512px"
          className={`object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-70"}`}
          onError={(e) => {
            e.currentTarget.src =
              "https://source.unsplash.com/800x400/?travel,city";
          }}
        />
      </div>

      {/* Timeline */}
      <div className="space-y-4 relative sm:pl-2 sm:border-l sm:border-border sm:ml-2">
        {data.days.map((day) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative sm:pl-6"
          >
            {/* Timeline Dot */}
            <div className="absolute hidden sm:flex top-1/2 -left-3.25 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#00D084] shadow-[0_0_8px_rgba(0,208,132,0.6)] z-20" />

            <DayCard
              day={day}
              isExpanded={expandedDay === day.day}
              onToggle={() =>
                setExpandedDay(expandedDay === day.day ? null : day.day)
              }
            />
          </motion.div>
        ))}
      </div>

      {/* Footer Actions */}
      {data.costs && (
        <div className="mt-4 pt-4 border-t border-border space-y-2.5 px-4">
          <p className="text-secondary text-xs font-semibold uppercase tracking-wider">
            Cost Estimate
          </p>

          {data.costs.flightCost > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-secondary">
                <Plane className="w-3.5 h-3.5" />
                <span className="text-sm">Flights</span>
              </div>
              <span className="text-foreground text-sm font-medium">
                ${data.costs.flightCost.toFixed(2)}
              </span>
            </div>
          )}

          {data.costs.hotelCost > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-secondary">
                <Hotel className="w-3.5 h-3.5" />
                <span className="text-sm">Hotel ({data.totalDays} nights)</span>
              </div>
              <span className="text-foreground text-sm font-medium">
                ${data.costs.hotelCost.toFixed(2)}
              </span>
            </div>
          )}

          {data.costs.activitiesCost > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-secondary">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-sm">Activities</span>
              </div>
              <span className="text-foreground text-sm font-medium">
                ${data.costs.activitiesCost.toFixed(2)}
              </span>
            </div>
          )}

          {data.costs.taxesAndFees > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-secondary">
                <Receipt className="w-3.5 h-3.5" />
                <span className="text-sm">Taxes and fees (est.)</span>
              </div>
              <span className="text-foreground text-sm font-medium">
                ${data.costs.taxesAndFees.toFixed(2)}
              </span>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between pb-1">
            <span className="text-foreground font-bold text-sm">Total</span>
            <div className="text-right">
              <p className="text-foreground font-bold">
                ${data.costs.total.toFixed(2)}
              </p>
              <p className="text-primary text-xs font-medium">
                {data.totalCostBch.toFixed(8)} BCH
              </p>
            </div>
          </div>
        </div>
      )}

      {!data.costs && data.totalCostUsd > 0 && (
        <div className="mt-4 pt-4 border-t border-border px-4 pb-1">
          <div className="flex items-center justify-between">
            <span className="text-foreground font-bold text-sm">Total</span>
            <div className="text-right">
              <p className="text-foreground font-bold">
                ${data.totalCostUsd.toFixed(2)}
              </p>
              <p className="text-primary text-xs">
                {data.totalCostBch.toFixed(8)} BCH
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex justify-end gap-2 pt-2">
        <Button
          variant="outline"
          className="border-border bg-transparent text-foreground hover:bg-surface-hover h-10 px-4"
        >
          Save Plan
        </Button>
        <Button
          onClick={() => setIsBookingOpen(true)}
          className="bg-primary text-black hover:bg-primary-hover font-bold h-10 px-4 gap-2 shadow-[0_0_15px_rgba(0,208,132,0.3)]"
        >
          <Bitcoin className="h-4 w-4" />
          Book this trip
        </Button>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        itinerary={data}
        conversationId={data.tripId ?? ""}
      />
    </div>
  );
}
