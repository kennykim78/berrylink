#!/usr/bin/env bash
# _partials/*.html + _i18n.json → 정적 HTML (index.html · ko/index.html · ru/index.html · sitemap.xml)
# 결과물은 순수 HTML 파일. Node 는 조립 도구로만 사용 (배포 서버/프레임워크 불필요)
cd "$(dirname "$0")" && node _build.mjs
