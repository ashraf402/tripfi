"use client";

import { useState, useEffect } from "react";
import { getBchRate } from "@/lib/services/bchRate";

export function useBCHRate() {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchRate() {
      try {
        const r = await getBchRate();
        if (mounted) {
          setRate(r);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          if (!rate) setRate(450.0);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchRate();

    // Refresh every minute
    const interval = setInterval(fetchRate, 60000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [rate]);

  return { rate, loading, error };
}
