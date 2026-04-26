// src/lib/routes.ts — typed route helpers. Use these everywhere; never hand-build URLs.

export const route = {
  home: () => '/',
  library: () => '/library',
  news: () => '/news',
  profile: () => '/profile',
  about: () => '/about',
  game: (slug: string) => `/games/${slug}`,
} as const;
