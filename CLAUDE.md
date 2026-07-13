# GitLeb Website — Project Context

## What This Is
Company website for **GitLeb**, a digital transformation & software firm based in Jbeil, Lebanon. **Multi-page** marketing site targeting potential clients — repositioned (July 2026) from dev-studio to **boutique digital transformation firm** to support $50k+ enterprise engagements.

**Positioning & voice (important — keep the copy consistent with this):**
- Voice: **confident, professional, outcome-focused**. A boutique consultancy+studio talking to executives and owners. "Advised like a consultancy, built like a studio."
- **Service architecture (order matters):** 01 Digital Transformation Advisory (#transformation) · 02 BI & Analytics (#bi) · 03 ERP & Microsoft Dynamics 365 (#erp) · 04 Data Governance & Compliance (#governance) · 05 AI Strategy & Implementation (#ai) · 06 Websites, Software & Automation (#custom-software — also carries legacy #automation anchor).
- Credibility anchor: co-founder Mario Sarkis's **real** track record (15+ yrs; directed the Digital Hub of a global shipping group [CMA CGM]; group IT & digital transformation for a regional enterprise; Certified Digital Transformation Officer). Reference it as written on about.html — do NOT inflate it, and do NOT name current-employer engagements as GitLeb clients.
- Do **NOT** write apologetic / transitional copy. Banned phrases: "young studio", "just getting started", "early-stage", "small studio", "we're new", "as we grow", "for now".
- Do **NOT** fabricate seniority, headcount, client logos, or delivered-outcome metrics. Confidence comes from precise capability claims and the founders' real history.
- The work page presents projects as confident capability examples without disclaimers. As real engagements ship, replace/augment with them.

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
- **Google Fonts** — Manrope (headings) + DM Sans (body) + JetBrains Mono (code only)
- **Deployment** — `vercel.json` configured (cleanUrls enabled), ready for Vercel

## File Structure
```
index.html      # Landing — condensed sections, links to subpages
services.html   # Full expanded 6 services (anchored: #custom-software, #devops, #api, #cloud, #ai, #automation)
work.html       # Full portfolio / case studies grid (6 projects)
about.html      # Story, values, "Why GitLeb"
process.html    # Detailed 4-step timeline + FAQ accordion
contact.html    # Contact form (with budget field) + contact aside
styles.css      # ALL site styles — shared across pages
main.js         # Shared JS — navbar scroll, mobile nav, scroll reveal, FAQ, contact form
vite.config.js  # Multi-page entry config
vercel.json     # Hosting config — cleanUrls: true
```

**Important:** Do NOT add a `<style>` block or inline scripts back into individual pages — always edit the shared `styles.css` / `main.js`. The only inline styles allowed are one-off layout tweaks (e.g. `style="max-width:620px"`).

## Design System

### Brand palette (sampled from the GitLeb logo: cyan → blue → purple)
```css
--brand-cyan:      #4fb6ff   /* the "G" cyan */
--brand-blue:      #4d89ff   /* mid blue, same as --primary */
--brand-purple:    #8b5cf6   /* the "b" + git-branch icon purple */
--brand-gradient:  linear-gradient(135deg, #4fb6ff 0%, #4d89ff 50%, #8b5cf6 100%)
--brand-gradient-flat: linear-gradient(90deg, #4fb6ff, #4d89ff, #8b5cf6)
```
The brand gradient is used for: hero h1 highlighted word, all `em` accents inside headings, the primary button background, the `.logo-mark` background, and the ambient orbs (which use individual cyan/blue/purple stops with low opacity).

### Base palette
```css
--primary:       #4d89ff   /* main blue accent — same as --brand-blue */
--primary-dim:   rgba(77,137,255,0.09)
--primary-glow:  rgba(77,137,255,0.45)
--bg-base:       #020208
--bg-surface:    #06060f
--bg-card:       #0b0b1a
--text-primary:  #f0f0f5
--text-secondary:#9a9ab0
--text-muted:    #6a6a82  /* bumped from #44445a for WCAG contrast */
```

### Logo
- Source: `public/logo.svg` (gradient square + white git-branch icon)
- Served at `/logo.svg` and used as the favicon on every page
- The in-nav and in-footer mark is an inline SVG (same git-branch glyph) inside `.logo-mark`, which gets its gradient background from CSS — do not change either the SVG paths or the CSS gradient without updating the other

### Fonts
```css
--font-display: 'Manrope'        /* headings, section titles */
--font-body:    'DM Sans'        /* body text, UI labels, tags */
--font-mono:    'JetBrains Mono' /* code snippets, tech glyphs */
```

### Spacing
- Section padding: `140px 0` desktop → `80px 0` mobile
- Container: `max-width: 1280px`, padding `48px` desktop → `20px` mobile
- Base grid unit: `8px`

### Reusable utilities (use these, don't reinvent)
- `.section-title` / `.section-title.sm` — standard section headings
- `.section-eyebrow` + `.label-tag` — eyebrow label above headings
- `.btn .btn-primary` / `.btn-ghost` / `.btn-lg`
- `.page-hero` — interior page hero (top of all subpages)
- `.cta-band` — reusable bottom-of-page CTA section
- `.svc-card` / `.svc-detail` — service cards (compact / detailed)
- `.work-card` — case-study card
- `.faq-item` — accordion item (JS toggles `.open` class)
- `.reveal` + `.d1`–`.d5` — scroll-reveal animation with staggered delays
- `.skip-link` — a11y skip-to-content link

## Landing Page Section Order (narrative-first)
1. **Nav** — sticky, glassmorphism on scroll
2. **Hero** — heading + honest capability strip + CTA (primary = "Start a Project")
3. **Marquee** — tech stack strip
4. **Services** — condensed (6 cards, "Learn more →" → services.html anchors)
5. **Work** — 3 featured projects → work.html
6. **Process** — condensed 4 steps → process.html
7. **About** — short blurb + values list → about.html
8. **CTA band** — final conversion push
9. **Footer**

## Key JS Behaviors (in main.js)
- **Sticky nav** — adds `.scrolled` class after 50px; interior pages get `.solid` always
- **Active nav** — uses `data-nav="<page>.html"` attribute to mark current page link
- **Mobile nav** — hamburger toggles `.open` on `#js-mobile-nav`; Esc closes
- **Scroll reveal** — `IntersectionObserver` adds `.in` to `.reveal` elements
- **FAQ accordion** — `.faq-q` button toggles `.faq-item.open`
- **Contact form** — validates inline, then POSTs JSON to `/api/contact`. **Meta Pixel `Lead` fires only on confirmed `res.ok`** (clean ad attribution). If the request fails (e.g. backend not yet built), falls back to opening a prefilled `mailto:` — the fallback intentionally does **not** fire `Lead`. **TODO:** build the `/api/contact` Vercel serverless function (Resend / SendGrid / Postmark) so Lead actually starts firing in production
- **WhatsApp tracking** — every `a[href*="wa.me"]` / `a[href*="whatsapp.com"]` click fires `fbq('trackCustom', 'WhatsApp_Click')` site-wide so audiences and ad optimisation can use WhatsApp intent
- **Reduced motion** — `prefers-reduced-motion` disables transitions + marquee (CSS only now)

## Responsive Breakpoints
| Breakpoint | Changes |
|---|---|
| `1024px` | Services/process/testimonials → 2-col |
| `920px`  | Nav → hamburger |
| `768px`  | All sections single-col, padding 80px |
| `480px`  | Heading sizes reduce further |

## Decisions Made (don't undo without reason)
- **No framework** — pure HTML/CSS/JS by choice (fast, zero runtime dependencies)
- **Multi-page** — split for SEO, focused content per page, and reduced single-scroll fatigue. Old single-page `#anchor` nav was replaced with real page URLs
- **Shared styles.css / main.js** — single source of truth across all pages. Never duplicate styles into a page
- **No custom cursor** — removed in v2 (was an a11y/UX liability for a B2B vendor). Don't bring it back
- **Honest proof** — hero "stats" are capability statements, not fabricated numbers. No fake testimonials anywhere. Work page is framed as illustrative "what we love to build" examples — NOT delivered client case studies
- **Early-stage honesty** — never claim seniority, years of experience, or invented client outcomes. Lead with Websites & Custom Software + Process Automation as core focus; everything else is "expanding capabilities"
- **Hero primary CTA = "Start a Project"** — not "View Our Work" (sale > browse)
- **Tech glyphs are typographic** (mono text), not emoji — emoji renders inconsistently and looks unprofessional
- **Manrope + DM Sans** — chosen over Bricolage Grotesque (too techy) and Syne (too blocky)
- **JetBrains Mono only for code/tech marks** — not for UI labels
- **Blue #4d89ff** — replaced original mint green #00ff88 for professional B2B look
- **Centered hero** — replaced left-aligned 2-col grid
- **Vercel `rewrites` removed** — the old SPA catch-all would have broken subpages. Now uses `cleanUrls: true`

## Skills Installed (in `~/.claude/skills/`)
All of these are active and inform design/code decisions:
- `ui-ux-pro-max` — design system, palettes, typography
- `web-design-guidelines` — Vercel web interface guidelines (live-fetch)
- `premium-saas-design` — SaaS landing page patterns
- `brand-systems` — brand identity consistency
- `design-principles` — visual hierarchy, gestalt
- `bencium-innovative-ux-designer` — creative UI guidance
- `vercel-composition-patterns` — component composition
- `vercel-react-best-practices` — React/Next.js patterns
- `accesslint-audit` — WCAG 2.2 accessibility auditing
- `git-workflow` — conventional commits, PR workflow

## Hosting — Next Steps
- `vercel.json` configured with `cleanUrls: true` (so `/services` serves `services.html`)
- Push repo to GitHub, connect at vercel.com, add custom domain in Vercel dashboard
- **Before launch:** wire the contact form to a real backend (Formspree, Resend, or custom). The current mailto fallback is marked with a `TODO` in `main.js`
- **Before launch:** provide real client logos / case-study references if available
- Social links in footer currently point to `#` — set real GitHub/LinkedIn/X URLs

## Contact Info (placeholder — update before launch)
- Email: `inquiries@gitleb.dev`
- Phone: `+961 1 234 567`
- Location: Jbeil, Lebanon
