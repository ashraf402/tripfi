import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/lib/types/database";
import { SupabaseClient } from "@supabase/supabase-js";

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  ) as SupabaseClient<Database>;

/** Singleton browser client for use in stores and client components */
let _client: ReturnType<typeof createClient> | null = null;
export const getClient = () => {
  if (!_client) _client = createClient();
  return _client;
};
