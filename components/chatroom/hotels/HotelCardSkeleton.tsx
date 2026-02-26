"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function HotelCardSkeleton() {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-surface-card">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>
        <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
          <Skeleton className="h-3 w-20" />
          <div className="space-y-1">
            <Skeleton className="h-6 w-20 ml-auto" />
            <Skeleton className="h-3 w-16 ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
