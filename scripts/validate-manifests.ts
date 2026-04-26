// scripts/validate-manifests.ts — CI guard. Reads every src/content/games/*.json
// and re-validates with Zod. Catches: (a) cached files going stale relative to a
// schema bump; (b) hand-edited junk.
//
// Run via: npm run validate

import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gameManifestSchema } from '../src/types/game-manifest.ts';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const DIR = join(ROOT, 'src/content/games');

async function main(): Promise<void> {
  let files: string[];
  try {
    files = (await readdir(DIR)).filter((f) => f.endsWith('.json'));
  } catch {
    console.warn(`[validate] no ${DIR} yet — running fetch-manifests first…`);
    await import('./fetch-manifests.ts');
    return;
  }

  if (files.length === 0) {
    console.warn('[validate] no game manifests on disk; skipping');
    return;
  }

  let ok = true;
  for (const f of files) {
    const p = join(DIR, f);
    try {
      const raw = JSON.parse(await readFile(p, 'utf8')) as unknown;
      const parsed = gameManifestSchema.safeParse(raw);
      if (parsed.success) {
        console.log(`  ✔ ${f}`);
      } else {
        ok = false;
        console.error(`  ✖ ${f}`);
        for (const e of parsed.error.errors) {
          console.error(`     ${e.path.join('.')}: ${e.message}`);
        }
      }
    } catch (e) {
      ok = false;
      console.error(`  ✖ ${f} — could not read/parse: ${(e as Error).message}`);
    }
  }
  if (!ok) process.exitCode = 1;
}

main().catch((e: unknown) => {
  console.error(e);
  process.exitCode = 1;
});
