"use client";

import { motion } from "framer-motion";
import { Check, Edit, Save, Share2 } from "lucide-react";
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
            <span className="hidden sm:block">Saved to Trips</span>
          </>
        ) : (
          <>
            <Save className="sm:mr-2 h-4 w-4" />
            <span className="hidden sm:block">Save Itinerary</span>
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="border-border text-text-secondary hover:text-foreground"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
