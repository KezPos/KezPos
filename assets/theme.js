/**
 * KezPos — Theme Manager
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

  function handleToggle(e) {
    // Prevent drawer from closing when theme toggle inside drawer is clicked
    e.stopPropagation();
    const theme = isEffectiveDark() ? 'light' : 'dark';
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateButtons();
  }

  // Apply saved theme immediately (before DOM ready) to avoid flash
  const saved = localStorage.getItem(STORAGE_KEY);
  applyTheme(saved);

  document.addEventListener('DOMContentLoaded', function () {
    // Update button icons now that DOM exists
    updateButtons();

    // Wire theme toggles
    var navBtn = document.getElementById('themeToggle');
    if (navBtn) navBtn.addEventListener('click', handleToggle);

    var drawerBtn = document.getElementById('drawerThemeToggle');
    if (drawerBtn) drawerBtn.addEventListener('click', handleToggle);

    // Hamburger menu
    var hamburger = document.getElementById('navHamburger');
    var drawer    = document.getElementById('navDrawer');
    if (hamburger && drawer) {
      hamburger.addEventListener('click', function () {
        var open = drawer.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', String(open));
      });

      // Close drawer on link click (but NOT on the theme toggle button)
      drawer.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          drawer.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // React to OS theme change at runtime
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
        if (!localStorage.getItem(STORAGE_KEY)) updateButtons();
      });
    }
  });
})();
