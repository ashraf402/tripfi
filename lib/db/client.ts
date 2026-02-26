import type { DbAdapter } from "./types";
import { createSupabaseAdapter } from "./supabase-adapter";
import { getClient } from "@/lib/supabase/client";

let _clientDb: DbAdapter | null = null;

/**
 * Returns a DbAdapter for client-side use.
 * Uses the singleton browser Supabase client.
 */
export function getClientDb(): DbAdapter {
  if (_clientDb) return _clientDb;

  const provider =
    process.env.NEXT_PUBLIC_DB_PROVIDER ??
    process.env.DB_PROVIDER ??
    "supabase";

  switch (provider) {
    case "supabase": {
      _clientDb = createSupabaseAdapter(getClient());
      return _clientDb;
    }

    // Future: case "prisma": { ... }

    default:
      throw new Error(`Unknown DB_PROVIDER: ${provider}`);
  }
}
