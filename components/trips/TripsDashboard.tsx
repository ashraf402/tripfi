"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Plus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TripCard } from "@/components/trips/TripCard";
import { TestnetBadge } from "@/components/shared/TestnetBadge";
import { AppHeader } from "@/components/layout/AppHeader";

interface TripsDashboardProps {
  trips: any[];
  confirmedId?: string;
}

export function TripsDashboard({ trips, confirmedId }: TripsDashboardProps) {
  const router = useRouter();
  const [showBanner, setShowBanner] = useState(!!confirmedId);

  useEffect(() => {
    if (!confirmedId) return;
    const timer = setTimeout(() => setShowBanner(false), 5000);
    return () => clearTimeout(timer);
  }, [confirmedId]);

  const active = trips.filter((t) => t.status === "active");
  const upcoming = trips.filter((t) => t.status === "upcoming");
  const completed = trips.filter((t) => t.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="My Trips"
        onOpenSidebar={() =>
          window.dispatchEvent(new CustomEvent("toggleMobileSidebar"))
        }
        rightContent={
          <Button
            onClick={() => router.push("/chat")}
            className="gap-2 rounded-full font-bold text-black"
          >
            <Plus className="w-4 h-4 hidden sm:block" />
            New trip
          </Button>
        }
      />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Success banner */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-2xl px-4 py-3"
            >
              <CheckCircle className="w-5 h-5 text-primary shrink-0" />
              <p className="text-foreground text-sm font-medium">
                Your trip has been booked and paid with BCH.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {trips.length === 0 && (
          <div className="text-center py-24 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
              <Plane className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-foreground text-xl font-bold">No trips yet</h2>
            <p className="text-secondary text-sm">
              Plan your first trip with AI and pay with BCH
            </p>
            <Button
              onClick={() => router.push("/chat")}
              className="rounded-full mt-4 font-bold text-black"
            >
              Start planning
            </Button>
          </div>
        )}

        {/* Active trips */}
        {active.length > 0 && (
          <TripGroup label="Currently Traveling" trips={active} />
        )}

        {/* Upcoming trips */}
        {upcoming.length > 0 && <TripGroup label="Upcoming" trips={upcoming} />}

        {/* Completed trips */}
        {completed.length > 0 && (
          <TripGroup label="Past Trips" trips={completed} />
        )}
      </div>
    </div>
  );
}

function TripGroup({ label, trips }: { label: string; trips: any[] }) {
  return (
    <div className="space-y-3">
      <p className="text-secondary text-xs font-semibold uppercase tracking-wider">
        {label}
      </p>
      <div className="space-y-3">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
}
