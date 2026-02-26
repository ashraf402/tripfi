import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getClient } from "@/lib/supabase/client";
import { getClientDb } from "@/lib/db/client";
import type { AuthState, AuthUser } from "./types";
import { isStale } from "./types";
import type { Profile } from "@/lib/types";

const initialState = {
  user: null as AuthUser | null,
  profile: null as Profile | null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  error: null as string | null,
  profileLastFetched: null as number | null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * Initialize auth state by validating the current Supabase session.
       * Called once on app mount by SessionProvider.
       */
      initialize: async () => {
        if (get().isInitialized) {
          set({ isLoading: false });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const supabase = getClient();
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user) {
            set({
              ...initialState,
              isLoading: false,
              isInitialized: true,
            });
            return;
          }

          const authUser: AuthUser = {
            id: user.id,
            email: user.email ?? "",
          };

          set({ user: authUser, isAuthenticated: true });

          // Fetch profile via DB abstraction if stale or missing
          const state = get();
          if (
            !state.profile ||
            isStale({ lastFetched: state.profileLastFetched })
          ) {
            const db = getClientDb();
            const { data: profile } = await db.findOne<Profile>("profiles", {
              filters: [{ column: "id", operator: "eq", value: user.id }],
            });

            set({
              profile,
              profileLastFetched: Date.now(),
            });
          }

          set({ isLoading: false, isInitialized: true });
        } catch (err) {
          set({
            ...initialState,
            isLoading: false,
            isInitialized: true,
            error: "Failed to initialize session",
          });
        }
      },

      /**
       * Refresh profile data from the database.
       * Skips the fetch if data is still fresh (unless force=true).
       */
      refreshProfile: async (force = false) => {
        const state = get();
        if (!state.user) return;

        if (
          !force &&
          state.profile &&
          !isStale({ lastFetched: state.profileLastFetched })
        ) {
          return;
        }

        try {
          const db = getClientDb();
          const { data: profile } = await db.findOne<Profile>("profiles", {
            filters: [{ column: "id", operator: "eq", value: state.user.id }],
          });

          set({
            profile,
            profileLastFetched: Date.now(),
            error: null,
          });
        } catch {
          set({ error: "Failed to refresh profile" });
        }
      },

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setProfile: (profile) =>
        set({
          profile,
          profileLastFetched: profile ? Date.now() : null,
        }),

      setError: (error) => set({ error }),

      clearAuth: () =>
        set({
          ...initialState,
          isLoading: false,
          isInitialized: true,
        }),
    }),
    {
      name: "tripfi-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
        profileLastFetched: state.profileLastFetched,
      }),
    },
  ),
);
