(function () {
  var LIGHT_CSS = 'assets/style-light.css';
  var DARK_CSS  = 'assets/style-dark.css';

  document.addEventListener('DOMContentLoaded', function () {

    // ══════════════════════════════════════════
    // SCROLL PERFORMANCE CLASS
    // ══════════════════════════════════════════
    var scrollTimer;
    window.addEventListener('scroll', function () {
      if (!document.body.classList.contains('is-scrolling')) {
        document.body.classList.add('is-scrolling');
      }
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        document.body.classList.remove('is-scrolling');
      }, 150);
    }, { passive: true });

    // ══════════════════════════════════════════
    // CARD HOVER TRACKING — Throttled
    // ══════════════════════════════════════════
    var cards = document.querySelectorAll('.card');
    var ticking = false;
    
    cards.forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        if (!ticking) {
          requestAnimationFrame(function() {
            var rect = card.getBoundingClientRect();
            var x = ((e.clientX - rect.left) / rect.width) * 100;
            var y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mx', x + '%');
            card.style.setProperty('--my', y + '%');
            ticking = false;
          });
          ticking = true;
        }
      });
      
      card.addEventListener('mouseleave', function() {
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
      });
    });

    // ══════════════════════════════════════════
    // OS THEME CHANGE LISTENER
    // ══════════════════════════════════════════
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        var link = document.getElementById('themeStylesheet');
        if (link) link.href = e.matches ? DARK_CSS : LIGHT_CSS;
      });
    }

    // ══════════════════════════════════════════
    // HAMBURGER MENU
    // ══════════════════════════════════════════
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

    // ══════════════════════════════════════════
    // SCROLL REVEAL — will-change managed in JS
    // ══════════════════════════════════════════
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            // Add will-change right before animation
            el.style.willChange = 'transform, opacity';
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