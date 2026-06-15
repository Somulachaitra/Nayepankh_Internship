/* ===========================================
   AI Impact Calculator - Personalized Experience
   =========================================== */

(function () {
  'use strict';

  const form = document.getElementById('impact-form');
  if (!form) return;

  const amountInput = form.querySelector('[name="amount"]');
  const frequencySelect = form.querySelector('[name="frequency"]');
  const causeSelect = form.querySelector('[name="cause"]');
  const resultEl = document.getElementById('impact-result');

  // Impact ratios (per ₹100)
  const impactRates = {
    education: { meals: 2, books: 1, students: 0.2, label: 'Children Educated', icon: '📚' },
    food: { meals: 5, students: 0.4, books: 0, label: 'Meals Provided', icon: '🍱' },
    hygiene: { meals: 0, books: 0, students: 0.5, label: 'Women Supported', icon: '🩷' },
    clothing: { meals: 1, books: 0, students: 0.3, label: 'Families Clothed', icon: '👕' },
    general: { meals: 2, books: 0.5, students: 0.2, label: 'Lives Touched', icon: '💛' }
  };

  function calculate() {
    const amount = parseFloat(amountInput.value) || 0;
    const frequency = frequencySelect.value;
    const cause = causeSelect.value;
    const multiplier = frequency === 'monthly' ? 12 : frequency === 'weekly' ? 52 : 1;

    const rates = impactRates[cause] || impactRates.general;
    const yearlyAmount = amount * multiplier;

    // Calc metrics
    const meals = Math.floor((yearlyAmount / 100) * rates.meals);
    const students = Math.floor((yearlyAmount / 100) * rates.students);
    const livesTouched = meals + students + Math.floor(yearlyAmount / 500);

    const causeLabel = causeSelect.options[causeSelect.selectedIndex].text;

    resultEl.innerHTML = `
      <h4>${rates.icon} Your Personalized Impact</h4>
      <p style="color: var(--text-muted); font-size: 0.95rem;">
        By contributing <strong style="color: var(--primary);">₹${amount.toLocaleString('en-IN')}</strong>
        ${frequency !== 'one-time' ? `<strong style="color: var(--primary);">${frequency}</strong>` : ''}
        to <strong>${causeLabel}</strong>, here's the real-world difference you'll make:
      </p>
      <div class="impact-metrics">
        <div class="impact-metric">
          <strong>${meals.toLocaleString('en-IN')}</strong>
          <span>Meals Provided</span>
        </div>
        <div class="impact-metric">
          <strong>${students.toLocaleString('en-IN')}</strong>
          <span>${rates.label}</span>
        </div>
        <div class="impact-metric">
          <strong>${livesTouched.toLocaleString('en-IN')}</strong>
          <span>Lives Touched</span>
        </div>
      </div>
      <p style="margin-top: 16px; font-size: 0.9rem; color: var(--text-soft);">
        🌟 That's roughly <strong>${Math.ceil(yearlyAmount / 100)}</strong> people benefiting from your kindness
        over ${frequency === 'one-time' ? 'this act' : 'the next year'}!
      </p>
    `;
    resultEl.style.display = 'block';
    resultEl.style.animation = 'fadeUp 0.6s var(--ease)';
  }

  // Live update
  [amountInput, frequencySelect, causeSelect].forEach(el => {
    el.addEventListener('input', calculate);
    el.addEventListener('change', calculate);
  });

  // Initial calc
  calculate();
})();

/* ---------- Personalized Recommendations ---------- */
(function () {
  const recEl = document.getElementById('recommendations');
  if (!recEl) return;

  // Simulated AI recommendations
  const recommendations = [
    {
      icon: '🎯',
      title: 'Sponsor a Child\'s Education',
      desc: 'For ₹2,500/month, you can sponsor a child\'s complete education including books, uniform, and tuition.',
      cta: 'Sponsor Now'
    },
    {
      icon: '🍱',
      title: 'Feed 50 Families',
      desc: 'A one-time donation of ₹5,000 can provide nutritious meals to 50 families for a week.',
      cta: 'Donate Food'
    },
    {
      icon: '🌟',
      title: 'Become a Monthly Champion',
      desc: 'Recurring monthly donations help us plan long-term programs and reach more communities consistently.',
      cta: 'Join Champions'
    }
  ];

  recEl.innerHTML = recommendations.map(r => `
    <div class="program-card reveal">
      <div class="program-icon">${r.icon}</div>
      <h3>${r.title}</h3>
      <p>${r.desc}</p>
      <button class="btn btn-secondary">${r.cta}</button>
    </div>
  `).join('');
})();
