"use client";

import { motion } from "framer-motion";
import type { VibeOption } from "@/lib/types/vibe";

interface VibeCardProps {
  vibe: VibeOption;
  isSelected: boolean;
  onSelect: (vibe: VibeOption) => void;
}

export function VibeCard({ vibe, isSelected, onSelect }: VibeCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(vibe)}
      className={`
        relative w-full rounded-2xl p-4
        border transition-all duration-200
        text-left cursor-pointer
        bg-linear-to-br ${vibe.gradient}
        ${
          isSelected
            ? "border-primary shadow-[0_0_20px_rgba(0,208,132,0.15)]"
            : "border-border hover:border-primary/50"
        }
      `}
    >
      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3
                     w-5 h-5 rounded-full
                     bg-primary flex items-center
                     justify-center"
        >
          <span className="text-black text-xs font-bold">✓</span>
        </motion.div>
      )}

      {/* Emoji */}
      <div className="text-3xl mb-3">{vibe.emoji}</div>

      {/* Label */}
      <p className="text-foreground font-semibold text-sm leading-tight">
        {vibe.label}
      </p>

      {/* Sublabel */}
      <p className="text-secondary text-xs mt-1">{vibe.sublabel}</p>

      {/* Example destinations — show on hover/select */}
      <div
        className={`
        mt-3 flex flex-wrap gap-1
        transition-opacity duration-200
        ${isSelected ? "opacity-100" : "opacity-0"}
      `}
      >
        {vibe.destinations.map((dest) => (
          <span
            key={dest}
            className="text-[10px] text-primary
                       bg-primary/10 rounded-full
                       px-2 py-0.5"
          >
            {dest}
          </span>
        ))}
      </div>
    </motion.button>
  );
}
