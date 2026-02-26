import { createClient } from "@/lib/supabase/server";
import { getServerDb } from "@/lib/db/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/new";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check onboarding status via DB abstraction
      const db = await getServerDb();
      const { data: profile } = await db.findOne<{
        onboarding_completed: boolean;
      }>("profiles", {
        select: "onboarding_completed",
        filters: [{ column: "id", operator: "eq", value: data.user.id }],
      });

      const redirectTo = profile?.onboarding_completed
        ? next
        : "/onboarding/style";

      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
