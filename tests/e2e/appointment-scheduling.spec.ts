import { expect, test } from "@playwright/test";

test("appointment workspace exposes scheduling and validates patient selection", async ({
  page,
}) => {
  await page.goto("/appointments");

  await expect(page.getByRole("heading", { name: "Schedule & Requests" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Schedule appointment" })).toBeVisible();
  const patientSelect = page.locator('select[name="patientId"]');
  await expect(patientSelect).toHaveAttribute("required", "");
  await expect(patientSelect).toHaveValue("");
  await page.getByRole("button", { name: "Schedule", exact: true }).click();
  await expect(patientSelect).toBeFocused();
  await expect(page.getByRole("heading", { name: "Upcoming appointments" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Public request inbox" })).toBeVisible();
});
