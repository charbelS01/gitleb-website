# GitLeb Website — Project Context

## What This Is
Company website for **GitLeb**, a software development and automation services company based in Beirut, Lebanon. Single-page marketing site targeting potential clients.

## Project Location
```
/Users/User/Documents/GITLEB/GitLeb/
```

## Run Locally
```bash
npm run dev        # Dev server → http://localhost:3000 (hot reload)
npm run build      # Production build → /dist
npm run preview    # Preview the production build → http://localhost:4173
```

## Tech Stack
- **Pure HTML/CSS/JS** — single file: `index.html`
- **Vite** — dev server and bundler
- **Google Fonts** — Manrope (headings) + DM Sans (body) + JetBrains Mono (code only)
- **Deployment** — `vercel.json` configured, ready for Vercel

## Design System

### Colors (Blue theme)
```css
--primary:       #4d89ff   /* main blue accent */
--primary-dim:   rgba(77,137,255,0.09)
--primary-glow:  rgba(77,137,255,0.45)
--bg-base:       #020208
--bg-surface:    #06060f
--bg-card:       #0b0b1a
--text-primary:  #f0f0f5
--text-secondary:#8b8ba0
--text-muted:    #44445a
```

### Fonts
```css
--font-display: 'Manrope'        /* headings, section titles */
--font-body:    'DM Sans'        /* body text, UI labels, tags */
--font-mono:    'JetBrains Mono' /* code snippets only */
```

### Spacing
- Section padding: `140px 0` desktop → `80px 0` mobile
- Container: `max-width: 1280px`, padding `48px` desktop → `20px` mobile
- Base grid unit: `8px`

## Page Sections (in order)
1. **Nav** — sticky, glassmorphism on scroll, hamburger at 920px
2. **Hero** — centered, full-viewport, badge + giant heading + stats panel + CTA
3. **Marquee** — scrolling tech stack strip
4. **Services** — 6 cards in 3-col grid (`#services`)
5. **About** — 2-col: text left, values list right (`#about`)
6. **Process** — 4 steps grid (`#process`)
7. **Work** — 3 portfolio cards (`#work`)
8. **Tech Stack** — 12-tile grid
9. **Testimonials** — 3 quote cards
10. **Contact** — form with name/email/company/service/message (`#contact`)
11. **Footer** — brand + 3 link columns + socials

## Key JS Behaviors
- **Custom cursor** — dot + lagging ring (hidden on mobile via CSS)
- **Scroll reveal** — `IntersectionObserver`, `.reveal` → `.reveal.in`
- **Sticky nav** — adds `.scrolled` class after 50px scroll
- **Mobile nav** — hamburger toggles `.open` on `#js-mobile-nav`
- **Contact form** — fake submit with button state feedback (wire up to backend/Formspree when ready)
- **Reduced motion** — `prefers-reduced-motion` disables transitions + marquee

## Responsive Breakpoints
| Breakpoint | Changes |
|---|---|
| `1024px` | Services/process/testimonials → 2-col |
| `920px` | Nav → hamburger |
| `768px` | All sections single-col, padding 80px, cursor hidden |
| `480px` | Heading sizes reduce further |

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

## Decisions Made (don't undo without reason)
- **No framework** — pure HTML/CSS/JS by choice (fast, zero dependencies in output)
- **No terminal card in hero** — was removed because it appeared in the middle of the page on mid-size screens
- **Manrope + DM Sans** — chosen over Bricolage Grotesque (too techy) and Syne (too blocky at large sizes)
- **JetBrains Mono only for code** — not used in UI labels, to avoid "hacker startup" aesthetic
- **Blue #4d89ff** — replaced original mint green #00ff88 for professional look
- **Centered hero** — replaced left-aligned 2-col grid; stats panel sits between heading and CTA

## Hosting — Next Steps
- `vercel.json` is ready
- Push repo to GitHub, connect at vercel.com, add custom domain in Vercel dashboard
- User will provide the domain name → add DNS records accordingly
- Contact form needs a backend or Formspree integration before going live

## Contact Info (placeholder — update before launch)
- Email: `hello@gitleb.com`
- Phone: `+961 1 234 567`
- Location: Beirut, Lebanon
