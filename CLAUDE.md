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
  lazy images never intersect and never download (verified: a desktop load fires zero
  `w_1000` requests). **The slat row + ripple are a locked design element — do not
  replace them with a conventional grid.**
- **Mobile has the same ripple, driven by scroll instead of a cursor.** Touch has no
  hover, so "where your attention is" becomes "what you've scrolled to the centre." A
  `scroll` listener on `.mobTrack` (rAF-throttled) writes the Gaussian falloff to each
  slide as a CSS var `--f`; CSS spends it on scale, opacity and grayscale, so the
  centred photo is in colour and its neighbours recede — the same move `.galImgColor`
  makes on the desktop slat under the cursor. Geometry is measured on mount/resize
  only, never inside the scroll frame.
  - It's written to the DOM rather than through React state on purpose: this fires
    every frame of a swipe, and reconciling 15 slides at 60fps janks a mid-range phone.
  - `MOB_SIGMA2` (0.28) is *deliberately* far tighter than `SIGMA2` (2.5). The constant
    is in **card-index units** and the layouts fit wildly different card counts —
    desktop shows ~15 slats so the wave spreads across the row; a phone shows one, so
    the ripple is felt over *time* as slides cross centre. Don't "fix" the mismatch.
  - CSS falls back to `--f: 1`, which is an exact identity (scale 1, opacity 1,
    `grayscale(0)`). Desktop, reduced-motion and no-JS therefore render untouched.
  - **The slide width is load-bearing, not cosmetic.** At the original `86vw` only a
    15px sliver of the neighbour was on screen, so the falloff was real but invisible —
    at rest the page looked identical to no effect at all. `72vw` (with `padding: 0
    14vw`, so 14+72+14 = 100vw and it still centres) keeps ~40px of each neighbour
    visible. Widen it and the ripple silently stops reading. Keep `sizes` in step.
- Lightbox: full-screen overlay, body scroll lock, Escape/arrow key handlers in `useEffect`

### Images
All images are served from `https://static.wixstatic.com/media/` — already whitelisted in `next.config.mjs`. The site fetches no images at runtime; all URLs are hardcoded in `PHOTOS`/`WIX`.

Some of Marianne's scans carry a **solid matte baked into the pixels** — a 131px white
border on ids 6 and 8, black bands on 9 and 10. Because a slat is a 1:5.6 sliver of the
full source *height*, that matte lands as grey caps top and bottom and the slat reads as
short, next to fifteen full-bleed neighbours. Those photos carry a `crop: [x, y, w, h]`
rect (measured off the original, in source pixels) which is chained **before** the fill —
`.../v1/crop/x_,y_,w_,h_/v1/fill/w_,h_,al_c,.../file.jpg`. The Wix CDN honours the two ops
in one URL. Re-measure the rect if a `src` is swapped.

`wixThumb(url, w, h, q, crop)` builds the crop. Desktop slats request `256x1440` (1:5.6 — the
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
- **Tap targets still under 44px at 390px** (found 2026-07-28, after `c28c529` was
  titled "clear the 390px gate"): the four contact fields — `name`, `email`, `image`,
  `usage` — are 38px tall, and `/privacy` has two short inline links ("← Back to site"
  134×19, the email link 219×17). No horizontal overflow anywhere. Small, Claude-fixable.
- Resync `package-lock.json` (see Production build) so `npm ci` works again.

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

**Use that, not `npm run build` inside the dev container.** `docker-compose.yml` pins
`NODE_ENV=development`, so a production build there mixes Next's dev and prod runtimes and
dies with `Cannot read properties of null (reading 'useContext')` or `<Html> should not be
imported outside of pages/_document`, failing every prerendered path. **Neither error means
your code is broken** — the `runner` target above builds the same code cleanly. Running
`npm run build` while `next dev` is live also corrupts the shared bind-mounted `.next`;
`rm -rf .next` after.

`npm ci` fails too: `package-lock.json` is missing `@vercel/analytics`, which is in
`package.json`. Nothing is broken today because the Dockerfile and Vercel both use `npm
install`, but any CI that uses `npm ci` will fail until someone re-runs `npm install`.

There is no lint step. `next lint` has never been configured, so it drops into an
interactive ESLint setup prompt rather than linting.
