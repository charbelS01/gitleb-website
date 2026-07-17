'use strict';

/* ============================================================
   GitLeb — shared site JS (loaded on every page)
============================================================ */

/* ── Navbar scroll state ── */
const navbar = document.getElementById('navbar');
if (navbar) {
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Active nav link (based on current page) ── */
(function setActiveNav() {
  let path = window.location.pathname.split('/').pop() || 'index.html';
  if (path === '') path = 'index.html';
  document.querySelectorAll('[data-nav]').forEach(a => {
    if (a.getAttribute('data-nav') === path) a.classList.add('active');
  });
})();

/* ── Mobile nav ── */
const mobileNav   = document.getElementById('js-mobile-nav');
const hamburger   = document.getElementById('js-hamburger');
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
}

/* ── Scroll reveal (IntersectionObserver) ── */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
  revealEls.forEach(el => revealObs.observe(el));
}

/* ── Reveal above-the-fold elements immediately on load ── */
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal, .page-hero .reveal').forEach(el => el.classList.add('in'));
});

/* ── FAQ accordion ── */
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

/* ── WhatsApp clicks: fire Pixel custom event ──
   Targets any wa.me / whatsapp.com link site-wide via trackCustom,
   so audiences and ad optimisation can use WhatsApp intent.
*/
document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach(function (el) {
  el.addEventListener('click', function () {
    if (window.fbq) { fbq('trackCustom', 'WhatsApp_Click'); }
  });
});

/* ── Contact form ──
   Posts JSON to /api/contact. Meta Pixel 'Lead' fires ONLY on a
   confirmed res.ok — keeps ad attribution clean.

   TODO: build the /api/contact serverless endpoint (Vercel function
   that emails inquiries@gitleb.dev via Resend / SendGrid / etc).
   Until that ships, the catch block falls back to opening the user's
   email client so the form stays usable. The fallback intentionally
   does NOT fire Lead — only confirmed backend success counts.
============================================================ */
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
    submitBtn.textContent = 'Send Message →';
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    submitBtn.style.background = '';
  }, 3500);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = form.querySelector('#cf-name');
    const email   = form.querySelector('#cf-email');
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
    const budget  = form.querySelector('#cf-budget');

    const formData = {
      name:    name.value.trim(),
      email:   email.value.trim(),
      company: company?.value.trim() || '',
      service: getSelectText(service),
      budget:  getSelectText(budget),
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
        if (typeof window !== 'undefined' && window.fbq) {
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
        formData.budget  ? `Budget: ${formData.budget}`   : null,
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
   V3.1 — MOTION ENGINE
   Aurora field, grid glow, card spotlight, magnetic buttons,
   scroll progress, nav auto-hide.
   All pointer effects: desktop-only, reduced-motion aware.
============================================================ */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---- Scroll progress hairline ---- */
  const prog = document.createElement('div');
  prog.className = 'scroll-progress';
  prog.setAttribute('aria-hidden', 'true');
  document.body.appendChild(prog);
  const updateProg = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
  };
  addEventListener('scroll', updateProg, { passive: true });
  updateProg();

  /* ---- Nav auto-hide (down = hide, up = show) ---- */
  const navEl = document.getElementById('navbar');
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (navEl) {
      if (y > 320 && y > lastY + 4) navEl.classList.add('hidden');
      else if (y < lastY - 4 || y < 320) navEl.classList.remove('hidden');
    }
    lastY = y;
  }, { passive: true });

  if (reduced || !finePointer) return;   // pointer effects below this line only
  document.body.classList.add('has-pointer');

  /* ---- Aurora field: blobs drift lazily toward the cursor ---- */
  const aurora = document.createElement('div');
  aurora.className = 'aurora';
  aurora.setAttribute('aria-hidden', 'true');
  aurora.innerHTML = '<span class="a1"></span><span class="a2"></span><span class="a3"></span>';
  document.body.prepend(aurora);
  const blobs = [...aurora.children].map((el, i) => ({
    el, x: 0, y: 0, f: [0.035, 0.022, 0.05][i], amp: [46, 70, 34][i]
  }));

  let mx = innerWidth / 2, my = innerHeight / 3;
  const root = document.documentElement;
  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    root.style.setProperty('--mx', mx + 'px');
    root.style.setProperty('--my', my + 'px');
  }, { passive: true });

  (function drift() {
    const nx = (mx / innerWidth - 0.5), ny = (my / innerHeight - 0.5);
    for (const b of blobs) {
      b.x += (nx * b.amp - b.x) * b.f;
      b.y += (ny * b.amp - b.y) * b.f;
      b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
    }
    requestAnimationFrame(drift);
  })();

  /* ---- Card spotlight ---- */
  document.querySelectorAll('.svc-card, .work-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--cx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--cy', (e.clientY - r.top) + 'px');
    }, { passive: true });
  });

  /* ---- Magnetic buttons ---- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      btn.style.transform = `translate(${dx * 4}px, ${dy * 3}px)`;
    }, { passive: true });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();
