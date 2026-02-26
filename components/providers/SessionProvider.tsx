"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useTripStore } from "@/lib/stores/trip-store";
import { getClient } from "@/lib/supabase/client";

/**
 * SessionProvider
 *
 * Wraps the application tree and handles:
 * 1. Initializing auth state on mount (validates Supabase session)
 * 2. Listening to Supabase onAuthStateChange events
 * 3. Syncing Zustand with real-time auth state changes
 *
 * Place inside root layout AFTER ThemeProvider.
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setUser = useAuthStore((s) => s.setUser);
  const clearTrips = useTripStore((s) => s.clearTrips);
  const listenerAttached = useRef(false);

  useEffect(() => {
    // 1. Initialize auth state (validates session, fetches profile)
    initialize();

    // 2. Listen for auth state changes (sign-in, sign-out, token refresh)
    if (listenerAttached.current) return;
    listenerAttached.current = true;

    const supabase = getClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case "SIGNED_IN":
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email ?? "",
            });
          }
          break;

        case "SIGNED_OUT":
          clearAuth();
          clearTrips();
          break;

        case "TOKEN_REFRESHED":
          // Session refreshed — user data is still valid
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email ?? "",
            });
          }
          break;

        case "USER_UPDATED":
          // User metadata changed — force profile refresh
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email ?? "",
            });
            useAuthStore.getState().refreshProfile(true);
          }
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialize, clearAuth, setUser, clearTrips]);

  return <>{children}</>;
}
