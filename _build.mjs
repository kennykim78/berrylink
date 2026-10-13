// berrylink — static build
// _partials/*.html + _i18n.json → index.html (en) · ko/index.html · ru/index.html · sitemap.xml
// 실행: node _build.mjs   (또는 ./_build.sh)
//
// 언어별 페이지를 미리 렌더링해 두는 이유: Google 외 대부분의 AI 크롤러(GPTBot, ClaudeBot,
// PerplexityBot 등)와 Yandex·Naver 일부 수집기는 JS 를 실행하지 않으므로, 번역문이 HTML 에
// 들어 있어야 언어별로 색인·인용된다.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://berrylink.io/';           // ← 실제 배포 도메인으로 변경
const LANGS = ['en', 'ko', 'ru'];                    // 첫 번째 = 루트(x-default)
const CSS_SECTIONS = ['hero', 'intro', 'visual', 'brands', 'footer', 'dotnav'];
const OG_IMAGE = 'assets/images/og/og-image.jpg';
const FONT_CSS = [
  'https://fonts.googleapis.com/css2?family=Abhaya+Libre:wght@400;500;600;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500&family=Noto+Serif:wght@400;500&display=swap',
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css',
];

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const DICT = JSON.parse(read('_i18n.json'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const plain = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const dir = (lang) => (lang === LANGS[0] ? '' : `${lang}/`);
const pageUrl = (lang) => SITE_URL + dir(lang);
const indent = (s, n = 2) => s.replace(/^(?=.)/gm, ' '.repeat(n));

const partials = fs.readdirSync(path.join(ROOT, '_partials')).filter((f) => f.endsWith('.html')).sort();
const part = (prefix) => partials.filter((f) => f.startsWith(prefix)).map((f) => read(`_partials/${f}`)).join('\n');

function body(lang) {
  const d = DICT[lang];
  let html = [
    indent(part('00_')),
    '<main>',
    indent(['01_', '02_', '03_', '04_'].map(part).join('\n')),
    '</main>',
    indent(part('05_')),
  ].join('\n');

  // 번역 주입: data-i18n (innerHTML) / data-i18n-plain (태그 제거 텍스트)
  html = html.replace(/(<(\w+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)[\s\S]*?(<\/\2>)/g,
    (m, open, tag, key, close) => (d[key] != null ? open + d[key] + close : m));
  html = html.replace(/(<(\w+)\b[^>]*\bdata-i18n-plain="([^"]+)"[^>]*>)[\s\S]*?(<\/\2>)/g,
    (m, open, tag, key, close) => (d[key] != null ? `${open} — ${esc(plain(d[key]))}${close}` : m));

  // 언어 링크: href + 현재 언어 표시
  html = html.replace(/<a class="site-header__link" data-lang-link="(\w+)"/g, (m, l) => {
    const href = (lang === LANGS[0] ? '' : '../') + dir(l) || './';
    const active = l === lang;
    return `<a class="site-header__link${active ? ' is-active' : ''}" href="${href || './'}" data-lang-link="${l}"${active ? ' aria-current="page"' : ''}`;
  });

  // 하위 폴더 페이지는 에셋 경로 보정
  if (dir(lang)) html = html.replace(/(src|href|poster)="(assets\/)/g, '$1="../$2');
  return html;
}

// Partner Brands → schema.org ItemList (캐러셀형 목록). 04_brands 파셜에서 자동 추출
function partnerBrands() {
  const html = part('04_');
  const items = [];
  const re = /<li class="brands__item[^"]*">([\s\S]*?)<\/li>/g;
  let m;
  while ((m = re.exec(html))) {
    const img = m[1].match(/<img[^>]*src="([^"]+)"[^>]*alt="([^"]+)"/);
    const word = m[1].match(/class="brands__wordmark">([^<]+)</);
    if (img) items.push({ name: img[2], logo: SITE_URL + img[1] });
    else if (word) items.push({ name: word[1].trim() });
  }
  return items;
}

function jsonLd(lang) {
  const d = DICT[lang];
  const org = SITE_URL + '#organization';
  const site = SITE_URL + '#website';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': org,
        name: 'Berrylink',
        alternateName: ['berrylink', '베리링크'],
        url: SITE_URL,
        logo: SITE_URL + 'assets/images/favicon/icon-512.png',
        image: SITE_URL + OG_IMAGE,
        email: 'info@berrylink.io',
        slogan: plain(d['intro.title']),
        description: plain(d['meta.description']),
        knowsAbout: ['K-Beauty', 'Korean cosmetics', 'Beauty brand production', 'CIS market entry', 'Islamic market entry'],
        areaServed: [
          { '@type': 'Place', name: 'CIS countries' },
          { '@type': 'Place', name: 'Islamic markets' },
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: '510, 5F, 23 Jungdongbuk-ro, Uichang-gu',
          addressLocality: 'Changwon-si',
          addressRegion: 'Gyeongsangnam-do',
          addressCountry: 'KR',
        },
        location: [
          { '@type': 'Place', name: plain(d['footer.hq.name']), address: plain(d['footer.hq.addr']) },
          { '@type': 'Place', name: plain(d['footer.seoul.name']), address: plain(d['footer.seoul.addr']) },
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'business inquiries',
          email: 'info@berrylink.io',
          availableLanguage: ['English', 'Korean', 'Russian'],
        },
      },
      { '@type': 'WebSite', '@id': site, url: SITE_URL, name: 'berrylink', inLanguage: LANGS, publisher: { '@id': org } },
      {
        '@type': 'WebPage',
        '@id': pageUrl(lang) + '#webpage',
        url: pageUrl(lang),
        name: plain(d['meta.title']),
        description: plain(d['meta.description']),
        inLanguage: lang,
        isPartOf: { '@id': site },
        about: { '@id': org },
        primaryImageOfPage: SITE_URL + OG_IMAGE,
        hasPart: { '@id': SITE_URL + '#partner-brands' },
      },
      (() => {
        const brands = partnerBrands();
        return {
          '@type': 'ItemList',
          '@id': SITE_URL + '#partner-brands',
          name: 'Partner Brands',
          description: 'K-Beauty brands produced and managed by Berrylink for the CIS and Islamic markets',
          numberOfItems: brands.length,
          itemListOrder: 'https://schema.org/ItemListUnordered',
          itemListElement: brands.map((b, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: Object.assign({ '@type': 'Brand', name: b.name }, b.logo ? { logo: b.logo, image: b.logo } : {}),
          })),
        };
      })(),
    ],
  };
}

function head(lang) {
  const d = DICT[lang];
  const up = dir(lang) ? '../' : '';
  const title = plain(d['meta.title']);
  const desc = plain(d['meta.description']);
  const lines = [
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}">`,
    '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">',
    `<link rel="canonical" href="${pageUrl(lang)}">`,
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${pageUrl(l)}">`),
    `<link rel="alternate" hreflang="x-default" href="${pageUrl(LANGS[0])}">`,
    '',
    '<!-- Open Graph / Twitter -->',
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="berrylink">',
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:url" content="${pageUrl(lang)}">`,
    `<meta property="og:image" content="${SITE_URL + OG_IMAGE}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta property="og:image:alt" content="berrylink">',
    `<meta property="og:locale" content="${d['og.locale']}">`,
    ...LANGS.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${DICT[l]['og.locale']}">`),
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(desc)}">`,
    `<meta name="twitter:image" content="${SITE_URL + OG_IMAGE}">`,
    '',
    '<!-- icons -->',
    `<link rel="icon" href="${up}favicon.ico" sizes="48x48">`,
    `<link rel="icon" href="${up}assets/images/favicon/favicon.svg" type="image/svg+xml">`,
    `<link rel="icon" href="${up}assets/images/favicon/favicon-32.png" type="image/png" sizes="32x32">`,
    `<link rel="apple-touch-icon" href="${up}assets/images/favicon/apple-touch-icon.png">`,
    `<link rel="manifest" href="${up}site.webmanifest">`,
    '<meta name="theme-color" content="#000000">',
    '',
    '<!-- 언어 감지·리다이렉트는 렌더 전에 실행 (동기) -->',
    `<script src="${up}assets/js/i18n.js"></script>`,
    '',
    '<!-- fonts / styles -->',
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>',
    ...FONT_CSS.map((u) => `<link rel="stylesheet" href="${esc(u)}">`),
    `<link rel="stylesheet" href="${up}assets/css/reset.css">`,
    `<link rel="stylesheet" href="${up}assets/css/common.css">`,
    ...CSS_SECTIONS.filter((f) => fs.existsSync(path.join(ROOT, `assets/css/sections/${f}.css`)))
      .map((f) => `<link rel="stylesheet" href="${up}assets/css/sections/${f}.css">`),
    '',
    '<script type="application/ld+json">',
    JSON.stringify(jsonLd(lang), null, 2),
    '</script>',
  ];
  return indent(lines.join('\n'));
}

function page(lang) {
  const up = dir(lang) ? '../' : '';
  return [
    '<!DOCTYPE html>',
    `<html lang="${lang}">`,
    '<head>',
    head(lang),
    '</head>',
    '<body>',
    body(lang),
    `  <script src="${up}assets/js/main.js" defer></script>`,
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

for (const lang of LANGS) {
  const out = path.join(ROOT, dir(lang), 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const html = page(lang);
  fs.writeFileSync(out, html);
  console.log(`built ${path.relative(ROOT, out)} (${html.split('\n').length} lines)`);
}

// sitemap.xml (hreflang 대체 링크 포함)
const today = new Date().toISOString().slice(0, 10);
const alts = LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${pageUrl(l)}"/>`)
  .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(LANGS[0])}"/>`).join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.map((l) => `  <url>\n    <loc>${pageUrl(l)}</loc>\n    <lastmod>${today}</lastmod>\n${alts}\n  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);
console.log('built sitemap.xml');
