---
inclusion: always
---

# Tech

- Next.js 15 App Router, React 19, TypeScript strict, zod, JSZip, Vitest.
- LLM: OpenAI `gpt-4o-mini` via fetch with `response_format: json_schema` strict. One call per resurrection; keep prompts short (budget is tiny).
- Retry only on 429/5xx, max 2 retries, exponential backoff.
- Never log, echo or commit secrets. `.env` is gitignored; `.env.example` documents vars.
- Commands: `npm run dev` (port 3300), `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`.
