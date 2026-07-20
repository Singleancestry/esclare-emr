import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { setTimeout as delay } from "node:timers/promises";

const baseUrl = process.env.VALIDATION_BASE_URL ?? "http://127.0.0.1:3100";
const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const categories = "performance,accessibility,best-practices,seo";
const results = {};
const chromeTemp = join(process.cwd(), ".tools", "lighthouse-temp");
mkdirSync(chromeTemp, { recursive: true });
const debuggingPort = 9333;
const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const chromePath = chromeCandidates.find((candidate) => existsSync(candidate));
if (!chromePath) {
  console.error("Lighthouse requires Chrome or Chromium. Set CHROME_PATH to its executable.");
  process.exit(1);
}
const profilePath = join(chromeTemp, `profile-${Date.now()}`);
const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${debuggingPort}`,
    `--user-data-dir=${profilePath}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

for (let attempt = 0; attempt < 60; attempt += 1) {
  try {
    const response = await fetch(`http://127.0.0.1:${debuggingPort}/json/version`);
    if (response.ok) break;
  } catch {
    // Wait for the private Lighthouse browser to start.
  }
  if (attempt === 59) {
    console.error("Timed out starting Chrome for Lighthouse.");
    if (process.platform === "win32") {
      spawnSync("taskkill", ["/pid", String(chrome.pid), "/t", "/f"], { stdio: "ignore" });
    } else {
      chrome.kill("SIGTERM");
    }
    process.exit(1);
  }
  await delay(250);
}

try {
  for (const preset of ["mobile", "desktop"]) {
    const outputPath = join(tmpdir(), `esclare-lighthouse-${preset}-${Date.now()}.json`);
    const args = [
      "--yes",
      "lighthouse",
      `${baseUrl}/home`,
      "--quiet",
      `--port=${debuggingPort}`,
      "--output=json",
      `--output-path=${outputPath}`,
      `--only-categories=${categories}`,
    ];
    if (preset === "desktop") args.push("--preset=desktop");
    const executable = process.platform === "win32" ? (process.env.ComSpec ?? "cmd.exe") : npx;
    const commandArgs = process.platform === "win32" ? ["/d", "/s", "/c", npx, ...args] : args;
    const run = spawnSync(executable, commandArgs, {
      encoding: "utf8",
      stdio: "inherit",
      env: { ...process.env, TEMP: chromeTemp, TMP: chromeTemp },
    });
    if (run.status !== 0) throw new Error(`Lighthouse ${preset} run failed.`);
    const report = JSON.parse(readFileSync(outputPath, "utf8"));
    results[preset] = Object.fromEntries(
      Object.entries(report.categories).map(([key, value]) => [key, Math.round(value.score * 100)]),
    );
  }
} finally {
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(chrome.pid), "/t", "/f"], { stdio: "ignore" });
  } else {
    chrome.kill("SIGTERM");
  }
}

writeFileSync(
  "validation-agent/lighthouse-results.json",
  `${JSON.stringify({ generatedAt: new Date().toISOString(), url: `${baseUrl}/home`, results }, null, 2)}\n`,
);
console.log(JSON.stringify(results, null, 2));

if (Object.values(results).some((scores) => Object.values(scores).some((score) => score < 80))) {
  process.exit(1);
}
