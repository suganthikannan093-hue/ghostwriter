---
inclusion: fileMatch
fileMatchPattern: "{app,lib,tests}/**/*.{ts,tsx}"
---

# Structure

- `app/` — routes and UI (`app/components/GhostWriter.tsx`, `app/api/resurrect/route.ts`).
- `lib/` — pure logic; no React imports. Rendering of Kiro docs lives only in `lib/markdown.ts`.
- `tests/` — Vitest, one file per lib area; import via `@/lib/...`.
- New output fields: update `SpecSchema` AND `specJsonSchema` AND `demoSpec` together.
