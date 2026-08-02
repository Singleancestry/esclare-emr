"use client";

import Script from "next/script";

export function TurnstileField() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;

  return (
    <div className="mt-4 min-h-[65px]" aria-label="Security verification">
      <Script
        id="cloudflare-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <div
        className="cf-turnstile"
        data-sitekey={siteKey}
        data-theme="light"
        data-retry="auto"
        data-refresh-expired="auto"
      />
    </div>
  );
}
