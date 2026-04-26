// src/data/nav.ts — top nav structure. Single source of truth.

export interface NavLink {
  readonly label: string;
  readonly href: string;
  readonly icon?: 'home' | 'library' | 'news' | 'profile' | 'about';
}

export const PRIMARY_NAV: readonly NavLink[] = [
  { label: 'HOME',    href: '/',         icon: 'home' },
  { label: 'LIBRARY', href: '/library',  icon: 'library' },
  { label: 'NEWS',    href: '/news',     icon: 'news' },
  { label: 'PROFILE', href: '/profile',  icon: 'profile' },
] as const;

export const FOOTER_NAV: readonly NavLink[] = [
  { label: 'About',    href: '/about' },
  { label: 'Press',    href: '/press' },
  { label: 'News',     href: '/news' },
] as const;
