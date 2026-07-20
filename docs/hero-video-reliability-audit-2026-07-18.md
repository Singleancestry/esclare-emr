# Hero Video Reliability Audit

Audit date: 2026-07-18

## Verdict

**Status: conditionally resolved for tested Chromium environments.** The hero now has a real static poster, waits for successful playback before exposing the video, handles autoplay and media failures without a blank hero, avoids video loading for reduced-motion users, and has automated regression coverage. Physical Safari, iOS, Android, Samsung Internet, low-power mode, and data-saver testing were not available and remain release evidence gaps.

## Current implementation

- Component: `components/public/hero-media.tsx`
- Layout owner: `components/public/authentic-hero.tsx`
- Styling: `app/globals.css`
- Video: `public/media/flying-particles.mp4`
- Desktop poster: `public/images/optimized/clinic/esclare-naga-hero-v2.webp`
- Mobile poster: `public/images/optimized/clinic/esclare-naga-hero-mobile-v2.webp`
- Delivery: static Next.js asset, currently deployed through Vercel

## Media inventory

| Property                         | Verified result                                                    | Evidence class                       |
| -------------------------------- | ------------------------------------------------------------------ | ------------------------------------ |
| Container                        | ISO Base Media MP4 (`isom`)                                        | Confirmed by file atoms              |
| Video codec                      | H.264/AVC (`avc1`)                                                 | Confirmed by file atoms              |
| Audio                            | AAC audio track (`mp4a`, `soun`)                                   | Confirmed by file atoms              |
| Dimensions                       | 1280 x 720 (16:9)                                                  | Confirmed in Chromium media metadata |
| Duration                         | 10.005 seconds                                                     | Confirmed in Chromium media metadata |
| File size                        | 2,512,364 bytes                                                    | Confirmed on disk and HTTP response  |
| Approximate average bitrate      | About 2.0 Mbps including container/audio                           | Derived from size and duration       |
| Frame rate/profile/color profile | Not verified                                                       | No local media probe was available   |
| SHA-256                          | `CBB750A6D850B489700BD8A85510D7F426C6D99D0F86BE206C6AE225DF3FD68B` | Confirmed on disk                    |

The audio track is unnecessary for a muted decorative hero. It is not a confirmed autoplay failure because the element is muted before playback, but a no-audio derivative remains a useful future optimization.

## Root-cause analysis

### Confirmed

1. The previous implementation had no HTML `poster` and used only a solid maroon fallback. A delayed or failed video therefore could not preserve the intended photographic composition.
2. Video visibility was enabled on `loadeddata`/`canplay`, which proves decodability but not successful autoplay. A browser could reject `play()` while the component still faded in a non-playing frame.
3. The previous `play()` rejection was swallowed. There was no explicit fallback state, user-interaction recovery, media-error state, or production-safe observable state.
4. `preload="auto"` encouraged downloading the complete 2.5 MB asset even when motion was reduced or playback was unavailable.
5. Reduced-motion handling still loaded video and sought to the final frame, so it did not avoid media cost or decoding work.

### Strongly supported contributing factors

1. Mobile autoplay policy, tab suspension, low-power mode, and memory pressure can reject or pause decorative media. The old implementation had no controlled recovery path.
2. A 2.5 MB hero loaded with `preload="auto"` can start late on constrained mobile networks.
3. The unnecessary AAC track adds bytes and another media stream to parse, although it was muted and was not independently proven to cause a failure.

### Possible, not verified

- Device-specific codec, GPU, or Safari caching behavior may have contributed to the originally reported intermittent failure.
- The local Chromium GPU mailbox messages in ignored `debug.log` came from browser rendering infrastructure; no evidence ties them specifically to this hero.

## Fix applied

- Added desktop and mobile photographic poster sources plus a native video `poster` attribute.
- Deferred the `<source>` until client motion preference is known; reduced-motion users receive the poster only.
- Changed preload from `auto` to `metadata`.
- Tied `is-visible` to successful `play()`/`playing`, not merely `canplay`.
- Added explicit `poster`, `playing`, `complete`, and `fallback` states.
- Catch autoplay rejection and allow at most one retry after a valid pointer or keyboard interaction.
- Pause when hidden or outside the viewport and resume only after playback previously succeeded.
- Preserve the poster on network, decode, or media-element errors.
- Added one-year immutable cache headers for `/media/*` in the Next.js configuration.
- Preserved the existing design crop, one-shot ending, and particle finish.

## Automated tests

### Component tests

`tests/unit/hero-media.test.tsx` verifies:

- responsive poster and native video attributes;
- video source, MIME declaration, and metadata preload;
- poster-to-video transition only after playback;
- fallback restoration after media failure;
- reduced-motion behavior with no video source request;
- bounded recovery after autoplay rejection, including a repeated-rejection test.

Result: **5/5 passed** as part of **42/42 unit tests**.

### End-to-end tests

`tests/e2e/public-media.spec.ts` verifies:

- failed media request leaves poster, headline, and calls to action usable;
- reduced motion keeps a poster and avoids a video source;
- mobile route navigation away and back preserves a usable hero;
- 390 px viewport has no horizontal overflow.

Result: **20/20 Chromium E2E tests passed**.

## Manual browser evidence

| Test                            |      Runs | Failures | Result                                                                                      |
| ------------------------------- | --------: | -------: | ------------------------------------------------------------------------------------------- |
| Warm-cache reload at 1440 x 900 |         8 |        0 | Every run reached `playing`, `readyState=4`, unpaused playback, and a non-zero current time |
| Responsive layout widths        |         9 |        0 | 320, 375, 390, 430, 768, 1024, 1366, 1440, and 1920 px had no horizontal overflow           |
| Desktop visual inspection       |         1 |        0 | Headline and actions unobstructed; video crop framed correctly                              |
| Mobile visual inspection        |         1 |        0 | Headline and actions unobstructed; no fullscreen takeover or overflow in Chromium emulation |
| Local console warnings/errors   | 1 session |        0 | No page console warning/error captured                                                      |

## Delivery evidence

Local Next.js response after the fix:

- `200 OK`
- `Content-Type: video/mp4`
- `Content-Length: 2512364`
- `Accept-Ranges: bytes`
- `Cache-Control: public, max-age=31536000, immutable`
- Range request `bytes=0-1023` returned `206 Partial Content` and the correct `Content-Range`.

The pre-fix Vercel deployment also returned correct MIME type and range responses, but its cache policy was `max-age=0, must-revalidate`. The new immutable media policy must be rechecked after this audit branch is deployed.

## Failure behavior matrix

| Scenario                                      | Evidence                                                                                         | User-visible result                                              |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| 404/403/500/aborted media request             | Automated aborted-request test plus common `onError` path                                        | Poster remains, content and actions remain usable                |
| Autoplay rejection                            | Component test                                                                                   | Poster remains; one interaction can retry                        |
| Reduced motion                                | Component and E2E tests                                                                          | No video source is attached; poster remains                      |
| Route away/back                               | E2E test                                                                                         | Hero remounts and remains usable                                 |
| Tab hidden/outside viewport                   | Code inspection                                                                                  | Playback pauses; resumes only after prior success                |
| Incorrect MIME/unsupported codec/corrupt file | Common media `onError` path inspected, not separately browser-injected                           | Poster remains                                                   |
| Slow/interrupted transfer                     | Poster-first architecture inspected; aborted request tested                                      | Hero does not become blank                                       |
| JavaScript failure                            | Server-rendered poster markup present in component output; full JS-disabled browser test not run | Poster and server-rendered hero copy are expected to remain      |
| Poster failure                                | Solid maroon background remains                                                                  | Layout and text remain usable, but photographic fallback is lost |

## Remaining limitations

- Physical Safari/macOS, iPhone, iPad, Chrome Android, Samsung Internet, low-power, data-saver, device lock/unlock, and real network handoff tests are not verified.
- Cold-cache timing, first-frame timing, Core Web Vitals, and slow-3G transfer timing were not measured with a repeatable lab profiler.
- The MP4 still contains an unnecessary AAC track. Preserve this source and create a tested no-audio web derivative in a future media optimization pass.
- The video intentionally plays once and transitions to subtle particles; it does not loop.
- Production verification of the new component and new cache header is blocked until this branch is deployed.

Confidence in the tested Chromium fix: **high**. Confidence in cross-device reliability: **moderate pending physical-device evidence**.
