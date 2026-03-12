/* ============================================================
   PORTFOLIO — js/main.js
   Vanilla JS: scroll animations, typing effect, project filter,
   mobile menu, active nav, animated counters, form validation
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. UTILITY HELPERS
  ---------------------------------------------------------- */

  /**
   * Throttle a callback to run at most once per animation frame.
   * @param {Function} fn
   * @returns {Function}
   */
  function throttleRaf(fn) {
    let ticking = false;
    return function (...args) {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          fn.apply(this, args);
          ticking = false;
        });
      }
    };
  }

  /* ----------------------------------------------------------
     2. NAVBAR — sticky scroll + active link highlighting
  ---------------------------------------------------------- */

  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateNavbar() {
    // Add/remove "scrolled" class for glassmorphism effect
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight the nav link whose section is in the viewport
    let currentSection = '';
    sections.forEach((section) => {
      const sectionTop    = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', throttleRaf(updateNavbar));
  updateNavbar(); // run once on load

  /* ----------------------------------------------------------
     3. SMOOTH SCROLL — nav links & any internal anchor
  ---------------------------------------------------------- */

  function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;
    const offset  = navbar ? navbar.offsetHeight : 0;
    const top     = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const targetId = href.slice(1);
        smoothScrollTo(targetId);
        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });

  /* ----------------------------------------------------------
     4. MOBILE HAMBURGER MENU
  ---------------------------------------------------------- */

  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  }

  hamburger.addEventListener('click', toggleMobileMenu);

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (
      !hamburger.contains(e.target) &&
      !mobileMenu.contains(e.target) &&
      mobileMenu.classList.contains('open')
    ) {
      closeMobileMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
      hamburger.focus();
    }
  });

  /* ----------------------------------------------------------
     5. SCROLL-TRIGGERED REVEAL ANIMATIONS (Intersection Observer)
  ---------------------------------------------------------- */

  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // animate once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------------------------
     6. TYPING EFFECT — hero subtitle
  ---------------------------------------------------------- */

  const typingEl = document.getElementById('typing-text');
  const phrases  = [
    'Developer',
    'Creator',
    'Problem Solver',
    'Open Source Contributor',
    'Full Stack Engineer',
  ];

  let phraseIndex  = 0;
  let charIndex    = 0;
  let isDeleting   = false;
  const typeSpeed  = 90;   // ms per character (typing)
  const deleteSpeed = 50;  // ms per character (deleting)
  const pauseAfter = 1800; // ms pause after full phrase

  function typeLoop() {
    if (!typingEl) return;

    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      // Typing forward
      typingEl.textContent = currentPhrase.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        // Finished typing — pause then start deleting
        isDeleting = true;
        setTimeout(typeLoop, pauseAfter);
        return;
      }
    } else {
      // Deleting
      typingEl.textContent = currentPhrase.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // Finished deleting — move to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    const delay = isDeleting ? deleteSpeed : typeSpeed;
    setTimeout(typeLoop, delay);
  }

  // Start typing after hero fade-in completes
  setTimeout(typeLoop, 800);

  /* ----------------------------------------------------------
     7. ANIMATED COUNTERS (count up when visible)
  ---------------------------------------------------------- */

  const counterEls = document.querySelectorAll('.counter-value[data-target]');

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1600; // ms
    const steps    = 60;
    const stepValue = target / steps;
    let current    = 0;
    let step       = 0;

    const interval = setInterval(() => {
      step++;
      current = Math.min(Math.round(stepValue * step), target);
      el.textContent = current;

      if (step >= steps) {
        clearInterval(interval);
        el.textContent = target; // ensure exact final value
      }
    }, duration / steps);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counterEls.forEach((el) => counterObserver.observe(el));

  /* ----------------------------------------------------------
     8. PROJECT FILTER
  ---------------------------------------------------------- */

  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          // Re-trigger reveal animation
          card.classList.remove('visible');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.classList.add('visible');
            });
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ----------------------------------------------------------
     9. CONTACT FORM VALIDATION
  ---------------------------------------------------------- */

  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const nameInput    = document.getElementById('contact-name');
    const emailInput   = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');

    const nameError    = document.getElementById('name-error');
    const emailError   = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    /**
     * Show or clear a form field error.
     * @param {HTMLInputElement|HTMLTextAreaElement} input
     * @param {HTMLElement} errorEl
     * @param {string} msg  — empty string clears the error
     */
    function setError(input, errorEl, msg) {
      errorEl.textContent = msg;
      if (msg) {
        input.classList.add('error');
      } else {
        input.classList.remove('error');
      }
    }

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateField(input, errorEl, rules) {
      const value = input.value.trim();
      for (const { test, msg } of rules) {
        if (!test(value)) {
          setError(input, errorEl, msg);
          return false;
        }
      }
      setError(input, errorEl, '');
      return true;
    }

    // Live validation on blur
    nameInput.addEventListener('blur', () =>
      validateField(nameInput, nameError, [
        { test: (v) => v.length >= 2, msg: 'Please enter your name (at least 2 characters).' },
      ])
    );

    emailInput.addEventListener('blur', () =>
      validateField(emailInput, emailError, [
        { test: (v) => v.length > 0, msg: 'Email is required.' },
        { test: isValidEmail, msg: 'Please enter a valid email address.' },
      ])
    );

    messageInput.addEventListener('blur', () =>
      validateField(messageInput, messageError, [
        { test: (v) => v.length >= 10, msg: 'Message must be at least 10 characters.' },
      ])
    );

    // Clear error on input
    [nameInput, emailInput, messageInput].forEach((input) => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const validName    = validateField(nameInput, nameError, [
        { test: (v) => v.length >= 2, msg: 'Please enter your name (at least 2 characters).' },
      ]);
      const validEmail   = validateField(emailInput, emailError, [
        { test: (v) => v.length > 0, msg: 'Email is required.' },
        { test: isValidEmail, msg: 'Please enter a valid email address.' },
      ]);
      const validMessage = validateField(messageInput, messageError, [
        { test: (v) => v.length >= 10, msg: 'Message must be at least 10 characters.' },
      ]);

      if (!validName || !validEmail || !validMessage) return;

      // Simulate form submission (replace with real endpoint as needed)
      const btnText    = contactForm.querySelector('.btn-text');
      const btnSuccess = contactForm.querySelector('.btn-success');
      const submitBtn  = contactForm.querySelector('[type="submit"]');

      submitBtn.disabled = true;
      btnText.hidden     = true;
      btnSuccess.hidden  = false;

      // Reset after 4 seconds
      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        btnText.hidden     = false;
        btnSuccess.hidden  = true;
      }, 4000);
    });
  }

  /* ----------------------------------------------------------
     10. FOOTER — Dynamic year
  ---------------------------------------------------------- */

  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
