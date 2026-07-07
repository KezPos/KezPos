/**
 * KezPos — Interactive UI components
 * 1. Lightbox: tap any device screenshot to view it full-size
 * 2. Swap Stage: a single frame that auto-crossfades between a phone
 *    mockup and a laptop mockup of the same screen, with manual
 *    prev/next arrows. Only runs its timer while visible on screen.
 */

/* ============================================================
   LIGHTBOX
============================================================ */
(function () {
  var overlay, imgEl, captionEl;

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'kp-lightbox';
    overlay.innerHTML =
      '<button class="kp-lightbox-close" aria-label="Close">&times;</button>' +
      '<img class="kp-lightbox-img" alt="">' +
      '<div class="kp-lightbox-caption"></div>';
    document.body.appendChild(overlay);
    imgEl = overlay.querySelector('.kp-lightbox-img');
    captionEl = overlay.querySelector('.kp-lightbox-caption');

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.classList.contains('kp-lightbox-close')) {
        close();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  function open(src, caption) {
    if (!overlay) build();
    imgEl.src = src;
    captionEl.textContent = caption || '';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  window.KPLightbox = { open: open, close: close };
})();

/* ============================================================
   SWAP STAGE
   Markup contract (per instance):
   <div class="swap-stage" data-interval="4000">
     <div class="swap-stage-frame">
       <div class="swap-layer swap-layer-phone is-active" data-view="phone">
         <div class="phone-wrap"> ... existing phone mockup markup ... </div>
       </div>
       <div class="swap-layer swap-layer-laptop" data-view="laptop">
         <div class="laptop-frame"> ... existing laptop mockup markup ... </div>
       </div>
     </div>
     <div class="swap-stage-controls">
       <button class="swap-arrow swap-prev" aria-label="Previous view">‹</button>
       <span class="swap-stage-label">Phone view</span>
       <button class="swap-arrow swap-next" aria-label="Next view">›</button>
     </div>
   </div>
============================================================ */
(function () {
  function initStage(stage) {
    var layers = Array.prototype.slice.call(stage.querySelectorAll('.swap-layer'));
    if (layers.length < 2) return;

    var label = stage.querySelector('.swap-stage-label');
    var prevBtn = stage.querySelector('.swap-prev');
    var nextBtn = stage.querySelector('.swap-next');
    var interval = parseInt(stage.getAttribute('data-interval'), 10) || 4000;

    var current = layers.findIndex(function (l) { return l.classList.contains('is-active'); });
    if (current < 0) current = 0;

    var timer = null;
    var visible = false;
    var userControlled = false;

    function labelFor(view) {
      return view === 'laptop' ? 'PC view' : 'Phone view';
    }

    function show(index, opts) {
      opts = opts || {};
      index = (index + layers.length) % layers.length;
      layers.forEach(function (l, i) {
        l.classList.toggle('is-active', i === index);
      });
      current = index;
      if (label) label.textContent = labelFor(layers[index].getAttribute('data-view'));
      if (opts.manual) {
        userControlled = true;
        restartTimer();
      }
    }

    function tick() {
      if (!visible || userControlled) return;
      show(current + 1);
    }

    function restartTimer() {
      clearInterval(timer);
      timer = setInterval(tick, interval);
    }

    function stopTimer() {
      clearInterval(timer);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { show(current - 1, { manual: true }); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(current + 1, { manual: true }); });

    // Pause auto-swap on hover/focus so it doesn't fight a curious user
    stage.addEventListener('mouseenter', stopTimer);
    stage.addEventListener('mouseleave', function () { if (visible && !userControlled) restartTimer(); });

    // Only run the timer while the stage is actually on screen
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible = entry.isIntersecting;
        if (visible && !userControlled) restartTimer();
        else stopTimer();
      });
    }, { threshold: 0.35 });
    io.observe(stage);

    // Initial label
    if (label) label.textContent = labelFor(layers[current].getAttribute('data-view'));

    // Tappable screenshots -> lightbox
    layers.forEach(function (layer) {
      var img = layer.querySelector('img');
      var btn = layer.querySelector('.swap-tap');
      if (btn && img) {
        btn.addEventListener('click', function () {
          window.KPLightbox.open(img.currentSrc || img.src, img.alt);
        });
      }
    });
  }

  function initAll() {
    document.querySelectorAll('.swap-stage').forEach(initStage);

    // Also wire up any standalone tappable device shots outside swap-stage
    document.querySelectorAll('[data-lightbox]').forEach(function (btn) {
      var img = btn.querySelector('img');
      if (!img) return;
      btn.addEventListener('click', function () {
        window.KPLightbox.open(img.currentSrc || img.src, img.alt);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();