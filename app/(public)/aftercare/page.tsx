import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Droplets, ShieldCheck, Sparkles, Sun, TriangleAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Treatment Aftercare Guide",
  description:
    "Review general ESCLARE aftercare guidance for laser, facial, HIFU, and doctor-led aesthetic treatments. Your provider's instructions always take priority.",
  alternates: { canonical: "/aftercare" },
};

const priorities = [
  {
    icon: ShieldCheck,
    title: "Follow your care plan",
    copy: "Use the instructions provided after your appointment. They are tailored to your treatment and take priority over this general guide.",
  },
  {
    icon: Sun,
    title: "Protect treated skin",
    copy: "Limit direct sun exposure and use the sun protection recommended by your provider, especially after light, laser, or resurfacing care.",
  },
  {
    icon: Droplets,
    title: "Keep the routine gentle",
    copy: "Avoid rubbing, picking, heat, and strong active products until your provider says they can be resumed.",
  },
] as const;

const guides = [
  {
    title: "Laser and light treatments",
    intro: "For Pico Laser, 4D Diode Laser, and other energy-based services.",
    items: [
      "Keep the area clean and avoid unnecessary friction.",
      "Avoid excessive heat, strenuous activity, and direct sun for the period advised by your provider.",
      "Do not pick at dryness or flaking. Resume exfoliants and active skincare only when cleared.",
    ],
  },
  {
    title: "Facials, peels, and skin renewal",
    intro: "For MCCM protocols and professional facial treatments.",
    items: [
      "If instructed, leave applied products undisturbed for the recommended time.",
      "Use a gentle cleanser, simple moisturizer, and appropriate daily sun protection.",
      "Pause retinoids, exfoliating acids, scrubs, and other potentially irritating products as directed.",
    ],
  },
  {
    title: "HIFU and non-invasive contouring",
    intro: "For ultrasound and non-invasive firming treatments.",
    items: [
      "Treat the area gently and maintain your usual hydration.",
      "Follow any instructions about exercise, heat, massage, or additional treatments.",
      "Contact the clinic if discomfort or swelling is persistent, severe, or worsening.",
    ],
  },
  {
    title: "Doctor-led treatments",
    intro: "For injectables, threads, and other doctor-required procedures.",
    items: [
      "Follow the doctor's activity, positioning, skincare, and medication guidance exactly.",
      "Do not press, massage, or manipulate treated areas unless specifically instructed.",
      "Attend any recommended review and contact the clinic promptly about unexpected symptoms.",
    ],
  },
] as const;

export default function AftercarePage() {
  return (
    <main className="bg-[#FAF4EC] text-[#43201E]">
      <section className="paper-texture border-b border-[#D6B078]/45">
        <div className="public-container py-20 text-center sm:py-28">
          <p className="public-eyebrow">Treatment guidance</p>
          <h1 className="mx-auto mt-5 max-w-4xl font-serif text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02]">
            Aftercare that protects your results.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#6B514B] sm:text-lg">
            Good aftercare is part of every treatment. Use this page as a general reference, and
            always follow the personalized instructions given by your ESCLARE provider.
          </p>
          <div className="editorial-rule mx-auto mt-10" />
        </div>
      </section>

      <section className="editorial-section">
        <div className="public-container">
          <div className="grid gap-5 md:grid-cols-3">
            {priorities.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="editorial-card p-7 sm:p-8">
                <span className="grid size-11 place-items-center rounded-full border border-[#D6B078] bg-[#F4E8DA] text-[#8B3F48]">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h2 className="mt-6 font-serif text-2xl">{title}</h2>
                <p className="mt-3 leading-7 text-[#6B514B]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section bg-[#F4E8DA]">
        <div className="public-container">
          <div className="max-w-3xl">
            <p className="public-eyebrow">By treatment type</p>
            <h2 className="public-subheading mt-5">A gentle guide for the days after treatment.</h2>
            <p className="mt-6 leading-8 text-[#6B514B]">
              Timelines vary by treatment, skin response, and clinical plan. When your written or
              verbal instructions differ from the guidance below, follow your provider&apos;s
              directions.
            </p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {guides.map((guide, index) => (
              <article key={guide.title} className="editorial-card p-7 sm:p-9">
                <div className="flex items-start gap-4">
                  <span className="font-serif text-2xl text-[#B98A4D]">0{index + 1}</span>
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl">{guide.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#8B3F48]">{guide.intro}</p>
                  </div>
                </div>
                <ul className="mt-7 space-y-4">
                  {guide.items.map((item) => (
                    <li key={item} className="flex gap-3 leading-7 text-[#6B514B]">
                      <Sparkles
                        className="mt-1 shrink-0 text-[#B98A4D]"
                        size={16}
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section bg-[#FAF4EC]">
        <div className="public-container grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#8B3F48]">
              <TriangleAlert size={18} aria-hidden="true" /> When to contact the clinic
            </p>
            <h2 className="mt-4 font-serif text-[clamp(2rem,4vw,3.5rem)] leading-tight">
              Please do not wait if something feels wrong.
            </h2>
            <p className="mt-5 leading-8 text-[#6B514B]">
              Contact your branch promptly for severe or worsening pain, blistering, significant
              swelling, signs of infection, or another reaction that concerns you. Seek urgent
              medical help for breathing difficulty or other severe acute symptoms.
            </p>
          </div>
          <Link href="/contact" className="luxury-button">
            Contact ESCLARE <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="bg-[#3B0D14] py-16 text-white sm:py-20">
        <div className="public-container flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="public-eyebrow text-[#D6B078]">Personalized support</p>
            <h2 className="mt-4 max-w-2xl font-serif text-[clamp(2.25rem,4.5vw,4rem)] leading-[1.08]">
              Your care continues after the appointment.
            </h2>
          </div>
          <Link href="/appointment-request" className="luxury-button-light shrink-0">
            Request a consultation <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
