# DESIGN — IRONLINE
**Design notes for `games/ironline/`. Read with the repo-root `CLAUDE.md`, `GOVERNANCE.md`, and the game's `CLAUDE.md`/`BRIEF.md`. The code in `battle-train-hd.html` is always the source of truth; this documents the why.**

---

## Depth bands — the staging ladder

The scene is composed in **depth bands**, far-to-near then on top. This is **descriptive**: `draw()` already runs in this order — the ladder just gives every drawable a declared home so the picture stays legible as it grows. A side-on train owns the middle of the frame, so anything at its depth *behind* it is occluded; the bands keep each thing where it reads.

| # | Band | What lives here (in `draw()` order) |
|---|------|-------------------------------------|
| 1 | **Sky** | sky gradient (`dnTop/dnMid/dnHor`), sun/moon glow, stars, drifting clouds, vultures |
| 2 | **Far parallax** | most-distant landform ranges + far biome silhouettes, fading into the horizon **haze** (aerial perspective) |
| 3 | **Mid parallax / ground** | mid-biome landmarks, the ground plane + texture, cracks, debris, story props, foreground wrecks, ambient life |
| 4 | **Back rail + traffic** | the **far rail** (`lane(110)`), passing **NPC trains** (traders / raider convoys), and **set-back station architecture** — haze-dimmed so it reads as *behind* |
| 5 | **Player rail + the rig** | the **middle rail** (`lane(138)`) and the **train**. The rig owns this band **alone** — a clean, unbroken silhouette |
| 6 | **Front rail + foreground** | the **near rail** (`lane(166)`), the **station platform + people**, foreground props (tumbleweed) — *in front of* the rig |
| 7 | **FX / combat** | raiders, boss, salvage crate, tracers, muzzle flash, explosions; the engine's smoke rides with the rig |
| 8 | **Atmosphere** | the full-frame grade (`drawOverlays`): rust wash, night tint, vignette, drifting grain, weather — lights and unifies everything below |
| 9 | **UI** | place-name banner, region label, pan-hint chevrons, journey progress bar — legible regardless of how the world is composed |

**The one rule (enforce going forward):** *a new drawable names its band before it's drawn.* If you can't say which band something belongs to, the composition isn't decided yet.

**Why it matters — the pass/fail test for any station/depot scene:** trace the train's outline. If you can't get around it without hitting a station part, the bands are collapsed (something behind-the-train is being drawn at the train's own depth). The fix is always the same: push it up-and-back into band 4 (haze-dimmed), drop it to the band-6 foreground strip, or promote it to the band-9 UI — never leave it on band 5 with the rig.

### Worked example — THE RAILHEAD (the origin depot)
- **Band 4:** the **station** (clock-cupola anchor) + water tower, silo, signal mast — beside the rail, planted on the far rail, haze-dimmed. The **telegraph line** (poles + sagging wire spans, occluded by the buildings) runs past the cluster off both frame edges — the stop sits *on a line that goes on*. No over-rail structures (a full-width canopy/gantry cages the rig — retired; the only awning is a small doorway canopy on the station itself). **Inhabited cues:** window light spills to the ground, a porch lantern under the canopy, a lazy stovepipe wisp — somebody's home.
- **Band 5:** the rig, docked, alone on its rail.
- **Band 6:** the plank platform on a **worn apron** — trampled, biome-matched earth that grounds the strip and clears the band-3 scrub/wreck props from the platform's footprint (the apron backs the deck fully; no track or debris slices through it). On it: the Dispatcher (cigarette ember), the kid sitting on the deck edge with legs dangling — and **Noodle**, a little black puppy sat in front of him, tail going, wearing the **only gold pixels in the scene** (gold is Noodle's mark alone — root `CLAUDE.md` §4) — a worker, a lantern at each end with gnats drifting in the lamplight, and freight (crate + milk-can) waiting for the haul.
- **Band 9:** "THE RAILHEAD" as a top-of-frame banner (off the rail; scales to every future depot).

> Reference note (Tiny Rails): borrowed for **spatial grammar only** — depth bands, train-alone-on-its-rail, place-name as a UI banner. **Not** its palette or mood; IRONLINE stays dusk + rust and never brightens toward the reference.

---

## Buildings — the structure grammar

Station/depot structures are **entities, not one-off blobs**: a list (`RH_BUILDINGS`) of building entities, each drawn by a **recipe** (`bStation`, `bWaterTower`, `bFreight`, `bShack`, `bShed`, `bSilo`, `bSignal`, `bWindpump`, `bDepot`, …) **composed of shared parts** (`bWall`, `bGable`/`bHip` roofs, `bWindow` (height-aware), `bDoor`, `bAwning`, `bBay`, `bClock`, `bPipe`, `bWisp` (chimney smoke), `bLadder`, `bBraceX`, `bFence`, `bFoot`). Scale reads through the recipe: a `bDepot` is a one-room cabin (a small stop); a `bStation` is the railhead's anchor — taller hip-roofed massing, a **clock cupola**, a row of tall windows, a double-door with an entrance canopy, and a station-master **ticket bay**.

**Settlement layout:** a settlement is **two quarters flanking the anchor** — a *homes* quarter (shack with a smoking chimney, water tower, tool shed) on one side, a *working* quarter (freight house with its sliding door, silo, signal mast, wind pump turning over the roofline) on the other, stitched together by scrappy fence runs and the telegraph wire. Varied roof silhouettes (gable / hip / flat-parapet / tank / lattice) keep the skyline alive; the tallest working silhouette (the wind pump) can rise above the train because it lives in band 4, behind. Build a new structure by writing a recipe from the parts and adding an entry — not by hand-placing rectangles. (Same engine/recipe split as the art pipeline: parts are the *how*, recipes are the *what*.)

**The realism principles every recipe follows** (so structures read as built things, not flat slabs):
1. **Silhouette first** — a varied, readable outline (a pitched/stepped roof, a tank, a mast), never a plain box.
2. **Structural logic** — it looks load-bearing: **footed** (`bFoot` — a stone footing + contact shadow where it meets the ground), with legs, **cross-braces** (`bBraceX`), beams, and lintels that carry weight.
3. **Volume** — front face + a thin **right shadow-plane** so it reads 3D; roofs get an **overhang + eave shadow**.
4. **One light direction** — top-lit (lit top/left edges, shadowed right/under), consistent with the train's material language.
5. **Material language (locked)** — two-metal + rust: `BWOOD` (weathered plank), `BIRON` (rust iron), `BSTL` (gunmetal). 5-value ramps, hard AO seams, rust streaks + patches.
6. **Weathering & asymmetry** — streaks under bolts, patched panels, scavenged add-ons (the depot's lean-to annex); nothing grid-perfect — the wonk sells it.
7. **Function reads** — water tower = tank + bands + fill-spout + gauge; depot = door + lit windows + stovepipe; silo = corrugation + outlet; signal = ladder + hooded lamps. You can tell what each one *does*.
8. **Cluster, don't scatter** — a depot is a *place*: a few structures of varied scale (the depot building anchors; tower / silo / signal are secondary), spaced so each reads.

All depot buildings live in **band 4**: footed on `RHGY` (the far rail), rising into the backdrop, then **haze-dimmed** by the aerial-perspective veil so the cluster recedes behind the train. Adding a new depot type = new recipes + a new entity list; the bands and the veil come for free.

---

## The stop — the arrival/departure choreography

Every node-stop shares one reusable state machine, `S.stop = {ph, t, vis, v0, T}` (session-only; run inside `tick()`; enter via `stopArrive(vis)` / leave via `stopDepart()`):

- **`arriving`** — the world **decelerates linearly to rest** (`spd = v0·(1−u)`), and the station glides in on the **exact integral of that deceleration** (`stationX = HOME + v0·T/2·(1−u)²`) so it settles precisely as the wheels stop — one physical motion, no drift, no snap. The **lanterns flicker up** (`S.lampK`) in the last beat of the settle. Wheels stop for free (they spin on `S.off`); smoke stops emitting below walking pace and the last puffs thin to nothing.
- **`docked`** — the world at rest (`spd = 0`). Tumbleweed and birds keep moving (`S.T`-driven): the world is still, not frozen.
- **`departing`** — ease-in spin-up (`spd = v_target·u²`); the station slides away west at world speed until it clears the frame, then the stop releases and normal speed rules resume. The lamps stay lit as they go — you leave the lit outpost behind.

`vis` marks a stop with a physical station to stage (the origin, for now; future map nodes reuse it). Depot stops run the same machine visual-less (gentle 1.4s halt at the depot panel, 1.2s resume on leaving) — **stopping is physically real at every stop**.

**Begin-at-origin:** a fresh game (no save) boots `docked` at The Railhead — journey 0, world at rest, the Dispatcher's greeting in the ticker. Saving while docked persists one flag (`origin`) so a pre-departure reload wakes up on the platform; any other save loads mid-journey and never sees it. Scuttle-&-restart re-docks. Save/load/reset extended together.

**Headless QA:** `tick`/`stopArrive`/`stopDepart` are exposed through the exporter's `__G`, and the repo-resident harness **`ironline-qa.cjs`** boots the real script and asserts all phases (frozen world, exact landing, lamp state, drift resume, save round-trips) **plus the save schema** (v1 migration, v2 round-trip, garbage fallback, never-wipe on unknown versions). Run `node ironline-qa.cjs`; extend it every wave a system grows. Keyframe stills: `node ironline-export.js railhead --sx=N --lamp=K`.

---

## The Spine — the node-graph journey (Wave 1)

The rail ocean is **4 regions** (`REGIONS`): Rust Flats → Dead City → Bone Reef → Cinder Seam, each a **seeded node graph** — columns of stops (6/6/6/7), 1–2 forward edges per node, one entry anchor (col 0), one named mid anchor, and a **GATE** (warlord boss crossing) at the far end that opens the next region. The Terminus gate ends the line (Wave 4 gives it its story). Node types: **S** station (depot offers) · **E** event (light for now; Wave 3 deepens) · **H** hazard (4-wave leg, rest on arrival) · **B** blockade (elite-warband leg) · **G** gate. The graph is pure functions of `S.nav.seed` (`navRows`/`nodeType`/`nodeEdges`/`nodeName`) — nothing stored but position, so saves stay tiny and the map can't corrupt.

**Position drives threat:** `eff() = reg*6 + col` replaces journey-count difficulty everywhere (BRIEF v1.2 rule 6) — the world is dangerous because of *where you are*, not how long you've played. `S.journeys` remains as flavor/records. **The map owns the biome:** `drawBackdrop` reads `REGIONS[S.nav.reg].biome`; on a gate leg the next region's palette bleeds in across the back half of the crossing (`blendT` from `S.jt/S.dur`). `biomeIdx`-by-distance is retired. **Choosing a fork:** when a node has two edges, the travel strip shows labeled Depart buttons and the Map tab's lit nodes are tappable — same choice, two surfaces. A failed leg (`S.navT=null`) leaves the rig at the node it departed — the map never moves on a loss. Every arrival is a physical stop: stations dock until you leave; event/rest halts carry `stop.auto` and release themselves.

---

## The Ledger — station economics (Wave 2)

**Goods with a regional spread.** 5 trade goods (`GOODS`: Ore/Parts/Medicine/Grain/Relics); price = base × **region supply-demand** (`GMKT` — what a region makes is cheap there, what it lacks is dear; the Seam pays dear for nearly everything) × a deterministic per-node jitter. The spread is *visible* (▼ cheap / ▲ dear on the market board) so trading is a read, not a memory test. **Cargo car** pools holds (4 at lvl 1, +2/lvl) — the crate stack and side gauge show the fill. **Passenger coach** seats fares (2 at lvl 1, +1/lvl) — riders board at stations, pay on disembarking; rare **special passengers** (named, hooded in the window) pay 5×. A lost leg scatters passengers and resets escort clocks (`navFail`).

**Station personalities.** Every station carries 2 of YARD / MARKET / OUTPOST / CHAPEL (seeded; the Railhead is always YARD+MARKET so the first stop teaches the trade). Personalities pin their offer (yard→repair, outpost→recruit, chapel→blessing) and MARKET adds the trade board. **The Dispatcher board** offers 2 contracts per visit (refreshed by crossing count): **haul** (deliver N of a good to a region, pay ≈ 1.7× spot there, delivery at any station in the target region other than where it was inked) and **escort** (ride N legs unbroken). Max 2 inked. Crew grows two roles: Quartermaster (cargo, +scrap%) and Conductor (coach, −fuel%).

---

## The Teeth — combat depth (Wave 3)

**Damage types are live.** Every weapon already carried a `dt` tag (kinetic/blast/fire); now enemies have **armor classes** (`AC`): *light* (neutral, fire +), *armored* (blast blooms ×1.5, kinetic sparks ×0.7), *swarm* (fire eats it ×1.6). `dtMix()` totals the rig's output per type; `gunVs(class)` prices the matchup — the refit choice finally matters, and the wave log says so ("your blast fire blooms…" / "kinetic rounds spark off…"). Waves roll a class (crawler-led armored columns, bike swarms); bosses and elites are armored. **MINELAYER**: an unrepelled armored wave may seed the rail — the next wave opens with mine damage. **MARK TARGET**: tap the duel enemy (boss or convoy) on the canvas — all guns focus (+30%), pulsing chevron overhead; tap again to lift.

**Troops are manpower, not just mitigation.** The **BOARDER WAGON** (blockade legs, eff ≥ 6) grapples alongside: its boarding meter fills against your `troops()` — full meter cuts a hold open (scrap stolen); repelling it leans hard toward a war-hero drop. Troops also clear mined sidings at events, run send-a-party sweeps (≥8), and earn wall-duty scrap at OUTPOSTs; escorts pay a rifleman bonus. **Factions:** Dispatchers rep (+1 per contract, up to ★10 → +2%/★ contract pay) and Caravaneers rep (+1 per 4 trades → ±1%/★ market prices, friendlier traders). **Clans are enemies with names, never bookkeeping** (`CLANS`, one per region — the Rustborn, the Smoke Choir, the Marrow Kings, the Cindermen) — they color the logs and the crawler's band. **THE GHOST HAULER**: a rare pale train (≈3% of quiet legs) that passes without a sound and leaves a relic on the coupling if the holds have room.

---

## Save schema — versioned, migrated stepwise

`save()` stamps `v: SAVE_V`; `load()` runs `migrate(d)` **first**, so load logic only ever reads the current schema. `migrate()` is a **chain of stepwise upgrades** — one step per wave that grows state (v1→v2 normalized the live-shipped unversioned shape; v2→v3 will add map state and place veterans on the node graph). **Policy: a rig is sacred** — unknown/higher versions pass through untouched and load reads known fields defensively; only a genuinely unparseable blob falls back to a fresh boot. Extend save/load/reset (and the harness) together every time state grows.

---

## Extraction candidates for the studio pipeline (PROPOSALS — rule of three, Tier-1 serialized)

Born in IRONLINE, worth lifting to `/tools` **when a second game needs them** (never before; proposals only, per GOVERNANCE §7):
- The exporter's **dependency-free Canvas2D mock + PNG codec** (affine stack, gradients, path fill/stroke, PNG decode) — the general "render any canvas game headless" kernel.
- The **crop/zoom pixel-QA tool** (magnify any region of a render for defect-hunting — caught the roof wart, the scrub collisions, the kid's contrast).
- **`rhText` micro-glyph font** (3×5 pixel lettering for in-world signage).
- The **building grammar** pattern (parts + recipes + entity lists) — if a second game wants procedural settlements.
- The **behavioral-harness pattern** (universal-proxy DOM, eval the real script, drive the loop, assert).
