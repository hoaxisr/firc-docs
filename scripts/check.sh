#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
FIRC_SRC=${FIRC_SRC:-../firc}

fail() { echo "check: $*" >&2; exit 1; }

[[ -f hugo.toml ]] || fail "hugo.toml missing"
hugo --minify --cleanDestinationDir --quiet || fail "hugo build failed"
[[ -f public/index.html ]] || fail "public/index.html missing"

leak='magitrickle|hydraroute|xkeen|\bmt-c\b|dan0102dan|firc-archive|awgm-server|bench0|\badr[-/ ]?0[0-9]{3}\b|\bD-[0-9]{2}\b|/home/|10\.10\.10\.|91\.144\.|89\.175\.|176\.109\.'
hits=$(grep -rIniE "$leak" --exclude-dir={themes,public,resources,.git} --exclude=check.sh --exclude=deploy.sh . || true)
[[ -z "$hits" ]] || fail "forbidden text:"$'\n'"$hits"

broken=$(cd public && grep -rhoE 'href="/[^"#?]*' --include='*.html' . | sed 's/^href="//' | sort -u | while read -r p; do
    [[ -e ".$p" || -e ".${p%/}/index.html" || -e ".$p.html" ]] || echo "$p"
done)
[[ -z "$broken" ]] || fail "broken internal links:"$'\n'"$broken"

if [[ -f content/install/_index.md ]]; then
    [[ -f "$FIRC_SRC/README.md" ]] || fail "FIRC_SRC=$FIRC_SRC has no README.md"
    block=$(awk '/^## Установка/{s=1} s&&/^```/{if(b){exit}b=1;next} b{print}' "$FIRC_SRC/README.md")
    [[ -n "$block" ]] || fail "no shell block under Установка in $FIRC_SRC/README.md"
    [[ "$(cat content/install/_index.md)" == *"$block"* ]] || fail "install block differs from $FIRC_SRC/README.md"
fi

echo "check: ok"
