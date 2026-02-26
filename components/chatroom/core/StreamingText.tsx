"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface StreamingTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export function StreamingText({
  text,
  speed = 20,
  onComplete,
}: StreamingTextProps) {
  const [displayedCount, setDisplayedCount] = useState(0);

  useEffect(() => {
    if (displayedCount >= text.length) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedCount((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [displayedCount, text.length, speed, onComplete]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-foreground"
    >
      {text.slice(0, displayedCount)}
      {displayedCount < text.length && (
        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary" />
      )}
    </motion.span>
  );
}
