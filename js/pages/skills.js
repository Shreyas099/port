/* ============================================================
   SKILLS PAGE JS - js/pages/skills.js
   ============================================================ */

/* ============================================================
   PROGRESS RING ANIMATION — conic-gradient on scroll
   ============================================================ */
(function initProgressRings() {
  const rings = document.querySelectorAll('.progress-ring-wrap');
  if (!rings.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const ring    = entry.target;
      const target  = parseInt(ring.dataset.progress || '80', 10);
      const pctEl   = ring.querySelector('.progress-ring-pct');
      let current   = 0;
      const duration = 1200;
      const start   = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        current        = Math.round(eased * target);
        ring.style.background = `conic-gradient(var(--accent) ${current}%, rgba(255,255,255,0.04) 0)`;
        if (pctEl) pctEl.textContent = current + '%';
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observer.unobserve(ring);
    });
  }, { threshold: 0.3 });

  rings.forEach(ring => {
    ring.style.background = 'conic-gradient(var(--accent) 0%, rgba(255,255,255,0.04) 0)';
    observer.observe(ring);
  });
})();

/* ============================================================
   FLIP CARD INTERACTIONS
   ============================================================ */
(function initFlipCards() {
  document.querySelectorAll('.skill-flip-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
})();

/* ============================================================
   CATEGORY FILTER
   ============================================================ */
(function initSkillFilter() {
  const buttons   = document.querySelectorAll('.filter-btn');
  const categories = document.querySelectorAll('.skill-category');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      categories.forEach(cat => {
        if (filter === 'all' || cat.dataset.category === filter) {
          cat.style.display = '';
          // Re-trigger entrance for revealed cards
          cat.querySelectorAll('.skill-flip-card').forEach((card, i) => {
            card.style.opacity  = '0';
            card.style.transform = 'translateY(16px)';
            setTimeout(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity   = '1';
              card.style.transform = 'translateY(0)';
            }, i * 50);
          });
        } else {
          cat.style.display = 'none';
        }
      });
    });
  });
})();
