import type { Metadata, Route } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  HeartPulse,
  MapPin,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { AuthenticHero } from "@/components/public/authentic-hero";
import { TreatmentGallery } from "@/components/public/treatment-gallery";
import {
  attendantPortrait,
  branchHeroImages,
  diodeMachine,
  nagaClinicGallery,
} from "@/lib/clinic/media";

export const metadata: Metadata = {
  title: "Aesthetic & Wellness Clinic in Naga and Daet",
  description:
    "Discover personalized aesthetic, laser, and wellness care at ESCLARE Naga and Daet. Explore treatments and request a consultation with no booking deposit.",
  alternates: { canonical: "/home" },
};

const signatureTreatments = [
  {
    name: "GLP-1 Weight Management",
    category: "Medically guided wellness",
    description:
      "A clinician-led pathway built around assessment, appropriate monitoring, and individual goals.",
    benefits: ["Clinical assessment", "Individual follow-up"],
    href: "/treatments#wellness",
    bookingSlug: "",
    image: null,
    alt: "",
  },
  {
    name: "Pico Laser",
    category: "Laser skin treatment",
    description:
      "A consultation-led laser treatment for selected tone, texture, and pigmentation concerns.",
    benefits: ["Tone and texture", "Individual settings"],
    href: "/treatments#laser-and-brightening",
    bookingSlug: "pico-glow-face",
    image: "/images/optimized/treatments/pico-face/pico-face-treatment.webp",
    alt: "ESCLARE Pico laser facial treatment",
  },
  {
    name: "Diode Laser Hair Removal",
    category: "Laser hair reduction",
    description:
      "Cooling-supported laser care for progressive hair reduction across suitable treatment areas.",
    benefits: ["Cooling support", "Area-specific plans"],
    href: "/diode-laser",
    bookingSlug: "",
    image: "/images/optimized/treatments/diode/diode-underarm-treatment.webp",
    alt: "ESCLARE 4D diode laser hair removal treatment",
  },
  {
    name: "HIFU",
    category: "Non-surgical lifting",
    description:
      "Focused ultrasound treatment planned around suitable facial and contouring concerns.",
    benefits: ["Focused ultrasound", "Personalized treatment"],
    href: "/treatments#lifting-and-contouring",
    bookingSlug: "7d-hifu-face",
    image: "/images/optimized/treatments/hifu/hifu-face-treatment.webp",
    alt: "ESCLARE HIFU face treatment",
  },
  {
    name: "Botox Injections",
    category: "Doctor-led injectable",
    description:
      "A doctor-assessed treatment for selected dynamic lines, with suitability and consent reviewed first.",
    benefits: ["Doctor assessment", "Natural-looking goals"],
    href: "/treatments#doctor-procedures",
    bookingSlug: "fine-lines",
    image: "/images/optimized/treatments/doctor/anti-wrinkle/anti-wrinkle-treatment.webp",
    alt: "ESCLARE doctor performing an anti-wrinkle injectable treatment",
  },
] as const;

const process = [
  ["01", "Request", "Choose your branch, preferred treatment, date, and time."],
  ["02", "Confirm", "The team checks staff, doctor, room, and equipment availability."],
  ["03", "Assess", "Your provider reviews suitability, goals, and expected outcomes."],
  ["04", "Care", "Receive clear guidance, treatment, and appropriate aftercare."],
] as const;

const faqPreview = [
  [
    "Do I need a deposit to book?",
    "No. ESCLARE does not require a booking deposit. Your request is confirmed directly by the selected branch.",
  ],
  [
    "Are all treatments available at both branches?",
    "Naga offers all listed treatments subject to staff or doctor availability. Daet offers all except Fractional Laser.",
  ],
  [
    "How early should I reschedule?",
    "Please contact the branch at least two hours before your appointment when cancelling or rescheduling.",
  ],
] as const;

export default function PublicHomePage() {
  return (
    <main>
      <AuthenticHero />

      <section className="editorial-section bg-[#F4E8DA]">
        <div className="public-container">
          <div className="text-center" data-reveal>
            <h2 className="public-subheading">Our Signature Treatments</h2>
            <div className="editorial-rule mx-auto mt-6" />
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {signatureTreatments.map((treatment, index) => {
              const bookingHref = treatment.bookingSlug
                ? `/appointment-request?treatment=${treatment.bookingSlug}`
                : "/appointment-request";

              return (
                <article
                  key={treatment.name}
                  className="signature-treatment-card editorial-card group overflow-hidden"
                  data-reveal
                >
                  {treatment.image ? (
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={treatment.image}
                        alt={treatment.alt}
                        fill
                        sizes="(min-width: 1280px) 18vw, (min-width: 768px) 45vw, 92vw"
                        className="object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
                      />
                    </div>
                  ) : (
                    <div
                      className="signature-treatment-placeholder aspect-[4/5]"
                      aria-hidden="true"
                    >
                      <HeartPulse size={46} strokeWidth={1.25} />
                      <span>Clinician-led wellness</span>
                    </div>
                  )}
                  <div className="relative flex flex-1 flex-col p-5 pt-7">
                    <span className="absolute right-5 top-0 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-[#D6B078] bg-[#FAF4EC] font-serif text-sm text-[#8B3F48]">
                      0{index + 1}
                    </span>
                    <p className="public-eyebrow pr-10">{treatment.category}</p>
                    <h3 className="metallic-maroon-text mt-3 font-serif text-[1.65rem] leading-tight">
                      {treatment.name}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-[#6B514B]">{treatment.description}</p>
                    <div className="mt-5 space-y-2">
                      {treatment.benefits.map((benefit) => (
                        <p key={benefit} className="flex items-center gap-2 text-sm text-[#43201E]">
                          <Check size={15} className="shrink-0 text-[#B98A4D]" />
                          {benefit}
                        </p>
                      ))}
                    </div>
                    <div className="mt-auto grid gap-3 pt-7">
                      <Link href={treatment.href as Route} className="signature-text-link">
                        Learn more <ArrowRight size={15} />
                      </Link>
                      <Link
                        href={bookingHref as Route}
                        className="luxury-button justify-center px-4 py-3 text-xs"
                      >
                        Book or inquire
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link href="/treatments" className="luxury-button">
              Explore all treatments <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="editorial-section bg-white" aria-labelledby="authentic-care-heading">
        <div className="public-container">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div data-reveal>
              <p className="public-eyebrow">Inside ESCLARE</p>
              <h2 id="authentic-care-heading" className="public-subheading mt-4">
                Real spaces, trusted technology, attentive care.
              </h2>
            </div>
            <p className="max-w-2xl leading-8 text-[#6B514B]" data-reveal="right">
              Step inside our Naga clinic and meet the setting, equipment, and people behind each
              carefully planned visit.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-[1.15fr_0.85fr_0.85fr]">
            <figure
              className="editorial-image group relative aspect-[4/3] overflow-hidden md:col-span-2 lg:col-span-1 lg:aspect-[4/5]"
              data-reveal
            >
              <Image
                src={nagaClinicGallery[0].src}
                alt="ESCLARE Naga logo wall and crystal chandelier"
                fill
                sizes="(min-width: 1024px) 38vw, 92vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
              />
            </figure>
            <figure
              className="editorial-image group relative aspect-[4/5] overflow-hidden"
              data-reveal
            >
              <Image
                src={diodeMachine.src}
                alt={diodeMachine.alt}
                fill
                sizes="(min-width: 1024px) 27vw, 45vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
              />
            </figure>
            <figure
              className="editorial-image group relative aspect-[4/5] overflow-hidden"
              data-reveal
            >
              <Image
                src={attendantPortrait.src}
                alt={attendantPortrait.alt}
                fill
                sizes="(min-width: 1024px) 27vw, 45vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
              />
            </figure>
          </div>
        </div>
      </section>

      <TreatmentGallery />

      <section className="editorial-section paper-texture">
        <div className="public-container text-center" data-reveal>
          <p className="public-eyebrow">Personalized aesthetic care</p>
          <div className="editorial-rule mx-auto mt-6" />
          <h2 className="mx-auto mt-8 max-w-4xl font-serif text-[clamp(2.15rem,4.4vw,4rem)] leading-[1.18] text-[#43201E]">
            Modern technology meets thoughtful care, designed for your most confident self.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl leading-8 text-[#6B514B]">
            At ESCLARE, every treatment begins with careful listening. We combine experienced care,
            suitable technology, and honest guidance around your individual goals.
          </p>
        </div>
      </section>

      <section className="editorial-section bg-[#FAF4EC]">
        <div className="public-container grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div className="grid grid-cols-2 gap-4" data-reveal="left">
            <div className="editorial-image relative mt-12 aspect-[4/5]">
              <Image
                src="/images/optimized/treatments/devices/diode-4d/diode-4d-device.webp"
                alt="ESCLARE 4D diode laser device"
                fill
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="editorial-image relative aspect-[4/5]">
              <Image
                src="/images/optimized/treatments/devices/hifu/hifu-device.webp"
                alt="ESCLARE HIFU device"
                fill
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
          <div data-reveal="right">
            <p className="public-eyebrow">Technology with purpose</p>
            <h2 className="public-subheading mt-5">
              Advanced equipment, guided by considered care.
            </h2>
            <p className="mt-7 max-w-xl leading-8 text-[#6B514B]">
              Technology is only one part of a good treatment. ESCLARE pairs professional aesthetic
              platforms with individualized settings, appropriate intervals, and realistic
              expectations.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Individual assessment",
                "Clear treatment pathways",
                "Cooling-supported laser care",
                "Honest outcome guidance",
              ].map((item) => (
                <p
                  key={item}
                  className="flex items-center gap-3 border-t border-[#D6B078]/55 pt-4 text-sm text-[#43201E]"
                >
                  <Check size={16} className="text-[#B98A4D]" />
                  {item}
                </p>
              ))}
            </div>
            <Link href="/treatments" className="luxury-button-outline mt-9">
              Explore our technology <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#3B0D14] text-white">
        <div className="public-container grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="py-16 lg:py-24 lg:pr-16" data-reveal="left">
            <p className="public-eyebrow text-[#D6B078]">Doctor-led aesthetic care</p>
            <h2 className="mt-5 font-serif text-[clamp(2.25rem,4.5vw,4.25rem)] leading-[1.08]">
              Thoughtful decisions. Natural-looking results.
            </h2>
            <p className="mt-7 max-w-xl leading-8 text-[#EADDD3]">
              Doctor-required services follow an appropriate consultation and clinical pathway.
              Suitability, consent, expected results, and aftercare are discussed before treatment.
            </p>
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-[#F4E8DA]">
              <span className="inline-flex items-center gap-2">
                <Stethoscope size={17} className="text-[#D6B078]" /> Doctor assessment
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={17} className="text-[#D6B078]" /> Safety-led process
              </span>
            </div>
            <Link href="/appointment-request" className="luxury-button-light mt-9">
              Request a consultation
            </Link>
          </div>
          <div className="relative min-h-[560px] lg:min-h-[700px]" data-reveal="right">
            <Image
              src="/images/optimized/treatments/doctor/anti-wrinkle/anti-wrinkle-treatment.webp"
              alt="ESCLARE doctor performing an aesthetic consultation treatment"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="editorial-section bg-white">
        <div className="public-container">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div data-reveal>
              <p className="public-eyebrow">Your ESCLARE visit</p>
              <h2 className="public-subheading mt-4">Care, made clear.</h2>
            </div>
            <p className="max-w-2xl leading-8 text-[#6B514B]" data-reveal="right">
              Appointment requests remain pending until your selected branch confirms availability.
              No deposit is required.
            </p>
          </div>
          <div className="mt-12 grid border-y border-[#D6B078]/55 md:grid-cols-4">
            {process.map(([number, title, copy], index) => (
              <article
                key={number}
                className={`py-8 md:px-7 ${index > 0 ? "border-t border-[#D6B078]/55 md:border-l md:border-t-0" : ""}`}
                data-reveal
              >
                <p className="font-serif text-4xl text-[#B98A4D]">{number}</p>
                <h3 className="mt-6 text-2xl text-[#59141D]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#6B514B]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section bg-[#F4E8DA]">
        <div className="public-container">
          <div className="text-center" data-reveal>
            <p className="public-eyebrow">Visit ESCLARE</p>
            <h2 className="public-subheading mt-4">Two branches, one standard of care.</h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {[
              {
                name: "Naga City",
                image: branchHeroImages.naga,
                href: "/branches",
                detail: "Daily, 10:00 AM-7:00 PM",
              },
              {
                name: "Daet",
                image: branchHeroImages.daet,
                href: "/branches/daet",
                detail: "Tuesday-Sunday, 9:30 AM-6:00 PM",
              },
            ].map((branch) => (
              <Link
                href={branch.href as Route}
                key={branch.name}
                className="editorial-card group overflow-hidden"
                data-reveal
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={branch.image}
                    alt={`ESCLARE ${branch.name} clinic interior`}
                    fill
                    sizes="(min-width: 1024px) 46vw, 92vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.035]"
                  />
                </div>
                <div className="flex items-center justify-between gap-5 p-6">
                  <div>
                    <p className="public-eyebrow">ESCLARE branch</p>
                    <h3 className="mt-2 text-3xl text-[#59141D]">{branch.name}</h3>
                    <p className="mt-2 text-sm text-[#6B514B]">{branch.detail}</p>
                  </div>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-[#D6B078] text-[#59141D]">
                    <ArrowRight size={17} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section bg-[#FAF4EC]">
        <div className="public-container grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div data-reveal>
            <p className="public-eyebrow">Before you visit</p>
            <h2 className="public-subheading mt-4">Good questions deserve clear answers.</h2>
            <p className="mt-6 leading-8 text-[#6B514B]">
              Explore practical information about booking, branch availability, treatment
              expectations, and aftercare.
            </p>
            <Link href="/faq" className="luxury-button-outline mt-8">
              View all FAQs <ArrowRight size={16} />
            </Link>
          </div>
          <div className="border-t border-[#D6B078]/60">
            {faqPreview.map(([question, answer]) => (
              <article key={question} className="border-b border-[#D6B078]/60 py-6">
                <h3 className="text-2xl text-[#59141D]">{question}</h3>
                <p className="mt-3 text-sm leading-7 text-[#6B514B]">{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="final-journey relative overflow-hidden bg-[#59141D] py-20 text-white sm:py-24">
        <div className="final-journey-texture absolute inset-0" aria-hidden="true" />
        <div className="public-container relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div data-reveal>
            <p className="text-xs uppercase tracking-[0.18em] text-[#D6B078]">Naga City & Daet</p>
            <h2 className="mt-5 max-w-3xl font-serif text-[clamp(2.6rem,5vw,5rem)] leading-[1.05]">
              Your ESCLARE journey starts here.
            </h2>
            <div className="editorial-rule mt-7 border-white/20" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link href="/appointment-request" className="luxury-button-light">
              <CalendarDays size={17} /> Book a consultation
            </Link>
            <Link href="/branches" className="luxury-button-ghost">
              <MapPin size={17} /> Find a branch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
