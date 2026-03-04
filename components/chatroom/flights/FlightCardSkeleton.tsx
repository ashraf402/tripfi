"use client";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function FlightCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="text-right space-y-2">
          <Skeleton className="h-6 w-20 ml-auto" />
          <Skeleton className="h-3 w-16 ml-auto" />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between px-4">
        <Skeleton className="h-8 w-16" />
        <div className="flex-1 px-8 flex flex-col items-center gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-0.5 w-full" />
        </div>
        <Skeleton className="h-8 w-16" />
      </div>
      <Separator className="mt-6" />
      <div className="pt-3 flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}
