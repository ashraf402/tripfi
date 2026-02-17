"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const viewport = document.querySelector("#scroll-area-viewport");

    if (!viewport) return;

    const toggleVisibility = () => {
      // Use scrollTop from the viewport element, not window
      if (viewport.scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    viewport.addEventListener("scroll", toggleVisibility);

    return () => viewport.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    const viewport = document.querySelector("#scroll-area-viewport");
    viewport?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-24 right-8 z-40 p-3 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 border",
            "bg-white/80 border-black/5 text-black", // Light mode
            "dark:bg-black/80 dark:border-white/10 dark:text-white", // Dark mode
            "hover:bg-[#00D084] hover:text-black hover:border-[#00D084] hover:shadow-[0_0_20px_rgba(0,208,132,0.3)]", // Hover state (Green + Glow)
            "dark:hover:bg-[#00D084] dark:hover:text-black dark:hover:border-[#00D084]",
          )}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
