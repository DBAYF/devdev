# Component Guide

Where to put what. The atomic-design-ish hierarchy below is enforced by import boundaries
— biome's `noRestrictedImports` rule blocks upward imports from primitives.

## Layers

| Layer | Folder | Imports allowed from | Examples |
|---|---|---|---|
| **primitives** | `src/components/primitives/` | nothing else in `components/` | Button, Tag, Icon, StatPill, Tooltip |
| **capsule** | `src/components/capsule/` | primitives | CapsuleHero, CapsuleCatalog, CapsuleMini |
| **carousel** | `src/components/carousel/` | primitives, capsule | HeroCarousel, ScreenshotCarousel |
| **game-detail** | `src/components/game-detail/` | primitives, capsule, carousel | GameHero, GameAbout, GameStats, PlayButton |
| **layout** | `src/components/layout/` | any non-island | BaseLayout, TopNav, Footer, ContentSection |
| **islands** | `src/components/islands/` | any | LiveCounter, BackgroundShader, WishlistToggle |

## Decision flow

```
Need a button / pill / icon?            → primitives/
Need a capsule card at any size?         → capsule/
Need an image carousel / slider?         → carousel/
Need something only the game-detail page uses?  → game-detail/
Need site chrome (nav, footer, layout)?  → layout/
Does it ship JS to the browser?          → islands/
```

## Naming

- **PascalCase** filenames matching the export.
- **One component per file.** No barrel re-exports beyond `types/index.ts`.
- Component file extensions: `.astro` for static, `.ts`+ `<script>` block for islands.

## Props

- All component props typed via `interface Props { … }`.
- Optional props get defaults at the destructure site, never `??` inside JSX.
- Slots with `<slot />`; named slots only when ≥ 2.

## Styling

- Scoped `<style>` per component (Astro auto-scopes).
- Reach for design tokens (`var(--space-3)`, `var(--accent)`) before custom values.
- Global styles only for resets and tokens.

## Islands — when to ship JS

Default to zero-JS. Reach for an island only when:

1. The interaction can't be expressed via CSS (`:hover`, `details/summary`, etc.)
2. The data must be fresh on each pageview (live counters, time-to-event)
3. WebGL is involved (Three.js backdrops)

Pick the lightest hydration directive that works:

| Directive | Use when |
|---|---|
| `client:idle` | Default — runs after browser idle. Most islands. |
| `client:visible` | Heavy components below the fold (Three.js backdrops). |
| `client:load` | Critical above-the-fold interactivity only. |
| `client:media="(min-width: 768px)"` | Desktop-only widgets. |
