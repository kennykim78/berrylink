#!/usr/bin/env bash
# _partials/*.html 를 index.html 로 조립 (섹션 수정 후 재실행)
cd "$(dirname "$0")"
{
cat <<'HEAD'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>berrylink | K-Beauty Brand Production Agency for CIS &amp; Islamic Markets</title>
  <meta name="description" content="Berrylink exclusively manages and produces K-Beauty brands for a successful debut in the CIS and Islamic markets.">
  <meta property="og:title" content="berrylink">
  <meta property="og:description" content="K-Beauty Brand Production Agency for CIS &amp; Islamic Markets">
  <meta property="og:type" content="website">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="stylesheet" href="assets/css/reset.css">
  <link rel="stylesheet" href="assets/css/common.css">
HEAD
for f in hero intro visual brands footer; do
  [ -f "assets/css/sections/$f.css" ] && echo "  <link rel=\"stylesheet\" href=\"assets/css/sections/$f.css\">"
done
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
