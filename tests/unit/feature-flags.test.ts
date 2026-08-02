import { afterEach, describe, expect, it } from "vitest";
import { getFeatureMode } from "@/lib/features/flags";

const originalEnvironment = {
  dashboard: process.env.ENABLE_DASHBOARD,
  patients: process.env.ENABLE_PATIENTS,
  appointments: process.env.ENABLE_APPOINTMENTS,
  auditRead: process.env.ENABLE_AUDIT_READ,
  inventory: process.env.ENABLE_INVENTORY,
};

afterEach(() => {
  process.env.ENABLE_DASHBOARD = originalEnvironment.dashboard;
  process.env.ENABLE_PATIENTS = originalEnvironment.patients;
  process.env.ENABLE_APPOINTMENTS = originalEnvironment.appointments;
  process.env.ENABLE_AUDIT_READ = originalEnvironment.auditRead;
  process.env.ENABLE_INVENTORY = originalEnvironment.inventory;
});

describe("feature release defaults", () => {
  it("keeps completed staff workflows available when deployment variables are absent", () => {
    delete process.env.ENABLE_DASHBOARD;
    delete process.env.ENABLE_PATIENTS;
    delete process.env.ENABLE_APPOINTMENTS;
    delete process.env.ENABLE_AUDIT_READ;

    expect(getFeatureMode("dashboard")).toBe("on");
    expect(getFeatureMode("patients")).toBe("on");
    expect(getFeatureMode("appointments")).toBe("on");
    expect(getFeatureMode("auditRead")).toBe("on");
  });

  it("keeps unfinished modules closed and honors an explicit off switch", () => {
    delete process.env.ENABLE_INVENTORY;
    process.env.ENABLE_DASHBOARD = "off";

    expect(getFeatureMode("inventory")).toBe("off");
    expect(getFeatureMode("dashboard")).toBe("off");
  });
});
