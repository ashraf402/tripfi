"use client";

import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CurrencyConverterProps {
  currentCurrency: string;
  onToggle: () => void;
}

export function CurrencyConverter({
  currentCurrency,
  onToggle,
}: CurrencyConverterProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="h-8 gap-1.5 text-xs font-medium text-primary hover:bg-primary/10 hover:text-primary"
    >
      <ArrowRightLeft className="h-3.5 w-3.5" />
      Convert to {currentCurrency === "USD" ? "BCH" : "USD"}
    </Button>
  );
}
