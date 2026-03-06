"use server";

import { createClient } from "@/lib/supabase/server";
import { getServerDb } from "@/lib/db/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Profile } from "@/lib/types";

// SAVE TRAVEL STYLE (Onboarding Step 1)
export async function saveTravelStyle(travelStyle: string[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const db = await getServerDb();
  const { error } = await db.update<Profile>(
    "profiles",
    { travel_style: travelStyle } as Partial<Profile>,
    { filters: [{ column: "id", operator: "eq", value: user.id }] },
  );

  if (error) return { error };
  return { success: true };
}

// SAVE BCH WALLET + COMPLETE ONBOARDING (Onboarding Step 2)
export async function completeOnboarding(bchWalletAddress?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const db = await getServerDb();
  const { error } = await db.update<Profile>(
    "profiles",
    {
      bch_wallet_address: bchWalletAddress || null,
      onboarding_completed: true,
    } as Partial<Profile>,
    { filters: [{ column: "id", operator: "eq", value: user.id }] },
  );

  if (error) return { error };

  revalidatePath("/", "layout");
  redirect("/chat");
}

// GET CURRENT USER PROFILE
export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const db = await getServerDb();
  const { data: profile } = await db.findOne<Profile>("profiles", {
    filters: [{ column: "id", operator: "eq", value: user.id }],
  });

  return profile;
}

// UPDATE PROFILE
export async function updateProfile(updates: {
  name?: string;
  avatar_url?: string;
  bch_wallet_address?: string;
  travel_style?: string[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const db = await getServerDb();
  const { error } = await db.update<Profile>(
    "profiles",
    updates as Partial<Profile>,
    { filters: [{ column: "id", operator: "eq", value: user.id }] },
  );

  if (error) return { error };

  revalidatePath("/chat");
  return { success: true };
}
