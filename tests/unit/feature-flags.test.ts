import { afterEach, describe, expect, it, vi } from "vitest";
import { isFeatureEnabled } from "@/lib/features/flags";

describe("feature flags", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("keeps unfinished domains disabled by default", () => {
    expect(isFeatureEnabled("clinicalRecords")).toBe(false);
    expect(isFeatureEnabled("clinicalPhotos")).toBe(false);
    expect(isFeatureEnabled("payments")).toBe(false);
    expect(isFeatureEnabled("packages")).toBe(false);
    expect(isFeatureEnabled("inventory")).toBe(false);
    expect(isFeatureEnabled("reports")).toBe(false);
    expect(isFeatureEnabled("publicBookingPersistence")).toBe(false);
  });

  it("requires explicit production enablement for pilot workflows", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ENABLE_PATIENTS", "");
    vi.stubEnv("ENABLE_APPOINTMENTS", "");

    expect(isFeatureEnabled("patients")).toBe(false);
    expect(isFeatureEnabled("appointments")).toBe(false);
  });

  it("accepts only an explicit true value", () => {
    vi.stubEnv("ENABLE_PAYMENTS", "true");
    expect(isFeatureEnabled("payments")).toBe(true);

    vi.stubEnv("ENABLE_PAYMENTS", "yes");
    expect(isFeatureEnabled("payments")).toBe(false);
  });

  it("limits production pilot mode to the explicit staff allowlist", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ENABLE_PATIENTS", "pilot");
    vi.stubEnv("FEATURE_PILOT_STAFF_IDS", "employee-a, employee-b");

    expect(isFeatureEnabled("patients", "employee-a")).toBe(true);
    expect(isFeatureEnabled("patients", "employee-c")).toBe(false);
    expect(isFeatureEnabled("patients")).toBe(false);
  });
});
