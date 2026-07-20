# Cross-Browser Test Results

Chromium evidence from the earlier independent pass: public hero unit tests 5/5, public E2E
13/13, responsive public routes at 320 and 1920 pixels without horizontal overflow, MP4 MIME
and byte-range delivery, failed-video fallback, and reduced-motion behavior. A subsequent
source pass fixed skip navigation, modal background isolation, treatment lightbox focus,
tab-key behavior, focus contrast, stable-asset caching, and the hidden/offscreen hero startup
race.

The final retained Playwright evidence separates public and staff scope. The supported standalone
server passed 70/70 public cases across Chromium, Firefox, WebKit, mobile Chrome, and mobile
Safari. A separate development-fixture run passed 35/35 synthetic staff cases across the same
five projects. Hero missing-video fallback passed in every public project. Physical iOS/Android,
Edge, assistive technology, real authenticated staff, and production CDN/media behavior were not
run. Verdict: local automated cross-browser gate accepted; production browser gate remains open.
