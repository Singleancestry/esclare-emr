"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { ArrowLeft, ArrowRight, CalendarDays, CameraOff, Expand, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { treatmentGalleryCategories } from "@/lib/clinic/treatment-media";

export function TreatmentGallery() {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const category = treatmentGalleryCategories[categoryIndex];
  const activeImage = imageIndex === null ? null : category.images[imageIndex];

  useEffect(() => {
    if (imageIndex === null) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") setImageIndex(null);
      if (event.key === "ArrowRight")
        setImageIndex((current) =>
          current === null ? null : (current + 1) % category.images.length,
        );
      if (event.key === "ArrowLeft")
        setImageIndex((current) =>
          current === null ? null : (current - 1 + category.images.length) % category.images.length,
        );
    }
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", keydown);
    };
  }, [imageIndex, category.images.length]);

  function selectCategory(index: number) {
    setCategoryIndex(index);
    setImageIndex(null);
  }

  return (
    <section className="bg-white py-20 lg:py-28" aria-labelledby="treatment-gallery-heading">
      <div className="public-container">
        <div className="max-w-3xl" data-reveal>
          <p className="public-eyebrow">Treatment focus</p>
          <h2 id="treatment-gallery-heading" className="public-subheading mt-4">
            A closer look, with clinical honesty.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#62595C]">
            Curated treatment and technology visuals are grouped by service. They illustrate the
            treatment setting and do not represent guaranteed outcomes or before-and-after results.
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Treatment galleries"
          className="mt-8 flex gap-2 overflow-x-auto pb-2"
        >
          {treatmentGalleryCategories.map((item, index) => (
            <button
              key={item.id}
              id={`treatment-tab-${item.id}`}
              role="tab"
              aria-selected={categoryIndex === index}
              aria-controls="treatment-gallery-panel"
              onClick={() => selectCategory(index)}
              className={`min-h-11 shrink-0 rounded-lg border px-4 text-xs font-bold transition-colors ${categoryIndex === index ? "border-[#5B1830] bg-[#5B1830] text-white" : "border-[#CCBCA7] bg-[#FBF8F2] text-[#481827] hover:border-[#8F6A35]"}`}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div
          id="treatment-gallery-panel"
          role="tabpanel"
          aria-labelledby={`treatment-tab-${category.id}`}
          className="mt-6 grid gap-8 rounded-lg bg-[#EEE6DA] p-5 sm:p-8 lg:grid-cols-[0.38fr_0.62fr]"
        >
          <div>
            <p className="public-eyebrow">{category.name}</p>
            <h3 className="mt-3 text-3xl text-[#481827]">Assessment before treatment.</h3>
            <p className="mt-4 text-sm leading-7 text-[#62595C]">{category.introduction}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link href={category.treatmentHref as Route} className="luxury-button-outline">
                Learn more <ArrowRight size={15} />
              </Link>
              <Link
                href={
                  `/appointment-request${category.bookingSlug ? `?treatment=${category.bookingSlug}` : ""}` as Route
                }
                className="luxury-button"
              >
                <CalendarDays size={16} /> Book this treatment
              </Link>
            </div>
          </div>
          {category.images.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {category.images.map((image, index) => (
                <SpotlightCard
                  key={image.src}
                  className={category.images.length === 1 ? "sm:col-span-2" : ""}
                >
                  <button
                    type="button"
                    onClick={() => setImageIndex(index)}
                    aria-label={`Open ${category.name} image: ${image.caption}`}
                    className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#E7DED1]"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 32vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <span className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[#210A13]/85 to-transparent p-4 pt-12 text-left text-xs font-semibold text-white">
                      <span>{image.caption}</span>
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/35 bg-[#5B1830]/90">
                        <Expand size={16} />
                      </span>
                    </span>
                  </button>
                </SpotlightCard>
              ))}
            </div>
          ) : (
            <div className="grid min-h-72 place-items-center rounded-lg border border-[#CDBB9E] bg-[#FBF8F2] p-8 text-center">
              <div>
                <CameraOff className="mx-auto text-[#9A7740]" size={28} />
                <p className="mt-4 font-serif text-xl text-[#481827]">Treatment visual pending</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#6B6264]">
                  This category remains image-free until ESCLARE confirms correctly categorized
                  material.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {activeImage &&
        imageIndex !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${category.name} image viewer`}
            className="fixed inset-0 z-[100] grid bg-[#18070F]/95 p-4"
          >
            <div className="m-auto flex size-full max-w-6xl flex-col">
              <div className="flex items-center justify-between border-b border-white/20 pb-3 text-white">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#DCC69F]">
                    {category.name}
                  </p>
                  <p className="mt-1 text-sm">{activeImage.caption}</p>
                </div>
                <button
                  ref={closeRef}
                  onClick={() => setImageIndex(null)}
                  aria-label="Close treatment gallery"
                  className="grid size-11 place-items-center rounded-lg border border-white/40"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="relative min-h-0 flex-1 py-4">
                <Image
                  src={activeImage.src}
                  alt={activeImage.alt}
                  fill
                  sizes="100vw"
                  className="rounded-lg object-contain"
                  priority
                />
              </div>
              <div className="flex justify-between border-t border-white/20 pt-3 text-white">
                <button
                  onClick={() =>
                    setImageIndex(
                      (imageIndex - 1 + category.images.length) % category.images.length,
                    )
                  }
                  aria-label="Previous treatment photo"
                  className="flex min-h-11 items-center gap-2 px-2 text-xs font-bold"
                >
                  <ArrowLeft size={17} /> Previous
                </button>
                <button
                  onClick={() => setImageIndex((imageIndex + 1) % category.images.length)}
                  aria-label="Next treatment photo"
                  className="flex min-h-11 items-center gap-2 px-2 text-xs font-bold"
                >
                  Next <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
