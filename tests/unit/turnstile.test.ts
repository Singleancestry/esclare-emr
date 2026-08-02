import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { verifyTurnstile } from "@/lib/security/turnstile";

function formData(token?: string) {
  const data = new FormData();
  if (token) data.set("cf-turnstile-response", token);
  return data;
}

describe("verifyTurnstile", () => {
  beforeEach(() => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
    vi.stubEnv("TURNSTILE_ALLOWED_HOSTNAMES", "esclareph.com,localhost");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("fails closed in production when the secret is missing", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");

    await expect(verifyTurnstile(formData("token"))).resolves.toBe(false);
  });

  it("rejects a missing challenge token", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    await expect(verifyTurnstile(formData())).resolves.toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("accepts a successful challenge from an allowed hostname", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true, hostname: "esclareph.com" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(verifyTurnstile(formData("valid-token"), "203.0.113.1")).resolves.toBe(true);
  });

  it("rejects a successful challenge from an unexpected hostname", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true, hostname: "example.com" }), { status: 200 }),
    );

    await expect(verifyTurnstile(formData("valid-token"))).resolves.toBe(false);
  });

  it("rejects verification service failures", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network unavailable"));

    await expect(verifyTurnstile(formData("token"))).resolves.toBe(false);
  });
});
