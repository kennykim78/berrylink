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

  /* ---------- pinned scroll color (#333 → #fff) ----------
     [data-scroll-pin] 섹션에 도달하면 내부(.intro__pin)가 sticky 로 고정되고,
     고정된 동안의 스크롤 진행도에 따라
       [data-scroll-lines] : 실제 렌더된 줄 단위(.line)로 순차 점등
       [data-scroll-color] : 제목이 모두 점등된 뒤 한 번에 점등
     모두 #fff 가 된 뒤 HOLD 스텝만큼 머문 후 고정 해제 → 다음 섹션으로.
     스텝 수 = 줄 수 + 본문 1 + HOLD → CSS --intro-steps 로 섹션 높이 결정 */
  var HOLD = 1;
  var pinEls = [];

  function splitLines(el) {
    // 원문(번역 적용 후) 기준으로 단어 span 생성 → offsetTop 으로 줄 그룹핑
    var text = el.textContent.replace(/\s+/g, ' ').trim();
    el.innerHTML = '';
    var words = text.split(' ').map(function (w, i, arr) {
      var s = document.createElement('span');
      s.textContent = w + (i < arr.length - 1 ? ' ' : '');
      el.appendChild(s);
      return s;
    });
    var lines = [], top = null;
    words.forEach(function (w) {
      if (w.offsetTop !== top) { lines.push([]); top = w.offsetTop; }
      lines[lines.length - 1].push(w.textContent);
    });
    el.innerHTML = '';
    el.setAttribute('aria-label', text);
    return lines.map(function (ws) {
      var l = document.createElement('span');
      l.className = 'line';
      l.setAttribute('aria-hidden', 'true');
      l.textContent = ws.join('');
      el.appendChild(l);
      return l;
    });
  }

  function buildPins() {
    pinEls = Array.prototype.map.call(document.querySelectorAll('[data-scroll-pin]'), function (sec) {
      var items = [];
      sec.querySelectorAll('[data-scroll-lines]').forEach(function (el) { items = items.concat(splitLines(el)); });
      sec.querySelectorAll('[data-scroll-color]').forEach(function (el) { items.push(el); });
      sec.style.setProperty('--intro-steps', items.length + HOLD);
      return { sec: sec, items: items };
    });
    updatePins();
  }

  function updatePins() {
    var vh = window.innerHeight;
    pinEls.forEach(function (pin) {
      var r = pin.sec.getBoundingClientRect();
      var steps = pin.items.length + HOLD;
      var stepPx = Math.max(1, (r.height - vh) / steps);
      var u = -r.top / stepPx;                       // 고정 시작 후 진행 스텝
      pin.items.forEach(function (el, i) {
        el.classList.toggle('is-on', u >= i + 0.35);
      });
    });
  }

  function initPins() {
    var secs = document.querySelectorAll('[data-scroll-pin]');
    if (!secs.length) return;
    if (reduce) return; // 고정·애니메이션 없이 기본 레이아웃(흰 글씨)
    secs.forEach(function (sec) { sec.classList.add('is-pinnable'); });

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { updatePins(); ticking = false; });
    }, { passive: true });

    // 리사이즈/언어변경/폰트로딩 시 줄 재계산
    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(buildPins, 150);
    });
    document.addEventListener('i18n:change', buildPins);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildPins);
    buildPins();
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
  initPins();
  initHeroVideo();
})();
