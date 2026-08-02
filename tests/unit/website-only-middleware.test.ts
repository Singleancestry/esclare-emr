import { afterEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

const originalWebsiteOnly = process.env.PUBLIC_WEBSITE_ONLY;

afterEach(() => {
  if (originalWebsiteOnly === undefined) delete process.env.PUBLIC_WEBSITE_ONLY;
  else process.env.PUBLIC_WEBSITE_ONLY = originalWebsiteOnly;
});

describe("website-only deployment boundary", () => {
  it.each(["/login", "/dashboard", "/patients", "/settings/audit", "/auth/callback"])(
    "returns 404 for %s",
    async (pathname) => {
      process.env.PUBLIC_WEBSITE_ONLY = "true";

      const response = await middleware(new NextRequest(`https://esclareph.com${pathname}`));

      expect(response.status).toBe(404);
      expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow, noarchive");
      await expect(response.text()).resolves.toBe("Not Found");
    },
  );

  it.each(["/", "/treatments", "/appointment-request", "/skin-education"])(
    "allows public route %s without initializing an EMR session",
    async (pathname) => {
      process.env.PUBLIC_WEBSITE_ONLY = "true";

      const response = await middleware(new NextRequest(`https://esclareph.com${pathname}`));

      expect(response.status).toBe(200);
    },
  );
});
