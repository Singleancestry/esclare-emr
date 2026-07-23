export type PriceKind = "fixed" | "starts_at" | "range" | "assessment";

export type Treatment = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  priceKind: PriceKind;
  priceMin?: number;
  priceMax?: number;
  unit?: string;
  displayPrice?: string;
  doctorRequired: boolean;
  public: boolean;
};

export const GLP1_PROGRAM_LABEL = "GLP-1 Slimming — ₱21,500 for a 4-week treatment program";

export type DiodePackage = {
  area: string;
  category: string;
  options: ReadonlyArray<{ sessions: number; price: number }>;
};

export const catalogEffectiveDate = "2026-07-01";

export const treatments: ReadonlyArray<Treatment> = [
  {
    slug: "korean-facial",
    name: "Korean Facial",
    category: "Facials",
    summary: "A multi-step cleansing, extraction, massage, mask, serum and hydration facial.",
    priceKind: "fixed",
    priceMin: 1800,
    unit: "session",
    doctorRequired: false,
    public: true,
  },
  {
    slug: "hydrajet-peel",
    name: "HydraJet Peel",
    category: "Facials",
    summary: "A peel-focused facial with extraction, serum, cryotherapy, mask and light therapy.",
    priceKind: "fixed",
    priceMin: 1999,
    unit: "session",
    doctorRequired: false,
    public: true,
  },
  {
    slug: "intense-hydrating",
    name: "Intense Hydrating Facial",
    category: "Facials",
    summary:
      "Hydration-focused facial with extraction, diamond peel, jelly mask and light therapy.",
    priceKind: "fixed",
    priceMin: 2000,
    unit: "session",
    doctorRequired: false,
    public: true,
  },
  {
    slug: "basic-detox",
    name: "Basic Detox Facial",
    category: "Facials",
    summary: "A simple deep-cleansing facial for excess oil and impurities.",
    priceKind: "fixed",
    priceMin: 399,
    unit: "session",
    doctorRequired: false,
    public: true,
  },
  {
    slug: "exfoliare",
    name: "Exfoliare Facial",
    category: "Facials",
    summary:
      "Cleansing and exfoliation with steam, extraction, high frequency, diamond peel and mask.",
    priceKind: "fixed",
    priceMin: 499,
    unit: "session",
    doctorRequired: false,
    public: true,
  },
  {
    slug: "exfoliare-cryo",
    name: "Exfoliare + Cryo",
    category: "Facials",
    summary: "Exfoliare facial with cryotherapy and PDT LED.",
    priceKind: "fixed",
    priceMin: 599,
    unit: "session",
    doctorRequired: false,
    public: true,
  },
  {
    slug: "acne-cleanse",
    name: "Acne Cleanse",
    category: "Facials",
    summary: "Deep cleansing and careful extraction for acne-prone skin.",
    priceKind: "range",
    priceMin: 499,
    priceMax: 599,
    unit: "session",
    doctorRequired: false,
    public: true,
  },
  {
    slug: "pico-glow-face",
    name: "Pico Glow Face",
    category: "Laser and Brightening",
    summary: "Non-invasive laser care for the appearance of melasma, pigmentation and uneven tone.",
    priceKind: "fixed",
    priceMin: 3500,
    unit: "session",
    doctorRequired: false,
    public: true,
  },
  {
    slug: "pico-glow-body",
    name: "Pico Glow Body Area",
    category: "Laser and Brightening",
    summary:
      "Brightening treatment for one eligible body area, subject to assessment of size and location.",
    priceKind: "fixed",
    priceMin: 2000,
    unit: "area/session",
    doctorRequired: false,
    public: true,
  },
  {
    slug: "carbon-laser-peel",
    name: "Carbon Laser Peel",
    category: "Laser and Brightening",
    summary: "Laser peel for brighter-looking skin, oiliness, pores and texture.",
    priceKind: "fixed",
    priceMin: 3500,
    unit: "session",
    doctorRequired: false,
    public: true,
  },
  {
    slug: "exilift-face",
    name: "Exilift Face",
    category: "Lifting and Contouring",
    summary: "RF and ultrasound-style facial tightening and contouring treatment.",
    priceKind: "fixed",
    priceMin: 1800,
    unit: "session",
    doctorRequired: false,
    public: true,
  },
  {
    slug: "7d-hifu-face",
    name: "7D HIFU Face",
    category: "Lifting and Contouring",
    summary: "Non-invasive focused-ultrasound treatment for lifting and tightening.",
    priceKind: "fixed",
    priceMin: 4999,
    unit: "session",
    doctorRequired: false,
    public: true,
  },
  {
    slug: "hifu-abdomen",
    name: "HIFU Abdomen",
    category: "Lifting and Contouring",
    summary: "Focused-ultrasound abdomen treatment; assessment determines the appropriate plan.",
    priceKind: "fixed",
    priceMin: 3999,
    unit: "session",
    doctorRequired: false,
    public: true,
  },
  {
    slug: "hifu-flanks",
    name: "HIFU Flanks",
    category: "Lifting and Contouring",
    summary: "Focused-ultrasound treatment for the flank area.",
    priceKind: "fixed",
    priceMin: 4999,
    unit: "session",
    doctorRequired: false,
    public: true,
  },
  {
    slug: "armtox",
    name: "Armtox / Barbie Arms",
    category: "Doctor Procedures",
    summary: "Botulinum toxin procedure for upper-arm contouring.",
    priceKind: "fixed",
    priceMin: 17000,
    doctorRequired: true,
    public: true,
  },
  {
    slug: "sweatox",
    name: "Sweatox",
    category: "Doctor Procedures",
    summary: "Botulinum toxin procedure for excessive underarm sweating.",
    priceKind: "fixed",
    priceMin: 15000,
    doctorRequired: true,
    public: true,
  },
  {
    slug: "jawtox",
    name: "Jawtox",
    category: "Doctor Procedures",
    summary: "Masseter botulinum toxin procedure for jaw tension and contouring.",
    priceKind: "fixed",
    priceMin: 10000,
    doctorRequired: true,
    public: true,
  },
  {
    slug: "fine-lines",
    name: "Fine Lines and Wrinkles",
    category: "Doctor Procedures",
    summary: "Botulinum toxin treatment planned after doctor assessment.",
    priceKind: "fixed",
    priceMin: 250,
    unit: "unit",
    doctorRequired: true,
    public: true,
  },
  {
    slug: "hiko-nose-lift",
    name: "HIKO Nose Lift",
    category: "Doctor Procedures",
    summary:
      "Doctor-performed nose thread procedure planned after an in-person assessment of anatomy, goals and suitability.",
    priceKind: "assessment",
    doctorRequired: true,
    public: true,
  },
  {
    slug: "pdo-threads",
    name: "V-Lift / PDO Threads",
    category: "Doctor Procedures",
    summary: "Doctor-performed thread procedure using up to 20 PDO threads.",
    priceKind: "fixed",
    priceMin: 12000,
    doctorRequired: true,
    public: true,
  },
  {
    slug: "rejuran-h",
    name: "Rejuran H / Healer",
    category: "Doctor Procedures",
    summary: "Doctor-assessed skin-rejuvenation procedure.",
    priceKind: "fixed",
    priceMin: 25000,
    doctorRequired: true,
    public: true,
  },
  {
    slug: "rejuran-eye",
    name: "Rejuran I / Eye",
    category: "Doctor Procedures",
    summary: "Doctor-assessed eye rejuvenation procedure.",
    priceKind: "fixed",
    priceMin: 15000,
    doctorRequired: true,
    public: true,
  },
  {
    slug: "rejuran-scar",
    name: "Rejuran S / Scar",
    category: "Doctor Procedures",
    summary: "Doctor-assessed procedure for acne-scar and texture concerns.",
    priceKind: "fixed",
    priceMin: 15000,
    doctorRequired: true,
    public: true,
  },
  {
    slug: "fractional-laser",
    name: "Fractional Laser and Scar Care",
    category: "Doctor Procedures",
    summary: "Treatment plan and final price depend on doctor assessment and treatment area.",
    priceKind: "range",
    priceMin: 4000,
    priceMax: 7000,
    doctorRequired: true,
    public: true,
  },
  {
    slug: "mccm-pdrn",
    name: "MCCM PDRN Glow & Eye Rejuvenation",
    category: "Skin Support",
    summary:
      "Professional brightening, hydration and eye-contour treatment using MCCM Glutathione Peeling, PDRN and Out Contour Cocktail.",
    priceKind: "fixed",
    priceMin: 3800,
    unit: "session",
    doctorRequired: false,
    public: true,
  },
  {
    slug: "glp-1-slimming",
    name: "GLP-1 Slimming",
    category: "Wellness",
    summary:
      "A four-week, medically guided weight-management program with consultation, eligibility screening, individualized medication selection where appropriate, and progress monitoring.",
    priceKind: "fixed",
    priceMin: 21500,
    unit: "4-week treatment program",
    displayPrice: GLP1_PROGRAM_LABEL,
    doctorRequired: true,
    public: true,
  },
  {
    slug: "hikari-drip",
    name: "Hikari Drip",
    category: "Wellness",
    summary: "Clinic-administered IV treatment, subject to suitability screening.",
    priceKind: "fixed",
    priceMin: 3000,
    unit: "session",
    doctorRequired: false,
    public: true,
  },
  {
    slug: "zaguta-drip",
    name: "Zaguta Glutathione Drip",
    category: "Wellness",
    summary: "Clinic-administered IV treatment, subject to suitability screening.",
    priceKind: "fixed",
    priceMin: 2100,
    unit: "session",
    doctorRequired: false,
    public: true,
  },
  {
    slug: "laser-circumcision",
    name: "Laser Circumcision",
    category: "Doctor Procedures",
    summary:
      "Licensed-doctor procedure. Medicine is not included; age and care requirements may affect the total.",
    priceKind: "starts_at",
    priceMin: 3999,
    doctorRequired: true,
    public: true,
  },
];

export const diodePackages: ReadonlyArray<DiodePackage> = [
  ["Face", "Face", [2000, 3600, 5400, 7200, 9000, 10800]],
  ["Upper Lip", "Face", [900, 1620, 2430, 3240, 4050, 4860]],
  ["Lower Lip", "Face", [900, 1620, 2430, 3240, 4050, 4860]],
  ["Full Beard", "Face", [1800, 3240, 4860, 6480, 8100, 9720]],
  ["Underarms", "Upper Body", [1500, 2700, 4050, 5400, 6750, 8100]],
  ["Full Arms", "Upper Body", [2300, 4140, 6210, 8280, 10350, 12420]],
  ["Chest", "Upper Body", [4500, 8100, 12150, 16200, 20250, 24300]],
  ["Full Back", "Upper Body", [5000, 9000, 13500, 18000, 22500, 27000]],
  ["Navel", "Upper Body", [1500, 2700, 4050, 5400, 6750, 8100]],
  ["Brazilian", "Intimate", [3000, 5400, 8100, 10800, 13500, 16200]],
  ["Bikini Line", "Intimate", [1800, 3240, 4860, 6480, 8100, 9720]],
  ["Upper Legs", "Lower Body", [3900, 7020, 10530, 14040, 17550, 21060]],
  ["Lower Legs", "Lower Body", [4200, 7560, 11340, 15120, 18900, 22680]],
  ["Full Legs", "Lower Body", [7000, 12600, 18900, 25200, 31500, 37800]],
].map(([area, category, prices]) => ({
  area: area as string,
  category: category as string,
  options: (prices as number[]).map((price, index) => ({ sessions: index + 1, price })),
}));

export function formatTreatmentPrice(treatment: Treatment) {
  if (treatment.displayPrice) return treatment.displayPrice;
  if (treatment.priceKind === "assessment" || treatment.priceMin === undefined)
    return "By assessment";
  const money = (amount: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(amount);
  const prefix = treatment.priceKind === "starts_at" ? "Starts at " : "";
  const range = treatment.priceMax
    ? `${money(treatment.priceMin)}-${money(treatment.priceMax)}`
    : money(treatment.priceMin);
  return `${prefix}${range}${treatment.unit ? ` / ${treatment.unit}` : ""}`;
}

export const treatmentCategories = Array.from(new Set(treatments.map((item) => item.category)));
