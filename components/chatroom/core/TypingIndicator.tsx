"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";

const thinkingPhrases = [
  "Analyzing your request...",
  "Gathering context...",
  "Searching knowledge base...",
  "Crafting a response...",
  "Synthesizing information...",
  "Connecting the dots...",
  "Generating insights...",
  "Organizing thoughts...",
];

export function TypingIndicator() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    // Change phrase every 2.5 seconds
    const interval = setInterval(() => {
      setPhraseIndex((prev) => {
        let next = Math.floor(Math.random() * thinkingPhrases.length);
        // Ensure we don't pick the same phrase twice in a row
        if (next === prev) {
          next = (next + 1) % thinkingPhrases.length;
        }
        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-center gap-3 py-3"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 mt-1">
        <Bot className="h-4 w-4 text-primary" />
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-2 w-2 rounded-full bg-text-secondary"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative h-5 w-48 overflow-hidden flex items-center">
          <AnimatePresence>
            <motion.span
              key={phraseIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute left-0 text-sm text-text-secondary whitespace-nowrap"
            >
              {thinkingPhrases[phraseIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
