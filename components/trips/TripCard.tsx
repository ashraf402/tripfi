"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar, Users, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDestinationImage } from "@/lib/utils/imageHelpers";

interface TripCardProps {
  trip: any;
}

const STATUS_CONFIG = {
  upcoming: {
    label: "Upcoming",
    class: "bg-primary/10 text-primary border-primary/20",
  },
  active: {
    label: "Traveling now",
    class: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  completed: {
    label: "Completed",
    class: "bg-surface border-border text-secondary",
  },
  cancelled: {
    label: "Cancelled",
    class: "bg-red-500/10 text-red-400 border-red-500/20",
  },
} as const;

export function TripCard({ trip }: TripCardProps) {
  const router = useRouter();
  // trips usually have a one to one or a list, but according to the query we select bookings
  // `trip.bookings` is fetched as a list due to fk but normally booking is 1:1, handling both obj and array:
  const booking = Array.isArray(trip.bookings)
    ? trip.bookings[0]
    : trip.bookings;
  const tx = booking?.payment_transactions?.[0];

  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (booking?.destination_city) {
      getDestinationImage(booking.destination_city).then(setImageUrl);
    } else if (trip.title) {
      // Fallback if destination city isn't present
      getDestinationImage(trip.title).then(setImageUrl);
    }
  }, [booking?.destination_city, trip.title]);

  const statusConfig =
    STATUS_CONFIG[trip.status as keyof typeof STATUS_CONFIG] ??
    STATUS_CONFIG.upcoming;

  const formattedDeparture = booking?.departure_date
    ? format(new Date(booking.departure_date), "MMM d, yyyy")
    : null;

  const formattedReturn = booking?.return_date
    ? format(new Date(booking.return_date), "MMM d, yyyy")
    : null;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-surface border border-border rounded-2xl overflow-hidden cursor-pointer group"
      onClick={() => router.push(`/trips/${trip.id}`)}
    >
      <div className="flex flex-col sm:flex-row h-full">
        {/* Hero image */}
        {imageUrl && (
          <div className="relative sm:w-48 h-36 sm:h-auto shrink-0 overflow-hidden">
            <img
              src={imageUrl}
              alt={booking?.destination_city || trip.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.src =
                  "https://source.unsplash.com/800x400/?travel,city";
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/50 to-transparent sm:hidden" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between gap-3">
          {/* Top row */}
          <div className="flex items-start justify-between gap-2 border-b border-border/50 pb-2">
            <div>
              <h3 className="text-foreground font-bold text-base leading-tight">
                {trip.title}
              </h3>
              <p className="text-secondary text-sm mt-0.5">
                {booking?.destination_city}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <Badge
                className={`text-[10px] border px-2 py-0.5 whitespace-nowrap ${statusConfig.class}`}
              >
                {statusConfig.label}
              </Badge>
              {tx?.is_testnet && (
                <Badge className="text-[10px] border bg-amber-500/10 text-amber-400 border-amber-500/20 px-2 py-0.5">
                  Demo
                </Badge>
              )}
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-4 flex-wrap pt-1">
            {formattedDeparture && (
              <div className="flex items-center gap-1.5 bg-surface-hover rounded-full px-2 py-1 border border-border">
                <Calendar className="w-3.5 h-3.5 text-secondary" />
                <span className="text-secondary text-xs font-medium">
                  {formattedDeparture}
                  {formattedReturn ? ` → ${formattedReturn}` : ""}
                </span>
              </div>
            )}
            {booking?.travelers > 0 && (
              <div className="flex items-center gap-1.5 bg-surface-hover rounded-full px-2 py-1 border border-border">
                <Users className="w-3.5 h-3.5 text-secondary" />
                <span className="text-secondary text-xs font-medium">
                  {booking.travelers} traveler
                  {booking.travelers !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-foreground font-bold text-sm">
                ${booking?.total_usd?.toFixed(2) ?? "0.00"}
              </p>
              <p className="text-primary text-xs font-medium">
                {booking?.total_bch?.toFixed(8) ?? "0"} BCH
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-primary hover:text-primary hover:bg-primary/10 rounded-full font-medium"
            >
              View trip
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
