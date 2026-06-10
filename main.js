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

/* ── Meta Pixel Lead-event helper ── */
const trackLead = (source) => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', { content_name: source });
  }
};

/* ── WhatsApp FAB: fire Pixel Lead on click ── */
const waBtn = document.getElementById('js-whatsapp');
if (waBtn) {
  waBtn.addEventListener('click', () => trackLead('WhatsApp'));
}

/* ── Contact form ──
   No backend yet. We validate, then open the user's email client
   with a prefilled message (mailto fallback).
   TODO (before launch): replace the mailto handler with a real
   submission to Formspree / your backend endpoint, e.g.
     form.action = 'https://formspree.io/f/XXXX'; form.method = 'POST';
   and remove the e.preventDefault() + mailto logic below.
============================================================ */
const form = document.getElementById('contact-form');
if (form) {
  const submitBtn = document.getElementById('submit-btn');

  const setError = (field, on) => {
    const wrap = field.closest('.field');
    if (wrap) wrap.classList.toggle('invalid', on);
  };

  form.addEventListener('submit', e => {
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

    trackLead('Contact Form');

    const company = form.querySelector('#cf-company');
    const service = form.querySelector('#cf-service');
    const budget  = form.querySelector('#cf-budget');

    const subject = `Project inquiry — ${name.value.trim()}`;
    const bodyLines = [
      `Name: ${name.value.trim()}`,
      `Email: ${email.value.trim()}`,
      company && company.value.trim() ? `Company: ${company.value.trim()}` : null,
      service && service.value ? `Service: ${service.options[service.selectedIndex].text}` : null,
      budget && budget.value ? `Budget: ${budget.options[budget.selectedIndex].text}` : null,
      '',
      'Project details:',
      message.value.trim()
    ].filter(Boolean);

    const mailto = `mailto:inquiries@gitleb.dev?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

    if (submitBtn) {
      submitBtn.textContent = 'Opening your email…';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
    }

    window.location.href = mailto;

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.textContent = '✓ Email client opened';
        submitBtn.style.opacity = '1';
      }
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.textContent = 'Send Message →';
          submitBtn.disabled = false;
        }
      }, 3500);
    }, 1200);
  });
}
