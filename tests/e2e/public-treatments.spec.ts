import { expect, test } from "@playwright/test";

test("public treatment catalog shows regular prices and doctor labels", async ({ page }) => {
  await page.goto("/treatments");
  await expect(page.getByRole("heading", { name: "Advanced care, selected for you." })).toBeVisible();
  const koreanFacial = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Korean Facial" }) });
  await expect(koreanFacial).toBeVisible();
  await expect(koreanFacial.getByText(/1,800 \/ session/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "4D Diode packages" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "6 sessions" })).toBeVisible();
});
