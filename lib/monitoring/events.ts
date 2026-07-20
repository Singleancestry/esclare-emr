import "server-only";

export type OperationalEvent = {
  eventName: string;
  severity: "info" | "warning" | "critical";
  outcome: "success" | "failure" | "denied";
  requestId: string;
  operation: string;
  dependency?: "supabase" | "deployment" | "backup" | "application";
  durationMs?: number;
  errorCode?: string;
};

export function emitOperationalEvent(event: OperationalEvent) {
  const envelope = {
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
    release: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.CF_VERSION_METADATA ?? "local",
    ...event,
  };

  const serialized = JSON.stringify(envelope);
  if (event.severity === "critical") console.error(serialized);
  else if (event.severity === "warning") console.warn(serialized);
  else console.info(serialized);
}
