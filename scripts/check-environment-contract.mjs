import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const envExamplePath = resolve(".env.example");
const gitignorePath = resolve(".gitignore");
const envExample = readFileSync(envExamplePath, "utf8");
const gitignore = readFileSync(gitignorePath, "utf8");

const variableNames = [...envExample.matchAll(/^\s*([A-Z][A-Z0-9_]*)\s*=/gm)].map(
  (match) => match[1],
);
const uniqueNames = new Set(variableNames);
const requiredNames = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "APPOINTMENT_REQUEST_RATE_LIMIT_SECRET",
  "HEALTH_CHECK_TOKEN",
];
const secretLikePublicName = /^NEXT_PUBLIC_.*(?:SECRET|PRIVATE|SERVICE_ROLE|PASSWORD|TOKEN)/;
const errors = [];

for (const name of requiredNames) {
  if (!uniqueNames.has(name)) errors.push(`Missing required variable name: ${name}`);
}

for (const name of variableNames) {
  if (secretLikePublicName.test(name)) {
    errors.push(`Secret-like variable must not be public: ${name}`);
  }
}

if (uniqueNames.size !== variableNames.length) {
  errors.push(".env.example contains duplicate variable names");
}

for (const ignoredPattern of [".env", ".env*.local"]) {
  if (!gitignore.split(/\r?\n/).includes(ignoredPattern)) {
    errors.push(`.gitignore must contain: ${ignoredPattern}`);
  }
}

if (errors.length > 0) {
  console.error("Environment contract check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Environment contract valid (${uniqueNames.size} documented variable names).`);
