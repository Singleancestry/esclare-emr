# ESCLARE SEO Measurement Plan

Date: 2026-08-02

## Baseline

Capture the following from Search Console, Google Analytics, Business Profile, and booking records
on the approved production release date. Do not invent a pre-release baseline.

- Organic impressions, clicks, click-through rate, and average position by query and page.
- Local profile calls, directions, website visits, messages, and booking actions by branch.
- Public booking starts, saved requests, prepared-message fallbacks, and completion rate.
- Mobile/desktop Core Web Vitals for homepage, treatments, branches, education, and booking.
- Organic landing-page engagement without patient or health information.

## Search Clusters and Target Pages

| Cluster                           | Primary target                                | Main conversion                       |
| --------------------------------- | --------------------------------------------- | ------------------------------------- |
| Aesthetic clinic in Naga and Daet | `/` and `/branches`                           | Appointment request or branch contact |
| Diode laser and hair reduction    | `/diode-laser`                                | View prices or request assessment     |
| Pico laser and pigmentation       | Existing Pico treatment detail plus education | Request consultation                  |
| Acne scars and Fractional CO2     | Existing treatment detail and aftercare       | Doctor consultation request           |
| Facials                           | `/treatments` and relevant treatment details  | Select treatment and branch           |
| Botox and doctor procedures       | Existing doctor-procedure detail              | Doctor assessment request             |
| HIFU and lifting                  | Existing HIFU detail and education            | Suitability assessment request        |

## Privacy-Safe Events

Allowed event names:

- `booking_button_clicked`
- `booking_form_started`
- `booking_request_saved`
- `booking_contact_fallback_shown`
- `phone_clicked`
- `messenger_button_clicked`
- `directions_clicked`
- `treatment_page_viewed`
- `price_section_viewed`
- `branch_selected`
- `treatment_selected`
- `booking_form_error`

Allowed parameters are route, branch code, treatment slug, device class, and outcome code. Never send
names, phone numbers, email addresses, free text, medical concerns, appointment notes, patient IDs,
or authentication identifiers.

## Review Cadence

- 30 days: verify indexing, event quality, route errors, and branch-profile accuracy.
- 60 days: improve high-impression pages with weak click-through or conversion performance.
- 90 days: review content freshness, internal links, schema validity, Core Web Vitals, and the medical-review queue.

No ranking, traffic, citation, or conversion outcome is guaranteed.
