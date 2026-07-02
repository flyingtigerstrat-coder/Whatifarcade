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
