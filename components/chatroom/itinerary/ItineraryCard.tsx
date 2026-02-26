"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DayCard } from "./DayCard";
import { ItinerarySummary } from "./ItinerarySummary";
import { SaveItineraryButton } from "./SaveItineraryButton";
import { getDestinationImage } from "@/lib/utils/imageHelpers";
import Image from "next/image";
import type { ItineraryData } from "@/lib/types/chat";

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
      <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between border-t border-border pt-4">
        <div className="flex flex-col">
          <span className="text-xs text-text-secondary">
            Total Estimated Cost
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-heading font-bold text-foreground">
              ${data.totalCostUsd.toLocaleString()}
            </span>
            <span className="text-sm text-text-secondary">
              / ${data.totalCostUsd + 200}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="border-border bg-transparent text-foreground hover:bg-surface-hover h-10 px-4"
          >
            Save Plan
          </Button>
          <Button className="bg-primary text-black hover:bg-primary-hover font-bold h-10 px-4 gap-2 shadow-[0_0_15px_rgba(0,208,132,0.3)]">
            <Wallet className="h-4 w-4" />
            Pay with BCH
          </Button>
        </div>
      </div>
    </div>
  );
}
