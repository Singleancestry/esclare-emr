import { performance } from "node:perf_hooks";

const baseUrl = process.env.VALIDATION_BASE_URL ?? "http://127.0.0.1:3100";
const concurrency = Number(process.env.LOAD_SMOKE_CONCURRENCY ?? 10);
const durationMs = Number(process.env.LOAD_SMOKE_DURATION_MS ?? 5_000);
const paths = (process.env.LOAD_SMOKE_PATHS ?? "/home,/treatments,/api/health").split(",");

function percentile(values, fraction) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * fraction))];
}

async function runPath(path) {
  const latencies = [];
  let requests = 0;
  let errors = 0;
  const deadline = performance.now() + durationMs;

  async function worker() {
    while (performance.now() < deadline) {
      const startedAt = performance.now();
      try {
        const response = await fetch(`${baseUrl}${path}`, {
          redirect: "manual",
          signal: AbortSignal.timeout(5_000),
        });
        if (response.status >= 500) errors += 1;
        await response.arrayBuffer();
      } catch {
        errors += 1;
      } finally {
        requests += 1;
        latencies.push(performance.now() - startedAt);
      }
    }
  }

  const startedAt = performance.now();
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  const elapsedSeconds = (performance.now() - startedAt) / 1_000;
  return {
    path,
    concurrency,
    requests,
    requestsPerSecond: Number((requests / elapsedSeconds).toFixed(2)),
    errorRate: Number((errors / Math.max(requests, 1)).toFixed(4)),
    latencyMs: {
      p50: Number(percentile(latencies, 0.5).toFixed(2)),
      p95: Number(percentile(latencies, 0.95).toFixed(2)),
      p99: Number(percentile(latencies, 0.99).toFixed(2)),
    },
  };
}

const results = [];
for (const path of paths) results.push(await runPath(path));
console.log(JSON.stringify(results, null, 2));
if (results.some((result) => result.errorRate > 0.01)) process.exit(1);
