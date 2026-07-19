'use strict';

/* ============================================================
   GitLeb — shared site JS (loaded on every page)

   Structure:
   1. Environment gates (reduced motion / pointer type)
   2. Core behaviors  (nav, mobile menu, FAQ, form, tracking)
   3. Motion primitives (reveal, scrollLink, parallax, magnetic)
      — each primitive is a small reusable function, applied
        via classes/data-attributes, never a one-off hack.
============================================================ */

/* ── 1. Environment ── */
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE_POINTER = window.matchMedia('(pointer: fine)').matches;

// Confirms JS is running: CSS only hides .reveal content under body.js,
// so a no-JS visit still renders the full page.
document.body.classList.add('js');
if (!REDUCED) document.body.classList.add('js-motion');

/* ── 2a. Navbar scroll state ── */
const navbar = document.getElementById('navbar');
if (navbar) {
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── 2b. Active nav link ── */
(function setActiveNav() {
  let path = window.location.pathname.split('/').pop() || 'index.html';
  if (path === '') path = 'index.html';
  document.querySelectorAll('[data-nav]').forEach(a => {
    if (a.getAttribute('data-nav') === path) a.classList.add('active');
  });
})();

/* ── 2c. Mobile nav ── */
const mobileNav = document.getElementById('js-mobile-nav');
const hamburger = document.getElementById('js-hamburger');
const mobileClose = document.getElementById('js-mobile-close');

if (hamburger && mobileNav) {
  const openNav = () => {
    mobileNav.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeNav = () => {
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  hamburger.addEventListener('click', openNav);
  if (mobileClose) mobileClose.addEventListener('click', closeNav);
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
  // The hamburger disappears above 920px; make sure the overlay goes with it.
  window.addEventListener('resize', () => {
    if (window.innerWidth > 920) closeNav();
  }, { passive: true });
}

/* ── 2d. FAQ accordion ── */
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  if (!q || !a) return;
  q.setAttribute('aria-expanded', 'false');
  q.addEventListener('click', () => {
    const isOpen = item.classList.toggle('open');
    q.setAttribute('aria-expanded', String(isOpen));
    a.style.maxHeight = isOpen ? a.scrollHeight + 'px' : '0';
  });
});

/* ── 2e. WhatsApp clicks: fire Pixel custom event ──
   Targets any wa.me / whatsapp.com link site-wide via trackCustom,
   so audiences and ad optimisation can use WhatsApp intent. */
document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach(el => {
  el.addEventListener('click', () => {
    if (window.fbq) { fbq('trackCustom', 'WhatsApp_Click'); }
  });
});

/* ── 2f. Contact form ──
   Posts JSON to /api/contact. Meta Pixel 'Lead' fires ONLY on a
   confirmed res.ok — keeps ad attribution clean.

   TODO: build the /api/contact serverless endpoint (Vercel function
   that emails inquiries@gitleb.dev via Resend / SendGrid / etc).
   Until that ships, the catch block falls back to opening the user's
   email client so the form stays usable. The fallback intentionally
   does NOT fire Lead — only confirmed backend success counts. */
const form = document.getElementById('contact-form');
if (form) {
  const submitBtn = document.getElementById('submit-btn');

  const setError = (field, on) => {
    const wrap = field.closest('.field');
    if (wrap) wrap.classList.toggle('invalid', on);
  };
  const getSelectText = (sel) => sel && sel.value
    ? sel.options[sel.selectedIndex].text
    : '';
  const resetBtnLater = () => setTimeout(() => {
    if (!submitBtn) return;
    submitBtn.textContent = 'Send message →';
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
  }, 3500);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('#cf-name');
    const email = form.querySelector('#cf-email');
    const message = form.querySelector('#cf-message');

    let ok = true;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    [name, email, message].forEach(f => {
      const empty = !f.value.trim();
      const bad = f === email ? (empty || !emailRe.test(email.value.trim())) : empty;
      setError(f, bad);
      if (bad) ok = false;
    });

    if (!ok) {
      form.querySelector('.field.invalid input, .field.invalid textarea')?.focus();
      return;
    }

    const company = form.querySelector('#cf-company');
    const service = form.querySelector('#cf-service');
    const budget = form.querySelector('#cf-budget');

    const formData = {
      name: name.value.trim(),
      email: email.value.trim(),
      company: company?.value.trim() || '',
      service: getSelectText(service),
      budget: getSelectText(budget),
      message: message.value.trim(),
    };

    if (submitBtn) {
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Meta Pixel Lead — fires only on confirmed success
        if (window.fbq) {
          window.fbq('track', 'Lead', {
            content_name: formData.service,
            content_category: formData.budget,
          });
        }
        if (submitBtn) {
          submitBtn.textContent = '✓ Message sent';
          submitBtn.style.opacity = '1';
        }
        form.reset();
        resetBtnLater();
        return;
      }
      throw new Error('Server returned ' + res.status);
    } catch (err) {
      // Fallback: open the user's email client. Lead does NOT fire here.
      const subject = `Project inquiry — ${formData.name}`;
      const bodyLines = [
        `Name: ${formData.name}`,
        `Email: ${formData.email}`,
        formData.company ? `Company: ${formData.company}` : null,
        formData.service ? `Service: ${formData.service}` : null,
        formData.budget ? `Budget: ${formData.budget}` : null,
        '',
        'Project details:',
        formData.message,
      ].filter(Boolean);
      const mailto = `mailto:inquiries@gitleb.dev?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

      if (submitBtn) submitBtn.textContent = 'Opening your email…';
      window.location.href = mailto;

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.textContent = '✓ Email client opened';
          submitBtn.style.opacity = '1';
        }
        resetBtnLater();
      }, 1200);
    }
  });
}

/* ============================================================
   3. MOTION PRIMITIVES
   All scroll work batched through one rAF loop; transform and
   opacity only, so mid-range mobile stays at frame rate.
============================================================ */

/* ── Primitive: reveal(selector) — staggered entry on scroll ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (REDUCED) { els.forEach(el => el.classList.add('in')); return; }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
  els.forEach(el => obs.observe(el));

  // Above-the-fold content shows immediately.
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .reveal, .page-head .reveal').forEach(el => el.classList.add('in'));
  });
}
initReveal();

/* ── Shared scroll scheduler for scroll-linked primitives ──
   One rAF per scroll burst (not a perpetual loop), so the page
   is fully idle when the user is not scrolling. */
const scrollJobs = [];
let scrollTicking = false;
function runScrollJobs() {
  const y = window.scrollY;
  for (const job of scrollJobs) job(y);
  scrollTicking = false;
}
function onFrameScroll(job) {
  if (REDUCED) return;
  scrollJobs.push(job);
  requestAnimationFrame(runScrollJobs);
}
window.addEventListener('scroll', () => {
  if (!scrollJobs.length || scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(runScrollJobs);
}, { passive: true });

/* ── Primitive: scroll progress hairline ── */
(function initProgress() {
  const prog = document.createElement('div');
  prog.className = 'scroll-progress';
  prog.setAttribute('aria-hidden', 'true');
  document.body.appendChild(prog);
  const update = (y) => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
  };
  if (REDUCED) { update(window.scrollY); window.addEventListener('scroll', () => update(window.scrollY), { passive: true }); }
  else onFrameScroll(update);
})();

/* ── Primitive: nav auto-hide (down = hide, up = show) ── */
(function initNavHide() {
  if (!navbar) return;
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 320 && y > lastY + 4) navbar.classList.add('hidden');
    else if (y < lastY - 4 || y < 320) navbar.classList.remove('hidden');
    lastY = y;
  }, { passive: true });
})();

/* ── Primitive: scroll-linked hero (sets --hp 0→1 while leaving) ── */
(function initHeroLink() {
  if (REDUCED) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  onFrameScroll(y => {
    const p = Math.min(Math.max(y / (hero.offsetHeight * 0.9), 0), 1);
    hero.style.setProperty('--hp', p.toFixed(4));
  });
})();

/* ── Primitive: parallax — [data-parallax="speed"] depth offsets ── */
(function initParallax() {
  if (REDUCED) return;
  const els = [...document.querySelectorAll('[data-parallax]')];
  if (!els.length) return;
  const items = els.map(el => ({ el, speed: parseFloat(el.dataset.parallax) || 0.1 }));
  // Uses the standalone `translate` property so any CSS `transform`
  // (e.g. the statement beam's rotation) is preserved.
  onFrameScroll(() => {
    for (const it of items) {
      const r = it.el.getBoundingClientRect();
      const mid = r.top + r.height / 2 - window.innerHeight / 2;
      it.el.style.translate = `0 ${(-mid * it.speed).toFixed(1)}px`;
    }
  });
})();

/* ── Primitive: magnetic — .magnetic surfaces follow the cursor ── */
(function initMagnetic() {
  if (REDUCED || !FINE_POINTER) return;
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      el.style.transform = `translate(${(dx * 4).toFixed(1)}px, ${(dy * 3).toFixed(1)}px)`;
    }, { passive: true });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
})();
