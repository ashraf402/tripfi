"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";
import { PriceBreakdown } from "./PriceBreakdown";
import { PriceRow } from "./PriceRow";
import { CurrencyConverter } from "./CurrencyConverter";
import type { PriceData } from "@/lib/types/chat";

interface PriceSummaryCardProps {
  data: PriceData;
}

export function PriceSummaryCard({ data }: PriceSummaryCardProps) {
  const [currency, setCurrency] = useState<"USD" | "BCH">("USD");

  const total = currency === "USD" ? data.totalUsd : data.totalBch;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-surface-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <DollarSign className="h-4 w-4" />
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground">
            Trip Budget
          </h3>
        </div>
        <CurrencyConverter
          currentCurrency={currency}
          onToggle={() =>
            setCurrency((prev) => (prev === "USD" ? "BCH" : "USD"))
          }
        />
      </div>

      <PriceBreakdown items={data.items} currency={currency} />

      <PriceRow
        label="Total Estimate"
        amount={total}
        currency={currency === "BCH" ? "BCH" : "$"}
        isTotal
      />

      <div className="mt-4 text-center text-[10px] text-text-secondary">
        *Rates are estimated. 1 BCH = ${data.bchRate} USD
      </div>
    </div>
  );
}
