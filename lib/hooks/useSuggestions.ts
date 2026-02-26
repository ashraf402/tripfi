"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface UseSuggestionsReturn {
  suggestions: string[];
  isLoading: boolean;
}

export function useSuggestions(): UseSuggestionsReturn {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/suggestions")
      .then(({ data }) => {
        setSuggestions(data.suggestions ?? []);
      })
      .catch(() => {
        // Use static fallback silently
        setSuggestions([
          "Plan a 5-day trip to Dubai next month",
          "Find flights from Lagos to London",
          "Budget trip to Bali for 7 days",
          "Luxury weekend getaway in Paris",
        ]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { suggestions, isLoading };
}
