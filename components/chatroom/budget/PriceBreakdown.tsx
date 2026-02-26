"use client";

import { motion } from "framer-motion";
import { PriceRow } from "./PriceRow";
import type { PriceItem } from "@/lib/types/chat";

interface PriceBreakdownProps {
  items: PriceItem[];
  currency: string;
}

export function PriceBreakdown({ items, currency }: PriceBreakdownProps) {
  return (
    <div className="space-y-1">
      {items.map((item, index) => (
        <PriceRow
          key={index}
          label={item.label}
          amount={currency === "BCH" ? item.amountBch : item.amountUsd}
          currency={currency === "BCH" ? "BCH" : "$"}
        />
      ))}
    </div>
  );
}
