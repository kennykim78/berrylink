/* berrylink — language routing (KO / EN / RU)
   번역문은 빌드(_build.mjs)가 언어별 정적 페이지(/ · /ko/ · /ru/)에 미리 렌더링한다.
   이 스크립트는 <head> 에서 동기 실행되어 렌더 전에 아래만 처리한다.
   - ?lang=ko|en|ru → 해당 언어 페이지로 이동 (구 URL 호환)
   - 루트(en) 첫 방문 시 지역 추정 → /ko/ 또는 /ru/ 로 이동
       우선순위: 사용자가 직접 고른 언어(localStorage) → 시간대(지역) → 브라우저 언어·지역 → en
   - 언어 링크 클릭 시 선택 저장
   - file:// 로 열었을 때 폴더 링크에 index.html 보정 */
(function () {
  'use strict';

  var LANGS = ['en', 'ko', 'ru'];
  var DEFAULT = 'en';
  var KEY = 'berrylink-lang';
  var page = document.documentElement.lang || DEFAULT;

  function store(lang) { try { localStorage.setItem(KEY, lang); } catch (e) {} }
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function valid(l) { return LANGS.indexOf(l) > -1; }

  /* ---------- 지역 기반 초기 언어 ----------
     정적 사이트라 IP 조회 대신 브라우저 정보로 추정 (외부 요청 없음)
     RU 권역 = 러시아 + CIS(벨라루스·카자흐·키르기스·우즈벡·타지크·투르크멘·아르메니아·아제르바이잔·몰도바) */
  var RU_COUNTRIES = ['RU', 'BY', 'KZ', 'KG', 'UZ', 'TJ', 'TM', 'AM', 'AZ', 'MD'];
  var RU_LANGS = ['ru', 'be', 'kk', 'ky', 'uz', 'tg', 'tk', 'hy', 'az'];
  var RU_TZ = /^(Europe\/(Moscow|Kaliningrad|Samara|Volgograd|Saratov|Ulyanovsk|Astrakhan|Kirov|Simferopol|Minsk|Chisinau)|Asia\/(Yekaterinburg|Omsk|Novosibirsk|Barnaul|Tomsk|Novokuznetsk|Krasnoyarsk|Irkutsk|Chita|Yakutsk|Khandyga|Vladivostok|Ust-Nera|Magadan|Sakhalin|Srednekolymsk|Kamchatka|Anadyr|Almaty|Qostanay|Aqtobe|Aqtau|Atyrau|Oral|Qyzylorda|Bishkek|Tashkent|Samarkand|Dushanbe|Ashgabat|Yerevan|Baku))$/;
  var KO_TZ = /^Asia\/Seoul$/;

  function byTimezone() {
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    if (KO_TZ.test(tz)) return 'ko';
    if (RU_TZ.test(tz)) return 'ru';
    return null;
  }

  function byBrowserLocale() {
    var list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || ''];
    for (var i = 0; i < list.length; i++) {
      var parts = String(list[i]).split('-');
      var lang = parts[0].toLowerCase();
      var region = (parts[parts.length - 1] || '').toUpperCase();
      if (lang === 'ko' || region === 'KR') return 'ko';
      if (RU_LANGS.indexOf(lang) > -1 || RU_COUNTRIES.indexOf(region) > -1) return 'ru';
    }
    return null;
  }

  // 현재 페이지 기준 대상 언어 페이지 URL
  function urlFor(lang) {
    var base = page === DEFAULT ? '' : '../';
    var href = base + (lang === DEFAULT ? '' : lang + '/');
    if (!href) href = './';
    if (location.protocol === 'file:') href += 'index.html';
    return href;
  }

  function go(lang) { location.replace(urlFor(lang) + location.hash); }

  // 1) ?lang= 호환
  var q = null;
  try { q = new URLSearchParams(location.search).get('lang'); } catch (e) {}
  if (q && valid(q)) {
    store(q);
    if (q !== page) { go(q); return; }
  }

  // 2) 루트(en) 진입 시에만 자동 감지 (언어 페이지로 직접 들어온 방문은 존중)
  if (page === DEFAULT && !q) {
    var s = stored();
    var target = (s && valid(s)) ? s : (byTimezone() || byBrowserLocale() || DEFAULT);
    if (target !== page) { go(target); return; }
  }

  // 3) 언어 링크: 선택 저장 + file:// 보정
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-lang-link]').forEach(function (a) {
      var lang = a.getAttribute('data-lang-link');
      a.setAttribute('href', urlFor(lang));
      a.addEventListener('click', function () {
        store(lang);
        // 저장소 차단(사생활 보호 모드 등) 시 자동감지로 되돌아가지 않도록 ?lang= 동반
        if (stored() !== lang) a.setAttribute('href', urlFor(lang) + '?lang=' + lang);
      });
    });
  });
})();
