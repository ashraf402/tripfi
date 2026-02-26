"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { saveTravelStyle } from "@/lib/actions/profile";
import { TRAVEL_STYLES } from "@/data/user";
import { Check, Loader2 } from "lucide-react";

export default function TravelStylePage() {
  const router = useRouter();
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleStyle = (id: string) => {
    setSelectedStyles((prev) =>
      prev.includes(id)
        ? prev.filter((styleId) => styleId !== id)
        : [...prev, id],
    );
  };

  const handleNext = async () => {
    if (selectedStyles.length === 0) return;
    setLoading(true);
    setError("");

    const result = await saveTravelStyle(selectedStyles);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/onboarding/wallet");
  };

  const handleSkip = () => {
    router.push("/onboarding/wallet");
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-heading font-bold text-foreground">
          What kind of trips do you love?
        </h1>
        <p className="text-text-secondary">
          Pick everything that sounds like you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TRAVEL_STYLES.map((style) => {
          const isSelected = selectedStyles.includes(style.id);

          return (
            <motion.div
              key={style.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                onClick={() => toggleStyle(style.id)}
                className={cn(
                  "cursor-pointer p-6 relative transition-all duration-200 border-2 h-full flex flex-col gap-4 rounded-3xl",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-surface hover:border-primary/50",
                )}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-primary rounded-full p-1">
                    <Check className="w-3 h-3 text-black font-bold" />
                  </div>
                )}
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors text-2xl",
                    isSelected
                      ? "bg-primary text-black"
                      : "bg-surface-card text-text-secondary",
                  )}
                >
                  {style.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">
                    {style.label}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {style.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Error */}
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <div className="space-y-4">
        <Button
          className="w-full py-6 text-lg font-bold font-heading rounded-xl shadow-lg shadow-[rgba(0,208,132,0.2)] active:scale-[0.98] transition-all bg-primary text-black hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedStyles.length === 0 || loading}
          onClick={handleNext}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Next Step"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={handleSkip}
          className="w-full text-sm text-text-secondary hover:text-foreground transition-colors font-medium hover:bg-transparent rounded-full"
        >
          Skip for now →
        </Button>
      </div>
    </div>
  );
}
