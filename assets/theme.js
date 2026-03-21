/**
 * KezPos — Theme Manager
 * 
 * Logic:
 * - Default: light mode (matches the app)
 * - If device OS is dark AND user hasn't manually chosen: follow OS (media query in CSS handles visuals)
 * - If user manually toggles: save choice to localStorage, apply html.light or html.dark class
 *   (these override the media query)
 * - On next page load: restore saved choice if any
 */
(function () {
  const html = document.documentElement;
  const STORAGE_KEY = 'kez-theme';

  function getSystemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyTheme(theme) {
    // theme: 'dark' | 'light' | null (null = follow OS)
    html.classList.remove('dark', 'light');
    if (theme === 'dark') html.classList.add('dark');
    if (theme === 'light') html.classList.add('light');
  }

  function updateToggleBtn() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    // Effective dark = explicit dark class, OR (no explicit light class AND OS is dark)
    const explicitDark  = html.classList.contains('dark');
    const explicitLight = html.classList.contains('light');
    const effectiveDark = explicitDark || (!explicitLight && getSystemPrefersDark());
    btn.textContent = effectiveDark ? '☀️' : '🌙';
    btn.title = effectiveDark ? 'Switch to light mode' : 'Switch to dark mode';
  }

  // On load: restore saved preference
  const saved = localStorage.getItem(STORAGE_KEY); // 'dark' | 'light' | null
  applyTheme(saved);

  // Wire up toggle button once DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    updateToggleBtn();

    // Also wire hamburger menu if present
    const hamburger = document.getElementById('navHamburger');
    const drawer    = document.getElementById('navDrawer');
    if (hamburger && drawer) {
      hamburger.addEventListener('click', function () {
        const open = drawer.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', open);
      });
      // Close drawer on link click
      drawer.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          drawer.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', false);
        });
      });
    }

    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      const explicitDark  = html.classList.contains('dark');
      const explicitLight = html.classList.contains('light');
      const effectiveDark = explicitDark || (!explicitLight && getSystemPrefersDark());

      if (effectiveDark) {
        // Switch to light
        applyTheme('light');
        localStorage.setItem(STORAGE_KEY, 'light');
      } else {
        // Switch to dark
        applyTheme('dark');
        localStorage.setItem(STORAGE_KEY, 'dark');
      }
      updateToggleBtn();
    });

    // Also listen for OS theme changes at runtime
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) updateToggleBtn(); // only update icon if user hasn't locked a preference
      });
    }
  });
})();
