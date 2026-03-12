/* ============================================================
   HOME PAGE JS - js/pages/home.js
   ============================================================ */

const _prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   TYPING EFFECT
   ============================================================ */
(function initTypingEffect() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const phrases = [
    'Full Stack Developer',
    'UI/UX Enthusiast',
    'Problem Solver',
    'Open Source Contributor'
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let pauseFrames = 0;

  const TYPING_SPEED   = 80;
  const DELETING_SPEED = 45;
  const PAUSE_AFTER    = 60; // frames at ~16ms each ≈ ~1s

  function tick() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting && charIndex <= currentPhrase.length) {
      el.textContent = currentPhrase.slice(0, charIndex);
      charIndex++;
      if (charIndex > currentPhrase.length) {
        isDeleting  = true;
        pauseFrames = PAUSE_AFTER;
      }
      setTimeout(tick, TYPING_SPEED);
    } else if (isDeleting && pauseFrames > 0) {
      pauseFrames--;
      setTimeout(tick, 16);
    } else if (isDeleting) {
      el.textContent = currentPhrase.slice(0, charIndex);
      charIndex--;
      if (charIndex < 0) {
        isDeleting  = false;
        charIndex   = 0;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
      setTimeout(tick, DELETING_SPEED);
    }
  }

  tick();
})();

/* ============================================================
   ANIMATED COUNTERS — GSAP version or RAF fallback
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !_prefersReducedMotion) {
    // GSAP version with snap
    counters.forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';

      gsap.fromTo(el,
        { textContent: 0 },
        {
          textContent: target,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          scrollTrigger: { trigger: el, start: 'top 80%' },
          onUpdate: function() {
            el.textContent = Math.round(parseFloat(el.textContent)) + suffix;
          }
        }
      );
    });
  } else {
    // RAF fallback
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el      = entry.target;
        const target  = parseInt(el.dataset.count, 10);
        const suffix  = el.dataset.suffix || '';
        const duration = 1800;
        const start   = performance.now();

        function update(now) {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }
})();

/* ============================================================
   HERO TEXT ANIMATIONS — GSAP entrance after preloader
   ============================================================ */
(function initHeroAnimations() {
  if (typeof gsap === 'undefined' || _prefersReducedMotion) return;

  const DELAY = 2.2; // Account for preloader duration

  gsap.fromTo('.hero-greeting',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: DELAY - 0.1 }
  );

  gsap.fromTo('.hero-title .glitch',
    { y: 80, opacity: 0, rotateX: -40 },
    { y: 0, opacity: 1, rotateX: 0, duration: 0.8, ease: 'power3.out', delay: DELAY }
  );

  gsap.fromTo('.hero-subtitle',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: DELAY + 0.3 }
  );

  gsap.fromTo('.hero-actions > *',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: DELAY + 0.5 }
  );

  gsap.fromTo('.hero-stats .stat-item',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: DELAY + 0.7 }
  );
})();

/* ============================================================
   PINNED QUOTE — word-by-word reveal on scroll
   ============================================================ */
(function initPinnedQuote() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || _prefersReducedMotion) return;

  const section = document.querySelector('.pinned-quote-section');
  const words   = gsap.utils.toArray('.quote-word');
  if (!section || !words.length) return;

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=' + (words.length * 120),
    pin: true,
    scrub: 0.5,
    onUpdate: (self) => {
      const progress = self.progress;
      words.forEach((word, i) => {
        const wordProgress = (i + 1) / words.length;
        word.style.opacity = progress >= wordProgress - 0.05 ? '1' : '0.15';
      });
    }
  });
})();
