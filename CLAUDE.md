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

## Git workflow

Commit after every change or major feature — don't batch multiple unrelated changes into one commit.

## Production build

```bash
docker build --target runner -t tim-wix-prod .
docker run -p 3000:3000 tim-wix-prod
```
