/* ============================================================
   HOME PAGE JS - js/pages/home.js
   ============================================================ */

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

  const TYPING_SPEED  = 80;
  const DELETING_SPEED = 45;
  const PAUSE_AFTER   = 60; // frames at ~16ms each ≈ ~1s

  function tick() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting && charIndex <= currentPhrase.length) {
      el.textContent = currentPhrase.slice(0, charIndex);
      charIndex++;

      if (charIndex > currentPhrase.length) {
        // Done typing — pause
        isDeleting = true;
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
   ANIMATED COUNTERS
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start  = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();
