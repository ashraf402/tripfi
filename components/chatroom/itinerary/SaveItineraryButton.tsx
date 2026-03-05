"use client";

import { motion } from "framer-motion";
import { Check, Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SaveItineraryButtonProps {
  isSaved?: boolean;
  onSave: () => void;
}

export function SaveItineraryButton({
  isSaved = false,
  onSave,
}: SaveItineraryButtonProps) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={onSave}
        disabled={isSaved}
        variant={isSaved ? "outline" : "default"}
        className={
          isSaved
            ? "border-primary text-primary hover:bg-primary/10"
            : "bg-primary text-black hover:bg-primary-hover shadow-lg shadow-primary/20"
        }
      >
        {isSaved ? (
          <>
            <Check className="sm:mr-2 h-4 w-4" />
            <span className="hidden sm:block">Saved ✓</span>
          </>
        ) : (
          <>
            <Save className="sm:mr-2 h-4 w-4" />
            <span className="hidden sm:block">Save Itinerary</span>
          </>
        )}
      </Button>
    </div>
  );
}
