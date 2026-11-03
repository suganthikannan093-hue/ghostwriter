import { NextResponse } from "next/server";
import { InputSchema } from "@/lib/schema";
import { LlmError, isDemo, resurrect } from "@/lib/llm";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET() {
  return NextResponse.json({ demo: isDemo() });
}

export async function POST(req: Request) {
  const raw = await req.json().catch(() => null);
  const parsed = InputSchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  try {
    const demo = Boolean(raw && typeof raw === "object" && (raw as { demo?: boolean }).demo);
    return NextResponse.json(await resurrect(parsed.data, { demo }));
  } catch (e) {
    const status = e instanceof LlmError ? e.status : 500;
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status });
  }
}
