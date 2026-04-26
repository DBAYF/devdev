# Adding a Game

The whole portal is designed so adding a new game requires **three steps and zero portal
code edits**. If you find yourself writing TypeScript or modifying components to add a
game, stop — something's been mis-architected.

## The three steps

### 1. The game serves `/manifest.json`

At the root of the game's deploy (e.g. `https://yourgame.web.app/manifest.json`), publish
a JSON file matching [`MANIFEST_SCHEMA.md`](MANIFEST_SCHEMA.md).

Validate locally before publishing:

```bash
# from the portal repo
npm run validate -- --url https://yourgame.web.app/manifest.json
```

### 2. Drop art into `public/games/<slug>/`

Required files (paths relative to the portal repo):

```
public/games/<slug>/
├── capsule-616x353.webp        ← featured/hero capsule
├── capsule-460x215.webp        ← catalog grid capsule
├── capsule-184x69.webp         ← mini list-row capsule
├── screenshot-01.webp          ← min 3, max 8 — 1920×1080 preferred
├── screenshot-02.webp
├── screenshot-03.webp
└── trailer-loop.mp4            ← optional; 6–10s seamless loop, ≤2 MB
```

Use WebP for stills, MP4 (H.264 + AAC) for trailer.

### 3. Register the slug

Add the game's slug to `src/data/games-registry.ts`:

```ts
export const GAMES = [
  { slug: 'bloodvolt',    manifestUrl: 'https://bldvolt.web.app/manifest.json' },
  { slug: 'your-new-game', manifestUrl: 'https://yourgame.web.app/manifest.json' },
] as const;
```

That's it. Run `npm run build` and the new game appears on home + library + gets its own
`/games/<slug>` detail page automatically.

## What you do NOT do

- Do not create a per-game Astro page. The single `[slug].astro` template handles every
  game.
- Do not write per-game CSS. Use the manifest's `accentColor` / `darkColor`; the template
  themes itself.
- Do not import the game's code into the portal. The portal launches games via `playUrl`
  (new tab); they're independent deployments.

## When to break the pattern

If a game truly needs custom UI (e.g. a game-specific stat panel that doesn't fit any
existing component), the right move is:

1. Add the new component under `src/components/game-detail/` with a `kind` discriminator.
2. Extend the manifest schema with an optional field that opts the game into it.
3. Update the schema doc.

Never add `if (slug === 'bloodvolt')` branches.
