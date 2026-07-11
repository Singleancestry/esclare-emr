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

test("development dashboard shell renders protected staff navigation", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByLabel("Active branch")).toBeVisible();
  await expect(page.getByLabel("Global patient search")).toBeVisible();
  await expect(page.getByRole("link", { name: "Administration" })).toBeVisible();
});
