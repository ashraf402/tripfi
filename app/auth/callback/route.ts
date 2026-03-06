import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/chat";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[Auth Callback] exchangeCodeForSession error:", error);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // Determine provider from multiple metadata sources
  const meta = user.user_metadata ?? {};
  const isGoogleProvider =
    meta.iss?.includes("google") ||
    meta.provider === "google" ||
    user.app_metadata?.provider === "google";

  // Upsert profile — creates row for new users, updates for returning ones.
  // name uses coalesce so an existing value is never overwritten with null.
  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      name: meta.full_name ?? meta.name ?? null,
      avatar_url: meta.avatar_url ?? meta.picture ?? null,
      provider: isGoogleProvider ? "google" : "email",
      google_id: meta.sub ?? null,
    },
    {
      onConflict: "id",
      ignoreDuplicates: false,
    },
  );

  // Account linking: if this is a Google sign-in on an EXISTING email account
  // (google_id was previously null), patch only the fields that are missing so
  // the original name or avatar_url set during email signup is preserved.
  if (isGoogleProvider) {
    await supabase
      .from("profiles")
      .update({
        google_id: meta.sub ?? null,
        avatar_url: meta.picture ?? meta.avatar_url ?? null,
        provider: "google",
      })
      .eq("id", user.id)
      .is("google_id", null);
  }

  // Decide where to send the user based on onboarding status
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  const onboardingDone = profile?.onboarding_completed ?? false;

  if (!onboardingDone) {
    return NextResponse.redirect(`${origin}/onboarding/style`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
