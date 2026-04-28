// src/data/games-registry.ts — single source of truth for which games the portal
// knows about. Adding game N: add an entry here and ensure manifestUrl serves a
// valid /manifest.json. The build script fetches and validates each.
//
// Keep alphabetical by slug.

export interface GameRegistration {
  readonly slug: string;
  readonly manifestUrl: string;
  readonly featured?: boolean; // shown in home hero carousel
}

export const GAMES: readonly GameRegistration[] = [
  {
    slug: 'bloodvolt',
    manifestUrl: 'https://bldvolt.web.app/manifest.json',
    featured: true,
  },
  {
    slug: 'labforge-td',
    manifestUrl: 'https://labforge-td.web.app/manifest.json',
    featured: false,
  },
] as const;
