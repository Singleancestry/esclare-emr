export const PRIVACY_CONSENT_STORAGE_KEY = "esclare-privacy-consent-v1";
export const OPEN_PRIVACY_SETTINGS_EVENT = "esclare:open-privacy-settings";

export type PrivacyConsent = {
  version: 1;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export function parsePrivacyConsent(value: string | null): PrivacyConsent | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<PrivacyConsent>;
    if (
      parsed.version !== 1 ||
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.marketing !== "boolean" ||
      typeof parsed.updatedAt !== "string"
    ) {
      return null;
    }
    return parsed as PrivacyConsent;
  } catch {
    return null;
  }
}

export function readPrivacyConsent() {
  if (typeof window === "undefined") return null;
  try {
    return parsePrivacyConsent(window.localStorage.getItem(PRIVACY_CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
}
