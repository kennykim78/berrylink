#!/usr/bin/env bash
# _partials/*.html 를 index.html 로 조립 (섹션 수정 후 재실행)
# 결과물은 정적 HTML 1개 (index.html). 언어 전환은 assets/js/i18n.js 가 브라우저에서 처리
cd "$(dirname "$0")"

SITE_URL="https://berrylink.io/"   # ← 실제 배포 도메인으로 변경 (canonical·OG·구조화 데이터·sitemap 에 사용)
OG_IMAGE="assets/images/og/og-image.jpg"

# ---------- Partner Brands → schema.org ItemList (캐러셀형 구조화 데이터) ----------
# 04_brands 파셜의 <li class="brands__item"> 순서대로 자동 추출: 로고 img(src·alt) 또는 임시 워드마크
brand_items() {
  local i=0 sep=""
  tr -d '\r' < _partials/04_brands.html | grep -o '<li class="brands__item[^>]*>.*</li>' | while IFS= read -r li; do
    i=$((i+1))
    local name logo
    if [[ "$li" == *'<img '* ]]; then
      logo=$(sed -n 's/.*src="\([^"]*\)".*/\1/p' <<<"$li")
      name=$(sed -n 's/.*alt="\([^"]*\)".*/\1/p' <<<"$li")
      printf '%s        { "@type": "ListItem", "position": %d, "item": { "@type": "Brand", "name": "%s", "logo": "%s%s", "image": "%s%s" } }' "$sep" "$i" "$name" "$SITE_URL" "$logo" "$SITE_URL" "$logo"
    else
      name=$(sed -n 's/.*brands__wordmark">\([^<]*\)<.*/\1/p' <<<"$li")
      printf '%s        { "@type": "ListItem", "position": %d, "item": { "@type": "Brand", "name": "%s" } }' "$sep" "$i" "$name"
    fi
    sep=$',\n'
  done
}
BRAND_COUNT=$(tr -d '\r' < _partials/04_brands.html | grep -c '<li class="brands__item')

{
cat <<HEAD
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>berrylink | K-Beauty Brand Production Agency for CIS &amp; Islamic Markets</title>
  <meta name="description" content="Berrylink is a K-Beauty brand production agency for CIS &amp; Islamic markets. We exclusively manage and produce your Korean beauty brand’s debut and growth.">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <link rel="canonical" href="${SITE_URL}">

  <!-- Open Graph / Twitter -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="berrylink">
  <meta property="og:title" content="berrylink | K-Beauty Brand Production Agency for CIS &amp; Islamic Markets">
  <meta property="og:description" content="Debuting K-Beauty Brands as Stars in the CIS and Islamic Regions.">
  <meta property="og:url" content="${SITE_URL}">
  <meta property="og:image" content="${SITE_URL}${OG_IMAGE}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="berrylink">
  <meta property="og:locale" content="en_US">
  <meta property="og:locale:alternate" content="ko_KR">
  <meta property="og:locale:alternate" content="ru_RU">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="berrylink | K-Beauty Brand Production Agency for CIS &amp; Islamic Markets">
  <meta name="twitter:description" content="Debuting K-Beauty Brands as Stars in the CIS and Islamic Regions.">
  <meta name="twitter:image" content="${SITE_URL}${OG_IMAGE}">

  <link rel="icon" href="favicon.ico" sizes="48x48">
  <link rel="icon" href="assets/images/favicon/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="assets/images/favicon/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="assets/images/favicon/apple-touch-icon.png">
  <link rel="manifest" href="site.webmanifest">
  <meta name="theme-color" content="#000000">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="stylesheet" href="assets/css/reset.css">
  <link rel="stylesheet" href="assets/css/common.css">
HEAD
for f in hero intro visual brands footer dotnav; do
  [ -f "assets/css/sections/$f.css" ] && echo "  <link rel=\"stylesheet\" href=\"assets/css/sections/$f.css\">"
done
cat <<LD

  <!-- 구조화 데이터 (schema.org): 회사 정보 + Partner Brands 캐러셀(ItemList) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "${SITE_URL}#organization",
        "name": "Berrylink",
        "alternateName": ["berrylink", "베리링크"],
        "url": "${SITE_URL}",
        "logo": "${SITE_URL}assets/images/favicon/icon-512.png",
        "image": "${SITE_URL}${OG_IMAGE}",
        "email": "info@berrylink.io",
        "slogan": "Debuting K-Beauty Brands as Stars in the CIS and Islamic Regions.",
        "description": "K-Beauty Brand Production Agency for CIS & Islamic Markets",
        "areaServed": [
          { "@type": "Place", "name": "CIS countries" },
          { "@type": "Place", "name": "Islamic markets" }
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "510, 5F, 23 Jungdongbuk-ro, Uichang-gu",
          "addressLocality": "Changwon-si",
          "addressRegion": "Gyeongsangnam-do",
          "addressCountry": "KR"
        },
        "location": [
          { "@type": "Place", "name": "HQ", "address": "510 5th F/L 23, Jungdongbuk-ro, Uichang-gu, Changwon-si, Gyeongsangnam-do, Rep. of KOREA" },
          { "@type": "Place", "name": "Seoul Office", "address": "210 2nd F/L 10, Nambusunhwan-ro 333-gil, Seocho-gu, Seoul, Rep. of KOREA" }
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "business inquiries",
          "email": "info@berrylink.io",
          "availableLanguage": ["English", "Korean", "Russian"]
        }
      },
      {
        "@type": "WebSite",
        "@id": "${SITE_URL}#website",
        "url": "${SITE_URL}",
        "name": "berrylink",
        "inLanguage": ["en", "ko", "ru"],
        "publisher": { "@id": "${SITE_URL}#organization" }
      },
      {
        "@type": "WebPage",
        "@id": "${SITE_URL}#webpage",
        "url": "${SITE_URL}",
        "name": "berrylink | K-Beauty Brand Production Agency for CIS & Islamic Markets",
        "isPartOf": { "@id": "${SITE_URL}#website" },
        "about": { "@id": "${SITE_URL}#organization" },
        "primaryImageOfPage": "${SITE_URL}${OG_IMAGE}",
        "hasPart": { "@id": "${SITE_URL}#partner-brands" }
      },
      {
        "@type": "ItemList",
        "@id": "${SITE_URL}#partner-brands",
        "name": "Partner Brands",
        "description": "K-Beauty brands produced and managed by Berrylink for the CIS and Islamic markets",
        "numberOfItems": ${BRAND_COUNT},
        "itemListOrder": "https://schema.org/ItemListUnordered",
        "itemListElement": [
$(brand_items)
        ]
      }
    ]
  }
  </script>
LD
echo '</head>'
echo '<body>'
sed 's/^/  /' _partials/00_header.html; echo
echo '<main>'
for p in _partials/0[1-4]_*.html; do sed 's/^/  /' "$p"; echo; done
echo '</main>'
sed 's/^/  /' _partials/05_footer.html 2>/dev/null
echo
echo '  <script src="assets/js/i18n.js" defer></script>'
echo '  <script src="assets/js/main.js" defer></script>'
echo '</body>'
echo '</html>'
} > index.html
echo "built index.html ($(wc -l < index.html) lines)"

# sitemap.xml (단일 페이지)
cat > sitemap.xml <<XML
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
  </url>
</urlset>
XML
echo "built sitemap.xml"
