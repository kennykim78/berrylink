/* berrylink — i18n (KO / EN / RU / AR)
   - 우선순위: ?lang= → localStorage(사용자가 고른 언어) → en(기본)
   - 번역 대상: [data-i18n="key"] (값은 HTML 허용: 줄바꿈 <br> 용) */
(function () {
  'use strict';

  var DICT = {
    en: {
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.partners': 'Partners',
      'meta.title': 'berrylink | K‑Beauty Brand Production Agency for CIS & Islamic Markets',
      'hero.tagline': 'K‑Beauty Brand Production Agency<br class="hero__br"> for CIS &amp; Islamic Markets',
      'intro.title': 'Debuting K‑Beauty Brands as Stars in the CIS and Islamic Regions.',
      'intro.text': 'Just as top entertainment agencies produce global pop stars, Berrylink exclusively manages and produces your K‑brand for the big stage. A successful debut in the challenging CIS and Islamic markets will be the perfect launchpad for your worldwide expansion.',
      'footer.hq.name': 'HQ',
      'footer.hq.addr': '510 5th F/L 23, Jungdongbuk-ro, Uichang-gu, Changwon-si, Gyeongsangnam-do, Rep. of KOREA',
      'footer.seoul.name': 'Seoul Office',
      'footer.seoul.addr': '210 2nd F/L 10, Nambusunhwan-ro 333-gil, Seocho-gu, Seoul, Rep. of KOREA',
      'footer.almaty.name': 'Almaty Office',
      'footer.almaty.addr': 'Business Center \'Atakent City\' 15/107, 2nd Floor, Timiryazeva Str., 42, Almaty 050057'
    },
    ko: {
      'nav.home': '홈',
      'nav.about': '소개',
      'nav.partners': '파트너',
      'meta.title': 'berrylink | CIS·이슬람권 특화 K‑뷰티 브랜드 기획사',
      'hero.tagline': 'CIS·이슬람권 특화<br class="hero__br--m"> K‑뷰티 브랜드 기획사',
      'intro.title': '당신의 K‑뷰티 브랜드를 CIS와 이슬람권의 스타로 만들어 드립니다.',
      'intro.text': '대형 기획사가 글로벌 스타를 발굴하고 키워내듯, 베리링크는 당신의 브랜드를 전담 프로듀싱합니다. 장벽 높은 CIS와 이슬람 시장에서의 성공적인 첫 무대가, 전 세계로 뻗어나가는 확실한 발판이 될 것입니다.',
      'footer.hq.name': 'HQ',
      'footer.hq.addr': '510 5th F/L 23, Jungdongbuk-ro, Uichang-gu, Changwon-si, Gyeongsangnam-do, Rep. of KOREA',
      'footer.seoul.name': 'Seoul Office',
      'footer.seoul.addr': '210 2nd F/L 10, Nambusunhwan-ro 333-gil, Seocho-gu, Seoul, Rep. of KOREA',
      'footer.almaty.name': 'Almaty Office',
      'footer.almaty.addr': 'Business Center \'Atakent City\' 15/107, 2nd Floor, Timiryazeva Str., 42, Almaty 050057'
    },
    ru: {
      'nav.home': 'Главная',
      'nav.about': 'О нас',
      'nav.partners': 'Партнёры',
      'meta.title': 'berrylink | Продюсерское агентство K‑Beauty брендов для стран СНГ и исламского мира',
      'hero.tagline': 'Продюсерское агентство K‑Beauty брендов<br class="hero__br"> для стран СНГ и исламского мира',
      'intro.title': 'Продюсируем K‑Beauty бренды, делая их звездами в СНГ и исламских странах.',
      'intro.text': 'Подобно тому, как ведущие развлекательные агентства создают мировых звезд, Berrylink берет на себя полное продюсирование вашего бренда. Успешный дебют на сложных рынках СНГ и исламских стран станет идеальным трамплином для выхода на мировую сцену.',
      'footer.hq.name': 'Головной офис',
      'footer.hq.addr': 'Республика Корея, провинция Кёнсан-Намдо, г. Чханвон, район Ыйчхан-гу, Чундонбук-ро, 23, 5 этаж, офис 510',
      'footer.seoul.name': 'Офис в Сеуле',
      'footer.seoul.addr': 'Республика Корея, г. Сеул, район Сочхо-гу, Намбусунхван-ро 333-гиль, 10, 2 этаж, офис 210',
      'footer.almaty.name': 'Офис в г. Алматы',
      'footer.almaty.addr': 'Бизнес-центр «Atakent City», оф. 15/107, 2-й этаж, ул. Тимирязева, д. 42, г. Алматы, 050057'
    },
    ar: {
      'nav.home': 'الرئيسية',
      'nav.about': 'من نحن',
      'nav.partners': 'شركاؤنا',
      'meta.title': 'berrylink | وكالة إنتاج علامات K-Beauty التجارية لأسواق رابطة الدول المستقلة والعالم الإسلامي',
      'hero.tagline': 'وكالة إنتاج علامات K-Beauty التجارية<br class="hero__br"> لأسواق رابطة الدول المستقلة والعالم الإسلامي',
      'intro.title': 'نُطلق علامات K-Beauty التجارية لتصبح نجومًا في رابطة الدول المستقلة والعالم الإسلامي.',
      'intro.text': 'كما تصنع كبرى وكالات الترفيه نجوم البوب العالميين، تتولّى Berrylink حصريًا إدارة علامتك التجارية الكورية وإنتاجها لتعتلي المسرح الكبير. وسيكون الظهور الأول الناجح في أسواق رابطة الدول المستقلة والأسواق الإسلامية الصعبة منصّة الانطلاق المثالية لتوسّعك حول العالم.',
      'footer.hq.name': 'المقر الرئيسي',
      'footer.hq.addr': 'مكتب 510، الطابق الخامس، 23 شارع جونغدونغبوك، حي أويتشانغ، مدينة تشانغوون، مقاطعة غيونغسانغ الجنوبية، جمهورية كوريا',
      'footer.seoul.name': 'مكتب سيول',
      'footer.seoul.addr': 'مكتب 210، الطابق الثاني، 10 شارع نامبوسونهوان 333 غيل، حي سوتشو، سيول، جمهورية كوريا',
      'footer.almaty.name': 'مكتب ألماتي',
      'footer.almaty.addr': 'مركز الأعمال «Atakent City»، مكتب 15/107، الطابق الثاني، 42 شارع تيميريازيفا، ألماتي 050057'
    }
  };
  // 오른쪽→왼쪽(RTL) 언어: 레이아웃(헤더·도트내비·푸터 배치)은 유지하고 번역 텍스트에만 dir="rtl" 적용
  var RTL = { ar: true };
  var DEFAULT = 'en';
  var KEY = 'berrylink-lang';

  function store(lang) { try { localStorage.setItem(KEY, lang); } catch (e) {} }
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

  // 우선순위: ?lang= → 사용자가 직접 고른 언어(localStorage) → en(기본)
  function detect() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q && DICT[q]) return q;
    var s = stored();
    if (s && DICT[s]) return s;
    return DEFAULT;
  }

  function apply(lang) {
    var dict = DICT[lang] || DICT[DEFAULT];
    var dir = RTL[lang] ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.title = dict['meta.title'];
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = dict[el.getAttribute('data-i18n')];
      if (v != null) el.innerHTML = v;
      el.dir = dir;
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
