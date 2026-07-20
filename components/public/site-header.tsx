"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  ["Home", "/home"],
  ["Treatments", "/treatments"],
  ["Skin Education", "/skin-education"],
  ["About", "/about"],
  ["Branches", "/branches"],
  ["Aftercare", "/aftercare"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const background = Array.from(
      document.querySelectorAll<HTMLElement>(".page-enter, .public-site > footer"),
    );
    for (const element of background) {
      element.inert = open;
      if (open) element.setAttribute("aria-hidden", "true");
      else element.removeAttribute("aria-hidden");
    }
    if (open) firstLinkRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key === "Tab" && open) {
        const focusable = Array.from(
          mobileMenuRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ??
            [],
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      for (const element of background) {
        element.inert = false;
        element.removeAttribute("aria-hidden");
      }
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <header className="site-nav-enter sticky top-0 z-50 border-b border-[#D6B078]/30 bg-[#FAF4EC]/95 backdrop-blur-xl">
        <div className="site-header-container flex h-[76px] items-center justify-between gap-4">
          <Link
            href="/home"
            aria-label="ESCLARE home"
            className="site-logo-link shrink-0 rounded-md"
          >
            <Image
              src="/images/optimized/logo/esclare-official-wordmark-transparent-v2.png"
              alt="ESCLARE Aesthetic Center"
              width={2048}
              height={683}
              sizes="(min-width: 640px) 144px, 120px"
              priority
              className="h-10 w-auto object-contain sm:h-12"
            />
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-4 xl:flex 2xl:gap-5">
            {links.map(([label, href]) => {
              const active =
                pathname === href || (href !== "/home" && pathname.startsWith(`${href}/`));
              return (
                <Link
                  key={href}
                  href={href as Route}
                  aria-current={active ? "page" : undefined}
                  className={`public-link min-h-11 content-center whitespace-nowrap py-3 text-[clamp(0.83rem,0.72vw,0.92rem)] font-semibold ${active ? "text-[#59141D]" : "text-[#43201E]"}`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="hidden items-center gap-4 lg:flex">
            <Link
              href="/branches"
              className="hidden min-h-11 items-center gap-2 text-xs text-[#43201E] 2xl:inline-flex"
            >
              Naga City <span className="text-[#B98A4D]">&bull;</span> Daet{" "}
              <ChevronDown size={13} />
            </Link>
            <Link href="/appointment-request" className="luxury-button">
              Book a consultation
            </Link>
          </div>
          <button
            ref={triggerRef}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
            className="grid size-11 place-items-center rounded-lg border border-[#D6B078]/65 text-[#59141D] xl:hidden"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>
      {open && (
        <div
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-x-0 bottom-0 top-[76px] z-40 overflow-y-auto bg-[#FAF4EC] px-6 py-7 xl:hidden"
        >
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="mx-auto flex max-w-lg flex-col"
          >
            {links.map(([label, href], index) => (
              <Link
                ref={index === 0 ? firstLinkRef : undefined}
                key={href}
                href={href as Route}
                onClick={closeMenu}
                aria-current={
                  pathname === href || (href !== "/home" && pathname.startsWith(`${href}/`))
                    ? "page"
                    : undefined
                }
                className="flex min-h-14 items-center justify-between border-b border-[#D6B078]/35 py-4 font-serif text-2xl text-[#59141D]"
              >
                <span>{label}</span>
                <span className="font-sans text-[10px] text-[#B98A4D]">0{index + 1}</span>
              </Link>
            ))}
            <Link href="/appointment-request" onClick={closeMenu} className="luxury-button mt-8">
              Book a consultation
            </Link>
            <div className="mt-5 flex justify-center gap-3 text-xs text-[#43201E]">
              <Link href="/branches">Naga City</Link>
              <span>&bull;</span>
              <Link href={"/branches/daet" as Route}>Daet</Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
