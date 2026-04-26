---
title: "devdev portal goes live"
game: bloodvolt
date: "2026-04-25"
summary: "An indie games portal, built static-first on Firebase Hosting. One game today; the architecture is ready for many more."
pinned: false
---

devdev launched today as a single-game portal showcasing BLOODVOLT v1.0 ULTIMATE.
The architecture is the pitch as much as the catalog: every game on devdev is its
own self-contained deploy, publishing a `manifest.json` at its root. The portal
fetches that manifest at build time, validates it with a Zod schema, and renders a
themed detail page from one template. Adding game N is three steps with zero
portal-code changes.

No backend. No accounts. No tracking. Just static pages and the games themselves.
That keeps the surface tiny, the deploy fast, and the bills at zero.

What's coming: real screenshot captures replacing the procedural placeholder art,
Firebase Auth + Firestore for cross-game profiles and achievements, and game two —
TBA. Watch this feed.
