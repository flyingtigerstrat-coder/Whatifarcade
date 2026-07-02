# BRIEF — IRONLINE
version: v0.4
date: 2026-06-23
status: shipped
changed-since-last: PHASE A SHIPPED to whatifarcade.com — restage passed (depth bands, banner, swept yard), The Railhead grew into a settlement (building grammar + Noodle ratified on the platform), and the arrival/departure choreography is live (world comes to REST; begin-at-origin; the Dispatcher speaks; depots halt the world; save discipline extended, with a standalone localStorage shim so saves persist on the live site). Phase B (tutorial) still pinned; parked threads unchanged.
---
vision:
A rig you build and send across a living rail-ocean — cozy watch-it-roll crossed with a Mad-Max waste of rust, dusk, diesel and bone. The journey BEGINS at THE RAILHEAD, the last lit outpost before the open rail-ocean, kept by THE DISPATCHER — the quiet dusk moment before a long haul. We're giving a gorgeous engine a spine: a journey, not a treadmill. Feeling-first, warm, wry, lonely, beautiful.

requirements (for IRONLINE to feel "fully fleshed out"):
- The journey has a shape — a destination / arc, not an infinite odometer.
- Arriving at a stop is a felt, physical moment on-canvas, not only a DOM panel.
- Stops offer meaningful branching choice (the FTL / Slay-the-Spire node-graph north star).
- The world's existing richness (biomes, weather, day/night, material-system trains, crew & heroes) is preserved and showcased — never regressed.
- NEW — COMPOSITION / DEPTH: a station scene reads in clean depth bands. The TRAIN is an unbroken silhouette on its own rail; the STATION sits clearly BEHIND it (backdrop band, hazed by aerial perspective); the PLATFORM is a thin FOREGROUND strip. The station frames the train and never touches it. Pass/fail test: trace the train's outline — if you can't get around it without hitting a station part, the bands are still collapsed.
- Stays feeling-first: cozy, beautiful, no retention/monetization scaffolding.

scope (THIS PASS = PHASE A):
- BEGIN-AT-ORIGIN: a fresh game (no save) starts docked & AT REST at The Railhead. Returning players load mid-journey and never see it.
- THE ARRIVAL CHOREOGRAPHY — reusable state, not a one-off (every future node-stop reuses it): world decelerates to rest (concrete hook: today `spd` stays 14 when docked — arrival needs spd -> 0), driver-wheels slow & settle, smoke thins to nothing, station settles in, lanterns flicker up. Departure reverses it.
- THE RAILHEAD, PROCEDURAL, palette-locked, in the backdrop layer so the live world lights it. ART CONFIRMED GOOD from proof-frames — keep the look; fix the staging (below).
- THE DISPATCHER's voice in the ticker at the origin. Plain Depart only this pass.
- RESTAGE (new this version — the active task): rebuild the scene in three depth bands per the composition requirement above. Specifically:
  - Station building, name-board, water tower, signal mast pushed UP-AND-BACK into a midground backdrop band, slightly haze-dimmed so they read as behind the train.
  - Train alone on its rail in the lower-middle — clean, unbroken silhouette, nothing crossing it.
  - Platform + Dispatcher + lanterns as a thin foreground strip along the bottom, in front of the rail.
  - NAME-BOARD off the rail: mount on the station roofline (backdrop) OR promote to a UI banner at the top of frame (preferred — scales to every future depot; the place-name stays legible regardless of how the rig is composed).
  - GANTRY retired: the full-width canopy cages the train. Use beside-the-rail infrastructure (water tower + signal mast) instead. Build from the tower/mast proof-frame, not the gantry one.

ASSET-FIT GUARDRAILS (confirmed working — keep): two-metal + rust material language, 5-value MAT ramps, hard AO seams; dusk palette never pure; weathered / scavenged / asymmetric; bottom-anchored to the rail; materials echo the biome.

REFERENCE NOTE — Tiny Rails: borrowed for SPATIAL GRAMMAR ONLY (depth bands, train-alone-on-its-rail, place-name as UI banner). NOT for palette or mood — the reference is bright midday; IRONLINE stays dusk + rust. Do not brighten toward the reference.

PROOF-FIRST: still the rule. Re-render the restaged scene as a dusk still via `ironline-export.js` (scene, T=0) for the human's eyes before animating the choreography on top of it.

DON'T REGRESS: camera coupling (EX holds native 216 under fire), combat-coords-absolute, draw order, save discipline (origin keys off "no save loaded"; extend save/load/reset together if state persists). Natural seam (builder's call): The Railhead is a richer, physical depot — the existing depot / `maybeDepot` / `openDepot` path is the natural host.

out-of-scope (now):
- PHASE B — the tutorial system (PINNED): the "Depart vs Guided Departure" fork + guided beats + ambient nudges. Pinned until the core mechanics settle.
- The node-graph map; cargo car + haul contracts; troops-as-manpower rework — parked in dependency order below.
- Resolution bump; new NPC roster; tappable station buildings; bitmap origin (the proof-frames passed on procedural — effectively resolved toward procedural).

PARKED THREADS (dependency order — each its own session):
1. Node-graph travel map — the spine.
2. Cargo car + haul contracts — the journey's purpose; the Dispatcher becomes the contract-giver.
3. Troops -> manpower resource — ties combat + hauling + nodes together.
4. Un-pin & build the tutorial (Phase B).

open-questions:
- Name-board: roofline-mount vs UI-banner — leaning UI banner (scales to all depots). Human/builder to settle on the restage.
- Destination/arc: does the rail-ocean have an END? Vision call; resolve when the map thread opens.
- Two Fortresses: procedural drawFortress() unused vs the live imported sprite — keep / wire / retire (housekeeping).
