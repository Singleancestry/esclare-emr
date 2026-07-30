import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const requestedNext = request.nextUrl.searchParams.get("next") ?? "/update-password";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    request.nextUrl.origin;
  const next =
    requestedNext.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/update-password";

  if (code || (tokenHash && type === "recovery")) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { error } = tokenHash
        ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" })
        : await supabase.auth.exchangeCodeForSession(code!);
      if (!error) return NextResponse.redirect(new URL(next, siteUrl));
    }
  }

  return NextResponse.redirect(new URL("/login", siteUrl));
}
