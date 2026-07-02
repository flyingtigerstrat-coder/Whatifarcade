# BRIEF — IRONLINE
version: v1.2
date: 2026-07-02
status: built — awaiting human QA (all seven waves landed; no deploy until the human calls it)
changed-since-last: PHASE A VERIFIED SHIPPED (supersedes v1.1 same day; v1.1 was cut before the director saw sessions 4–9 land). The Railhead is LIVE on whatifarcade.com as a full settlement — restage passed, arrival/departure choreography live as the reusable S.stop machine (world truly comes to rest), begin-at-origin live, the Dispatcher speaks, depots halt the world, pod docs + tooling promoted into the repo, depth ladder + building grammar + "The stop" canon in DESIGN.md, localStorage save shim fixed live persistence, NOODLE ratified on the platform (his gold is his alone). Wave 0 is therefore SLIMMED to the true remaining foundations (save schema v2 + migration, harness kept green). Waves 1–6 stand, now explicitly built ON the shipped foundations (The stop, the settlement/building grammar, the banner's layout gating). Builder-parked items routed to their waves. This brief is the sprint contract the builder's own session-9 OPEN line asked for: "the parked threads, in order: node-graph map first."
---

## vision
A mature, chaotic little realm. The rail-ocean is no longer an endless treadmill — it is a CROSSING: four regions of waste between THE RAILHEAD (the last lit outpost — a real settlement now, lamps burning, a kid and his dog on the platform) and THE TERMINUS (the Warlord's rolling fortress squatting on the deep track, the rig that ends lines). Between them: stations with markets and moods, clans flying warpaint, caravans, contracts, passengers with somewhere to be, troops worth their rations, a ghost train nobody quite believes in. Cozy watch-it-roll, rust-dusk-diesel-bone, wry and a little lonely and warm — now with a spine, stakes, and an end. The ocean has an end; the game doesn't (the line stays open after).

## the state we build from (verified live, 2026-07-02)
- SHIPPED & LIVE (builder sessions 4–9): The Railhead settlement (station anchor w/ clock cupola, homes west, freight east, telegraph line, swept yard while docked); the Dispatcher's greeting + send-off; NOODLE on the platform (little black pup, tail mid-wag — the ONLY gold pixels in the scene; gold is his mark, keep it that way); THE STOP — reusable arriving/docked/departing state machine (decel-integral station glide, spd->0 at rest, smoke gated on speed, depart eases back out); begin-at-origin (fresh boot docks at the Railhead; loads are authoritative); depots physically halt the world; place-name = band-9 canvas banner GATED to portrait/immersive (landscape announces via DOM chrome — respect this gating in all Wave 6 banner work); standalone localStorage save shim (window.storage was undefined live — saves now persist); 20-assertion headless behavioral harness; exporter/importer + all pod docs (BRIEF/CHANGELOG/DESIGN/CLAUDE + HANDOFF) in `games/ironline/`; DESIGN.md carries the 9-band ladder, the building grammar, and "The stop".
- STILL TRUE: `drawFortress()` orphaned (1 ref — its own definition; it becomes The Terminus). `dt` kinetic/blast/fire tags present and dormant. Troops inert. Gun ports tier-flat. `S.journeys` still the difficulty driver. Odometer still the travel model. No save schema versioning/migration yet (the shim persists, but state is unversioned).
- STUDIO ENGINE at `/tools` (read-only): Relight kernel + lab + headless reader, pixel-pipeline skeleton (generalizes FROM ironline — extraction candidates are proposals, rule of three), Asset Contract spec.
- Builder-parked items, routed: Fortress-skin smoke doesn't respect rest -> Wave 6. The retired shed/canopy station variant (recoverable from git) -> Wave 6's "grand city-node" station look.
- Human's open loop (parallel, non-blocking): a full live play-through origin -> depart -> crossing -> depot -> return.

## sprint rules (cross-cutting)
1. SEVEN WAVES, IN ORDER, each leaving the game fully playable: parse-checked, harness green (extend the 20-assertion behavioral harness as systems grow), checkpoint commit, headless proof-still self-QA'd + human-blessed for anything visual. Break only at wave seams.
2. SAVE SCHEMA v2 + MIGRATION — sacred and FIRST (Wave 0). Add `v:2` + `migrate()` on top of the shim. Live players now have real persisted rigs; they MUST survive every wave. Migrated players land at the nearest station node of the region matching their journey count. Extend save/load/reset together every time state grows.
3. DEPTH-BAND LAW (DESIGN.md is canon): every new drawable declares its band. Stations band 4, player band 5, ground enemies band 6, fx band 7, banners band 9 (layout-gated). Pass/fail: the player train's silhouette stays unbroken at stations.
4. EXTEND, DON'T REPLACE (§3.6) — and the shipped foundations ARE the extension points: THE STOP hosts every arrival in the game; the SETTLEMENT/BUILDING GRAMMAR hosts every station look; the depot path hosts services; the ptrain path hosts faction traffic; the boss-duel path hosts captains; `hash()` hosts the seeded map; the DOM panel hosts market/contracts. New subsystems only where nothing existing stretches.
5. LANES: `games/ironline/` is yours; `/tools`, `/shared`, `index.html`, `/services`, other games — never. Extractions and shared/brand changes are PROPOSALS.
6. DIFFICULTY REBASE: region tier (T0–T3) replaces `S.journeys` scaling; journeys stays as flavor.
7. PERFORMANCE: one self-contained HTML, no build step, mobile-first 60fps; cap concurrent band-6 entities (~8); pool booms/tracers.
8. FEELING-FIRST: no retention/monetization scaffolding, no cutscenes. Story = ticker lines, rumor lines, names. Noodle's gold stays his.

---

## WAVE 0 — REMAINING FOUNDATIONS (slim — Phase A is live)
- SAVE SCHEMA v2 + `migrate()` (rule 2). This is the wave's core job — everything after grows state.
- Keep the behavioral harness green and extend its assertion pattern to cover new systems as they land (map, cargo, contracts, combat states).
- Housekeeping, only if friction-free: organize game-local pipeline recipes toward `games/ironline/art-spec/` per the studio's engine/recipe split — do NOT force a churny move; note extraction candidates for pixel-pipeline as proposals.
- DoD: unversioned live saves load, migrate, and round-trip cleanly; harness green; no visual change.

## WAVE 1 — THE SPINE: the node map, regions, and the end of the ocean
- WORLD = FOUR REGIONS, west to east, each a difficulty tier with its own palette/weather bias (the `wx` arrays) and station flavor: T0 THE RUST FLATS · T1 THE DEAD CITY · T2 THE BONE REEF (existing three) · T3 THE CINDER SEAM (NET NEW — burning coal-seam country: char-black ground, seam-glow fissures, smoke columns, ember light; the Warlord's home track). Full Seam art lands in Wave 6; Wave 1 needs its region slot, tier, and placeholder ground/haze.
- NODE-GRAPH CROSSING replaces the odometer. Seeded per run (`S.seed`), deterministic via `hash(seed, region, col, row)`. Per region: 5–7 columns × 2–3 rows, edges forward to 1–2 next nodes. Node types: STATION (~40%), EVENT (~25%), HAZARD LEG (~20%), BLOCKADE (~10%), GATE (fixed, region end — a captain, Wave 4). Depart offers the current node's edges as the choice (one edge = plain Depart); the crossing leg is the existing run mode, flavored by node type + region tier. EVERY stop-type node arrives via THE STOP (it was built for exactly this).
- MAP TAB becomes the graph: position, visited trail, branches ahead, region headers, THE TERMINUS marked far east. Mobile-tappable. Backdrop biome drives from the map's region (keep the blend machinery; retire hash-of-distance selection).
- Anchor stations hand-named (generator fills minor ones): Rust Flats — THE RAILHEAD, Mercy Wells, Gallows Bend · Dead City — The Stacks, Old Exchange, Lantern Row · Bone Reef — Pale Landing, The Ribyard, Salt Hollow · Cinder Seam — Slagside, Last Signal, and the final node: THE TERMINUS itself (the "station" that isn't — his rig, parked on the deep track).
- DoD: a run has visible shape — branches, a trail, a destination; regions advance in order; The stop fires at every station node; map usable on a phone.

## WAVE 2 — STATIONS & ECONOMY: places that live
- STATION PERSONALITIES (2 archetypes per station + market): YARD (repair, refits, car market), MARKET (trade goods emphasis), OUTPOST (recruit troops & wanderers), CHAPEL (Bone Reef flavor — blessings, relic trade, wry tithes). The existing offer system stretches to host these; services stay in the DOM panel (tappable buildings remain parked). Station VISUALS reuse the Railhead's building grammar with lighter dressing (full per-region variety is Wave 6).
- STATION ECONOMICS: five trade goods — ORE, PARTS, MEDICINE, GRAIN, RELICS. Price = base × region supply/demand × station jitter (`hash`) — ore cheap in the Flats, dear in the Seam; medicine dear in the Reef; relics flow FROM the Reef/City. Buy low, haul east, sell high; visible buy/sell spread in the depot panel.
- NEW CAR — CARGO CAR: hold slots (4 + 2/lvl) for trade goods and contract freight. Procedural car scene in the material language (strapped crates, tarps, a checker with a manifest).
- NEW CAR — PASSENGER CAR: seats (2 + 1/lvl). Fares between stations; flag-down events add riders; SPECIAL PASSENGERS are mini-quests (named, a destination, a deadline in legs, a bonus — some step off and hand you a hero).
- CONTRACTS — the Dispatcher's network (the echo planted at the origin pays off): a contract board at every station — haul X to Y, escort a caravan leg, deliver a passenger. Contract pay > spot trading; optional deadlines add pressure. 2–3 per board.
- DoD: a player can run a trade route on purpose, and a station's name starts meaning something.

## WAVE 3 — COMBAT, ENEMIES & FACTIONS: the chaos
- DAMAGE TYPES GO LIVE: the dormant `dt` tags (kinetic/blast/fire) finally matter — enemy armor classes resist/weaken by type, so loadout choice is a real decision. Show it: resisted hits spark dull, weak hits bloom.
- MARK TARGET — the one light active verb: tap an enemy to mark it; guns focus it. Mobile-friendly, optional, satisfying.
- NEW ENEMIES (band 6 unless noted): CRAWLER (armored, slow, kinetic-resistant/blast-weak, sheds plates as it drops), MINELAYER (seeds shootable mines on your lane), BOARDER WAGON (grapples on — a boarding meter vs your TROOPS; if it wins, raiders on YOUR deck bleed scrap/damage a car until troops clear them), swarm-bike packs. Clan palette variants of the raider ptrains per region (band 4).
- TROOPS = MANPOWER, finally: (1) boarding defense (auto), (2) SEND A PARTY at event nodes (risk troops for wreck salvage — choice, stakes), (3) GUARD requirement on high-value contracts (locked aboard while active), (4) recruit at OUTPOST stations for food. The war-camp car earns its keep.
- FACTIONS: THE DISPATCHERS (station network — reputation from contracts: prices, better boards) · THE CARAVANEERS (trader trains — reputation from trade/rescue: convoy gifts, wanderer heroes) · THE CLANS under the Warlord's banner, one per region with a combat flavor (proposed: DUSTWOLVES/bikes in the Flats, THE FLAKWORKS/gun-trucks in the City, THE MARROW BANNER/bone-cult in the Reef, the Linebreaker's own in the Seam) — clans are enemies, no rep bookkeeping; their aggression steps with the story. TWO tracked reputations max (§3.6).
- THE GHOST HAULER: rare band-4 mythic — a pale, silent train on the far rail. Never fights. Sometimes trades relics; once in a long while, leaves you THE STOWAWAY (named hero). Seasoning, not a system.
- DoD: two combats in different regions FEEL different; a troop dies for a reason at least once; someone gets boarded and holds the deck.

## WAVE 4 — THE MAIN STORYLINE: THE LINEBREAKER
- THE ARC: the wastes answer to one Warlord — THE LINEBREAKER — whose rig, THE TERMINUS, ends every line it meets. The Railhead is where lines begin; The Terminus is where they end. You cross four regions to break him.
- CAPTAINS AT THE GATES: each region ends at a fixed GATE node — a named captain of that region's clan, built on the existing boss-duel system with modifiers + a distinct convoy skin (proposed, swap freely: SPOKE of the Dustwolves · FOREMAN FLAK of the Flakworks · DEACON MARROW of the Marrow Banner). Breaking a captain opens the next region and drops a NAMED hero (Wave 5).
- THE TERMINUS (final): multi-phase stop-and-duel at the last node. VISUAL FOUNDATION = the orphaned `drawFortress()` — the showpiece war-train that already faces LEFT (the boss direction), finally given its job (RESOLVES the two-Fortress question). Re-dress in warlord rust-iron + warpaint, arm it, shed armor by phase.
- STORY DELIVERY, light-touch: Dispatcher lines at the origin, rumor lines at station boards ("the Marrow Banner tithes in bone two stops east"), captain intro lines in the ticker. Names and dread, no cutscenes.
- AFTER THE WIN — THE LINE STAYS OPEN: free-roam across all four regions; contracts, trade, and events continue; captains respawn as scaled "pretenders." (NG+ keepsakes: parked.)
- DoD: a player can articulate the goal one minute in ("cross the ocean, break the Linebreaker"), and the victory doesn't end the cozy loop.

## WAVE 5 — PEOPLE: heroes, crew, passengers, interactability
- +8 HEROES: 2 wanderers (proposed: SIGNALWOMAN — reveals an extra edge on the map; CARTWRIGHT — +cargo hold), 2 war (THE UNCOUPLED — boarding defense; SPOTTER — bonus vs armored), 4 NAMED one-per-run story heroes: one per captain kill + THE STOWAWAY (Ghost Hauler). Named heroes get stronger buffs + a visible pixel signature on their car.
- TAP-TO-INSPECT: tap a crew figure / hero / passenger on the canvas (the crate-tap pointer path stretches to this) — a small card: name, rank, buff, one flavor line. The rig becomes a crew you can meet. (Noodle is tappable too; he has no stats — just a wag and a line. Some things aren't systems.)
- HERO SIDE-QUESTS (template-driven, one active at a time): a hero asks for a haul/visit/kill ("the Medic needs medicine run to Pale Landing"); completing pays a rank-up + a flavor line.
- CREW GROWTH VISIBLE: rank pips exist — add a max-rank pixel detail per hero kind.
- DoD: the human taps a little figure, reads a name, and smiles.

## WAVE 6 — THE POLISH PASS: every band refined
Run the ladder top to bottom; headless proof-stills per band group, human-blessed.
- Bands 1–3: THE CINDER SEAM full art — ember-gale sky, seam-glow ground, smoke-column far props, char ruins mid props, its own weather (EMBER GALE joins the roster; Seam bias hot). One new prop each for the three existing regions so the old world doesn't look poorer than the new.
- Band 4: station visual variety keyed to region + personality, built on the settlement grammar — and recover the parked shed/canopy variant from git as the "grand city-node" look. The passing-train repaint sliver (traders/clans read at a glance). Fix the parked Fortress-skin smoke plume so hero skins respect rest.
- Band 5 — GUN-PORT PARITY (the named debt): ports draw identically at every level while turrets grow with tier. Give casemates the same vtier growth (port -> armored casemate -> twin mount), distinct per-type silhouettes (auto/flak/flame), shell ejects + recoil, tier detailing consistent with the turret language. Plus engine tier silhouettes and cargo/passenger cars at full material quality.
- Band 6: new enemy sprites at full quality; mines; boarding figures on deck.
- Band 7: damage-type-coloured fx — kinetic tracers vs blast blooms vs fire gouts; resist-spark vs weak-bloom reads.
- Band 8: region-tinted atmosphere; Seam ember particles.
- Band 9: node-map UI + contract board styling in one coherent hand; all banner work respects the shipped layout gating (canvas banner portrait/immersive only; landscape announces via DOM chrome).
- DoD: screenshot any moment in any region and it looks intentional; trace the train and hit nothing.

---

## names ledger (all PROPOSED — human may swap any without re-briefing)
THE LINEBREAKER (the Warlord) · THE TERMINUS (his rig / final node) · THE CINDER SEAM (new region; alt: THE GLASS WASTES) · clans: DUSTWOLVES / THE FLAKWORKS / THE MARROW BANNER · captains: SPOKE / FOREMAN FLAK / DEACON MARROW · heroes: SIGNALWOMAN, CARTWRIGHT, THE UNCOUPLED, SPOTTER, THE STOWAWAY · weather: EMBER GALE · anchor stations as listed in Wave 1.

## code hooks (updated to the shipped file)
THE STOP (`S.stop` arriving/docked/departing — hosts every node arrival) · the settlement/building grammar + recipes (hosts station variety) · the behavioral harness (extend per wave) · `dt` tags dormant on TOPW/PORTW (Wave 3 activates) · `wx` weather-bias arrays (Seam adds its own) · `BIOMES`/`biomeIdx` (map-driven region order) · `maybeDepot`/`openDepot`/`depotOffers` (station seam) · `ptrain` path (faction traffic) · boss stop-and-duel path (captains + Terminus) · `drawFortress()` orphaned, faces LEFT (The Terminus) · `troops()` inert (manpower rework) · PORTW tier-flat (parity debt) · crate-tap pointer path (mark-target + tap-inspect) · `hash()` (seeded map) · `renderMap` (node graph UI) · `S.journeys` scaling (replace with region tiers) · the save shim (v2 + migrate goes on top).

## out-of-scope (this sprint)
- THE TUTORIAL (Phase B) — still PINNED; this sprint is the mechanics-settling it waited for. It un-pins as the NEXT thread, teaching finished verbs via the Depart / Guided Departure fork at The Railhead.
- RELIGHT RETROFIT of the backdrop — parked ("light as performance" for arrivals = future thread).
- Editing `/tools` or `/shared` — extraction candidates are proposals only.
- The train-customization fork · resolution bump · AUDIO (the game is silent — its own future thread) · tappable station buildings · monetization/retention anything · multiplayer/cloud saves · NG+ keepsakes.

## open-questions
- Ratify or swap the names ledger (non-blocking — names are skin-deep by design).
- THE CINDER SEAM vs THE GLASS WASTES (Seam recommended: the Warlord's home should burn).
- Ghost Hauler in or out (recommended IN).
- Postgame = free-roam + pretenders this sprint; NG+ parked — confirm.
