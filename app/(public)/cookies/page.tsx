import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Notice",
  description: "How ESCLARE uses essential, analytics, and marketing technologies.",
  alternates: { canonical: "/cookies" },
};

export default function CookieNoticePage() {
  return (
    <main>
      <section className="bg-[#EEE6DA] py-16">
        <div className="public-container max-w-4xl">
          <p className="public-eyebrow">Legal</p>
          <h1 className="public-heading mt-4">Cookie notice</h1>
          <p className="mt-5 text-sm text-[#6B6264]">Effective August 2026</p>
        </div>
      </section>
      <article className="public-container max-w-4xl space-y-9 py-16 text-sm leading-7 text-[#5F575A]">
        <section>
          <h2 className="text-2xl text-[#481827]">Essential technology</h2>
          <p className="mt-3">
            ESCLARE uses limited first-party storage for security, website operation, branch
            preference, and your privacy choices. Essential website use remains available when you
            reject optional technologies.
          </p>
        </section>
        <section>
          <h2 className="text-2xl text-[#481827]">Optional analytics</h2>
          <p className="mt-3">
            With your permission, Google Analytics helps ESCLARE understand general page and
            navigation usage. ESCLARE does not intentionally send names, phone numbers, email
            addresses, appointment notes, or medical details in its analytics events.
          </p>
        </section>
        <section>
          <h2 className="text-2xl text-[#481827]">Optional marketing</h2>
          <p className="mt-3">
            With your permission, Meta Pixel may measure page visits and advertising performance. It
            remains off unless marketing consent is enabled.
          </p>
        </section>
        <section>
          <h2 className="text-2xl text-[#481827]">Change your choices</h2>
          <p className="mt-3">
            Use the Cookie settings control in the footer at any time to accept, reject, or
            customize optional technologies. Clearing browser storage may reset the choice and show
            the privacy prompt again.
          </p>
        </section>
      </article>
    </main>
  );
}
