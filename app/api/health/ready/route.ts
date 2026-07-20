import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase-admin";
import { emitOperationalEvent } from "@/lib/monitoring/events";

const headers = { "Cache-Control": "no-store" };

function isAuthorized(request: Request) {
  const expected = process.env.HEALTH_CHECK_TOKEN;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || !supplied) return false;
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  return (
    expectedBuffer.length === suppliedBuffer.length &&
    timingSafeEqual(expectedBuffer, suppliedBuffer)
  );
}

export async function GET(request: Request) {
  const requestId = crypto.randomUUID();
  const startedAt = performance.now();
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, requestId }, { status: 404, headers });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    emitOperationalEvent({
      eventName: "health.emr_unavailable",
      severity: "critical",
      outcome: "failure",
      requestId,
      operation: "readiness",
      dependency: "supabase",
      errorCode: "not_configured",
    });
    return NextResponse.json({ ok: false, requestId }, { status: 503, headers });
  }

  try {
    const result = await Promise.race([
      admin.rpc("get_release_readiness"),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("readiness_timeout")), 2_000),
      ),
    ]);
    if (
      result.error ||
      result.data?.schemaVersion !== "202607181390" ||
      result.data?.ready !== true
    ) {
      throw new Error("schema_not_ready");
    }

    return NextResponse.json(
      {
        ok: true,
        requestId,
        dependency: "available",
        schemaVersion: result.data.schemaVersion,
        release: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.CF_VERSION_METADATA ?? "local",
      },
      { headers },
    );
  } catch (error) {
    const errorCode = error instanceof Error ? error.message : "readiness_failed";
    emitOperationalEvent({
      eventName: "health.emr_unavailable",
      severity: "critical",
      outcome: "failure",
      requestId,
      operation: "readiness",
      dependency: "supabase",
      durationMs: Math.round(performance.now() - startedAt),
      errorCode,
    });
    return NextResponse.json({ ok: false, requestId }, { status: 503, headers });
  }
}
