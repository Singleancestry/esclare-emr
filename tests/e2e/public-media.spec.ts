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
  const hero = page.locator(".hero-media");
  await expect(hero.locator(".hero-media-poster img")).toBeVisible();
  await expect(hero).toHaveAttribute("data-playback-state", "poster");
  await expect(hero.locator("video source")).toHaveCount(0);
});

test("hero retains its poster and actions when video playback fails", async ({
  page,
  browserName,
}) => {
  if (browserName !== "webkit") {
    await page.route("**/media/esclare-hero-no-logo-v4.mp4*", (route) =>
      route.fulfill({ status: 503, contentType: "video/mp4", body: "" }),
    );
  }
  await page.goto("/home");

  const hero = page.locator(".hero-media");
  const heroStage = page.locator(".hero-stage");
  if (browserName === "webkit") {
    await expect(hero).toHaveAttribute("data-playback-state", /playing|complete/);
    await hero.locator("video").evaluate((video: HTMLVideoElement) => {
      video.pause();
      video.querySelectorAll("source").forEach((source) => source.remove());
      video.src = "/media/forced-missing-video.mp4";
      video.load();
    });
  }
  await expect(hero.locator(".hero-media-poster img")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Reveal Your Most Radiant Self/ })).toBeVisible();
  await expect(heroStage.getByRole("link", { name: "Explore treatments" })).toBeVisible();
  await expect(heroStage.getByRole("link", { name: "Book a consultation" })).toBeVisible();
  await expect(hero).toHaveAttribute("data-playback-state", "fallback");
});

test("hero remains usable after route navigation on a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/home");
  await expect(page.locator(".hero-media-poster img")).toBeVisible();
  await page.goto("/treatments");
  await page.goBack();

  await expect(page.getByRole("heading", { name: /Reveal Your Most Radiant Self/ })).toBeVisible();
  await expect(
    page.locator(".hero-stage").getByRole("link", { name: "Book a consultation" }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test("hero completion exposes the pre-generated final frame without restarting", async ({
  page,
}) => {
  await page.goto("/home");
  const hero = page.locator(".hero-media");
  const video = hero.locator("video");

  await expect(video.locator("source")).toHaveCount(1);
  await video.evaluate((element: HTMLVideoElement) => {
    element.dispatchEvent(new Event("ended"));
  });

  await expect(hero).toHaveAttribute("data-playback-state", "complete");
  await expect(video).not.toHaveClass(/is-visible/);
  await expect(hero.locator(".hero-media-poster img")).toHaveAttribute(
    "src",
    "/images/optimized/clinic/esclare-hero-final-frame-v4.webp",
  );
});
