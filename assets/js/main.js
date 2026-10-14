/* berrylink — main.js */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- scroll reveal: [data-reveal] → .is-revealed ---------- */
  function initReveal() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- hero video ----------
     reduced-motion 이면 정지(poster 유지), 자동재생 차단 시 poster(png) 가 그대로 노출됨 */
  function initHeroVideo() {
    var v = document.querySelector('[data-hero-video]');
    if (!v) return;
    if (reduce) { v.removeAttribute('autoplay'); v.pause(); return; }
    var pr = v.play && v.play();
    if (pr && pr.catch) pr.catch(function () { /* autoplay blocked → poster 유지 */ });
  }

  /* ---------- scroll scale: [data-scroll-scale] → --p (0→1) ----------
     요소 상단이 뷰포트 하단에 진입(0) → 요소 중심이 뷰포트 중앙 도달(1). CSS 에서 opacity/scale 로 사용 */
  function initScrollScale() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-scroll-scale]'));
    if (!els.length) return;
    if (reduce) { els.forEach(function (el) { el.style.setProperty('--p', 1); }); return; }
    function update() {
      var vh = window.innerHeight;
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var start = vh;                          // top at viewport bottom
        var end = vh / 2 - r.height / 2;         // center at viewport center
        var p = (start - r.top) / (start - end);
        el.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(3));
      });
    }
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ---------- dot nav: 현재 구간 표시 ----------
     화면 중앙선을 지난 마지막 [data-dot-target] 섹션을 활성화
     (visual 은 about 구간, footer 는 brands 구간에 포함) */
  function initDotNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll('[data-dot-target]'));
    if (!links.length) return;
    var secs = links.map(function (a) { return document.getElementById(a.getAttribute('data-dot-target')); });
    function update() {
      var mid = window.innerHeight * 0.5, idx = 0;
      secs.forEach(function (sec, i) { if (sec && sec.getBoundingClientRect().top <= mid) idx = i; });
      links.forEach(function (a, i) {
        var on = i === idx;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    }
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });
    window.addEventListener('resize', update);
    update();

  }

  initReveal();
  initDotNav();
  initScrollScale();
  initHeroVideo();
})();
