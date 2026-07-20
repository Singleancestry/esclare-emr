import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("operational controls", () => {
  it("guards disabled staff domains at navigation and direct-route boundaries", () => {
    const navigation = read("lib/permissions/navigation.ts");
    const clinical = read("app/(staff)/clinical/page.tsx");
    const payments = read("app/(staff)/pos/page.tsx");
    const reports = read("app/(staff)/reports/page.tsx");

    expect(navigation).toContain('feature: "clinicalRecords"');
    expect(navigation).toContain('feature: "payments"');
    expect(clinical).toContain('requireFeature("clinicalRecords")');
    expect(payments).toContain('requireFeature("payments")');
    expect(reports).toContain('requireFeature("reports")');
  });

  it("guards pilot data mutations independently from page visibility", () => {
    const patientAction = read("app/(staff)/patients/new/actions.ts");
    const appointmentActions = read("app/(staff)/appointments/actions.ts");
    const revealRoute = read("app/api/patients/[patientId]/reveal-contact/route.ts");

    expect(patientAction).toContain('isFeatureEnabled("patients", staff.employee.id)');
    expect(
      appointmentActions.match(/isFeatureEnabled\("appointments", staff\.employee\.id\)/g),
    ).toHaveLength(3);
    expect(revealRoute).toContain('isFeatureEnabled("patients", staff.employee.id)');
    expect(read("app/(public)/appointment-request/actions.ts")).toContain(
      'isFeatureEnabled("publicBookingPersistence")',
    );
  });

  it("keeps readiness private, no-store, bounded, and schema-aware", () => {
    const readiness = read("app/api/health/ready/route.ts");

    expect(readiness).toContain("HEALTH_CHECK_TOKEN");
    expect(readiness).toContain('"Cache-Control": "no-store"');
    expect(readiness).toContain("timingSafeEqual");
    expect(readiness).toContain("2_000");
    expect(readiness).toContain('schemaVersion !== "202607181390"');
    expect(readiness).toContain("result.data?.ready !== true");
    expect(readiness).not.toContain("request.json(");
  });

  it("refreshes Supabase cookies before protected server rendering", () => {
    const proxy = read("middleware.ts");

    expect(proxy).toContain("createServerClient");
    expect(proxy).toContain("request.cookies.getAll()");
    expect(proxy).toContain("response.cookies.set");
    expect(proxy).toContain("supabase.auth.getClaims()");
  });

  it("defines hardened response headers and an enforced CSP", () => {
    const config = read("next.config.ts");

    expect(config).toContain('key: "Strict-Transport-Security"');
    expect(config).toContain('key: "Content-Security-Policy"');
    expect(config).not.toContain('key: "Content-Security-Policy-Report-Only"');
    expect(config).toContain('key: "Cross-Origin-Resource-Policy"');
    expect(config).toContain('key: "X-Permitted-Cross-Domain-Policies"');
    expect(config).toContain("\"frame-ancestors 'none'\"");
    expect(config).toContain("\"object-src 'none'\"");
    expect(config).toContain('process.env.NODE_ENV === "development"');
    expect(config).toContain("'unsafe-eval'");
  });

  it("checks the documented environment contract without reading secret values", () => {
    const script = read("scripts/check-environment-contract.mjs");

    expect(script).toContain("secretLikePublicName");
    expect(script).toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(script).toContain("APPOINTMENT_REQUEST_RATE_LIMIT_SECRET");
    expect(script).not.toContain("process.env[");
  });
});
