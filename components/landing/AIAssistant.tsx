"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles, X } from "lucide-react";
import { useState } from "react";

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 bg-surface-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 bg-surface border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-semibold text-sm">TripFi Agent</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 text-gray-400 hover:text-white hover:bg-surface-hover transition-colors"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4 h-64 overflow-y-auto space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-surface p-3 rounded-2xl rounded-tl-none border border-border text-sm text-gray-300">
                  Hello! I found a flight to Tokyo for $450 cheaper using BCH.
                  Want to see details?
                </div>
              </div>
            </div>
            <div className="p-3 bg-surface border-t border-border">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Ask me anything..."
                  className="w-full bg-black/20 border-border rounded-full pr-10 text-sm text-white focus-visible:ring-0 focus-visible:border-primary transition-colors"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-primary hover:scale-110 hover:bg-transparent transition-transform"
                  aria-label="Send Message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-primary text-black shadow-[0_0_20px_rgba(0,208,132,0.3)] hover:shadow-[0_0_30px_rgba(0,208,132,0.5)] transition-shadow"
        aria-label="Open AI Assistant"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />

        {/* Notification Dot */}
        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
}
