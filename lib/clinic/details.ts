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
  timezone: "Asia/Manila";
  operatingHours: Readonly<Record<number, { opens: number; closes: number } | null>>;
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
    facebook: "https://www.facebook.com/EsclareLaserCenter/",
    messenger: "https://m.me/625552207599338",
    maps: "https://maps.app.goo.gl/HQZQLvRmMoRpFbzD8",
    schedule: "Daily, 10:00 AM-7:00 PM",
    timezone: "Asia/Manila",
    operatingHours: {
      0: { opens: 10 * 60, closes: 19 * 60 },
      1: { opens: 10 * 60, closes: 19 * 60 },
      2: { opens: 10 * 60, closes: 19 * 60 },
      3: { opens: 10 * 60, closes: 19 * 60 },
      4: { opens: 10 * 60, closes: 19 * 60 },
      5: { opens: 10 * 60, closes: 19 * 60 },
      6: { opens: 10 * 60, closes: 19 * 60 },
    },
    lastClient: "Last client at 6:30 PM",
    unavailableTreatments: [],
  },
  {
    code: "daet",
    name: "ESCLARE Daet",
    address: "J. Lukban Street, Daet, Camarines Norte, Philippines",
    phone: "0939 142 1928",
    phoneHref: "+639391421928",
    facebook: "https://www.facebook.com/esclaredaet/",
    messenger: "https://m.me/110985556908419",
    maps: "https://maps.app.goo.gl/EVxutbyww67M5dvJ7",
    schedule: "Tuesday-Sunday, 9:30 AM-6:00 PM",
    timezone: "Asia/Manila",
    operatingHours: {
      0: { opens: 9 * 60 + 30, closes: 18 * 60 },
      1: null,
      2: { opens: 9 * 60 + 30, closes: 18 * 60 },
      3: { opens: 9 * 60 + 30, closes: 18 * 60 },
      4: { opens: 9 * 60 + 30, closes: 18 * 60 },
      5: { opens: 9 * 60 + 30, closes: 18 * 60 },
      6: { opens: 9 * 60 + 30, closes: 18 * 60 },
    },
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

export function isBranchOpen(branch: ClinicBranch, date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: branch.timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday ?? "");
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? -1);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? -1);
  const hours = branch.operatingHours[dayIndex];

  if (!hours || hour < 0 || minute < 0) return false;
  const currentMinutes = hour * 60 + minute;
  return currentMinutes >= hours.opens && currentMinutes < hours.closes;
}
