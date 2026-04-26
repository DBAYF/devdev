// src/lib/manifest-fetch.ts — runtime helper used by build scripts.
// Fetches a game's /manifest.json, validates with Zod, returns typed data.

import { gameManifestSchema, type GameManifest } from '../types/game-manifest';

export interface FetchResult {
  readonly ok: boolean;
  readonly manifest?: GameManifest;
  readonly errors?: string[];
  readonly fetchedAt: number;
}

export async function fetchManifest(url: string, timeoutMs = 10_000): Promise<FetchResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: 'follow' });
    if (!res.ok) {
      return { ok: false, errors: [`HTTP ${res.status} ${res.statusText}`], fetchedAt: Date.now() };
    }
    const json: unknown = await res.json();
    const parsed = gameManifestSchema.safeParse(json);
    if (!parsed.success) {
      return {
        ok: false,
        errors: parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
        fetchedAt: Date.now(),
      };
    }
    return { ok: true, manifest: parsed.data, fetchedAt: Date.now() };
  } catch (err) {
    return {
      ok: false,
      errors: [err instanceof Error ? err.message : String(err)],
      fetchedAt: Date.now(),
    };
  } finally {
    clearTimeout(timer);
  }
}
