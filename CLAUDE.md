# GitLeb Website — Project Context

## What This Is
Company website for **GitLeb**, a digital transformation & software firm based in Jbeil, Lebanon. **Multi-page** marketing site targeting potential clients — repositioned (July 2026) from dev-studio to **boutique digital transformation firm** to support $50k+ enterprise engagements.

**Positioning & voice (important — keep the copy consistent with this):**
- Voice: **confident, professional, outcome-focused**. A boutique consultancy+studio talking to executives and owners. Short declarative sentences; specific over abstract.
- **Copy rules (V4):** no em dashes in site copy; no "empower", "seamless", "cutting-edge", "leverage", "in today's fast-paced world", "we don't just X, we Y", no rhetorical triads. If a sentence could appear on any company site, rewrite it.
- **Service architecture (order matters):** 01 Digital Transformation Advisory (#transformation) · 02 BI & Analytics (#bi) · 03 Master Data Management (#mdm) · 04 Systems Integration & Modernization (#integration) · 05 Financial Systems (#fintech) · 06 Data Governance & Compliance (#governance) · 07 AI Strategy & Implementation (#ai) · 08 Websites, Software & Automation (#custom-software — also carries legacy #automation anchor).
- **ERP / Microsoft Dynamics 365 removed (July 2026, owner decision):** every reference to ERP and Microsoft/Dynamics implementation was deleted site-wide and the slot replaced by **Systems Integration & Modernization** (#integration). Do NOT reintroduce ERP, Dynamics 365, D365 or SFA anywhere — copy, meta, anchors, form options, sitemap.
- Credibility anchor: co-founder Mario Sarkis's **real** track record (15+ yrs; directed the Digital Hub of a global shipping group [CMA CGM]; group IT & digital transformation for a regional enterprise; Certified Digital Transformation Officer). Reference it as written on about.html — do NOT inflate it, and do NOT name current-employer engagements as GitLeb clients.
- Do **NOT** write apologetic / transitional copy. Banned phrases: "young studio", "just getting started", "early-stage", "small studio", "we're new", "as we grow", "for now".
- Do **NOT** fabricate seniority, headcount, client logos, or delivered-outcome metrics. Confidence comes from precise capability claims and the founders' real history.
- The work page presents projects as confident capability examples without disclaimers. All three linked live sites are real builds. As real engagements ship, replace/augment with them.

## Project Location
```
/Users/kablo/gitleb website/
```

## Run Locally
```bash
npm run dev        # Dev server → http://localhost:3000 (hot reload)
npm run build      # Production build → /dist
npm run preview    # Preview the production build → http://localhost:4173
```

## Tech Stack
- **Pure HTML/CSS/JS** — no framework
- **Vite** — dev server and bundler, configured for multi-page (rollupOptions.input)
- **Google Fonts** — Archivo (display) + Inter (body) + IBM Plex Mono (labels/numerals/data)
- **Deployment** — `vercel.json` configured (cleanUrls enabled), ready for Vercel

## File Structure
```
index.html         # Landing — hero, capabilities index, statement, work, engagement, firm, CTA
services.html      # 8 practices (anchors: #transformation #bi #mdm #integration #fintech #governance #ai #custom-software [+legacy #automation])
work.html          # Case rows (alternating): #steven-portfolio, #truemedia — all link to live sites. (DIFCO removed July 2026 — not officially signed; do not re-add until the owner confirms.)
about.html         # Story, principles, founders, why-GitLeb ledger
process.html       # 4 steps (oversized numerals) + FAQ accordion
contact.html       # Contact form (service + budget selects) + record-table aside
styles.css         # ALL site styles — shared across pages
main.js            # Shared JS — core behaviors + motion primitives
public/sitemap.xml # Clean URLs (/, /services, /work, /about, /process, /contact)
public/robots.txt  # Allow all + sitemap pointer
vite.config.js     # Multi-page entry config
vercel.json        # Hosting config — cleanUrls: true
```

**Important:** Do NOT add a `<style>` block or inline scripts back into individual pages — always edit the shared `styles.css` / `main.js`. (Exception: the Meta Pixel bootstrap snippet lives inline in each `<head>` by necessity.)

## Design System (V4 — "Institutional Ledger", July 2026 rebuild)

Aesthetic: Wall-Street-tier institutional. Near-black ink canvas (#070b14) alternating with off-white paper bands (#f4f5f8); 1px hairline rules do the structural work; deep negative space; strict typographic hierarchy with hard weight contrast (Archivo 300 vs 600). The brand gradient is **rationed**: one keyword per hero/statement (`.grad-word`), the eyebrow dash, the statement beam, the scroll-progress hairline, and the logo mark. Nothing else gets color.

### Brand palette (sampled from the GitLeb logo: cyan → blue → purple)
```css
--cyan:   #4fb6ff   /* the "G" cyan */
--blue:   #4d89ff   /* mid blue */
--purple: #8b5cf6   /* the "b" + git-branch icon purple */
--grad:      linear-gradient(135deg, #4fb6ff 0%, #4d89ff 50%, #8b5cf6 100%)
--grad-flat: linear-gradient(90deg, #4fb6ff, #4d89ff, #8b5cf6)
```
Only these + neutral inks/papers/greys are allowed. No outside colors (the WhatsApp FAB's #25d366 is the sole exception, brand-mandated).

### Neutrals & text
```css
--ink-0: #04060b   /* footer / deepest */
--ink-1: #070b14   /* body + primary dark bands */
--ink-2: #0c1120   /* secondary dark bands */
--paper: #f4f5f8   /* primary light bands */
--paper-2: #eceef3 /* secondary light bands */
--t-dark: #f2f4fa / --t-dark-2: #a3abc0   /* text on ink */
--t-light: #0a0e1a / --t-light-2: #444d66 /* text on paper */
```
Bands set contextual vars (`--tx`, `--tx2`, `--line`, `--line-soft`) via `.band-ink/.band-ink2/.band-paper/.band-paper2` — components consume the vars, so any component works on any band.

### Logo
- Source: `public/logo.svg` (gradient square + white git-branch icon)
- Served at `/logo.svg` and used as the favicon on every page
- The in-nav and in-footer mark is an inline SVG (same git-branch glyph) inside `.logo-mark`, which gets its gradient background from CSS — do not change either the SVG paths or the CSS gradient without updating the other

### Fonts
```css
--font-display: 'Archivo'        /* headings; weight contrast 300 vs 600 is the signature */
--font-body:    'Inter'          /* body text */
--font-mono:    'IBM Plex Mono'  /* eyebrows, numerals, tags, record tables */
```

### Layout & anti-repetition rule
`.shell` = max-width 1360px, padding-inline clamp(20px, 5vw, 64px). Sections are `.band` (padding-block clamp(88px, 12vh, 150px)). **No two sections on a page share a layout skeleton** — current index order: scroll-linked full-viewport hero → sticky-left/scrolling-right capabilities index → full-bleed statement → offset editorial work grid → rule-divided engagement columns → asymmetric firm split + record table → edge-anchored CTA. Keep it that way when adding sections.

### Reusable utilities (use these, don't reinvent)
- `.eyebrow` — mono label with gradient dash
- `.h2`, `.body-lg`, `.body`, `.grad-word`
- `.btn-solid` (paper-on-ink) / `.btn-inverse` (ink-on-paper) / `.btn-key` (hairline, header)
- `.link-arrow` — gradient-underline link with arrow micro-interaction
- `.page-head` (+ `.page-head-tight`) — interior page hero
- `.cta` + `.cta-title` / `.cta-row` — bottom-of-page CTA band
- `.rec-row` / `.rec-k` / `.rec-v` — ledger record rows (firm table, contact aside)
- `.reveal` + `.d1`–`.d5` — staggered scroll reveal (hidden states gated on `body.js` so no-JS still renders)
- `.magnetic` — magnetic hover surface (JS)
- `[data-parallax="0.1"]` — depth offset (JS writes the `translate` property, never `transform`, so CSS rotations survive)
- `.faq-item` — accordion item (JS toggles `.open`)
- `.skip-link` — a11y skip-to-content link

### Motion system (in main.js — primitives, not one-off hacks)
Tokens in CSS: `--ease-out: cubic-bezier(.22,1,.36,1)`, `--ease-io`, durations .3s/.45s/.6s. Primitives: `initReveal` (IO + stagger), shared **scroll scheduler** (one rAF per scroll burst — NEVER a perpetual rAF loop; a perpetual loop blocks automation/idle detection and wastes battery), scroll progress hairline, nav auto-hide, scroll-linked hero (`--hp` custom property), parallax, magnetic. All gated on `prefers-reduced-motion`; pointer effects also on `pointer: fine`. Transform/opacity only — no layout-thrashing animation.

## Landing Page Section Order (narrative-first)
1. **Header** — fixed, transparent over hero, ink+blur once scrolled (`.scrolled`), auto-hides scrolling down; interior pages use `.is-solid`
2. **Hero** — scroll-linked, full viewport; capability index strip at its base
3. **Capabilities** — sticky-left intro + 8 numbered rows → services.html anchors
4. **Statement** — full-bleed declaration with parallax gradient beam
5. **Work** — offset editorial grid, 3 featured projects → work.html
6. **Engagement** — 3 rule-divided columns (sprint / program / retainer)
7. **Firm** — asymmetric split + record table → about.html
8. **CTA band** — edge-anchored type, final conversion push
9. **Footer** — ink-0, 8 service links + company + contact

## Key JS Behaviors (in main.js)
- **body.js / body.js-motion** — added on JS boot; CSS hides `.reveal` only under `body.js` (no-JS safety)
- **Active nav** — `data-nav="<page>.html"` marks the current page link
- **Mobile nav** — hamburger toggles `.open` on `#js-mobile-nav`; Esc closes; numbered full-screen overlay
- **FAQ accordion** — `.faq-q` button toggles `.faq-item.open`
- **Contact form** — validates inline, then POSTs JSON to `/api/contact`. **Meta Pixel `Lead` fires only on confirmed `res.ok`** (clean ad attribution). If the request fails (backend not yet built), falls back to a prefilled `mailto:` — the fallback intentionally does **not** fire `Lead`. **TODO:** build the `/api/contact` Vercel serverless function (Resend / SendGrid / Postmark)
- **WhatsApp tracking** — every `a[href*="wa.me"]` / `a[href*="whatsapp.com"]` click fires `fbq('trackCustom', 'WhatsApp_Click')` site-wide
- **Reduced motion** — disables reveals, parallax, hero link, magnetic, scroll scheduler; CSS also zeroes transitions/animations

## Responsive Breakpoints
| Breakpoint | Changes |
|---|---|
| `1100px` | Founders → 2-col |
| `1024px` | Sticky rails become static; capabilities/firm/story/faq/contact → 1-col; services rail hidden; work grid stacks |
| `920px`  | Nav → hamburger; engagement columns → stacked rows; case rows → 1-col |
| `720px`  | Bands 72px padding; hero index stacks; footer 1-col; steps stack |
| `600px`  | Header "Start a project" button hidden (hamburger remains) |
| `480px`  | Display sizes reduce further |

## Decisions Made (don't undo without reason)
- **No framework** — pure HTML/CSS/JS by choice (fast, zero runtime dependencies)
- **Multi-page** — split for SEO and focused content; same six URLs as before (don't rename files — vite.config + vercel cleanUrls depend on them)
- **Shared styles.css / main.js** — single source of truth across all pages. Never duplicate styles into a page
- **V4 rebuild (July 2026)** — replaced the V3 "Firm Light" theme (Fraunces/Manrope/DM Sans, warm white) wholesale per owner brief: institutional ink+paper, Archivo/Inter/IBM Plex Mono, hairline structure, rationed gradient. The palette survived; the design did not.
- **ERP & Dynamics 365 practice removed** — replaced by Systems Integration & Modernization (#integration). Old #erp anchor intentionally gone.
- **No custom cursor** — removed in v2 (a11y/UX liability). Don't bring it back
- **Honest proof** — capability statements, not fabricated numbers. No fake testimonials anywhere
- **Hero primary CTA = "Start a project"** — sale > browse
- **No emoji glyphs** — typographic marks only (mono text, inline SVG)
- **Perpetual rAF loops banned in main.js** — use the shared scroll scheduler (rAF per scroll burst). A permanent loop kept the page from ever going idle and hung browser automation
- **Vercel `rewrites` removed** — the old SPA catch-all would have broken subpages. Now uses `cleanUrls: true`

## Hosting — Next Steps
- `vercel.json` configured with `cleanUrls: true` (so `/services` serves `services.html`)
- Push repo to GitHub, connect at vercel.com, add custom domain in Vercel dashboard
- **Before launch:** wire the contact form to a real backend (`/api/contact` — see TODO in main.js)
- **Before launch:** add a raster `og:image` (1200×630) — pages currently use `twitter:card summary` with no image
- Footer social: Instagram is live (`instagram.com/gitlebanon`); add GitHub/LinkedIn when real

## Contact Info (live on site)
- Email: `inquiries@gitleb.dev`
- Phone: `+961 81 499 473`
- WhatsApp: `wa.me/96181499473`
- Location: Jbeil, Lebanon
