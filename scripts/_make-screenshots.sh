#!/usr/bin/env bash
set -euo pipefail
ROOT="/Users/ayf/devdev/public/games/bloodvolt"

declare -a TITLES=("ARENA"      "CLASS TREE"   "BOSS — VOIDWALKER"  "KILL CAM"    "BUILD SHARE")
declare -a ACCENTS=("#00f0ff"   "#ff006e"      "#9d00ff"             "#ffb400"     "#00ff9d")
declare -a SUBS=("PERSISTENT WORLD" "384 ENDGAME PATHS" "5 BIOME BOSSES" "POST-DEATH REPLAY" "BLDVLT:XXXXXXXX")

for i in 1 2 3 4 5; do
  idx=$((i - 1))
  TITLE="${TITLES[$idx]}"
  ACCENT="${ACCENTS[$idx]}"
  SUB="${SUBS[$idx]}"
  cat > "$ROOT/screenshot-0$i.svg" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1920" y2="1080" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#060911"/>
      <stop offset="0.6" stop-color="#0a1530"/>
      <stop offset="1" stop-color="#1a0530"/>
    </linearGradient>
    <radialGradient id="glow$i" cx="0.7" cy="0.4" r="0.6">
      <stop offset="0" stop-color="$ACCENT" stop-opacity="0.35"/>
      <stop offset="1" stop-color="$ACCENT" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid$i" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M80 0H0V80" fill="none" stroke="$ACCENT" stroke-width="1" stroke-opacity="0.08"/>
    </pattern>
  </defs>
  <rect width="1920" height="1080" fill="url(#bg)"/>
  <rect width="1920" height="1080" fill="url(#grid$i)"/>
  <rect width="1920" height="1080" fill="url(#glow$i)"/>
  <g opacity="0.85" stroke="$ACCENT" stroke-width="3" fill="none">
    <polygon points="380,720 480,560 580,720 540,840 420,840"/>
    <polygon points="780,680 900,500 1020,680 980,820 820,820"/>
    <polygon points="1240,720 1340,560 1440,720 1400,840 1280,840"/>
  </g>
  <text x="120" y="260" font-family="-apple-system,'Inter',sans-serif"
    font-size="180" font-weight="900" fill="#fff" letter-spacing="-2">$TITLE</text>
  <text x="120" y="320" font-family="ui-monospace,'JetBrains Mono',monospace"
    font-size="36" font-weight="700" fill="$ACCENT" letter-spacing="6">$SUB</text>
  <text x="120" y="1020" font-family="ui-monospace,'JetBrains Mono',monospace"
    font-size="22" font-weight="700" fill="#6c7a92" letter-spacing="3">BLOODVOLT  ·  GAME ONE  ·  ULTIMATE</text>
</svg>
EOF
done
echo OK
