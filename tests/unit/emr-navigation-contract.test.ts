import { describe, expect, it } from "vitest";
import { FEATURES } from "@/lib/features/flags";
import { mainNavigation } from "@/lib/permissions/navigation";
import { ROLE_KEYS } from "@/lib/permissions/permissions";

const excludedStaffTerms = [
  "machine repair",
  "faq",
  "sms marketing",
  "email marketing",
  "social media",
  "crm and marketing",
];

describe("EMR navigation contract", () => {
  it("contains no duplicate or placeholder destinations", () => {
    const destinations = mainNavigation.flatMap((item) =>
      item.children?.length ? item.children.map((child) => child.href) : [item.href],
    );

    expect(destinations).not.toContain("#");
    expect(new Set(destinations).size).toBe(destinations.length);
  });

  it("keeps excluded marketing and support features out of staff navigation", () => {
    const navigationText = JSON.stringify(mainNavigation).toLowerCase();

    for (const term of excludedStaffTerms) expect(navigationText).not.toContain(term);
    expect(FEATURES).not.toContain("marketing");
    expect(ROLE_KEYS).not.toContain("marketing");
  });
});
