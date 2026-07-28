import { expect, test } from "@playwright/test";
import type { BrowserContext } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";
const branchBPatientId = "10000000-0000-4000-8000-000000000002";
const branchAPatientId = "10000000-0000-4000-8000-000000000001";
const prohibitedPhi = [
  "Paolo",
  "Villanueva",
  "paolo.villanueva@example.test",
  "09181234567",
  "Hypertension",
];

async function useStaffScenario(
  context: BrowserContext,
  scenario: "branch-a" | "no-contact-reveal" | "disabled",
) {
  await context.addCookies([
    { name: "esclare-e2e-auth-scenario", value: scenario, url: baseURL, httpOnly: true },
  ]);
}

function expectNoPhi(body: string) {
  for (const value of prohibitedPhi) expect(body).not.toContain(value);
}

test("Branch-A staff cannot read a Branch-B patient or PHI", async ({ context }) => {
  await useStaffScenario(context, "branch-a");

  const response = await context.request.get(`/patients/${branchBPatientId}`);
  const body = await response.text();

  expect(response.status()).toBe(404);
  expectNoPhi(body);
});

test("staff without contact permission receives 403 without PHI", async ({ context }) => {
  await useStaffScenario(context, "no-contact-reveal");

  const response = await context.request.post(`/api/patients/${branchAPatientId}/reveal-contact`, {
    data: { reason: "Confirm appointment" },
  });
  const body = await response.text();

  expect(response.status()).toBe(403);
  expect(body).toContain("Forbidden");
  expectNoPhi(body);
  expect(body).not.toContain("Liana");
  expect(body).not.toContain("09171234567");
});

test("contact reveal rejects a whitespace reason without PHI", async ({ request }) => {
  const response = await request.post(`/api/patients/${branchAPatientId}/reveal-contact`, {
    data: { reason: "   " },
  });
  const body = await response.text();

  expect(response.status()).toBe(400);
  expect(body).toContain("A reveal reason is required.");
  expect(body).not.toContain("Liana");
  expect(body).not.toContain("09171234567");
});

test("feature-disabled staff surface returns 404 without patient data", async ({ request }) => {
  const response = await request.get("/clinical");
  const body = await response.text();

  expect(response.status()).toBe(404);
  expectNoPhi(body);
});

test("disabled staff are redirected to login without patient data", async ({ context, page }) => {
  await useStaffScenario(context, "disabled");

  await page.goto("/patients");
  const body = await page.locator("body").innerText();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Staff login" })).toBeVisible();
  expectNoPhi(body);
});
