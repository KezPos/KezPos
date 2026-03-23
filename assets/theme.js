/**
 * KezPos — Theme Manager
 *
 * - Default: light mode (matches the app)
 * - OS dark preference: auto-applied via CSS media query
 * - Manual toggle: saves to localStorage, applies html.light or html.dark class
 * - Two toggle buttons: #themeToggle (desktop nav) + #drawerThemeToggle (mobile drawer)
 */
(function () {
  const html = document.documentElement;
  const STORAGE_KEY = 'kez-theme';

  function getSystemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function isEffectiveDark() {
    if (html.classList.contains('dark'))  return true;
    if (html.classList.contains('light')) return false;
    return getSystemPrefersDark();
  }

  function applyTheme(theme) {
    html.classList.remove('dark', 'light');
    if (theme === 'dark')  html.classList.add('dark');
    if (theme === 'light') html.classList.add('light');
  }

  function updateButtons() {
    const dark  = isEffectiveDark();
    const icon  = dark ? '☀️' : '🌙';
    const label = dark ? 'Switch to light' : 'Switch to dark';

    const navBtn = document.getElementById('themeToggle');
    if (navBtn) {
      navBtn.textContent = icon;
      navBtn.title = label;
    }

    const drawerBtn = document.getElementById('drawerThemeToggle');
    if (drawerBtn) {
      drawerBtn.textContent = icon;
      drawerBtn.setAttribute('data-label', label);
      drawerBtn.title = label;
    }
  }

  function handleToggle() {
    const theme = isEffectiveDark() ? 'light' : 'dark';
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateButtons();
  }

  // Restore saved preference on load
  const saved = localStorage.getItem(STORAGE_KEY);
  applyTheme(saved);

  document.addEventListener('DOMContentLoaded', function () {
    updateButtons();

    ['themeToggle', 'drawerThemeToggle'].forEach(function (id) {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', handleToggle);
    });

    const hamburger = document.getElementById('navHamburger');
    const drawer    = document.getElementById('navDrawer');
    if (hamburger && drawer) {
      hamburger.addEventListener('click', function () {
        const open = drawer.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', open);
      });
      drawer.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          drawer.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', false);
        });
      });
    }

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
        if (!localStorage.getItem(STORAGE_KEY)) updateButtons();
      });
    }
  });
})();
