/* ============================================================
   ABOUT PAGE JS - js/pages/about.js
   ============================================================ */

/* ============================================================
   TIMELINE ENTRANCE ANIMATION
   ============================================================ */
(function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('active');
        }, i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(24px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });

  // Listen for active class to animate in
  const mutObs = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      if (m.target.classList.contains('active')) {
        m.target.style.opacity  = '1';
        m.target.style.transform = 'translateY(0)';
      }
    });
  });
  items.forEach(item => mutObs.observe(item, { attributes: true, attributeFilter: ['class'] }));
})();

/* ============================================================
   FLIP CARDS — click to toggle on touch devices
   ============================================================ */
(function initFlipCards() {
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
})();

/* ============================================================
   SKILL BARS — animate width on scroll
   ============================================================ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.dataset.width || '80%';
        setTimeout(() => {
          bar.style.width = targetWidth;
        }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });

  bars.forEach(bar => observer.observe(bar));
})();
