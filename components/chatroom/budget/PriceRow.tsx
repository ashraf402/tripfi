"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceRowProps {
  label: string;
  amount: number;
  currency: string;
  isTotal?: boolean;
}

export function PriceRow({ label, amount, currency, isTotal }: PriceRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-2 text-sm",
        isTotal && "border-t border-border pt-4 mt-2 font-bold text-lg",
      )}
    >
      <span className={cn("text-text-secondary", isTotal && "text-foreground")}>
        {label}
      </span>
      <span className="text-foreground font-heading">
        {currency} {amount.toLocaleString()}
      </span>
    </div>
  );
}
