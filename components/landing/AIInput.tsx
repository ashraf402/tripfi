"use client";

import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

interface AIInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  suggestions?: string[];
}

export function AIInput({
  onSubmit,
  isLoading,
  suggestions = [],
}: AIInputProps) {
  const [prompt, setPrompt] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    if (!suggestions || suggestions.length === 0) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % suggestions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [suggestions]);

  const currentPlaceholder =
    suggestions.length > 0
      ? suggestions[placeholderIndex]
      : "Plan a 2-week trip to Japan under $3k...";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (prompt.trim()) {
      onSubmit(prompt.trim());
    } else {
      onSubmit(currentPlaceholder);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl relative group">
      <div className="absolute -inset-0.5 bg-linear-to-r from-[#00D084] to-[#00B36E] rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300 group-hover:duration-200 animate-tilt"></div>
      <div className="relative flex items-center bg-black border border-[#2a2a2a] rounded-2xl p-2 shadow-2xl">
        <div className="pl-4 text-primary">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={currentPlaceholder}
          disabled={isLoading}
          className="w-full bg-transparent text-white placeholder-gray-500 px-4 py-3 focus:outline-none text-lg disabled:opacity-50 transition-all duration-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary hover:bg-primary-hover text-black p-3 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:opacity-70 flex items-center justify-center min-w-11 min-h-11"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ArrowRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
}
