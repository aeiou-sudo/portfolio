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

Theme.init();
