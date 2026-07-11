"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  clinicGallery,
  daetClinicGallery,
  nagaClinicGallery,
  type ClinicGalleryImage,
} from "@/lib/clinic/media";

type ClinicGalleryProps = {
  compact?: boolean;
  branch?: "naga" | "daet";
};

function selectImages({ compact, branch }: ClinicGalleryProps) {
  if (branch === "naga") return nagaClinicGallery;
  if (branch === "daet") return daetClinicGallery;
  if (compact) return [nagaClinicGallery[0], nagaClinicGallery[1], daetClinicGallery[0], daetClinicGallery[1]];
  return clinicGallery;
}

export function ClinicGallery({ compact = false, branch }: ClinicGalleryProps) {
  const images = selectImages({ compact, branch }) as ReadonlyArray<ClinicGalleryImage>;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const activeImage = activeIndex === null ? null : images[activeIndex];
  const isLightboxOpen = activeIndex !== null;
  const heading = branch === "daet" ? "Inside ESCLARE Daet" : branch === "naga" ? "Inside ESCLARE Naga" : "Inside ESCLARE";

  useEffect(() => {
    if (!isLightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") setActiveIndex((current) => current === null ? null : (current + 1) % images.length);
      if (event.key === "ArrowLeft") setActiveIndex((current) => current === null ? null : (current - 1 + images.length) % images.length);
      if (event.key === "Tab") {
        const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]") ?? []);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      lastTriggerRef.current?.focus();
    };
  }, [isLightboxOpen, images.length]);

  function openImage(index: number, trigger: HTMLElement) {
    lastTriggerRef.current = trigger;
    setActiveIndex(index);
  }

  return <>
    <section className="bg-[#EEE6DA] py-20 lg:py-28">
      <div className="public-container">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between" data-reveal>
          <div>
            <p className="public-eyebrow">{heading}</p>
            <h2 className="public-subheading mt-4">The real spaces behind your visit.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#62595C]">Authentic branch photographs, carefully optimized while preserving the clinics&apos; real architecture, equipment, and identity.</p>
          </div>
          {compact && <Link href="/gallery" className="public-link w-fit py-3 text-sm font-bold text-[#5B1830]">View both branches <ArrowRight className="ml-1 inline" size={16} /></Link>}
        </div>

        <div className={`mt-10 grid gap-4 ${compact ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-12"}`}>
          {images.map((image, index) => {
            const isFeature = !compact && (index === 0 || images[index - 1]?.branch !== image.branch);
            return (
              <figure key={`${image.branch}-${image.title}-${index}`} className={`${isFeature ? "lg:col-span-8" : compact ? "" : "lg:col-span-4"} group overflow-hidden rounded-lg border border-[#DED2C2] bg-white shadow-[0_14px_36px_rgb(72_42_48_/_7%)]`} data-reveal>
                <button type="button" onClick={(event) => openImage(index, event.currentTarget)} aria-label={`Open larger view of ${image.title}, ESCLARE ${image.branch}`} className={`relative block w-full cursor-zoom-in overflow-hidden text-left ${compact ? "aspect-[4/5]" : isFeature ? "aspect-[16/9]" : "aspect-[4/5]"}`}>
                  <Image src={image.src} alt={image.alt} fill sizes={compact ? "(min-width: 1024px) 25vw, 50vw" : isFeature ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 50vw"} placeholder="blur" className="object-cover transition duration-700 group-hover:scale-[1.035] group-hover:brightness-[0.94]" />
                  <span className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-lg bg-[#FBF8F2]/95 text-[#5B1830] opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"><Expand size={17} /></span>
                </button>
                <figcaption className="border-t border-[#E1D5C4] p-4">
                  <div className="flex items-center justify-between gap-3"><p className="font-serif text-xl text-[#481827]">{image.title}</p><span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A6B3D]">{image.branch}</span></div>
                  <p className="mt-1 text-xs leading-5 text-[#6B6264]">{image.detail}</p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>

      {activeImage && activeIndex !== null && typeof document !== "undefined" && createPortal((
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="clinic-lightbox-title" className="fixed inset-0 z-[100] grid bg-[#18070F]/95 p-3 sm:p-6">
          <div className="relative m-auto flex size-full max-w-7xl flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-white/20 pb-3 text-white">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#DCC69F]">ESCLARE {activeImage.branch}</p><h2 id="clinic-lightbox-title" className="mt-1 font-sans text-base font-semibold text-white">{activeImage.title}</h2></div>
              <button ref={closeButtonRef} type="button" onClick={() => setActiveIndex(null)} aria-label="Close gallery" title="Close gallery" className="grid size-11 place-items-center rounded-lg border border-white/40 text-white transition-colors hover:bg-white hover:text-[#481827]"><X size={20} /></button>
            </div>
            <div className="relative min-h-0 flex-1 py-4">
              <Image src={activeImage.src} alt={activeImage.alt} fill sizes="100vw" placeholder="blur" className="rounded-lg object-contain" priority />
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-white/20 pt-3 text-white">
              <button type="button" onClick={() => setActiveIndex((activeIndex - 1 + images.length) % images.length)} aria-label="Previous clinic photo" title="Previous photo" className="inline-flex min-h-11 items-center gap-2 px-2 text-xs font-bold uppercase"><ArrowLeft size={18} /> Previous</button>
              <p className="text-xs text-[#DCCFC8]">{activeIndex + 1} / {images.length}</p>
              <button type="button" onClick={() => setActiveIndex((activeIndex + 1) % images.length)} aria-label="Next clinic photo" title="Next photo" className="inline-flex min-h-11 items-center gap-2 px-2 text-xs font-bold uppercase">Next <ArrowRight size={18} /></button>
            </div>
          </div>
        </div>
      ), document.body)}
    </>;
}
