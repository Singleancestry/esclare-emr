import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "esclare-clinic-platform",
      release: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.CF_VERSION_METADATA ?? "local",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
