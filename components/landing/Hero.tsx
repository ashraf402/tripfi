"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AIInput } from "@/components/landing/AIInput";
import { useState, useEffect } from "react";

const personas = ["Nomads", "Families", "Crypto Users", "Everyone"];

export default function Hero() {
  const [personaIndex, setPersonaIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPersona = personas[personaIndex];
    const typeSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting && displayedText === currentPersona) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && displayedText === "") {
        setIsDeleting(false);
        setPersonaIndex((prev) => (prev + 1) % personas.length);
      } else {
        setDisplayedText(
          currentPersona.substring(
            0,
            displayedText.length + (isDeleting ? -1 : 1),
          ),
        );
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, personaIndex]);

  return (
    <section
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600')",
      }}
      id="hero"
      className="relative h-screen min-h-200 w-full flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat bg-black"
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90 z-0" />

      <div className="container relative z-10 px-4 max-w-6xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--primary) opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-(--primary)"></span>
            </span>
            AI-Powered Travel Agent
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tight text-white mb-6 leading-tight">
            Travel Smarter <br />
            <span className="text-(--primary)">
              for {displayedText}
              <span className="animate-pulse">|</span>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            The world's first AI travel planner powered by Bitcoin Cash. Just
            ask, and we'll plan the perfect trip.
          </p>

          <div className="flex flex-col items-center justify-center w-full">
            <AIInput />
            <p className="text-sm text-gray-400 mt-4">
              Try: "Honeymoon in Bali" or "Ski trip to Swiss Alps"
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
      >
        <span className="text-sm uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  );
}
