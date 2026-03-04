import type { Profile, Trip, Booking } from "@/lib/types";

// Cache Metadata
/** How long cached data is considered "fresh" (in milliseconds) */
export const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export interface CacheEntry {
  lastFetched: number | null;
}

/** Returns true if the cache entry is stale or has never been fetched */
export function isStale(entry: CacheEntry): boolean {
  if (!entry.lastFetched) return true;
  return Date.now() - entry.lastFetched > STALE_TIME;
}

// Auth Store
export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthState {
  // Data
  user: AuthUser | null;
  profile: Profile | null;

  // Status
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Cache
  profileLastFetched: number | null;

  // Actions
  initialize: () => Promise<void>;
  refreshProfile: (force?: boolean) => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  setProfile: (profile: Profile | null) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
}

// Trip Store
export interface TripState {
  // Data
  trips: Trip[];
  bookings: Booking[];

  // Status
  tripsLoading: boolean;
  bookingsLoading: boolean;
  tripsError: string | null;
  bookingsError: string | null;

  // Cache
  tripsLastFetched: number | null;
  bookingsLastFetched: number | null;

  // Actions
  fetchTrips: (force?: boolean) => Promise<void>;
  fetchBookings: (tripId?: string, force?: boolean) => Promise<void>;
  addTrip: (trip: Trip) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  clearTrips: () => void;
}
