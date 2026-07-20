import { expect, test } from "@playwright/test";

test("public home links to staff login", async ({ page }) => {
  await page.goto("/home");

  await expect(page.getByRole("heading", { name: "ESCLARE" })).toBeVisible();
  await page.getByRole("link", { name: "Staff access" }).click();
  await expect(page.getByRole("heading", { name: "Staff login" })).toBeVisible();
});

test("login validates weak credentials", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Email").fill("owner.demo@esclare.local");
  await page.getByRole("textbox", { name: "Password" }).fill("weak");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("Password must be at least 12 characters.")).toBeVisible();
});

test("@staff development staff shell exposes only working or pilot navigation", async ({
  page,
}) => {
  await page.goto("/services");

  await expect(page.getByRole("heading", { name: "Treatments and Services" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Patients", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Appointments", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Administration" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Clinical Records" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Point of Sale" })).toHaveCount(0);
});

test("@staff disabled staff modules reject direct navigation", async ({ page }) => {
  for (const path of ["/dashboard", "/clinical", "/pos", "/packages", "/inventory", "/reports"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "This page is not available." })).toBeVisible();
  }
});
