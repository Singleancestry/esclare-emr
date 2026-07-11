import { expect, test } from "@playwright/test";

test("public home uses authentic clinic, attendant, logo, and diode assets", async ({ page }) => {
  await page.goto("/home");
  await expect(page.getByRole("img", { name: "The real ESCLARE Naga logo wall and crystal chandelier" })).toBeVisible();
  await expect(page.getByRole("img", { name: "The actual four-wavelength diode laser machine used by ESCLARE" })).toBeVisible();
  await expect(page.getByRole("img", { name: "ESCLARE clinic attendant in a professional muted light-maroon uniform" })).toBeVisible();
  await expect(page.getByRole("link", { name: "ESCLARE home" }).getByRole("img", { name: "ESCLARE Aesthetic Center" })).toBeVisible();
});

test("gallery and diode pages expose accurate launch content", async ({ page }) => {
  await page.goto("/gallery");
  await expect(page.getByRole("heading", { name: "A real look inside the clinic." })).toBeVisible();
  await expect(page.getByRole("img", { name: "The real ESCLARE Naga reception counter and textured logo wall" })).toBeVisible();

  await page.goto("/diode-laser");
  await expect(page.getByRole("heading", { name: "Smoother routines, thoughtfully planned." })).toBeVisible();
  await expect(page.getByText("Results vary.")).toBeVisible();
  await expect(page.getByText("Actual ESCLARE diode equipment")).toBeVisible();
});
