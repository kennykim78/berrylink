/**
 * K-Beauty Responsive Accordion Banners
 * Infinite sliding engine (indexB-style)
 *
 * - All cards sit on one flex track that glides left/right with a CSS transform.
 * - The active card (4:2.5) is always centered; its neighbours (4:5) widen/narrow with the
 *   same duration/easing as the track, so every frame of the motion stays consistent.
 * - Infinite loop: the 6 cards are cloned (clones | originals | clones) and the position is
 *   silently re-centered on the originals after each move.
 * - Controls: progress bar, play/pause, prev/next. 5000ms autoplay, touch swipe, arrow keys.
 */

(function (window, document) {
  'use strict';

  const AUTOPLAY_INTERVAL = 5000;
  const SWIPE_THRESHOLD = 45;
  const SWIPE_RESTRAINT = 80;
  const MOVE_MS = 650;            // must match --slide-ms in style.css

  let sliderContainer = null;
  let sliderTrack = null;
  let cards = [];                 // every card incl. clones, in DOM order
  let total = 0;                  // number of real cards
  let pos = 0;                    // index in `cards` of the active card
  let probeIn = null;
  let probeAct = null;
  let progressFill = null;
  let toggleBtn = null;

  let autoplayTimer = null;
  let userPaused = false;
  let moving = false;
  let settleTimer = null;

  let touchStartX = 0;
  let touchStartY = 0;

  function initSlider() {
    sliderContainer = document.querySelector('.slider-container');
    sliderTrack = document.getElementById('sliderTrack') || document.querySelector('.slider-track');
    if (!sliderContainer || !sliderTrack) return;

    if (sliderTrack.querySelectorAll('.slider-card').length === 0) {
      renderCardsFromData();
    }
    const originals = Array.from(sliderTrack.querySelectorAll('.slider-card'));
    total = originals.length;
    if (total === 0) return;

    buildLoop(originals);

    progressFill = sliderContainer.querySelector('.slider-progress-fill');
    toggleBtn = sliderContainer.querySelector('.slider-toggle');

    pos = total; // first original
    bindEvents();
    render(false);
    startAutoplay();
  }

  /** Renders cards from window.BANNER_DATA when the track is empty. */
  function renderCardsFromData() {
    if (!window.BANNER_DATA || !Array.isArray(window.BANNER_DATA)) return;
    sliderTrack.innerHTML = '';
    window.BANNER_DATA.forEach(function (brand, idx) {
      const card = document.createElement('article');
      card.className = 'slider-card';
      card.dataset.index = String(idx);
      card.dataset.brand = brand.id;
      card.setAttribute('role', 'group');
      card.setAttribute('aria-roledescription', 'slide');
      card.setAttribute('aria-label', (idx + 1) + ' of ' + window.BANNER_DATA.length + ': ' + brand.brandName);
      card.innerHTML =
        '<div class="card-media">' +
          '<img src="' + brand.image + '" alt="' + (brand.altText || brand.brandName) + '" class="card-image" loading="eager" />' +
          '<div class="card-scrim"></div>' +
        '</div>' +
        '<div class="card-content">' +
          '<div class="card-meta">' +
            '<span class="card-brand-name">' + brand.brandName + '</span>' +
            '<span class="card-category">' + (brand.category || '') + '</span>' +
          '</div>' +
          '<h2 class="card-headline">' + brand.headline + '</h2>' +
          '<div class="card-subtext-wrapper"><p class="card-subtext">' + brand.subtext + '</p></div>' +
        '</div>';
      sliderTrack.appendChild(card);
    });
  }

  /** Builds clones | originals | clones and the two hidden size probes. */
  function buildLoop(originals) {
    function clones() {
      return originals.map(function (card) {
        const c = card.cloneNode(true);
        c.removeAttribute('id');
        c.dataset.clone = 'true';
        c.querySelectorAll('img').forEach(function (img) { img.loading = 'eager'; });
        return c;
      });
    }
    const before = clones();
    const after = clones();
    before.forEach(function (c) { sliderTrack.insertBefore(c, originals[0]); });
    after.forEach(function (c) { sliderTrack.appendChild(c); });
    cards = before.concat(originals, after);

    // Probes share the card CSS (width rules) so JS can read the *target* widths.
    probeIn = document.createElement('div');
    probeIn.className = 'slider-card slider-probe';
    probeAct = document.createElement('div');
    probeAct.className = 'slider-card slider-probe is-active';
    probeIn.setAttribute('aria-hidden', 'true');
    probeAct.setAttribute('aria-hidden', 'true');
    sliderTrack.appendChild(probeIn);
    sliderTrack.appendChild(probeAct);
  }

  function logicalIndex() {
    return ((pos % total) + total) % total;
  }

  /** Applies state classes + track translation for the current `pos`. */
  function render(animate) {
    sliderTrack.classList.toggle('no-anim', !animate);

    const states = { '-2': 'is-prev2', '-1': 'is-prev', '0': 'is-active', '1': 'is-next', '2': 'is-next2' };
    cards.forEach(function (card, j) {
      card.classList.remove('is-active', 'is-prev', 'is-next', 'is-prev2', 'is-next2');
      const cls = states[String(j - pos)];
      if (cls !== undefined) card.classList.add(cls);
      const isReal = !card.dataset.clone;
      card.setAttribute('aria-hidden', (cls !== undefined && Math.abs(j - pos) <= 1 && isReal) ? 'false' : 'true');
      card.tabIndex = (cls === 'is-active' && isReal) ? 0 : -1;
    });

    const gap = parseFloat(getComputedStyle(sliderTrack).columnGap) || 0;
    const wIn = probeIn.offsetWidth;
    const wAct = probeAct.offsetWidth;
    const viewW = sliderTrack.clientWidth;
    const left = pos * (wIn + gap);
    sliderTrack.style.transform = 'translate3d(' + (viewW / 2 - (left + wAct / 2)) + 'px,0,0)';

    updateProgress();
  }

  function updateProgress() {
    if (progressFill) {
      progressFill.style.transform = 'scaleX(' + ((logicalIndex() + 1) / total) + ')';
    }
  }

  /** After a move, silently jump back to the equivalent card in the original set. */
  function settle() {
    moving = false;
    if (pos < total || pos >= total * 2) {
      pos = total + logicalIndex();
      render(false);
      void sliderTrack.offsetWidth; // flush so the next move animates again
      sliderTrack.classList.remove('no-anim');
    }
  }

  function moveBy(delta) {
    if (moving || delta === 0) return;
    moving = true;
    pos += delta;
    render(true);
    clearTimeout(settleTimer);
    settleTimer = setTimeout(settle, MOVE_MS + 60);
  }

  function nextSlide() { moveBy(1); }
  function prevSlide() { moveBy(-1); }

  /** Shortest circular move to a logical index. */
  function goToSlide(index) {
    let delta = ((index - logicalIndex()) % total + total) % total;
    if (delta > total / 2) delta -= total;
    moveBy(delta);
    resetAutoplay();
  }

  function startAutoplay() {
    stopAutoplay();
    if (userPaused) return;
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  function setPaused(paused) {
    userPaused = paused;
    if (toggleBtn) {
      toggleBtn.classList.toggle('is-paused', paused);
      toggleBtn.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
      toggleBtn.setAttribute('title', paused ? 'Play slideshow' : 'Pause slideshow');
    }
    if (paused) stopAutoplay(); else startAutoplay();
  }

  function bindEvents() {
    const prevBtn = sliderContainer.querySelector('.slider-nav-prev');
    const nextBtn = sliderContainer.querySelector('.slider-nav-next');

    if (prevBtn) prevBtn.addEventListener('click', function (e) { e.preventDefault(); prevSlide(); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function (e) { e.preventDefault(); nextSlide(); resetAutoplay(); });
    if (toggleBtn) toggleBtn.addEventListener('click', function () { setPaused(!userPaused); });

    // Click a neighbouring card to bring it to the center
    sliderTrack.addEventListener('click', function (e) {
      const card = e.target.closest('.slider-card');
      if (!card || card.classList.contains('is-active') || card.classList.contains('slider-probe')) return;
      const j = cards.indexOf(card);
      if (j === -1) return;
      const d = j - pos;
      if (d >= -2 && d <= 2) {
        moveBy(d);
        resetAutoplay();
      }
    });

    // Touch swipe
    sliderTrack.addEventListener('touchstart', function (e) {
      if (e.touches && e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
      stopAutoplay();
    }, { passive: true });

    sliderTrack.addEventListener('touchend', function (e) {
      if (e.changedTouches && e.changedTouches.length > 0) {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) >= SWIPE_THRESHOLD && Math.abs(dy) <= SWIPE_RESTRAINT) {
          if (dx < 0) nextSlide(); else prevSlide();
        }
      }
      startAutoplay();
    }, { passive: true });

    window.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { prevSlide(); resetAutoplay(); }
      else if (e.key === 'ArrowRight') { nextSlide(); resetAutoplay(); }
    });

    // Keep the center aligned when the layout changes (no animation)
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(function () { if (!moving) render(false); }).observe(sliderTrack);
    } else {
      window.addEventListener('resize', function () { render(false); });
    }
  }

  window.KBeautySlider = {
    init: initSlider,
    goToSlide: goToSlide,
    nextSlide: nextSlide,
    prevSlide: prevSlide,
    startAutoplay: startAutoplay,
    stopAutoplay: stopAutoplay,
    getCurrentIndex: logicalIndex
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlider);
  } else {
    initSlider();
  }

})(typeof window !== 'undefined' ? window : this, typeof document !== 'undefined' ? document : {});
