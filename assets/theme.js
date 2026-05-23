(function () {
  var LIGHT_CSS = 'assets/style-light.css';
  var DARK_CSS  = 'assets/style-dark.css';

  document.addEventListener('DOMContentLoaded', function () {

    // Follow OS theme changes live
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        var link = document.getElementById('themeStylesheet');
        if (link) link.href = e.matches ? DARK_CSS : LIGHT_CSS;
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
