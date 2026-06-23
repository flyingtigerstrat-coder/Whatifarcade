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
- **Band 4:** water tower, signal mast, depot building — beside the rail, planted on the far rail, haze-dimmed. No over-rail structures (a full-width canopy/gantry cages the rig — retired).
- **Band 5:** the rig, docked, alone on its rail.
- **Band 6:** the plank platform + the Dispatcher + a kid + a worker + a lantern — a thin foreground strip.
- **Band 9:** "THE RAILHEAD" as a top-of-frame banner (off the rail; scales to every future depot).

> Reference note (Tiny Rails): borrowed for **spatial grammar only** — depth bands, train-alone-on-its-rail, place-name as a UI banner. **Not** its palette or mood; IRONLINE stays dusk + rust and never brightens toward the reference.
