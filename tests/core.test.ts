import { describe, expect, it } from "vitest";
import { demoSpec } from "@/lib/demo";
import { safePath, sanitize, slugify } from "@/lib/safe";
import { allFiles, requirementsMd, tasksMd } from "@/lib/markdown";
import { InputSchema, SpecSchema } from "@/lib/schema";
import { resurrect } from "@/lib/llm";

const input = InputSchema.parse({ text: "plant swap app for neighbours, never finished" });

describe("safe paths", () => {
  it("blocks traversal and absolute paths", () => {
    expect(safePath("../../etc/passwd")).toBe("etc/passwd");
    expect(safePath("/abs/x.ts")).toBe("abs/x.ts");
    expect(safePath("..")).toBeNull();
    expect(safePath(".kiro/hooks/evil.json")).toBeNull();
  });
  it("property: sanitized paths never contain '..' or start with '/'", () => {
    const junk = ["a/../b", "../../x", "/r", "./.././c", "d\\..\\e", "ok/file.ts"];
    for (let n = 0; n < 200; n++) {
      const p = Array.from({ length: 1 + (n % 4) }, (_, i) => junk[(n * 7 + i) % junk.length]).join("/");
      const s = safePath(p);
      if (s) { expect(s.split("/")).not.toContain(".."); expect(s.startsWith("/")).toBe(false); }
    }
  });
  it("slugifies", () => expect(slugify("Plant Swap!! Reborn")).toBe("plant-swap-reborn"));
});

describe("demo resurrection", () => {
  it("produces a valid spec with a .kiro folder", async () => {
    const r = await resurrect(input, { demo: true });
    expect(r.source).toBe("demo");
    expect(SpecSchema.safeParse(r.spec).success).toBe(true);
    const files = allFiles(r.spec);
    expect(Object.keys(files)).toEqual(expect.arrayContaining([`.kiro/specs/${r.spec.slug}/requirements.md`, ".kiro/steering/tech.md", ".kiro/hooks/spec-sync.json"]));
    expect(JSON.parse(files[".kiro/hooks/spec-sync.json"]).version).toBe("v1");
  });
  it("renders EARS criteria and task checkboxes", () => {
    const s = demoSpec(input);
    expect(requirementsMd(s)).toMatch(/WHEN .* THEN .* SHALL/);
    expect(tasksMd(s)).toMatch(/^- \[ \] 1\./m);
  });
  it("dedupes files and strips model-written .kiro files", () => {
    const s = demoSpec(input);
    const out = sanitize({ ...s, files: [...s.files, s.files[0], { path: ".kiro/x", content: "" }] });
    expect(out.files).toHaveLength(s.files.length);
  });
});

describe("input validation", () => {
  it("rejects tiny input", () => expect(InputSchema.safeParse({ text: "hi" }).success).toBe(false));
});
