/* ============================================================
   MAIN JS - Shared functionality across all pages
   js/main.js
   ============================================================ */

/* ============================================================
   REDUCED MOTION CHECK
   ============================================================ */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   GSAP PLUGIN REGISTRATION
   ============================================================ */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin);
}

/* ============================================================
   LENIS SMOOTH SCROLL
   ============================================================ */
let lenis;
if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    function rafLoop(time) {
      lenis.raf(time);
      requestAnimationFrame(rafLoop);
    }
    requestAnimationFrame(rafLoop);
  }
}

/* ============================================================
   ACTIVE NAV LINK — based on current page filename
   ============================================================ */
function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   DYNAMIC FOOTER YEAR
   ============================================================ */
function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   SMART NAVBAR — hide on scroll down, show on scroll up
   ============================================================ */
function initSmartNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!navbar) return;

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
    });

    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    ScrollTrigger.create({
      start: 'top top',
      end: 99999,
      onUpdate: (self) => {
        const scrollY = self.scroll();
        navbar.classList.toggle('scrolled', scrollY > 50);
        if (scrollY > 100) {
          if (self.direction === 1) {
            gsap.to(navbar, { yPercent: -100, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
          } else {
            gsap.to(navbar, { yPercent: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
          }
        } else {
          gsap.to(navbar, { yPercent: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        }
      }
    });
  } else {
    function onScroll() {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}

/* ============================================================
   GSAP CURSOR — silky movement via quickTo
   ============================================================ */
function initGSAPCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring || 'ontouchstart' in window) return;

  const interactiveSelector = 'a, button, [role="button"], input, textarea, select, .nav-card, .flip-card, .skill-flip-card, .project-card, .faq-question';

  if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
    const xDot  = gsap.quickTo(dot,  'left', { duration: 0.1, ease: 'power3' });
    const yDot  = gsap.quickTo(dot,  'top',  { duration: 0.1, ease: 'power3' });
    const xRing = gsap.quickTo(ring, 'left', { duration: 0.5, ease: 'power3' });
    const yRing = gsap.quickTo(ring, 'top',  { duration: 0.5, ease: 'power3' });

    document.addEventListener('mousemove', (e) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    });

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelector)) {
        gsap.to(ring, { scale: 1.8, borderColor: 'var(--accent)', duration: 0.3 });
        gsap.to(dot,  { scale: 0.5, duration: 0.3 });
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelector)) {
        gsap.to(ring, { scale: 1, borderColor: 'rgba(255, 107, 0, 0.4)', duration: 0.3 });
        gsap.to(dot,  { scale: 1, duration: 0.3 });
      }
    });
  } else {
    // RAF-based fallback cursor
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelector)) {
        dot.classList.add('hover');
        ring.classList.add('hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelector)) {
        dot.classList.remove('hover');
        ring.classList.remove('hover');
      }
    });
  }

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}

/* ============================================================
   MAGNETIC HOVER — on buttons
   ============================================================ */
function initMagneticHover() {
  if ('ontouchstart' in window || typeof gsap === 'undefined' || prefersReducedMotion) return;

  document.querySelectorAll('.btn, .magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ============================================================
   SCROLL ANIMATIONS — GSAP ScrollTrigger or IntersectionObserver
   ============================================================ */
function initScrollAnimations() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    // Signal that GSAP is handling reveals (used by CSS to override opacity:0)
    document.body.classList.add('gsap-active');

    // Fade-up reveals using explicit fromTo (avoids CSS opacity:0 conflict)
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Staggered reveals for groups
    gsap.utils.toArray('.reveal-group').forEach(group => {
      gsap.fromTo(Array.from(group.children),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: group,
            start: 'top 80%',
          }
        }
      );
    });

    // Split reveals
    gsap.utils.toArray('.split-reveal-left').forEach(el => {
      gsap.fromTo(el,
        { x: -80, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });

    gsap.utils.toArray('.split-reveal-right').forEach(el => {
      gsap.fromTo(el,
        { x: 80, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });

    // Scale reveal
    gsap.utils.toArray('.scale-reveal').forEach(el => {
      gsap.fromTo(el,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });
  } else {
    // Fallback IntersectionObserver
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    elements.forEach(el => observer.observe(el));
  }
}

/* ============================================================
   PARALLAX — data-parallax attribute
   ============================================================ */
function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || prefersReducedMotion) return;

  gsap.utils.toArray('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.5;
    gsap.to(el, {
      scrollTrigger: {
        trigger: el.closest('section') || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: () => -100 * speed,
      ease: 'none'
    });
  });
}

/* ============================================================
   PAGE TRANSITIONS — multi-strip wipe (LandoNorris-inspired)
   ============================================================ */
function initPageTransitions() {
  // Create multi-strip overlay
  let overlay = document.querySelector('.page-transition-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    for (let i = 0; i < 5; i++) {
      const strip = document.createElement('div');
      strip.className = 'transition-strip';
      overlay.appendChild(strip);
    }
    document.body.appendChild(overlay);
  }

  const strips = overlay.querySelectorAll('.transition-strip');

  if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
    // Initial state: strips collapsed (hidden)
    gsap.set(strips, { scaleY: 0, transformOrigin: 'top' });

    // Intercept internal links
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = href;
        // Animate strips in
        gsap.to(strips, {
          scaleY: 1,
          transformOrigin: 'top',
          duration: 0.4,
          stagger: 0.05,
          ease: 'power3.inOut',
          onComplete: () => {
            window.location.href = target;
          }
        });
      });
    });
  } else {
    // CSS fallback using existing page-transition element
    const fallback = document.getElementById('page-transition');
    if (!fallback) return;
    fallback.classList.add('active');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { fallback.classList.remove('active'); });
    });

    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        fallback.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 400);
      });
    });
  }
}

/* ============================================================
   AMBIENT PARTICLES — subtle floating canvas particles (non-home pages)
   ============================================================ */
function initAmbientParticles() {
  if (prefersReducedMotion) return;
  // Skip on primary pointer: coarse (phones/tablets without mouse) to save resources
  if (window.matchMedia('(pointer: coarse)').matches) return;
  // Skip on home page — it has the full hero particle canvas
  if (document.getElementById('particle-canvas')) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'ambient-particles';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 35;
  const COLORS = ['rgba(255,107,0,', 'rgba(168,85,247,', 'rgba(196,245,66,'];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.2 + 0.05,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.opacity + ')';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate();
  window.addEventListener('resize', () => { resize(); createParticles(); }, { passive: true });
}

/* ============================================================
   CURSOR TRAILING GHOSTS — 3 fading copies
   ============================================================ */
function initCursorTrails() {
  if ('ontouchstart' in window || prefersReducedMotion) return;

  const trails = [];
  const TRAIL_COUNT = 3;
  const trailClasses = ['cursor-trail cursor-trail-1', 'cursor-trail cursor-trail-2', 'cursor-trail cursor-trail-3'];
  const delays = [0.12, 0.22, 0.35];

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const el = document.createElement('div');
    el.className = trailClasses[i];
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);

    if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
      const delay = delays[i];
      const tx = gsap.quickTo(el, 'left', { duration: delay + 0.1, ease: 'power2' });
      const ty = gsap.quickTo(el, 'top',  { duration: delay + 0.1, ease: 'power2' });
      trails.push({ el, tx, ty });
    } else {
      trails.push({ el, x: 0, y: 0, lag: (i + 1) * 0.08 });
    }
  }

  if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
    document.addEventListener('mousemove', (e) => {
      trails.forEach(t => { t.tx(e.clientX); t.ty(e.clientY); });
    }, { passive: true });
  } else {
    let mx = 0, my = 0;
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    trails.forEach(t => {
      (function animate() {
        t.x += (mx - t.x) * (1 - t.lag);
        t.y += (my - t.y) * (1 - t.lag);
        t.el.style.left = t.x + 'px';
        t.el.style.top  = t.y + 'px';
        requestAnimationFrame(animate);
      })();
    });
  }

  document.addEventListener('mouseleave', () => {
    trails.forEach(t => { t.el.style.opacity = '0'; });
  });
  document.addEventListener('mouseenter', () => {
    trails.forEach((t, i) => { t.el.style.opacity = ['0.5','0.3','0.15'][i]; });
  });
}

/* ============================================================
   CLICK RIPPLE — expanding ring on mouse click
   ============================================================ */
function initClickRipple() {
  if ('ontouchstart' in window || prefersReducedMotion) return;

  document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top  = e.clientY + 'px';
    document.body.appendChild(ripple);

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(ripple,
        { width: 0, height: 0, opacity: 0.8 },
        {
          width: 80, height: 80, opacity: 0, duration: 0.6, ease: 'power2.out',
          onComplete: () => ripple.remove()
        }
      );
    } else {
      ripple.style.transition = 'all 0.6s ease';
      requestAnimationFrame(() => {
        ripple.style.width   = '80px';
        ripple.style.height  = '80px';
        ripple.style.opacity = '0';
        setTimeout(() => ripple.remove(), 600);
      });
    }
  });
}

/* ============================================================
   NOISE OVERLAY — film grain
   ============================================================ */
function initNoiseOverlay() {
  if (prefersReducedMotion) return;
  if (document.querySelector('.noise-overlay')) return;
  const noise = document.createElement('div');
  noise.className = 'noise-overlay';
  noise.setAttribute('aria-hidden', 'true');
  document.body.appendChild(noise);
}

/* ============================================================
   TEXT SCRAMBLE — decode effect on section labels
   ============================================================ */
function initTextScramble() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || prefersReducedMotion) return;

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

  gsap.utils.toArray('.section-label').forEach(el => {
    const originalText = el.textContent;
    let hasPlayed = false;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        if (hasPlayed) return;
        hasPlayed = true;
        let iteration = 0;
        const maxIterations = originalText.length * 3;

        // Temporarily hide from screen readers during scramble animation
        el.setAttribute('aria-hidden', 'true');

        const interval = setInterval(() => {
          el.textContent = originalText
            .split('')
            .map((char, i) => {
              if (char === ' ') return ' ';
              if (i < iteration / 3) return originalText[i];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

          iteration++;
          if (iteration >= maxIterations) {
            el.textContent = originalText;
            el.removeAttribute('aria-hidden');
            clearInterval(interval);
          }
        }, 30);
      }
    });
  });
}

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress-bar');
  if (!bar) return;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.to(bar, {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      }
    });
  }
}

/* ============================================================
   SCROLL-TO-TOP — Lenis or native
   ============================================================ */
function initScrollToTop() {
  document.querySelectorAll('[data-scroll-top], .back-to-top').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

/* ============================================================
   PRELOADER ANIMATION — runs first, then triggers page anims
   ============================================================ */
function initPageEntranceAnimations() {
  initSmartNavbar();
  initGSAPCursor();
  initCursorTrails();
  initClickRipple();
  initMagneticHover();
  initScrollAnimations();
  initParallax();
  initPageTransitions();
  initScrollToTop();
  initAmbientParticles();
  initTextScramble();
  initScrollProgress();
  initNoiseOverlay();
}

function initPreloader() {
  const preloader = document.getElementById('preloader');

  if (!preloader || typeof gsap === 'undefined' || prefersReducedMotion) {
    // No preloader or reduced motion: skip straight to page animations
    if (preloader) preloader.remove();
    initPageEntranceAnimations();
    return;
  }

  const chars   = preloader.querySelectorAll('.preloader-char');
  const barFill = preloader.querySelector('.preloader-bar-fill');
  const counter = preloader.querySelector('.preloader-counter');

  const tl = gsap.timeline();

  tl.to(chars, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.05,
    ease: 'power3.out'
  });

  tl.to(barFill, {
    width: '100%',
    duration: 1.2,
    ease: 'power2.inOut'
  }, '-=0.3');

  tl.to(counter, {
    textContent: 100,
    duration: 1.2,
    snap: { textContent: 1 },
    ease: 'power2.inOut'
  }, '<');

  // Chain exit animation directly into timeline
  tl.to(preloader, {
    yPercent: -100,
    duration: 0.8,
    ease: 'power3.inOut',
    onComplete: () => {
      preloader.remove();

      // Multi-strip page entry reveal — strips slide away to expose the page
      const overlay = document.querySelector('.page-transition-overlay');
      const entryStrips = overlay ? overlay.querySelectorAll('.transition-strip') : [];
      if (entryStrips.length) {
        gsap.set(entryStrips, { scaleY: 1, transformOrigin: 'top' });
        gsap.to(entryStrips, {
          scaleY: 0,
          transformOrigin: 'top',
          duration: 0.55,
          stagger: { each: 0.06, from: 'center' },
          ease: 'power3.inOut',
          onComplete: initPageEntranceAnimations
        });
      } else {
        initPageEntranceAnimations();
      }
    }
  });
}

/* ============================================================
   BOOT
   ============================================================ */
setActiveNavLink();
setFooterYear();
initPreloader();
