import { expect, test } from "@playwright/test";

test("public home uses authentic clinic, attendant, logo, and diode assets", async ({ page }) => {
  await page.goto("/home");
  await expect(page.getByRole("img", { name: "ESCLARE Naga logo wall and crystal chandelier" })).toBeVisible();
  await expect(page.getByRole("img", { name: "The actual four-wavelength diode laser machine used by ESCLARE" })).toBeVisible();
  await expect(page.getByRole("img", { name: "ESCLARE clinic attendant in a professional muted light-maroon uniform" })).toBeVisible();
  await expect(page.getByRole("link", { name: "ESCLARE home" }).getByRole("img", { name: "ESCLARE Aesthetic Center" })).toBeVisible();
});

test("gallery and diode pages expose accurate launch content", async ({ page }) => {
  await page.goto("/gallery");
  await expect(page.getByRole("heading", { name: "A real look inside both clinics." })).toBeVisible();
  await expect(page.getByRole("img", { name: "ESCLARE Naga reception logo wall beneath a crystal chandelier" })).toBeVisible();
  await expect(page.getByRole("img", { name: "ESCLARE Daet reception with the illuminated ESCLARE wall sign" })).toBeVisible();

  await page.getByRole("button", { name: "Open larger view of Daet reception, ESCLARE Daet" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Daet reception" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();

  await page.goto("/diode-laser");
  await expect(page.getByRole("heading", { name: "Smoother routines, thoughtfully planned." })).toBeVisible();
  await expect(page.getByText("Results vary.")).toBeVisible();
  await expect(page.getByText("Actual ESCLARE diode equipment")).toBeVisible();
});

test("Daet branch page uses authentic photography and accurate details", async ({ page }) => {
  await page.goto("/branches/daet");
  await expect(page.getByRole("heading", { name: "ESCLARE DAET", exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: "The authentic ESCLARE Daet reception with the illuminated ESCLARE wordmark" })).toBeVisible();
  await expect(page.getByText("Tuesday-Sunday, 9:30 AM-6:00 PM")).toBeVisible();
  await expect(page.getByText("All listed treatments except Fractional Laser and Scar Care.")).toBeVisible();
});
