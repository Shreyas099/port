/* ============================================================
   PROJECTS PAGE JS - js/pages/projects.js
   ============================================================ */

const _prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   CATEGORY FILTER — smooth GSAP transitions + count badges
   ============================================================ */
(function initProjectFilter() {
  const buttons = document.querySelectorAll('.proj-filter-btn');
  const cards   = document.querySelectorAll('.project-card[data-category]');
  if (!buttons.length) return;

  /* ---- Count badges ---- */
  buttons.forEach(btn => {
    const filter = btn.dataset.filter;
    const count  = filter === 'all'
      ? cards.length
      : Array.from(cards).filter(c => c.dataset.category === filter).length;

    const badge = document.createElement('span');
    badge.className = 'filter-count';
    badge.textContent = count;
    btn.appendChild(badge);
  });

  /* ---- Sliding indicator ---- */
  const filtersEl = document.querySelector('.proj-filters');
  let indicator   = null;
  if (filtersEl) {
    indicator = document.createElement('div');
    indicator.className = 'filter-indicator';
    filtersEl.style.position = 'relative';
    filtersEl.appendChild(indicator);
  }

  function moveIndicator(activeBtn) {
    if (!indicator || !activeBtn) return;
    const filtersRect = filtersEl.getBoundingClientRect();
    const btnRect     = activeBtn.getBoundingClientRect();
    indicator.style.left  = (btnRect.left - filtersRect.left) + 'px';
    indicator.style.width = btnRect.width + 'px';
  }

  // Initial position
  const initialActive = document.querySelector('.proj-filter-btn.active');
  if (initialActive) requestAnimationFrame(() => moveIndicator(initialActive));

  /* ---- Filter action ---- */
  function filterCards(filter, activeBtn) {
    buttons.forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');
    moveIndicator(activeBtn);

    if (typeof gsap !== 'undefined' && !_prefersReducedMotion) {
      let visibleIndex = 0;
      cards.forEach(card => {
        const matches = filter === 'all' || card.dataset.category === filter;
        if (matches) {
          card.classList.remove('hidden', 'filter-hidden');
          gsap.fromTo(card,
            { opacity: 0, y: 24, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5,
              delay: visibleIndex * 0.06, ease: 'power3.out' }
          );
          visibleIndex++;
        } else {
          gsap.to(card, {
            opacity: 0, y: 16, scale: 0.95, duration: 0.3, ease: 'power2.in',
            onComplete: () => card.classList.add('hidden', 'filter-hidden')
          });
        }
      });
    } else {
      // Fallback
      let visibleIndex = 0;
      cards.forEach(card => {
        const matches = filter === 'all' || card.dataset.category === filter;
        if (matches) {
          card.classList.remove('hidden');
          card.style.animationDelay = (visibleIndex * 0.08) + 's';
          card.style.animation = 'none';
          requestAnimationFrame(() => { card.style.animation = ''; });
          visibleIndex++;
        } else {
          card.classList.add('hidden');
        }
      });
    }
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterCards(btn.dataset.filter, btn);
    });
  });
})();

/* ============================================================
   STAGGERED ENTRANCE ANIMATIONS — GSAP or IntersectionObserver
   ============================================================ */
(function initCardEntrance() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !_prefersReducedMotion) {
    const grid = document.querySelector('.projects-grid');
    gsap.fromTo(cards,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: { each: 0.08, from: 'start' },
        ease: 'power3.out',
        scrollTrigger: {
          trigger: grid || cards[0],
          start: 'top 80%',
        }
      }
    );
  } else {
    cards.forEach((card, i) => {
      card.style.animationDelay = (i * 0.08) + 's';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(card => observer.observe(card));
  }
})();

/* ============================================================
   PROJECT MODAL
   ============================================================ */
(function initModal() {
  const overlay  = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  if (!overlay) return;

  const modalTitle = document.getElementById('modal-title');
  const modalDesc  = document.getElementById('modal-desc');
  const modalTags  = document.getElementById('modal-tags');
  const modalLinks = document.getElementById('modal-links');

  function openModal(data) {
    if (modalTitle) modalTitle.textContent = data.title || '';
    if (modalDesc)  modalDesc.innerHTML   = data.desc  || '';
    if (modalTags) {
      modalTags.innerHTML = (data.tags || [])
        .map(t => `<span class="tag">${t}</span>`).join('');
    }
    if (modalLinks) {
      modalLinks.innerHTML = '';
      if (data.github) {
        const a = document.createElement('a');
        a.href = data.github; a.target = '_blank'; a.rel = 'noopener';
        a.className = 'btn btn--ghost btn--sm'; a.textContent = 'GitHub →';
        modalLinks.appendChild(a);
      }
      if (data.live) {
        const a = document.createElement('a');
        a.href = data.live; a.target = '_blank'; a.rel = 'noopener';
        a.className = 'btn btn--primary btn--sm'; a.textContent = 'Live Demo →';
        modalLinks.appendChild(a);
      }
    }
    overlay.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('[data-project]');
      if (!card) return;
      openModal({
        title:  card.dataset.title  || card.querySelector('h3')?.textContent,
        desc:   card.dataset.desc   || card.querySelector('p')?.innerHTML,
        tags:   (card.dataset.tags  || '').split(',').filter(Boolean),
        github: card.dataset.github || '',
        live:   card.dataset.live   || '',
      });
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
})();
