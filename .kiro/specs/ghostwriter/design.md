# Design Document: GhostWriter

## Overview

A single Next.js 15 app. The browser posts notes to `/api/resurrect`; the server calls OpenAI `gpt-4o-mini` with a strict JSON schema (one call per resurrection) or falls back to an offline demo. Rendering of Kiro documents is a pure function shared by UI and zip export.

## Architecture

```mermaid
flowchart LR
  UI[GhostWriter.tsx] -- POST text/mode/stack --> API[/api/resurrect]
  API --> V[zod InputSchema]
  V --> L{key?}
  L -- yes --> O[OpenAI structured output] --> P[SpecSchema.parse]
  L -- no --> D[demoSpec]
  P --> S[sanitize]
  D --> S
  S --> UI
  UI --> M[markdown.ts: requirements/design/tasks/steering/hook]
  M --> Z[JSZip download]
```

## Components and Interfaces

- `lib/schema.ts` — zod input/output schemas + hand-written strict JSON schema.
- `lib/prompt.ts` — system prompt enforcing EARS, task/requirement links, small runnable starter.
- `lib/llm.ts` — `resurrect(input)`; retries 429/5xx; demo fallback.
- `lib/safe.ts` — path sanitising, dedupe, size caps.
- `lib/markdown.ts` — `requirementsMd`, `designMd`, `tasksMd`, `kiroFiles`, `allFiles`.
- `lib/demo.ts` — deterministic offline spec.
- `app/components/GhostWriter.tsx` — input panel, tombstone header, tabs, file tree, zip.

## Data Models

`Spec { projectName, slug, tagline, epitaph, revivalPlan, intro, stories[], design{}, tasks[], steering{}, files[] }`

## Error Handling

400 on invalid input, 401 on bad key, 422 on refusal, 502 on bad model output, 503 after retries. Errors are shown inline with `role="alert"`.

## Testing Strategy

Vitest unit tests for sanitising, rendering and demo flow, plus a property-style test that sanitised paths never contain `..`.
