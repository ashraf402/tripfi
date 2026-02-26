"use client";

import { motion } from "framer-motion";
import { DestinationCard } from "./DestinationCard";
import type { DestinationData } from "@/lib/types/chat";

interface DestinationGridProps {
  data: DestinationData;
}

export function DestinationGrid({ data }: DestinationGridProps) {
  return (
    <div className="w-full space-y-4">
      <h3 className="px-1 text-sm font-medium text-text-secondary">
        Top destinations for you
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data.destinations.map((destination, index) => (
          <motion.div key={destination.id} transition={{ delay: index * 0.1 }}>
            <DestinationCard destination={destination} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
