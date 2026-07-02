# CHANGELOG — IRONLINE
phase: in-code
> Standardized fields (GOVERNANCE §6), newest on top. This is the canonical, current changelog.
> The director kept it in Drive during chat-prototyping (entries below from CHANGELOG_ironline_v0.1);
> the builder continues it here now that work has moved to code.
> Deep PRE-PROCESS engineering history (heroes, crew, the economy, the camera, per-car detail — the
> chat-only era before the pod workflow) is preserved verbatim in `IRONLINE_CHANGELOG.md` and explained
> in `IRONLINE_HANDOFF.md`. Read those for the "why" behind the engine.

---

## 2026-06-23 · session 7 — the settlement, and Noodle
DECIDED: The Railhead grew from a depot cluster into a TRUE SETTLEMENT — two quarters flanking the station anchor: homes west (shack with smoking chimney, water tower, tool shed), work east (freight house with sliding door, silo, signal, a wind pump whose fan turns above the train's roofline), stitched by scrap-fence runs and the telegraph wire. AND: the human ratified the dog — NOODLE is on the platform, a little black puppy sat in front of the kid, tail mid-wag, wearing the only gold pixels in the scene (gold is his mark alone).
TRIED: East-side dwellings behind the engine (occluded — wasted; moved homes west where they read). Collar first landed mid-chest like a bib; tucked to the neck after zoom QA.
PARKED: —
CHANGED: New recipes bShack/bShed/bFreight/bWindpump + parts bWisp/bFence; RH_BUILDINGS is now the settlement list; rhPup added (band 6); east telegraph pole shifted clear of the pump; DESIGN.md grammar + worked example updated. Follow-up: the foreground wreck-tire (band-3 travel prop) parked as a cropped lump in the origin's bottom-left — the yard is now SWEPT while docked at the origin (wreckage returns the moment the world rolls).
OPEN: Bless the settlement frame, then the arrival choreography (spd->0, begin-at-origin, the Dispatcher's ticker line) — the last piece of Phase A.
FEELING: A kid and his dog waiting for a train at the edge of the world. That's the whole studio in one frame.

## 2026-06-23 · session 6 — the first-frame polish: The Railhead becomes a place
DECIDED: The opening frame carries the universe, so it got a full polish pass: a telegraph line (poles + sagging wires, band 4) running past the station off both frame edges; the station now glows from inside (window light spilling to the ground, porch lantern under the canopy, a lazy stovepipe wisp); the platform sits on a worn apron of trampled biome-matched earth; a lantern at each end with gnats in the lamplight; the kid now SITS on the deck edge, legs dangling (per the brief); freight (crate + milk-can) waits by the deck. Also: the small depot cabin grew into a proper rail STATION (hip roof, clock cupola, tall windows, double-door + canopy, ticket bay) as the cluster anchor.
TRIED: Pixel-level zoom QA (new crop tool) caught three defects invisible at 1x — the gable's protruding ridge-cap "wart" (fixed: clean symmetric pitch), band-3 scrub/wreck props colliding with the platform figures (fixed: the apron clears the strip), and the kid reading as a monochrome smudge (fixed: face/hair/ochre-coat contrast).
PARKED: A dog on the platform (raised, not shipped — brand-adjacent call for the human). Arrival choreography is next.
CHANGED: bGable rewritten; bStation + station parts (bHip/bClock/bAwning/bBay) added; bPole/bWire added; apron + backing strip in drawRailheadFront; DESIGN.md building grammar + worked example updated.
OPEN: Bless this frame as the final look, then wire the arrival/departure choreography (spd->0, begin-at-origin, the Dispatcher's ticker line) on top of it.
FEELING: It finally feels like arriving somewhere at dusk — the lamps are lit, somebody's home, and the wire runs west into the haze. This is the world.

## 2026-06-23 · session 5 — depth-band canon + The Railhead restaged
DECIDED: Landed the depth-band staging ladder in DESIGN.md (descriptive of draw()'s existing order; the one rule — a new drawable names its band before it's drawn). Restaged The Railhead per BRIEF v0.4: architecture (water tower / signal mast / depot building) pushed UP-AND-BACK into band 4 and haze-dimmed by aerial perspective; name-board promoted to a band-9 UI banner; platform + Dispatcher + lanterns kept as the band-6 front strip. Train now alone on band 5 — clean unbroken silhouette (pass/fail test passes).
TRIED: First bracket vs shed prototypes — director's pass: ART/FIT/PROCEDURAL PASSED, STAGING FAILED (station was drawn at the train's depth). Gantry/canopy retired (caged the rig); built from the tower/mast frame.
PARKED: Shed/canopy variant removed (recoverable from git) — possible future "grand city-node" look. Bitmap origin resolved toward procedural.
CHANGED: BRIEF v0.3 -> v0.4 (COMPOSITION/DEPTH requirement + restage scope); added DESIGN.md; ironline-export.js railhead subject drops --style.
OPEN: Bless the restaged dusk still before animating the arrival choreography (spd->0 at rest, begin-at-origin, Dispatcher's ticker voice).
FEELING: Now it reads like a place — the rig parked at the edge of the world, the depot hazed behind it, the name up in lights.

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
