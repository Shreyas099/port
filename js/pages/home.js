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

  // Preloader total duration: chars(0.5) + bar(1.2, offset -0.3) + exit(0.8) + strips(0.55) ≈ 2.7s
  const HERO_ANIM_DELAY = 2.7;

  gsap.fromTo('.hero-greeting',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: HERO_ANIM_DELAY - 0.1 }
  );

  gsap.fromTo('.hero-title .glitch',
    { y: 80, opacity: 0, rotateX: -40 },
    { y: 0, opacity: 1, rotateX: 0, duration: 0.8, ease: 'power3.out', delay: HERO_ANIM_DELAY }
  );

  gsap.fromTo('.hero-subtitle',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: HERO_ANIM_DELAY + 0.3 }
  );

  gsap.fromTo('.hero-actions > *',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: HERO_ANIM_DELAY + 0.5 }
  );

  gsap.fromTo('.hero-stats .stat-item',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: HERO_ANIM_DELAY + 0.7 }
  );
})();

/* ============================================================
   NAV CARD 3D TILT — perspective tilt toward cursor
   ============================================================ */
(function initNavCard3DTilt() {
  if ('ontouchstart' in window || _prefersReducedMotion) return;

  document.querySelectorAll('.nav-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      const rotX   = -y * 12;
      const rotY   =  x * 12;

      /* Update gradient mouse position CSS vars */
      card.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
      card.style.setProperty('--mouse-y', ((e.clientY - rect.top)  / rect.height * 100) + '%');

      if (typeof gsap !== 'undefined') {
        gsap.to(card, {
          rotateX: rotX,
          rotateY: rotY,
          transformPerspective: 800,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      } else {
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
      if (typeof gsap !== 'undefined') {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)',
          overwrite: 'auto',
        });
      } else {
        card.style.transform = '';
      }
    });
  });
})();

/* ============================================================
   PINNED QUOTE — word-by-word reveal with blur+scale on scroll
   ============================================================ */
(function initPinnedQuote() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || _prefersReducedMotion) {
    // Fallback — show all words immediately
    document.querySelectorAll('.quote-word').forEach(w => {
      w.style.opacity = '1';
      w.style.filter  = 'none';
      w.style.transform = 'none';
    });
    return;
  }

  const section = document.querySelector('.pinned-quote-section');
  const words   = gsap.utils.toArray('.quote-word');
  if (!section || !words.length) return;

  const PIXELS_PER_WORD = 100;

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=' + (words.length * PIXELS_PER_WORD),
    pin: true,
    scrub: 0.8,
    onUpdate: (self) => {
      const progress = self.progress;
      words.forEach((word, i) => {
        const wordProgress = (i + 1) / words.length;
        const lit = progress >= wordProgress - 0.05;
        word.style.opacity   = lit ? '1' : '0.12';
        word.style.filter    = lit ? 'blur(0px)' : 'blur(6px)';
        word.style.transform = lit ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(8px)';
      });
    }
  });
})();

/* ============================================================
   HORIZONTAL SCROLL — LandoNorris-inspired showcase gallery
   ============================================================ */
(function initHorizontalScroll() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || _prefersReducedMotion) return;

  const section = document.querySelector('.horizontal-scroll-section');
  const track   = document.querySelector('.horizontal-scroll-track');
  if (!section || !track) return;

  // On mobile, skip the pinned horizontal scroll
  if (window.innerWidth <= 768) {
    section.style.height = 'auto';
    return;
  }

  function getScrollAmount() {
    // Amount to scroll = total track width minus one viewport width
    // Use clientWidth to exclude potential scrollbar width
    return track.scrollWidth - document.documentElement.clientWidth;
  }

  const tween = gsap.to(track, {
    x: () => -getScrollAmount(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => '+=' + Math.max(getScrollAmount(), 100),
      pin: true,
      scrub: 1.2,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  });

  // Refresh on resize to recalculate dimensions
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth <= 768) {
        tween.scrollTrigger.kill();
        section.style.height = 'auto';
        track.style.transform = '';
      }
      ScrollTrigger.refresh();
    }, 250);
  }, { passive: true });
})();

/* ============================================================
   TICKER — hover pause & second row
   ============================================================ */
(function initTickerEnhancements() {
  // Hover-pause on ticker items
  document.querySelectorAll('.ticker-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      const track = item.closest('.ticker-track');
      if (track) track.style.animationPlayState = 'paused';
    });
    item.addEventListener('mouseleave', () => {
      const track = item.closest('.ticker-track');
      if (track) track.style.animationPlayState = 'running';
    });
  });
})();
