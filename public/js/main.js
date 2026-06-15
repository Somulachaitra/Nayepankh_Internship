/* ===========================================
   Main JavaScript - NayePankh Foundation
   =========================================== */

(function () {
  'use strict';

  /* ---------- Theme (Dark Mode) ---------- */
  const themeToggle = document.querySelector('.theme-toggle');
  const stored = localStorage.getItem('np-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initial);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('np-theme', next);
    });
  }

  /* ---------- Mobile Menu ---------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = menuToggle.querySelector('svg');
      if (navMenu.classList.contains('open')) {
        icon.innerHTML = '<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
      } else {
        icon.innerHTML = '<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
      }
    });
  }

  /* ---------- Header scroll effect ---------- */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }, { passive: true });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Counter animation ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCount(e.target);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  }

  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = (el.dataset.count.split('.')[1] || '').length;
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = prefix + current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
    }
    requestAnimationFrame(step);
  }

  /* ---------- Range input live update ---------- */
  document.querySelectorAll('[data-range-target]').forEach(input => {
    const target = document.querySelector(input.dataset.rangeTarget);
    if (!target) return;
    const update = () => { target.textContent = input.value; };
    input.addEventListener('input', update);
    update();
  });

  /* ---------- Amount option selection ---------- */
  document.querySelectorAll('.amount-options').forEach(group => {
    const options = group.querySelectorAll('.amount-option');
    const custom = group.parentElement.querySelector('[data-custom-amount]');
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        if (custom) custom.value = opt.dataset.amount;
      });
    });
  });

  /* ---------- Checkbox group selection ---------- */
  document.querySelectorAll('.checkbox-item input').forEach(input => {
    input.addEventListener('change', () => {
      input.closest('.checkbox-item').classList.toggle('selected', input.checked);
    });
  });

  /* ---------- Form success feedback ---------- */
  document.querySelectorAll('form[data-feedback]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = form.dataset.feedback || 'Thank you! We will get back to you soon.';
      showToast(msg);
      form.reset();
      form.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    });
  });

  /* ---------- Toast ---------- */
  function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">✓</span>
      <span>${message}</span>
    `;
    Object.assign(toast.style, {
      position: 'fixed',
      top: '90px',
      right: '24px',
      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      color: '#fff',
      padding: '14px 22px',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      zIndex: '9999',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontWeight: '600',
      fontSize: '0.95rem',
      transform: 'translateX(120%)',
      transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)'
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });
    setTimeout(() => {
      toast.style.transform = 'translateX(120%)';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  /* ---------- Active nav link based on path ---------- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.endsWith(path)) link.classList.add('active');
  });

})();
