"use client";

import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface HotelFiltersProps {
  onClose: () => void;
}

export function HotelFilters({ onClose }: HotelFiltersProps) {
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
          <Label>Price Range</Label>
          <Slider
            defaultValue={[300]}
            max={1000}
            step={50}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-text-secondary">
            <span>$0</span>
            <span>$1000+</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="free-cancellation">Free Cancellation</Label>
          <Switch id="free-cancellation" />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="4-stars">4+ Stars</Label>
          <Switch id="4-stars" />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="pool">Pool</Label>
          <Switch id="pool" />
        </div>
      </div>

      <Button className="w-full bg-primary text-black hover:bg-primary-hover font-bold">
        Show Hotels
      </Button>
    </div>
  );
}
