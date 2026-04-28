// src/types/game-manifest.ts — pure Zod shape for game manifests.
// No Astro imports here so build scripts (tsx) can use it directly.
// The Astro content collection in src/content/config.ts re-exports this
// schema for build-time validation.

import { z } from 'zod';

const GENRE = z.enum([
  'Action',
  'Adventure',
  'Arena',
  'Casual',
  'Puzzle',
  'Racing',
  'Roguelite',
  'RPG',
  'Shooter',
  'Simulation',
  'Sports',
  'Strategy',
]);

const RATING = z.enum([
  'PEGI-3',
  'PEGI-7',
  'PEGI-12',
  'PEGI-16',
  'PEGI-18',
  'ESRB-E',
  'ESRB-T',
  'ESRB-M',
  'ESRB-AO',
]);

const HEX_COLOR = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'must be #rrggbb');

const SLUG = z
  .string()
  .regex(/^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/, 'lowercase, dash-separated, 3–32 chars');

const ABS_OR_PORTAL_PATH = z
  .string()
  .refine(
    (s) => s.startsWith('/games/') || /^https?:\/\//.test(s),
    'must be /games/<slug>/… or absolute https URL',
  );

export const gameManifestSchema = z.object({
  slug: SLUG,
  title: z.string().min(1).max(32),
  subtitle: z.string().max(48).optional(),
  tagline: z.string().min(1).max(120),
  description: z.string().min(30).max(600),

  genre: z.array(GENRE).min(1).max(4),
  tags: z.array(z.string().min(1).max(24)).max(8).default([]),
  rating: RATING,

  playUrl: z.string().url(),
  version: z.string().min(1).max(16),
  releaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'ISO-8601 date YYYY-MM-DD'),

  accentColor: HEX_COLOR,
  darkColor: HEX_COLOR,

  capsules: z.object({
    hero: ABS_OR_PORTAL_PATH,
    catalog: ABS_OR_PORTAL_PATH,
    mini: ABS_OR_PORTAL_PATH,
  }),

  screenshots: z.array(ABS_OR_PORTAL_PATH).min(3).max(8),
  trailerLoop: ABS_OR_PORTAL_PATH.optional(),

  stats: z.record(z.string().min(1).max(24), z.union([z.number(), z.string()])).default({}),

  features: z
    .object({
      multiplayer: z.boolean().default(false),
      controller: z.boolean().default(false),
      mobile: z.boolean().default(false),
      ageGate: z.boolean().default(false),
      freeToPlay: z.boolean().default(true),
    })
    .default({}),

  weeklyEvent: z
    .object({
      name: z.string().min(1).max(48),
      until: z.string().datetime(),
    })
    .optional(),

  // Credit / signature. Shown in the detail-page meta block.
  author: z.string().min(1).max(48).optional(),

  // Optional showcases — games that don't supply these get a smaller detail page.
  classShowcase: z
    .array(
      z.object({
        id: z.string().min(1).max(32),
        name: z.string().min(1).max(32),
        role: z.string().min(1).max(24),
        weapon: z.string().min(1).max(48),
        color: HEX_COLOR,
        bio: z.string().max(140).optional(),
      }),
    )
    .max(12)
    .optional(),

  achievements: z
    .array(
      z.object({
        id: z.string().min(1).max(40),
        name: z.string().min(1).max(40),
        desc: z.string().min(1).max(140),
        kind: z
          .enum(['kills', 'survival', 'damage', 'rank', 'class', 'social', 'streak'])
          .optional(),
        target: z.number().int().positive().optional(),
        rare: z.boolean().default(false),
      }),
    )
    .max(48)
    .optional(),

  // Live in-game patch list, optional. Most recent first.
  changelog: z
    .array(
      z.object({
        version: z.string().min(1).max(24),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        summary: z.string().min(1).max(240),
        highlights: z.array(z.string().min(1).max(140)).max(12).default([]),
      }),
    )
    .max(40)
    .optional(),
});

export type GameManifest = z.infer<typeof gameManifestSchema>;

export const newsSchema = z.object({
  title: z.string().min(1).max(120),
  game: SLUG,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  summary: z.string().min(1).max(280),
  pinned: z.boolean().default(false),
});
