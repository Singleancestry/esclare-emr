import { expect, test } from "@playwright/test";

test("optional analytics and marketing remain off after rejection", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("region", { name: "Privacy choices" })).toBeVisible();
  await page.getByRole("button", { name: "Reject optional" }).click();
  await expect(page.getByRole("region", { name: "Privacy choices" })).toHaveCount(0);
  await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);
  await expect(page.locator("script#meta-pixel")).toHaveCount(0);
});

test("custom choices persist and can be changed from the footer", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Customize" }).click();

  const dialog = page.getByRole("dialog", { name: "Customize privacy settings" });
  await expect(dialog).toBeVisible();
  await dialog.getByText("Analytics").click();
  await dialog.getByRole("button", { name: "Save choices" }).click();
  await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(1);
  await expect(page.locator("script#meta-pixel")).toHaveCount(0);

  await page.getByRole("button", { name: "Cookie settings" }).click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("checkbox").first()).toBeChecked();
});
