import { expect, test } from "@playwright/test";

test("public home uses authentic clinic, attendant, logo, and diode assets", async ({ page }) => {
  await page.goto("/home");
  await expect(
    page.getByRole("img", { name: "ESCLARE Naga logo wall and crystal chandelier" }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", {
      name: "ESCLARE 4D diode laser device visual in a prepared treatment room",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", {
      name: "ESCLARE clinic attendant in a professional muted light-maroon uniform",
    }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("link", { name: "ESCLARE home" })
      .getByRole("img", { name: "ESCLARE Aesthetic Center" }),
  ).toBeVisible();
});

test("gallery and diode pages expose accurate launch content", async ({ page }) => {
  await page.goto("/gallery");
  await expect(
    page.getByRole("heading", { name: "A real look inside both clinics." }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", {
      name: "ESCLARE Naga reception logo wall beneath a crystal chandelier",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", {
      name: "ESCLARE Daet reception with the illuminated ESCLARE wall sign",
    }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Open larger view of Daet reception, ESCLARE Daet" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Daet reception" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();

  await page.goto("/diode-laser");
  await expect(
    page.getByRole("heading", { name: "Smoother routines, thoughtfully planned." }),
  ).toBeVisible();
  await expect(page.getByText("Results vary.")).toBeVisible();
  await expect(page.getByText("4D diode technology")).toBeVisible();
});

test("Daet branch page uses authentic photography and accurate details", async ({ page }) => {
  await page.goto("/branches/daet");
  await expect(page.getByRole("heading", { name: "ESCLARE DAET", exact: true })).toBeVisible();
  await expect(
    page.getByRole("img", {
      name: "The authentic ESCLARE Daet reception with the illuminated ESCLARE wordmark",
    }),
  ).toBeVisible();
  await expect(page.getByText("Tuesday-Sunday, 9:30 AM-6:00 PM")).toBeVisible();
  await expect(page.getByText("All listed treatments except Fractional Laser.")).toBeVisible();
});

test("treatment gallery filters verified media and preserves booking selection", async ({
  page,
}) => {
  await page.goto("/home");
  await expect(
    page.getByRole("heading", { name: "A closer look, with clinical honesty." }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", {
      name: "Pico laser facial treatment visual with protective eyewear in a private treatment room",
    }),
  ).toBeVisible();

  await page.getByRole("tab", { name: "MCCM PDRN Glow" }).click();
  await expect(
    page.getByRole("img", {
      name: "MCCM PDRN professional-use vial and packaging on a neutral display",
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Open MCCM PDRN Glow image: MCCM PDRN professional formula" })
    .click();
  await expect(page.getByRole("dialog", { name: "MCCM PDRN Glow image viewer" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "MCCM PDRN Glow image viewer" })).toBeHidden();

  await page.getByRole("link", { name: "Book this treatment" }).click();
  await expect(page.getByRole("combobox", { name: "Treatment Optional" })).toHaveValue("mccm-pdrn");
});

test("premium homepage respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/home");
  const hero = page.locator(".cinematic-hero-image");
  await expect(hero).toBeVisible();
  await expect(hero).toHaveCSS("animation-duration", "1e-05s");
});
