"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ItineraryItem } from "./ItineraryItem";
import type { DayData } from "@/lib/types/chat";

interface DayCardProps {
  day: DayData;
  isExpanded?: boolean;
  onToggle: () => void;
}

export function DayCard({ day, isExpanded = false, onToggle }: DayCardProps) {
  return (
    <div className="w-full rounded-xl border border-border bg-surface-card overflow-hidden transition-all duration-300 hover:border-border/80">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 transition-colors hover:bg-surface-hover"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-surface border border-border text-center">
            <span className="text-[10px] font-bold uppercase text-text-secondary">
              Day
            </span>
            <span className="text-lg font-bold leading-none text-foreground">
              {day.day}
            </span>
          </div>
          <div className="text-left">
            <div className="text-sm sm:text-lg font-heading font-semibold text-foreground">
              {day.dayLabel}
            </div>
            <div className="text-xs text-text-secondary">
              {day.items.length} Activities •{" "}
              {day.totalCostUsd > 0 ? `$${day.totalCostUsd}` : "Free"}
            </div>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-text-secondary transition-transform duration-300",
            isExpanded && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 pt-2">
              <div className="mb-4 h-px w-full bg-border" />
              <div className="pl-2">
                {day.items.map((item, index) => (
                  <ItineraryItem
                    key={item.id}
                    item={item}
                    isLast={index === day.items.length - 1}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
