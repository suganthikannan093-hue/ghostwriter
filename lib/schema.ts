import { z } from "zod";

export const MAX_INPUT = 8000;
export const InputSchema = z.object({
  text: z.string().trim().min(20, "Paste at least 20 characters of your old idea or code.").max(MAX_INPUT),
  mode: z.enum(["idea", "legacy"]).default("idea"),
  stack: z.enum(["nextjs", "node-cli", "python-fastapi"]).default("nextjs"),
});
export type ResurrectInput = z.infer<typeof InputSchema>;

const Story = z.object({ title: z.string(), story: z.string(), criteria: z.array(z.string()) });
const Task = z.object({ title: z.string(), details: z.array(z.string()), requirements: z.array(z.string()) });
const File = z.object({ path: z.string(), content: z.string() });

export const SpecSchema = z.object({
  projectName: z.string(),
  slug: z.string(),
  tagline: z.string(),
  epitaph: z.string(),
  revivalPlan: z.string(),
  intro: z.string(),
  stories: z.array(Story),
  design: z.object({
    overview: z.string(),
    architecture: z.string(),
    components: z.array(z.object({ name: z.string(), responsibility: z.string() })),
    dataModel: z.string(),
    errorHandling: z.string(),
    testing: z.string(),
  }),
  tasks: z.array(Task),
  steering: z.object({ product: z.string(), tech: z.string(), structure: z.string() }),
  files: z.array(File),
});
export type Spec = z.infer<typeof SpecSchema>;
export type Source = "openai" | "demo";
export interface ResurrectResponse { spec: Spec; source: Source; model: string; ms: number; }

/** Hand-written JSON schema for OpenAI strict structured outputs (all fields required, no extras). */
const s = { type: "string" } as const;
const arr = (items: object) => ({ type: "array", items });
const obj = (props: Record<string, object>) => ({ type: "object", additionalProperties: false, required: Object.keys(props), properties: props });
export const specJsonSchema = obj({
  projectName: s, slug: s, tagline: s, epitaph: s, revivalPlan: s, intro: s,
  stories: arr(obj({ title: s, story: s, criteria: arr(s) })),
  design: obj({ overview: s, architecture: s, components: arr(obj({ name: s, responsibility: s })), dataModel: s, errorHandling: s, testing: s }),
  tasks: arr(obj({ title: s, details: arr(s), requirements: arr(s) })),
  steering: obj({ product: s, tech: s, structure: s }),
  files: arr(obj({ path: s, content: s })),
});
