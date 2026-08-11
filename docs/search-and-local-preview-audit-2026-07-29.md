# Search, AI Visibility, and Local Preview Audit - 2026-07-29

Status: preview branch. No preview URL should be submitted for indexing.

## Baseline Findings

| Priority | Finding                                                                                             | Resolution or disposition                                                                                                                   |
| -------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Critical | Preview deployments did not have a deployment-wide noindex boundary.                                | Vercel previews now emit `X-Robots-Tag: noindex, nofollow, noarchive`; preview `robots.txt` disallows `/`; root metadata also sets noindex. |
| High     | Auth and staff routes had no-store headers but no explicit crawler header.                          | All private route patterns now add `X-Robots-Tag: noindex, nofollow, noarchive`.                                                            |
| High     | Rejuran pages were public and sitemap-eligible despite unresolved product authorization.            | All six Skin Support pages are marked regulatory review, noindexed, non-bookable, and excluded from the sitemap.                            |
| Medium   | Naga had verified branch data but no dedicated canonical branch page.                               | Added `/branches/naga` using existing address, phone, hours, map, and authentic photography.                                                |
| Medium   | Organization schema pointed Naga to a section rather than a stable branch page.                     | Naga now has `/branches/naga#clinic`; Daet remains `/branches/daet#clinic`.                                                                 |
| Medium   | Treatment and education links used a stale combined MCCM slug.                                      | Replaced with the canonical Exosome PDRN review route and contextual education links.                                                       |
| Medium   | Production sitemap used the current time on every request.                                          | Still present; a stable content date should replace runtime timestamps in a later content-release pass.                                     |
| Low      | No Search Console, Bing, or Google Business Profile ownership evidence is stored in the repository. | Owner setup checklist below; no tokens or ownership claims were invented.                                                                   |

## Entity And Content Rules

- Clinic entity: Esclare Aesthetic Center.
- Location entities: ESCLARE Naga and ESCLARE Daet.
- Public treatment facts must include branch limitations, assessment requirements, price type, and
  the difference between a request and a confirmed appointment.
- Medical education identifies ESCLARE Editorial Team and leaves reviewer blank until a real
  qualified reviewer approves the article.
- Manufacturer claims, independent evidence, Philippine regulatory records, and clinic policy are
  presented as separate fact types.
- Review content is visible for preview review but carries noindex and does not emit Article or FAQ
  structured data.

## Owner Setup Checklist

### Google Search Console

1. Add `esclareph.com` as a domain property using the DNS token supplied by Google.
2. Do not invent or reuse a verification token from another property.
3. After production approval, submit `https://esclareph.com/sitemap.xml`.
4. Inspect `/home`, `/treatments`, `/branches/naga`, `/branches/daet`, `/diode-laser`, and approved
   education articles.
5. Review indexing, Core Web Vitals, manual actions, security issues, and treatment/location search
   queries monthly.

### Bing Webmaster Tools

1. Verify domain ownership or import the verified Search Console property.
2. Submit the production sitemap only after deployment approval.
3. Inspect the same priority URLs and monitor crawl/indexing errors.
4. Consider IndexNow only after confirming Hostinger/Vercel deployment ownership and a supported
   key-hosting workflow.

### Google Business Profile

For each branch, confirm the exact business name, address, phone, public hours, appointment URL,
website URL, category, services, and map pin. Use authentic branch photographs, answer questions
factually, respond to reviews without exposing patient information, and update temporary closures or
doctor availability promptly. Do not create fake reviews, duplicate listings, keyword-stuffed names,
or locations that do not serve clients.

## Recommended Initial Production URLs

Request indexing only after explicit production approval:

- `https://esclareph.com/home`
- `https://esclareph.com/treatments`
- `https://esclareph.com/diode-laser`
- `https://esclareph.com/glp-1-slimming`
- `https://esclareph.com/branches/naga`
- `https://esclareph.com/branches/daet`
- `https://esclareph.com/about`
- `https://esclareph.com/contact`

Do not request indexing for regulatory-review treatment pages or unpublished education drafts.

## Ninety-Day Maintenance Plan

- Weekly for the first month: review indexing errors, form failures, branch details, and 404s.
- Monthly: review Core Web Vitals, search queries, local-profile accuracy, security advisories, and
  regulatory records used in public claims.
- At 30 and 60 days: improve existing high-impression pages before creating new articles.
- At 90 days: audit metadata, internal links, content freshness, branch consistency, structured data,
  and the medical-review queue.

No ranking, indexing, traffic, Google citation, or AI-answer citation outcome is guaranteed.
