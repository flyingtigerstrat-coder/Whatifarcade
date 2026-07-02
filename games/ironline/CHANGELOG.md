# CHANGELOG — IRONLINE
phase: in-code
> Standardized fields (GOVERNANCE §6), newest on top. This is the canonical, current changelog.
> The director kept it in Drive during chat-prototyping (entries below from CHANGELOG_ironline_v0.1);
> the builder continues it here now that work has moved to code.
> Deep PRE-PROCESS engineering history (heroes, crew, the economy, the camera, per-car detail — the
> chat-only era before the pod workflow) is preserved verbatim in `IRONLINE_CHANGELOG.md` and explained
> in `IRONLINE_HANDOFF.md`. Read those for the "why" behind the engine.

---

## 2026-07-02 · session 11 (cont.) — Wave 4 · THE LINEBREAKER: the line gets a story
DECIDED: The gates have names now — SPOKE, FOREMAN FLAK, DEACON MARROW hold their regions' gates (taunts on brake-lock via the ⚔ region banner, clan pennants on the lead engine, death lines), and THE TERMINUS is held by THE LINEBREAKER aboard the re-dressed Fortress (the orphaned drawFortress() finally gets its job — it faces LEFT, into your headlamp). The final fight breathes in three phases: outrider bays at 66%, the man himself at 33% (faster guns, crawlers, burning hull). The kill sets linebroken (SAVE_V=6): the loop home opens off the Terminus gate (free-roam forever), pretenders squat re-fought gates at 0.75×, and station talk changes. RUMORS: ~35% of station arrivals drop a region-keyed story line, every set pointing obliquely at the Linebreaker.
TRIED: Verified the Terminus face-off composition against the live game's standard boss framing (rendered both) — the near-lane overlap is the shipped language, not a bug.
PARKED: Captain skins beyond the pennant (Wave 6 boss-duel dressing); post-win pretender variety.
CHANGED: nodeEdges grows the loop edge; drawBoss splits final path to drawTerminus(); backdrop blends toward navT.to.reg (fixes the loop leg); exporter terminus subject (+--reg captain variant); harness 61 -> 69 assertions.
OPEN: Human eyes on the Terminus fight pacing (a phase-2/3 balance read needs a real playthrough). Wave 5 next: +8 heroes, tap-to-inspect, Noodle tappable.
FEELING: Every arcade game needs a face at the end of it. Ours idles at the last gate, and he knew we were coming.

## 2026-07-02 · session 11 (cont.) — Wave 3 · THE TEETH: combat learns to bite back
DECIDED: Damage types go LIVE — enemies carry armor classes (light/armored/swarm) and gunVs() prices the matchup: blast blooms on plate (×1.5), kinetic sparks off it (×0.7), fire eats swarms (×1.6); the wave log narrates the matchup so the refit choice teaches itself. New enemies: CRAWLER (tracked hulk leading armored columns, clan-banded), MINELAYER (an unrepelled armored wave seeds the rail — next wave opens with mine damage), bike SWARMS, and the BOARDER WAGON (blockade legs, eff≥6): a boarding meter vs troops() — full meter cuts a hold open and steals scrap; repelling leans 75% toward a war hero. MARK TARGET tap verb (+30% focus, pulsing chevron). Troops become manpower: mine-clearing, send-a-party sweeps, OUTPOST wall duty, escort rifleman bonus. Factions: Dispatchers rep (contract pay +2%/★) + Caravaneers rep (market ±1%/★, friendlier traders); CLANS stay enemies-with-names, zero bookkeeping. THE GHOST HAULER: rare, pale, silent — leaves a relic if the holds have room. SAVE_V=5 (rep).
TRIED: Crawler draft 1 was a black slab — dark-on-dark tracks; v2 lifts the hull ramp, rolls visible track links, and seats road wheels in the shroud.
PARKED: Clan full-repaint of raider/ptrain sprites (Wave 6); dt-colored fx (Wave 6).
CHANGED: wave() rebuilt (class roll, clan flavor, mine seeding); boss/ptrain dps through gunVs()+markMult(); boarding meter + grapple lines drawn band-7; harness 52 -> 61 assertions (version pins now track SAVE_V).
OPEN: Human eyes on the boarding meter fight and the mark tap on a phone. Wave 4 next: THE LINEBREAKER — gate captains, rumors, and THE TERMINUS.
FEELING: The wastes stopped being scenery tonight. They have names, grudges, and boarding hooks.

## 2026-07-02 · session 11 (cont.) — Wave 2 · THE LEDGER: stations get an economy
DECIDED: Stations now have work to offer. 5 trade goods with a REGIONAL spread (base × GMKT supply-demand × per-node jitter, ▼/▲ visible on the board — trading is a read, not a memory test); CARGO CAR pools holds (4+2/lvl, crate-stack + side gauge show the fill); PASSENGER COACH seats fares (2+1/lvl, riders pay on disembark; named specials pay 5× and ride hooded in the window); station PERSONALITIES (2 of YARD/MARKET/OUTPOST/CHAPEL, seeded — the Railhead always teaches the trade) pin offers and open the market; DISPATCHER BOARD inks up to 2 contracts (haul ≈1.7× spot at the target region · escort N legs unbroken). Losses scatter passengers and reset escort clocks (navFail). SAVE_V=4 (clean ledger migration). Crew grows Quartermaster (+scrap%) and Conductor (−fuel%).
TRIED: Proof consist (cargo+coach+gun) rendered at dusk — tarp, crates, lit berth windows and the hooded special all read at 320×180.
PARKED: Special-passenger mini-quests beyond the fare (Wave 5 hero hooks); market styling pass (Wave 6).
CHANGED: renderDepot gains market + contract sections (trades keep the panel open; offers still close it); navArrive ticks escorts and fares; depot handler split (data-g/data-cact/data-k); exporter --cars; harness 43 -> 52 assertions.
OPEN: Human phone QA on the depot panel (market rows + board) and the new weld buttons. Wave 3 next: damage types live, boarding, troops-as-manpower, factions.
FEELING: The rig used to carry guns and hope. Now it carries grain somebody's waiting for.

## 2026-07-02 · session 11 — Wave 1 · THE SPINE: the rail ocean becomes a map
DECIDED: The journey is now a place. Four REGIONS (Rust Flats -> Dead City -> Bone Reef -> Cinder Seam), each a seeded node graph — 6/6/6/7 columns, 1–2 forward edges per node, named anchors at entry/mid/gate, node types S station · E event (light, per ratified call 4) · H hazard (4-wave leg) · B blockade (elite leg) · G gate (warlord boss, tier = region). Depart targets a chosen edge (labeled fork buttons in the travel strip + tappable lit nodes on the Map tab — ratified call 3); a lost leg leaves the rig where it departed. Difficulty rebased: eff()=reg*6+col drives every combat/economy formula — position is threat, journeys are flavor. The MAP owns the biome (biomeIdx-by-distance retired); gate legs blend the next region in across the back half of the crossing. SAVE_V=3: v2 saves migrate veterans onto the graph at one region per 5 crossings (ratified calls 1+2), origin dock kept only at the Railhead.
TRIED: The Cinder Seam ships as placeholder art (char ground, ember haze, seam-glow fissures, ember-tipped stacks, ash-heavy weather) — proof stills at dusk + night read hot and dark; Wave 6 does the full pass. Railhead render byte-IDENTICAL to HEAD after the backdrop rewiring.
PARKED: Event depth (Wave 3), gate captains + Terminus story (Wave 4), Seam full art + region-personality stations (Wave 6).
CHANGED: go()/finish()/bossKill() rewired through navArrive(); openDepot takes a name; auto-releasing halts at non-station nodes (stop.auto); renderMap = SVG node graph (tap-to-choose forks); upd() fork chooser; exporter --reg; harness 29 -> 43 assertions (graph shape/determinism, eff, leg movement, v2->v3 placement, v3 round-trip); DESIGN.md "The Spine" canon.
OPEN: The Map tab + fork buttons are DOM — human eyes on a phone are the judge. Wave 2 next: station personalities, trade goods, cargo/passenger cars, contracts.
FEELING: For ten sessions the rig crossed a treadmill. Tonight the treadmill became a country with borders — and a last gate with something waiting behind it.

## 2026-07-02 · session 10 — THE MATURITY SPRINT opens: BRIEF v1.2 promoted, Wave 0 done
DECIDED: BRIEF v1.2 (seven waves to a finished realm) promoted, status -> building. Four plan calls ratified at check-in: (1) two-step save upgrade — Wave 0 is invisible versioning plumbing, veterans get placed onto the map when the map exists (Wave 1); (2) veteran placement = one region per 5 completed crossings (the old boss-every-5th rhythm translated); (3) branch choice = labeled Depart buttons in place + map-tap equivalent; (4) EVENT nodes ship light in Wave 1 (existing rewards), gain their troops-content teeth in Wave 3. WAVE 0 BUILT: SAVE_V=2 + stepwise migrate() chain on top of the shim (v1 live saves normalize to v2; policy: a rig is sacred — unknown versions pass through, load reads defensively, never wipes; only unparseable blobs fall back to fresh boot).
TRIED: Visual-identity check against a stale pre-choreography baseline flagged a false DIFFERS (the exporter camera changed at ba3e65c); re-based against HEAD proper — byte-IDENTICAL, Wave 0 DoD holds (no visual change).
PARKED: art-spec/ reorganization (nothing to move without churn — the art is inline procedural); pipeline extraction candidates recorded in DESIGN.md as proposals instead.
CHANGED: Harness promoted into the repo as ironline-qa.cjs and extended 20 -> 29 assertions (choreography + save schema); DESIGN.md gains "Save schema" canon + the extraction-proposals ledger.
OPEN: Wave 1 — the spine: seeded node graph, four regions (Cinder Seam placeholder), Depart-along-edges, difficulty rebase to region tiers, map tab as the graph, v2->v3 migration placing veterans. Map tab is DOM — human eyes judge it on a phone.
FEELING: The plumbing nobody will ever see is the promise every player keeps: nobody loses a rig. Now we draw the map.

## 2026-07-02 · session 9 — SHIPPED to whatifarcade.com + live hotfixes
DECIDED: Phase A deployed (PR #21) with a standalone localStorage save shim (window.storage was undefined on the live site — saves now persist for real players; brief -> shipped). Live QA with the human's eyes caught three bugs, hotfixed same-day: (1) landscape DOM chrome (route pill + ticker) stacked on the canvas banner — the banner now draws only in portrait/immersive where no chrome announces the place, and the landscape ticker got readable (17px, darker backing) (PR #22); (2) the foreground wreck-tire was CAR-SIZED — broke the world's proportions at any speed — retired entirely (trackside debris lives in the deb cells); (3) the floating DEPART button sat on top of open panel text in landscape — the panel now reserves a lane for it.
TRIED: Verifying the live domain from the sandbox (network policy blocks it) — Pages deploy success per merge SHA is the authoritative signal instead.
PARKED: —
CHANGED: drawFgWreck removed; canvas banner layout-gated; landscape ticker/panel CSS; save shim.
OPEN: The human plays a full loop live (origin -> depart -> crossing -> depot -> return). Then the parked threads, in order: node-graph map first.
FEELING: Shipped, and the first live players start at the lamplit platform. The machine that makes games made one.

## 2026-06-23 · session 8 — the arrival choreography: the world comes to rest
DECIDED: Built THE STOP — the reusable arrival/departure state machine (S.stop: arriving/docked/departing in tick). Arriving = linear decel to rest with the station gliding in on the decel's EXACT integral (settles precisely as the wheels stop); docked = spd 0 (wheels frozen, smoke thins to nothing, tumbleweed still drifts — still, not frozen); departing = ease-in spin-up, the settlement slides away west, lamps left burning. BEGIN-AT-ORIGIN live: a fresh game boots docked at The Railhead with the Dispatcher's greeting in the ticker; depart gets his send-off ("We'll keep a lamp burning"). Depots now physically HALT the world too (visual-less stops). Save/load/reset extended together (origin flag persists a pre-departure dock; load is authoritative).
TRIED: Headless behavioral harness (boots the real script, drives tick manually) — 20 assertions across boot/depart/arrive/depot/save. Caught one real gap: load() didn't clear stale dock state (fixed; load authoritative). Exporter gained --sx/--lamp choreography keyframes + live-matched idle camera.
PARKED: Fortress-skin smoke plume doesn't yet respect rest (fresh games have no skin — cosmetic, note for the skin pass). Guided departure = Phase B, still pinned.
CHANGED: tick spd is now choreography-aware; smoke emission gated on spd; go/openDepot/depot-leave/reset/boot wired; DESIGN.md "The stop" section added.
OPEN: Human plays the live file — fresh boot, watch the rest, press Depart, feel the pull-out. Phase A definition-of-done rides on those eyes.
FEELING: You press Depart and the town slides away with its lamps lit. The journey finally begins somewhere.

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
