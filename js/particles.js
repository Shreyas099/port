/* ============================================================
   PARTICLES.JS — Interactive canvas particle system
   Constellation / neural-network effect with mouse repulsion
   ============================================================ */

(function initParticleCanvas() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  /* ---- Config ---- */
  const CONFIG = {
    count:          90,
    maxDist:        130,      // connection line max distance
    mouseRadius:    120,      // repulsion radius
    mouseStrength:  0.04,     // repulsion strength
    speed:          0.35,
    minSize:        1,
    maxSize:        2.5,
    colors: [
      'rgba(255, 107,  0, ',   // --accent (orange)
      'rgba(168,  85, 247, ',  // --accent-secondary (purple)
      'rgba(196, 245,  66, ',  // --accent-tertiary (lime)
      'rgba(255,  45,  85, ',  // --neon-pink
    ],
  };

  /* ---- Canvas setup ---- */
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;
  let particles = [];
  let mouseX = -9999, mouseY = -9999;
  let rafId = null;
  let visible = true;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  /* ---- Particle class ---- */
  function createParticle() {
    const colorBase = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
    return {
      x:      Math.random() * W,
      y:      Math.random() * H,
      vx:     (Math.random() - 0.5) * CONFIG.speed,
      vy:     (Math.random() - 0.5) * CONFIG.speed,
      size:   Math.random() * (CONFIG.maxSize - CONFIG.minSize) + CONFIG.minSize,
      opacity: Math.random() * 0.55 + 0.15,
      colorBase,
    };
  }

  function buildParticles() {
    particles = Array.from({ length: CONFIG.count }, createParticle);
  }

  /* ---- Draw ---- */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* Vignette — fade toward edges */
    const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.75);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(8,7,11,0.6)');

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      /* Mouse repulsion */
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRadius && dist > 0) {
        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
        p.vx += (dx / dist) * force * CONFIG.mouseStrength * 2;
        p.vy += (dy / dist) * force * CONFIG.mouseStrength * 2;
      }

      /* Damping */
      p.vx *= 0.99;
      p.vy *= 0.99;

      /* Clamp speed */
      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd > CONFIG.speed * 2.5) {
        p.vx = (p.vx / spd) * CONFIG.speed * 2.5;
        p.vy = (p.vy / spd) * CONFIG.speed * 2.5;
      }

      /* Move */
      p.x += p.vx;
      p.y += p.vy;

      /* Wrap */
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;

      /* Draw dot */
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.colorBase + p.opacity + ')';
      ctx.fill();

      /* Draw connections */
      for (let j = i + 1; j < particles.length; j++) {
        const q  = particles[j];
        const ex = p.x - q.x;
        const ey = p.y - q.y;
        const d  = Math.sqrt(ex * ex + ey * ey);
        if (d < CONFIG.maxDist) {
          const alpha = (1 - d / CONFIG.maxDist) * 0.25;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = p.colorBase + alpha + ')';
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }

    /* Apply vignette */
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);
  }

  function loop() {
    if (visible) draw();
    rafId = requestAnimationFrame(loop);
  }

  /* ---- Mouse tracking — listen on parent hero since canvas has pointer-events:none ---- */
  const hero = canvas.closest('section') || document.body;

  hero.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
  });

  /* Also reset when document mouse leaves the window */
  document.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
  });

  /* ---- Pause when off-screen (IntersectionObserver) ---- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
    }, { threshold: 0 });
    io.observe(canvas);
  }

  /* ---- Init ---- */
  resize();
  buildParticles();
  loop();

  window.addEventListener('resize', () => {
    resize();
    buildParticles();
  }, { passive: true });
})();
