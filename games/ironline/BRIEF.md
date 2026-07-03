# BRIEF — IRONLINE
version: v1.6
date: 2026-07-03
status: built — awaiting human QA (all six waves landed; no deploy until the human calls it)
changed-since-last: + THE PROW (surgical addition; supersedes v1.5 same-day as the standalone contract). The engine's drawn-but-jobless cowcatcher becomes an upgradeable BOW FITTING with two cycleable fits — RAM PLOW (hazard lane: mines/debris/storm) vs SHIELD PLATE (combat lane: frontal fire/breach) — mitigating oil-reducing and forward events. Hard-capped by new design law 8: NO ONE IS INVINCIBLE ON THE OCEAN (mitigation never total; broadsides, bait, sabotage, and deep-water surges bypass the prow entirely). Completes the rig's two-ended identity: THE PROW protects the crossing; THE REARGUARD protects the loss. Everything else stands from v1.5 (Places + Range + Defeat loop).
---

## vision
The rail-ocean becomes a CONTINENT you can point at — and an OCEAN you must be rigged for. Every stop is a drawn place with a reason to exist. Between them: the open water. "The wasteland is connected by miles of endless rails — but unless you have enough oil to make it from station to station, you'll be adrift in the endless sea of rails, in a wasteland that wants to loot you and then blow up your train." (— the human; the thesis.) Range is seaworthiness. The consist is the rigging. The PROW cuts the water; the REARGUARD holds the line; defeat loots you and leaves you a reason to ride back out. Wry, lonely, warm; lamps on the spine, dark water beyond, scars on the rig that tell where you've been.

## the state we build from
- v1.2 BUILT end-to-end on the working branch (harness-green, 77 assertions), NOT deployed — human QA gates deploy. Deploy sequencing = open question; building proceeds on the branch either way.
- Standing systems extended: THE STOP, the building grammar, station personalities, the ledger, the contract board, node graph + route board, fog-of-war map, clans/rep, captains + pretenders + stand-aside, SAVE_V=6 migrate chain, behavioral harness, Playwright DOM QA, the exporter. The engine's cowcatcher plow exists DRAWN and jobless — the Prow gives it its job (the drawFortress pattern).
- Known weak loop this brief retires: defeat currently PAYS the player (pity scrap). Dead on arrival.
- THE RAILHEAD render protected: byte-identical unless briefed. Noodle's gold stays his.

## the sprint's design laws (read first)
1. THE WORLD IS THE INTERFACE. Rolling = the window seat; docked = the screen IS the station (banner + 2–4 anchored chips, one chip = one compact panel; the sheet dissolves).
2. EVERY PLACE ANSWERS "WHY IS THIS HERE?" Halts have survival logic, stations industry, capitals walls, far nodes legends.
3. EACH NODE TYPE TAXES A DIFFERENT POCKET. Wrecks: troops. Hazards: hull-or-supplies. Blockades: scrap-or-blood. Dark stations: nerve. Deep crossings: OIL. Stations refill.
4. HARD PATHS MUST PAY: deep-route EV > spine for a PREPARED rig, < for unprepared. Preparation has FIVE axes now: guns, troops, holds, range, THE PROW.
5. SCALE IS INFORMATION. Tier reads from the window; a leg's thirst reads from the chart; a rig's fit shows on its bow and stern.
6. RANGE IS SEAWORTHINESS. Fuel per leg by distance; oil cars = tank + regen; deep crossings need TWO oil cars; the chart never hides a cost.
7. DEFEAT IS A STORY, NOT A SUBTRACTION. Lose and the wasteland loots you — manifest, cripples, marked prizes, bolder clans. WOUNDED, NEVER ERASED: engine, Rearguard, crew core, and a way back — always. No pity payouts; no dead spirals.
8. NO ONE IS INVINCIBLE ON THE OCEAN (new): mitigation is real but NEVER total — the Prow's reduction hard-caps (tunable, ~2/3 at max fit+level), and some event classes BYPASS it entirely (broadside fire, bait wrecks, sabotage, deep-water surges). The ocean always keeps its cut.
9. Standing discipline unchanged: wave-seam checkpoints; harness + Playwright + exporter stills per seam; depth-band law; save migration sacred; §3.6; /tools & /shared read-only; human eyes final on feeling.

---

## WAVE 0 — ENABLERS + THE RANGE REWORK + THE PROW
- A–Z MICRO-FONT (+ digits): full set (name-boards, liveries, chart labels, "GO BACK").
- SECOND BUILDING RANK: band-4 rear rank for capital mass. Trace test holds.
- ROUTE PROFILE DATA MODEL: every edge {danger 1–3, reward tag, dryness, FUEL COST}; deterministic from seed + depth + length.
- THE RANGE MODEL: fuel per LEG by distance; OIL CAR = tank + regen per level; range always visible; deep crossings exceed single-tank range by construction (harness law: 1-oil attempt = guaranteed adrift).
- FUEL INTEGRITY substrate: the tank can be BREACHED (leak state: drain per mile, patch timers). Beats surface Wave 3.
- OVERRUN SEVERITY MODEL: severity = f(WHERE: spine < dark < deep/adrift · WHO: swarm < blockade < captain · REARGUARD level). Beat lands Wave 3.
- **THE PROW** (new — bow fitting, a fixture like engine/Rearguard, NOT a slot): upgradeable by level; TWO FITS cycled for scrap (the weapon-refit pattern): **RAM PLOW** — hazard lane: mine-strike deflection chance, debris cleared, storm/track damage eased, small ram bonus in collision beats · **SHIELD PLATE** — combat lane: frontal fire damage and frontal breach chance reduced. Mitigation scales with level under law 8's hard cap; BYPASS CLASSES (broadside, bait, sabotage, deep surge) roll unmitigated, always. The existing drawn cowcatcher = the level-1 visual (job given, pixels honored).
- STARTING CONSIST TRIMMED (fresh games only): ENGINE (basic prow) + [OIL CAR, GUN CAR] + CABOOSE. Farm out of standard issue.
- THE CABOOSE -> THE REARGUARD: garrison per level, rear defense, small salvage continuity, defeat mitigation. MIGRATION: caboose levels convert 1:1 — harness-enforced.
- DoD: font renders any name; two-rank trace passes; profiles/fuel/leak/severity/PROW math deterministic (cap + bypass classes verified); fresh boot fields the new consist + basic prow; caboose migration round-trips; SAVE_V steps once (crippled/prize/leak/prow state in schema).

## WAVE 1 — THE SETTLEMENT LADDER (scale revised UP)
- **HALT** (on-brand survival logic): WATER STOP · STRIP SIDING · SIGNAL BOX · WINDPUMP WELL · TOLL SHACK gone honest · **OIL PUMP** (the resupply island — sells fuel; clusters on the spine; the dark country is dry; deep crossings have none). 1–2 structures + 1 figure + 1 offer.
- **STATION** (a TRUE settlement, Railhead-class): 5–8 structures — personality anchor + cluster (YARD → shed/freight/crane · MARKET → stalls/awnings/scale-house · OUTPOST → signal/fence/watchpost · CHAPEL → lantern-shack/bell/yard-of-markers) + homes + infrastructure, region palette. 2–4 figures; ONE tappable local carries the rumor/need.
- **CAPITAL** (one per region — a WALLED TOWN, may out-scale the origin): grand train-shed anchor (recover from git), second rank engaged, 8–12 structures, SCRAP PALISADE + watchtowers + RAIL GATE (arrival beat: through the wall, then the town). 5–8 figures. Full personality spread.
- **THE RAILHEAD** — singular. Capitals may out-scale it; nothing out-homes it.
- DoD: exporter still per tier per region (incl. oil pump); tier readable at a glance; trace test everywhere; origin byte-identical.

## WAVE 2 — STATION LIFE (mechanics by tier + world-as-interface)
- CHIPS: DOM, brand-styled, ANCHORED TO MEANING (Market by the stalls, Board by the door, Services by the yard, FUEL by the pump, Depart in its lane). One chip = one panel. The sheet retires.
- SERVICES BY TIER: Halt = 1 offer + top-up. Station = market + board (2–3) + personality service — YARDs repair CRIPPLED CARS, patch breached tanks, **and refit/upgrade THE PROW**. Capital = everything + best spread + CAR MARKET + signature service: THE JUNCTION's scrapworks · OLD EXCHANGE's auction · THE RIBYARD's bone-choir · **SLAGSIDE's forge (weapon AND prow refit discount)**.
- CAPITAL KEEPERS: THE YARDMASTER · THE AUCTIONEER · THE CURATE · THE FORGEMASTER — tappable, region story voice, gate intel, one wry line per visit.
- STATIONS REMEMBER YOU: visit counter → greetings, friendlier spread with familiarity, network gossip — including your defeats and your reclamations.
- STATIONS HAVE A PULSE: seed-deterministic NEED → demand spike + board reflects it; the tappable local delivers it.
- WORK-BACK PATHS: every station always offers one no-hold contract (escort/fare) — the way back after an overrun, never charity.
- DoD: dock anywhere, never see a full sheet; fuel, repairs, and prow work purchasable exactly where the world says; a returning player greeted as one — scars and all.

## WAVE 3 — THE SPACE BETWEEN (edge beats, ADRIFT, THE OVERRUN, fuel drama)
FLOW TEMPLATE (all non-station nodes): approach → CHOICE CARD (2–3 options, costs visible) → resolution on-canvas → consequence.
- **WRECK** (troops): party / strip / pass. Sometimes bait (BYPASSES the prow — law 8). Deep wrecks 2×. Fuel drums in reward tables.
- **DRIFTERS** (seats/food): take / provision (rep) / pass. May trade fuel.
- **CARAVAN MEET**: Caravaneer pop-up market; fuel deals.
- **THE TANKER WRECK**: siphon (timed — the fire draws raiders) / torch-and-run (rep) / pass.
- **HAZARD LEG** (the SHORTCUT): push / mitigate / turn back. DUST STORM · MINEFIELD · WHITEOUT · EMBER GALE. Mine strikes and blockade fire can BREACH THE TANK. **RAM PLOW mitigation applies here (deflection/clearing rolls, shown as a prow mark + ghosted danger pip on the choice card); the deep-water SURGE variant bypasses (law 8).**
- **BLOCKADE** (scrap-or-blood): pay / fight (SHIELD PLATE eases frontal fire; their broadsides bypass) / STAND-ASIDE post-captain. Clan boldness raises tolls where a clan recently overran you.
- **DARK STATION** (nerve): no services, big salvage, squatters; rare finds incl. derelict car hulls.
- **LANDMARK** (one per region, one secret each): THE SUNKEN LINER · THE FALLEN SPAN · THE LEVIATHAN GATE · THE CRUCIBLE.
- **THE DEAD PUMP**: dry mid-crossing pump, "GO BACK" in the micro-font. Sometimes a trickle. Sometimes bait.
- **THE LEAK**: a breached tank drains fuel PER MILE until stopped — fuel crew patch over rank-scaled time, or HALT to patch now (exposure vs range). Drip fx + gauge flash + ticker. The range model's drama engine on deep water.
- **ADRIFT** (fuel = 0 mid-leg): the world halts on open rail — wrong silence, escalating waves. Three outs, costly, never save-fatal: JURY-RIG · DISTRESS FLARE (rep-gated gouge) · STAND AND FIGHT (tow at brutal cost). Losing adrift = heaviest OVERRUN tier.
- **THE OVERRUN** (the defeat beat; retires the pity scrap): hull 0 → you WATCH the looting (boarders swarm, crates walk), then the MANIFEST CARD. Tiers: 1 SKIRMISH LOSS (cargo cut + skim, limp on) · 2 STRIPPED (hold emptied; contracts aboard FAIL + rep ding; ONE car CRIPPLED — charred/boarded, dead until YARD repair; towed to the nearest friendly station behind you) · 3 TAKEN (rare; deep/captain/adrift): tier 2 + a car UNCOUPLED AND TAKEN or a hero CAPTURED → spawns a MARKED PRIZE. NEVER the engine, NEVER the Rearguard — every overrun ends on "the Rearguard held." Rearguard level mitigates one tier. The floor (law 7) always holds.
- DoD: each node taxes its pocket; adrift + the leak reachable, survivable, terrifying; overruns play at all tiers in the harness; prow mitigation + bypass classes verified in beats; the pity scrap is gone from the codebase.

## WAVE 4 — THE CONTINENT (chart, deep crossings, far nodes, MARKED PRIZES)
- **THE SURVEYOR'S CHART**: hand-inked sepia (band-9): four terrain masses W→E, rail inked, landmarks drawn, capitals bold, gates as terrain chokes, THE TERMINUS a black mark far east. Fog = blank parchment. Deep crossings = dashed ink + dry-drum glyph + "HERE THE LINE RUNS DRY." Every known edge: fuel cost + danger pips + reward tag.
- **THREE ZOOMS**: CONTINENT → REGION (spine vs dark country distinct) → LEG (tap: type/danger/reward/fuel).
- **GENERATOR RESHAPE — lit spine, dark country**: main line (stations/halts/pumps/tolls) + deep branches (dry, dangerous, rich). Dead-ends always reward, always return.
- **MARKED PRIZES**: a TAKEN car / CAPTURED hero appears as a marked clan node ("they're flying your gun car's colors at the Gallows Bend blockade"). Reclaim BY FORCE; reclaimed cars carry a permanent SCAR/TROPHY; rescued heroes return with a new line. Prizes persist; clans may relocate them one node if you dawdle.
- **CLAN BOLDNESS**: the clan that overran you gouges bolder in its region for a stretch — the mirror of stand-aside; a reclaimed prize deflates it.
- **THE FOUR FAR NODES** (hand-built, TWO-OIL by construction): 1. THE MOTHBALL YARDS (Rust Flats, far Long Shallow) — the old world's parked fleet; the Yard-born who've never seen a train move; salvage epic; derelict hulls; THE YARDBORN. 2. THE FIRST ENGINE (Dead City, beneath the Fallen Ring) — the Grand Terminal and the first locomotive, polished by no one anyone has met; the most reverent beat; THE FIRST LANTERN + one quiet truth about what broke the world. 3. THE FAR LIGHT (Bone Reef, past the White Drifts) — a light kept forty years because "a train always comes, eventually"; THE PERMANENT CHOICE: take THE KEEPER (unique hero, lantern buff) and the light goes dark forever, or leave them keeping — a standing beacon + Caravaneer trickle. 4. THE WELLHEAD (Cinder Seam, the heart of the Burn) — the last true well, feeding ONE customer: THE TERMINUS. Raid or deal; the fuel line is cut either way — the finale THINS, Seam oil collapses, pump halts light the Seam spine.
- SUB-AREAS: THE LONG SHALLOW · THE FALLEN RING · THE WHITE DRIFTS · THE BURN. KNOWLEDGE AS A RESOURCE: rumors/blessings/SIGNALWOMAN reveal; keepers hint at the far nodes.
- **THE GAZETTEER** in DESIGN.md: regions, sub-areas, capitals + keepers, landmarks + secrets, halt catalog, clan territories, far nodes + storylines, the range model, OVERRUN tiers + prize rules, **the Prow's fits + law 8's bypass classes**. The world's bones, written down.
- DoD: a stranger reads the chart in ten seconds; far nodes visibly demand two-oil rigging BEFORE commitment; Far Light choice + a marked prize persist in save and chart.

## WAVE 5 — BALANCE + POLISH (the laws enforced)
- ECONOMY + RANGE + LOSS + PROW PASS: laws 4/6/7/8 in numbers — deep EV inequality holds; two-oil gate holds; adrift/leak outs costly-but-fair; loss economy tuned (an overrun HURTS but tier-2 recovers in ~2–3 legs of honest work; tier-3 reclamation feels like revenge, not chores); **prow cap enforced (~2/3 max, tunable) and bypass classes statistically verified — a maxed prow still bleeds on the ocean**. Targets documented in DESIGN.md.
- THE REARGUARD'S FORTRESS LADDER + **THE PROW'S LADDER** (visual, band 5): red caboose → plated rearguard → keep-on-wheels; basic cowcatcher → toothed ram plow / riveted shield bow (fit-distinct silhouettes, level detailing in the material language). Bow and stern read as the rig's hard ends. CRIPPLED-CAR art state + reclaimed SCAR mark in the same pass.
- Beat-frequency pass (no identical beats back-to-back where the generator can help).
- Harness + Playwright: chips, choice cards per node type, tier composition, chart zooms/taps, stand-aside + boldness, familiarity/pulse, RANGE (per-leg math, leak drain/patch, adrift entries/exits, two-oil gate, caboose migration), OVERRUN (three tiers, Rearguard mitigation, the floor), PROW (fit cycle, cap, bypass classes, card surfacing), marked-prize round-trip, Far Light persistence.
- Exporter stills: tier/region matrix + oil pump, four landmarks, FOUR FAR NODES, capital wall-arrival, Rearguard ladder, **Prow ladder (both fits)**, a crippled car + a scarred reclaim, chart at three zooms, one ADRIFT frame, one OVERRUN frame — human-blessed.
- DoD: laws 1–8 verifiably hold; SAVE_V stepped once with migration; The Railhead byte-identical.

---

## names ledger (PROPOSED — swap freely, non-blocking)
Capitals: THE JUNCTION · OLD EXCHANGE · THE RIBYARD · SLAGSIDE. Keepers: THE YARDMASTER · THE AUCTIONEER · THE CURATE · THE FORGEMASTER. Landmarks: THE SUNKEN LINER · THE FALLEN SPAN · THE LEVIATHAN GATE · THE CRUCIBLE. Far nodes: THE MOTHBALL YARDS · THE FIRST ENGINE · THE FAR LIGHT · THE WELLHEAD. Figures/relics: THE YARDBORN · THE KEEPER · THE FIRST LANTERN. Sub-areas: THE LONG SHALLOW · THE FALLEN RING · THE WHITE DRIFTS · THE BURN. Systems: THE REARGUARD · THE OVERRUN · MARKED PRIZES · THE LEAK · THE TANKER WRECK · THE DEAD PUMP · **THE PROW (fits: RAM PLOW · SHIELD PLATE)**.

## out-of-scope (this sprint)
- THE TUTORIAL (Phase B) — pinned; un-pins AFTER Places ships.
- Hero permadeath (wounded/captured only) · station ownership · per-station quest chains beyond contracts/favors/needs · a third oil tier · a third prow fit · new combat systems beyond blockade/Wellhead/reclaim setpieces · audio · resolution bump · customization fork · Relight retrofit · /tools edits · monetization · multiplayer.

## open-questions
- DEPLOY SEQUENCING (unchanged, non-blocking): deploy v1.2 after QA first (director's lean), or ship together?
- Ratified-in-brief unless flagged: capitals out-scale origin; farm out; caboose 1:1 conversion; Far Light permanence; no hero permadeath; prow cap ~2/3 (builder tunes under law 8).
- Tier-3 TAKEN frequency: rare enough to be a story, common enough to be feared — builder tunes, director reviews in playtest.
- Two prow fits confirmed as the right count? (A third fit is explicitly parked — the ocean can deepen later.)
- Names ledger swaps, if any.
