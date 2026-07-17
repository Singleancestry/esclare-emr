import { spawnSync } from "node:child_process";
import { cp, copyFile, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const openNext = resolve(root, ".open-next");
const dist = resolve(root, "dist");
const server = resolve(dist, "server");
const client = resolve(dist, "client");
const bundle = resolve(root, ".sites-bundle");

await rm(bundle, { force: true, recursive: true });
const wrangler = resolve(root, "node_modules", "wrangler", "bin", "wrangler.js");
const bundleResult = spawnSync(
  process.execPath,
  [wrangler, "deploy", "--dry-run", "--outdir", bundle],
  {
    cwd: root,
    encoding: "utf8",
    stdio: "inherit",
  },
);
if (bundleResult.status !== 0) {
  throw new Error("Unable to bundle the Sites worker");
}

await rm(dist, { force: true, recursive: true });
await mkdir(server, { recursive: true });
await copyFile(resolve(bundle, "worker.js"), resolve(server, "index.js"));
await cp(resolve(openNext, "assets"), client, { recursive: true });

console.log("Prepared Sites-compatible Cloudflare Worker output in dist/.");
