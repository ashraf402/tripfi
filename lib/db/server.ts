import type { DbAdapter } from "./types";
import { createSupabaseAdapter } from "./supabase-adapter";
import { createClient } from "@/lib/supabase/server";

/**
 * Returns a DbAdapter for server-side use.
 * Must be called inside an async server context (Server Action, Route Handler).
 */
export async function getServerDb(): Promise<DbAdapter> {
  const provider = process.env.DB_PROVIDER ?? "supabase";

  switch (provider) {
    case "supabase": {
      const client = await createClient();
      return createSupabaseAdapter(client);
    }

    // Future: case "prisma": { ... }

    default:
      throw new Error(`Unknown DB_PROVIDER: ${provider}`);
  }
}
