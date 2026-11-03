import type { ResurrectInput, Spec } from "./schema";
import { slugify } from "./safe";

/** Offline demo: deterministic resurrection so the UI works with no API key. */
export function demoSpec(i: ResurrectInput): Spec {
  const first = i.text.split(/\n/).map((l) => l.trim()).find(Boolean) ?? "Lost Idea";
  const name = first.replace(/[#*>`-]/g, "").trim().split(/\s+/).slice(0, 4).join(" ").replace(/\s+(for|a|an|the|of|to|and|with)$/i, "") || "Lost Idea";
  const projectName = `${name} Reborn`;
  const slug = slugify(projectName);
  return {
    projectName, slug,
    tagline: "Back from the dead, now with a spec and a test suite.",
    epitaph: i.mode === "legacy" ? "Here lies a technology the world outgrew before it finished loading." : "Here lies an idea that died in a notes app, waiting for a weekend that never came.",
    revivalPlan: "GhostWriter extracted the core intent from the notes, turned it into EARS requirements, and generated a small typed starter so Kiro can implement the tasks one by one.",
    intro: `This spec resurrects the following notes into a buildable product:\n\n> ${i.text.slice(0, 280).replace(/\n/g, " ")}`,
    stories: [
      { title: "Capture items", story: "As a user, I want to add an item with a title, so that my ideas are saved.", criteria: ["WHEN the user submits a non-empty title THEN the system SHALL store the item and show it in the list", "IF the title is empty THEN the system SHALL reject it and show a validation message"] },
      { title: "List and complete", story: "As a user, I want to mark items done, so that I can track progress.", criteria: ["WHEN the user toggles an item THEN the system SHALL flip its done state", "The system SHALL list open items before completed ones"] },
      { title: "Persist", story: "As a user, I want my items to survive a restart, so that nothing dies again.", criteria: ["WHEN the app starts THEN the system SHALL load previously saved items", "IF stored data is corrupt THEN the system SHALL start with an empty list and log a warning"] },
    ],
    design: {
      overview: `${projectName} is a minimal, typed item tracker generated as a starting point.`,
      architecture: "```mermaid\nflowchart LR\n  UI[CLI / UI] --> Core[core.ts]\n  Core --> Store[(JSON file)]\n```",
      components: [{ name: "core.ts", responsibility: "Pure functions to add, toggle and sort items." }, { name: "store.ts", responsibility: "Load/save items as JSON." }, { name: "index.ts", responsibility: "Entry point wiring input to core." }],
      dataModel: "`Item { id: string; title: string; done: boolean; createdAt: string }`",
      errorHandling: "Validation errors are returned as values; corrupt storage falls back to an empty list.",
      testing: "Vitest unit tests for core functions; property-style test that sorting never loses items.",
    },
    tasks: [
      { title: "Set up project and Item type", details: ["Create package.json and tsconfig", "Define Item interface"], requirements: ["1.1"] },
      { title: "Implement addItem with validation", details: ["Reject empty titles"], requirements: ["1.1", "1.2"] },
      { title: "Implement toggle and sort", details: ["Open items first"], requirements: ["2.1", "2.2"] },
      { title: "Add JSON persistence", details: ["Fallback on corrupt file"], requirements: ["3.1", "3.2"] },
      { title: "Write unit tests", details: ["Cover each acceptance criterion"], requirements: ["1.1", "2.1", "3.2"] },
    ],
    steering: {
      product: `- ${projectName}: a resurrected idea\n- Users: solo makers\n- Keep scope tiny; ship the core loop first`,
      tech: "- TypeScript strict, Node 20\n- Vitest for tests\n- No runtime dependencies",
      structure: "- src/core.ts pure logic\n- src/store.ts I/O\n- src/index.ts entry\n- tests/*.test.ts",
    },
    files: [
      { path: "package.json", content: JSON.stringify({ name: slug, version: "0.1.0", type: "module", scripts: { start: "tsx src/index.ts", test: "vitest run" }, devDependencies: { tsx: "^4.19.0", typescript: "^5.6.0", vitest: "^2.1.0" } }, null, 2) },
      { path: "README.md", content: `# ${projectName}\n\nResurrected by GhostWriter (demo mode).\n\n\`\`\`bash\nnpm install\nnpm start -- add "my first item"\nnpm test\n\`\`\`\n\nOpen this folder in Kiro: the spec lives in \`.kiro/specs/${slug}\`.\n` },
      { path: "src/core.ts", content: `export interface Item { id: string; title: string; done: boolean; createdAt: string }\n\nexport function addItem(items: Item[], title: string, now = new Date()): Item[] | { error: string } {\n  const t = title.trim();\n  if (!t) return { error: "Title is required" };\n  return [...items, { id: String(items.length + 1), title: t, done: false, createdAt: now.toISOString() }];\n}\n\nexport function toggle(items: Item[], id: string): Item[] {\n  return items.map((i) => (i.id === id ? { ...i, done: !i.done } : i));\n}\n\nexport function sorted(items: Item[]): Item[] {\n  return [...items.filter((i) => !i.done), ...items.filter((i) => i.done)];\n}\n` },
      { path: "src/store.ts", content: `import { existsSync, readFileSync, writeFileSync } from "node:fs";\nimport type { Item } from "./core";\n\nconst FILE = "items.json";\n\nexport function load(): Item[] {\n  if (!existsSync(FILE)) return [];\n  try { return JSON.parse(readFileSync(FILE, "utf8")); }\n  catch { console.warn("Corrupt store, starting fresh"); return []; }\n}\n\nexport function save(items: Item[]): void {\n  writeFileSync(FILE, JSON.stringify(items, null, 2));\n}\n` },
      { path: "src/index.ts", content: `import { addItem, sorted, toggle } from "./core";\nimport { load, save } from "./store";\n\nconst [cmd, ...rest] = process.argv.slice(2);\nlet items = load();\nif (cmd === "add") {\n  const r = addItem(items, rest.join(" "));\n  if ("error" in r) { console.error(r.error); process.exit(1); }\n  items = r;\n} else if (cmd === "done") items = toggle(items, rest[0]);\nsave(items);\nfor (const i of sorted(items)) console.log(\`\${i.done ? "[x]" : "[ ]"} \${i.id}. \${i.title}\`);\n` },
      { path: "tests/core.test.ts", content: `import { describe, expect, it } from "vitest";\nimport { addItem, sorted, toggle, type Item } from "../src/core";\n\ndescribe("core", () => {\n  it("rejects empty titles", () => expect(addItem([], "  ")).toEqual({ error: "Title is required" }));\n  it("adds and toggles", () => {\n    const items = addItem([], "ghost") as Item[];\n    expect(toggle(items, "1")[0].done).toBe(true);\n  });\n  it("sort never loses items", () => {\n    let items: Item[] = [];\n    for (let n = 0; n < 20; n++) items = addItem(items, "x" + n) as Item[];\n    items = toggle(items, "3");\n    expect(sorted(items)).toHaveLength(20);\n  });\n});\n` },
    ],
  };
}
