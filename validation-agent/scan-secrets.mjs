import { readFileSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";

const excludedPaths = new Set([".env.example"]);
const sourcePatterns = [
  ["private-key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["github-token", /\b(?:ghp|gho|ghu|ghs|github_pat)_[A-Za-z0-9_]{20,}\b/],
  ["aws-access-key", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ["google-api-key", /\bAIza[0-9A-Za-z_-]{30,}\b/],
  ["payment-secret", /\bsk_(?:live|test)_[0-9A-Za-z]{16,}\b/],
  ["openai-secret", /\bsk-(?:proj-)?[0-9A-Za-z_-]{20,}\b/],
  [
    "assigned-secret",
    /(?:SERVICE_ROLE_KEY|PRIVATE_KEY|PASSWORD|SECRET|ACCESS_TOKEN)\s*=\s*["']?(?!process\.env|server-only|your-|mock|placeholder|\.\.\.)[^\s"']{16,}/i,
  ],
];

function git(args) {
  return spawnSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

const listed = git(["ls-files", "-z", "--cached", "--others", "--exclude-standard"]);
if (listed.status !== 0) {
  console.error("Secret scan could not enumerate repository files.");
  process.exit(1);
}

const findings = [];
for (const path of listed.stdout.split("\0").filter(Boolean)) {
  if (excludedPaths.has(path)) continue;
  let stats;
  try {
    stats = statSync(path);
  } catch {
    continue;
  }
  if (!stats.isFile() || stats.size > 2_000_000) continue;
  const content = readFileSync(path);
  if (content.includes(0)) continue;
  const text = content.toString("utf8");
  for (const [kind, pattern] of sourcePatterns) {
    if (pattern.test(text)) findings.push({ scope: "working-tree", kind, path });
  }
}

const historyExpression =
  "(ghp|gho|ghu|ghs)_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[A-Z0-9]{16}|AIza[0-9A-Za-z_-]{30,}|sk_(live|test)_[0-9A-Za-z]{16,}|sk-(proj-)?[0-9A-Za-z_-]{20,}|BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY|SUPABASE_SERVICE_ROLE_KEY=";
const commits = git(["rev-list", "--all"]);
if (commits.status !== 0) {
  console.error("Secret scan could not enumerate Git history.");
  process.exit(1);
}

for (const commit of commits.stdout.split(/\r?\n/).filter(Boolean)) {
  const matches = git(["grep", "-I", "-l", "-E", historyExpression, commit, "--", "."]);
  if (![0, 1].includes(matches.status ?? 1)) {
    console.error(`Secret scan failed while checking commit ${commit.slice(0, 12)}.`);
    process.exit(1);
  }
  for (const entry of matches.stdout.split(/\r?\n/).filter(Boolean)) {
    const separator = entry.indexOf(":");
    const path = separator >= 0 ? entry.slice(separator + 1) : entry;
    if (excludedPaths.has(path)) continue;
    findings.push({ scope: "git-history", kind: "credential-pattern", path, commit });
  }
}

const uniqueFindings = [...new Map(findings.map((item) => [JSON.stringify(item), item])).values()];
if (uniqueFindings.length) {
  console.error(
    `Secret scan failed with ${uniqueFindings.length} finding(s). Values are intentionally hidden.`,
  );
  for (const finding of uniqueFindings) {
    const commit = finding.commit ? ` at ${finding.commit.slice(0, 12)}` : "";
    console.error(`- ${finding.scope}: ${finding.kind} in ${finding.path}${commit}`);
  }
  process.exit(1);
}

console.log("Secret scan passed for the working tree and complete Git history.");
