// scripts/fetch-manifests.ts — runs prebuild.
// For every game in src/data/games-registry.ts:
//   1. Fetch its /manifest.json (with timeout)
//   2. Validate against Zod schema
//   3. Write to src/content/games/<slug>.json (Astro Content Collection picks it up)
//   4. On fail: warn, fall back to existing cached file if present, fail build only if
//      no cache exists.
//
// Run via: npm run fetch:manifests

import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GAMES } from '../src/data/games-registry.ts';
import { fetchManifest } from '../src/lib/manifest-fetch.ts';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const OUT_DIR = join(ROOT, 'src/content/games');

async function ensureDir(p: string): Promise<void> {
  await mkdir(p, { recursive: true });
}

async function processOne(reg: { slug: string; manifestUrl: string }): Promise<boolean> {
  const out = join(OUT_DIR, `${reg.slug}.json`);
  console.log(`[manifests] ${reg.slug} ← ${reg.manifestUrl}`);
  const res = await fetchManifest(reg.manifestUrl);

  if (res.ok && res.manifest) {
    await ensureDir(dirname(out));
    await writeFile(out, JSON.stringify(res.manifest, null, 2) + '\n', 'utf8');
    console.log(`  ✔ ${reg.slug} fetched + validated`);
    return true;
  }

  console.warn(`  ✖ ${reg.slug} FAILED: ${res.errors?.join('; ') ?? 'unknown'}`);

  if (existsSync(out)) {
    const cached = await readFile(out, 'utf8');
    console.warn(`  → falling back to cached ${out}`);
    // Sanity-check the cache parses; if not, the build will still fail.
    JSON.parse(cached);
    return true;
  }

  console.error(`  → no cache available for ${reg.slug} — build cannot proceed.`);
  return false;
}

async function main(): Promise<void> {
  const results = await Promise.all(GAMES.map(processOne));
  if (results.some((ok) => !ok)) {
    process.exitCode = 1;
  }
}

main().catch((e: unknown) => {
  console.error(e);
  process.exitCode = 1;
});
