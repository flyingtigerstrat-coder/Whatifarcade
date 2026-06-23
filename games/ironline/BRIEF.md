# BRIEF — IRONLINE
version: v0.3
date: 2026-06-21
status: building
changed-since-last: Promoted from Drive (BRIEF_ironline_v0.3-READY) into the repo and picked up by the builder. Phase A in progress: tooling restored, dusk exporter proven; authoring The Railhead. Phase B (tutorial / guided-departure fork) remains PINNED.

---

vision:
A rig you build and send across a living rail-ocean — cozy watch-it-roll crossed with a Mad-Max waste of rust, dusk, diesel and bone. The journey now BEGINS somewhere: THE RAILHEAD, the last lit outpost before the open rail-ocean, kept by THE DISPATCHER — the quiet dusk moment before a long haul. That stillness is what "stopping" will feel like everywhere later. We're giving a gorgeous engine a spine: a journey, not a treadmill. Feeling-first, warm, wry, lonely, beautiful — never a metrics product.

requirements (for IRONLINE to feel "fully fleshed out", unchanged core):
- The journey has a shape — a destination / arc, not an infinite odometer.
- Arriving at a stop is a felt, physical moment on-canvas, not only a DOM panel.
- Stops offer meaningful branching choice (the FTL / Slay-the-Spire node-graph north star).
- The world's existing richness (biomes, weather, day/night, material-system trains, crew & heroes) is preserved and showcased — never regressed.
- Stays feeling-first: cozy, beautiful, no retention/monetization scaffolding.

scope (THIS PASS = PHASE A only):
- BEGIN-AT-ORIGIN: a fresh game (no save) starts docked and AT REST at The Railhead — journey 0, world stopped, wheels still — not rolling on open track. Returning players load mid-journey and never see it (the frictionless skip, for free).
- THE ARRIVAL CHOREOGRAPHY — the reusable "grammar of arriving", built as a reusable state, NOT a one-off (every future node-stop reuses it): world decelerates to rest, driver-wheel spin slows & settles, smoke thins from running cadence -> lazy wisp -> nothing, the station slides in from the right & settles centered, lanterns flicker up. Departure is the reverse.
  - CONCRETE HOOK: today `spd` stays 14 even when docked (tick() line ~1644), so the world never physically stops. Arrival needs the world to actually come to rest (spd -> 0) at a station — that's the core change that makes "stopping" real.
- THE RAILHEAD, drawn PROCEDURALLY, palette-locked, sitting in the BACKDROP layer so the live world lights it (dnLight + haze touch it — a dead flat sprite is the failure we're avoiding). Elements: low weathered-plank platform bottom-anchored to the rail (BASE grammar); lantern poles with warm amber pools (#e0a33a); a hand-painted cream name-board reading THE RAILHEAD; a water/fuel gantry over the rails (nods to the fuel economy); platform silhouettes incl. THE DISPATCHER leaning on the rail (the diegetic voice) + optional kid with dangling legs; west, empty rails running into the haze (the road ahead, implied). The whole frame at rest.
- THE DISPATCHER'S VOICE in the ticker at the origin — a line or two of dusk-before-the-haul flavor; hands you the line. Plain Depart only this pass (the guided-departure fork is Phase B).

ASSET-FIT GUARDRAILS (so "fits our world" is a spec, not a vibe):
- Two-metal + rust material language (gunmetal + rust pooling in recesses), 5-value MAT ramps, hard black AO line where parts meet — same hand as the trains.
- Dusk palette, never pure anything: weathered planks, rust-eaten iron, cream name-board, warm amber lantern pools.
- Weathered / scavenged / asymmetric — nothing tidy or grid-perfect; the wonk sells it.
- Bottom-anchored to the rail (BASE) so it plants on the same ground the rig does.
- Materials echo the biome The Railhead sits in, so it reads as belonging to its patch of waste.

PROOF-FIRST:
The builder's FIRST deliverable is a headless `scene` still of The Railhead at dusk (exporter, --T=0) for the human's eyes — validate fit in a frozen frame BEFORE blessing it in-game, then animate the choreography. The human's eyes are the final word (no headless HTML render).

DON'T REGRESS:
Preserve camera coupling (EX holds native 216 under fire), combat-coords-absolute, the draw order, and save discipline. Origin state keys off "no save loaded" (fresh game only); if any new state persists, extend save/load/reset together. NATURAL SEAM (builder's call, not prescribed): The Railhead is essentially a richer, physical depot — the existing depot / maybeDepot / openDepot path is the natural host (idx 0 or an origin flag), rather than a whole new subsystem.

out-of-scope (now):
- PHASE B — THE TUTORIAL SYSTEM (PINNED): the "Depart vs Guided Departure" fork + the guided first-departure beats + ambient nudges. Pinned until the core mechanics settle so it teaches the real, finished verbs. Phase A is its home; it slots on later without rework.
- The node-graph map; cargo car + haul contracts; troops-as-manpower rework — parked in dependency order below.
- Resolution bump; new NPC faction roster; tappable station buildings; BITMAP origin station (reserved as a possible future call once procedural is proofed).

PARKED THREADS (named, in dependency order — each its own dedicated session):
1. NODE-GRAPH TRAVEL MAP — the spine; gives stops branching meaning. (north star)
2. CARGO CAR + HAUL CONTRACTS — rides on the map; the journey's PURPOSE (manifest-driven routes between stations). The Dispatcher becomes the contract-giver (the echo we planted).
3. TROOPS -> MANPOWER RESOURCE — the people you spend on opportunities (boarding wrecks, holding blockades, guarding hauls, taking risky nodes); ties combat + hauling + nodes together. (Troops are currently inert: lvl*4 quietly folded into a damage sum.)
4. UN-PIN & BUILD THE TUTORIAL (Phase B) — last, teaching the now-real verbs.

open-questions:
- Bitmap vs procedural origin: human reserves the right to go bitmap for The Railhead (a once-seen showpiece — what the import pipeline exists for). Running procedural first to earn/proof the call; revisit after the dusk proof-frame, with attention to lighting the imported asset rather than blit-and-forget.
- Destination/arc: does the rail-ocean have an END? Still a vision call; resolve when the map thread opens (it shapes the spine).
- Two Fortresses: procedural drawFortress() appears unused in the live draw path vs the imported sprite skin that is live — keep / wire in / retire. (Housekeeping, not blocking.)
