// @ts-check
import { defineConfig } from 'astro/config';

// devdev — Astro 5 config.
// Static-first; per-game accent themes via CSS variables; zero JS by default.
// Interactive components live under src/components/islands/ and opt into hydration.

export default defineConfig({
  site: 'https://devdev-games.web.app',
  trailingSlash: 'never',
  output: 'static',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  vite: {
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
        '@components': new URL('./src/components', import.meta.url).pathname,
        '@lib': new URL('./src/lib', import.meta.url).pathname,
        '@types': new URL('./src/types', import.meta.url).pathname,
        '@styles': new URL('./src/styles', import.meta.url).pathname,
        '@content': new URL('./src/content', import.meta.url).pathname,
        '@data': new URL('./src/data', import.meta.url).pathname,
      },
    },
  },
  experimental: {
    contentIntellisense: true,
  },
});
