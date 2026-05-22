(function () {
  var LIGHT_CSS  = 'assets/style-light.css';
  var DARK_CSS   = 'assets/style-dark.css';
  var STORAGE_KEY = 'kez-theme';

  function applyTheme(theme) {
    var link = document.getElementById('themeStylesheet');
    if (link) link.href = theme === 'dark' ? DARK_CSS : LIGHT_CSS;
    // persist so every page opens in the same theme
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
  }

  function getTheme() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return stored;
    } catch (e) {}
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'dark' : 'light';
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getTheme());

    // Follow OS changes only if user has no stored preference
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        try { if (localStorage.getItem(STORAGE_KEY)) return; } catch (ex) {}
        applyTheme(e.matches ? 'dark' : 'light');
      });
    }

    // Hamburger (unchanged from your original)
    var hamburger = document.getElementById('navHamburger');
    var drawer    = document.getElementById('navDrawer');
    if (hamburger && drawer) {
      hamburger.addEventListener('click', function () {
        var open = drawer.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', String(open));
      });
      drawer.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
          drawer.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });
})();