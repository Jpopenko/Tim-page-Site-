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
- Lightbox: full-screen overlay, body scroll lock, Escape/arrow key handlers in `useEffect`

### Images
All images are served from `https://static.wixstatic.com/media/` — already whitelisted in `next.config.mjs`. The site fetches no images at runtime; all URLs are hardcoded in `PHOTOS`/`WIX`.

**Wix Media Manager API** (to list available images):
```bash
curl -X GET "https://www.wixapis.com/site-media/v1/files?limit=100" \
  -H "Authorization: IST.<token>" \
  -H "wix-site-id: 272f05f7-f2d1-4953-9159-52ef2f7be711"
```
Use `metaSiteId` (from editor URL) not account ID as `wix-site-id`. Token format must be `IST.eyJ...`.

## Blockers & To-dos

### Blockers
- **Wix API token should still be rotated (security hygiene)** — the IST token was shared in plain text during setup. It is *valid and working* (verified live 2026-06-02) and is stored only in `.env.local` + Vercel encrypted env, but because it was once exposed it should be revoked and replaced from the Wix Dev Center, then updated in `.env.local` and `vercel env`.

### To-dos
- Attach a custom domain in Vercel when ready; then set `NEXT_PUBLIC_SITE_URL` env var to it (currently falls back to `https://timpage.com` for OG/canonical) and redeploy.
- Verify the avif image (`cf7196_281e175d3145477a9a33b42a49ffb825~mv2.avif`, photo #30) renders correctly in all browsers
- Optional: bump Next.js (npm audit flags framework-level advisories; only fix is the breaking `next@16` major — defer to a planned upgrade).

### Resolved
- ~~Gallery has only 4 unique photos~~ — 276 images discovered across 13 Wix Media Manager folders (Vietnam, Cambodia, Laos, Afghanistan, Cuba); gallery now has 30 unique images, one per card
- ~~Set up a GitHub remote and push~~ — live at `Jpopenko/Tim-page-Site-`.
- ~~Real contact form backend~~ — `/api/contact` creates a Wix CRM contact + note via `@wix/sdk`/`@wix/crm`; verified end-to-end on production 2026-06-02.
- ~~Social links placeholder~~ — Instagram points to the real `timpagephoto` account; Facebook removed.
- ~~Deploy~~ — **LIVE** on Vercel (`studioclu` team, project `tim`) at `https://tim-khaki.vercel.app`, auto-deploys from GitHub `main`. Production env vars `WIX_API_KEY` + `WIX_SITE_ID` set (encrypted).

## Git workflow

Commit after every change or major feature — don't batch multiple unrelated changes into one commit.

## Production build

```bash
docker build --target runner -t tim-wix-prod .
docker run -p 3000:3000 tim-wix-prod
```
