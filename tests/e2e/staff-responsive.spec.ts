import { expect, test } from "@playwright/test";

const widths = [320, 360, 375, 390, 414, 768, 1024, 1280, 1440];

for (const width of widths) {
  test(`@staff dashboard remains usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    await page.goto("/dashboard");

    await expect(page.getByRole("heading", { name: "Clinic dashboard" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
      true,
    );

    if (width < 1024) {
      const menu = page.locator("header > div > details > summary");
      await expect(menu).toBeVisible();
      await expect(menu).toHaveCSS("min-height", "40px");
      await menu.click();
      await expect(page.getByRole("navigation", { name: "Mobile main" })).toBeVisible();
    } else {
      await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
    }
  });
}

test("@staff patient table scrolls inside its container on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/patients");
  await page.getByRole("button", { name: "Table view" }).click();

  const tableScroll = page.getByTestId("patient-table-scroll");
  await expect(tableScroll).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect(
    await tableScroll.evaluate((element) => element.scrollWidth > element.clientWidth),
  ).toBe(true);
});
