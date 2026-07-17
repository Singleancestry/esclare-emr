import { expect, test } from "@playwright/test";

test("FAQ search, categories, and accordion remain accessible", async ({ page }) => {
  await page.goto("/faq");
  await expect(
    page.getByRole("heading", { name: "Aesthetic treatment questions, answered honestly." }),
  ).toBeVisible();

  const search = page.getByRole("searchbox", { name: "Search frequently asked questions" });
  await search.fill("diode");
  await expect(
    page.getByRole("button", { name: "How many diode sessions will I need?" }),
  ).toBeVisible();

  await search.clear();
  await page.getByRole("button", { name: "HIFU & Doctor-Led" }).click();
  const firstQuestion = page.getByRole("button", {
    name: "Who performs injectable and thread treatments?",
  });
  await firstQuestion.click();
  await expect(firstQuestion).toHaveAttribute("aria-expanded", "true");

  const secondQuestion = page.getByRole("button", {
    name: "Are all anti-wrinkle injections Botox?",
  });
  await secondQuestion.click();
  await expect(firstQuestion).toHaveAttribute("aria-expanded", "false");
  await expect(secondQuestion).toHaveAttribute("aria-expanded", "true");
});
