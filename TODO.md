# Tim Page — Post-Launch To-Do

**Status:** 🟢 LIVE since 2026-06-02 at **https://timpagephoto.com**
**Host:** Vercel (`studioclu` team, project `tim`) · auto-deploys from GitHub `main` (`Jpopenko/Tim-page-Site-`)
**Form email:** enquiries go to **timpagephoto@bigpond.com** via Resend (verified domain)

None of the below blocks the site being live — these are follow-ups. Roughly in priority order.

---

## ⭐ P1 — Spam-protect the contact form
**Why:** The enquiry form is public and emails a real inbox. With no protection, bots will
eventually find it and send junk to Bigpond.
**Do:** Add a honeypot field + a simple rate limit to `src/app/api/contact/route.ts`
(~5 min, non-breaking). Then redeploy.
**Owner:** Claude can do this — just say "add spam protection to the form".

## P2 — Revoke the old Wix API token
**Why:** The site no longer uses Wix (removed from code + Vercel env), but the old `IST.…`
token was shared in plaintext during setup, so it should be retired.
**Do:** Wix Dev Center → revoke/delete that API key. (Nothing in the site depends on it
anymore, so it's safe to revoke.) Also delete `WIX_*` lines from local `.env.local`.
**Owner:** Jay (needs Wix login).

## P3 — Analytics (optional)
**Why:** No visitor stats currently.
**Do:** Add Vercel Analytics (privacy-friendly, one component in the layout) or Plausible.
**Owner:** Claude can do this — say "add Vercel Analytics".

## P4 — Next.js version advisories (defer)
**Why:** `npm audit` flags framework-level advisories. The only fix is `next@16`, a breaking
major upgrade — not worth doing reactively.
**Do:** Schedule a planned Next.js 14 → 16 upgrade later and test thoroughly.
**Owner:** Claude, when planned.

---

## Already done at launch (for reference)
- Custom domain + SSL, `www`→apex redirect, MS365 email preserved
- Contact form → Resend → Bigpond (tested, confirmed landing)
- Privacy policy (`/privacy`), footer-linked
- Black-&-white camera favicon + theme-color
- Security headers (CSP, HSTS, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- Custom on-brand 404
- SEO: title/meta/OG, JSON-LD, sitemap.xml, robots.txt
- Mobile pass at 390px (no overflow, 44px tap targets, all sections render)
