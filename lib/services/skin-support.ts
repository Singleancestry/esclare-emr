export type SkinSupportContent = {
  slug: string;
  brand: "MCCM" | "Rejuran";
  positioning: string;
  image: string;
  imageAlt: string;
  classification: string;
  assessment: string;
  branches: string;
  frequency: string | null;
  duration: string | null;
  downtime: string | null;
  bookingNote: string;
  reviewNotice: string;
  overview: ReadonlyArray<string>;
  unique: string;
  process: ReadonlyArray<string>;
  plan: string;
  benefits: ReadonlyArray<string>;
  candidates: string;
  expectations: string;
  aftercare: ReadonlyArray<string>;
  safety: ReadonlyArray<string>;
  regulatory: string;
  relatedEducation: { label: string; href: string };
  faqs: ReadonlyArray<{ question: string; answer: string }>;
};

const commonAftercare = [
  "Use only the gentle products and sun protection recommended by the treating professional.",
  "Avoid picking, scrubbing, or adding strong active products while the area is sensitive.",
  "Contact the clinic for worsening pain, marked swelling, blistering, discharge, or another unexpected reaction.",
] as const;

const reviewNotice =
  "Preview for clinical, product-source, and regulatory review. This service is not available for online booking yet.";

export const skinSupportContent: ReadonlyArray<SkinSupportContent> = [
  {
    slug: "mccm-exosome-pdrn",
    brand: "MCCM",
    positioning: "Topical professional support for hydrated, smoother-looking skin.",
    image: "/images/optimized/treatments/skin-support/products/mccm-exosome-pdrn-studio.webp",
    imageAlt: "MCCM Exosome PDRN professional-use box and amber vial",
    classification: "Non-doctor treatment under clinic assessment procedures",
    assessment: "A skin assessment is required before the first session.",
    branches: "Proposed for Naga and Daet after exact stock verification",
    frequency: "MCCM manufacturer guidance lists weekly professional use.",
    duration: null,
    downtime: null,
    bookingNote: "Booking opens only after the clinic matches its stock to the verified record.",
    reviewNotice,
    overview: [
      "MCCM identifies Exosome PDRN as a topical, professional cosmetic product containing sodium hyaluronate and deoxyribonucleic acid. The manufacturer positions it for hydration, smoothness, and a plumper-looking finish.",
      "This is not an injectable treatment. The official product direction states topical use and explicitly says not to inject.",
    ],
    unique:
      "The treatment pairs a professional topical product with an individualized skin-support appointment. It should not be presented as regenerative medicine or as a treatment for disease.",
    process: [
      "Review the skin concern, sensitivity, current products, recent procedures, and relevant health history.",
      "Clean and prepare the selected area using the clinic-approved topical protocol.",
      "Apply the exact verified product according to its professional-use directions.",
      "Finish with appropriate calming support and individualized aftercare.",
    ],
    plan: "The manufacturer lists weekly use. ESCLARE must still determine whether that frequency is suitable for the individual and confirm the exact clinic protocol before production publication.",
    benefits: [
      "Supports a more hydrated skin appearance",
      "May improve the look of smoothness and suppleness",
      "Provides a professional topical option within a broader skin-care plan",
    ],
    candidates:
      "Adults seeking professional support for dryness, dullness, or uneven-looking texture may ask for assessment. Active irritation, infection, allergy concerns, pregnancy-related changes, medicines, or recent procedures may change the plan.",
    expectations:
      "Cosmetic response varies. No fixed result or timeline is promised, and repeated sessions should not be assumed before assessment.",
    aftercare: commonAftercare,
    safety: [
      "Topical professional use only; do not inject.",
      "The clinic must verify the exact product, formulation, source, and current notification before use.",
      "A cosmetic notification does not prove clinical effectiveness or authorize a treatment claim beyond the product's intended cosmetic use.",
    ],
    regulatory:
      "The Philippine FDA Verification Portal lists EXOSOME PDRN by MCCM under Cosmetic Product Notification No. NN-1000014479440, issued 10 May 2025 and expiring 10 May 2027, with Redo Marketing Philippines Inc. as the responsible company. Display in production remains conditional on matching ESCLARE's exact stock and reverifying current status.",
    relatedEducation: {
      label: "Read the PDRN and polynucleotide education draft",
      href: "/skin-education/pdrn-polynucleotides-guide",
    },
    faqs: [
      {
        question: "Is MCCM Exosome PDRN injected?",
        answer:
          "No. The official MCCM product page describes topical professional use and states that the product must not be injected.",
      },
      {
        question: "Does Philippine FDA notification mean the treatment is approved?",
        answer:
          "No. The record is a cosmetic product notification for the exact listed product. It does not approve every clinic protocol or prove a result.",
      },
    ],
  },
  {
    slug: "mccm-eye-contour",
    brand: "MCCM",
    positioning: "A topical eye-contour concept held to doctor-review standards at ESCLARE.",
    image: "/images/optimized/treatments/skin-support/products/mccm-eye-contour-studio.webp",
    imageAlt: "MCCM Out Contour Cocktail box and amber vial",
    classification: "Doctor-assessed clinic policy; verified product is topical only",
    assessment: "Doctor assessment is required under the proposed ESCLARE policy.",
    branches: "Proposed for Naga and Daet after protocol and product verification",
    frequency: "MCCM manufacturer guidance lists weekly professional use.",
    duration: null,
    downtime: null,
    bookingNote: "Not bookable until the exact product and route are approved by the clinic.",
    reviewNotice,
    overview: [
      "MCCM identifies Out Contour Cocktail as a topical professional eye-area product positioned to hydrate and improve the look of firmness around the eye contour.",
      "The official product page says topical use and explicitly says not to inject. ESCLARE's requested doctor-only classification is a clinic oversight policy, not a change in the product route.",
    ],
    unique:
      "The proposed service adds doctor assessment to a sensitive treatment area while preserving the verified topical route. The final website name must match the exact product used in clinic.",
    process: [
      "Doctor reviews the eye-area concern, skin integrity, sensitivities, medicines, and recent procedures.",
      "The area is gently prepared without placing product in the eye.",
      "A trained professional applies the verified topical product under the clinic-approved protocol.",
      "The provider reviews eye-area precautions and follow-up needs.",
    ],
    plan: "MCCM lists weekly professional use, but ESCLARE has not yet approved a public protocol. Frequency must be individualized after doctor assessment.",
    benefits: [
      "Supports hydration around the eye contour",
      "May improve the look of firmness and refreshed skin",
      "Places a sensitive-area service under doctor assessment",
    ],
    candidates:
      "Adults concerned about dry or tired-looking eye-contour skin may request assessment. Eye disease, active irritation, infection, allergy history, recent procedures, pregnancy, or prescription products require careful review.",
    expectations:
      "The product is positioned for cosmetic appearance support. Results and timelines vary, and no reduction of a medical eye condition is claimed.",
    aftercare: commonAftercare,
    safety: [
      "Topical use only; do not inject or place in the eye.",
      "Stop and seek advice for eye pain, vision change, severe swelling, or another unexpected reaction.",
      "Doctor-only clinic policy must not be represented as regulatory authorization for another route.",
    ],
    regulatory:
      "No exact Philippine FDA record for the proposed MCCM Out Contour Cocktail service has been verified in this review. No notification badge or local regulatory claim may be published until ESCLARE supplies and matches the exact product record.",
    relatedEducation: {
      label: "Read the professional skincare guide",
      href: "/skin-education/mccm-professional-skincare-guide",
    },
    faqs: [
      {
        question: "Is this an injectable eye treatment?",
        answer:
          "No. The verified MCCM source describes Out Contour Cocktail as topical and says not to inject it.",
      },
      {
        question: "Why is a doctor assessment proposed?",
        answer:
          "The eye contour is sensitive, and ESCLARE requested a doctor-only oversight policy. That policy still requires the exact topical protocol and product source to be approved.",
      },
    ],
  },
  {
    slug: "mccm-brightening-system",
    brand: "MCCM",
    positioning: "A complete, area-specific brightening plan rather than a standalone peel.",
    image: "/images/optimized/treatments/skin-support/products/mccm-brightening-studio.webp",
    imageAlt: "MCCM Glutathione Peeling professional product bottle",
    classification: "Non-doctor treatment under clinic assessment procedures",
    assessment: "Area, sensitivity, recent procedures, and product use must be reviewed.",
    branches: "Proposed for Naga and Daet after exact stock verification",
    frequency: "Manufacturer peel guidance lists use every 15 days.",
    duration: null,
    downtime: null,
    bookingNote: "Final price depends on the approved treatment area and supporting steps.",
    reviewNotice,
    overview: [
      "The proposed MCCM Brightening System combines assessment, preparation, a verified MCCM brightening peel, supportive steps, and aftercare selected for the treatment area.",
      "It is intentionally described as a system because the service is more than a peel application. ESCLARE must approve each supporting product before it is named publicly.",
    ],
    unique:
      "The treatment is planned by area and skin condition, so intensity, supporting products, price, and whether treatment proceeds are not assumed from the website.",
    process: [
      "Assess the requested area, skin integrity, sensitivity, current products, and recent sun exposure or procedures.",
      "Clean and prepare the area using verified clinic products.",
      "Apply the exact MCCM brightening-peel product according to professional directions.",
      "Complete the approved supportive and calming steps, then review aftercare.",
    ],
    plan: "MCCM's Glutathione Peeling manufacturer guidance lists use every 15 days. ESCLARE must tailor any course to the area and observed response; no fixed package is promised.",
    benefits: [
      "Supports a brighter and more even-looking appearance",
      "Allows treatment planning for an assessed face or body area",
      "Combines preparation, professional peel use, supportive care, and aftercare",
    ],
    candidates:
      "Adults concerned about dull or uneven-looking skin may request assessment. Active irritation, infection, open skin, recent tanning, strong topical products, pregnancy, or a history of adverse peel reactions may require another plan.",
    expectations:
      "Temporary sensitivity or visible peeling can occur. Cosmetic response varies by area, baseline concern, treatment intensity, and aftercare. No specific degree of brightening is guaranteed.",
    aftercare: commonAftercare,
    safety: [
      "Professional topical use only and only on an assessed area.",
      "Peel strength, layers, exposure, neutralization, and supportive products are professional decisions and are not self-care instructions.",
      "The clinic must match the exact peel product to the current Philippine record before use.",
    ],
    regulatory:
      "The Philippine FDA Verification Portal lists GLUTATHIONE PEELING by MCCM under Cosmetic Product Notification No. NN-1000014480587, issued 9 May 2025 and expiring 9 May 2027, with Redo Marketing Philippines Inc. as the responsible company. This notification applies to the listed cosmetic product, not the complete clinic system, and remains conditional on exact stock matching.",
    relatedEducation: {
      label: "Read the professional peel education draft",
      href: "/skin-education/mccm-professional-chemical-peels",
    },
    faqs: [
      {
        question: "Why does the price vary by area?",
        answer:
          "Area size, location, suitability, preparation, and approved supporting steps affect the plan. The listed PHP 5,000 is a starting price.",
      },
      {
        question: "Is this only a glutathione peel?",
        answer:
          "No. The proposed service includes assessment, preparation, the verified peel, supportive steps, and aftercare. Exact inclusions must be confirmed before treatment.",
      },
    ],
  },
  ...[
    {
      slug: "rejuran-h",
      brand: "Rejuran" as const,
      positioning:
        "A proposed doctor-only polynucleotide skin-support service awaiting Philippine authorization review.",
      focus: "overall skin quality",
      image: "/images/optimized/treatments/skin-support/products/rejuran-healer-studio.webp",
      imageAlt: "Rejuran Healer black and silver product box",
      related: "/skin-education/rejuran-healer-guide",
      relatedLabel: "Read the Rejuran Healer review draft",
    },
    {
      slug: "rejuran-eye",
      brand: "Rejuran" as const,
      positioning:
        "A proposed doctor-only eye-area polynucleotide service awaiting Philippine authorization review.",
      focus: "the eye-contour area",
      image: "/images/optimized/treatments/skin-support/products/rejuran-eye-studio.webp",
      imageAlt: "Rejuran I silver product box and syringe",
      related: "/skin-education/rejuran-eye-guide",
      relatedLabel: "Read the Rejuran Eye review draft",
    },
    {
      slug: "rejuran-scar",
      brand: "Rejuran" as const,
      positioning:
        "A proposed doctor-only scar-focused polynucleotide service awaiting Philippine authorization review.",
      focus: "selected scar and texture concerns",
      image: "/images/optimized/treatments/skin-support/products/rejuran-s-studio.webp",
      imageAlt: "Rejuran S blue and silver product box",
      related: "/skin-education/rejuran-s-guide",
      relatedLabel: "Read the Rejuran S review draft",
    },
  ].map((item): SkinSupportContent => ({
    slug: item.slug,
    brand: item.brand,
    positioning: item.positioning,
    image: item.image,
    imageAlt: item.imageAlt,
    classification: "Doctor-administered only, if lawfully supplied and authorized",
    assessment:
      "Doctor consultation, history review, suitability assessment, and informed consent required.",
    branches: "Not confirmed for either branch pending product authorization",
    frequency: null,
    duration: null,
    downtime: null,
    bookingNote: "Consultation and treatment booking are disabled until verification is complete.",
    reviewNotice,
    overview: [
      `This preview describes a proposed Rejuran variant intended for ${item.focus}. It does not confirm that ESCLARE currently offers, stocks, or is authorized to use the exact product.`,
      "Manufacturer and distributor materials discuss polynucleotide-based cosmetic products, but product names, formulations, routes, and regulatory status vary by market. United States product information cannot establish Philippine authorization.",
    ],
    unique:
      "Any future service must be tied to the exact sealed product, authorized Philippine source, permitted route, qualified doctor, and approved clinic protocol. Brand-family familiarity is not enough.",
    process: [
      "Verify the exact product, Philippine authorization, authorized supplier, lot, expiry, and cold-chain or storage requirements where applicable.",
      "A licensed doctor assesses the concern, anatomy, medical history, medicines, allergies, prior procedures, and suitability.",
      "The doctor explains the permitted procedure, alternatives, material risks, realistic expectations, aftercare, and consent.",
      "Treatment may proceed only after all verification and clinical requirements are met; otherwise another plan is offered.",
    ],
    plan: "No treatment frequency or course is published because the exact Philippine-authorized product and label have not been verified. A future plan must come from the treating doctor and the permitted product information.",
    benefits: [
      `Manufacturer materials position polynucleotide products for cosmetic support related to ${item.focus}.`,
      "No clinic outcome, improvement level, permanence, or timeline is promised.",
      "Independent evidence and product-specific authorization must be reviewed before stronger claims are published.",
    ],
    candidates:
      "No one can be identified as a candidate from this preview. A qualified doctor must first confirm that the exact product is lawful, available, and clinically appropriate.",
    expectations:
      "Results, downtime, adverse effects, and timelines are intentionally not stated until the exact product, route, and approved professional information are verified.",
    aftercare: [
      "Product-specific aftercare will be provided only if a verified and authorized treatment proceeds.",
      "The treating doctor’s written instructions must take priority over website information.",
      "Unexpected or worsening symptoms require prompt clinic or emergency assessment as directed.",
    ],
    safety: [
      "Do not purchase or accept treatment from an unverified source.",
      "Do not infer authorization from packaging, social media, a reseller listing, or another country's website.",
      "The exact product, route, supplier, and Philippine status require documentary verification.",
    ],
    regulatory:
      "No current Philippine authorization for the exact requested Rejuran variant was verified in this review. Philippine FDA advisories have warned against specific unregistered Rejuran products, including REJURAN HEALER TRUESKIN ESSENCE (FDA Advisory 2022-1001) and Rejuran HB prefilled syringe (FDA Advisory 2025-0198). These advisories do not establish the status of every variant, but they make exact product-level verification mandatory before publication or treatment.",
    relatedEducation: { label: item.relatedLabel, href: item.related },
    faqs: [
      {
        question: "Can I book this treatment now?",
        answer:
          "No. This preview is for owner, doctor, legal, and regulatory review. Booking remains disabled until exact Philippine authorization and supply evidence are approved.",
      },
      {
        question: "Is Rejuran FDA approved in the Philippines?",
        answer:
          "This review did not verify current Philippine authorization for the exact requested variant. The website must not use a broad FDA-approved claim.",
      },
    ],
  })),
];

export function getSkinSupportContent(slug: string) {
  return skinSupportContent.find((item) => item.slug === slug);
}
