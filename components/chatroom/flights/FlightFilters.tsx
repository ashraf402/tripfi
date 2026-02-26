"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FlightFiltersProps {
  onClose: () => void;
}

export function FlightFilters({ onClose }: FlightFiltersProps) {
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold">Filters</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Max Price</Label>
          <Slider
            defaultValue={[1500]}
            max={5000}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-text-secondary">
            <span>$0</span>
            <span>$5000+</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="direct-flights">Direct flights only</Label>
          <Switch id="direct-flights" />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="refundable">Fully refundable</Label>
          <Switch id="refundable" />
        </div>
      </div>

      <Button className="w-full bg-primary text-black hover:bg-primary-hover font-bold">
        Apply Filters
      </Button>
    </div>
  );
}
