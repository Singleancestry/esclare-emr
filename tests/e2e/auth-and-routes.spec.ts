import { expect, test } from "@playwright/test";

test("public home links to staff login", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Professional Aesthetic and Laser Clinic in Naga City and Daet",
    }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Staff access" }).click();
  await expect(page.getByRole("heading", { name: "Staff login" })).toBeVisible();
});

test("legacy home permanently redirects to the canonical root", async ({ request }) => {
  const response = await request.get("/home", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe("/");
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
  const mobile = (page.viewportSize()?.width ?? 1280) < 1024;
  const navigation = mobile
    ? page.getByRole("navigation", { name: "Mobile main" })
    : page.getByRole("navigation", { name: "Main" });

  if (mobile) await page.locator("header > div > details > summary").click();

  await expect(navigation.getByText("Patients", { exact: true })).toBeVisible();
  await expect(navigation.getByText("Appointments", { exact: true })).toBeVisible();
  await expect(navigation.getByText("Administration", { exact: true })).toHaveCount(0);
  await expect(navigation.getByText("Clinical Records", { exact: true })).toHaveCount(0);
  await expect(navigation.getByText("Point of Sale", { exact: true })).toHaveCount(0);
  await expect(navigation.getByText("CRM and Marketing", { exact: true })).toHaveCount(0);
});

test("@staff disabled staff modules reject direct navigation", async ({ page }) => {
  for (const path of [
    "/clinical",
    "/pos",
    "/packages",
    "/inventory",
    "/reports",
    "/marketing",
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "This page is not available." })).toBeVisible();
  }
});

test("@staff released staff routes resolve to their intended workspaces", async ({ page }) => {
  const routes = [
    ["/dashboard", "Clinic dashboard"],
    ["/patients", "Patient Directory"],
    ["/patients/new", "Add Patient"],
    ["/appointments", "Schedule & Requests"],
    ["/services", "Treatments and Services"],
    ["/settings/audit", "Audit Logs"],
  ] as const;

  for (const [path, heading] of routes) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }
});

test("@staff authorized patient profile exposes immutable activity history", async ({ page }) => {
  await page.goto("/patients/10000000-0000-4000-8000-000000000001");

  await expect(page.getByRole("heading", { name: "Patient activity" })).toBeVisible();
  await expect(page.getByText("patient view", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Recorded", { exact: true }).first()).toBeVisible();
});
