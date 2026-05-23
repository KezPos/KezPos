(function () {
  var LIGHT_CSS = 'assets/style-light.css';
  var DARK_CSS  = 'assets/style-dark.css';

  document.addEventListener('DOMContentLoaded', function () {

    // OS theme change listener
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

    // Scroll reveal with GPU compositing
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            el.classList.add('visible');
            el.addEventListener('transitionend', function cleanup() {
              el.style.willChange = 'auto';
              el.removeEventListener('transitionend', cleanup);
            });
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.08 });
      reveals.forEach(function (el) { observer.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('visible'); });
    }

  });
})();
