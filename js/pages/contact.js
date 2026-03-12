/* ============================================================
   CONTACT PAGE JS - js/pages/contact.js
   ============================================================ */

/* ============================================================
   FLOATING LABEL BEHAVIOR
   ============================================================ */
(function initFloatingLabels() {
  document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(field => {
    const group = field.closest('.form-group');
    if (!group) return;

    function hasValue() {
      // Check length before trim to avoid trimming large strings unnecessarily
      return field.value.length > 0 && field.value.trim() !== '';
    }

    function update() {
      group.classList.toggle('focused', field === document.activeElement || hasValue());
    }

    field.addEventListener('focus', update);
    field.addEventListener('blur',  update);
    // On input, a quick length check avoids trimming on every keystroke
    field.addEventListener('input', () => {
      group.classList.toggle('focused', field === document.activeElement || field.value.length > 0);
    });
    update();
  });
})();

/* ============================================================
   CHARACTER COUNTER FOR TEXTAREA
   ============================================================ */
(function initCharCounter() {
  const textarea = document.getElementById('contact-message');
  const counter  = document.getElementById('char-count');
  if (!textarea || !counter) return;

  const MAX = 1000;

  function update() {
    const len = textarea.value.length;
    counter.textContent = `${len} / ${MAX}`;
    counter.classList.remove('warn', 'over');
    if (len > MAX * 0.85) counter.classList.add('warn');
    if (len > MAX)         counter.classList.add('over');
  }

  textarea.addEventListener('input', update);
  update();
})();

/* ============================================================
   FORM VALIDATION & SUBMIT
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successMsg = document.getElementById('form-success');

  const validators = {
    name: (v) => {
      if (!v.trim())          return 'Name is required.';
      if (v.trim().length < 2) return 'Name must be at least 2 characters.';
      return null;
    },
    email: (v) => {
      if (!v.trim()) return 'Email is required.';
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(v)) return 'Please enter a valid email address.';
      return null;
    },
    subject: (v) => {
      if (!v.trim()) return 'Subject is required.';
      return null;
    },
    message: (v) => {
      if (!v.trim())          return 'Message is required.';
      if (v.trim().length < 10) return 'Message must be at least 10 characters.';
      if (v.length > 1000)    return 'Message must be under 1000 characters.';
      return null;
    },
  };

  function validateField(fieldName, value) {
    const group   = form.querySelector(`[name="${fieldName}"]`)?.closest('.form-group');
    const errorEl = group?.querySelector('.field-error');
    const fn      = validators[fieldName];
    if (!fn || !group) return true;

    const error = fn(value);
    if (error) {
      group.classList.add('error');
      group.classList.remove('success');
      if (errorEl) errorEl.textContent = error;
      return false;
    } else {
      group.classList.remove('error');
      group.classList.add('success');
      if (errorEl) errorEl.textContent = '';
      return true;
    }
  }

  // Live validation on blur
  Object.keys(validators).forEach(fieldName => {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (!field) return;
    field.addEventListener('blur', () => validateField(fieldName, field.value));
    field.addEventListener('input', () => {
      if (field.closest('.form-group')?.classList.contains('error')) {
        validateField(fieldName, field.value);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    Object.keys(validators).forEach(fieldName => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (field && !validateField(fieldName, field.value)) {
        isValid = false;
      }
    });

    if (!isValid) return;

    // Simulate async submit (replace with real endpoint as needed)
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    setTimeout(() => {
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message →';
      }
      // Clear validation state
      form.querySelectorAll('.form-group').forEach(g => g.classList.remove('success', 'error', 'focused'));

      if (successMsg) successMsg.classList.add('visible');
      setTimeout(() => successMsg?.classList.remove('visible'), 5000);
    }, 1200);
  });
})();

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
(function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (!item) return;

      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });
})();
