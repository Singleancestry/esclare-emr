import type { StaticImageData } from "next/image";
import nagaReception from "@/public/images/optimized/clinic/esclare-naga-reception-1000.webp";
import nagaWaiting from "@/public/images/optimized/clinic/esclare-naga-waiting-area-1000.webp";
import nagaHallway from "@/public/images/optimized/clinic/esclare-naga-hallway-1000.webp";
import nagaTreatment from "@/public/images/optimized/clinic/esclare-naga-treatment-room-1000.webp";
import nagaPrep from "@/public/images/optimized/clinic/esclare-naga-prep-counter-1000.webp";
import nagaFrontDesk from "@/public/images/optimized/clinic/esclare-naga-front-desk-1000.webp";
import daetHero from "@/public/images/optimized/clinic-daet/esclare-daet-hero-1456.webp";
import daetReception from "@/public/images/optimized/clinic-daet/esclare-daet-reception-1200.webp";
import daetTreatmentBays from "@/public/images/optimized/clinic-daet/esclare-daet-treatment-bays-1200.webp";
import daetTreatmentBaysDaylight from "@/public/images/optimized/clinic-daet/esclare-daet-treatment-bays-daylight-1200.webp";
import daetNailCare from "@/public/images/optimized/clinic-daet/esclare-daet-nail-care-1200.webp";

export type ClinicGalleryImage = {
  src: StaticImageData;
  alt: string;
  title: string;
  detail: string;
  branch: "Naga" | "Daet";
};

export const nagaClinicGallery: ReadonlyArray<ClinicGalleryImage> = [
  { src: nagaReception, alt: "The real ESCLARE Naga reception counter and textured logo wall", title: "Reception", detail: "Textured stone, warm lighting, and the ESCLARE wordmark", branch: "Naga" },
  { src: nagaWaiting, alt: "The real ESCLARE Naga waiting area beneath a crystal chandelier", title: "Waiting area", detail: "A warm welcome beneath the signature chandelier", branch: "Naga" },
  { src: nagaHallway, alt: "The real ESCLARE Naga treatment hallway with framed wall mouldings", title: "Treatment hallway", detail: "Private treatment spaces with warm neutral finishes", branch: "Naga" },
  { src: nagaTreatment, alt: "The real ESCLARE Naga treatment room reflected in framed mirrors", title: "Treatment room", detail: "Organized equipment and a clean treatment setting", branch: "Naga" },
  { src: nagaPrep, alt: "The real ESCLARE Naga treatment preparation counter and cabinetry", title: "Preparation area", detail: "Purposeful storage and a dedicated preparation surface", branch: "Naga" },
  { src: nagaFrontDesk, alt: "The real ESCLARE Naga front desk with warm wall mouldings", title: "Front desk", detail: "The starting point for every clinic visit", branch: "Naga" },
];

export const daetClinicGallery: ReadonlyArray<ClinicGalleryImage> = [
  { src: daetHero, alt: "The authentic ESCLARE Daet reception with the illuminated ESCLARE wall sign", title: "Daet reception", detail: "The real Daet welcome desk and illuminated wordmark", branch: "Daet" },
  { src: daetTreatmentBays, alt: "The authentic ESCLARE Daet treatment bays with privacy curtains and warm pendant lights", title: "Treatment bays", detail: "Curtained treatment spaces beneath warm pendant lighting", branch: "Daet" },
  { src: daetTreatmentBaysDaylight, alt: "The authentic ESCLARE Daet treatment area looking toward the daylight entrance", title: "Treatment area", detail: "A bright view through the branch's treatment spaces", branch: "Daet" },
  { src: daetNailCare, alt: "The authentic ESCLARE Daet nail care station with artwork and organized supplies", title: "Nail care station", detail: "A dedicated station within the real Daet clinic", branch: "Daet" },
  { src: daetReception, alt: "The authentic ESCLARE Daet front desk and illuminated clinic wordmark", title: "Front desk", detail: "The branch identity as seen from the reception counter", branch: "Daet" },
];

export const clinicGallery = [...nagaClinicGallery, ...daetClinicGallery] as const;

export const branchHeroImages = {
  naga: nagaReception,
  daet: daetHero,
} as const;

export const attendantPortrait = {
  src: "/images/optimized/attendant/esclare-clinic-attendant-light-maroon-1000.webp",
  alt: "ESCLARE clinic attendant in a professional muted light-maroon uniform",
  width: 1000,
  height: 1400,
} as const;

export const diodeMachine = {
  src: "/images/optimized/diode-machine/esclare-diode-machine-front-900.webp",
  alt: "The actual four-wavelength diode laser machine used by ESCLARE",
  width: 900,
  height: 1100,
} as const;
