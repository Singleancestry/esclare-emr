import { spawn, spawnSync } from "node:child_process";
import { cpSync, existsSync } from "node:fs";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const isWindows = process.platform === "win32";
const nextBin = "node_modules/next/dist/bin/next";
const playwrightBin = "node_modules/@playwright/test/cli.js";
const baseUrl = "http://127.0.0.1:3000";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const useProductionServer = process.env.E2E_USE_PRODUCTION_SERVER === "true";
const standaloneServer = path.join(".next", "standalone", "server.js");
const hasRemoteSupabase =
  Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) ||
  (Boolean(supabaseUrl) &&
    !supabaseUrl.includes("localhost") &&
    !supabaseUrl.includes("127.0.0.1") &&
    !supabaseUrl.includes("your-project.supabase.co"));

if (hasRemoteSupabase && process.env.E2E_ALLOW_REMOTE_SUPABASE !== "disposable-test-project") {
  throw new Error(
    "E2E refused remote Supabase credentials. Use an isolated disposable project and set E2E_ALLOW_REMOTE_SUPABASE=disposable-test-project.",
  );
}

function stopProcessTree(pid) {
  if (!pid) return;

  if (isWindows) {
    spawnSync("taskkill", ["/pid", String(pid), "/t", "/f"], { stdio: "ignore" });
    return;
  }

  try {
    process.kill(-pid, "SIGTERM");
  } catch {
    try {
      process.kill(pid, "SIGTERM");
    } catch {
      // The process may already be gone.
    }
  }
}

async function waitForServer() {
  const startedAt = Date.now();
  let lastError;

  while (Date.now() - startedAt < 60_000) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok || response.status < 500) return;
    } catch (error) {
      lastError = error;
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for ${baseUrl}: ${lastError?.message ?? "no response"}`);
}

if (useProductionServer) {
  if (!existsSync(standaloneServer)) {
    throw new Error("Production E2E requires a completed Next.js standalone build.");
  }
  cpSync("public", path.join(".next", "standalone", "public"), { recursive: true, force: true });
  cpSync(path.join(".next", "static"), path.join(".next", "standalone", ".next", "static"), {
    recursive: true,
    force: true,
  });
}

const server = spawn(
  process.execPath,
  useProductionServer ? [standaloneServer] : [nextBin, "dev"],
  {
    cwd: process.cwd(),
    detached: !isWindows,
    env: {
      ...process.env,
      HOSTNAME: "127.0.0.1",
      PORT: "3000",
      PLAYWRIGHT_MANAGED_SERVER: "true",
    },
    stdio: "inherit",
  },
);

let exitCode = 1;

try {
  await waitForServer();
  const result = spawnSync(
    process.execPath,
    [playwrightBin, "test", "--config=playwright.config.ts", ...process.argv.slice(2)],
    {
      cwd: process.cwd(),
      env: { ...process.env, PLAYWRIGHT_MANAGED_SERVER: "true" },
      stdio: "inherit",
    },
  );

  exitCode = result.status ?? 1;
} finally {
  stopProcessTree(server.pid);
}

process.exit(exitCode);
