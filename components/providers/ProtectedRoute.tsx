"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Where to redirect if not authenticated (default: /login) */
  redirectTo?: string;
}

/**
 * ProtectedRoute
 *
 * Client-side route guard that checks Zustand auth state.
 * Shows a loading spinner while the session is being validated,
 * then either renders children or redirects to login.
 *
 * NOTE: This is a UX enhancement — the primary route protection
 * is handled server-side by middleware.ts.
 */
export function ProtectedRoute({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    if (isInitialized && !isLoading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isInitialized, isLoading, isAuthenticated, router, redirectTo]);

  // Still checking session
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-text-secondary font-medium">
            Verifying session…
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated — redirect is queued, show nothing
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
