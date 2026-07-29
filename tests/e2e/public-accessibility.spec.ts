import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/home",
  "/treatments",
  "/appointment-request",
  "/contact",
  "/skin-education",
  "/treatments/mccm-exosome-pdrn",
  "/branches/naga",
  "/package-terms",
] as const;

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
] as const;

for (const route of routes) {
  for (const viewport of viewports) {
    test(`${route} has no axe violations at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route, { waitUntil: "domcontentloaded" });

      const results = await new AxeBuilder({ page }).analyze();
      const summary = results.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        targets: violation.nodes.flatMap((node) => node.target),
      }));

      expect(summary).toEqual([]);
    });
  }
}
