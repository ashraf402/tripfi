"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export function AIInput() {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", prompt);
    // TODO: Implement search logic
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-(--primary) to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      <div className="relative flex items-center bg-black border border-(--border) rounded-2xl p-2 shadow-2xl">
        <div className="pl-4 text-(--primary)">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Plan a 2-week trip to Japan under $3k..."
          className="w-full bg-transparent text-white placeholder-gray-500 px-4 py-3 focus:outline-none text-lg"
        />
        <button
          type="submit"
          className="bg-(--primary) hover:bg-(--primary-hover) text-black p-3 rounded-xl transition-all hover:scale-105 active:scale-95"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
