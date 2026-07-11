import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Frequently Asked Questions", description: "Answers about ESCLARE appointments, pricing, branches, deposits, schedules, and treatment suitability.", alternates: { canonical: "/faq" } };
const faqs = [
  ["Is an appointment request automatically confirmed?", "No. Your preferred time remains subject to staff, doctor, room, and device availability. ESCLARE confirms through Facebook, phone call, or SMS."],
  ["Do I need to pay a booking deposit?", "No. ESCLARE does not require a deposit for appointments or treatments."],
  ["What information is required to request a booking?", "Your full name is the only required personal detail. You may also choose a branch, treatment, preferred date, and time to make your request easier to confirm."],
  ["Can I cancel or reschedule?", "Yes. Please contact the branch at least 2 hours before your appointment."],
  ["What happens if I arrive late?", "Late arrivals are accommodated based on current availability. Your treatment may need to be adjusted or moved if the next appointment would be affected."],
  ["Can I book again after a no-show?", "Yes. Clients who miss an appointment may book again without restriction."],
  ["Are all treatments available at both branches?", "Naga offers all listed treatments subject to provider availability. Daet offers all listed treatments except Fractional Laser."],
  ["When are doctor-required treatments available?", "Doctor-required consultations and treatments are scheduled Saturdays from 1:00 PM to 5:00 PM, subject to confirmation."],
  ["Are treatment results guaranteed?", "No. Results vary based on the concern, skin or hair profile, hormones, lifestyle, treatment area, and session consistency. Assessment helps establish realistic expectations."],
  ["Can I receive treatment while pregnant?", "Several services are not recommended during pregnancy. Please disclose pregnancy or possible pregnancy before treatment so the team can guide you appropriately."],
];
export default function FaqPage() {
  return <main><section className="bg-[#EEE6DA] py-16 sm:py-24"><div className="public-container"><p className="public-eyebrow">Helpful answers</p><h1 className="public-heading mt-4 max-w-4xl">Frequently asked questions</h1><p className="mt-6 max-w-2xl leading-8 text-[#62595C]">The essentials for planning a clear, comfortable ESCLARE visit.</p></div></section><section className="py-16 sm:py-24"><div className="public-container max-w-4xl"><div className="divide-y divide-[#D8C9B4] border-y border-[#D8C9B4]">{faqs.map(([question,answer]) => <details key={question} className="group py-1" data-reveal><summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 font-serif text-xl text-[#481827] sm:text-2xl"><span>{question}</span><span className="text-2xl font-light text-[#9A7740] transition-transform group-open:rotate-45">+</span></summary><p className="max-w-3xl pb-7 text-sm leading-7 text-[#62595C] sm:text-base">{answer}</p></details>)}</div><div className="mt-12 bg-[#5B1830] p-7 text-white sm:flex sm:items-center sm:justify-between sm:gap-8"><div><h2 className="text-2xl">Still have a question?</h2><p className="mt-2 text-sm text-[#E8D9CF]">Reach the branch directly through an official channel.</p></div><Link href="/contact" className="luxury-button-light mt-5 sm:mt-0">Contact ESCLARE</Link></div></div></section></main>;
}
