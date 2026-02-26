"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Tag } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getActivityImage } from "@/lib/utils/imageHelpers";
import type { Activity } from "@/lib/types/chat";

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const [imageUrl, setImageUrl] = useState<string>(
    `https://source.unsplash.com/800x500/?${encodeURIComponent(activity.category)},travel`,
  );
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    getActivityImage(
      activity.name,
      activity.category,
      activity.location ?? "",
    ).then((url) => {
      setImageUrl(url);
      setImageLoaded(true);
    });
  }, [activity.name, activity.category, activity.location]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01 }}
      className="group flex w-full overflow-hidden rounded-2xl border border-border bg-surface-card transition-all hover:border-primary/30"
    >
      {/* Image Section */}
      <div className="relative h-auto w-32 shrink-0 overflow-hidden bg-surface-hover sm:w-40">
        <Image
          src={imageUrl}
          alt={activity.name}
          fill
          sizes="(max-width: 640px) 128px, 160px"
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-70"}`}
          onError={(e) => {
            e.currentTarget.src = "https://source.unsplash.com/800x500/?travel";
          }}
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-primary tracking-wider">
              <Tag className="h-3 w-3" />
              {activity.category}
            </span>
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground leading-tight">
            {activity.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
            {activity.description}
          </p>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div className="space-y-1">
            {activity.openingHours && (
              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                <Clock className="h-3.5 w-3.5" />
                {activity.openingHours}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <MapPin className="h-3.5 w-3.5" />
              {activity.location}
            </div>
          </div>

          {activity.priceUsd !== undefined && (
            <div className="text-right">
              <div className="font-heading font-bold text-foreground">
                ${activity.priceUsd}
              </div>
              {activity.priceBch && (
                <div className="text-[10px] text-primary font-medium">
                  {activity.priceBch} BCH
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
