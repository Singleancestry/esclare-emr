import { expect, test } from "@playwright/test";

const baseURL = process.env.VALIDATION_BASE_URL ?? "http://127.0.0.1:3000";
const pages = ["/home", "/treatments", "/appointment-request", "/login"];
const viewports = [
  { name: "android", width: 360, height: 800 },
  { name: "iphone", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1366, height: 768 },
  { name: "desktop", width: 1920, height: 1080 },
];

for (const viewport of viewports) {
  test(`deploy pages fit ${viewport.name} viewport`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const path of pages) {
      await page.goto(`${baseURL}${path}`);
      await expect(page.locator("main, #main-content").first()).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
      await page.screenshot({
        path: `test-results/deploy-readiness/${viewport.name}-${path.slice(1).replaceAll("/", "-")}.png`,
        fullPage: true,
      });
    }
  });
}

test("mobile navigation remains keyboard and touch usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseURL}/home`);
  const menu = page.getByRole("button", { name: "Open menu" });
  await expect(menu).toHaveCSS("width", "44px");
  await expect(menu).toHaveCSS("height", "44px");
  await menu.click();
  await expect(page.getByRole("dialog", { name: "Site navigation" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Treatments" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
});
