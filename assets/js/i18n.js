/* berrylink — i18n (KO / EN / RU)
   - 우선순위: ?lang= → localStorage → 브라우저 언어(ko/ru) → en
   - 번역 대상: [data-i18n="key"] (값은 HTML 허용: 줄바꿈 <br> 용) */
(function () {
  'use strict';

  var DICT = {
    en: {
      'meta.title': 'berrylink | K‑Beauty Brand Production Agency for CIS & Islamic Markets',
      'hero.tagline': 'K‑Beauty Brand Production Agency<br class="hero__br"> for CIS &amp; Islamic Markets',
      'intro.title': 'Debuting K‑Beauty Brands as Stars in the CIS and Islamic Regions.',
      'intro.text': 'Just as top entertainment agencies produce global pop stars, Berrylink exclusively manages and produces your K‑brand for the big stage. A successful debut in the challenging CIS and Islamic markets will be the perfect launchpad for your worldwide expansion.',
      'footer.hq.name': 'HQ',
      'footer.hq.addr': '510 5th F/L 23, Jungdongbuk-ro, Uichang-gu, Changwon-si, Gyeongsangnam-do, Rep. of KOREA',
      'footer.seoul.name': 'Seoul Office',
      'footer.seoul.addr': '210 2nd F/L 10, Nambusunhwan-ro 333-gil, Seocho-gu, Seoul, Rep. of KOREA'
    },
    ko: {
      'meta.title': 'berrylink | CIS·이슬람권 특화 K‑뷰티 브랜드 기획사',
      'hero.tagline': 'CIS·이슬람권 특화 K‑뷰티 브랜드 기획사',
      'intro.title': '당신의 K‑뷰티 브랜드를 CIS와 이슬람권의 스타로 만들어 드립니다.',
      'intro.text': '대형 기획사가 글로벌 스타를 발굴하고 키워내듯, 베리링크는 당신의 브랜드를 전담 프로듀싱합니다. 장벽 높은 CIS와 이슬람 시장에서의 성공적인 첫 무대가, 전 세계로 뻗어나가는 확실한 발판이 될 것입니다.',
      'footer.hq.name': '본사',
      'footer.hq.addr': '경상남도 창원시 의창구 중동북로 23, 5층 510호',
      'footer.seoul.name': '서울 사무소',
      'footer.seoul.addr': '서울특별시 서초구 남부순환로333길 10, 2층 210호'
    },
    ru: {
      'meta.title': 'berrylink | Продюсерское агентство K‑Beauty брендов для стран СНГ и исламского мира',
      'hero.tagline': 'Продюсерское агентство K‑Beauty брендов<br class="hero__br"> для стран СНГ и исламского мира',
      'intro.title': 'Продюсируем K‑Beauty бренды, делая их звездами в СНГ и исламских странах.',
      'intro.text': 'Подобно тому, как ведущие развлекательные агентства создают мировых звезд, Berrylink берет на себя полное продюсирование вашего бренда. Успешный дебют на сложных рынках СНГ и исламских стран станет идеальным трамплином для выхода на мировую сцену.',
      'footer.hq.name': 'Головной офис',
      'footer.hq.addr': 'Республика Корея, провинция Кёнсан-Намдо, г. Чханвон, район Ыйчхан-гу, Чундонбук-ро, 23, 5 этаж, офис 510',
      'footer.seoul.name': 'Офис в Сеуле',
      'footer.seoul.addr': 'Республика Корея, г. Сеул, район Сочхо-гу, Намбусунхван-ро 333-гиль, 10, 2 этаж, офис 210'
    }
  };
  var DEFAULT = 'en';
  var KEY = 'berrylink-lang';

  function store(lang) { try { localStorage.setItem(KEY, lang); } catch (e) {} }
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

  /* ---------- 지역 기반 초기 언어 ----------
     정적 사이트라 IP 조회 대신 브라우저 정보로 추정 (외부 요청 없음)
     1) 시간대(지역)  2) 브라우저 언어·지역 태그  → 해당 없으면 en
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

  // 우선순위: ?lang= → 사용자가 직접 고른 언어(localStorage) → 지역(시간대) → 브라우저 언어·지역 → en
  function detect() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q && DICT[q]) return q;
    var s = stored();
    if (s && DICT[s]) return s;
    return byTimezone() || byBrowserLocale() || DEFAULT;
  }

  function apply(lang) {
    var dict = DICT[lang] || DICT[DEFAULT];
    document.documentElement.lang = lang;
    document.title = dict['meta.title'];
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = dict[el.getAttribute('data-i18n')];
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      var on = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: lang } }));
  }

  document.querySelectorAll('[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var lang = btn.getAttribute('data-lang');
      apply(lang);
      store(lang);
      var url = new URL(location.href);
      url.searchParams.set('lang', lang);
      history.replaceState(null, '', url);
    });
  });

  apply(detect());
})();
