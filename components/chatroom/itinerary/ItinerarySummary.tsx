import { Calendar, Users, DollarSign } from "lucide-react";
import type { ItineraryData } from "@/lib/types/chat";

interface ItinerarySummaryProps {
  data: ItineraryData;
}

export function ItinerarySummary({ data }: ItinerarySummaryProps) {
  return (
    <div className="mb-6 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-surface-card p-4">
      <div className="flex flex-col items-center justify-center gap-1 text-center">
        <Calendar className="h-5 w-5 text-primary mb-1" />
        <div className="text-xs text-text-secondary">Duration</div>
        <div className="font-heading font-bold text-foreground">
          {data.totalDays} Days
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-1 text-center">
        <Users className="h-5 w-5 text-primary mb-1" />
        <div className="text-xs text-text-secondary">Travelers</div>
        <div className="font-heading font-bold text-foreground">
          {data.travelers} People
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-1 text-center">
        <DollarSign className="h-5 w-5 text-primary mb-1" />
        <div className="text-xs text-text-secondary">Total Cost</div>
        <div className="font-heading font-bold text-foreground">
          ${data.totalCostUsd.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
