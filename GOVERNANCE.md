# GOVERNANCE — Noodle Studios
**v1.4 · 2026-06-22**

> How the studio coordinates work across many agents that cannot see each other.
> Companion to `CLAUDE.md` (the constitution). The brain says *what we build*; this says *how we operate*.
> Ported from the Flying Tigers Operational Library pattern, tuned for a codebase + a pod workflow.
> v1.1: the pod model became the spine; Drive organized by pod; "inbox" is a status.
> v1.2: `POD_ARCADE` named the **keystone pod**; added **§8 Services & data ownership**.
> v1.3: standardized the **changelog structure** studio-wide (fields + order + cadence) in §6; content stays pod-local.
> v1.4: ratified **Drive as a shared read+create surface** (probe-verified — Code can read & create in Drive, not edit in place). Updated §2, §6, §9, §10. Drive graduates from *inbox* to *shared coordination surface*; status boards are **dated snapshots**, not living files.

---

## 1 · The operating model: pods + a time-multiplexed human
The studio runs as **pods**. Each major game is a self-contained pod:
- a **chat designer** — design / prototyping / brief + concept proofing. Writes to **Drive**.
- a **Claude Code builder** — executes against the brief. Writes to the **repo** (and now reads + creates in **Drive**, §2).
- a **designer (Claude Design)** — on call when visual work is needed.

The human is **not inside one pod** — the human is the **time-multiplexed scheduler** who hops pod to pod. The core insight: **Claude Code's execution latency is not dead time; it's a scheduling opportunity.** While one pod's builder grinds through a run, the human is in another pod proofing concepts and shaping the next brief. By the time the human laps back, the first run is ready for feedback. Pods are parallel engines; the human keeps them all fed. (Same principle as an OS scheduling across blocked processes, or one chef running a line of pans.)

This operating model drives every structural decision below — above all: **the pod is the unit of work, and the pod is per-game.** So Drive is organized by pod, not by document type.

---

## 2 · Two worlds: the Inbox and the Record (+ Drive as a shared surface)
The spine of how the no-repo loops hand work to the builders.

| | **Drive (the Inbox / shared surface)** | **Git repo (the Record)** |
|---|---|---|
| Role | Draft / staging / pod working area / **shared coordination surface** | Canonical source of truth |
| Who **reads** | Chat + Design + **Code** | everyone |
| Who **creates** | Chat + Design + **Code** | Claude Code only |
| Edit in place? | **No** — create a new dated file (connector is read+create only) | Yes — git tracks every change |
| Version control | **None** — files pile up (naming carries history) | **Git** — full history, attribution, rollback |
| Filenames | **Dated + versioned** (name carries history) | **Stable** (`CLAUDE.md`, `BRIEF.md`) — git holds history |

**Drive is a shared read+create surface (probe-verified 2026-06-22).** Both chat and Code can READ Drive and CREATE files in it. **Neither can edit, append, or delete in place** — the connector exposes only create + copy. This has three consequences that shape everything below:
1. **Code no longer needs the human as courier for reads and new files.** A builder can read the brief straight from the pod's Drive folder and create its outputs (changelog snapshots, status snapshots) as new dated files. The human still carries the *rare* change to an existing file (since neither agent can edit in place) — but the normal motion is *create a new dated version*, which we do anyway.
2. **Mutable "living files" belong in git, not Drive.** Anything edited repeatedly (an always-current status board) lives in the repo, where in-place edits and history are native; a dated snapshot can mirror to Drive for chat agents.
3. **No edit-in-place means no clobber.** Because agents can only create, they cannot overwrite each other's work on Drive. The race condition is structurally impossible there; collisions can only happen in git, where git handles them.

Flow is still one-directional for *truth*: **Chat (or Code) writes a dated draft to Drive -> Code promotes it into the repo (commits it) -> it becomes truth.** Committing is the act of becoming canonical.

**"Inbox" is a status, not a place.** A brief lives in its **pod's folder** and carries a `-READY` tag when it's waiting for the builder. The inbox is a *search* (`-READY` across all pods), not a separate folder.

**Golden rule of naming:** version the filename **in Drive** (no git there); **never** version a filename **in the repo** (git is the history — `CLAUDE_v3.md` beside `CLAUDE.md` is the bug that makes Code guess which is canonical).

---

## 3 · Drive naming convention
```
[TYPE]_[scope]_vMAJOR.MINOR_YYYY-MM-DD[-STATUS].ext
```
- **TYPE**: `BRIEF` · `BRAND` · `HANDOFF` · `KICKOFF` · `CHARTER` · `BRAIN` · `GOVERNANCE` · `SPEC` · `NOTE` · `STATUS` · `PROCESS` · `GUIDE` · `TEMPLATE` · `AMENDMENT` · `DIAGRAM`
- **scope**: the game/subject — `ironline`, `noodlered`, `arcade`, `studio`
- **vMAJOR.MINOR**: human version intent (minor = tweak, major = significant rewrite)
- **YYYY-MM-DD**: ISO date, zero-padded — sorts newest-first lexically *and* chronologically, so "sort by name" surfaces the latest even at high volume
- **STATUS** (optional): `-DRAFT` · `-READY` (builder may promote) · `-PROMOTED` (now in the repo) · `-SUPERSEDED` · `-VERIFIED`

Examples: `BRIEF_ironline_v2.1_2026-06-20-READY.md` · `POD_STATUS_ironline_2026-06-22.md` · `BRAIN_studio_v1.3_2026-06-20.md`

**The one rule that prevents the mess:** never reuse an exact filename. Two files with identical names is the ambiguity this convention exists to kill. New version = new date/version in the name; retire the old one to `99_ARCHIVE`. **With Code now also creating Drive files, this rule matters more, not less — both agents obey it so versions stay legible.**

---

## 4 · Drive folder structure — by pod
```
IRONLINE/  (the studio's Drive working area)
├─ 00_GOVERNANCE/   ← the brain + this doc + templates/processes (studio-wide; the rules every pod obeys)
├─ 01_BRAND/        ← brand bible, palettes, swatch explorations (studio-wide; the shared seam)
├─ POD_ARCADE/      ← KEYSTONE: storefront + /shared + /services + deploy (changes ripple to all games)
├─ POD_IRONLINE/    ← the IRONLINE pod's whole world: brief + handoff + design notes + state
├─ POD_<game>/      ← same package shape; a new pod = copy this folder
└─ 99_ARCHIVE/      ← superseded versions, moved out of the way (never deleted in haste)
```

**The rule: cross-cutting things get their own top folder; anything that belongs to one game lives in that game's pod folder.** This is "share by identity layer" (`CLAUDE.md` §6) applied to Drive — studio-level shared, game-level siloed.

- `00_GOVERNANCE` and `01_BRAND` stay top-level **because they're genuinely studio-wide** — every pod draws on them. `01_BRAND` is literally the shared seam the serialization rule (§7) protects.
- **`POD_ARCADE` is the keystone pod.** It owns the storefront (`index.html`), the shared commons (`/shared`), studio-wide services (`/services`), and deploy. Because it owns `/shared`, its changes ripple to **every** game — so it is the locus of Tier-1 serialization (§7): it takes turns while game pods run free. Its full charter lives in `POD_ARCADE/`.
- Everything game-specific collapses into that game's **pod package** — open it and the whole game is there.

**Why by pod, not by type:** the human works one pod at a time and context-switches between them. A pod package puts the whole game in one place to open on arrival and close on exit; by-type filing would scatter each pod across folders — exactly the friction the throughput model can't afford. The filing system matches the operating model.

---

## 5 · The repo framework (hand this to Claude Code)
**Pattern name:** a **monorepo with a package-per-domain layout** — the Nx / Turborepo workspace family. The industry-standard shape for exactly our case: independent deliverables (games + storefront) sharing a common core (`/shared`, `/tools`), built on **parallel paths that must not collide.** Briefing line for Code:

> "Organize the repo as a **monorepo with isolated per-game packages and a shared core, Nx/Turborepo-style**, so parallel work on different games doesn't collide. Stable filenames; git holds version history."

Repo shape (full version in `CLAUDE.md` §5):
```
noodle-studios/
├─ CLAUDE.md · GOVERNANCE.md · CNAME · index.html
├─ shared/                    ← studio core (brand, ident, chrome, fx)
├─ tools/pixel-pipeline/      ← shared art engine
├─ games/<game>/              ← one isolated package per game
│   ├─ BRIEF.md               ← promoted from Drive; builder reads on start
│   ├─ CLAUDE.md · CHANGELOG.md · DESIGN.md
│   └─ play.html · attract.html · assets/ · art-spec/ · api/
├─ games/_template/
└─ services/                  ← studio-wide backend
```

**The migration is done** (IRONLINE moved into `games/ironline/`, `/shared` extracted, committed as one clean restructure by `POD_ARCADE`). For *new* games, see `PROCESS_new-game-bootup` — not the migration; that was one-time.

---

## 6 · The dual-loop sync + the pod's two documents
Inside a pod, the **chat designer** and the **Code builder** are two loops that can't see each other. They stay in lockstep through shared artifacts in Drive — now that **Code can read Drive directly** (§2), the sync is something the agents largely do themselves.

- **Chat owns the brief.** It writes `BRIEF_<game>_vX.Y_DATE-READY.md` into that pod's Drive folder.
- **Code owns the code + changelog.** It **reads the brief directly from Drive**, promotes it into `games/<game>/BRIEF.md`, and builds against it. It never edits the brief's *intent*.
- **Code re-reads the brief at the start of every session.** Staleness can last at most one session.
- **When the brief shifts mid-build, that's an event, not a silent edit.** Chat creates a new dated version and notes the change. Because Code reads Drive, it can pick up the new version on its next session; the human's job shrinks to **flagging that a change happened and ratifying it** — not hand-carrying the file. **The human supervises a sync the agents largely run themselves (read + create); the human still ratifies shared/Tier-0 changes, prunes, and carries the rare in-place edit (since neither agent can edit a file in place).**

**`BRIEF.md` header = the pod dashboard.** A glance at the status line tells the human-scheduler what state each pod is in:
```
# BRIEF — <Game>
version: vX.Y
date: YYYY-MM-DD
status: exploring | ready-for-build | building | shipped
changed-since-last: <one line, or "initial">
---
(vision · requirements · scope · out-of-scope)
```

### The pod's two documents: brief + changelog
A pod keeps **two** living documents. The *structure* of both is **standardized studio-wide** so the human can read any pod's at a glance; the *content* stays each pod's own voice.
- **`BRIEF.md` — the destination.** Where the game is going right now (header above). A living snapshot — supersede with a new dated version as the target sharpens.
- **`CHANGELOG.md` — the journey.** What was tried, decided, and parked to get there. **Append-only, newest on top.** One continuous changelog with **two phases**: the **director** keeps it in Drive during chat-prototyping; the **builder** continues it in `games/<game>/CHANGELOG.md` once the game moves to code. (Full template + the two-phase hand-off: `TEMPLATE_director-brief-changelog`.)

**Changelog structure — STANDARDIZED (every pod, identical):**
```
# CHANGELOG — <Game>
phase: chat-prototype | in-code
---
## YYYY-MM-DD · session N          (newest on top)
DECIDED:  <what got locked this session>
TRIED:    <what was explored — incl. what was rejected and why>
PARKED:   <set aside + the condition to revisit>
CHANGED:  <anything that moved the brief — note the version bump>
OPEN:     <questions carried forward>
FEELING:  <one honest line: does it have the magic yet?>
```
- **Standardized (binding):** the fields (`DECIDED / TRIED / PARKED / CHANGED / OPEN / FEELING`), newest-on-top order, and the cadence — **a five-line end-of-session habit.** At a session's close, write *one short entry* (≈ one line per field) and stop. The "five lines" is a ceiling, not a target — small enough to *never skip*; the "habit" is the trigger — attached to *end-of-session* so it's *never forgotten*. Logging as-you-go interrupts flow; logging "later" never happens. One entry, at the close, every time. *Why uniform:* the human reads every pod's changelog when carrying signal — one shape means scanning any pod in five seconds.
- **Pod-local (free):** *what fills* those fields — each pod's own voice. IRONLINE's `FEELING` line talks rust and momentum; Firefly's talks about whether the calm survived. Same skeleton, different soul.
- **Don't over-standardize:** the fields, the order, and the habit — **nothing heavier.** The moment a changelog feels like a documentation project, directors quietly stop keeping it and the pod loses its memory (§11 / `CLAUDE.md` §3.6).

### The pod status board (dated snapshot)
A pod's combined state + the director↔builder message board lives in a **dated snapshot**: `POD_STATUS_<game>_YYYY-MM-DD.md` (newest on top). **Not a living file** — each refresh is a new snapshot (Drive can't edit in place). Director, builder, and human each own sections; the human reads one file to see the whole pod. Full template: `TEMPLATE_pod-status` (v2.0). Use it when a pod is active enough that carrying state in your head gets heavy; a single-game studio may not need it yet (§11).

---

## 7 · The update protocol — tiers by blast radius
| Tier | Scope | Who writes | Ceremony |
|---|---|---|---|
| **0 · Constitution** | root `CLAUDE.md`, brand tokens | **Human ratifies** | rare; own commit; a "why" note |
| **1 · Shared** | `/shared`, `/tools`, studio `/services` | Arcade builder proposes | **serialized** — one at a time, human approves, lands between pod sessions |
| **2 · Game-local** | `games/<game>/*` (incl. its `api/`) | that pod's builder | **parallel-safe** — free within its folder; logged in its CHANGELOG |
| **3 · Ephemeral** | chat designers, Design | any agent | zero authority — proposals only |

**The serialization rule (Tier 1) is what keeps parallel pods from colliding.** Pods are clean while they stay in their lanes — but every pod draws on `/shared` (brand, bumper, wish console). If IRONLINE's pod changes `brand.css` while Game 2's pod is mid-build against it, parallelism becomes a race. So: **game-local work runs free in parallel across pods; shared changes take turns and the human ratifies them.** That single rule is what lets N pods run safely at once. `POD_ARCADE`, as keystone, is the pod that most often proposes Tier-1 changes.

**Promotion path** (idea -> truth): brainstorm (Tier 3) -> `BRIEF.md` -> builder builds (Tier 2, committed) -> if it turns out shared, proposed up -> **human ratifies** -> root brain updated -> every agent reads the new truth on its next session.

---

## 8 · Services & data ownership (accounts vs saves)
Where login and save-data live follows the same **share-by-identity** rule as everything else.

- **Accounts / login / profile = studio-wide.** One What If Arcade identity plays every game. Lives in `/services/shared/` (e.g. `/services/accounts/`), **owned by `POD_ARCADE`.** It's a **Tier-1 shared service** — serialized, human-ratified, because every game depends on it.
- **Save data / progress = game-local.** A game's save state (IRONLINE's train and journey; a sailing game's progress) is meaningless to any other game. Lives in that game's `games/<game>/api/`, **owned by that game's pod.** Tier-2 — the pod changes it freely.
- **The seam between them:** a game's saves are **keyed to the shared account** — the account id comes from the studio account service; the save blob is owned and shaped by the game. **Contract before host** (`CLAUDE.md` §3.4): the account backend can move hosts (Apps Script -> Workers+D1 -> whatever) without any game's saves breaking.
- **Build order (not now):** none of this exists yet. When it's time, stand up the **account service first** (studio-wide, `POD_ARCADE`), then a game adds its own saves against it. Don't build accounts before a game actually needs cross-session persistence — §11 / `CLAUDE.md` §3.6.

---

## 9 · Consistency mechanisms
1. **Pull-on-start.** Every agent re-reads `CLAUDE.md` (+ its `BRIEF.md`, now read directly from Drive) at session open. Consistency refreshed each session, never assumed.
2. **One canonical home per artifact.** **Code + mutable docs + the canonical brain = the repo (truth).** **Coordination docs (briefs, changelogs, status snapshots) = Drive (the shared surface).** The brain is committed to the repo as `CLAUDE.md`/`GOVERNANCE.md` (stable names); a dated copy mirrors to Drive for chat agents to read. Never two *peers* claiming truth for the same artifact — one home each, mirror is read-only.
3. **Drift audit.** Periodically, a Code task that diffs *reality vs. the brain*: does the code still do what `CLAUDE.md` claims? Divergence means one is stale — the human decides which.

---

## 10 · Update cadence
| Layer | Cadence | Trigger |
|---|---|---|
| `CLAUDE.md` (constitution) | Rare / major inflection | A locked decision changes (e.g. brand color) |
| `GOVERNANCE.md` (this) | When the operating model changes | New agent type, new coordination rule, new tool capability |
| `/shared` (Tier 1) | When a shared component stabilizes | Reviewed, serialized, ratified |
| `BRIEF.md` (per pod) | Continuous during design | Every brainstorm shift (new dated version) |
| `CHANGELOG.md` (per pod) | **Every session** | A five-line end-of-session entry (§6) |
| `POD_STATUS` snapshot (per pod) | When the pod's state meaningfully changes | A new dated snapshot (§6); not every message |
| Game code | Continuous during build | Every builder session |
| Drift audit + archive sweep | Every N sessions | Volume builds; reality drifts from docs; Drive accumulates (agents create, human prunes) |

---

## 11 · Right-sizing (the honest caution)
This is the **target** model — designed so the seams are ready. **Stand it up as the work demands it, not all at once.**

Today: a small number of games + one storefront. The N-pod parallel machinery is real and worth designing for — but you grow into it.

**Two pod-model failure modes to design against now (cheap insurance):**
1. **The shared seam is where parallel pods collide** — handled by the Tier-1 serialization rule (§7). More pods without it = more collisions.
2. **The human is the single point of failure, and context-switching has a tax.** You carry cross-pod state. Mitigations: the `BRIEF.md` header (and `POD_STATUS` snapshot) is your **dashboard** (don't hold state in your head), and **cap concurrent pods low (2–3)** until you feel your own switching limit — the §3.6 counterweight applied to *you*. **Note:** Drive-as-shared-surface (§2) removes courier *friction* — it does **not** raise your real bandwidth. More pods become *legible*, not *free*. Run as many as you can actually hold, not as many as the tooling now permits.

**The same right-sizing applies to process itself.** Standardize only what earns it (filenames, the brief header, the changelog *structure*) — never the content, the wording, or the cadence beyond a light habit. Process heavier than the work it governs gets abandoned. Build the harness — and the paperwork — only when the lack of it actually hurts. (The `POD_STATUS` board is itself optional until a pod is busy enough to need it.)
