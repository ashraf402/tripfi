"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { VibeCard } from "@/components/chatroom/core/VibeCard";
import {
  VIBE_OPTIONS,
  DURATION_OPTIONS,
  MONTH_OPTIONS,
  type VibeOption,
} from "@/lib/types/vibe";

interface VibeCheckProps {
  onSend: (message: string) => Promise<void>;
  isLoading: boolean;
}

export function VibeCheck({ onSend, isLoading }: VibeCheckProps) {
  const [selectedVibe, setSelectedVibe] = useState<VibeOption | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Scroll the details panel into view whenever a vibe is picked
  useEffect(() => {
    if (!selectedVibe) return;
    const timer = setTimeout(() => {
      detailsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 120); // slight delay so the AnimatePresence animation has started
    return () => clearTimeout(timer);
  }, [selectedVibe]);

  const handleVibeSelect = (vibe: VibeOption) => {
    // Toggle off if already selected
    setSelectedVibe((prev) => (prev?.id === vibe.id ? null : vibe));
  };

  const handleFindTrip = async () => {
    if (!selectedVibe || isLoading) return;

    // Build natural language message from selections
    const durationText = selectedDuration
      ? DURATION_OPTIONS.find(
          (d) => d.days === selectedDuration,
        )?.label.toLowerCase()
      : null;

    const monthText = selectedMonth?.toLowerCase();

    // Build message naturally
    let message = `Suggest places for a ${selectedVibe.prompt}`;

    if (durationText) {
      message += ` for ${durationText}`;
    }

    if (monthText) {
      message += ` in ${monthText}`;
    }

    await onSend(message);
  };

  return (
    <div className="w-full max-w-2xl space-y-4">
      {/* Label */}
      <p className="text-secondary text-sm text-center">
        Pick a vibe or type your destination — I'll handle the rest.
      </p>

      {/* Vibe Cards — 2x2 grid */}
      <div className="grid grid-cols-2 gap-3">
        {VIBE_OPTIONS.map((vibe, i) => (
          <motion.div
            key={vibe.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <VibeCard
              vibe={vibe}
              isSelected={selectedVibe?.id === vibe.id}
              onSelect={handleVibeSelect}
            />
          </motion.div>
        ))}
      </div>

      {/* Step 2 — Details (slide in after vibe selected) */}
      <AnimatePresence>
        {selectedVibe && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-4 overflow-hidden"
          >
            {/* Duration picker */}
            <div className="space-y-2">
              <p className="text-secondary text-xs">How long?</p>
              <div className="flex gap-2 flex-wrap">
                {DURATION_OPTIONS.map((option) => (
                  <button
                    key={option.days}
                    onClick={() =>
                      setSelectedDuration((prev) =>
                        prev === option.days ? null : option.days,
                      )
                    }
                    className={`
                      rounded-full px-4 py-1.5
                      text-sm border
                      transition-all duration-150
                      ${
                        selectedDuration === option.days
                          ? "bg-primary text-black border-primary font-semibold"
                          : "bg-surface border-border text-foreground hover:border-primary/50"
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Month picker */}
            <div className="space-y-2">
              <p className="text-secondary text-xs">When are you thinking?</p>
              <div className="flex gap-2 flex-wrap">
                {MONTH_OPTIONS.map((month) => (
                  <button
                    key={month}
                    onClick={() =>
                      setSelectedMonth((prev) =>
                        prev === month ? null : month,
                      )
                    }
                    className={`
                      rounded-full px-3 py-1
                      text-xs border
                      transition-all duration-150
                      ${
                        selectedMonth === month
                          ? "bg-primary text-black border-primary font-semibold"
                          : "bg-surface border-border text-secondary hover:border-primary/50"
                      }
                    `}
                  >
                    {month.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Find my trip button */}
            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFindTrip}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-black font-bold rounded-full py-3 text-sm hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                "Finding your trip..."
              ) : (
                <>
                  Find my {selectedVibe.label} trip
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            <div ref={detailsRef} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip hint */}
      <p className="text-center text-xs text-secondary/50">
        or just type what you have in mind below
      </p>
    </div>
  );
}
