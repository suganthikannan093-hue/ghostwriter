# Kiroween 2026 — submission notes

- Deadline: **Fri 4 Dec 2026, 2:00 PM PT** (= Sat 5 Dec, 3:30 AM IST). No extensions.
- Submission period: 30 Oct – 4 Dec 2026. Only projects started on/after 30 Oct are eligible (this repo was started 3 Nov 2026).
- Category: **Resurrection** — "bring your favorite dead technology back to life". GhostWriter has a *Dead tech* mode (CGI guestbook, Winamp, Flash…) as well as abandoned-idea mode; lead the pitch with dead tech so it fits the category wording.
- Judging (20% each): Potential Impact · Technological Implementation (depth/variety of Kiro use) · Design · Innovation/Idea · Presentation (video).
- Prizes: 1st $30k, 2nd $20k, 3rd $10k; Best Resurrection $5k; bonuses incl. Best Demo, Blog (Kiro credits), Social Blitz (`#KiroweenHackathon26` at the *start* of the post). One overall OR one category prize, plus any bonuses.
- Eligibility: age of majority; India not excluded; not open to sponsor (AWS) / Devpost staff, judges' employers, or their immediate family/household. Teams ≤ 3.
- Free Kiro credits: request 4,000 on the Resources tab by **1 Dec, 12:00 PM PT**.

## Rules checklist

- [x] Working app; offline demo mode for judges, no login needed
- [x] Open-source license file (MIT) at root — must show in GitHub "About"
- [x] `/.kiro` at repo root with specs, hooks, steering (+ agent, MCP); not in `.gitignore`
- [x] README with setup and Kiro write-up
- [ ] **Built using Kiro** — open the repo in Kiro IDE/CLI, sign in, and actually use it (run spec tasks, trigger hooks) before submitting; record it for the video
- [ ] Public **GitHub** repo (not GitLab/Bitbucket)
- [ ] Public URL of the running app (e.g. Vercel; set `OPENAI_API_KEY` or leave demo mode)
- [ ] Public YouTube video < 3 min, no copyrighted music/trademarks
- [ ] Devpost text description + "how Kiro was used" write-up + category selection

## Demo script (≈2:45)

1. **0:00–0:20** Hook: "Every dev has a graveyard of dead side projects and dead tech." Show a 1999 guestbook snippet.
2. **0:20–1:05** Paste it in *Dead tech* mode → Resurrect (live gpt-4o-mini). Tombstone + epitaph, requirements.md with EARS, tasks.md.
3. **1:05–1:30** Starter code tab: file tree with the orange `.kiro/` files; download the zip.
4. **1:30–2:15** Open the zip in **Kiro**: spec appears in the Specs panel → click "Start task" on task 1; show the spec-sync hook ticking it off.
5. **2:15–2:40** GhostWriter's own `/.kiro`: spec, steering, hooks firing (tests on save), reviewer agent.
6. **2:40–2:50** Close: "Nothing you start has to stay dead."

## Submission steps (user only)

1. Install/sign in to Kiro; open this repo; use the spec/hooks for real (needed for honesty and the video).
2. Create a public GitHub repo, push, confirm MIT shows in About and `.kiro/` is visible.
3. Deploy (Vercel or similar) for a public URL.
4. Record + upload the video (public YouTube).
5. Devpost → Enter a Submission → Resurrection; optional Social Blitz / Blog bonus posts.
