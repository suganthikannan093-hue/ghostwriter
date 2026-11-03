import type { Spec } from "./schema";

/** Render a spec into Kiro's three spec documents + steering + hook, keyed by path inside the zip. */
export function requirementsMd(s: Spec): string {
  const stories = s.stories.map((st, i) => [
    `### Requirement ${i + 1}: ${st.title}`, "", `**User Story:** ${st.story}`, "", "#### Acceptance Criteria", "",
    ...st.criteria.map((c, j) => `${j + 1}. ${c}`), "",
  ].join("\n"));
  return [`# Requirements Document`, "", `## Introduction`, "", s.intro, "", `> ⚰️ **Epitaph:** ${s.epitaph}`, "", `## Requirements`, "", ...stories].join("\n");
}

export function designMd(s: Spec): string {
  const d = s.design;
  return [
    `# Design Document: ${s.projectName}`, "", "## Overview", "", d.overview, "", "## Revival plan", "", s.revivalPlan, "",
    "## Architecture", "", d.architecture, "", "## Components and Interfaces", "",
    ...d.components.map((c) => `- **${c.name}** — ${c.responsibility}`), "",
    "## Data Models", "", d.dataModel, "", "## Error Handling", "", d.errorHandling, "", "## Testing Strategy", "", d.testing, "",
  ].join("\n");
}

export function tasksMd(s: Spec): string {
  const tasks = s.tasks.map((t, i) => [
    `- [ ] ${i + 1}. ${t.title}`, ...t.details.map((d) => `  - ${d}`),
    t.requirements.length ? `  - _Requirements: ${t.requirements.join(", ")}_` : "", "",
  ].filter((l, k, a) => l !== "" || k === a.length - 1).join("\n"));
  return ["# Implementation Plan", "", ...tasks].join("\n");
}

const steer = (title: string, body: string) => `---\ninclusion: always\n---\n\n# ${title}\n\n${body}\n`;

export function kiroFiles(s: Spec): Record<string, string> {
  const base = `.kiro/specs/${s.slug}`;
  return {
    [`${base}/requirements.md`]: requirementsMd(s),
    [`${base}/design.md`]: designMd(s),
    [`${base}/tasks.md`]: tasksMd(s),
    ".kiro/steering/product.md": steer("Product", s.steering.product),
    ".kiro/steering/tech.md": steer("Tech", s.steering.tech),
    ".kiro/steering/structure.md": steer("Structure", s.steering.structure),
    ".kiro/hooks/spec-sync.json": JSON.stringify({
      version: "v1",
      hooks: [{
        name: "Keep tasks.md in sync",
        description: "After Kiro edits source files, tick off completed tasks in the resurrected spec.",
        trigger: "PostFileSave",
        matcher: "^(src|app|lib)/",
        action: { type: "agent", prompt: `A source file changed. Review .kiro/specs/${s.slug}/tasks.md and mark any task that is now fully implemented as done ([x]). Do not change requirements.` },
      }],
    }, null, 2) + "\n",
  };
}

/** Every file that goes into the downloadable zip. */
export function allFiles(s: Spec): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of s.files) out[f.path] = f.content;
  return { ...out, ...kiroFiles(s) };
}
