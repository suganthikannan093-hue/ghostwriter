# How GhostWriter was built with Kiro

## Spec-driven development
- `.kiro/specs/ghostwriter/` — core spec (requirements → design → tasks) for the resurrection engine.
- `.kiro/specs/spec-bundle-export/` — second spec, **authored and implemented by Kiro CLI** (session log: `docs/kiro-logs/session-01-spec-bundle-export.log`). EARS acceptance criteria, mermaid design, 10 tasks all checked off.

## Steering
`.kiro/steering/product.md`, `tech.md`, `structure.md` give Kiro persistent context; Kiro refreshed `structure.md` to cover `lib/bundle.ts`.

## Agent hooks
`.kiro/hooks/`: `lint-on-save`, `test-on-save`, `schema-guard`, `update-readme`, and Kiro-written `spec-sync` (reminds to update tasks.md when `lib/*.ts` changes).

## Vibe vs spec coding
The initial scaffold and UI were explored conversationally (vibe coding). Features with clear acceptance criteria were done spec-first: Kiro wrote requirements/design/tasks, then implemented each task and ran tests/typecheck/lint itself.

## Features Kiro wrote
1. `lib/bundle.ts` + "Download bundle (.md)" button: one markdown file with TOC combining requirements, design, tasks and steering. Tests: `tests/bundle.test.ts` (7 tests).
2. Live character counter and too-short/too-long validation feedback, using `MIN_INPUT`/`MAX_INPUT` from `lib/schema.ts`.

Verification: 14/14 tests, typecheck, lint, and `next build` pass.
