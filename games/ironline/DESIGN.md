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
