import { describe, expect, it } from "vitest";
import { treatmentGalleryCategories } from "@/lib/clinic/treatment-media";

describe("treatment gallery media", () => {
  it("keeps all requested treatment categories distinct", () => {
    expect(treatmentGalleryCategories.map((item) => item.id)).toEqual([
      "pico-face",
      "diode-underarms",
      "hifu",
      "mccm",
      "pico-underarms",
      "doctor-led",
    ]);
  });

  it("provides optimized, descriptive media for every category", () => {
    for (const category of treatmentGalleryCategories) {
      expect(category.images.length).toBeGreaterThan(0);
      expect(category.images.every((image) => image.src.endsWith(".webp"))).toBe(true);
      expect(category.images.every((image) => image.alt.length > 20)).toBe(true);
    }
  });

  it("keeps each treatment in its semantic media folder", () => {
    const folders = {
      "pico-face": ["/pico-face/", "/devices/pico/"],
      "diode-underarms": ["/diode/", "/devices/diode-4d/"],
      hifu: ["/hifu/", "/devices/hifu/"],
      mccm: ["/mccm/"],
      "pico-underarms": ["/pico-underarm/"],
      "doctor-led": ["/doctor/"],
    } as const;
    for (const category of treatmentGalleryCategories) {
      expect(category.images.every((image) => folders[category.id].some((folder) => image.src.includes(folder)))).toBe(true);
    }
  });
});
