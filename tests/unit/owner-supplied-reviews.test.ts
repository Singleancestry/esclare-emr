import { describe, expect, it } from "vitest";
import { ownerSuppliedReviews } from "@/lib/reviews/owner-supplied";

describe("owner-supplied Facebook recommendations", () => {
  it("contains only the 16 readable screenshot recommendations without invented ratings", () => {
    expect(ownerSuppliedReviews).toHaveLength(16);
    expect(ownerSuppliedReviews.every((review) => review.source === "facebook")).toBe(true);
    expect(ownerSuppliedReviews.every((review) => review.rating === null)).toBe(true);
    expect(new Set(ownerSuppliedReviews.map((review) => review.id)).size).toBe(16);
  });

  it("preserves the visible reviewer, date, and clinic response evidence", () => {
    const edna = ownerSuppliedReviews.find(
      (review) => review.reviewerDisplayName === "Edna Iglas Bea",
    );

    expect(edna?.reviewDate).toBe("2020-07-06");
    expect(edna?.reviewText).toContain("Diode Laser Hair Removal");
    expect(edna?.clinicResponse).toContain("pleased you liked the results");
  });
});
