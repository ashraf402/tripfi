"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ActivityCardSkeleton() {
  return (
    <div className="flex h-32 w-full overflow-hidden rounded-2xl border border-border bg-surface-card">
      <Skeleton className="h-full w-32 shrink-0" />
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
