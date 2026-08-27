#!/usr/bin/env bash
set -euo pipefail
rm -rf www
mkdir -p www
cp index.html www/
cp manifest.webmanifest www/ 2>/dev/null || true
cp icon-192.png icon-512.png icon-maskable-512.png www/ 2>/dev/null || true
for d in mini-zanahoria magic-alphabet el-avion-azul emotion-mirror breath-trainer focus-trainer word-flow slime-evolution; do
  [ -d "$d" ] && cp -r "$d" www/
done
echo "www/ built: $(ls www | wc -l) top-level entries"
