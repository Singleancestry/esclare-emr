export type TreatmentNavigationItem = {
  label: string;
  href: string;
  catalogCategory?: string;
};

export const treatmentNavigationItems: ReadonlyArray<TreatmentNavigationItem> = [
  { label: "All Treatments", href: "/treatments" },
  { label: "Facial", href: "/treatments#facials", catalogCategory: "Facials" },
  {
    label: "Laser Brightening / Laser Treatments",
    href: "/treatments#laser-and-brightening",
    catalogCategory: "Laser and Brightening",
  },
  { label: "4D Diode", href: "/treatments#4d-diode-packages" },
  {
    label: "Lifting",
    href: "/treatments#lifting-and-contouring",
    catalogCategory: "Lifting and Contouring",
  },
  {
    label: "Doctor Procedures",
    href: "/treatments#doctor-procedures",
    catalogCategory: "Doctor Procedures",
  },
  { label: "Wellness", href: "/treatments#wellness", catalogCategory: "Wellness" },
  {
    label: "Skin Support",
    href: "/treatments/skin-support",
    catalogCategory: "Skin Support",
  },
] as const;
