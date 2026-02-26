"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import Image from "next/image";
import { getHotelImage } from "@/lib/utils/imageHelpers";
import type { Hotel } from "@/lib/types/chat";

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  const [imageUrl, setImageUrl] = useState<string>(
    hotel.imageUrl ??
      `https://source.unsplash.com/800x500/?hotel,${encodeURIComponent(hotel.city ?? "luxury")}`,
  );
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (hotel.imageUrl) {
      setImageLoaded(true);
      return;
    }
    getHotelImage(hotel.name, hotel.city ?? "").then((url) => {
      setImageUrl(url);
      setImageLoaded(true);
    });
  }, [hotel.name, hotel.city, hotel.imageUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,208,132,0.1)" }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface-card transition-all duration-300 hover:border-primary/30 w-full"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-surface-hover">
        <Image
          src={imageUrl}
          alt={hotel.name}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-70"}`}
          onError={(e) => {
            e.currentTarget.src = "https://source.unsplash.com/800x500/?hotel";
          }}
        />
        <div className="absolute top-3 right-3 rounded-full bg-black/60 px-2 py-1 text-xs font-bold text-white backdrop-blur-md flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          {hotel.stars ?? 3}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading text-lg font-bold text-foreground line-clamp-1">
          {hotel.name}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
          <MapPin className="h-3 w-3" />
          <span className="truncate">
            {hotel.location}, {hotel.city}
          </span>
        </div>

        {/* Amenities Pills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {hotel.amenities.slice(0, 3).map((amenity, i) => (
            <span
              key={i}
              className="rounded-full bg-surface px-2 py-0.5 text-[10px] text-text-secondary border border-border"
            >
              {amenity}
            </span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] text-text-secondary border border-border">
              +{hotel.amenities.length - 3}
            </span>
          )}
        </div>

        {/* Price Footer */}
        <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
          <div className="text-xs text-text-secondary">
            Total for {hotel.nights} night{hotel.nights > 1 ? "s" : ""}
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-foreground font-heading">
              ${hotel.totalPriceUsd}
            </div>
            <div className="text-xs text-primary font-medium">
              {hotel.totalPriceBch} BCH
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
