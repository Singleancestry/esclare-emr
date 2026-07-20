import { expect, test } from "@playwright/test";

test("public booking prepares a request with only full name required", async ({ page }) => {
  await page.goto("/appointment-request");
  await page.getByRole("button", { name: "Prepare request" }).click();
  await expect(page.locator("#booking-error")).toHaveText("Please enter your full name.");
  await page.getByLabel("Full name Required").fill("Sample Client");
  await page.getByRole("button", { name: "Prepare request" }).click();
  await expect(page.getByText("Request ready")).toBeVisible();
  await expect(page.getByText(/My name is Sample Client/)).toBeVisible();
  await expect(page.getByText(/Online saving is not configured yet/)).toBeVisible();
  await expect(page.getByText("No deposit is required.")).toBeVisible();
});

test("@staff development appointment inbox is protected and reports persistence state", async ({
  page,
}) => {
  await page.goto("/appointments");
  await expect(page.getByRole("heading", { name: "Public Request Inbox" })).toBeVisible();
  await expect(
    page.getByText(/Supabase is not configured in this local environment/),
  ).toBeVisible();
  await expect(page.getByText("No appointment requests")).toBeVisible();
});

test("branch page shows confirmed details and Daet exception", async ({ page }) => {
  await page.goto("/branches");
  await expect(page.getByRole("heading", { name: "ESCLARE Naga" })).toBeVisible();
  await expect(
    page.getByRole("main").getByRole("link", { name: "+63 920 735 1379" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "ESCLARE Daet" })).toBeVisible();
  await expect(page.getByText(/except Fractional Laser/)).toBeVisible();
});

test("Daet branch links preserve the selected booking branch", async ({ page }) => {
  await page.goto("/appointment-request?branch=daet");
  await expect(page.getByRole("combobox", { name: "Branch" })).toHaveValue("daet");
  await expect(page.getByRole("heading", { name: "Confirm with ESCLARE Daet" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Call 0939 142 1928" })).toHaveAttribute(
    "href",
    "tel:+639391421928",
  );
});
