import { expect, test } from "@playwright/test";

test("@staff patient directory renders cards and table view", async ({ page }) => {
  await page.goto("/patients");

  await expect(page.getByRole("heading", { name: "Patient Directory" })).toBeVisible();
  await expect(page.getByText("ESC-P-0001")).toBeVisible();
  await expect(page.getByText("0917 *** 4567")).toBeVisible();

  await page.getByRole("button", { name: "Table view" }).click();
  await expect(page.getByRole("columnheader", { name: "Patient" })).toBeVisible();
});

test("@staff patient registration validates weak mobile input", async ({ page }) => {
  await page.goto("/patients/new");

  await expect(page.getByRole("heading", { name: "Add Patient" })).toBeVisible();
  await page.getByLabel("First name").fill("Test");
  await page.getByLabel("Last name").fill("Patient");
  await page.getByLabel("Date of birth").fill("1995-01-15");
  await page.getByLabel("Mobile", { exact: true }).first().fill("123");
  await page.getByLabel("Region").fill("Bicol Region");
  await page.getByLabel("Province").fill("Camarines Sur");
  await page.getByLabel("City or municipality").fill("Naga City");
  await page.getByLabel("Barangay").fill("Demo");
  await page.getByLabel("Name", { exact: true }).fill("Emergency Contact");
  await page.getByLabel("Relationship").fill("Sibling");
  await page.getByLabel("Mobile", { exact: true }).nth(1).fill("09181234567");
  await page.getByLabel("Privacy notice acknowledged").check();
  await page.getByRole("button", { name: "Create patient" }).click();

  await expect(page.getByText("Use a valid Philippine mobile number.")).toBeVisible();
});

test("@staff patient profile masks contact and hides full medical notes only when allowed", async ({
  page,
}) => {
  await page.goto("/patients/10000000-0000-4000-8000-000000000001");

  await expect(page.getByRole("heading", { name: /Liana/ })).toBeVisible();
  await expect(page.getByText("0917 *** 4567")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Medical Profile" })).toBeVisible();
  await expect(page.getByText("Fragrance sensitivity")).toBeVisible();
});
