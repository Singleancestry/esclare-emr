"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { clinicFaqs, faqCategories, type FaqCategory } from "@/lib/clinic/faqs";

export function FaqBrowser() {
  const [category, setCategory] = useState<FaqCategory | "All">("All");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(clinicFaqs[0]?.id ?? null);
  const visibleFaqs = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return clinicFaqs.filter((faq) => (category === "All" || faq.category === category) && (!term || `${faq.question} ${faq.answer}`.toLocaleLowerCase().includes(term)));
  }, [category, query]);

  return (
    <div>
      <div className="rounded-lg border border-[#D8C9B4] bg-[#F6F0E8] p-4 sm:p-5">
        <label className="relative block">
          <span className="sr-only">Search frequently asked questions</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7B6D68]" size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search treatments, booking or aftercare" className="min-h-12 w-full rounded-lg border border-[#CDBEAE] bg-white py-3 pl-11 pr-4 text-sm text-[#3F1724] outline-none transition focus:border-[#7A3047] focus:ring-2 focus:ring-[#7A3047]/20" />
        </label>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="FAQ categories">
          {["All", ...faqCategories].map((item) => <button key={item} type="button" onClick={() => setCategory(item as FaqCategory | "All")} aria-pressed={category === item} className={`min-h-11 shrink-0 rounded-lg border px-4 text-xs font-bold transition ${category === item ? "border-[#5B1830] bg-[#5B1830] text-white" : "border-[#CDBEAE] bg-white text-[#5B1830] hover:border-[#9A7740]"}`}>{item}</button>)}
        </div>
      </div>

      <div className="mt-8 divide-y divide-[#D8C9B4] border-y border-[#D8C9B4]">
        {visibleFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return <article key={faq.id} className="py-1"><h2><button type="button" id={`faq-button-${faq.id}`} aria-expanded={isOpen} aria-controls={`faq-panel-${faq.id}`} onClick={() => setOpenId(isOpen ? null : faq.id)} className="flex min-h-16 w-full items-center justify-between gap-5 py-5 text-left font-serif text-xl text-[#481827] transition hover:text-[#7A3047] sm:text-2xl"><span>{faq.question}</span><ChevronDown aria-hidden="true" size={21} className={`shrink-0 text-[#9A7740] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} /></button></h2><div id={`faq-panel-${faq.id}`} role="region" aria-labelledby={`faq-button-${faq.id}`} hidden={!isOpen}><p className="max-w-3xl pb-7 text-sm leading-7 text-[#62595C] sm:text-base">{faq.answer}</p></div></article>;
        })}
        {visibleFaqs.length === 0 && <p className="py-10 text-center text-sm text-[#62595C]">No matching answers found. Try a broader search or another category.</p>}
      </div>
    </div>
  );
}
