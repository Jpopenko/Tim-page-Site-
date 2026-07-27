# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dev environment

There is **no local Node.js**. All development runs inside Docker via a bind-mount so edits on disk are reflected immediately (Next.js hot reload).

```bash
# Start dev server (runs on http://localhost:3000)
docker compose up

# Rebuild after package.json changes
docker compose up --build

# Run a command inside the running container
docker exec tim-app-1 node -e "..."
docker exec tim-app-1 sh -c "npm run lint"
```

There is no test suite. No lint step beyond `next lint`.

## Architecture

Single-page Next.js 14 App Router site. All page content lives in two files:

- `src/app/page.tsx` — entire page: all components, data, and logic in one file (`"use client"`)
- `src/app/page.module.css` — all styles (CSS Modules)
- `src/app/globals.css` — CSS variables, resets, `reveal` animation class
- `src/app/layout.tsx` — font imports, metadata, body wrapper

### Page sections (in render order)
`Hero` → `Gallery` (id="work") → `About` → `Media` → `Contact` → `Footer`

Navigation is scroll-based: `IntersectionObserver` watches each section, updates `active` state, drives nav highlight and the side dot indicators.

### Gallery mechanics
- `PHOTOS` array + `WIX` array at top of `page.tsx` — swap `WIX` entries to change images
- Hover ripple: Gaussian bell curve `Math.exp(-(dist²) / SIGMA2)` on card index distance from hovered card — single smooth peak, no secondary humps
- Cards use inline `style={{ height }}` driven by React state, `transition: height 0.45s` in CSS
- `galViewport` has fixed height (740px) so ripple expansion doesn't shift page layout
- **Desktop and mobile are two separate blocks, swapped by CSS at 768px** — `.galDesktop`
  (slat row + ripple) and `.galMobile` (swipeable 3:2 carousel). The slats are narrow
  *because* the ripple needs them narrow, and there's no ripple without a cursor, so
  mobile gets its own treatment. Only one is ever in the layout, so the hidden one's
  lazy images never intersect and never download. **The slat row + ripple are a locked
  design element — do not replace them with a conventional grid.**
- Lightbox: full-screen overlay, body scroll lock, Escape/arrow key handlers in `useEffect`

### Images
All images are served from `https://static.wixstatic.com/media/` — already whitelisted in `next.config.mjs`. The site fetches no images at runtime; all URLs are hardcoded in `PHOTOS`/`WIX`.

`wixThumb(url, w, h)` builds the crop. Desktop slats request `256x1440` (1:5.6 — the
narrow ratio the hover ripple needs); the mobile carousel requests `1000x667` (3:2) from
the same sources; the hero requests `2000x1250`. **The About portrait is 3998x2248
(16:9)** — it was long declared `680x907`, a portrait ratio it never had.

**Wix Media Manager API** (to list available images):
```bash
curl -X GET "https://www.wixapis.com/site-media/v1/files?limit=100" \
  -H "Authorization: IST.<token>" \
  -H "wix-site-id: 272f05f7-f2d1-4953-9159-52ef2f7be711"
```
Use `metaSiteId` (from editor URL) not account ID as `wix-site-id`. Token format must be `IST.eyJ...`.

## Blockers & To-dos

### Blockers
- **Cancelling Wix blanks the site.** All 15 gallery photographs and the About
  portrait are still hot-linked from `static.wixstatic.com`. Self-hosting them was
  deferred by Jay on 2026-07-27, so the Wix cancellation stays blocked (safety-net
  item #2 in `Business/Housekeeping/TODO.md`).

### To-dos
- **Waiting on Marianne — more photographs.** The site calls itself an archive and
  shows **15** images. 276 were discovered across 13 Wix Media Manager folders.
- **Waiting on Marianne — per-image captions** (who / where / when). Alt text is
  currently generic (`Tim Page — Vietnam` across all seven Vietnam photos), which
  blocks per-photograph pages, Google Images licensing schema and real a11y.
- Self-host the 16 images (see Blockers) when Jay is ready to cut Wix.
- Considered, not done: swapping body copy from monospace to a serif. Changes the
  site's voice — Jay's and Marianne's call.
- Optional: bump Next.js (npm audit flags framework-level advisories; only fix is
  the breaking `next@16` major — defer to a planned upgrade).

### Resolved
- ~~Gallery has only 4 unique photos~~ — 276 images discovered across 13 Wix Media Manager folders (Vietnam, Cambodia, Laos, Afghanistan, Cuba); the gallery now runs **15** unique images.
- ~~Set up a GitHub remote and push~~ — live at `Jpopenko/Tim-page-Site-`.
- ~~Real contact form backend~~ — `/api/contact` emails the enquiry via **Resend**
  (`RESEND_API_KEY` + `EMAIL_FROM`, notifications to `OWNER_ALERT_EMAIL`).
  Wix CRM was dropped in `ac57ad5`; **nothing in `src/` imports `@wix/*` any more**,
  so the old IST-token rotation blocker is moot for the app. Honeypot + a
  3-per-IP-per-10-min rate limit added 2026-07-27.
- ~~Attach a custom domain~~ — **`https://timpagephoto.com`** (Marianne's GoDaddy),
  `www` redirects to apex, OG/canonical resolve to it.
- ~~Verify the avif image~~ — no longer referenced; the photo set was replaced.
- ~~Social links placeholder~~ — Instagram points to the real `timpagephoto` account; Facebook removed.
- ~~Deploy~~ — **LIVE** on Vercel (`studioclu` team, project `tim`) at
  `https://timpagephoto.com`, auto-deploys from GitHub `main`.

### Gotcha — the dev server, not the site
`next.config.mjs` sends a strict CSP. Next's dev client (react-refresh) compiles with
`eval` and talks over a websocket, so `'unsafe-eval'` and `ws:` are added **in
development only**. Without them the dev bundle throws on CSP, React never hydrates,
and every handler on the page is dead locally — nav, lightbox, gallery ripple, form —
while production is perfectly fine. If nothing on `localhost:3000` responds to clicks,
check the browser console for a CSP `EvalError` before assuming the site is broken.

## Git workflow

Commit after every change or major feature — don't batch multiple unrelated changes into one commit.

## Production build

```bash
docker build --target runner -t tim-wix-prod .
docker run -p 3000:3000 tim-wix-prod
```
