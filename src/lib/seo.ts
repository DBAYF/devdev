// src/lib/seo.ts — Open Graph / Twitter card helpers.

import type { GameManifest } from '../types/game-manifest';

export interface SeoProps {
  readonly title: string;
  readonly description: string;
  readonly image?: string;
  readonly canonical?: string;
}

export function gameSeo(manifest: GameManifest, base: string): SeoProps {
  return {
    title: `${manifest.title} — devdev`,
    description: manifest.tagline,
    image: absUrl(manifest.capsules.hero, base),
    canonical: `${base.replace(/\/$/, '')}/games/${manifest.slug}`,
  };
}

export function homeSeo(base: string): SeoProps {
  return {
    title: 'devdev — indie games portal',
    description: 'Indie games portal. First title: BLOODVOLT v1.0 ULTIMATE.',
    canonical: base,
  };
}

function absUrl(maybeRelative: string, base: string): string {
  if (/^https?:\/\//.test(maybeRelative)) return maybeRelative;
  return `${base.replace(/\/$/, '')}${maybeRelative}`;
}
