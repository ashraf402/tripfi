"use client";

import { motion } from "framer-motion";
import { MapPin, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { Destination } from "@/lib/types/chat";

interface DestinationCardProps {
  destination: Destination;
  onClick?: () => void;
}

export function DestinationCard({
  destination,
  onClick,
}: DestinationCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,208,132,0.1)" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative h-64 w-full overflow-hidden rounded-2xl border border-border bg-surface-card text-left transition-all duration-300 hover:border-primary/50"
    >
      <Image
        src={destination.imageUrl || "/placeholder-destination.jpg"}
        alt={destination.name}
        fill
        sizes="(max-width: 640px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full p-5">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary/90">
              <MapPin className="h-3.5 w-3.5" />
              {destination.country}
            </div>
            <h3 className="mt-1 font-heading text-2xl font-bold text-white">
              {destination.name}
            </h3>
          </div>
          <div className="rounded-full bg-white/10 p-2 text-white backdrop-blur-md transition-colors group-hover:bg-primary group-hover:text-black">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5 opacity-0 transition-all duration-300 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
          {destination.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/90 backdrop-blur-md border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}
