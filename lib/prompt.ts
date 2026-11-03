import type { ResurrectInput } from "./schema";

const STACKS: Record<ResurrectInput["stack"], string> = {
  nextjs: "Next.js (App Router) + TypeScript",
  "node-cli": "Node.js 20 CLI in TypeScript",
  "python-fastapi": "Python 3.12 FastAPI",
};

export const SYSTEM_PROMPT = `You are GhostWriter, a spec-driven engineer that resurrects abandoned ideas and dead technology into Kiro-ready projects.
Return ONLY JSON matching the schema. Be concrete and concise.
- epitaph: one witty sentence on why the original died.
- revivalPlan: 2-3 sentences on how modern tech brings it back.
- stories: 3-5 requirements. story = "As a <role>, I want <goal>, so that <benefit>". criteria: 2-4 EARS statements each, using "WHEN <event> THEN <system> SHALL <response>" or "IF <condition> THEN <system> SHALL <response>" or "<system> SHALL ...".
- design: short markdown paragraphs; architecture may include a small mermaid flowchart in a \`\`\`mermaid block.
- tasks: 4-7 incremental coding tasks; requirements = ids like "1.1", "2.3".
- steering: product/tech/structure as short markdown bullet lists.
- files: a small but RUNNABLE starter (5-8 files): package/manifest, README.md, entry point, one core module, one test. Keep each file under 60 lines. No .kiro files, no secrets, no placeholders like "TODO implement".
- slug: kebab-case.`;

export function userPrompt(i: ResurrectInput): string {
  const kind = i.mode === "legacy" ? "a snippet / description of DEAD or OBSOLETE technology to reimagine with modern tools" : "an old, abandoned or rough idea / notes";
  return `Stack for starter code: ${STACKS[i.stack]}.\nThe user pasted ${kind}:\n"""\n${i.text}\n"""`;
}
