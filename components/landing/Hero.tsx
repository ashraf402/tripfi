"use client";

import { AIInput } from "@/components/landing/AIInput";
import { useSuggestions } from "@/lib/hooks/useSuggestions";
import { useChat } from "@/lib/hooks/useChat";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const personas = ["Nomads", "Families", "Crypto Users", "Everyone"];

const bgImages = [
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80", // Dark mountain lake (Original)
  "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=1600&q=80", // Dark desert night
  "https://images.unsplash.com/photo-1505832018823-50331d70d237?w=1600&q=80", // Dark mountain water
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80", // Dark plane wing above clouds
  "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1600&q=80", // Dark city street
  "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=1600&q=80", // Italy dark evening
];

export default function Hero() {
  const [personaIndex, setPersonaIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [bgImage, setBgImage] = useState(bgImages[0]);

  const { suggestions, isLoading: loadingSuggestions } = useSuggestions();
  const { sendMessage, isLoading: isStartingChat } = useChat();

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

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

  useEffect(() => {
    // Pick a random background image on mount
    const randomImage = bgImages[Math.floor(Math.random() * bgImages.length)];
    setBgImage(randomImage);
  }, []);

  return (
    <section
      style={{
        backgroundImage: `url('${bgImage}')`,
        transition: "background-image 1s ease-in-out",
      }}
      id="hero"
      className="relative h-screen min-h-200 w-full flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat bg-black"
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/70 z-0" />

      <div className="container relative z-10 px-4 max-w-6xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          {/* Badge */}
          <Badge
            variant="outline"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-sm font-medium text-white mb-8 border"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            AI-Powered Travel Agent
          </Badge>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-heading tracking-tight text-white mb-3 sm:mb-6 leading-tight">
            Travel Smarter <br />
            <span className="text-primary">
              for {displayedText}
              <span className="animate-pulse">|</span>
            </span>
          </h1>

          <p className="md:text-xl text-gray-300 mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            The world's first AI travel planner powered by Bitcoin Cash. Just
            ask, and we'll plan the perfect trip.
          </p>

          <div className="flex flex-col items-center justify-center w-full">
            <AIInput
              onSubmit={sendMessage}
              isLoading={isStartingChat || loadingSuggestions}
              suggestions={suggestions}
            />

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-gray-400">Try:</span>
              {loadingSuggestions ? (
                <div className="flex gap-2">
                  <div className="h-7 w-28 bg-white/10 animate-pulse rounded-full" />
                  <div className="h-7 w-36 bg-white/10 animate-pulse rounded-full" />
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.slice(0, 2).map((suggestion, idx) => (
                  <Button
                    variant="outline"
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-sm px-3 py-1 rounded-full h-auto bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 text-left line-clamp-1 max-w-62.5 border"
                    title={suggestion}
                  >
                    {suggestion}
                  </Button>
                ))
              ) : (
                <Button
                  variant="outline"
                  onClick={() => handleSuggestionClick("Honeymoon in Bali")}
                  className="text-sm px-3 py-1 h-auto rounded-full bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 border"
                >
                  "Honeymoon in Bali"
                </Button>
              )}
            </div>
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
        <div className="w-px h-12 bg-linear-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  );
}
