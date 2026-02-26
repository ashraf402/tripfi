"use client";

import { motion } from "framer-motion";
import type { QuickAction } from "@/lib/types/chat";

interface QuickActionChipProps {
  action: QuickAction;
  onSelect: (action: QuickAction) => void;
}

export function QuickActionChip({ action, onSelect }: QuickActionChipProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(action)}
      className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,208,132,0.2)] bg-[rgba(0,208,132,0.08)] px-4 py-2 text-sm font-medium text-primary transition-colors duration-200 hover:bg-brand-glow"
    >
      <span className="text-base">{action.emoji}</span>
      <span>{action.label}</span>
    </motion.button>
  );
}
