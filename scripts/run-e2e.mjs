import { spawn, spawnSync } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const isWindows = process.platform === "win32";
const nextBin = "node_modules/next/dist/bin/next";
const playwrightBin = "node_modules/@playwright/test/cli.js";
const baseUrl = "http://127.0.0.1:3000";

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

const server = spawn(process.execPath, [nextBin, "dev"], {
  cwd: process.cwd(),
  detached: !isWindows,
  env: process.env,
  stdio: "inherit",
});

let exitCode = 1;

try {
  await waitForServer();
  const result = spawnSync(
    process.execPath,
    [playwrightBin, "test", "--config=playwright.e2e.config.ts"],
    {
      cwd: process.cwd(),
      env: process.env,
      stdio: "inherit",
    },
  );

  exitCode = result.status ?? 1;
} finally {
  stopProcessTree(server.pid);
}

process.exit(exitCode);
