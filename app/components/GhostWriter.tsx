"use client";
import { useEffect, useMemo, useState } from "react";
import JSZip from "jszip";
import type { ResurrectResponse } from "@/lib/schema";
import { MAX_INPUT, MIN_INPUT } from "@/lib/schema";
import { allFiles, designMd, requirementsMd, tasksMd } from "@/lib/markdown";
import { bundleMd } from "@/lib/bundle";

const SAMPLES: Record<string, { mode: "idea" | "legacy"; text: string }> = {
  "📓 Abandoned notes": { mode: "idea", text: "plant swap app??\n- neighbours list cuttings they have\n- map? or just zip code\n- 'trade' button, chat maybe\n- remind me to water lol\nstarted in 2019, never got past the login page" },
  "💾 Dead tech: GeoCities guestbook": { mode: "legacy", text: "<!-- my 1999 guestbook -->\n<form action=\"/cgi-bin/guestbook.pl\" method=POST>\nName: <input name=name> Message: <textarea name=msg></textarea>\n<input type=submit value=\"Sign my guestbook!\">\n</form>\n<marquee>You are visitor #000123</marquee>" },
  "📼 Dead tech: Winamp playlists": { mode: "legacy", text: "Winamp .m3u playlists + skins. I want my old playlists back, playable from a modern browser, with shareable skins and a visualizer." },
};

type Tab = "requirements" | "design" | "tasks" | "code";

export default function GhostWriter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"idea" | "legacy">("idea");
  const [stack, setStack] = useState("nextjs");
  const [serverDemo, setServerDemo] = useState<boolean | null>(null);
  const [forceDemo, setForceDemo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [res, setRes] = useState<ResurrectResponse | null>(null);
  const [tab, setTab] = useState<Tab>("requirements");
  const [file, setFile] = useState("");

  useEffect(() => { fetch("/api/resurrect").then((r) => r.json()).then((j) => setServerDemo(j.demo)).catch(() => setServerDemo(true)); }, []);

  const files = useMemo(() => (res ? allFiles(res.spec) : {}), [res]);
  const paths = useMemo(() => Object.keys(files).sort((a, b) => (a.startsWith(".kiro") === b.startsWith(".kiro") ? a.localeCompare(b) : a.startsWith(".kiro") ? -1 : 1)), [files]);

  async function go() {
    setLoading(true); setErr("");
    try {
      const r = await fetch("/api/resurrect", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, mode, stack, demo: forceDemo }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || `Request failed (${r.status})`);
      setRes(j); setTab("requirements"); setFile(Object.keys(allFiles(j.spec)).find((p) => !p.startsWith(".kiro")) ?? "");
    } catch (e) { setErr(e instanceof Error ? e.message : String(e)); }
    finally { setLoading(false); }
  }

  async function download() {
    if (!res) return;
    const zip = new JSZip();
    const root = zip.folder(res.spec.slug)!;
    for (const [p, c] of Object.entries(files)) root.file(p, c);
    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${res.spec.slug}.zip`; a.click();
  }

  function downloadBundle() {
    if (!res) return;
    const blob = new Blob([bundleMd(res.spec)], { type: "text/markdown" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${res.spec.slug}-bundle.md`; a.click();
  }

  const demoActive = forceDemo || serverDemo;
  const doc = res ? (tab === "requirements" ? requirementsMd(res.spec) : tab === "design" ? designMd(res.spec) : tasksMd(res.spec)) : "";

  return (
    <div className="wrap">
      <header className="top">
        <div className="logo" aria-hidden>👻</div>
        <div><h1>Ghost<span>Writer</span></h1><p className="sub">Resurrect abandoned ideas &amp; dead tech into Kiro specs and a runnable starter.</p></div>
        {serverDemo !== null && <span className={`badge ${demoActive ? "demo" : "live"}`}>{demoActive ? "DEMO MODE · offline, no AI" : "LIVE · OpenAI gpt-4o-mini"}</span>}
      </header>
      <div className="grid">
        <section className="panel" aria-label="Input">
          <label>What are we resurrecting?</label>
          <div className="seg">
            <button className={mode === "idea" ? "on" : ""} onClick={() => setMode("idea")}>📓 Abandoned idea</button>
            <button className={mode === "legacy" ? "on" : ""} onClick={() => setMode("legacy")}>💾 Dead tech</button>
          </div>
          <label htmlFor="notes">Paste the remains</label>
          <textarea id="notes" value={text} onChange={(e) => setText(e.target.value)} placeholder="Old notes, a README you never finished, a snippet of Flash/Perl/jQuery…" maxLength={MAX_INPUT} />
          <div className={`counter ${text.length > MAX_INPUT * 0.9 ? "warn" : ""}`}>
            <span>{text.length} / {MAX_INPUT} characters</span>
            <span>{text.trim().length >= MIN_INPUT ? "✓" : `${MIN_INPUT - text.trim().length} to go`}</span>
          </div>
          {text.trim().length < MIN_INPUT && text.length > 0 && <p className="hint warn">Add at least {MIN_INPUT - text.trim().length} more character{MIN_INPUT - text.trim().length === 1 ? "" : "s"} to resurrect this idea.</p>}
          {text.length > MAX_INPUT && <p className="hint warn">Input is too long — trim it to {MAX_INPUT} characters or fewer.</p>}
          {text.trim().length >= MIN_INPUT && text.length <= MAX_INPUT && <p className="hint ok">Ready to summon.</p>}
          <div className="row">{Object.entries(SAMPLES).map(([k, v]) => <button key={k} onClick={() => { setText(v.text); setMode(v.mode); }}>{k}</button>)}</div>
          <label htmlFor="stack">Starter stack</label>
          <select id="stack" value={stack} onChange={(e) => setStack(e.target.value)}>
            <option value="nextjs">Next.js + TypeScript</option><option value="node-cli">Node.js CLI (TypeScript)</option><option value="python-fastapi">Python FastAPI</option>
          </select>
          {!serverDemo && <label style={{ textTransform: "none", letterSpacing: 0 }}><input type="checkbox" checked={forceDemo} onChange={(e) => setForceDemo(e.target.checked)} /> Use offline demo mode (no API call)</label>}
          <button className="primary" onClick={go} disabled={loading || text.trim().length < MIN_INPUT || text.length > MAX_INPUT}>{loading ? <><span className="spin">🕯️</span> Summoning…</> : "⚡ Resurrect"}</button>
          {err && <p className="err" role="alert">{err}</p>}
          <p className="muted">Output is a Kiro-ready project: <code>.kiro/specs</code>, <code>.kiro/steering</code>, a hook, and starter code.</p>
        </section>
        <section className="panel" aria-label="Result">
          {!res ? (
            <div className="empty"><div className="big">🪦</div><p>Nothing has risen yet. Paste some remains and press <b>Resurrect</b>.</p></div>
          ) : (
            <>
              <div className="tomb">
                <h2>{res.spec.projectName}</h2>
                <div>{res.spec.tagline}</div>
                <p className="epi">⚰️ {res.spec.epitaph}</p>
                <div className="muted">{res.source === "demo" ? "Demo mode (offline template)" : `Generated by ${res.model}`} · {(res.ms / 1000).toFixed(1)}s · {res.spec.stories.length} requirements · {res.spec.tasks.length} tasks · {paths.length} files</div>
                <div className="row"><button onClick={download}>⬇️ Download {res.spec.slug}.zip</button><button onClick={() => navigator.clipboard.writeText(doc || files[file] || "")}>📋 Copy current</button><button onClick={downloadBundle}>📄 Download bundle (.md)</button></div>
              </div>
              <div className="tabs" role="tablist">
                {(["requirements", "design", "tasks", "code"] as Tab[]).map((t) => <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t === "code" ? "Starter code" : `${t}.md`}</button>)}
              </div>
              {tab !== "code" ? <pre className="doc">{doc}</pre> : (
                <div className="code">
                  <div className="tree">{paths.map((p) => <button key={p} className={file === p ? "on" : ""} onClick={() => setFile(p)}>{p.startsWith(".kiro") ? <span className="k">{p}</span> : p}</button>)}</div>
                  <pre className="doc">{files[file] ?? "Select a file"}</pre>
                </div>
              )}
            </>
          )}
        </section>
      </div>
      <footer>Built with Kiro specs, steering &amp; hooks · MIT licensed · GhostWriter never stores your notes.</footer>
    </div>
  );
}
