# Deploy

## First-time Firebase setup (one-shot)

```bash
firebase login                          # if not already
firebase projects:create devdev-games   # or use Firebase Console UI
firebase use devdev-games
```

If a different project ID gets allocated, edit `.firebaserc` to match.

## Each subsequent deploy

```bash
npm run deploy
# = npm run validate (manifests) + astro build + firebase deploy --only hosting
```

The deploy step:

1. Validates every game manifest in `src/data/games-registry.ts` against the Zod schema.
2. Astro builds → `dist/`.
3. Firebase pushes `dist/` to Hosting.

Live URL: `https://devdev-games.web.app`.

## Branch / preview deploys (optional, free-tier)

```bash
firebase hosting:channel:deploy preview-<branch>
```

Generates a temporary URL that expires after 7 days. Useful for sharing WIP without
burning the production URL.

## Cache headers

Set in `firebase.json`:

- Fonts / WebP / MP4 / SVG / PNG: `public, max-age=31536000, immutable` (one year, fingerprinted)
- HTML: `public, max-age=600` (10 minutes)
- `/`: `public, max-age=0, must-revalidate` (always revalidate the entry)

Astro fingerprints all hashed assets, so the year-long cache on art is safe.

## Rollback

Firebase Hosting keeps every prior version:

```bash
firebase hosting:releases:list
firebase hosting:rollback
```
