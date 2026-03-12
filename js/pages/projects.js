/* ============================================================
   PROJECTS PAGE JS - js/pages/projects.js
   ============================================================ */

/* ============================================================
   CATEGORY FILTER
   ============================================================ */
(function initProjectFilter() {
  const buttons = document.querySelectorAll('.proj-filter-btn');
  const cards   = document.querySelectorAll('.project-card[data-category]');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      let visibleIndex = 0;
      cards.forEach(card => {
        const matches = filter === 'all' || card.dataset.category === filter;
        if (matches) {
          card.classList.remove('hidden');
          card.style.animationDelay = (visibleIndex * 0.08) + 's';
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            card.style.animation = '';
          });
          visibleIndex++;
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ============================================================
   STAGGERED ENTRANCE ANIMATIONS
   ============================================================ */
(function initCardEntrance() {
  const cards = document.querySelectorAll('.project-card');
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
    if (modalTags)  {
      modalTags.innerHTML = (data.tags || [])
        .map(t => `<span class="tag">${t}</span>`).join('');
    }
    if (modalLinks) {
      modalLinks.innerHTML = '';
      if (data.github) {
        const a = document.createElement('a');
        a.href = data.github;
        a.target = '_blank';
        a.rel = 'noopener';
        a.className = 'btn btn--ghost btn--sm';
        a.textContent = 'GitHub →';
        modalLinks.appendChild(a);
      }
      if (data.live) {
        const a = document.createElement('a');
        a.href = data.live;
        a.target = '_blank';
        a.rel = 'noopener';
        a.className = 'btn btn--primary btn--sm';
        a.textContent = 'Live Demo →';
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

  // Open modal from "Details" buttons
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

  // Close button
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Click outside modal content
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
})();
