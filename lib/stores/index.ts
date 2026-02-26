// ─── Store Exports ─────────────────────────────────────────
export { useAuthStore } from "./auth-store";
export { useTripStore } from "./trip-store";
export { isStale, STALE_TIME } from "./types";
export type { AuthState, AuthUser, TripState } from "./types";

// ─── Selector Hooks ────────────────────────────────────────
// Granular selectors prevent unnecessary re-renders.
// Components subscribe only to the specific slice they need.

import { useAuthStore } from "./auth-store";
import { useTripStore } from "./trip-store";

/** Current authenticated user (id + email) */
export const useUser = () => useAuthStore((s) => s.user);

/** Full profile row from the profiles table */
export const useProfile = () => useAuthStore((s) => s.profile);

/** Whether the user is authenticated */
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);

/** Whether the auth store is still loading */
export const useAuthLoading = () => useAuthStore((s) => s.isLoading);

/** Whether the auth store has finished its first initialization */
export const useAuthInitialized = () => useAuthStore((s) => s.isInitialized);

/** All trips for the current user */
export const useTrips = () => useTripStore((s) => s.trips);

/** All bookings (optionally filtered by fetchBookings) */
export const useBookings = () => useTripStore((s) => s.bookings);

/** Whether trips are currently being fetched */
export const useTripsLoading = () => useTripStore((s) => s.tripsLoading);
