/* ============================================================
   SKILLS PAGE JS - js/pages/skills.js
   ============================================================ */

const _prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   PROGRESS RING ANIMATION — GSAP or RAF fallback
   ============================================================ */
(function initProgressRings() {
  const rings = document.querySelectorAll('.progress-ring-wrap');
  if (!rings.length) return;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !_prefersReducedMotion) {
    // GSAP version
    rings.forEach(ring => {
      const target = parseInt(ring.dataset.progress || '0', 10);
      const pctEl  = ring.querySelector('.progress-ring-pct');

      ring.style.background = 'conic-gradient(var(--accent) 0%, rgba(255,255,255,0.04) 0)';

      const proxy = { val: 0 };
      gsap.fromTo(proxy,
        { val: 0 },
        {
          val: target,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: { trigger: ring, start: 'top 80%' },
          onUpdate: function() {
            const current = Math.round(proxy.val);
            ring.style.background = `conic-gradient(var(--accent) ${current}%, rgba(255,255,255,0.04) 0)`;
            if (pctEl) pctEl.textContent = current + '%';
          }
        }
      );
    });
  } else {
    // RAF fallback
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const ring    = entry.target;
        const rawProgress = ring.dataset.progress;
        if (!rawProgress) {
          console.warn('progress-ring-wrap is missing data-progress attribute', ring);
        }
        const target  = parseInt(rawProgress || '0', 10);
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
  }
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
  const buttons    = document.querySelectorAll('.filter-btn');
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
          cat.querySelectorAll('.skill-flip-card').forEach((card, i) => {
            card.style.opacity   = '0';
            card.style.transform = 'translateY(16px)';
            setTimeout(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity    = '1';
              card.style.transform  = 'translateY(0)';
            }, i * 50);
          });
        } else {
          cat.style.display = 'none';
        }
      });
    });
  });
})();

/* ============================================================
   CATEGORY HEADER PULSE ON SCROLL
   ============================================================ */
(function initCategoryPulse() {
  const headers = document.querySelectorAll('.skill-category-header');
  if (!headers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('pulsed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  headers.forEach(h => observer.observe(h));
})();

/* ============================================================
   SKILL COUNT BADGES — show count per category
   ============================================================ */
(function initSkillCountBadges() {
  document.querySelectorAll('.skill-category').forEach(cat => {
    const header = cat.querySelector('.skill-category-header h3, .skill-category h3');
    if (!header) return;

    const count = cat.querySelectorAll('.skill-flip-card').length;
    if (!count) return;

    const badge = document.createElement('span');
    badge.className = 'skill-count-badge';
    badge.textContent = count;
    header.appendChild(badge);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => badge.classList.add('visible'), 200);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(header);
  });
})();
