import { SpecSchema, specJsonSchema, type ResurrectInput, type ResurrectResponse } from "./schema";
import { SYSTEM_PROMPT, userPrompt } from "./prompt";
import { demoSpec } from "./demo";
import { sanitize } from "./safe";

export class LlmError extends Error {
  constructor(message: string, public status = 502) { super(message); }
}

export const isDemo = (env: NodeJS.ProcessEnv = process.env) => env.GHOSTWRITER_MODE === "demo" || !env.OPENAI_API_KEY;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function resurrect(input: ResurrectInput, opts: { demo?: boolean } = {}): Promise<ResurrectResponse> {
  const t0 = Date.now();
  if (opts.demo || isDemo()) return { spec: sanitize(demoSpec(input)), source: "demo", model: "offline-demo", ms: Date.now() - t0 };

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const body = JSON.stringify({
    model, temperature: 0.4, max_tokens: 6000,
    messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: userPrompt(input) }],
    response_format: { type: "json_schema", json_schema: { name: "resurrected_spec", strict: true, schema: specJsonSchema } },
  });
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body, signal: AbortSignal.timeout(120_000),
    });
    if ((res.status === 429 || res.status >= 500) && attempt < 2) { await sleep(1500 * 2 ** attempt); continue; }
    if (!res.ok) throw new LlmError(`OpenAI error ${res.status}: ${(await res.text()).slice(0, 200)}`, res.status === 401 ? 401 : 502);
    const json = await res.json();
    const choice = json?.choices?.[0];
    if (choice?.finish_reason === "length") throw new LlmError("The spirit spoke too long (output cut off). Try shorter notes.");
    if (choice?.message?.refusal) throw new LlmError("The model refused this input.", 422);
    const parsed = SpecSchema.safeParse(JSON.parse(String(choice?.message?.content ?? "{}")));
    if (!parsed.success) throw new LlmError("Model returned an invalid spec shape.");
    return { spec: sanitize(parsed.data), source: "openai", model, ms: Date.now() - t0 };
  }
  throw new LlmError("OpenAI is busy (429/5xx). Try again shortly.", 503);
}
