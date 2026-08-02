import { expect, test } from "@playwright/test";

test("root is the single canonical homepage", async ({ page, request }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Professional Aesthetic and Laser Clinic in Naga City and Daet",
    }),
  ).toBeVisible();
  await expect(page.locator("h1")).toHaveCount(1);
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(new URL(canonical!).pathname).toBe("/");

  const legacy = await request.get("/home", { maxRedirects: 0 });
  expect(legacy.status()).toBe(308);
  expect(legacy.headers().location).toBe("/");
});

test("sitemap includes the root and excludes the legacy homepage", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBe(true);
  const sitemap = await response.text();

  expect(sitemap).toMatch(/<loc>[^<]+\/<\/loc>/);
  expect(sitemap).not.toContain("/home</loc>");
  expect(sitemap).not.toContain("/dashboard</loc>");
  expect(sitemap).not.toContain("/patients</loc>");
});

test("Google Analytics initializes once per page", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(
    page.locator('script[src*="googletagmanager.com/gtag/js?id=G-RS34GQW8W6"]'),
  ).toHaveCount(1);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const analyticsWindow = window as Window & {
          dataLayer?: ArrayLike<unknown>[];
          gtag?: (...args: unknown[]) => void;
        };
        const configEvents = Array.from(analyticsWindow.dataLayer ?? []).filter(
          (entry) => entry?.[0] === "config" && entry?.[1] === "G-RS34GQW8W6",
        );
        return { hasGtag: typeof analyticsWindow.gtag === "function", config: configEvents.length };
      }),
    )
    .toEqual({ hasGtag: true, config: 1 });
});

test("booking analytics excludes entered personal information", async ({ page }) => {
  await page.goto("/appointment-request");
  await page.getByLabel("Full name").fill("Reagan Test");
  await page.getByLabel("Treatment").selectOption({ index: 1 });

  const serialized = await page.evaluate(() => {
    const analyticsWindow = window as Window & { dataLayer?: unknown[] };
    const allowedEvents = new Set(["booking_form_started", "treatment_selected"]);
    const publicEvents = (analyticsWindow.dataLayer ?? [])
      .filter((entry): entry is Record<string, unknown> =>
        Boolean(
          entry &&
          typeof entry === "object" &&
          "event" in entry &&
          allowedEvents.has(String((entry as Record<string, unknown>).event)),
        ),
      )
      .map((entry) => ({
        event: entry.event,
        branch: entry.branch,
        treatment: entry.treatment,
      }));
    return JSON.stringify(publicEvents);
  });
  expect(serialized).toContain("booking_form_started");
  expect(serialized).toContain("treatment_selected");
  expect(serialized).not.toContain("Reagan Test");
});

test("branches page has one local-search heading", async ({ page }) => {
  await page.goto("/branches");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "Visit ESCLARE in Naga City or Daet" }),
  ).toBeVisible();
});
