# DESIGN.md — Koi Garden
**Build state of the MVP as promoted into `games/koi/`. 2026-06-22.**

> What's actually built and how it's put together. Distilled from `HANDOFF_koi` + `CHANGELOG_koi`. Keep current as behavior changes (repo-root `CLAUDE.md` §3.5).

---

## Shape of the thing
One self-contained file — `koi-pond.html` — canvas-2D, procedural, no external dependencies. Mobile/touch-first, static-host safe, built to sip GPU for hours. Persistence via `localStorage` under the key **`koipond_v2`**.

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
