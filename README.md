# devdev

Indie games portal. Static-first, Steam-like UI, free-tier Firebase Hosting.

**First title:** [BLOODVOLT v1.0 ULTIMATE](https://bldvolt.web.app) (Game One Ultimate).

## Quick start

```bash
nvm use            # Node 22 (see .nvmrc)
npm install
npm run dev        # http://localhost:4321
npm run build      # static output → dist/
npm run deploy     # build + push to Firebase Hosting
```

## What this is

- **Static** Astro 5 site, zero JS by default. Interactive widgets are explicit "islands"
  under `src/components/islands/`.
- **Per-game theming** via CSS custom properties — each game's `accentColor` from its
  manifest sets `--accent` at the page root. One template, infinite themes.
- **Highly scalable game onboarding** — adding game N is a 3-step checklist with zero
  portal code edits. See [`docs/ADDING_A_GAME.md`](docs/ADDING_A_GAME.md).
- **No backend** v1. localStorage only. Firebase Auth + Firestore land in a later phase
  for cross-game profile / achievements.

## Repo map (top level)

```
docs/        ← architectural truth — read before changing structure
public/      ← raw assets (capsules, screenshots, fonts, favicon)
src/
  pages/     ← Astro file-based routes
  components/← strict atomic hierarchy: primitives → capsule → game-detail → layout → islands
  content/   ← Astro Content Collections (Zod-validated)
  data/      ← cross-cutting registries (games, nav)
  lib/       ← framework-agnostic utilities
  styles/    ← tokens.css → reset.css → base.css
  types/     ← shared TypeScript types
scripts/     ← build hooks (manifest fetch, validation)
```

## Architecture invariants (do not violate)

1. **Primitives never know about games.** `src/components/primitives/` cannot import from
   `content/games`, `lib/manifest-fetch`, etc.
2. **Islands isolation.** Anything that ships JavaScript to the browser lives under
   `src/components/islands/` and uses `client:idle`/`client:visible`/`client:load`.
3. **Manifest is contract.** Each game serves `/manifest.json`. The Zod schema in
   `src/content/config.ts` is the source of truth — schema bump = portal version bump.
4. **One template, all games.** `src/pages/games/[slug].astro` renders every game's
   detail page. Game-specific layouts are forbidden.
5. **No global mutable state.** Cross-game data flows through `lib/storage.ts` only.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full ruleset.
