import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const websiteOnlyPrefixes = [
  "/admin",
  "/api/patients",
  "/appointments",
  "/auth",
  "/clinical",
  "/dashboard",
  "/employees",
  "/finance",
  "/forgot-password",
  "/integrations",
  "/inventory",
  "/lock",
  "/login",
  "/marketing",
  "/mfa",
  "/packages",
  "/patients",
  "/pos",
  "/reports",
  "/reviews-manager",
  "/services",
  "/settings",
  "/update-password",
];

function isWebsiteOnlyBlockedPath(pathname: string) {
  return websiteOnlyPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

// Edge middleware remains necessary until OpenNext supports Next.js 16 Node proxy.
export async function middleware(request: NextRequest) {
  // Public deployments are website-only by default. The internal staff application must opt in
  // explicitly with PUBLIC_WEBSITE_ONLY=false in its separate, authenticated environment.
  const explicitlyWebsiteOnly = process.env.PUBLIC_WEBSITE_ONLY === "true";
  const websiteOnly = explicitlyWebsiteOnly || process.env.PUBLIC_WEBSITE_ONLY === undefined;
  if (websiteOnly && isWebsiteOnlyBlockedPath(request.nextUrl.pathname)) {
    return new NextResponse("Not Found", {
      status: 404,
      headers: {
        "Cache-Control": "private, no-store, no-cache, must-revalidate, max-age=0",
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });
  }

  if (websiteOnly) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return response;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  await supabase.auth.getClaims();
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/|media/).*)"],
};
