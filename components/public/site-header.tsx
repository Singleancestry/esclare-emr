"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Phone, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  ["Treatments", "/treatments"], ["4D Diode", "/diode-laser"], ["Gallery", "/gallery"], ["Branches", "/branches"], ["About", "/about"], ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) firstLinkRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key === "Tab" && open) {
        const focusable = Array.from(mobileMenuRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKeyDown); };
  }, [open]);

  function closeMenu() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return <>
    <div className="bg-[#32101E] px-4 py-2 text-center text-[11px] font-semibold uppercase text-[#E8D5B5] sm:text-xs">Naga open daily · Daet Tuesday-Sunday · No booking deposit</div>
    <header className="site-nav-enter sticky top-0 z-50 border-b border-[#D8C9B4]/60 bg-[#FCFAF6]/92 backdrop-blur-xl">
      <div className="public-container flex h-[72px] items-center justify-between gap-4">
        <Link href="/home" aria-label="ESCLARE home" className="group shrink-0"><Image src="/images/optimized/logo/esclare-official-wordmark-640.webp" alt="ESCLARE Aesthetic Center" width={640} height={199} priority className="h-auto w-[132px] sm:w-[152px]" /></Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-5 lg:flex">{links.map(([label, href]) => { const active = pathname === href || (href === "/branches" && pathname.startsWith("/branches/")); return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`public-link py-3 text-[11px] font-bold uppercase tracking-[0.07em] ${active ? "text-[#5B1830]" : "text-[#3A2D31]"}`}>{label}</Link>; })}</nav>
        <div className="hidden items-center gap-3 sm:flex"><a href="tel:+639207351379" aria-label="Call ESCLARE Naga" className="grid size-11 place-items-center rounded-lg border border-[#CDBB9E] text-[#5B1830] transition-colors hover:bg-[#EEE6DA]"><Phone size={17} /></a><Link href="/appointment-request" className="luxury-button">Book a visit</Link></div>
        <button ref={triggerRef} type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)} className="grid size-11 place-items-center rounded-lg border border-[#CDBB9E] text-[#5B1830] lg:hidden">{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </header>
    {open && <div ref={mobileMenuRef} className="fixed inset-x-0 bottom-0 top-[105px] z-40 overflow-y-auto bg-[#FBF8F2] px-6 py-8 lg:hidden"><nav id="mobile-navigation" aria-label="Mobile navigation" className="mx-auto flex max-w-lg flex-col">{links.map(([label, href], index) => { const active = pathname === href || (href === "/branches" && pathname.startsWith("/branches/")); return <Link ref={index === 0 ? firstLinkRef : undefined} key={href} href={href} onClick={closeMenu} aria-current={active ? "page" : undefined} className="flex items-center justify-between border-b border-[#DED1BF] py-4 font-serif text-2xl text-[#481827]"><span>{label}</span><span className="text-xs font-sans text-[#9A7A49]">0{index + 1}</span></Link>; })}<Link href="/appointment-request" onClick={closeMenu} className="luxury-button mt-8">Book a visit</Link><a href="tel:+639207351379" className="mt-4 text-center text-sm font-semibold text-[#5B1830]">Call +63 920 735 1379</a></nav></div>}
  </>;
}
