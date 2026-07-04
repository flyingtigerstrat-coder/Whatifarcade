# CHANGELOG — IRONLINE
phase: in-code
> Standardized fields (GOVERNANCE §6), newest on top. This is the canonical, current changelog.
> The director kept it in Drive during chat-prototyping (entries below from CHANGELOG_ironline_v0.1);
> the builder continues it here now that work has moved to code.
> Deep PRE-PROCESS engineering history (heroes, crew, the economy, the camera, per-car detail — the
> chat-only era before the pod workflow) is preserved verbatim in `IRONLINE_CHANGELOG.md` and explained
> in `IRONLINE_HANDOFF.md`. Read those for the "why" behind the engine.

---

## 2026-07-04 · session 17 (cont.) — the window scales, and the hunt reads on screen (1 + 2, ratified)
DECIDED: Two ratified recommendations built. THE WINDOW SCALES WITH THE PRIZE: a warband's engagement window is now 10s + 3s per gun car — a 2-gun raiding party gives you 16 seconds, a 3-gun heavy convoy 19 — so the richest hunts linger longest and the math stays fair (more hull to chew through, more time to chew it). THE HUNT READS AT A GLANCE: a cream WINDOW STRIP drains in two places — a 1px line under the convoy's own hp bar, and a 2px strip riding over the bottom duel bar (red rises = kill progress; cream falls = time left). The read the mechanic asks for — "can I finish this, or do I let them go?" — is now on the screen, not in the log.
TRIED: Harness 135 green (wnd set by the REAL spawn path = 10+guns*3; a heavy warband still engaged at 17s; flees when ITS window closes). Playwright mid-hunt and window-closing stills — the closing frame reads perfectly: red bar two-thirds up, cream sliver almost gone. One parse scare: an inline // comment dropped mid-single-line spawn statement swallowed its tail — same class as the old hurt() bug; caught by the parse check in seconds.
PARKED: The mark-holds-them tweak (+3s for a marked convoy); THE ONE THAT GOT AWAY (grudge warbands persisting in the save) — the flagship, awaiting the human's call for its own session.
CHANGED: elite spawn gains wnd; escape check honors it; drawPElite + the duel bar gain the draining strip.
OPEN: Human eyes on the strips in motion at phone scale — is 1px over the convoy enough, or should it thicken?
FEELING: You watch two lines race — their hull falling, your window closing — and the whole hunt is that race, legible at arm's length.

## 2026-07-04 · session 17 (cont.) — the parting shot + fled bleeding (both ratified)
DECIDED: The human liked both parked ideas — built. THE PARTING SHOT: a fleeing warband cracks one last round off the plate as it pulls ahead — real damage, real flash, but floored at 1 hull, because the law holds: the fight is OVER and only a fight they finish can overrun you. An insult, not a wound. FLED BLEEDING: a warband that escapes below 35% hp sheds a burning car on the way out — you strip it at speed for ~70% of a leg's base scrap. The hunt half-pays even when the quarry lives, so pouring fire into a fight you can't finish is never wasted.
TRIED: Harness 132 green — the two new laws asserted (parting shot floors at 1, never raises the overrun; bleeding flee pays).
PARKED: Window scaling by warband size; the grudge return of the one that got away — proposed to the human this session.
CHANGED: the elite escape branch gains the shot + the shed car.
OPEN: Feel-check both beats in a real hunt.
FEELING: They leave the way bullies leave — one last shot over the shoulder, and sometimes a trail of burning iron that says you ALMOST had them.

## 2026-07-04 · session 17 — THE HUNT, NOT THE TIMER: enemies escape, overrun means DEFEATED — and the freeze is dead
DECIDED: The human's playtest reframed the duel: an enemy convoy is a HUNT with a closing window, not a countdown you fail. The law now: kill them inside the window and the loot is yours; outlast the window and THEY GET AWAY (their loot rides with them — no overrun, no punishment beyond the hull they chewed); THE OVERRUN fires ONLY when they defeat you (hull to zero). Elite warbands get a 16-second engagement window (raider trains keep their short 3.6s pass; boarder wagons cut their grapples and swing away if your rails hold the full window). A fled warband unfreezes the leg clock and marks the leg — arriving at a blockade node after they escaped now tells the truth ("nothing to strip") instead of paying you for wrecks that never burned. Gate warlords still fight to the death — a gate is a wall, not a passerby — and conform to the law already: no timer, overrun only at hull zero. THE FREEZE FOUND AND KILLED: theOverrun's call site in the raider-train tick ended with a bare `return` — which exited tick() BEFORE requestAnimationFrame re-armed. One overrun from a raider train and the whole game hard-froze. The return is gone; audited every other theOverrun caller (wave, bossEscape) — clean. ALSO (human call): welding a new car costs SCRAP ONLY — the food cost gated growth behind a farm car you might not own.
TRIED: Real-browser Playwright proof (the harness can't catch a dead rAF loop — it drives tick() by hand): elite guns the rig down mid-leg -> overrun card up, world still ticking (dT 1.5s live), Ride On -> hull 35%, Depart enabled; warband at window edge -> flees, ptFled set, leg clock resumes; weld card at 0 food reads "40 scrap" and stays enabled. Harness 130 green (hunt-window, escape-resumes-clock, overrun-on-defeat-only, world-ticks-after).
PARKED: A parting shot from a fleeing warband (one last insult round); partial salvage for a warband that flees below 30% hp — human's call on both.
CHANGED: ptrain escape branch unified (elite 16s window + ptFled flag); the bare return removed; go() clears ptFled; navArrive 'B' honesty; carFoodC retired (build cost, card label, disable gate).
OPEN: Human re-test: does the 16s window feel like a hunt? Is scrap-only welding the right growth pace?
FEELING: They come alongside, guns talking, and now three stories can end it: their wreck, their dust trail, or your silence. Only the last one costs you the manifest.

## 2026-07-03 · session 16 (cont.) — SIGNAGE TRUTH: the fuel sign hangs on an actual fuel station
DECIDED: The human called it — FUEL was still hanging over a grain silo. The fix is a LAW now, enforced in the composer, not the chips: a sign only hangs where its building stands. Every full station composes the OIL-PUMP RESUPPLY ISLAND (rooftop tank, hose gantry, drum row, live gauge) in the old silo slot — every station sells fuel, so every station HAS a fuel station. Every capital composes MARKET STALLS (the market chip always shows there — at the anchor spot when market is its personality, inside the wall otherwise) plus the pump replacing the generic shack. THE RAILHEAD's silo slot becomes its own pump island — the fuel sign lands exactly where it always did, but the building under it is now honestly a fuel depot. Zero chip-logic changes: the existing hasB(bOilPump)/bStalls priorities simply start finding truth.
TRIED: Exporter proofs of all three tiers (no overlaps — the drum row clears the windpump derrick); Playwright docked shots: home portrait, station portrait, capital landscape — every FUEL stem points at a pump. THE RAILHEAD re-baselined INTENTIONALLY: new byte-identity md5 cbfc070ebd89cb65e821dc2ff7564d14 (the old baseline died with the silo, as it should).
PARKED: The Railhead's MARKET sign hangs on the freight house (home has no stalls row — the freight house IS home's trade point); landscape's half-width chip clamp still pulls far chips off their buildings — both flagged for the human's eye.
CHANGED: settleSpec station/capital composition; RH_BUILDINGS; DESIGN.md building grammar + the signage-truth law; harness +3 (126 green).
OPEN: Human eyes on the pump island at a docked stop — does FUEL read at a glance now?
FEELING: You don't read the signs anymore. You read the town — and the signs agree with it.

## 2026-07-03 · session 16 — full-game QA pass: the seams between waves, and HOME IS A FULL STATION
DECIDED: A cross-wave audit of every seam the sprint's waves share, then one build. THE SEAM FIXES: (1) an auto-halt can no longer roll out from under a live choice card — the stop holds until you answer, go() refuses to fire mid-choice, and renderDepot never wipes a live card; (2) ADRIFT's stand-and-fight now actually resumes the leg on survival (it was stranding the rig in idle mid-ocean); (3) halts are now truly one lamp and one trade (offers trimmed to 1 + the pump's pin) so the settlement ladder reads in the hand, not just the art; (4) the four capitals answer to ONE name everywhere (THE JUNCTION / OLD EXCHANGE / THE RIBYARD / SLAGSIDE — anchors, signature offers, and boards all agree); (5) a weeping tank now shows in the chrome — the fuel stat flashes warn while THE LEAK runs. THE HEADLINE: the origin was the only station that wasn't one. Now boot, reset, and the linebroken LOOP HOME all dock you at a WORKING Railhead — full depot (yard + market personality), signboard chips over the Railhead's own quarters (Services on the station house, Fuel on the silo, Market on the freight shed, Board on the platform), the route board live at the dock — and the loop home stages the TRUE Railhead (Noodle and all), never a composed settlement. Found and fixed in passing: fresh/reset rigs shipped their gun car without the port ladder (plvl missing — only loaded saves were normalized).
TRIED: Playwright drove fresh boot (both orientations), market/board at home, the Noodle tap, depart-from-home, and the full linebroken loop from THE TERMINUS back to a docked, lit Railhead. Harness grew to 123 assertions (home-station laws included); THE RAILHEAD render stays byte-identical; exporter regression clean.
PARKED: A home-only flourish (the Dispatcher's office as its own chip) — the yard personality carries it for now.
CHANGED: navArrive home special-case; openDepot stages nothing when already docked + raises the origin on the loop home; renderChips learns RH_BUILDINGS; boot/reset call openDepot; autosave covers the docked linger; slots init/reset gain plvl:1; capital names unified; leak warns in the fuel stat.
OPEN: Human eyes on the home-station feel: does THE RAILHEAD earn its name as a working town now? And the seam fixes under real thumbs (choice cards at auto-halts, adrift survival).
FEELING: The place the journey starts finally keeps a lamp lit like the places it goes. The loop home means something now — you dock where you began, and the town knows you.

## 2026-07-03 · session 15 (cont.) — THE LINGER: you stay docked until you say otherwise
DECIDED: The human ratified it — a station is a place you STAY. Offers no longer end the stop: each marks itself "done for this visit" and the town stays open; only DEPART ends it, and DEPART now lives ON the platform — the route board shows at the dock ("DOCKED AT X · THE LINE FORKS"), you choose a heading and the one button rolls you out through the full departure choreography. The "Press on without stopping" button retires. LINGERING PAYS: docked hull regen doubles and the crew eats warm (slow food trickle). THE TOWN ANSWERS TAPS: the LOCAL on the platform speaks region-flavored lines and — if you hold what the town NEEDS — leans in with a one-shot 1.6× buyout of your hold (rep with the Caravaneers); the STATION HOUSE deals gossip (rumors, your marked prizes on the wind, the good stuff for regulars).
TRIED: Playwright drove the whole loop: offer -> still docked (mode 'depot', chip lit, offer greyed) -> Depart -> mode 'run'.
PARKED: More platform figures with lines (one local carries it for now); boarding animations.
CHANGED: depot offer handler keeps the dock; go() docked branch falls through to departure; upd() route board renders at dock; tick rest bonus; LOCAL_LINES/localSpeak/houseGossip + tap zones.
OPEN: Human feel-test: does a stop now earn its minute? Is the 1.6× local buyout too rich?
FEELING: You pull in, the signs light, somebody talks, the kettle is warm — and the line can wait until YOU say it can't.

## 2026-07-03 · session 15 (cont.) — station SIGNAGE: the menu hangs where the building stands
DECIDED: The chips became SIGNBOARDS, Tiny Rails proper: hung in the sky band over their ACTUAL buildings with a pointer stem down at the structure — Services over the station house, Fuel over the pump/silo/water tower (whichever the settlement actually built), Market over the stalls, the KEEPER over the capital's train-shed — while the BOARD stays down on the platform with the people. Personality trades got their own building-tied signs: CHAPEL over the bell-shack (blessing + its line), WATCH over the outpost post (recruit + wall duty) — and every offer now knows its home, so each panel lists only its building's trade (the fuel panel carries the pump's own offer).
TRIED: First pass hung the signs BELOW the canvas — the #chips container was a zero-height bottom anchor, so top-positioning fell through the floor; Playwright caught it in one frame. Container now spans the frame; verified in both orientations.
PARKED: Offer-taps still close the whole stop (the v1.2 one-offer-per-stop rule) — flag for the human: should trades keep you docked now that the stop is a place?
CHANGED: offerObj homes (chapel/outpost/fuel); renderChips sky/platform split + building lookup with honest fallbacks; renderDepot view filtering; signboard CSS with stems.
OPEN: Human eyes on the signage in motion (the signs appear when the wheels stop) and the chapel/watch panels.
FEELING: The town wears its own shop signs now. You read the skyline like a menu — because it is one.

## 2026-07-03 · session 15 — human playtest pass 2: both orientations, the dual-path gun car, distinct prow buffs
DECIDED: Four findings from the human's landscape testing, all fixed. (1) STATION UI IN BOTH ORIENTATIONS — chips are now letterbox-aware (placed via the pointer-mapping math, so landscape's pillarboxed canvas anchors them correctly) and lifted clear of the landscape bottom bars; verified by screenshot in both orientations. (2) BANNER COLLISIONS — the landscape ticker moves below the route board (top 150), cards compact in landscape, and route-card names ellipsize so the leg info never overprints them. (3) THE GUN CAR UN-REGRESSED — turret and hull ports are now TWO components: each independently customizable (cycle cannon/rocket/mortar up top, autocannon/flak/flamer below — as before) AND independently upgradable (s.lvl turret + s.plvl ports, two ▲ buttons per card); ports draw their own casemate/twin tier ladder and fire rate from plvl; old saves normalize plvl=lvl so no rig loses power. (4) PROW FITS DIVERGE — RAM PLOW shoves the duel (+2.5%/lvl boss/elite damage, cap 15%); SHIELD PLATE blunts every blow (−2%/lvl damage taken, cap 12% — law 8's cap discipline). Cargo/coach art tightened (seated window band, slimmed door seams, single-baseline crates).
TRIED: One comment nearly swallowed hurt()'s body (inline // before the rest of the line) — parse check caught it instantly.
PARKED: —
CHANGED: gun()/dtMix()/statLine/cards/handlers learn plvl; hurt() and the boss duel learn the prow's temper; chips placed in px via _fit(); harness still green (121).
OPEN: Human re-test both orientations at a busy station + the two-path gun car economy (turret vs ports pacing).
FEELING: A gun car with two ladders to climb is twice the reason to come home heavy.

## 2026-07-03 · session 14 (cont.) — v1.6 Wave 5 · THE LAWS ENFORCED: ladders drawn, the sprint closes
DECIDED: The bow and the stern read as the rig's hard ends (law 5). THE PROW'S LADDER: level 1 IS the classic cowcatcher untouched (pixels honored — the byte-identity check caught one stray tooth and it was removed); RAM PLOW grows teeth + a reinforcing wale + an amber crown by level; SHIELD PLATE stands a riveted gunmetal wall on the leading face. THE REARGUARD'S FORTRESS LADDER: red caboose → plated (strips + iron rails) → KEEP-ON-WHEELS (crenellated parapet, gun slits, the garrison lamp kept burning) — the human's ratified ask, delivered. Balance: the laws hold in tests, not prose — deep = two-oil by construction (law 6), prow capped at 66% with four bypass classes (law 8), the overrun floor + work-back contracts (law 7), deep EV pays through far-node reward tables (law 4). Targets live in the DESIGN.md gazetteer; fine-tuning belongs to the human's playtest.
TRIED: 121 harness assertions green end-to-end; THE RAILHEAD byte-identical through all six waves of the sprint.
PARKED (playtest-gated): tier-3 TAKEN frequency; clan boldness; adrift/overrun exporter frames; a third prow fit (explicitly parked by the brief).
CHANGED: plow + caboose draw blocks grow their ladders; BRIEF status -> built.
OPEN: BRIEF v1.6 is BUILT end-to-end. Human QA owed on: range feel (does the ocean threaten?), overrun sting vs recovery, chip flow at capitals, the Far Light. No deploy until the human calls it.
FEELING: Six waves ago the ocean was a word in a brief. Tonight it has depth, dark water, legends at the far ends — and a rig with a bow, a stern, and scars that remember.

## 2026-07-03 · session 14 (cont.) — v1.6 Wave 4 · THE CONTINENT: dark water, far legends, marked prizes
DECIDED: The generator grows DEEP BRANCHES — one per region, hanging off column 3 into row-9 dark water: dead-ends that always pay, always return, and are TWO-OIL COUNTRY by profile construction (the route card says so before you commit: "DARK WATER · a legend · TWO-OIL"). At their ends, THE FOUR FAR NODES as choice-card legends: THE MOTHBALL YARDS (salvage epic or a generation's story) · THE FIRST ENGINE (the First Lantern, one quiet truth: THE LINE DID NOT BREAK. IT WAS BROKEN.) · THE FAR LIGHT (THE PERMANENT CHOICE — take THE KEEPER, a unique hero, and the light dies forever; S.farlight persists and the harness proves it) · THE WELLHEAD (raid or deal; either way the Terminus thins). MARKED PRIZES close their loop: arrive where your colors fly and RECLAIM BY FORCE — reclaimed cars wear a permanent SCAR, rescued heroes return with a line. The Map tab gains the CHART STRIP: the continent W→E in sepia, progress per region, the Terminus a black mark.
TRIED: The deep node renders below the spine (dashed, always named — a legend, not a secret); the old spine law updated honestly (1–3 edges, row-9 targets legal).
PARKED: Clan boldness gouging (mirror of stand-aside); prize relocation on dawdle; the three-zoom chart (strip + graph + cards carry it — a full sepia canvas chart is its own art pass); DEAD PUMP/DARK STATION beats.
CHANGED: nodeEdges/nodeType/nodeName learn row 9; THE KEEPER joins CREW (hull floor + damage buff); gazetteer written into DESIGN.md; harness 115 -> 121.
OPEN: Wave 5 — balance pass (laws in numbers) + the Rearguard/Prow ladders drawn + the still matrix.
FEELING: There is a light past the White Drifts that burns because somebody believes in trains. You can take it or keep it burning — and the save remembers which engineer you were.

## 2026-07-03 · session 14 (cont.) — v1.6 Wave 3 · THE SPACE BETWEEN: the ocean gets teeth, defeat gets a story
DECIDED: Non-station nodes speak in CHOICE CARDS (approach → 2–3 options with visible costs → consequence): E nodes roll WRECK (troops' work; bait BYPASSES the prow — law 8) / DRIFTERS (seats & rep) / CARAVAN MEET (fuel deals, rumors) / THE TANKER WRECK (siphon draws raiders · torch for rep); H nodes present THE FIELD AHEAD (push with RAM PLOW deflection shown on the card / pick through slow / rest and patch — mine strikes can BREACH THE TANK). THE LEAK runs LIVE: a breached tank weeps per mile mid-leg, the stoker patches over rank-scaled legs, YARDs do it now. ADRIFT: dry tank mid-leg halts the world on open rail — three outs (jury-rig · rep-gated distress flare · STAND AND FIGHT four escalating waves), never save-fatal. THE OVERRUN replaces every pity payout: hull 0 → manifest card by severity tier — t1 cargo cut + skim · t2 hold emptied, contracts fail, a car CRIPPLED (silent in every system until a YARD raises it) · t3 a car UNCOUPLED AND TAKEN → a MARKED PRIZE on the ledger. NEVER the engine, NEVER the Rearguard — every overrun ends on "the Rearguard held."
TRIED: Harness drives all three overrun tiers + cripple silence + the leak timer; the pity scrap is provably gone (scrap only ever decreases through defeat).
PARKED: Watching-the-looting animation (log sequence + manifest card carries the beat); DARK STATION + DEAD PUMP + LANDMARK beats land with Wave 4's generator; blockade pay/stand-aside card.
CHANGED: 3 loss paths -> theOverrun(); dtMix/gun/troops/farm/repair/oil/cargo/seats all respect crip; SHIELD PLATE eases blockade frontal fire (broadsides bypass); harness 108 -> 115.
OPEN: Wave 4 — the Surveyor's chart, generator reshape (lit spine / dark country / deep branches), far nodes, prize reclaim.
FEELING: Losing used to be a refund. Now it is a manifest, a scar, and a reason to ride back out.

## 2026-07-03 · session 14 (cont.) — v1.6 Wave 2 · STATION LIFE: the chips light when the wheels stop
DECIDED: The world is the interface (law 1). Docked, the screen IS the station: 2–5 CHIPS anchored to their meaning in the drawn scene (Services at the anchor, Fuel at the pump/tower, Market at the stalls, Board by the door, the KEEPER under the capital's shed) — two-lane spacing so anchors never stack, and they light only when the wheels stop. One chip = one compact panel (the auto-opening sheet RETIRES; ✕ returns to the platform, the stop stays open). Services by tier: halts pin fuel; YARDs patch breached tanks and repair crippled cars; capitals carry signature services (scrapworks ½-price · the auction clears your hold +15% · the bone-choir sings the hull whole · SLAGSIDE's forge) and their named KEEPERS speak gate intel. STATIONS REMEMBER (fam ledger in v7, greetings warm with visits) and HAVE A PULSE (a seeded NEED that pays +40% and heads the panel). Every board keeps one no-hold work-back contract (law 7's road home).
TRIED: Playwright caught two real UX bugs before the human could: chips anchored to a still-arriving settlement (now gated on docked) and Market/Board stacking (now two-lane).
PARKED: Keeper figures drawn in-scene (chips carry them for now); car market beyond the weld discount.
CHANGED: renderChips + view-gated renderDepot; openDepot counts visits + names the need; gPrice×needMult; SAVE_V still 7 (fam folded into the unshipped step); harness 105 -> 108.
OPEN: Wave 3 next — the space between: choice cards, THE LEAK live, ADRIFT, THE OVERRUN (the pity scrap dies).
FEELING: You don't open a menu anymore. You walk up to the stalls, and the stalls answer.

## 2026-07-03 · session 14 (cont.) — v1.6 Wave 1 · THE SETTLEMENT LADDER: every stop becomes a place
DECIDED: Stations are DRAWN now, everywhere. The composer (settleTier/settleSpec) grades every S-node — HALT (1–2 structures: water stop, signal box, windpump well, or the OIL PUMP resupply island that pins a fuel offer) · STATION (a true settlement: bStation anchor + personality clusters — stalls for markets, watchpost for outposts, bell-shack + marker yard for chapels — plus homes and infrastructure) · CAPITAL (one per region at the mid anchor BY LAW: scrap palisade, watchtowers, THE RAIL GATE with its name in the new micro-font, the grand arched TRAIN-SHED with a lamp-lit mouth, and the second building rank engaged for walled-town mass). Arrival stages the full vis choreography at every station — the settlement glides in on the decel integral, exactly like home. The origin stays singular and byte-identical; nothing out-homes it.
TRIED: Proof stills per tier (halt/station/capital) — the capital reads as a walled town from the window; the flag collision between --tier (car tier) and the settlement kind cost one render (now --kind).
PARKED: Region-palette recipe swaps (the veil + region tint carry it for now); per-personality figure casts; keeper figures (Wave 2).
CHANGED: 7 new recipes on the existing parts (bOilPump/bStalls/bWatchpost/bBellShack/bPalisade/bWatchtower/bRailGate/bTrainShed); drawSettlement/drawPlaceFront generalize the railhead pipeline; the banner takes any name; S.place lifecycle (session-only); exporter settlement subject; harness 100 -> 105.
OPEN: Wave 2 next — station life: the chips (the sheet retires), services by tier, capital keepers, memory, the pulse.
FEELING: The line stopped being dots tonight. You pull through a gate in a wall, and a town is on the other side.

## 2026-07-03 · session 14 — v1.6 Wave 0 · THE OCEAN'S MATH: range, integrity, THE PROW
DECIDED: BRIEF v1.6 (THE OCEAN SPRINT) promoted; four plan calls ratified (tank numbers builder-tuned; pity scrap survives until Wave 3's OVERRUN replaces it; the caboose keeps its save field and converts 1:1 into THE REARGUARD; fresh consist = oil+gun+empty) plus the human's addition: the Rearguard's ladder must climb to a FORTRESS — tier names now run Red Caboose → Plated Rearguard → Keep-on-Wheels (art lands Wave 5). BUILT: full A–Z+digits micro-font (Railhead glyphs byte-preserved); second building rank (rear rank, stepped + veiled; origin stays single-rank); route profiles {len/danger/reward/dry/fuel} as the one honest book; the RANGE model — per-leg fuel, tank caps (engine 30, oil +18+6/lvl capped at 5), deep crossings ≥115% of one-tank-max BY CONSTRUCTION; leak substrate (drains per mile at arrival); overrun severity fn; THE PROW fixture (ram/shield fits, 18%+8%/lvl capped 66%, four bypass classes always unmitigated — law 8 as a unit test); garrison joins the boarding fight. SAVE_V=7.
TRIED: THE RAILHEAD render byte-identical again; Playwright confirms the tank gauge (41/60), priced route cards with danger pips, and the prow block on the engine card.
PARKED: Leak/adrift/overrun DRAMA (Wave 3); prow + rearguard ladder art (Wave 5).
CHANGED: go() charges legCost(edge); navT carries the profile; fuel clamps to tankCap; harness 77 -> 100 assertions.
OPEN: Wave 1 next — the settlement ladder (halts incl. OIL PUMP, true-settlement stations, walled capitals on the second rank).
FEELING: The rig has a bow now, and the water has a price.

## 2026-07-03 · session 13 — the station SHEET: docked, not modal (Tiny Rails pass)
DECIDED: The human called the full-screen station modal an immersion killer and pointed at Tiny Rails: you pull in, the world stays on screen, the station menu overlays it. Rebuilt: PORTRAIT = a bottom sheet sliding up under the ticker (canvas + rig-at-rest fully visible above, max 62dvh, no scrim); LANDSCAPE = a right-side panel (44% max) with the docked rig breathing beside it. Slide-in animations, ✕ sticky in the corner, panel internals slimmed so more world shows. The step-away/reopen loop is unchanged.
TRIED: Playwright shots in both orientations — the landscape frame keeps the caboose-to-gun-car run visible beside the panel; the engine's nose tucks under it (the rig is wider than the window at dock camera; acceptable, Tiny Rails does the same).
PARKED: Docked-camera nudge (easing the rig left while the sheet is open) if the human wants the engine visible too.
CHANGED: #depot CSS only (positioning/animation/sizing) — zero logic changes; harness untouched and green.
OPEN: Human re-test: sheet height on a real phone, side-panel width on desktop. NEXT LOOP PROPOSED: the human pointed at Tiny Rails stations (menu as part of the landscape) — status update + BRIEF v1.3 (THE PLACES SPRINT) proposal filed to [drive] POD_IRONLINE/POD_STATUS_ironline_2026-07-03_v1.md; awaiting the director's pass.
FEELING: Pull in, and the stop is a place you're AT — not a page you were sent to.

## 2026-07-02 · session 12 — THE SPINE made legible: route board, station popups, map rework (human feedback pass)
DECIDED: The human tested and called it straight: forks were invisible, stations buried in a submenu, the map unintuitive. Fixed all three. (1) ROUTE BOARD — the travel strip's tiny fork text becomes big tappable route cards (glyph + name + what the leg IS: station/event/hazard/BLOCKADE/GATE), the fork announces itself with a header and a ticker line on arrival, and DEPART names its destination ("Depart ▸ Rust Junction · 11 fuel"). Fork frequency raised 60%→70% — the choice is the point. (2) STATION POPUP — #depot is now a modal over the whole screen (scrim + ✕ step-away that keeps the stop open; the Depart button reopens it), not a panel under the canvas. (3) MAP REWORK — fog-of-war (names/glyphs only for you, your choices, anchors, and ridden rail), heading strip ("the line forks — tap a lit stop · heading: X"), fat 17px tap targets, past rail dimmed, edge labels anchored so they never clip.
TRIED: Playwright + the sandbox's Chromium can screenshot the DOM UI headlessly — first time the pod could self-QA menus before the human's eyes. It caught a real bug immediately: upd() re-rendered the map EVERY FRAME while the tab was open, destroying tap targets mid-tap (why map taps felt broken on the phone). renderMap now caches on a state key.
PARKED: —
CHANGED: #depot moved out of v-travel to app-level overlay; .routecard/.rbhd CSS replaces .edgebtn; renderMap rebuilt + cached; upd() route board; harness still 77/77 green.
OPEN: Human re-test on the phone: route cards, map taps, popup scroll depth at busy stations.
FEELING: The spine was always there — tonight it learned to speak up.

## 2026-07-02 · session 11 (cont.) — Wave 6 · THE POLISH: the world earns its details
DECIDED: The Cinder Seam full art lands — glowing cone crowns, ridge glow-veins, slag heaps alight, ember chimneys, collapsed gantries, pulsing fissures, and THE CRUCIBLE (a cracked foundry tower, fire standing in its ribs) as its landmark; EMBER GALE joins as a sixth weather the Seam alone can roll. Gun-port PARITY debt paid: hull ports grow bare-port -> casemate -> twin with the car's tier, kick with recoil, drop spent casings; booms inherit the round's dt color. Engine rank reads in silhouette (cab brow / plow horns / war pennant). Fortress-skin smoke finally respects THE STOP (old session-8 debt). One new prop per old region (pipeline arch / collapsed footbridge / skull dome); region-tinted atmosphere; passing raiders wear the local clan's warpaint.
TRIED: THE RAILHEAD render stayed byte-IDENTICAL through the entire six-wave sprint — the origin scene was never collateral.
PARKED (for the human): physical station art at non-origin stops (vis-choreography + per-personality settlement recipes — worth its own pass), cargo/coach art beyond wave-2 shapes, more enemy sprites.
CHANGED: SEAM biome rebuilt; W_GALE + 6-slot wx; port loop rebuilt; drawOverlays REGTINT; engine tier block; harness 76 -> 77.
OPEN: BRIEF v1.2 wave list is BUILT end-to-end. Human phone QA owed on: map tab, depot market/board, boarding fight, inspect taps, Terminus pacing. No deploy until the human calls it.
FEELING: Seven waves ago this was a treadmill with a train on it. Tonight it is a realm — regions with names, gates with faces, an economy with weather, and a puppy at the center of it all.

## 2026-07-02 · session 11 (cont.) — Wave 5 · THE BENCH: eight new hands, and a puppy you can pet
DECIDED: Eight heroes join. Four in the pools (Signalwoman, Cartwright / Spotter, The Uncoupled); four NAMED story heroes found on the line, once and only once: THE STOWAWAY (a special passenger who throws back the hood instead of stepping down), THE LANTERNKEEPER (steps off the Ghost Hauler), THE GATEWRIGHT (freed from the first pretender's wreck), THE SURVEYOR (waiting at the Seam's entry). TAP-TO-INSPECT rides the crate-tap path: tap any car on calm rail for its card (amber outline pulse); tap NOODLE at the origin platform for a faster tail and a line — no stats, obviously. HERO'S FAVOR: ~35% of stations, one hero offers a discounted rank-up on the board. Elite laurel: MAXRANK crew wear a plain amber mark above the head.
TRIED: Story-hero uniqueness enforced at grant (bench + placed slots both checked) — the harness proves never-twice.
PARKED: Hero side-quest CHAINS (multi-stop asks) — the favor is the wave-5 shape; deepen if the human wants more after play.
CHANGED: CREW +8 kinds with buffs; crewFig +10 uniforms + laurel; renderCrew 'found on the line' badge + .story chip CSS; pointerup gains inspect + Noodle branches; harness 69 -> 76 assertions. No schema change (heroes already persist).
OPEN: Human eyes on inspect-tap hit zones (phone thumbs) and Noodle's wag speed. Wave 6 next: the polish pass, band by band.
FEELING: A bench full of names, and the smallest crew member still outranks us all.

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
