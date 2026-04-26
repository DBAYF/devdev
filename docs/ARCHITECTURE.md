# devdev — Architecture

This document is the source of truth for the portal's structure. Change it before changing
the code, never after.

## Goals

1. **Static, fast, free.** Lives on Firebase Hosting free tier. No backend for v1.
2. **Add games without touching code.** Manifest-driven. Adding game N is a three-step
   checklist (see [ADDING_A_GAME.md](ADDING_A_GAME.md)).
3. **Per-game theming.** Each game brings its own accent color; the same template renders
   visibly differently for BLOODVOLT vs. future titles.
4. **Atomic, reusable components.** Primitives don't know about games. Capsules don't know
   about layouts. Pages compose.
5. **Type-safe end to end.** Zod-validated manifests + strict TypeScript. Bad data fails
   the build, not the page.

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Astro 5 | Static-first, content collections, file-based routing. |
| Language | TypeScript strict | `noUncheckedIndexedAccess`, `noImplicitOverride`. |
| Validation | Zod | Schema in `src/content/config.ts` = the contract. |
| Styling | CSS custom properties + scoped Astro `<style>` | No utility-class framework. |
| Lint / format | Biome | One tool. |
| Build | `npm run build` → `dist/` | Astro static. |
| Deploy | Firebase Hosting | Free plan. |
| Cross-game state | None v1; localStorage `devdev:*` namespace | Auth + Firestore later. |

## Component hierarchy (strict)

```
primitives/      atomic, no dependencies. Button, Tag, Icon, StatPill, Tooltip.
   ↓
capsule/         depend on primitives. CapsuleHero / CapsuleCatalog / CapsuleMini / CapsuleSkeleton.
   ↓
carousel/        HeroCarousel, ScreenshotCarousel.
   ↓
game-detail/     compose primitives + capsule. GameHero, GameAbout, GameStats, etc.
   ↓
layout/          BaseLayout, TopNav, Footer, ContentSection.
   ↓
islands/         interactive (ship JS). LiveCounter, BackgroundShader, WishlistToggle.
```

Rule: components may import from layers above them in this list, never below.

## Data flow

```
Each game's deploy
   └── /manifest.json  (Zod-shape; published by the game)
                ↓
   scripts/fetch-manifests.ts  (runs prebuild)
                ↓
   src/content/games/_generated/<slug>.json
                ↓
   astro:content  (Zod-validates again at build)
                ↓
   src/pages/games/[slug].astro  (renders detail page)
   src/pages/index.astro         (renders home grid)
   src/pages/library.astro       (renders library grid)
```

If a game's manifest is malformed or its server is down at build time, the build:
1. Falls back to the last cached `_generated/<slug>.json` if present.
2. Logs a loud warning.
3. Fails CI if no cache exists.

## Per-game theming

Each game's manifest provides `accentColor: '#rrggbb'` and `darkColor: '#rrggbb'`.

The detail page sets these as CSS custom properties on `:root`:

```css
:root[data-game="bloodvolt"] {
  --accent: #00f0ff;
  --bg-game: #080c12;
}
```

All components consume `var(--accent)` rather than hard-coding colors. Result: same
template, distinct visual identity per game.

## What this codebase explicitly does NOT do (yet)

- No SSR / no Node server in production.
- No authentication / no user accounts.
- No payments / cart / checkout.
- No real-time features (live player counts are synthetic v1).
- No CMS / no admin panel — game manifests are the only content surface.
- No bundler complexity beyond Astro's defaults.

These all have a designated future phase but are not in scope for v1.
