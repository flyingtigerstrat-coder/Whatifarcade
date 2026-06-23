# IRONLINE — Changelog

A running log of what changed, newest first. Pairs with `IRONLINE_HANDOFF.md` (the living architecture spec). The code in `battle-train-hd.html` is always the source of truth; this is the human-readable history of *how we got here and why*.

---

## 2026-06-19 — Bugfix: the loot crate was un-tappable (pointer mapping + tap detection)

The in-world salvage crate (`grabCrate`, tapped during a run) had stopped responding. Two causes, both in the canvas input layer (`§4.9`):
1. **Drag threshold too tight.** The grab required `!_pdrag`, but `_pdrag` flipped true after only **3 logical px** of pointer movement — a finger tap (or slightly imprecise click) drifts more than that, so taps were misclassified as drags and the grab was suppressed. Raised the pan threshold to 6px and, more importantly, decoupled the grab from the flag: the crate now grabs on a genuine **tap** (total horizontal movement < 8px) rather than on `!_pdrag`.
2. **Landscape letterbox ignored.** In landscape the canvas uses `object-fit:contain` (letterboxed), but `_lx/_ly` divided by the full element width — so taps mapped to the wrong logical coords and missed the hitbox entirely. Added `_fit()` which computes the contained canvas rect (pillar/letterbox offsets) so the mapping is correct in **both** layouts (identical to before in portrait, where the element already matches the 16:9 aspect).

Also enlarged the crate hitbox slightly (`c.x-9..+20`, `c.y-10..+20`) for finger-friendliness; panning still requires a real drag so the two gestures don't conflict. Logic verified in isolation (tap grabs, small jitter still grabs, real pan-drag doesn't, off-box misses). **Next:** several new tap touch-points proposed (paint-target raiders, point-defense, landmark/wreck scan, hold-to-throttle, whistle) — all reuse this now-fixed tap plumbing.

---

## 2026-06-19 — World pass begins: headless scene rendering + distant landform range (Phase 3 start)

Shifted focus to the world/backdrop (the train-customization fork — engine *classes* vs a *craft/unlock* system — is parked for a dedicated strategy session). Two parts:

**Exporter became a true backdrop renderer.** To iterate on the world headlessly, `ironline-export.js` gained three things: (1) **real gradients** — `createLinearGradient`/`createRadialGradient` now record stops and `fillRect` samples them per-pixel (`sampleGrad`), so the sky/ground/haze/sun actually render; (2) a **path system** — `beginPath`/`moveTo`/`lineTo`/`arc`/`ellipse`/`fill`/`stroke` via scanline polygon fill + segment stroke (`fillPath`/`strokePath`), so `tri` mesas, `blob` debris, `ribArc` bones, and ground cracks render — previously these were no-ops, which made headless scenes look far sparser than the real game; (3) a **`scene` subject** (`scene --off=N --T=N`) that draws `drawBackdrop()` + `drawTrain()` as a full 320×180 frame (via `fixedBox`), so we can render any world position/time. `drawBackdrop` is now exposed in `__G`. Net: I can now see the real world and iterate on it without round-tripping screenshots.

**First enrichment — a distant landform range.** Baseline read: atmospheric but the mid-horizon sits empty above a thin far layer. Added a new most-distant parallax band (`eachCell(0.055,...)`, drawn behind the far layer so the existing haze fades it = aerial perspective). Each biome got a `range(x,p)`: RUST = two layered flat-topped **mesa ranges** (`ridgeLine`, a cheap column-silhouette helper); CITY = a taller broken **skyline**; REEF = a low **bone spine** + big rib arcs. The horizon now recedes into layered landforms instead of stopping at a thin band. Tuned the Rust front ridge up for presence. No sprite regression.

Roadmap for the world pass, in bang-for-buck order: distant range (done) → lighter/layered **clouds** (current dust is heavy) → grander **biome landmarks** → a closer **dune/terrain** layer to undulate the flat ground. Hybrid still applies: procedural enrichment now (no background reference assets yet); imported hero set-pieces later if wanted.

---

## 2026-06-19 — Phase 0 POC: the hero engine breathes (procedural animation over a static import)

The first proof of the roadmap's central pattern — **static imported bitmap + procedural motion overlay = a living asset, no second sprite.** Layered onto the Fortress hero engine via a new `heroEngineFX(EX,eb)` called from the engine-skin branch of `drawTrain`:
- **Cranking drivers** — a side-rod across the three driver wheels under the boiler (native-x `[56,70,84]`, axle `eb-6`, read off a grid of the **native right-facing** sprite) that bobs with `Math.sin(S.off*0.55)`, plus counter-rotating crank-pin glints orbiting each driver. Synced to the **same `S.off` wheel-phase the procedural engine uses**, so it's speed-aware for free (and the car wheels already spin on `S.off`, so the whole consist moves together).
- **Smoke plume** — a 10-puff column from the stack (`EX-1+54`, `eb-37`), darker chuff at the base greying to wisps as it rises, drifting with `S.T`. Self-contained (draws inside `drawTrain`, so it renders headless). The global smoke emitter is now **suppressed when `S.engineSkin` is set** (`!S.engineSkin` guard on the `S.smoke.push`) so there's no double-plume — the hero draws its own.

**Facing fix:** an earlier pass blitted the Fortress with `flip=true`, which made it face **left** (cowcatcher/gun on the wrong side) — the opposite of the right-facing procedural engine. The native asset already faces right, so the flip was dropped (`blitSprite(...,false)`) and the FX positions re-read from the native orientation. The `flip` arg on `blitSprite` stays available for future assets that genuinely face the wrong way.

**New tooling — the exporter can render animations.** `ironline-export.js` gained `--anim=N` (+ `--off=`/`--T=` to step a single frame): it renders N frames stepping `S.off` through exactly one driver rotation and `S.T` through one smoke cycle (so the loop is seamless), unions their bounding boxes, and writes **aligned** frames via a new `fixedBox` path in `writeSprite`. PIL then assembles a looping GIF + a phase strip. This is the reusable rig for *every* future hero animation, not a one-off.

Result: `IRONLINE_fortress_anim.gif` — the Fortress chuffing along at the head of a procedural consist. The pattern pays off: ~30 lines of overlay turned a static hero into a moving one. **Default (non-skinned) path unchanged — full asset set re-renders clean.** Tuning notes: smoke origin sits above the boiler (reads as the stack; could nudge toward a literal stack pixel); driver glints are subtle at game scale but clear in motion; a tiny vertical body-bob synced to `S.off` is an easy next add. This validates Phase 0 of the asset roadmap — the same overlay approach now extends to combat-damage states, heat shimmer, and the rest of the hero fleet.

---

## 2026-06-19 — Fortress engine as a purchasable upgrade in the Train UI

Wired the hero engine into actual gameplay. Under the Engine card in the Train bay there's now a **"⛓ Fortress refit · 500 scrap"** button (a flat one-time unlock, `FORT_COST=500`, priced as a milestone between mid engine-LV upgrades). Buying it sets `S.fortressUnlocked=true` + `S.engineSkin='fortress'`, so the engine immediately becomes the imported Fortress hero sprite (via the `drawTrain` engine-skin path). Once owned, the card shows **Fortress hull · engaged / in reserve** with a free **Engage / Revert** toggle (`fortressOn`/`fortressOff`) so the player isn't locked into the skin. Both `engineSkin` and `fortressUnlocked` are now persisted through `save()`/`load()` (with legacy-save defaults: `engineSkin||null`, `!!fortressUnlocked`), so the upgrade survives reloads — and load no longer needs to worry about clobbering since it explicitly restores them.

The engine LEVEL (`S.engine`, hull/run-time) is unchanged and independent — the Fortress is a visual hull skin over the engine slot, not a stat change (could be tied to stats later if desired). Graceful fallback: if `engineSkin` is set but the sprite hasn't loaded yet, `ENGSKIN` is false for that frame and the procedural engine draws until the bitmap is ready, so there's never a blank engine.

Also re-imported the Fortress at **100×50** (was 125×63) so it fits the engine footprint on-screen — at 125px it overflowed the right edge during combat (engine sits at x≈216 in the 320-wide logical space); 100px clears it with room. Still crisp (native, scale 1), still grand (the tall watchtower carries the presence). Verified in-consist via `rig … --engine=fortress`; full standard asset set re-renders clean.

---

## 2026-06-19 — A scanned asset can now BE an engine in the live train (`S.engineSkin` + exporter `drawImage`)

The partner's actual, tightly-scoped ask (after I ran ahead into a full modular part system — parked as "Project Rubik's Cube"): just prove the pipeline lets an imported asset serve as an *engine in the main train mechanism* — the Fortress at the head, pulling procedural cars. Done, and validated in-engine.

**Game side — an opt-in engine skin.** `drawTrain` now checks `S.engineSkin`: if set and the sprite is ready, it blits the hero where the procedural engine would go (`blitSprite(skin, EX-1, BASE, S.engineSkinScale||1, /*flip*/true)`) and gates out the entire procedural engine block **and** the crane jib (which reuses the engine's `crX`/`mTop`, so those were hoisted to function scope to keep the gate clean). Default path (`S.engineSkin` null) is byte-for-byte unchanged — the full standard asset set re-renders identically, harness clean. `blitSprite` gained a `flip` arg (save · translate · scale(-1,1)) because the imported Fortress faces left (pilot on the left) while the player engine faces right; the flip mirrors it so the pilot leads and the firebox couples to the cars. `S.stackX` is repointed near the hero's stack when skinned so smoke still emits sanely.

**Exporter side — heroes now render headless.** `ironline-export.js` gained a real `drawImage`: the mock `Image` decodes the base64 PNG on `src` (new `decodePNG` — IHDR/IDAT inflate + per-scanline unfilter (Sub/Up/Avg/Paeth), color types 6/2/0/3), and `ctx.drawImage` blits it into the buffer by inverse-mapping each device pixel through the affine matrix `M` (same technique as the rotated-`fillRect` path), so it honors translate/scale/**mirror**. A `--engine=NAME` flag sets `S.engineSkin` before drawing a `rig`/`player`, and the clip is widened to `S.ex+145` so the longer hero engine isn't trimmed. Net: `node ironline-export.js rig oil,troop,gun:cannon --engine=fortress` renders the Fortress-headed train as a true 1:1 snapshot — no browser. This is the validation tool every future hero needs.

Result render: the Fortress leads, correctly oriented, baseline-aligned on the same rail as the cars, one coherent palette. Honest tuning notes: the hero engine is grander than the cars (taller) — appropriate for a hero, tunable via `S.engineSkinScale`; the static bitmap doesn't yet have spinning wheels / smoke (procedural animation overlays are the next polish); and to use it in live gameplay you'd set `S.engineSkin='fortress'` (e.g., a purchasable/unlockable engine). Parked for later: **Project Rubik's Cube** — the modular paper-doll part system (chassis/cab/boiler/stack/turret/pilot/gear slots, each from a library of imported parts, with indexed-palette recolor) — see `IRONLINE_engine_slotmap.png`.

---

## 2026-06-19 — The art pipeline, part 2: asset → sprite import (`ironline-import.py` + in-game blit path)

The piece that changes how the trains get made. The partner's core friction, said plainly: this is a visual dream, the story *is* the trains, and hand-translating a reference into procedural `fillRect` code drifts structurally and takes many passes to converge (the Fortress took four). They'd happily trade resolution for *faithfulness* — "visually and structurally accurate from asset to sprite, on the first try." The honest diagnosis: I was re-deriving references from memory instead of importing them. A reference is an exact blueprint; the faithful move is to downsample *it* to the game grid, not re-draw it by eye.

So we built the second half of the pipeline (the first half, `ironline-export.js`, goes procedural → PNG; this goes **PNG → game sprite**), and measured the gap honestly first: the style-guide assets carry ~3–4× our linear detail and ~150 colors with painterly anti-aliased shading, vs our 320×180 / ~33-color flat-block procedural look. Conclusion: don't brute-force that fidelity in `fillRect` — *import* it for hero units, keep procedural for the systemic fleet.

**`ironline-import.py`** — `python3 ironline-import.py <asset.png> <name> [--width=N --palette=ironline|adaptive --dither]`. It crops the subject off the style-guide card (by **luminance + saturation**, not modal color — these cards layer a cream card inside a white margin with a faint grid, which fools a single-color test and was the bug that made the first import come out as an opaque teal block), downsamples to the game grid (Lanczos), locks every pixel to a **curated IRONLINE master palette** pulled straight from the game's ramps (BOSSM/MAT/GUNM/RAIDM/RUSTR + darks/accents) so imported and procedural trains share one color world, makes the background transparent, and emits a tiny PNG plus a ready-to-paste embed snippet. The Fortress came out **140×66, 24 colors, 8.3 KB** — small enough to base64-embed straight into the single HTML file. (`adaptive` mode keeps the asset's own colors for max beauty; `--dither` is implemented but leaks error into transparent edges — left off by default.)

**In-game blit path** — a `SPRITES` registry + `loadSprite(name,w,h,dataURI)` (preloads an `Image` from the embedded base64) + `blitSprite(name,x,y,scale)` that draws via `ctx.drawImage` in the 320×180 logical space with `imageSmoothingEnabled=false`, anchored so `y` is the rail the sprite's bottom rests on. It degrades safely everywhere: in the Node exporter the mocked `Image` never fires `onload`, so `ready` stays false and `blitSprite` no-ops — the game loads and the 27-config harness is untouched because nothing calls it yet. The first hero sprite (Fortress) is embedded and ready.

**The architecture this establishes — hybrid, not either/or.** Hero/story trains (the Fortress, named bosses, the player's signature engine) come in as **imported bitmaps** for maximum beauty; the ambient systemic fleet stays **fully procedural**, keeping the superpower (tiers, weather-tint, deterministic variety — all free). Animation layers on top of static hero bitmaps as procedural overlays (wheels, smoke, a swiveling turret), so imported trains still feel alive. Proven by a side-by-side composite: the imported Fortress and a procedural rig, matched scale and palette, reading as one game.

Open tuning item: the imported Fortress carries a faint baked rail line from the source asset — should be trimmed in the converter (or masked) so it doesn't double up with the game's own rails. Next steps: wire the hero into a visible scene (boss/landmark), add `drawImage` to the exporter so hero sprites can be validated in-engine without a browser, and import the full multi-car Fortress (Image 2) the same way.

---

## 2026-06-19 — Tooling: the durable sprite exporter (`ironline-export.js`)

A new standing utility alongside the game — not a gameplay change, but the thing that makes *producing art assets* cheap and repeatable from here on.

**The problem it solves.** We'd been rendering sprites to PNG with throwaway scripts in `/tmp` — great for a one-off, but that scratch dir is wiped between threads, so every fresh session paid the cost of *re-authoring* the renderer before it could export a single frame. Running a renderer is effectively free (a few thousand `fillRect`s into a buffer, then a zlib compress — sub-second, no GPU/network/install; ten sprites cost about the same as one). Re-writing it each time was the only real expense. So we promoted it to a permanent, parameterized command that lives next to the game and the docs.

**What it is.** `node ironline-export.js <subject> [options]` renders any sprite **straight out of the game's own draw code** into a real PNG. It is not a redraw or an approximation — it loads `battle-train-hd.html`, extracts the `<script>`, mocks the browser/DOM/canvas, exposes the actual draw functions, and calls them. The output is a true 1:1 snapshot of what the game paints. Subjects: `boss [tier]`, `boss-engine`, `boss-car <cannon|rocket|mortar|fuel>`, `player [tier]`, `player-engine [tier]`, `rig <consist> [tier]`, `raider <buggy|technical|bike>`, `trader`, `raider-train`, `elite [guns]`, and `all` (dumps a standard set). Options: `--transparent` (alpha bg for real asset use), `--scale=N`, `--tier=N`, `--bg=#hex`, `--out=PATH`. Background defaults to the War Rig style-guide tan.

**How it works (the infra worth knowing).** A `Float64Array` pixel buffer with proper "over" alpha compositing stands in for the canvas; a hand-rolled PNG encoder (crc32 + IHDR/IDAT-via-`zlib.deflateSync`/IEND, colour type 6) writes the file; the result is bbox-cropped, composited onto the chosen background (or kept transparent), and nearest-neighbour upscaled. The non-obvious part: the mock context carries a **real affine transform stack** (`save`/`restore`/`translate`/`rotate`/`scale` via a 2×3 matrix), and `fillRect` has two paths — a fast axis-aligned blit for the game's integer `px()` fills, and a general inverse-mapped rasteriser for rotated rects. That matrix is *required*, not a nicety: the player gun-car turrets draw with `ctx.save();translate(pvx,pvy);rotate(st.a);`, and without honouring the transform every turret part landed at the origin (a red blob pinned to the top-left corner). The boss/raider/passing-train sprites are all axis-aligned, so they never needed it — which is exactly why the bug only showed on the player rig.

**One layout quirk found & worked around.** Calling `drawTrain()` with a *single* car slot draws a phantom half-car to its left — an inter-car connector/gangway stub `carStruct` lays down for a neighbour that isn't there (the "gangway connectors" roadmap item was never built, so the seam draws into empty space). The fix wasn't to fight `drawTrain`; it was to build on the path that already renders perfectly — the **full rig**. The dropped single-`car` subject was replaced by `rig <consist>`, which composes any train (`rig oil,troop,farm` or `rig gun:rocket,troop,gun:mortar`, leftmost-first, `type:wpn` sets a gun's weapon) and clips off the left stub at the leftmost car's edge. So `rig gun:rocket` gives a clean rocket gun-car coupled to the engine, and the multi-car rigs render end-to-end with no artifacts.

**Where it belongs.** This is the first piece of the offline asset pipeline we sketched (PNG round-trip → palette-locked indexed sprites → painted biome backdrops). It should move into the Claude Code repo as a standing `export any sprite` command; it's also the natural host for the eventual PNG→indexed-array converter. For now it sits in `/mnt/user-data/outputs/` next to the game.

---

## 2026-06-18 (continuing) — The encounters overhaul: raiders, the boss duel, the elite warband & desktop fill

A long stretch aimed at one thing the player said out loud — *streamline the encounters* — plus finally giving desktop players the whole window. Five threads.

**NPC repaint — raiders and the boss convoy.** The passing/boss enemies were flat dark slabs. Raiders became three weighted silhouettes on a gunmetal ramp (`RAIDM`/`RAIDRED`): a fast hunched **bike** outrider, a caged **buggy**, and an armored **technical** gun-truck (technicals only appear from journey 3+). The boss became a **multi-car convoy** that mirrors the player — engine + fuel minimum, scaling +1/2/3 gun cars by tier, HP and return-fire both scaling with gun count. Then, against an uploaded "War Rig" style-guide, the boss got a ground-up **rust repaint** on a dedicated warlord ramp (`BOSSM`, grimmer than the player's): a real steam-loco engine (cylindrical riveted boiler with a specular band, smokestack + steam/sand domes, headlamp, windowed cab with a skull plate, spiked ram plow, ram-cannon out front), boulder-armored gun cars with rounded `cyl` tank turrets per weapon, a riveted tanker, draped chains and skull emblems throughout. Small raiders stay black (grunt scrap); the boss is rust (the lone warlord) — a deliberate faction split.

**Rail-sea re-spacing.** The three rails were unevenly spaced (16px / 26px) and the far rail sat *behind* the train body, swallowing anything on it. Re-spaced to an even **28 / 28** (far 110, mid 138, near 166), lifting the far rail clear of the roofline so passing trains finally read as real events above the player. Combat hooks (player aim point, wreck-explosion height) were re-pinned to match.

**The boss fight, reimagined as a stop-and-duel.** A boss "coming at you" head-on made no sense as a sustained fight — they'd pass in a blink. Now when the warlord convoy locks the line, **both rigs stop dead, the world halts, and the crossing clock freezes** — no timer. You trade fire nose-to-nose until either the boss is wrecked (advance, claim the salvage + Warboss roll) or your hull gives out (`bossEscape`, repurposed into the clean "limp home" loss). The bottom progress bar now **fills as you grind the boss's HP down** — breaking the blockade *is* the progress. Verified headless across win / hull-loss / gunless paths (timer stays frozen; world halts on lockup).

**The elite warband — a rare broadside surprise.** The mirror of the head-on boss: a flat ~13% roll on any non-boss crossing past journey 3 (its own ominous "the horizon is too quiet…" departure). A heavy **black multi-car raider convoy** (`drawPElite` — skulls, chains, warpaint, down-firing broadside guns, wide HP bar) swings onto the parallel rail and **locks alongside** — no break-off. Here the **world keeps rolling**: both trains barrel along side by side trading broadsides until one wins. Kill it for a big haul + 50% Warboss roll, then the crossing resumes and completes. Verified win/loss headless, including "world rolled during the duel" (the tell that distinguishes it from the stop-dead head-on boss).

**Desktop fill.** On a wide window the game was a stranded 480px mobile column with dead space all around. Two fixes: the landscape/desktop skin's canvas was **stretching** 640×360 to the window and distorting the pixels — switched to `object-fit:contain` so the scene scales as large as it can *without distortion*, framed in dark. And the wide-screen default is now robust: `autoLayout()` picks landscape on big windows and on resize, an explicit toggle sets a `layoutManual` flag that's respected thereafter, and a stale non-manual `portrait` auto-corrects to desktop on load. Honest tradeoff noted: fixed-16:9 pixel art can't fill an arbitrary aspect without distortion or a frame; a maximized 16:9 monitor fills fully, odd aspects get a thin dark frame.

## 2026-06-18 (later still) — Heroes, hero subsets & the gun-car overhaul

Three threads landed this stretch: a full heroes layer on top of crew, a thematic split of where heroes come from, and a ground-up redo of how the gun car looks.

**Heroes — recruitable, assignable specialists.** Crew already carried a `hero:true` flag; this turned it into a feature. Recruited heroes sit on a bench (`S.heroes`), and any one can be **assigned to a car to override its role crew** — a real tradeoff (gain the hero's buff, lose that car's role buff). `activeCrew(s)=s.hero||crewOf(s)` is the single accessor that drives both buffs and drawing, so a placed hero reskins the back-corner figure with nothing else to change. Assignment is a **two-tap flow** in the Crew tab (tap a bench hero → tap a car), with return-to-bench and swap-on-occupied. Duplicates **rank up** instead of duplicating, so heroes are collectible. Validated headless: recruit → rank-on-dupe → assign (buffs shift) → return (buffs revert), plus draw-with-a-hero-on-every-car-type.

**Hero subsets — two rosters, two sources.** The flat hero pool was split so the two recruitment paths feel distinct:
- **⚔ Spoils of War** (boss kills — ~85% chance, else scrap): **Raider Warboss** ★rare (~14% of war drops — +gun *and* +scrap), **Bombardier** (+gun), **Ironside** (−hull damage), **Reaver** (+scrap). War heroes wear raider-red.
- **☼ Wanderers** (depot recruiter + ~22% of passing-trader encounters): **Cook** (+food), **Medic** (hull floor), **Greaser** (−s fuel burn), **Tinker** (+hull regen). Wanderers wear gold.
`WAR_HEROES`/`WANDER_HEROES` are the pools; `pickHero(group)` rolls the rare Warboss separately; `recruitHero(group)` is called by `bossKill`, the depot `recruit` offer, and the trader. Each kind has a distinct `crewFig` silhouette (the Warboss a horned helm + tall gold crown; Ironside a riveted steel helm; etc.). The Crew tab colour-codes bench chips and cars by group/rarity. Measured the Warboss rate at ~14% and verified roster disjointness + every kind's buff in isolation. (Legacy `scavenger` kept as a wanderer for save-compat.)

**Gun-car overhaul — weapons + roof, one integrated emplacement.** The roof guns were the weakest sprite relative to the detailed car bodies, and the rocket had a real bug: the grey turret housing drew in *world space after* the rotated weapon, stamping over the compact rocket pod. Fixed by inverting the order — **mount behind, weapon on top, nothing over it** — and rebuilding each weapon as its own silhouette on dedicated metal ramps (`GUNM`/`ROCKM`/`BRASSM`): the cannon got a breech + specular barrel + vented muzzle brake; the **rockets** a real angled rack with separated tube bores, red warhead tips, and a tube that visibly empties on launch; the mortar a fat brass tube in a steel cradle. Then the **roof itself** was rebuilt to *incorporate* the gun: the flat plank deck became a **riveted armored steel gun-deck** on the material ramp, the flat pintle ring became a **raised barbette + turret well the gun grows out of**, and low **coaming walls** at each end frame the cupola and turret into one fighting position. The load-bearing turret aiming math was left untouched. Validated with a transform-tracking ASCII turret viewer.

---

## 2026-06-18 (later) — Crew system, fuel/food economy & the per-car detail pass

The session that turned the train from a *set of stat cars* into a *crewed rig with a real resource loop* — and gave every car a themed deck.

**Per-car detail pass (into the `carW=40` room).** Each car type was redrawn to its theme rather than a formula: **farm** = curved hoop-glass greenhouse (swaying plants, breathing ridge vent, condensation); **troop** = war-camp grounded on a planked deck (brazier hearth, tarp lean-to, sandbags, figures drawn with *leg gaps* so they read as people); **gun** = bristling battery (gunner's cupola, level-scaling kill-tally, hull shell-rack, broadside ports); **repair** = working wrecker (gantry crane hauling a spare wheel, masked welder at a pulsing arc — the forge "heart"). A shared `carStruct`/`underCar` pass added armored plate-seams, air-reservoir + leaf-spring bogies, and gated side-detail (door/vent/hazard). Verified with a new **ASCII pixel-viewer** harness (mock `fillRect`→logical grid→print colored chars) so silhouettes could be *seen* before presenting — the workflow unlock of the session.

**Crew — a collectible population that buffs the whole train.** One crew member rides the **back corner** of each car (`crewFig`, leg-gap standing figure with kind-distinct headgear + gold rank pips): Gun-Captain (in his cupola, kept + officer cap/rank tabs), Sergeant (beret, standard-bearer), Farmhand (straw hat), Mechanic (welder's goggles, at the crane foot), Stoker (sooty cap). **Data model:** each slot carries `crew:{kind,rank}` — `crewOf(s)` lazy-inits role crew by type (`ROLECREW`) and persists with the slot. `crewBuffs()` aggregates train-wide effects by role × rank (I/II/III): Captain +10%/rk gun, Sergeant −5%/rk hull damage (applied via a new `hurt()` mitigator at every combat hit), Farmhand +12%/rk food, Mechanic +1/rk *always-on* hull regen, Stoker −6%/rk fuel burn. **Heroes** (Scavenger/Cook/Medic) are scaffolded in the same `CREW` catalog (slot-agnostic passives) for the next layer. **Recruitment:** training costs scrap (`crewRankCost`); defeating a warlord makes a specialist defect and ranks a random crew member (`recruitBoss`).

**Crew got its own tab.** Lifted out of the Train panel (now back to pure rig-building) into a dedicated **Crew** tab — **5 tabs now: Travel / Train / Crew / Map / Log**. `renderCrew()` shows a summary banner of the crew's *combined* buffs + a card per crewed car (role, rank, live buff, Train button / ELITE). The tab glows when someone's affordable to train; `showView` re-renders Train *and* Crew on entry so spending in one is instantly reflected in the other.

**Fuel + food economy (closes the loop).** New **oil tanker car** (riveted iron cylinder, amber hazard stripe, fill dome, rounded caps, Stoker at the back) produces **fuel** (`oilProd`). **Fuel now gates departure** (`fuelC`, burned on depart) — the *movement* gate; **food now gates growth** (`carFoodC`, spent to weld a car) plus a small crew **ration** per departure — replacing food-as-depart-cost. New `fuel` resource on the stat bar; a **Fuel depot** offer added so you can never hard-lock; **starting fuel 30** (≈3 departures) bootstraps you toward your first tanker.

**Composition & grounding polish.** The idle camera now keeps **~34–40px of open track ahead** of the engine (idle anchor cap 216→190; combat still pins to native 216 for aiming). And the train's **rail was lifted to sit under its wheels** — the middle lane moved **144→138** so the wheels are planted on the rail instead of floating 6px above it (far/near lanes + parallel train untouched; shadow nudged to the contact line).

**UI bookkeeping:** **km left the resource bar** (it's journey state, not a stockpile) and folded into the next-stop line (shown in both orientations); the stat bar is back to four true stockpiles — **scrap / food / fuel / hull**.

**Validation:** parse-check + 27-config harness green throughout; crew buffs, fuel/food costs, recruitment, and the depot fuel offer verified by headless economy tests; rail-under-wheel alignment confirmed with a solid-pixel scene slice.

---

## 2026-06-18 — Camera foundation (follow-camera + drag-to-pan)

The session's throughline: the train had outgrown the 320px stage, so we built the camera that lets it be longer and wider than the screen, then made the whole rig inspectable.

**Car width decoupled from car count.**
- `carW` was `Math.min(32, floor(248/segs)-2)` — it *shrank* as you added cars, capping detail and punishing long trains. Now a fixed, generous **`carW=40`** (+25% room per car, no shrink). This is the "room" for the upcoming per-car detail pass.

**Follow-camera (auto framing).**
- The train anchor `EX` is no longer a hard `216` constant — it's a live value `S.ex + S.pan`.
- New per-frame camera logic in `tick()`: while **enemies are present** (`S.boss || S.raiders.length`) the anchor pins to native **216** so turret aiming and raider approach-distances stay calibrated; during **peaceful travel/depot** it **centers** short consists and **front-anchors** long ones (tail trails off-screen left, Tiny-Rails style). Lerped, so it gently *leans forward into a fight* and *pulls back to admire the train* in peace.
- Smoke now spawns from the **live stack x** (`S.stackX`, stored in `drawTrain`) instead of the dead constant `286`, so it stays glued to the chimney as the camera breathes.

**Drag-to-pan (manual inspection).**
- A manual offset `S.pan` (clamped `0..S.maxPan`) layers on top of the auto-anchor. Grab-and-drag the canvas to scroll along the train; drag **right** reveals the tail (content-drag paradigm). Clamps exactly when the caboose's rear reaches the left edge — no scrolling into empty void. Short trains that already fit have **zero** pan room.
- Pointer handling rewritten to split **tap vs drag** by a 3px movement threshold, so panning never eats a crate grab and a crate tap never starts a pan. Uses pointer capture; handles `pointercancel`.
- **Combat lock:** pan updates are suppressed while enemies are present and `S.pan` lerps back to 0, so a wave can't be dodged by holding a drag — the fight always re-frames the front on release.
- **Edge chevrons** (`drawPanHint`): faint pulsing "more train this way" arrows at the screen edges — left when there's tail to reveal, right when the engine is off-frame. Double as the discoverability hint (brighten while dragging) and are suppressed during combat. Stay clear of the bottom journey-progress bar.

**Validation:** parse-check + 27-config harness green; camera convergence and pan-clamp/combat-lock verified by standalone simulation (centering at 160 for short trains, native 216 under fire, caboose-rear lands at x=10 at full pan, pan→0 on wave + release).

---

## 2026-06-18 (earlier) — Modular weapon system & dual-orientation UI

**Two-slot modular guns.** Gun cars gained **two independent hardpoints**: a **TOP turret** (existing rotating Cannon/Rockets/Mortar — aiming math preserved verbatim) and **broadside casemate PORTS** (two recessed hull gun-ports firing a synchronized volley via `spawnPort`). Catalogs `TOPW` / `PORTW` carry a `dt` damage-type tag (`kinetic`/`blast`/`fire`) as groundwork for future enemy weaknesses. Weapon swaps are **costed** (`REFIT=30`) via per-port "⟳ Next · 30" card buttons, not a free toggle. `wpow(top,port)` sums the loadout.

**Dual portrait/landscape UI.** Full-bleed landscape layout (`.land`) with corner stats, a consolidated top route header (next-stop + biome), bottom slim tabs, and a filmstrip car tray — alongside the unchanged portrait layout. `S.layout` persisted + auto-detected.

**Consolidated display menu.** One ♙ button (`#dm`) toggles a popover holding three controls: layout toggle (`#lt`), **fullscreen** (`#fs`), and **immersive mode** (`#im`, hides all chrome). Lives at `#app` top-level (z-index 50) so it isn't trapped behind panels.
- *Known hard limit:* the Fullscreen API is blocked inside the Claude artifact iframe (no `allow="fullscreen"` from the parent) — it only works on the downloaded file in its own tab. `fsFail()` degrades gracefully to "↗ Open in tab".

---

## 2026-06-18 (earlier) — Engine redesign: the elongated war-rig

The engine was rebuilt from a compact loco into an **elongated Mad-Max war-rig** (~95px, ~3 car-lengths) with a stepped silhouette, drawn inline in `drawTrain`. Front-to-back: raked **cowcatcher plow** → smokebox + headlamp → ram-cowl + spike fan → banded/riveted **boiler** (`boX=EX+50,boW=28`) → forward **smokestack** → raised **cockpit cab** (`cabX=EX+34`, lowered so its roof clears the car decks) → extended **rear war-deck** carrying a lattice-mast **derrick crane** whose long jib+hook is drawn last so it reaches over the cars. Morally neutral (no skulls). All tier-aware via `mat()`.

**Bug fixes this stretch:** turret mounting offset (pivot moved to y118 + base plate); caboose banner overlapping the car ahead (moved to trail off the rear); engine wheels floating 2px above the rail (bottoms aligned to y=138); cockpit lowered ~8px.

---

## Earlier foundation (pre-changelog)

The base game predates this log: the 640×360 / RS=2 render core in 320×180 logical space; the central `S` state object + `window.storage` persistence; the procedural **living world** (Rust Flats / Dead City / Bone Reef biomes, 5-mood weather, day/night, seeded props); **combat** (raider waves, salvage crates, passing-train encounters, boss convoys every 5th crossing); odometer-based **depots** with deterministic seeded offers; the app-shell **Travel/Train/Map/Log** UI; and the **material system** (`MAT`/`RUSTR` ramps + `panel/cyl/streak/rustPatch/spike/skull/chain` helpers) applied to the engine and shared car body. See `IRONLINE_HANDOFF.md` for the architecture.
