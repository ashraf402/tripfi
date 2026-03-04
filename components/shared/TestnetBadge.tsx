"use client";

import { FlaskConical } from "lucide-react";
import { IS_TESTNET } from "@/lib/services/payment/bchPayment";

export function TestnetBadge() {
  if (!IS_TESTNET) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 text-[10px] font-medium px-2 py-0.5 select-none shrink-0">
      <FlaskConical className="w-2.5 h-2.5" />
      Testnet
    </span>
  );
}
