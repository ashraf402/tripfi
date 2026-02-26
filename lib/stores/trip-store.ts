import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getClient } from "@/lib/supabase/client";
import { getClientDb } from "@/lib/db/client";
import type { TripState } from "./types";
import { isStale } from "./types";
import type { Trip, Booking } from "@/lib/types";

const initialState = {
  trips: [] as Trip[],
  bookings: [] as Booking[],
  tripsLoading: false,
  bookingsLoading: false,
  tripsError: null as string | null,
  bookingsError: null as string | null,
  tripsLastFetched: null as number | null,
  bookingsLastFetched: null as number | null,
};

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * Fetch trips for the authenticated user.
       * Skips the fetch if data is still fresh (unless force=true).
       */
      fetchTrips: async (force = false) => {
        const state = get();

        if (
          !force &&
          state.trips.length > 0 &&
          !isStale({ lastFetched: state.tripsLastFetched })
        ) {
          return;
        }

        set({ tripsLoading: true, tripsError: null });

        try {
          // Need user ID from auth provider to filter trips
          const supabase = getClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            set({ tripsLoading: false, tripsError: "Not authenticated" });
            return;
          }

          const db = getClientDb();
          const { data, error } = await db.findMany<Trip>("trips", {
            filters: [{ column: "user_id", operator: "eq", value: user.id }],
            orderBy: [{ column: "created_at", ascending: false }],
          });

          if (error) {
            set({ tripsLoading: false, tripsError: error });
            return;
          }

          set({
            trips: data ?? [],
            tripsLoading: false,
            tripsLastFetched: Date.now(),
          });
        } catch {
          set({ tripsLoading: false, tripsError: "Failed to fetch trips" });
        }
      },

      /**
       * Fetch bookings, optionally filtered by trip ID.
       * Skips the fetch if data is still fresh (unless force=true).
       */
      fetchBookings: async (tripId, force = false) => {
        const state = get();

        if (
          !force &&
          state.bookings.length > 0 &&
          !isStale({ lastFetched: state.bookingsLastFetched })
        ) {
          return;
        }

        set({ bookingsLoading: true, bookingsError: null });

        try {
          const db = getClientDb();
          const filters = tripId
            ? [
                {
                  column: "trip_id" as const,
                  operator: "eq" as const,
                  value: tripId,
                },
              ]
            : undefined;

          const { data, error } = await db.findMany<Booking>("bookings", {
            filters,
            orderBy: [{ column: "created_at", ascending: false }],
          });

          if (error) {
            set({ bookingsLoading: false, bookingsError: error });
            return;
          }

          set({
            bookings: data ?? [],
            bookingsLoading: false,
            bookingsLastFetched: Date.now(),
          });
        } catch {
          set({
            bookingsLoading: false,
            bookingsError: "Failed to fetch bookings",
          });
        }
      },

      /** Optimistic add: insert into local state immediately */
      addTrip: (trip) => set((state) => ({ trips: [trip, ...state.trips] })),

      /** Optimistic update: patch in local state immediately */
      updateTrip: (id, updates) =>
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id === id ? { ...t, ...updates } : t,
          ),
        })),

      /** Optimistic delete: remove from local state immediately */
      deleteTrip: (id) =>
        set((state) => ({
          trips: state.trips.filter((t) => t.id !== id),
        })),

      /** Clear all trip data. Called on logout. */
      clearTrips: () => set({ ...initialState }),
    }),
    {
      name: "tripfi-trips",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        trips: state.trips,
        bookings: state.bookings,
        tripsLastFetched: state.tripsLastFetched,
        bookingsLastFetched: state.bookingsLastFetched,
      }),
    },
  ),
);
