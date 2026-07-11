import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

function run(script, args) {
  const result = spawnSync(process.execPath, [resolve(script), ...args], {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("node_modules/next/dist/bin/next", ["build", "--webpack"]);
run("node_modules/@opennextjs/cloudflare/dist/cli/index.js", ["build", "--skipNextBuild"]);
run("scripts/stage-sites-build.mjs", []);
