export type SkinSupportContent = {
  slug: string;
  brand: "MCCM";
  positioning: string;
  image: string;
  imageAlt: string;
  classification: string;
  assessment: string;
  frequency: string | null;
  duration: string | null;
  downtime: string | null;
  areas: ReadonlyArray<string>;
  ingredients: ReadonlyArray<string>;
  overview: ReadonlyArray<string>;
  unique: string;
  process: ReadonlyArray<string>;
  plan: string;
  benefits: ReadonlyArray<string>;
  candidates: string;
  expectations: string;
  aftercare: ReadonlyArray<string>;
  safety: ReadonlyArray<string>;
  relatedEducation: { label: string; href: string };
  faqs: ReadonlyArray<{ question: string; answer: string }>;
};

const commonAftercare = [
  "Use gentle skincare and the sun protection recommended by the treating professional.",
  "Avoid picking, scrubbing, excessive heat, and strong active products while the area is sensitive.",
  "Contact the clinic for worsening pain, marked swelling, blistering, discharge, or another unexpected reaction.",
] as const;

export const skinSupportContent: ReadonlyArray<SkinSupportContent> = [
  {
    slug: "mccm-exosome-pdrn",
    brand: "MCCM",
    positioning:
      "Professional skin support for hydration, elasticity, and smoother-looking texture.",
    image: "/images/optimized/treatments/skin-support/products/mccm-exosome-pdrn-studio.webp",
    imageAlt: "MCCM Exosome PDRN professional-use box and amber vial",
    classification: "Professional skin-support treatment",
    assessment: "Assessment recommended to determine suitability and personalize the plan.",
    frequency: null,
    duration: null,
    downtime: null,
    areas: ["Face", "Selected areas assessed by the provider"],
    ingredients: ["PDRN derived from salmon DNA", "Hydration-supporting ingredients"],
    overview: [
      "The supplied MCCM material describes Exosome PDRN as a professional skin-support product intended to improve the appearance of hydration, elasticity, and texture.",
      "The document pairs it with GEL DNA in selected protocols and presents it for aesthetic skin-quality support. ESCLARE describes these as cosmetic goals rather than guaranteed or medical outcomes.",
    ],
    unique:
      "The treatment is planned around the assessed concern and may be combined with other professional steps only when appropriate for the client and the exact products being used.",
    process: [
      "Review the skin concern, sensitivity, current products, recent procedures, and relevant health history.",
      "Clean and prepare the selected treatment area.",
      "Perform the professional protocol selected for the assessed concern.",
      "Finish with calming support, sun protection guidance, and individualized aftercare.",
    ],
    plan: "The supplied document does not establish a universal course or treatment interval. Session planning is individualized after assessment and response to treatment.",
    benefits: [
      "Supports a more hydrated appearance",
      "May improve the look of elasticity and smoothness",
      "Supports refreshed-looking texture within a professional skin-care plan",
    ],
    candidates:
      "Adults seeking professional support for dryness, dullness, or uneven-looking texture may request assessment. Active irritation, infection, allergy concerns, recent procedures, pregnancy, or current medicines may change the plan.",
    expectations:
      "Skin response varies. The supplied photographs illustrate individual experiences and do not guarantee the same result or timeline for another person.",
    aftercare: commonAftercare,
    safety: [
      "Treatment should be performed only after the skin and current routine have been assessed.",
      "Do not apply professional products at home or combine them with unapproved active treatments.",
      "Tell the provider about allergies, active irritation, infection, pregnancy, medicines, and recent procedures.",
    ],
    relatedEducation: {
      label: "Read the PDRN and polynucleotide guide",
      href: "/skin-education/pdrn-polynucleotides-guide",
    },
    faqs: [
      {
        question: "What is MCCM Exosome PDRN used for?",
        answer:
          "The supplied MCCM material positions it for aesthetic support related to hydration, elasticity, and smoother-looking texture.",
      },
      {
        question: "How long does a session take?",
        answer:
          "The supplied material does not state a complete session duration. ESCLARE confirms timing after selecting the appropriate protocol.",
      },
      {
        question: "How many sessions are recommended?",
        answer:
          "No universal course is specified in the supplied document. Recommendations depend on assessment, treatment response, and the selected protocol.",
      },
      {
        question: "Is there downtime?",
        answer:
          "The supplied document does not provide a standard downtime classification. Temporary sensitivity depends on the treatment steps performed with the product.",
      },
      {
        question: "Is an assessment recommended?",
        answer:
          "Yes. Assessment helps the provider review the concern, skin condition, current products, recent procedures, and suitability.",
      },
    ],
  },
  {
    slug: "mccm-eye-contour",
    brand: "MCCM",
    positioning:
      "Professional Out Contour eye-area support for hydration, firmness, puffiness, and dark-circle concerns.",
    image: "/images/optimized/treatments/skin-support/products/mccm-eye-contour-studio.webp",
    imageAlt: "MCCM Out Contour Cocktail box and amber vial",
    classification: "Professional eye-contour treatment",
    assessment: "Assessment recommended for this sensitive treatment area.",
    frequency: null,
    duration: null,
    downtime: null,
    areas: ["Eye contour"],
    ingredients: [
      "Acetyl Hexapeptide-8",
      "Dimethylaminoethanol Tartrate",
      "Tocopherol",
      "Sodium Pyruvate",
      "Panthenol",
    ],
    overview: [
      "The supplied MCCM material describes Out Contour Cocktail for hydration and firmness around the eyes and for the appearance of puffiness, dark circles, and expression lines.",
      "Because the eye contour is sensitive, the provider assesses skin integrity, current products, recent procedures, and suitability before selecting a protocol.",
    ],
    unique:
      "The formula combines several ingredients presented by MCCM for moisture, firmness, and eye-contour appearance support within a carefully controlled professional treatment.",
    process: [
      "Assess the eye-area concern, skin condition, sensitivities, medicines, and recent procedures.",
      "Gently cleanse and prepare the eye contour.",
      "Perform the selected professional protocol while keeping product away from the eye itself.",
      "Review gentle aftercare and signs that require prompt advice.",
    ],
    plan: "The supplied material does not state a universal treatment interval or course. Timing is personalized according to the concern, tolerance, and response.",
    benefits: [
      "Supports hydration around the eye contour",
      "May improve the look of firmness",
      "Addresses the appearance of puffiness, dark circles, and expression lines",
    ],
    candidates:
      "Adults concerned about dry or tired-looking eye-contour skin may request assessment. Active irritation, infection, eye symptoms, allergies, recent procedures, pregnancy, or prescription products may require another plan.",
    expectations:
      "The treatment supports cosmetic appearance goals. Individual response varies, and it is not presented as treatment for an eye condition.",
    aftercare: commonAftercare,
    safety: [
      "Keep professional products out of the eye and do not use them as home treatments.",
      "Tell the provider about eye conditions, allergies, active irritation, infection, medicines, and recent procedures.",
      "Seek prompt advice for eye pain, vision change, severe swelling, or another unexpected reaction.",
    ],
    relatedEducation: {
      label: "Read the professional skincare guide",
      href: "/skin-education/mccm-professional-skincare-guide",
    },
    faqs: [
      {
        question: "What does MCCM Out Contour target?",
        answer:
          "The supplied material positions it for hydration, firmness, puffiness, dark-circle appearance, and expression-line concerns around the eye contour.",
      },
      {
        question: "What ingredients are listed?",
        answer:
          "The supplied document lists Acetyl Hexapeptide-8, Dimethylaminoethanol Tartrate, Tocopherol, Sodium Pyruvate, and Panthenol.",
      },
      {
        question: "How long does treatment take?",
        answer:
          "A complete session duration is not stated in the supplied document. Timing depends on the selected professional protocol.",
      },
      {
        question: "Is there downtime?",
        answer:
          "The supplied material does not provide a standard downtime classification. The provider explains expected temporary reactions for the selected protocol.",
      },
      {
        question: "Why is assessment important?",
        answer:
          "The eye contour is sensitive. Assessment helps identify irritation, eye symptoms, allergies, recent procedures, and other factors that may change the plan.",
      },
    ],
  },
  {
    slug: "mccm-brightening-system",
    brand: "MCCM",
    positioning:
      "An area-specific professional brightening plan using selected MCCM peel and tone-support options.",
    image: "/images/optimized/treatments/skin-support/products/mccm-brightening-studio.webp",
    imageAlt: "MCCM professional brightening peel product bottle",
    classification: "Professional peel and tone-support treatment",
    assessment: "Assessment recommended to select the product, area, and treatment intensity.",
    frequency: "Selected peel protocols in the supplied material are spaced every 15 or 21 days.",
    duration: null,
    downtime: null,
    areas: ["Face", "Body areas selected after assessment"],
    ingredients: [
      "Whitening Peel: arbutin, citric acid, lactic acid, kojic acid, salicylic acid",
      "Purple Peel 4: 20% TCA and 30% retinoic acid",
      "Melano Out: tranexamic acid, nicotinamide mononucleotide, acetyl glucosamine, vitamin C",
    ],
    overview: [
      "The supplied MCCM material presents professional peel and tone-support options for uneven-looking tone, pigmentation concerns, post-acne marks, and selected face or body areas.",
      "Whitening Peel is described as a superficial peel for all skin types and face or body use. Purple Peel 4 is a more intensive professional peel, so product selection and exposure are provider decisions.",
    ],
    unique:
      "The service is planned as a system because assessment, area preparation, product selection, professional application, calming care, and aftercare are coordinated rather than treated as one universal peel.",
    process: [
      "Assess the area, skin integrity, sensitivity, current products, sun exposure, and recent procedures.",
      "Clean and prepare the selected area.",
      "Apply the selected professional MCCM product using the clinic protocol.",
      "Complete calming care and review sun protection and recovery guidance.",
    ],
    plan: "The supplied material lists 15-day spacing for Whitening Peel and selected combination protocols, and 21-day spacing for Purple Peel 4. The provider selects the appropriate option and course after assessment.",
    benefits: [
      "Supports clearer, more even-looking tone",
      "Provides professional exfoliation selected for the assessed concern",
      "Allows face or body-area planning with sun-protection-led aftercare",
    ],
    candidates:
      "Adults concerned about dullness, uneven-looking tone, hyperpigmentation, or post-acne marks may request assessment. Active irritation, infection, open skin, recent tanning, strong topical products, pregnancy, or previous peel reactions may require another plan.",
    expectations:
      "Temporary sensitivity or visible peeling may occur depending on the product and intensity. Results vary by area, baseline concern, protocol, and aftercare.",
    aftercare: [
      "Use the recommended broad-spectrum sun protection consistently.",
      "Avoid picking, scrubbing, excessive heat, and strong active products while the area is recovering.",
      "Contact the clinic for marked swelling, blistering, worsening pain, discharge, or another unexpected reaction.",
    ],
    safety: [
      "Professional peel strengths, layers, timing, and neutralization are provider decisions and are not home-use instructions.",
      "Tell the provider about allergies, pregnancy, active irritation, infection, recent tanning, medicines, and previous peel reactions.",
      "Do not combine the treatment with unapproved active products or other procedures during recovery.",
    ],
    relatedEducation: {
      label: "Read the professional chemical peel guide",
      href: "/skin-education/mccm-professional-chemical-peels",
    },
    faqs: [
      {
        question: "Which MCCM peel is used?",
        answer:
          "The provider selects the product after assessing the concern, area, sensitivity, current products, and recent procedures. The supplied material includes Whitening, Glycolic, Azelaic, Salicylic, Glutathione, and Purple Peel 4 options.",
      },
      {
        question: "What areas may be treated?",
        answer:
          "The supplied Whitening Peel material lists face and body use. The exact area and product must still be selected after assessment.",
      },
      {
        question: "How often are treatments performed?",
        answer:
          "The supplied protocols list 15-day spacing for Whitening Peel and selected combination protocols, and 21-day spacing for Purple Peel 4. Your provider determines the appropriate interval.",
      },
      {
        question: "Is there downtime?",
        answer:
          "Downtime depends on the selected peel and intensity. Temporary sensitivity or visible peeling may occur, and the provider explains the expected recovery before treatment.",
      },
      {
        question: "What aftercare is important?",
        answer:
          "Use the recommended sun protection and gentle skincare, avoid picking or scrubbing, and pause strong active products until the provider advises that they may be resumed.",
      },
    ],
  },
];

export function getSkinSupportContent(slug: string) {
  return skinSupportContent.find((item) => item.slug === slug);
}
