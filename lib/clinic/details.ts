export type BranchCode = "naga" | "daet";

export type ClinicBranch = {
  code: BranchCode;
  name: string;
  address: string;
  phone: string;
  phoneHref: string;
  facebook: string;
  messenger: string;
  maps: string;
  schedule: string;
  lastClient?: string;
  unavailableTreatments: ReadonlyArray<string>;
};

export const clinicBranches: ReadonlyArray<ClinicBranch> = [
  {
    code: "naga",
    name: "ESCLARE Naga",
    address: "Elias Angeles Street corner Paz Street, Naga City, Philippines",
    phone: "+63 920 735 1379",
    phoneHref: "+639207351379",
    facebook: "https://www.facebook.com/esclare.aesthetic",
    messenger: "https://m.me/esclare.aesthetic",
    maps: "https://maps.app.goo.gl/HQZQLvRmMoRpFbzD8",
    schedule: "Daily, 10:00 AM-7:00 PM",
    lastClient: "Last client at 6:30 PM",
    unavailableTreatments: [],
  },
  {
    code: "daet",
    name: "ESCLARE Daet",
    address: "J. Lukban Street, Daet, Camarines Norte, Philippines",
    phone: "0939 142 1928",
    phoneHref: "+639391421928",
    facebook: "https://www.facebook.com/esclaredaet",
    messenger: "https://m.me/110985556908419",
    maps: "https://maps.app.goo.gl/EVxutbyww67M5dvJ7",
    schedule: "Tuesday-Sunday, 9:30 AM-6:00 PM",
    unavailableTreatments: ["Fractional Laser and Scar Care"],
  },
];

export const bookingRules = {
  requiredPersonalInformation: ["fullName"],
  confirmationMethods: ["Facebook", "Phone call", "SMS"],
  depositRequired: false,
  changeNoticeHours: 2,
  lateArrivalPolicy: "Late arrivals are accommodated based on availability.",
  noShowPolicy: "Clients who miss an appointment may book again without restriction.",
} as const;

export function getBranch(code: BranchCode) {
  return clinicBranches.find((branch) => branch.code === code)!;
}

export function isTreatmentAvailable(branchCode: BranchCode, treatmentName: string) {
  return !getBranch(branchCode).unavailableTreatments.includes(treatmentName);
}
