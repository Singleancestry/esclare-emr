export type PublicAnalyticsEvent =
  | "branch_selected"
  | "facebook_page_clicked"
  | "messenger_badge_dismissed"
  | "messenger_badge_shown"
  | "messenger_button_clicked"
  | "messenger_button_viewed"
  | "messenger_tooltip_shown";

type AnalyticsWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  fbq?: (command: "trackCustom", event: string, parameters: Record<string, unknown>) => void;
};

export function trackPublicEvent(
  event: PublicAnalyticsEvent,
  parameters: Record<string, string | boolean> = {},
) {
  if (typeof window === "undefined") return;
  const analyticsWindow = window as AnalyticsWindow;
  const payload = { event, ...parameters };
  analyticsWindow.dataLayer?.push(payload);
  analyticsWindow.fbq?.("trackCustom", event, parameters);
  window.dispatchEvent(new CustomEvent("esclare:analytics", { detail: payload }));
}
