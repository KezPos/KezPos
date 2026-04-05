/**
 * KezPos — Theme Switcher + Hamburger Menu
 * Handles dark/light theme persistence across all pages via localStorage.
 */
(function () {
  var STORAGE_KEY = 'kez-theme';
  var LIGHT_CSS   = 'assets/style-light.css';
  var DARK_CSS    = 'assets/style-dark.css';

  function getEffectiveTheme() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    var link = document.getElementById('themeStylesheet');
    if (link) link.href = theme === 'dark' ? DARK_CSS : LIGHT_CSS;
    localStorage.setItem(STORAGE_KEY, theme);
    updateDropdownUI(theme);
  }

  function updateDropdownUI(theme) {
    var btn = document.getElementById('themeSwitcherBtn');
    if (btn) btn.textContent = theme === 'dark' ? 'Dark ▾' : 'Light ▾';
    document.querySelectorAll('.theme-option').forEach(function (el) {
      el.classList.toggle('active', el.dataset.theme === theme);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Apply saved theme immediately (also done inline in <head>, this syncs the UI labels)
    var theme = getEffectiveTheme();
    applyTheme(theme);

    // Theme dropdown toggle
    var btn      = document.getElementById('themeSwitcherBtn');
    var dropdown = document.getElementById('themeDropdown');

    if (btn && dropdown) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = dropdown.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
      });

      dropdown.querySelectorAll('.theme-option').forEach(function (el) {
        el.addEventListener('click', function () {
          applyTheme(el.dataset.theme);
          dropdown.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        });
      });

      document.addEventListener('click', function () {
        dropdown.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    }

    // Hamburger menu
    var hamburger = document.getElementById('navHamburger');
    var drawer    = document.getElementById('navDrawer');

    if (hamburger && drawer) {
      hamburger.addEventListener('click', function () {
        var open = drawer.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', String(open));
      });

      drawer.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          drawer.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // React to OS preference changes only if user hasn't manually chosen
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  });
})();