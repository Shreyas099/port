/* ============================================================
   ABOUT PAGE JS - js/pages/about.js
   ============================================================ */

const _prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   TIMELINE ENTRANCE ANIMATION — GSAP or IntersectionObserver
   ============================================================ */
(function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !_prefersReducedMotion) {
    // GSAP version: alternating slide from left/right
    items.forEach((item, i) => {
      const direction = i % 2 === 0 ? -60 : 60;
      gsap.fromTo(item,
        { x: direction, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 85%' }
        }
      );
    });
  } else {
    // IntersectionObserver fallback with stagger
    let staggerIndex = 0;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const item  = entry.target;
          const delay = staggerIndex * 100;
          staggerIndex++;
          setTimeout(() => { item.classList.add('active'); }, delay);
          observer.unobserve(item);
        }
      });
    }, { threshold: 0.15 });

    items.forEach(item => {
      item.style.opacity   = '0';
      item.style.transform = 'translateY(24px)';
      item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(item);
    });

    const mutObs = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        if (m.target.classList.contains('active')) {
          m.target.style.opacity   = '1';
          m.target.style.transform = 'translateY(0)';
        }
      });
    });
    items.forEach(item => mutObs.observe(item, { attributes: true, attributeFilter: ['class'] }));
  }
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
        setTimeout(() => { bar.style.width = targetWidth; }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });

  bars.forEach(bar => observer.observe(bar));
})();
