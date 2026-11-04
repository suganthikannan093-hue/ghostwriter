import { NextResponse } from "next/server";
import { InputSchema } from "@/lib/schema";
import { LlmError, isDemo, resurrect } from "@/lib/llm";
import { checkRate, clientIp, release, tryAcquire } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET() {
  return NextResponse.json({ demo: isDemo() });
}

export async function POST(req: Request) {
  const raw = await req.json().catch(() => null);
  const parsed = InputSchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  const demo = Boolean(raw && typeof raw === "object" && (raw as { demo?: boolean }).demo);
  const live = !demo && !isDemo();
  if (live) {
    const rate = checkRate(clientIp(req));
    if (!rate.ok) return NextResponse.json({ error: `Too many resurrections. Try again in ${rate.retryAfterSec}s, or use demo mode.` }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSec) } });
    if (!tryAcquire()) return NextResponse.json({ error: "The crypt is busy. Try again in a moment." }, { status: 503, headers: { "Retry-After": "5" } });
  }
  try {
    return NextResponse.json(await resurrect(parsed.data, { demo }));
  } catch (e) {
    const status = e instanceof LlmError ? e.status : 500;
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status });
  } finally {
    if (live) release();
  }
}
