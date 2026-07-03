# DESIGN.md — Koi Garden
**Build state as of LIVING POND Phase A (BRIEF v1.1). 2026-07-02.**

> What's actually built and how it's put together. Keep current as behavior changes (repo-root `CLAUDE.md` §3.5).

---

## Shape of the thing
One self-contained file — `koi-pond.html` (engine version in the header comment; bump every merge) — canvas-2D, procedural, no external dependencies. Mobile/touch-first, static-host safe, built to sip GPU for hours. Persistence via `localStorage` under **`koipond_v3`** (lossless v2 upgrader; **the old `koipond_v2` key is left in place** for rollback safety — never eat a pond). Derived life (school, dragonfly, fireflies) is never saved; it re-derives from ecology on load.

## Living-pond foundations (Phase A)
- **Entity/skin contract v2:** each skin carries `roles` palette tokens (foliage/foliageRim/stone/moss/wood/bloom/glow); `ROLES()` resolves with Natural fallback (rain inherits Natural by construction — it renders the Natural pond into its buffer). New entities draw once against roles; bespoke per-skin handlers win when present. **No entity ships unless it reads correctly in all four skins.**
- **Planes:** every entity declares BELOW / ON / ABOVE; planes render in order (contract documented in the header; below/above populate in Phases B/C).
- **Blended growth + stages:** passive time growth (`GROW_DAY=.01`/day, applied live and via idle sim) + fed growth (`GROW_FED=.02`/s while eating). Size stops at adult (age 1); age accrues to `AGE_MAX=1.6`; `stage(k)` derives fry/young/adult/elder; `eldF(k)` ramps elder fins (~1.7× trailing fin) and slows drift (~28%). Elder is prestige, never death.
- **Idle return:** on load, a capped gift for time away (≤72h worth: growth, plant grow/bloom, serenity ≤60), then `rollVisitors()`. A month away grants the same as three days — a gift, never an exploit.
- **Ecology (hidden):** `Eco.shelter/bloom/life/calm` — pure derivations from what exists; visitors (Phase C) register `{when(eco), arrive()}` against them. Numbers stay hidden; legible through life, never meters.
- **Capacity ledger (human-ratified):** `CAPS = {koi:18, plants:36, rocks:12, school:20, fireflies:10}`; tend buttons disable quietly at cap. Departure (Phase B) is the release valve.

## The dream pond (Phase B)
- **Flora:** pad varieties via saved `vr` (classic / copper / cluster); mature pads open **water-lily blooms** (feed `Eco.bloom`); **reeds**, **iris**, **duckweed** (koi nibble it — ambient self-feeding trickle; floor .35, regrows), **submerged grass** (BELOW plane, drawn under koi). Every new type is one draw function against `ROLES()` — skin-correct everywhere by construction.
- **Hardscape (`rocks[]`, persisted normalized):** stone/boulder/slate (seeded organic blobs), driftwood, stone lantern. Moss creeps with `grow` (live + idle); koi steer around; ripples foam at rims (arc highlight). Rocks drag heavy (rate .9 vs 3.5, bigger displacement ripples).
- **Tend tray:** `CATALOG` drives plant/place chips; **arm chip → tap water to place** (`placing`/`placeAt`); caps + serenity checked at arm and at place; prices are placeholders until the Phase D rebalance.
- **Koi card:** click koi = select (click water = feed). Card shows variety/stage/lineage; **"let it swim on"** = two-step confirm → `departing` steering to the nearest edge → recorded in `departed[]` (variety, seed, age, date) → farewell ripple. No refund, no return.
- **Dev lifecycle harness (`?dev=1`):** warps set `eco.lastSeen` back and call the **real** `idleReturn(uncap)` — production code path, cap lifted. Buttons: +1d/+7d/+30d, +200❀, mature flora, age koi. For rapid whole-lifecycle review during refinement.

## Water — three layered passes
1. **Pass 1:** drifting layered caustics + a breathing surface shimmer + a wandering sunbeam + koi wake-trails.
2. **Pass 2:** propagating refractive ripple trains (a bright crest + a bent trough) with sun-glint sparkles on the crests.
3. **Pass 3:** glassy sky-sheen + a Fresnel rim + cool depth.

**Featherlight by design:** one reusable soft sprite, capped particle counts, a **40fps cap**, and it **pauses when the tab is hidden.**

## Koi — shape, pattern, individuality
- **Silhouette:** sleeker — rounded head, broad shoulders, a smooth taper to a pinched caudal peduncle.
- **Patterns:** show-accurate **Nishikigoi** via a **patch model with directional edges** — soft leading edge (**sashi**), crisp trailing edge (**kiwa**) — and per-variety placement (Showa black wraps body + head; Sanke clean white face; Asagi net back with red climbing the flanks; Tancho single head crown). Net-scale + scale-shimmer texture so solid koi read as scaled, not flat.
- **Color:** per-patch warmth/brightness tone + scattered multi-patch hi, so white-bodied koi carry many varied reds (matching the reference photo) instead of flat blocks.
- **Eight varieties:** Kohaku, Asagi, Ogon, Platinum, Sanke, Benigoi, Showa, Tancho.
- **Per-fish individuality:** each koi carries a **SAVED seed** that generates its exact pattern (jittered template + scattered secondary hi patches + per-patch warmth/brightness tone). No two koi are alike, and your specific fish **persist across reloads.**

## Plants
Lily pads and lotus **drag** through the water with watery lag and trailing ripples, and **float** on their own — idle buoyant-spring bob, slow rotation, riding passing waves. Each skin re-colors the lotus correctly.

## Skins — one engine, interchangeable looks
**natural · liquid metal · sumi ink · rain on glass.** Canvas state is **hardened** so a skin can never leak blend/blur into the next (hard reset + per-frame guard).

A skin is a faithful *performance* of the shared pond — it must treat the **whole frame** (substrate, light, ripples, pads, koi), not just repaint props. **liquid metal** is built on this rule (BRIEF v0.4): warm-tinted dark **mercury** substrate with specular contrast; **mirror-warp** caustics; koi render their real pattern cast in their **organic metal** (copper/brass/bronze; Platinum the one cool silver focal); pads **patina brass→verdigris over their growth state**; ripples bead into bright specular crests (`SKINS[skin].rip`). Metal is a *finish* (specular highlights on a dark mirror), never a grey palette. `drawPad`/`drawLotus` take an optional finish-options arg so a metal pad can drop the organic veins and add a hotspot without affecting other skins.

**v0.5 finish (dynamic range + temperature split):** the metal grade carries a deliberate **temperature split** — warm bronze *mids* but **cool silver-blue speculars** (`METAL_COOL`), as if the mirror reflects a dusk sky. Cool-on-warm is the key "real metal" cue and is applied consistently to the water pool/sheets, the koi rim/hotspot/body-band, the ripple crests, and the overlay sky-sheen. Dynamic range is pushed from the grade (deeper darks + deeper vignette + genuinely blown speculars), never a per-frame `ctx.filter` (the expensive class that crashed ink). The metal verdigris is a **muted oxidized grey-green**, not jade, and pad speculars are kept *below* the water speculars so the focal hierarchy holds (water speculars → silver koi → warm-koi edges → pads).

**v0.6 motion (flowing chrome):** to read as *liquid* metal (not painted), the reflections **move**. `chromeRibbon(c,yc,thick,t,seed,a)` draws a bright cool band with sine-undulating edges (one wavy filled path, screen-blended, ~`W/90` segments — cheap); the substrate composes a slow reflected "horizon" ribbon plus a few ribbons that scroll and wave like mercury. On koi, the cool specular band's gradient-stop position is animated so the highlight **slides along the flank**. Reduced-motion slows the flow. Tunable dials: ribbon count, scroll speed (`t*22*(i+1)`), thickness, and alpha. Escalation path if it reads under-baked: full molten mercury (pooling/merging metaball beads) via a low-res offscreen buffer like the rain skin — deliberately *not* done yet (budget + keep the koi legible).

## In-game Koi Codex
A **hideable side panel** (the first node of the pond-management nav) that renders every variety **live through the real engine**, with unlock badges priced in **serenity**; unlocked varieties join the release pool. Doubles as a QA surface.

## Known stability fixes already in
- Canvas state-leak between skins → hard reset + guard per frame.
- Ink/metal crash on lotus → fixed non-finite gradient radius.
- Ink lotus retoned to the skin palette.
- Expensive ink `shadowBlur` swapped for a cheap stroke halo.

## The transparency gotcha (studio-wide, applies here)
Pixel GIFs reserve a dedicated magenta transparent index; skipping it makes fur/dark colors render as transparent. Not currently a koi concern (canvas-2D, procedural), but noted per `CLAUDE.md` §8 if any sprite export is ever added.

---

## What's NOT the open work
The rendering is **done** and rich. The open work is the **LOOP** — see `BRIEF.md`:
- **Blended growth curve** (first pass): koi grow slowly over time AND faster when fed, replacing today's food-only model.
- **Legible tending:** serenity gain + koi/plant growth quietly readable at a glance — no attention-demanding meters.
- **Unlock economy:** codex unlock costs (40–120 serenity) are placeholders; tune to feel earned over a few calm sessions, never grindy.

## Performance architecture (B.2)
The featherlight budget is enforced by construction, not hope:
- **Per-entity sprite slots** — quasi-static art (pads, lotus, hardscape) bakes into ONE canvas owned by the entity for its lifetime, re-baked IN PLACE when its look-key (skin + bucketed grow/bloom) changes, under a **2-bakes-per-frame budget** (stale sprites draw until their turn — smoothness beats freshness). No shared cache map: no growth, no clear-storms, no canvas/GPU-texture churn. Caustic blobs and rain-drop highlights are pre-tinted sprites. Animated flora (reeds/iris/grass/duckweed) stays vector but hoists one gradient per plant.
- **Koi hot path** — one `Path2D` per fish per frame reused for shadow/fill/clip/sheen/rim; shadows are offset fills (never `ctx.filter` blur); scale/net arcs batch into two strokes per style; sashi feathers are stepped washes, not per-patch gradients.
- **DPR capped at 1.5**; DOM chrome updates diff-guarded (`syncShop` writes only on change).
- Budget check: `perf-count` harness (scratch tooling) counts gradients/strokes/filters per frame on a composed pond — keep natural under ~30 gradients/frame; any new per-frame gradient in a hot loop should be a sprite or a cached paint instead.

## The feeding frenzy (C.3)
Feeding is the pond's most alive moment. The **splash excites every koi** (transient `excite`, never saved) scaled by distance + hunger: sensing stretches 280->~710px, steering hardens, speed surges to ~2.5x with a brake in the final stretch so the crowd gathers AT the food. Near the food the crowd **jostles** (soft separation + churn ripples); each fish targets the nearest **unclaimed** pellet. **Eating is visible**: the claimed pellet is drawn into a working mouth (`drawGulps` — engine-level top-down "O", cycling open-shut over any skin's koi) and the final slurp pops a ring other koi rush to. **Handling time** (finish the gulp + a short chew before the next claim) + fed fish pressing less hard means the throw shares itself. While food floats, excitement floors at .45; when the water empties it decays in ~2s — frenzy, then calm. Pellets bob/drift, life 18-24s. Reduced-motion tempers the surge but the gathering still happens.

## Frame-rate-independent feeding (C.5.1)
The feeding motion is written to look identical at any dt (desktop ~.016s, mobile clamped ~.1s). The turn-rate floor is **scaled by the brake** so a fish keeps agile turn-in while approaching but settles (no pivot) at the pellet — this killed the mobile pirouette (0.73→0.33 rad/s near food). Neighbor jostle is gathered into one nudge and **capped** (~30px/s). A fish steers for a pellet only until contact (~14px); the suck-in (`pl` capped) finishes it. Big fish dominate by **reach** (`eatR = 14 + ewd*.5`), not agility — the anti-spin correctly makes them less nimble. The gulp "O" is small/dim and cycles at 9 rad/s (no strobe); it hints the eating angle rather than declaring it (no separate head bone yet).

## The composer update (C.7)
Caps re-ratified to **plants 64 / rocks 28**. Tend UI: plants/stones nouns, accent open-state, live "n of max placed" readout, armed hint teaches cancel. Four mature-on-purchase items: **horsetail** (segmented stems; perch/anchor/steer-around), **water hyacinth** (floating rosette + lavender bloom via `bloomAlt`; feeds `Eco.bloom`), **bamboo spout** (baked stand + LIVE arm; stateless seeded ~12–16s cycle — fills, tips, pours a real ripple; spill fires sim-side in `step()`), **stepping stones** (three seeded worn flats). Lantern + spout generate at one fixed size — built things are consistent, nature varies.

## Skin-reactive chrome + signatures (C.6)
The DOM chrome themes itself per skin via one `data-skin` attribute on `<body>` driving CSS tokens (bg, hairline, accent, glyph) — natural dark-glass/amber, metal bronze/brass with a cool glyph, ink near-black/vermilion, rain slate-glass/rain-blue. Focus-visible rings on every control, styled per skin. Isolation by construction: controls read tokens, skins never restyle each other. Each skin carries one **signature**: natural = daylight pollen motes (stateless, capped, day-gated); metal = the ~30s showroom sweep band; ink = laid-paper grain + a vermilion hanko seal (both baked once); rain = the breathed-on pane (baked center-wipe through the fog). All within the featherlight budget.

## Shadows (C.5)
One shared soft radial sprite drawn LIVE under entities (not baked into their sprites): **shape-matched** — elongated + rotated to the object (a log shades a sliver along its axis; slate low and thin; lantern base-only; pads/lotus sized pools; reeds/iris small waterline contacts) — and **day-aware** via `SHDIM` (set each frame from `dayMix`): full at noon, softened dusk/dawn, ~35% at night; koi + dragonfly shadows follow; ink fixed at .85. One drawImage per entity, no per-frame gradients. Light direction is a fixed azimuth (down-right), offset scaling gently with size.

## Feeding hierarchy (C.4 — grounded in real koi behavior)
Real ponds run a **size-led pecking order**: bigger, older koi hold higher rank, reach the food first, take the first bite, and push smaller fish aside; boldness is a second, personality axis. Modelled as `domin(k)` = **60% size** (live `elen`, so growing up climbs the order) + **40% boldness** — a stable per-fish temperament from the saved seed (`k.bold`, never saved separately, never re-rolled). Dominant fish react to the splash harder, rush faster (arrive first), win the asymmetric jostle (subordinate yields, dominant holds the spot), and can snatch a barely-touched pellet from a lesser fish. **Elders lead the charge** — the calm elder-drift brake is lifted by excitement. A settle-to-eat brake (~18px) parks a fish on the pellet instead of overshooting. Crucially **nobody starves**: handling time forces gaps so the timid always get their turn on the next pellet — the no-fail-state law holds. In aggregate the big fish get more, with realistic per-fish scatter from boldness and position.

## The three planes alive (Phase C)
- **Visitors derive from ecology** (`VISIT={shelter:6,frogPads:3,bloom:3}` — quick-unlock rider): school when `Eco.shelter()>=6` (hysteresis −2 once seen); frog residence at 3+ mature pads + calm (persists in save; `Fauna.frogRt` position derives); dragonfly in bright hours at bloom≥3 (transient). Arrival rolls every ~5s live + `Eco.visitors` on idle return. **No predation, ever** — the school darts, is never eaten; the frog never hunts.
- **Day cycle:** `dayMix()` maps the real local clock (or codex QA force / `?hour=` dev override) to dusk/night/dawn strengths with ~1.5h ramps; `dayTint()` applies multiply/screen grades scaled by strength. Ink exempt (eternal dusk). Lantern window glows when dusk+night strength > .25.
- **Fireflies:** dusk/night + ≥5 mature plants + `calm>.3` (~40s unstirred) → ≤10 softSprite motes with winking phase, faint water reflections, reduced-motion drifts slower.
- **Moments:** `firstSeen(key,gift)` stamps `Pond.seen{}` (saved; the Almanac's memory) + `momentT(key,gift,cooldown)` for quiet repeat rewards. Zero UI.
- **Plane order in render:** water → BELOW plants → school/frog-glide → rocks → koi → ON plants → frog-sitting → fx/overlay/sparkles → dragonfly/fireflies → dayTint. Rain draws fauna inside its buffer (behind the glass).
