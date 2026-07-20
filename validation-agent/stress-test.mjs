import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const baseUrl = process.env.VALIDATION_BASE_URL ?? "http://127.0.0.1:3100";
const durationSeconds = Number(process.env.STRESS_DURATION_SECONDS ?? 30);
const paths = ["/home", "/treatments", "/api/health"];
const levels = [10, 50, 200];
const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const results = [];

for (const path of paths) {
  for (const connections of levels) {
    console.log(`Running ${path} at ${connections} connections for ${durationSeconds}s...`);
    const args = [
      "--yes",
      "autocannon",
      "--connections",
      String(connections),
      "--duration",
      String(durationSeconds),
      "--json",
      `${baseUrl}${path}`,
    ];
    const executable = process.platform === "win32" ? (process.env.ComSpec ?? "cmd.exe") : npx;
    const commandArgs = process.platform === "win32" ? ["/d", "/s", "/c", npx, ...args] : args;
    const run = spawnSync(executable, commandArgs, {
      cwd: process.cwd(),
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    });
    if (run.status !== 0) {
      console.error(run.stderr || `Autocannon failed for ${path} at ${connections}.`);
      process.exit(run.status ?? 1);
    }
    const raw = JSON.parse(run.stdout);
    const result = {
      path,
      connections,
      durationSeconds,
      requestsPerSecond: raw.requests.average,
      throughputBytesPerSecond: raw.throughput.average,
      errorRate: Number(
        ((raw.errors + raw.timeouts + raw.non2xx) / Math.max(raw.requests.total, 1)).toFixed(4),
      ),
      errors: raw.errors,
      timeouts: raw.timeouts,
      non2xx: raw.non2xx,
      latencyMs: {
        p50: raw.latency.p50,
        p95UpperBound: raw.latency.p95 ?? raw.latency.p97_5,
        p99: raw.latency.p99,
      },
    };
    results.push(result);
    console.log(JSON.stringify(result));
  }
}

writeFileSync(
  "validation-agent/stress-results.json",
  `${JSON.stringify({ generatedAt: new Date().toISOString(), baseUrl, results }, null, 2)}\n`,
);

if (results.some((result) => result.errorRate > 0.01)) process.exit(1);
