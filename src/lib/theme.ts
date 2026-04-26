// src/lib/theme.ts — convert a game manifest's accent/dark colors into inline CSS
// custom properties. Used by [slug].astro to theme the page root per game.

import type { GameManifest } from '../types/game-manifest';

export function gameThemeStyle(manifest: GameManifest): string {
  return [
    `--accent: ${manifest.accentColor}`,
    `--accent-soft: ${manifest.accentColor}26`, // ~15% alpha
    `--bg-game: ${manifest.darkColor}`,
    `--bg-game-soft: ${manifest.darkColor}cc`,
  ].join('; ');
}
