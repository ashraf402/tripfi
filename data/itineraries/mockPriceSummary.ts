import type { PriceData } from "@/lib/types/chat";

export const MOCK_PRICE_DATA: PriceData = {
  bchRate: 500,
  currency: "USD",
  totalUsd: 1840,
  totalBch: 3.68,
  items: [
    {
      label: "Flights (Return)",
      amountUsd: 840,
      amountBch: 1.68,
      type: "flight",
    },
    {
      label: "Hotel (5 nights)",
      amountUsd: 445,
      amountBch: 0.89,
      type: "hotel",
    },
    {
      label: "Activities",
      amountUsd: 430,
      amountBch: 0.86,
      type: "activity",
    },
    {
      label: "Food & Dining (est.)",
      amountUsd: 125,
      amountBch: 0.25,
      type: "other",
    },
  ],
};
