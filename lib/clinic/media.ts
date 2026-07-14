import type { StaticImageData } from "next/image";
import nagaHero from "@/public/images/optimized/clinic/esclare-naga-hero-v2.webp";
import nagaReception from "@/public/images/optimized/clinic/esclare-naga-reception-logo-v2.webp";
import nagaWaiting from "@/public/images/optimized/clinic/esclare-naga-waiting-area-v2.webp";
import nagaHallway from "@/public/images/optimized/clinic/esclare-naga-treatment-hallway-v2.webp";
import nagaTreatment from "@/public/images/optimized/clinic/esclare-naga-treatment-room-v2.webp";
import nagaPrep from "@/public/images/optimized/clinic/esclare-naga-preparation-area-v2.webp";
import nagaFrontDesk from "@/public/images/optimized/clinic/esclare-naga-front-desk-v2.webp";
import nagaEntrance from "@/public/images/optimized/clinic/esclare-naga-entrance-v2.webp";
import daetHero from "@/public/images/optimized/clinic-daet/esclare-daet-hero-v2.webp";
import daetReception from "@/public/images/optimized/clinic-daet/esclare-daet-reception-v2.webp";
import daetTreatmentBays from "@/public/images/optimized/clinic-daet/esclare-daet-treatment-bays-v2.webp";
import daetTreatmentArea from "@/public/images/optimized/clinic-daet/esclare-daet-treatment-area-v2.webp";
import daetNailCare from "@/public/images/optimized/clinic-daet/esclare-daet-nail-care-v2.webp";

export type ClinicGalleryImage = {
  src: StaticImageData;
  alt: string;
  title: string;
  detail: string;
  branch: "Naga" | "Daet";
};

export const nagaClinicGallery: ReadonlyArray<ClinicGalleryImage> = [
  { src: nagaReception, alt: "ESCLARE Naga reception logo wall beneath a crystal chandelier", title: "Naga reception", detail: "The branch's textured logo wall and signature chandelier", branch: "Naga" },
  { src: nagaWaiting, alt: "ESCLARE Naga waiting area with warm lighting and upholstered chairs", title: "Waiting area", detail: "A calm welcome beside the Naga reception desk", branch: "Naga" },
  { src: nagaHallway, alt: "ESCLARE Naga treatment hallway with warm framed wall mouldings", title: "Treatment hallway", detail: "Private treatment spaces with warm neutral finishes", branch: "Naga" },
  { src: nagaTreatment, alt: "ESCLARE Naga treatment room with framed mirrors and treatment bed", title: "Treatment room", detail: "A clean, organized room prepared for clinic services", branch: "Naga" },
  { src: nagaPrep, alt: "ESCLARE Naga preparation area with cabinetry and clinical sink", title: "Preparation area", detail: "Dedicated storage and preparation surfaces", branch: "Naga" },
  { src: nagaFrontDesk, alt: "ESCLARE Naga front desk with warm wall mouldings and clinic permits", title: "Front desk", detail: "The first point of welcome at the Naga clinic", branch: "Naga" },
  { src: nagaEntrance, alt: "Entrance to the ESCLARE Naga clinic", title: "Clinic entrance", detail: "The street-level arrival at ESCLARE Naga", branch: "Naga" },
];

export const daetClinicGallery: ReadonlyArray<ClinicGalleryImage> = [
  { src: daetReception, alt: "ESCLARE Daet reception with the illuminated ESCLARE wall sign", title: "Daet reception", detail: "The bright Daet welcome desk and illuminated wordmark", branch: "Daet" },
  { src: daetTreatmentBays, alt: "ESCLARE Daet treatment bays with privacy curtains and warm pendant lights", title: "Treatment bays", detail: "Curtained treatment spaces beneath warm pendant lighting", branch: "Daet" },
  { src: daetTreatmentArea, alt: "ESCLARE Daet treatment area looking toward the daylight entrance", title: "Treatment area", detail: "A bright view through the branch's treatment spaces", branch: "Daet" },
  { src: daetNailCare, alt: "ESCLARE Daet nail care station with colorful artwork and organized supplies", title: "Nail care station", detail: "A dedicated care station inside the Daet clinic", branch: "Daet" },
];

export const clinicGallery = [...nagaClinicGallery, ...daetClinicGallery] as const;

export const branchHeroImages = {
  naga: nagaHero,
  daet: daetHero,
} as const;

export const attendantPortrait = {
  src: "/images/optimized/attendant/esclare-clinic-attendant-light-maroon-1000.webp",
  alt: "ESCLARE clinic attendant in a professional muted light-maroon uniform",
  width: 1000,
  height: 1400,
} as const;

export const diodeMachine = {
  src: "/images/optimized/treatments/devices/diode-4d/diode-4d-device.webp",
  alt: "ESCLARE 4D diode laser device visual in a prepared treatment room",
  width: 1537,
  height: 1023,
} as const;
