"use client";

import { MapPin, Plane, Hotel, Bitcoin, Compass } from "lucide-react";
import { motion } from "framer-motion";
import type { Database } from "@/lib/types/database";
import type { ItineraryData } from "@/lib/types/chat";

type Trip = Database["public"]["Tables"]["trips"]["Row"];

interface DashboardProps {
  trip: Trip;
  booking: any;
  itineraryData: ItineraryData | null;
}

export default function TripDashboardClient({
  trip,
  booking,
  itineraryData,
}: DashboardProps) {
  // If payment is still pending (in case status hasn't synced fully or user viewed it before confirm fired)
  const isPaymentPending = booking?.status === "payment_pending";

  return (
    <div className="space-y-8">
      {/* Payment Status Banner */}
      {isPaymentPending && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-4">
          <Bitcoin className="w-6 h-6 text-amber-500 shrink-0" />
          <div>
            <h3 className="text-amber-500 font-bold mb-1">Payment Pending</h3>
            <p className="text-sm text-amber-500/80">
              We are waiting for your BCH transaction to confirm on the
              blockchain. Testnet blocks take time.
            </p>
          </div>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-surface-card border border-border rounded-xl p-6">
            <h3 className="font-bold text-foreground mb-4">Trip Details</h3>
            <div className="space-y-4">
              <DetailRow
                icon={<MapPin className="w-4 h-4" />}
                label="Destination"
                value={trip.destination_city || "TBD"}
              />
              <DetailRow
                icon={<Plane className="w-4 h-4" />}
                label="Flights"
                value={booking?.flight_data ? "Booked" : "Not included"}
              />
              <DetailRow
                icon={<Hotel className="w-4 h-4" />}
                label="Hotels"
                value={booking?.hotel_data ? "Booked" : "TBD"}
              />
            </div>

            <div className="border-t border-border mt-6 pt-4">
              <p className="text-sm text-secondary mb-1">Total Paid</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">
                  {booking?.total_bch?.toFixed(4)} BCH
                </span>
                <span className="text-sm text-secondary">
                  (${booking?.total_usd?.toFixed(2)})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Itinerary */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-foreground">Your Itinerary</h2>

          {itineraryData?.days ? (
            <div className="space-y-4">
              {itineraryData.days.map((day: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-surface-card border border-border rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Compass className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg mb-1">
                        Day {day.day}: {day.theme}
                      </h4>
                      <div className="space-y-3 mt-3">
                        {day.activities.map((act: any, j: number) => (
                          <div key={j} className="text-sm">
                            <span className="text-foreground font-medium">
                              {act.time}
                            </span>
                            <span className="text-secondary mx-2">•</span>
                            <span className="text-secondary">
                              {act.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-surface border border-dashed border-border rounded-xl p-8 text-center">
              <p className="text-secondary">No itinerary details available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-secondary">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
