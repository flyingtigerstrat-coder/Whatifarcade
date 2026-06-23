# CHANGELOG — IRONLINE
phase: in-code
> Standardized fields (GOVERNANCE §6), newest on top. This is the canonical, current changelog.
> The director kept it in Drive during chat-prototyping (entries below from CHANGELOG_ironline_v0.1);
> the builder continues it here now that work has moved to code.
> Deep PRE-PROCESS engineering history (heroes, crew, the economy, the camera, per-car detail — the
> chat-only era before the pod workflow) is preserved verbatim in `IRONLINE_CHANGELOG.md` and explained
> in `IRONLINE_HANDOFF.md`. Read those for the "why" behind the engine.

---

## 2026-06-23 · session 4 — builder pickup: tooling + docs promoted, dusk exporter proven
DECIDED: Restored IRONLINE's standing tooling from Drive into the repo (`ironline-export.js`, `ironline-import.py`) — the migration had moved the game but left the tools in Drive. Promoted the pod docs (BRIEF, this changelog, nested CLAUDE, plus HANDOFF/TOOLS/deep-changelog) so the game is self-contained in git, not just Drive.
TRIED: Ran the recovered exporter against the migrated game — `scene --T=0` rendered a true 1:1 dusk frame (1280×720), confirming the tool works post-migration and that T=0 = sunset. Baseline frame sent to the human (current open-track world; The Railhead not built yet).
PARKED: Phase B (tutorial / guided-departure fork) stays PINNED. Bitmap origin reserved pending the procedural proof.
CHANGED: BRIEF status ready-for-build -> building. Tools + docs now live in `games/ironline/`.
OPEN: Proof-first gate still open — author `drawRailhead()` (procedural, in the backdrop) and render the dusk proof frame for the human's blessing BEFORE wiring arrival behavior.
FEELING: The toolbox is back on the bench and the engine renders headless on command. Ready to paint the first lit outpost.

## 2026-06-22 · session 3 — builder onboarding (director)
DECIDED: Stood up the IRONLINE pod's builder onboarding — `KICKOFF_ironline-builder` v1.1 — and seeded this changelog; the package is ready to hand the Claude Code engineer to build Phase A.
TRIED: Extended the existing v1.0 builder kickoff + followed the koi-builder precedent (mission baked into the kickoff) rather than inventing a format.
PARKED: —
CHANGED: Builder kickoff v1.0 -> v1.1 (drop the pre-migration caveat; current to GOVERNANCE v1.4 — Drive is read+create for Code; first-session mission = Phase A).
OPEN: Does the v1.4 handoff loop hold in practice — does the builder read the brief + this changelog cleanly straight from Drive?
FEELING: The rails are laid. First real pod handoff; the machine's about to turn over.

## 2026-06-21 · session 2 — arrival thread locked & named
DECIDED: Arrival-first; BEGIN-AT-ORIGIN (a fresh game starts docked & at rest); origin = THE RAILHEAD; voice = THE DISPATCHER (chosen to echo forward into the future cargo-contract giver); procedural route first; brief -> v0.3, ready-for-build, scope = Phase A.
TRIED: "Tutorial at the first station" (good instinct) -> reframed: the tutorial pins together with its "Depart vs Guided Departure" fork until the mechanics settle, so it teaches the finished verbs.
PARKED: Tutorial = Phase B (PINNED). Four loops in dependency order: node-graph map -> cargo car + haul contracts -> troops-as-manpower -> un-pin the tutorial. Bitmap origin reserved (revisit after the proof-frame).
CHANGED: Brief v0.1 -> v0.3-READY; thread split into Phase A (build now) / Phase B (pinned).
OPEN: Does the rail-ocean have an END? (A vision call the human owns; it shapes the map/spine.)
FEELING: It's becoming a journey instead of a treadmill — the spine is finally implied.

## 2026-06-20 · session 1 — orientation & the first brief
DECIDED: Stood up the pod's FIRST brief (v0.1, exploring) — IRONLINE had none; it shipped before the process existed.
TRIED: Read the live code directly. Confirmed the gap — deep, gorgeous systems but no journey shape; "arrival" is a DOM panel while the world keeps rolling (`spd` stays 14 when docked, so nothing ever physically stops).
PARKED: —
CHANGED: initial — the pod dashboard now exists.
OPEN: Thread order — arrival-first vs node-graph-map-first (resolved next session: arrival-first, because it de-risks the map and builds the reusable grammar of arriving).
FEELING: Not a prototype — a loved, deep engine missing a spine.
