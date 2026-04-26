# Game Manifest Schema

Every game served by the devdev portal must publish `/manifest.json` at the root of its
deploy. This document describes the contract. The runtime source of truth is the Zod
schema in [`src/content/config.ts`](../src/content/config.ts).

## Top-level shape

```jsonc
{
  "slug": "bloodvolt",                          // [a-z0-9-]+; must match folder under public/games/
  "title": "BLOODVOLT",                         // 1–32 chars
  "subtitle": "GAME ONE ULTIMATE",              // optional, ≤32 chars
  "tagline": "Cyberpunk arena combat. 384 endgame paths.", // 1–120 chars; one-liner
  "description": "Persistent .io-style PvP …",  // 30–600 chars; appears on detail page
  "genre": ["Action", "Arena", "Roguelite"],    // 1–4 entries from controlled vocab
  "tags": ["PvP", "io", "Class-tree"],          // 0–8 free-form
  "rating": "PEGI-18",                          // PEGI-3|7|12|16|18 | ESRB-E|T|M|AO
  "playUrl": "https://bldvolt.web.app",         // absolute URL — opens new tab
  "version": "1.0-ultimate",                    // semver-ish; freeform <16 chars
  "releaseDate": "2026-04-26",                  // ISO-8601 date
  "accentColor": "#00f0ff",                     // 7-char hex; drives portal theming
  "darkColor":   "#080c12",                     // 7-char hex; bg accent

  "capsules": {
    "hero":    "/games/bloodvolt/capsule-616x353.webp",   // 616×353 — featured slot
    "catalog": "/games/bloodvolt/capsule-460x215.webp",   // 460×215 — grid
    "mini":    "/games/bloodvolt/capsule-184x69.webp"     // 184×69  — list rows
  },
  "screenshots": [                              // 3–8 entries; 1920×1080 ideal
    "/games/bloodvolt/screenshot-01.webp"
  ],
  "trailerLoop": "/games/bloodvolt/trailer-loop.mp4",  // optional; 6–10s seamless loop

  "stats": {                                    // free-form key/value badges shown on detail
    "achievements": 16,
    "classes": 384,
    "decorators": 607
  },
  "features": {                                 // controlled flags — drive feature pills
    "multiplayer": true,
    "controller": false,
    "mobile": true,
    "ageGate": true,
    "freeToPlay": true
  },
  "weeklyEvent": {                              // optional; shows live countdown
    "name": "BLOOD MOON",
    "until": "2026-05-04T00:00:00Z"
  }
}
```

## Validation

- Run `npm run validate` locally before pushing — fails fast on schema violations.
- CI runs the same check; PRs that break the schema cannot merge.
- The portal build FAILS (does not silently render) if any registered game's manifest is
  invalid. This is deliberate — bad data must be visible.

## Versioning

Schema bumps land with a portal version bump. Existing games get a deprecation window of
two minor portal releases before old fields are removed. The `version` field on the game
manifest is **the game's** version, not the schema's; it's purely display.

## Path conventions

- `capsules.*` and `screenshots[]` use absolute paths starting with `/games/<slug>/...`.
- All art lives at `public/games/<slug>/` in the **portal repo** (not the game repo).
  Rationale: portal owns its asset CDN, decouples deploy schedules.
- `playUrl` is the game's live URL, not a portal-internal path. New tab; no iframe v1.
