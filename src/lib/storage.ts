// src/lib/storage.ts — browser-only localStorage wrapper. Namespaced under devdev:*
// so games hosted on other origins can't collide with us.
//
// All access is guarded — works at build time (no window) by no-op'ing.

const NS = 'devdev:';

function safeStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readJSON<T>(key: string, fallback: T): T {
  const ls = safeStorage();
  if (!ls) return fallback;
  try {
    const raw = ls.getItem(NS + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  const ls = safeStorage();
  if (!ls) return;
  try {
    ls.setItem(NS + key, JSON.stringify(value));
  } catch {
    /* quota; intentional swallow */
  }
}

export function remove(key: string): void {
  const ls = safeStorage();
  if (!ls) return;
  try {
    ls.removeItem(NS + key);
  } catch {
    /* */
  }
}

// ────── Typed accessors (extend as features land) ──────
export const wishlist = {
  read: (): string[] => readJSON<string[]>('wishlist', []),
  add: (slug: string): void => {
    const cur = wishlist.read();
    if (!cur.includes(slug)) writeJSON('wishlist', [...cur, slug]);
  },
  remove: (slug: string): void => {
    writeJSON(
      'wishlist',
      wishlist.read().filter((s) => s !== slug),
    );
  },
  has: (slug: string): boolean => wishlist.read().includes(slug),
};

export const lastPlayed = {
  mark: (slug: string): void => writeJSON(`lastPlayed:${slug}`, Date.now()),
  get: (slug: string): number | null => readJSON<number | null>(`lastPlayed:${slug}`, null),
};
