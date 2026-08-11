"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import {
  OPEN_PRIVACY_SETTINGS_EVENT,
  PRIVACY_CONSENT_STORAGE_KEY,
  readPrivacyConsent,
  type PrivacyConsent,
} from "@/lib/privacy/consent";

function makeConsent(analytics: boolean, marketing: boolean): PrivacyConsent {
  return {
    version: 1,
    analytics,
    marketing,
    updatedAt: new Date().toISOString(),
  };
}

export function PrivacyConsentManager() {
  const [consent, setConsent] = useState<PrivacyConsent | null>(null);
  const [ready, setReady] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const stored = readPrivacyConsent();
      setConsent(stored);
      setAnalytics(stored?.analytics ?? false);
      setMarketing(stored?.marketing ?? false);
      setShowBanner(!stored);
      setReady(true);
    });

    const openSettings = () => {
      const current = readPrivacyConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      dialogRef.current?.showModal();
    };
    window.addEventListener(OPEN_PRIVACY_SETTINGS_EVENT, openSettings);
    return () => {
      active = false;
      window.removeEventListener(OPEN_PRIVACY_SETTINGS_EVENT, openSettings);
    };
  }, []);

  function save(next: PrivacyConsent) {
    try {
      window.localStorage.setItem(PRIVACY_CONSENT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Keep the user's choice for this page session when browser storage is unavailable.
    }
    setConsent(next);
    setAnalytics(next.analytics);
    setMarketing(next.marketing);
    setShowBanner(false);
    dialogRef.current?.close();
  }

  return (
    <>
      {ready && consent?.analytics && (
        <>
          <Script
            id="google-analytics-loader"
            src="https://www.googletagmanager.com/gtag/js?id=G-RS34GQW8W6"
            strategy="afterInteractive"
          />
          <Script id="google-analytics-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', 'G-RS34GQW8W6', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {ready && consent?.marketing && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2927430460923084');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {ready && showBanner && (
        <section
          aria-label="Privacy choices"
          className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-4xl rounded-lg border border-[#D8C9B4] bg-[#FFFDFC] p-5 shadow-[0_24px_70px_rgba(55,28,37,0.25)] sm:p-6"
        >
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-xl text-[#481827]">Your privacy choices</h2>
              <p className="mt-2 text-sm leading-6 text-[#62595C]">
                Essential storage keeps the website working. Analytics and marketing technologies
                are optional and remain off until you choose them. Read our{" "}
                <Link className="font-semibold underline" href="/cookies">
                  Cookie Notice
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:max-w-72 md:justify-end">
              <button
                type="button"
                className="min-h-11 rounded-sm border border-[#6F263D] px-4 text-sm font-bold text-[#6F263D]"
                onClick={() => save(makeConsent(false, false))}
              >
                Reject optional
              </button>
              <button
                type="button"
                className="min-h-11 rounded-sm border border-[#B98A4D] px-4 text-sm font-bold text-[#6F263D]"
                onClick={() => dialogRef.current?.showModal()}
              >
                Customize
              </button>
              <button
                type="button"
                className="min-h-11 rounded-sm bg-[#6F263D] px-4 text-sm font-bold text-white"
                onClick={() => save(makeConsent(true, true))}
              >
                Accept all
              </button>
            </div>
          </div>
        </section>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="privacy-settings-title"
        className="m-auto w-[min(92vw,36rem)] rounded-lg border border-[#D8C9B4] bg-[#FFFDFC] p-0 text-[#3F1724] shadow-[0_24px_80px_rgba(55,28,37,0.3)] backdrop:bg-[#2B1119]/60"
      >
        <div className="p-6 sm:p-8">
          <h2 id="privacy-settings-title" className="text-2xl">
            Customize privacy settings
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#62595C]">
            Optional technologies stay off unless you enable them. You can change these choices at
            any time from the website footer.
          </p>
          <div className="mt-6 divide-y divide-[#E8E0D7] border-y border-[#E8E0D7]">
            <div className="flex items-start justify-between gap-5 py-4">
              <div>
                <p className="font-bold">Essential</p>
                <p className="mt-1 text-sm text-[#62595C]">Required for security and core use.</p>
              </div>
              <span className="text-sm font-bold text-[#6F263D]">Always on</span>
            </div>
            <label className="flex cursor-pointer items-start justify-between gap-5 py-4">
              <span>
                <span className="block font-bold">Analytics</span>
                <span className="mt-1 block text-sm text-[#62595C]">
                  Helps ESCLARE understand general website usage without form-entered personal data.
                </span>
              </span>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
                className="mt-1 size-5 accent-[#6F263D]"
              />
            </label>
            <label className="flex cursor-pointer items-start justify-between gap-5 py-4">
              <span>
                <span className="block font-bold">Marketing</span>
                <span className="mt-1 block text-sm text-[#62595C]">
                  Allows Meta Pixel to measure advertising and page visits.
                </span>
              </span>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(event) => setMarketing(event.target.checked)}
                className="mt-1 size-5 accent-[#6F263D]"
              />
            </label>
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              className="min-h-11 rounded-sm border border-[#6F263D] px-4 text-sm font-bold text-[#6F263D]"
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </button>
            <button
              type="button"
              className="min-h-11 rounded-sm bg-[#6F263D] px-4 text-sm font-bold text-white"
              onClick={() => save(makeConsent(analytics, marketing))}
            >
              Save choices
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
