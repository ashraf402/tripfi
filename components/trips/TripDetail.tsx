"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Users,
  Plane,
  Hotel,
  MapPin,
  Receipt,
  Bitcoin,
  ExternalLink,
  Map,
  Plus,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getDestinationImage } from "@/lib/utils/imageHelpers";
import { useMapStore } from "@/lib/store/mapStore";
import type { MapMarker } from "@/lib/types/chat";
import { DayCard } from "@/components/chatroom/itinerary/DayCard";
import { TestnetBadge } from "@/components/shared/TestnetBadge";

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

export function TripDetail({ trip }: { trip: any }) {
  const router = useRouter();
  const mapStore = useMapStore();

  // trip.bookings could be array or object due to Supabase Join
  const booking = Array.isArray(trip.bookings)
    ? trip.bookings[0]
    : trip.bookings;
  const tx = booking?.payment_transactions?.[0];

  const [imageUrl, setImageUrl] = useState<string>("");
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  useEffect(() => {
    if (booking?.destination_city) {
      getDestinationImage(booking.destination_city).then(setImageUrl);
    } else if (trip.title) {
      getDestinationImage(trip.title).then(setImageUrl);
    }
  }, [booking?.destination_city, trip.title]);

  const flightData =
    typeof booking?.flight_data === "string"
      ? JSON.parse(booking.flight_data)
      : booking?.flight_data;

  const hotelData =
    typeof booking?.hotel_data === "string"
      ? JSON.parse(booking.hotel_data)
      : booking?.hotel_data;

  const itineraryData =
    typeof booking?.itinerary_data === "string"
      ? JSON.parse(booking.itinerary_data)
      : booking?.itinerary_data;

  const statusConfig =
    STATUS_CONFIG[trip.status as keyof typeof STATUS_CONFIG] ??
    STATUS_CONFIG.upcoming;

  // Map markers
  const handleOpenMap = () => {
    const markers: MapMarker[] = [];

    // Add Hotel
    if (hotelData?.hotels?.[0]) {
      const h = hotelData.hotels[0];
      if (h.latitude && h.longitude) {
        markers.push({
          id: h.id,
          type: "hotel",
          name: h.name,
          latitude: h.latitude,
          longitude: h.longitude,
          description: `${h.location}, ${h.city}`,
        });
      }
    }

    // Add Activities from Itinerary
    if (itineraryData?.days) {
      itineraryData.days.forEach((day: any) => {
        if (day.items) {
          day.items.forEach((item: any) => {
            if (item.latitude && item.longitude) {
              markers.push({
                id: item.id,
                type: item.type === "food" ? "restaurant" : "activity",
                name: item.title,
                latitude: item.latitude,
                longitude: item.longitude,
                description: item.description,
              });
            }
          });
        }
      });
    }

    let centerLat = markers.length > 0 ? markers[0].latitude : 48.8566;
    let centerLng = markers.length > 0 ? markers[0].longitude : 2.3522;

    mapStore.openMap({
      destination: booking?.destination_city || trip.title,
      centerLat,
      centerLng,
      zoom: 12,
      markers,
    });
  };

  const formattedDeparture = booking?.departure_date
    ? format(new Date(booking.departure_date), "MMM d, yyyy")
    : null;
  const formattedReturn = booking?.return_date
    ? format(new Date(booking.return_date), "MMM d, yyyy")
    : null;
  const numTravelers = booking?.travelers || trip.travelers || 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* BACK BUTTON */}
        <Button
          variant="ghost"
          onClick={() => router.push("/trips")}
          className="gap-2 text-secondary hover:text-foreground pl-0 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          My Trips
        </Button>

        {/* HERO SECTION */}
        <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden mt-4 bg-surface-hover">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={trip.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://source.unsplash.com/800x500/?travel,city";
              }}
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge
                className={`border px-2.5 py-1 text-xs ${statusConfig.class}`}
              >
                {statusConfig.label}
              </Badge>
              <TestnetBadge />
              {tx?.is_testnet && (
                <Badge className="border bg-amber-500/10 text-amber-400 border-amber-500/20 px-2.5 py-1 text-xs">
                  Demo
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-md">
              {trip.title}
            </h1>
            <p className="text-gray-300 mt-2 text-sm md:text-base drop-shadow-sm font-medium">
              {booking?.destination_city}
            </p>
          </div>
        </div>

        {/* QUICK STATS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-1">
            <Calendar className="w-4 h-4 text-secondary mb-1" />
            <span className="text-xs text-secondary font-medium uppercase tracking-wider">
              Departure
            </span>
            <span className="text-foreground font-bold">
              {formattedDeparture || "TBD"}
            </span>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-1">
            <Calendar className="w-4 h-4 text-secondary mb-1" />
            <span className="text-xs text-secondary font-medium uppercase tracking-wider">
              Return
            </span>
            <span className="text-foreground font-bold">
              {formattedReturn || "TBD"}
            </span>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-1">
            <Users className="w-4 h-4 text-secondary mb-1" />
            <span className="text-xs text-secondary font-medium uppercase tracking-wider">
              Travelers
            </span>
            <span className="text-foreground font-bold">
              {numTravelers} traveler{numTravelers !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-1">
            <Receipt className="w-4 h-4 text-secondary mb-1" />
            <span className="text-xs text-secondary font-medium uppercase tracking-wider">
              Total Paid
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-foreground font-bold">
                ${booking?.total_usd?.toFixed(2) || "0.00"}
              </span>
              <span className="text-primary text-xs font-semibold">
                {booking?.total_bch?.toFixed(8) || "0"} BCH
              </span>
            </div>
          </div>
        </div>

        {/* PAYMENT CONFIRMATION CARD */}
        {tx && (
          <div className="bg-surface border border-border rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Bitcoin className="w-24 h-24 text-foreground" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Bitcoin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Payment Confirmed
                </h3>
                {tx.confirmed_at && (
                  <p className="text-sm text-secondary">
                    {format(new Date(tx.confirmed_at), "MMM d, yyyy • h:mm a")}
                  </p>
                )}
              </div>
              {tx.is_testnet && (
                <Badge className="ml-auto border bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs py-0">
                  Testnet Tx
                </Badge>
              )}
            </div>

            <div className="mt-4 p-4 bg-background/50 rounded-xl border border-border flex flex-wrap items-center justify-between gap-4 relative">
              <div>
                <p className="text-xs text-secondary font-medium uppercase tracking-wider mb-1">
                  Amount Paid
                </p>
                <p className="text-xl font-bold text-primary">
                  {tx.amount_bch} BCH
                </p>
                <div className="mt-1 text-[10px] text-secondary">
                  Paid with Bitcoin Cash
                </div>
              </div>
              {tx.payment_url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-full text-xs font-medium"
                  onClick={() => window.open(tx.payment_url, "_blank")}
                >
                  View Tx Explorer <ExternalLink className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* FLIGHT DETAILS CARD */}
          <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-surface-hover border border-border flex items-center justify-center">
                <Plane className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Flight Details
              </h3>
            </div>

            {flightData?.flights?.[0] ? (
              <div className="flex-1">
                {flightData.flights.map((f: any, idx: number) => (
                  <div key={f.id || idx} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-foreground">
                        {f.airline}
                      </span>
                      <span className="text-xs font-medium text-secondary bg-surface-hover px-2 py-1 rounded">
                        {f.flightNumber} • {f.cabin}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3 bg-background/50 p-3 rounded-xl border border-border">
                      <div className="text-center">
                        <p className="text-xl font-bold font-heading">
                          {f.origin}
                        </p>
                        <p className="text-xs text-secondary">
                          {f.departureTime}
                        </p>
                      </div>
                      <div className="flex-1 px-4 flex flex-col items-center">
                        <p className="text-[10px] text-secondary mb-1">
                          {f.duration}
                        </p>
                        <div className="w-full relative flex flex-col items-center justify-center">
                          <div className="w-full h-px bg-border group-hover:bg-border/60 transition-colors" />
                          <Plane className="absolute h-3 w-3 text-secondary rotate-90" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold font-heading">
                          {f.destination}
                        </p>
                        <p className="text-xs text-secondary">
                          {f.arrivalTime}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6 text-secondary text-sm">
                No flight data available.
              </div>
            )}
            {tx?.is_testnet && (
              <p className="text-[10px] text-secondary mt-4 bg-amber-500/5 px-2 py-1.5 rounded text-center border border-amber-500/10">
                This is a demo booking powered by Amadeus test data.
              </p>
            )}
          </div>

          {/* HOTEL DETAILS CARD */}
          <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-surface-hover border border-border flex items-center justify-center">
                <Hotel className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Hotel Details
              </h3>
            </div>

            {hotelData?.hotels?.[0] ? (
              <div className="flex-1">
                {hotelData.hotels.map((h: any, idx: number) => (
                  <div key={h.id || idx} className="flex flex-col h-full">
                    <p className="font-bold text-foreground text-lg mb-1">
                      {h.name}
                    </p>
                    <p className="text-sm text-secondary flex items-start gap-1 mb-4">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      {h.location}, {h.city}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-auto bg-background/50 p-3 rounded-xl border border-border">
                      <div>
                        <p className="text-[10px] text-secondary uppercase font-medium">
                          Check-in
                        </p>
                        <p className="font-bold text-foreground text-sm">
                          {hotelData.searchParams?.checkIn
                            ? format(
                                new Date(hotelData.searchParams.checkIn),
                                "MMM d, yyyy",
                              )
                            : "TBD"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-secondary uppercase font-medium">
                          Check-out
                        </p>
                        <p className="font-bold text-foreground text-sm">
                          {hotelData.searchParams?.checkOut
                            ? format(
                                new Date(hotelData.searchParams.checkOut),
                                "MMM d, yyyy",
                              )
                            : "TBD"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-secondary uppercase font-medium">
                          Nights
                        </p>
                        <p className="font-bold text-foreground">{h.nights}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-secondary uppercase font-medium">
                          Per Night
                        </p>
                        <p className="font-bold text-foreground">
                          ${h.pricePerNightUsd}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6 text-secondary text-sm">
                No hotel data available.
              </div>
            )}
            {tx?.is_testnet && (
              <p className="text-[10px] text-secondary mt-4 bg-amber-500/5 px-2 py-1.5 rounded text-center border border-amber-500/10">
                This is a demo booking powered by Amadeus test data.
              </p>
            )}
          </div>
        </div>

        {/* COST BREAKDOWN CARD */}
        <div className="bg-surface border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Cost Breakdown
          </h3>
          {booking ? (
            <div className="space-y-3 p-4 bg-background/50 rounded-xl border border-border">
              {booking.flight_cost > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary">Flights</span>
                  <span className="font-medium">
                    ${booking.flight_cost.toFixed(2)}
                  </span>
                </div>
              )}
              {booking.hotel_cost > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary">Hotel</span>
                  <span className="font-medium">
                    ${booking.hotel_cost.toFixed(2)}
                  </span>
                </div>
              )}
              {booking.activities_cost > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary">Activities</span>
                  <span className="font-medium">
                    ${booking.activities_cost.toFixed(2)}
                  </span>
                </div>
              )}
              {booking.taxes_and_fees > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary">Taxes & Fees</span>
                  <span className="font-medium">
                    ${booking.taxes_and_fees.toFixed(2)}
                  </span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between items-center font-bold">
                <span>Total (USD)</span>
                <span>${booking.total_usd?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-primary">
                <span>Total (BCH)</span>
                <span>{booking.total_bch?.toFixed(8)}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-secondary">Cost data unavailable.</p>
          )}
        </div>

        {/* DAY BY DAY ITINERARY */}
        {itineraryData?.days && (
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-6">
              Itinerary
            </h3>
            <div className="space-y-4">
              {itineraryData.days.map((day: any) => (
                <div key={day.day}>
                  <DayCard
                    day={day}
                    isExpanded={expandedDay === day.day}
                    onToggle={() =>
                      setExpandedDay(expandedDay === day.day ? null : day.day)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIONS ROW */}
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <Button
            className="flex-1 md:flex-none gap-2 font-bold rounded-xl"
            onClick={handleOpenMap}
          >
            <Map className="w-4 h-4" />
            View on map
          </Button>
          <Button
            variant="outline"
            className="flex-1 md:flex-none gap-2 rounded-xl border-border"
            onClick={() => router.push("/new")}
          >
            <Plus className="w-4 h-4 text-secondary" />
            Plan another trip
          </Button>
          {trip.conversation_id && (
            <Button
              variant="outline"
              className="w-full md:w-auto md:ml-auto gap-2 rounded-xl border-border text-primary hover:text-primary-hover hover:bg-primary/10"
              onClick={() => router.push(`/chat/${trip.conversation_id}`)}
            >
              <MessageCircle className="w-4 h-4" />
              Get AI help
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
