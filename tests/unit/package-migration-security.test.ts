import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve(
    process.cwd(),
    "supabase/migrations/202607291200_package_policy_and_refund_foundation.sql",
  ),
  "utf8",
).toLowerCase();

describe("package policy migration security", () => {
  it("enables RLS on every proposed package table", () => {
    for (const table of [
      "package_policy_versions",
      "patient_packages",
      "package_policy_acceptances",
      "package_validity_changes",
      "package_refund_requests",
      "package_refund_calculations",
      "package_alternative_remedies",
    ]) {
      expect(migration).toContain(`alter table public.${table} enable row level security`);
    }
  });

  it("does not add a blanket permissive policy", () => {
    expect(migration).not.toMatch(/using\s*\(\s*true\s*\)/);
    expect(migration).not.toMatch(/with check\s*\(\s*true\s*\)/);
  });

  it("enforces parent-child branch consistency", () => {
    expect(migration).toContain("references public.patient_branch_links(patient_id, branch_id)");
    expect(migration).toContain("references public.patient_packages(id, branch_id)");
    expect(migration).toContain("references public.package_refund_requests(id, branch_id)");
  });

  it("revokes inherited privileges before granting table-specific access", () => {
    expect(migration).toContain(
      "revoke all privileges on public.package_policy_acceptances from anon, authenticated",
    );
    expect(migration).toContain(
      "revoke all privileges on public.package_refund_calculations from anon, authenticated",
    );
    expect(migration).not.toContain(
      "grant select, insert, update on public.package_policy_acceptances",
    );
    expect(migration).not.toContain(
      "grant select, insert, update on public.package_refund_calculations",
    );
  });

  it("clamps refund calculations and prevents automatic overpayment", () => {
    expect(migration).toContain("greatest(");
    expect(migration).toContain("least(");
    expect(migration).toContain("final_approved_refund <= preliminary_refund");
  });
});
