import { expect, test } from "@playwright/test";

test("public treatment catalog shows regular prices and doctor labels", async ({ page }) => {
  await page.goto("/treatments");
  await expect(
    page.getByRole("heading", { name: "Advanced care, selected for you." }),
  ).toBeVisible();
  const koreanFacial = page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "Korean Facial" }) });
  await expect(koreanFacial).toBeVisible();
  await expect(koreanFacial.getByText(/1,800 \/ session/)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "4D Wavelength Diode Laser Hair Removal" }),
  ).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "1 session" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "6 sessions" })).toBeVisible();
  const fullBeard = page
    .getByRole("row")
    .filter({ has: page.getByRole("rowheader", { name: /Full Beard/ }) });
  await expect(fullBeard).toContainText("₱1,800");
  await expect(fullBeard).toContainText("₱9,720");
  const fullLegs = page
    .getByRole("row")
    .filter({ has: page.getByRole("rowheader", { name: /Full Legs/ }) });
  await expect(fullLegs).toContainText("₱7,000");
  await expect(fullLegs).toContainText("₱37,800");
});

test("GLP-1 Slimming uses the approved four-week program terms", async ({ page }) => {
  await page.goto("/treatments/glp-1-slimming");

  await expect(page.getByRole("heading", { name: "GLP-1 Slimming" })).toBeVisible();
  await expect(
    page.getByText("Physician-supervised 4-week GLP-1 treatment program", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByText("Doctor consultation required")).toBeVisible();
  await expect(
    page.getByText(/does not promise a specific amount or rate of weight loss/i),
  ).toBeVisible();
  await expect(page.locator("body")).not.toContainText("₱21,599");
  await expect(page.locator("body")).not.toContainText("₱21,500");
  await expect(page.locator("body")).not.toContainText("one month");
});

test("dedicated GLP-1 page uses the supplied one-shot hero without CTA buttons", async ({
  page,
}) => {
  await page.goto("/glp-1-slimming");

  await expect(page.getByRole("heading", { name: "GLP-1 Slimming Program" })).toBeAttached();
  const hero = page.locator(".glp1-hero");
  await expect(hero.locator("video source")).toHaveAttribute(
    "src",
    "/media/glp-1-slimming-hero.mp4",
  );
  await expect(hero.getByRole("link")).toHaveCount(0);
  await expect(hero.getByRole("button")).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText("₱21,599");
  await expect(page.locator("body")).not.toContainText("₱21,500");
  await expect(page.locator("body")).not.toContainText("one month");
});

test("branch selection updates the persistent Messenger destination", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto("/");
  const messenger = page.getByRole("link", { name: "Chat with ESCLARE Naga on Messenger" });
  await expect(messenger).toHaveAttribute("href", "https://m.me/625552207599338");

  await page.getByRole("button", { name: /Naga/ }).click();
  await page.getByRole("option", { name: /ESCLARE Daet/ }).click();
  await expect(
    page.getByRole("link", { name: "Chat with ESCLARE Daet on Messenger" }),
  ).toHaveAttribute("href", "https://m.me/110985556908419");
  await page.goto("/glp-1-slimming");
  await expect(
    page.getByRole("link", { name: "Chat with ESCLARE Daet on Messenger" }),
  ).toHaveAttribute("href", "https://m.me/110985556908419");
});

test("MCCM Skin Support pages render without public administrative status wording", async ({
  page,
}) => {
  const slugs = ["mccm-exosome-pdrn", "mccm-eye-contour", "mccm-brightening-system"];

  for (const slug of slugs) {
    await page.goto(`/treatments/${slug}`);
    await expect(page.getByRole("heading", { name: /MCCM/i })).toBeVisible();
    await expect(page.locator("body")).not.toContainText(/review pending|regulatory status/i);
    await expect(page.getByRole("heading", { name: /safety and regulatory status/i })).toHaveCount(
      0,
    );
    await expect(page.locator("main").getByRole("link", { name: /request assessment/i })).toHaveCount(
      0,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/i);
  }

  for (const slug of ["rejuran-h", "rejuran-eye", "rejuran-scar"]) {
    const response = await page.goto(`/treatments/${slug}`);
    expect(response?.status()).toBe(404);
  }
});

test("Treatments navigation exposes categories while Skin Support owns product links", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto("/");
  const treatmentsMenu = page.locator("header details").filter({ hasText: "Treatments" });
  await treatmentsMenu.locator("summary").click();
  const expectedCategories = [
    "All Treatments",
    "Facial",
    "Laser Brightening / Laser Treatments",
    "4D Diode",
    "Lifting",
    "Doctor Procedures",
    "Wellness",
    "Skin Support",
  ];
  for (const category of expectedCategories) {
    await expect(treatmentsMenu.getByRole("link", { name: category, exact: true })).toBeVisible();
  }
  await expect(treatmentsMenu.getByRole("link", { name: /MCCM|Rejuran/ })).toHaveCount(0);

  await treatmentsMenu.getByRole("link", { name: "Skin Support", exact: true }).click();
  await expect(page).toHaveURL(/\/treatments\/skin-support$/);
  await expect(page.getByRole("heading", { name: "Professional skin support" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Rejuran/ })).toHaveCount(0);
  await expect(page.getByRole("article")).toHaveCount(3);
});

test("Skin Support product photos and nested aliases resolve correctly", async ({ page }) => {
  await page.goto("/treatments/skin-support");
  const expectedAltText = [
    "MCCM Exosome PDRN professional-use box and amber vial",
    "MCCM Out Contour Cocktail box and amber vial",
    "MCCM professional brightening peel product bottle",
  ];
  for (const alt of expectedAltText) {
    await expect(page.getByRole("img", { name: alt })).toBeVisible();
  }
});

test("mobile Treatments menu keeps the eight categories touch-friendly", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Site navigation" });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: "Skin Support", exact: true })).toBeVisible();
  await expect(menu.getByRole("link", { name: /MCCM|Rejuran/ })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await menu.getByRole("link", { name: "Skin Support", exact: true }).click();
  await expect(page).toHaveURL(/\/treatments\/skin-support$/);
});

test("package terms expose the current policy and printable acknowledgment", async ({ page }) => {
  await page.goto("/package-terms");
  await expect(
    page.getByRole("heading", { name: "Treatment Package Terms and Conditions" }),
  ).toBeVisible();
  await expect(page.getByText("Package policy · 2026-07-29")).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/preview policy|awaiting.*legal review/i);
  await expect(page.getByRole("heading", { name: "Package acknowledgment" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Print or save as PDF" })).toBeVisible();
});
