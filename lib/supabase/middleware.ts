import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session — DO NOT remove this
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Terminate request or fail login if the refresh token is invalid
  if (error) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Authentication failed: " + error.message },
        { status: 401 },
      );
    }

    if (!request.nextUrl.pathname.startsWith("/login")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "session_expired");
      url.searchParams.set("next", request.nextUrl.pathname);

      const redirectResponse = NextResponse.redirect(url);

      // Preserve any cookie clearing applied by Supabase internally
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });

      return redirectResponse;
    }
  }

  // Protect dashboard routes
  if (
    !user &&
    (request.nextUrl.pathname.startsWith("/new") ||
      request.nextUrl.pathname.startsWith("/chat") ||
      request.nextUrl.pathname.startsWith("/trips") ||
      request.nextUrl.pathname.startsWith("/dashboard"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from auth pages
  if (
    user &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/signup") ||
      request.nextUrl.pathname.startsWith("/verify-email"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/new";
    return NextResponse.redirect(url);
  }

  // Redirect to onboarding if not completed
  if (user && request.nextUrl.pathname.startsWith("/new")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .single();

    if (profile && !profile.onboarding_completed) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding/style";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
