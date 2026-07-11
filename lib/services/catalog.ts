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
  doctorRequired: boolean;
  public: boolean;
};

export type DiodePackage = {
  area: string;
  category: string;
  options: ReadonlyArray<{ sessions: number; price: number }>;
};

export const catalogEffectiveDate = "2026-07-01";

export const treatments: ReadonlyArray<Treatment> = [
  { slug: "korean-facial", name: "Korean Facial", category: "Facials", summary: "A multi-step cleansing, extraction, massage, mask, serum and hydration facial.", priceKind: "fixed", priceMin: 1800, unit: "session", doctorRequired: false, public: true },
  { slug: "hydrajet-peel", name: "HydraJet Peel", category: "Facials", summary: "A peel-focused facial with extraction, serum, cryotherapy, mask and light therapy.", priceKind: "fixed", priceMin: 1999, unit: "session", doctorRequired: false, public: true },
  { slug: "intense-hydrating", name: "Intense Hydrating Facial", category: "Facials", summary: "Hydration-focused facial with extraction, diamond peel, jelly mask and light therapy.", priceKind: "fixed", priceMin: 2000, unit: "session", doctorRequired: false, public: true },
  { slug: "basic-detox", name: "Basic Detox Facial", category: "Facials", summary: "A simple deep-cleansing facial for excess oil and impurities.", priceKind: "fixed", priceMin: 399, unit: "session", doctorRequired: false, public: true },
  { slug: "exfoliare", name: "Exfoliare Facial", category: "Facials", summary: "Cleansing and exfoliation with steam, extraction, high frequency, diamond peel and mask.", priceKind: "fixed", priceMin: 499, unit: "session", doctorRequired: false, public: true },
  { slug: "exfoliare-cryo", name: "Exfoliare + Cryo", category: "Facials", summary: "Exfoliare facial with cryotherapy and PDT LED.", priceKind: "fixed", priceMin: 599, unit: "session", doctorRequired: false, public: true },
  { slug: "acne-cleanse", name: "Acne Cleanse", category: "Facials", summary: "Deep cleansing and careful extraction for acne-prone skin.", priceKind: "range", priceMin: 499, priceMax: 599, unit: "session", doctorRequired: false, public: true },
  { slug: "pico-glow-face", name: "Pico Glow Face", category: "Laser and Brightening", summary: "Non-invasive laser care for the appearance of melasma, pigmentation and uneven tone.", priceKind: "fixed", priceMin: 3500, unit: "session", doctorRequired: false, public: true },
  { slug: "pico-glow-body", name: "Pico Glow Body Area", category: "Laser and Brightening", summary: "Brightening treatment for one eligible body area, subject to assessment of size and location.", priceKind: "fixed", priceMin: 2000, unit: "area/session", doctorRequired: false, public: true },
  { slug: "carbon-laser-peel", name: "Carbon Laser Peel", category: "Laser and Brightening", summary: "Laser peel for brighter-looking skin, oiliness, pores and texture.", priceKind: "fixed", priceMin: 3500, unit: "session", doctorRequired: false, public: true },
  { slug: "exilift-face", name: "Exilift Face", category: "Lifting and Contouring", summary: "RF and ultrasound-style facial tightening and contouring treatment.", priceKind: "fixed", priceMin: 1800, unit: "session", doctorRequired: false, public: true },
  { slug: "7d-hifu-face", name: "7D HIFU Face", category: "Lifting and Contouring", summary: "Non-invasive focused-ultrasound treatment for lifting and tightening.", priceKind: "fixed", priceMin: 4999, unit: "session", doctorRequired: false, public: true },
  { slug: "hifu-abdomen", name: "HIFU Abdomen", category: "Lifting and Contouring", summary: "Focused-ultrasound abdomen treatment; assessment determines the appropriate plan.", priceKind: "fixed", priceMin: 3999, unit: "session", doctorRequired: false, public: true },
  { slug: "hifu-flanks", name: "HIFU Flanks", category: "Lifting and Contouring", summary: "Focused-ultrasound treatment for the flank area.", priceKind: "fixed", priceMin: 4999, unit: "session", doctorRequired: false, public: true },
  { slug: "armtox", name: "Armtox / Barbie Arms", category: "Doctor Procedures", summary: "Botulinum toxin procedure for upper-arm contouring.", priceKind: "fixed", priceMin: 17000, doctorRequired: true, public: true },
  { slug: "sweatox", name: "Sweatox", category: "Doctor Procedures", summary: "Botulinum toxin procedure for excessive underarm sweating.", priceKind: "fixed", priceMin: 15000, doctorRequired: true, public: true },
  { slug: "jawtox", name: "Jawtox", category: "Doctor Procedures", summary: "Masseter botulinum toxin procedure for jaw tension and contouring.", priceKind: "fixed", priceMin: 10000, doctorRequired: true, public: true },
  { slug: "fine-lines", name: "Fine Lines and Wrinkles", category: "Doctor Procedures", summary: "Botulinum toxin treatment planned after doctor assessment.", priceKind: "fixed", priceMin: 250, unit: "unit", doctorRequired: true, public: true },
  { slug: "pdo-threads", name: "V-Lift / PDO Threads", category: "Doctor Procedures", summary: "Doctor-performed thread procedure using up to 20 PDO threads.", priceKind: "fixed", priceMin: 12000, doctorRequired: true, public: true },
  { slug: "rejuran-h", name: "Rejuran H / Healer", category: "Doctor Procedures", summary: "Doctor-assessed skin-rejuvenation procedure.", priceKind: "fixed", priceMin: 25000, doctorRequired: true, public: true },
  { slug: "rejuran-eye", name: "Rejuran I / Eye", category: "Doctor Procedures", summary: "Doctor-assessed eye rejuvenation procedure.", priceKind: "fixed", priceMin: 15000, doctorRequired: true, public: true },
  { slug: "rejuran-scar", name: "Rejuran S / Scar", category: "Doctor Procedures", summary: "Doctor-assessed procedure for acne-scar and texture concerns.", priceKind: "fixed", priceMin: 15000, doctorRequired: true, public: true },
  { slug: "fractional-laser", name: "Fractional Laser and Scar Care", category: "Doctor Procedures", summary: "Treatment plan and final price depend on doctor assessment and treatment area.", priceKind: "range", priceMin: 4000, priceMax: 7000, doctorRequired: true, public: true },
  { slug: "mccm-pdrn", name: "MCCM PDRN Skin Support", category: "Skin Support", summary: "Professional topical skin-support treatment for hydration and healthier-looking skin quality.", priceKind: "fixed", priceMin: 3800, unit: "session", doctorRequired: false, public: true },
  { slug: "hikari-drip", name: "Hikari Drip", category: "Wellness", summary: "Clinic-administered IV treatment, subject to suitability screening.", priceKind: "fixed", priceMin: 3000, unit: "session", doctorRequired: false, public: true },
  { slug: "zaguta-drip", name: "Zaguta Glutathione Drip", category: "Wellness", summary: "Clinic-administered IV treatment, subject to suitability screening.", priceKind: "fixed", priceMin: 2100, unit: "session", doctorRequired: false, public: true },
  { slug: "laser-circumcision", name: "Laser Circumcision", category: "Doctor Procedures", summary: "Licensed-doctor procedure. Medicine is not included; age and care requirements may affect the total.", priceKind: "starts_at", priceMin: 3999, doctorRequired: true, public: true },
];

export const diodePackages: ReadonlyArray<DiodePackage> = [
  ["4D Face", "Face", [3060, 4410, 5760, 7020, 8190]],
  ["4D Upper Lip", "Face", [1260, 1890, 2430, 2970, 3420]],
  ["4D Lower Lip", "Face", [1260, 1890, 2430, 2970, 3420]],
  ["4D Underarms", "Upper Body", [2070, 2970, 3870, 4680, 5400]],
  ["4D Full Arms", "Upper Body", [5310, 7740, 10080, 12060, 14040]],
  ["4D Chest", "Upper Body", [7560, 11160, 14400, 17460, 20520]],
  ["4D Full Back", "Upper Body", [7560, 11160, 14400, 17460, 20520]],
  ["4D Navel", "Upper Body", [2340, 3330, 4320, 5220, 6030]],
  ["4D Brazilian", "Intimate", [4500, 6480, 8460, 10170, 11700]],
  ["4D Bikini Line", "Intimate", [2340, 3870, 4860, 5760, 6480]],
  ["4D Upper Legs", "Lower Body", [6030, 8820, 11250, 13500, 15570]],
  ["4D Lower Legs", "Lower Body", [6840, 10080, 12960, 15840, 18180]],
  ["4D Full Legs", "Lower Body", [11520, 16740, 21600, 26100, 30240]],
].map(([area, category, prices]) => ({
  area: area as string,
  category: category as string,
  options: (prices as number[]).map((price, index) => ({ sessions: index + 2, price })),
}));

export function formatTreatmentPrice(treatment: Treatment) {
  if (treatment.priceKind === "assessment" || treatment.priceMin === undefined) return "By assessment";
  const money = (amount: number) => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(amount);
  const prefix = treatment.priceKind === "starts_at" ? "Starts at " : "";
  const range = treatment.priceMax ? `${money(treatment.priceMin)}-${money(treatment.priceMax)}` : money(treatment.priceMin);
  return `${prefix}${range}${treatment.unit ? ` / ${treatment.unit}` : ""}`;
}

export const treatmentCategories = Array.from(new Set(treatments.map((item) => item.category)));
