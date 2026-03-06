import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that never need auth checking
// Adding /api/chat here prevents middleware
// from interfering with streaming responses
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/verify-email",
  "/auth/callback",
  "/about",
  "/privacy",
  "/terms",
  "/cookies",
  "/refunds",
  "/acceptable-use",
  "/disclaimer",
];

// API routes that handle their own auth
// Middleware must NOT redirect or return
// errors for these — let the route handle it
const SELF_AUTH_API_ROUTES = [
  "/api/chat", // ← streaming — never interrupt
  "/api/bookings",
  "/api/trips",
  "/api/itineraries",
];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

function isSelfAuthApiRoute(pathname: string) {
  return SELF_AUTH_API_ROUTES.some((route) => pathname.startsWith(route));
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // CRITICAL FIX 1:
  // Never run session logic on streaming
  // API routes. These handle their own auth.
  // Middleware interference here causes the
  // redirect loop in production.
  if (isSelfAuthApiRoute(pathname)) {
    return NextResponse.next({ request });
  }

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

  // Refresh session
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // CRITICAL FIX 2:
  // On auth error, never return 401 for
  // API routes — it kills streaming.
  // Only redirect non-API, non-public pages.
  if (error) {
    // Skip public routes entirely
    if (isPublicRoute(pathname)) {
      return supabaseResponse;
    }

    // For non-API protected routes only,
    // redirect to login
    if (!pathname.startsWith("/api/")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "session_expired");
      url.searchParams.set("next", pathname);

      const redirectResponse = NextResponse.redirect(url);

      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });

      return redirectResponse;
    }

    // API routes with auth errors:
    // pass through, let the route handle it
    return supabaseResponse;
  }

  // Protect dashboard routes
  if (
    !user &&
    !isPublicRoute(pathname) &&
    !pathname.startsWith("/api/") &&
    (pathname.startsWith("/chat") ||
      pathname.startsWith("/chat") ||
      pathname.startsWith("/trips") ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/onboarding"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from
  // auth pages
  if (
    user &&
    (pathname.startsWith("/login") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/verify-email"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/chat";
    return NextResponse.redirect(url);
  }

  // CRITICAL FIX 3:
  // Only check onboarding on direct /new
  // page loads, not on every navigation.
  // Skip if coming from /chat (mid-session).
  // This prevents the DB query racing with
  // the stream in production.
  if (user && pathname === "/chat" && request.method === "GET") {
    const referer = request.headers.get("referer") ?? "";
    const isFromChat = referer.includes("/chat");

    // Skip onboarding check if navigating
    // within the app — only check on fresh
    // entry to /new
    if (!isFromChat) {
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
  }

  return supabaseResponse;
}
