import { cp, copyFile, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const openNext = resolve(root, ".open-next");
const dist = resolve(root, "dist");
const server = resolve(dist, "server");
const client = resolve(dist, "client");

await rm(dist, { force: true, recursive: true });
await mkdir(server, { recursive: true });
await cp(openNext, server, { recursive: true });
await copyFile(resolve(openNext, "worker.js"), resolve(server, "index.js"));
await cp(resolve(openNext, "assets"), client, { recursive: true });

console.log("Prepared Sites-compatible Cloudflare Worker output in dist/.");
