import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "esclare-clinic-platform",
    phase: 1,
  });
}
