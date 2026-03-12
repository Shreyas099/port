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
        gsap.to(ring, { scale: 1, borderColor: 'rgba(0, 212, 255, 0.4)', duration: 0.3 });
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
   PAGE TRANSITIONS — GSAP overlay
   ============================================================ */
function initPageTransitions() {
  // Create overlay
  let overlay = document.querySelector('.page-transition-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.innerHTML = '<div class="transition-strip"></div>';
    document.body.appendChild(overlay);
  }

  if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
    // Start off-screen (preloader handles entrance)
    gsap.set(overlay, { yPercent: -100 });

    // Intercept internal links
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = href;
        gsap.fromTo(overlay,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 0.6,
            ease: 'power3.inOut',
            onComplete: () => {
              window.location.href = target;
            }
          }
        );
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
  initMagneticHover();
  initScrollAnimations();
  initParallax();
  initPageTransitions();
  initScrollToTop();
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
      initPageEntranceAnimations();
    }
  });
}

/* ============================================================
   BOOT
   ============================================================ */
setActiveNavLink();
setFooterYear();
initPreloader();
