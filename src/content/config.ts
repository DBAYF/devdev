// src/content/config.ts — Astro Content Collections binding.
// The actual Zod shapes live in src/types/game-manifest.ts so build scripts can
// import them without dragging in `astro:content`.

import { defineCollection } from 'astro:content';
import { gameManifestSchema, newsSchema } from '../types/game-manifest';

export type { GameManifest } from '../types/game-manifest';

export const collections = {
  games: defineCollection({
    type: 'data',
    schema: gameManifestSchema,
  }),
  news: defineCollection({
    type: 'content',
    schema: newsSchema,
  }),
};
