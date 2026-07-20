import { spawn, spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";

const mode = process.argv.includes("--full") ? "full" : "ci";
const isWindows = process.platform === "win32";
const checks = [];

function command(name, executable, args, options = {}) {
  const startedAt = Date.now();
  const usesWindowsShim = isWindows && /\.cmd$/i.test(executable);
  const commandExecutable = usesWindowsShim ? (process.env.ComSpec ?? "cmd.exe") : executable;
  const commandArgs = usesWindowsShim ? ["/d", "/s", "/c", executable, ...args] : args;
  const result = spawnSync(commandExecutable, commandArgs, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
    env: { ...process.env, ...options.env },
  });
  const passed = result.status === 0;
  checks.push({ name, status: passed ? "PASS" : "FAIL", durationMs: Date.now() - startedAt });
  console.log(`${passed ? "PASS" : "FAIL"} ${name}`);
  return { passed, result };
}

function stopProcessTree(pid) {
  if (!pid) return;
  if (isWindows) {
    spawnSync("taskkill", ["/pid", String(pid), "/t", "/f"], { stdio: "ignore" });
  } else {
    try {
      process.kill(-pid, "SIGTERM");
    } catch {
      // The validation server may already have exited.
    }
  }
}

async function waitForServer(url) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.status < 500) return true;
    } catch {
      // Retry while the production server starts.
    }
    await delay(500);
  }
  return false;
}

const npm = isWindows ? "npm.cmd" : "npm";
const npx = isWindows ? "npx.cmd" : "npx";

command("dependency lock check", npm, [
  "ci",
  "--ignore-scripts",
  "--dry-run",
  "--no-audit",
  "--no-fund",
]);
command("format", npm, ["run", "format:check"]);
command("environment contract", npm, ["run", "env:check"]);
command("lint", npm, ["run", "lint"]);
command("typecheck", npm, ["run", "typecheck"]);
command("unit tests", npm, ["test"]);
command("dependency audit", npm, ["audit", "--audit-level=high"]);
command("secret scan", process.execPath, ["validation-agent/scan-secrets.mjs"]);
command("production build", npm, ["run", "build"]);

if (mode === "full" && checks.every((check) => check.status === "PASS")) {
  const server = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "-p", "3100"],
    {
      cwd: process.cwd(),
      detached: !isWindows,
      env: { ...process.env, HOSTNAME: "127.0.0.1" },
      stdio: "ignore",
    },
  );
  try {
    const ready = await waitForServer("http://127.0.0.1:3100/home");
    checks.push({ name: "production server", status: ready ? "PASS" : "FAIL", durationMs: 0 });
    if (ready) {
      command(
        "responsive Playwright flows",
        npx,
        [
          "playwright",
          "test",
          "tests/e2e/deploy-readiness.spec.ts",
          "--config=playwright.config.ts",
          "--project=chromium",
        ],
        {
          env: { PLAYWRIGHT_MANAGED_SERVER: "true", VALIDATION_BASE_URL: "http://127.0.0.1:3100" },
        },
      );
      command("load smoke", process.execPath, ["validation-agent/load-smoke.mjs"], {
        env: { VALIDATION_BASE_URL: "http://127.0.0.1:3100" },
      });
      command(
        "Lighthouse mobile and desktop",
        process.execPath,
        ["validation-agent/lighthouse.mjs"],
        {
          env: { VALIDATION_BASE_URL: "http://127.0.0.1:3100" },
        },
      );
    }
  } finally {
    stopProcessTree(server.pid);
  }
}

const ready = checks.every((check) => check.status === "PASS");
writeFileSync(
  "validation-agent/checklist.json",
  `${JSON.stringify({ generatedAt: new Date().toISOString(), mode, ready, checks }, null, 2)}\n`,
);
console.log(`Validation ${ready ? "PASSED" : "FAILED"} (${checks.length} checks).`);
if (!ready) process.exit(1);
