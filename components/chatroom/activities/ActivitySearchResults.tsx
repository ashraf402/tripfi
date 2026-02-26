"use client";

import { motion } from "framer-motion";
import { ActivityCard } from "./ActivityCard";
import { ActivityCardSkeleton } from "./ActivityCardSkeleton";
import type { ActivityData } from "@/lib/types/chat";

interface ActivitySearchResultsProps {
  data: ActivityData;
  isLoading?: boolean;
}

export function ActivitySearchResults({
  data,
  isLoading,
}: ActivitySearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <ActivityCardSkeleton />
        <ActivityCardSkeleton />
        <ActivityCardSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-medium text-text-secondary">
          Things to do in{" "}
          <span className="text-foreground font-bold">{data.destination}</span>
        </h3>
        <span className="text-xs text-text-secondary">
          {data.activities.length} results
        </span>
      </div>

      <div className="space-y-3">
        {data.activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ActivityCard activity={activity} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
