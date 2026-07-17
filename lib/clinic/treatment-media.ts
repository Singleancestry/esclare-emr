export type TreatmentGalleryImage = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type TreatmentGalleryCategory = {
  id: "pico-face" | "diode-underarms" | "hifu" | "mccm" | "pico-underarms" | "doctor-led";
  name: string;
  introduction: string;
  treatmentHref: string;
  bookingSlug: string;
  images: ReadonlyArray<TreatmentGalleryImage>;
};

export const treatmentGalleryCategories: ReadonlyArray<TreatmentGalleryCategory> = [
  {
    id: "pico-face",
    name: "Pico Laser Face",
    introduction:
      "A laser-based facial service planned after skin assessment. Settings and suitability depend on the concern being addressed.",
    treatmentHref: "/treatments#laser-and-brightening",
    bookingSlug: "pico-glow-face",
    images: [
      {
        src: "/images/optimized/treatments/pico-face/pico-face-treatment.webp",
        alt: "Pico laser facial treatment visual with protective eyewear in a private treatment room",
        caption: "Pico facial treatment visual",
        width: 543,
        height: 466,
      },
      {
        src: "/images/optimized/treatments/pico-face/pico-face-overview.webp",
        alt: "Aesthetician performing a Pico laser facial treatment with protective eyewear",
        caption: "Treatment overview",
        width: 522,
        height: 455,
      },
      {
        src: "/images/optimized/treatments/pico-face/pico-face-detail.webp",
        alt: "Close view of a Pico laser handpiece positioned near the cheek",
        caption: "Precision handpiece detail",
        width: 545,
        height: 464,
      },
      {
        src: "/images/optimized/treatments/devices/pico/pico-laser-device.webp",
        alt: "Pico laser device visual in a warm neutral treatment room",
        caption: "Pico laser technology",
        width: 1536,
        height: 1024,
      },
    ],
  },
  {
    id: "diode-underarms",
    name: "4D Diode Hair Reduction",
    introduction:
      "A four-wavelength hair-reduction service with cooling support. Session intervals and outcomes vary by hair, skin and hormonal factors.",
    treatmentHref: "/diode-laser",
    bookingSlug: "",
    images: [
      {
        src: "/images/optimized/treatments/diode/diode-underarm-treatment.webp",
        alt: "Diode laser hair-reduction treatment visual for the underarm area",
        caption: "Underarm hair-reduction treatment",
        width: 1536,
        height: 1024,
      },
      {
        src: "/images/optimized/treatments/diode/diode-underarm-detail.webp",
        alt: "Close view of a cooled diode laser handpiece used on the underarm",
        caption: "Cooled handpiece detail",
        width: 1536,
        height: 1024,
      },
      {
        src: "/images/optimized/treatments/devices/diode-4d/diode-4d-device.webp",
        alt: "ESCLARE 4D diode laser device visual in a treatment room",
        caption: "4D diode device",
        width: 1537,
        height: 1023,
      },
      {
        src: "/images/optimized/treatments/devices/diode-4d/diode-4d-treatment-room.webp",
        alt: "ESCLARE 4D diode laser device beside a prepared treatment bed",
        caption: "Prepared treatment setting",
        width: 1448,
        height: 1086,
      },
    ],
  },
  {
    id: "hifu",
    name: "HIFU Firming",
    introduction:
      "Focused-ultrasound treatment for selected face and neck concerns. A consultation is needed to establish candidacy, treatment areas and realistic expectations.",
    treatmentHref: "/treatments#lifting-and-contouring",
    bookingSlug: "7d-hifu-face",
    images: [
      {
        src: "/images/optimized/treatments/hifu/hifu-face-treatment.webp",
        alt: "HIFU treatment visual showing the handpiece positioned along the jawline",
        caption: "Face and jawline treatment",
        width: 1536,
        height: 1024,
      },
      {
        src: "/images/optimized/treatments/hifu/hifu-mature-skin-treatment.webp",
        alt: "HIFU treatment visual for mature skin with clinician supporting the jawline",
        caption: "Individualized treatment planning",
        width: 1536,
        height: 1024,
      },
      {
        src: "/images/optimized/treatments/hifu/hifu-handpiece-detail.webp",
        alt: "Close view of a HIFU handpiece used with conductive gel along the jawline",
        caption: "Focused-ultrasound handpiece",
        width: 1536,
        height: 1024,
      },
      {
        src: "/images/optimized/treatments/devices/hifu/hifu-device.webp",
        alt: "White HIFU device visual in an ESCLARE-inspired clinic interior",
        caption: "HIFU technology",
        width: 1086,
        height: 1448,
      },
    ],
  },
  {
    id: "mccm",
    name: "MCCM PDRN Glow",
    introduction:
      "A professional brightening, hydration and eye-contour protocol using selected MCCM formulations after a skin assessment.",
    treatmentHref: "/treatments#skin-support",
    bookingSlug: "mccm-pdrn",
    images: [
      {
        src: "/images/optimized/treatments/mccm/mccm-pdrn-hero.webp",
        alt: "MCCM PDRN professional-use vial and packaging on a neutral display",
        caption: "MCCM PDRN professional formula",
        width: 1536,
        height: 1024,
      },
      {
        src: "/images/optimized/treatments/mccm/mccm-pdrn-detail.webp",
        alt: "Close view of MCCM PDRN professional-use product packaging",
        caption: "PDRN product detail",
        width: 1536,
        height: 1024,
      },
      {
        src: "/images/optimized/treatments/mccm/mccm-eye-contour.webp",
        alt: "MCCM Out Contour professional eye-contour vial and packaging",
        caption: "Out Contour eye-area formula",
        width: 1536,
        height: 1024,
      },
    ],
  },
  {
    id: "pico-underarms",
    name: "Pico Brightening",
    introduction:
      "A targeted laser brightening service considered only after assessment. It does not remove hair, and the recommended course varies by skin response.",
    treatmentHref: "/treatments#laser-and-brightening",
    bookingSlug: "pico-glow-body",
    images: [
      {
        src: "/images/optimized/treatments/pico-underarm/pico-underarm-treatment.webp",
        alt: "Pico laser brightening treatment visual for the underarm area with protective eyewear",
        caption: "Pico underarm brightening",
        width: 1536,
        height: 1024,
      },
      {
        src: "/images/optimized/treatments/pico-underarm/pico-underarm-overview.webp",
        alt: "Aesthetician performing a Pico laser brightening service in a private treatment room",
        caption: "Treatment-room overview",
        width: 1536,
        height: 1024,
      },
      {
        src: "/images/optimized/treatments/pico-underarm/pico-underarm-detail.webp",
        alt: "Close view of a Pico laser handpiece positioned over the underarm",
        caption: "Targeted handpiece detail",
        width: 762,
        height: 299,
      },
    ],
  },
  {
    id: "doctor-led",
    name: "Doctor-Led Aesthetics",
    introduction:
      "Injectables and thread procedures require an in-person medical assessment. Product, technique, dose and suitability are determined by the treating physician.",
    treatmentHref: "/treatments#doctor-procedures",
    bookingSlug: "",
    images: [
      {
        src: "/images/optimized/treatments/doctor/anti-wrinkle/anti-wrinkle-treatment.webp",
        alt: "Doctor-led anti-wrinkle injectable treatment visual in a clinical room",
        caption: "Anti-wrinkle consultation and treatment",
        width: 1672,
        height: 941,
      },
      {
        src: "/images/optimized/treatments/doctor/hiko/hiko-nose-lift-treatment.webp",
        alt: "Doctor-led HIKO nose thread procedure visual after assessment",
        caption: "HIKO nose thread procedure",
        width: 1536,
        height: 1024,
      },
      {
        src: "/images/optimized/treatments/doctor/thread-lift/thread-lift-treatment.webp",
        alt: "Doctor-led facial thread-lift treatment visual with an assistant present",
        caption: "Facial thread-lift procedure",
        width: 1672,
        height: 941,
      },
      {
        src: "/images/optimized/treatments/doctor/armtox/armtox-treatment.webp",
        alt: "Doctor-led upper-arm neuromodulator treatment visual",
        caption: "Arm contouring assessment and treatment",
        width: 1672,
        height: 941,
      },
    ],
  },
];
