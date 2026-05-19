(function () {
  var LIGHT_CSS = 'assets/style-light.css';
  var DARK_CSS  = 'assets/style-dark.css';

  function applyTheme(theme) {
    var link = document.getElementById('themeStylesheet');
    if (link) link.href = theme === 'dark' ? DARK_CSS : LIGHT_CSS;
  }

  function getSystemTheme() {
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'dark' : 'light';
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getSystemTheme());

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        applyTheme(e.matches ? 'dark' : 'light');
      });
    }

    // Hamburger
    var hamburger = document.getElementById('navHamburger');
    var drawer    = document.getElementById('navDrawer');
    if (hamburger && drawer) {
      hamburger.addEventListener('click', function () {
        var open = drawer.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', String(open));
      });
      // Event delegation — works with dynamically injected links
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