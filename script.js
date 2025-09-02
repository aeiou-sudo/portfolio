const Theme = (() => {
  const STORAGE_KEY = 'pj_theme';
  const TOGGLE_ID = 'theme-toggle';

  function apply(isLight) {
    document.body.classList.toggle('light-theme', Boolean(isLight));
    const btn = document.getElementById(TOGGLE_ID);
    if (btn) btn.setAttribute('aria-pressed', String(Boolean(isLight)));
  }

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'light';
    } catch (e) {
      return false;
    }
  }

  function save(isLight) {
    try { localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark'); } catch (e) {}
  }

  function toggle() {
    const isLight = !document.body.classList.contains('light-theme');
    apply(isLight);
    save(isLight);
  }

  function init() {
    document.addEventListener('DOMContentLoaded', () => {
      const isLight = load();
      apply(isLight);

      const btn = document.getElementById(TOGGLE_ID);
      if (btn) btn.addEventListener('click', toggle);
    });
  }

  return { init, toggle, apply };
})();

// Popup module: creates an overlay and clones clicked card into a centered popup
const Popup = (() => {
  const OVERLAY_ID = 'pj-popup-overlay';
  const CLICK_SELECTOR = '.content-columns';

  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = OVERLAY_ID;
    overlay.tabIndex = -1;
    return overlay;
  }

  function open(cardEl) {
    // prevent multiple
    if (document.getElementById(OVERLAY_ID)) return;

    const overlay = createOverlay();
    const popup = document.createElement('div');
    popup.className = 'popup-card';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.tabIndex = 0;

    // Use full content if provided, otherwise fall back to cloning the card
    const full = cardEl.querySelector('.card-full');
    if (full) {
      // insert the inner HTML of the full content container
      popup.innerHTML = full.innerHTML;
    } else {
      popup.innerHTML = cardEl.innerHTML;
    }

    // add a close button inside popup for easier mobile/keyboard access
    const closeBtn = document.createElement('button');
    closeBtn.className = 'popup-close';
    closeBtn.type = 'button';
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', () => close());
    popup.appendChild(closeBtn);

    overlay.appendChild(popup);
    // prevent body scroll while popup is visible, restoring previous value on close
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.appendChild(overlay);

    // Allow CSS transition to play
    requestAnimationFrame(() => overlay.classList.add('is-visible'));

    // Focus for a11y
    popup.focus();

    // Close when clicking outside popup
    overlay.addEventListener('click', (ev) => {
      if (ev.target === overlay) close();
    }, { passive: true });

    // Close on ESC
    const onKey = (ev) => {
      if (ev.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);

    // Clean up function
    function close() {
      overlay.classList.remove('is-visible');
      // remove listeners
      document.removeEventListener('keydown', onKey);
      // restore body overflow
      document.body.style.overflow = prevOverflow;
      // allow animation then remove
      overlay.addEventListener('transitionend', function onEnd(e) {
        if (e.propertyName === 'opacity') {
          overlay.removeEventListener('transitionend', onEnd);
          overlay.remove();
        }
      });
    }

    // expose close for potential external use
    return { close };
  }

  function init() {
    document.addEventListener('DOMContentLoaded', () => {
      const container = document.querySelector(CLICK_SELECTOR);
      if (!container) return;

      container.addEventListener('click', (ev) => {
        const col = ev.target.closest('.column');
        if (!col || !container.contains(col)) return;
        open(col);
      });

      // Allow touch taps (some browsers synthesize click already)
      container.addEventListener('touchstart', (ev) => {
        const col = ev.target.closest('.column');
        if (!col || !container.contains(col)) return;
        // small delay to avoid double triggering
        ev.preventDefault();
        open(col);
      }, { passive: false });
    });
  }

  return { init };
})();

Theme.init();
Popup.init();
