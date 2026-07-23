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
  await expect(page.getByRole("heading", { name: "4D Diode packages" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "6 sessions" })).toBeVisible();
});

test("GLP-1 Slimming uses the approved four-week program terms", async ({ page }) => {
  await page.goto("/treatments/glp-1-slimming");

  await expect(page.getByRole("heading", { name: "GLP-1 Slimming" })).toBeVisible();
  await expect(
    page.getByText("GLP-1 Slimming — ₱21,500 for a 4-week treatment program", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByText("Doctor consultation required")).toBeVisible();
  await expect(
    page.getByText(/does not promise a specific amount or rate of weight loss/i),
  ).toBeVisible();
  await expect(page.locator("body")).not.toContainText("₱21,599");
  await expect(page.locator("body")).not.toContainText("one month");
});

test("dedicated GLP-1 page uses the supplied one-shot hero without CTA buttons", async ({
  page,
}) => {
  await page.goto("/glp-1-slimming");

  await expect(page.getByRole("heading", { name: "GLP-1 Slimming Program" })).toBeAttached();
  await expect(
    page
      .locator(".glp1-hero + section")
      .getByText("GLP-1 Slimming — ₱21,500 for a 4-week treatment program", { exact: true }),
  ).toBeVisible();
  const hero = page.locator(".glp1-hero");
  await expect(hero.locator("video source")).toHaveAttribute(
    "src",
    "/media/glp-1-slimming-hero.mp4",
  );
  await expect(hero.getByRole("link")).toHaveCount(0);
  await expect(hero.getByRole("button")).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText("₱21,599");
  await expect(page.locator("body")).not.toContainText("one month");
});

test("branch selection updates the persistent Messenger destination", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto("/home");
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
