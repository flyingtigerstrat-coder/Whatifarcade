# CHANGELOG — KOI GARDEN
(newest on top; fields: DECIDED / TRIED / PARKED / CHANGED / OPEN / FEELING)

## 2026-06-23 — metal skin polish pass (BRIEF v0.4 pilot)
DECIDED: ran the first build pass on the **liquid-metal skin** under BRIEF_koi v0.4 (promoted to BRIEF.md). Two governing principles: a skin treats the WHOLE frame, and metal is a FINISH (specular behaviour), not a grey palette. Entirely within `games/koi/`; v0.1 blended-growth stays PARKED.

CHANGED (metal skin only — `SKINS.metal` + small shared hooks):
- Substrate: replaced the cold blue-grey field + rainbow hue-cycling caustics with **warm-tinted dark mercury** — a bright specular pool at the light source against deep darks (specular contrast), never teal/neutral.
- Light: caustics retuned to **mirror-warp** (slow warm molten ripples) + rolling specular sheets; rainbow hue cycling removed.
- Koi: now render each fish's **real Nishikigoi pattern cast in its organic metal** (reuses the existing pattern engine via a metal-recolored variety) — Kohaku reads copper-and-silver, Ogon molten brass, Benigoi copper-red, Showa dark bronze. Directional mirror gradient + a sliding specular hotspot + a sharp leading-edge highlight + strong scale shimmer. **Platinum reads cool silver-white** as the single focal accent among the warm metal.
- Pads: **brass-when-young → verdigris-when-mature**, interpolated over each plant's EXISTING `grow` state (no new growth system) — tending literally patinates the pond. Specular hotspot + dark mirror rim; the machined pinwheel-vein seam is dropped for metal. Lotus blooms gilded brass/gold.
- Ripples: `drawFX` made per-skin (`SKINS[skin].rip`); metal beads into **bright warm specular crests with deep troughs** ("mercury beading"). Default ripple look unchanged for the other skins.

KEPT / didn't regress: sparkle/glint + wake systems (read as specular on the mirror); the per-frame canvas-state reset + try/catch; koi shape and pattern model untouched (tonal/material pass only). `drawPad`/`drawLotus` gained an optional finish-options arg — other skins pass nothing and render identically.

TRIED / VERIFIED: node parse-check clean; headless smoke test drives all four skins (natural/metal/ink/rain) + the codex through several frames with **zero render warnings**.

OPEN / for screenshot review: the cool focal accent is mapped to the **Platinum** variety (its organic metal is silver). The default pond seeds no Platinum — release or unlock one to see the focal note. Asagi's blue net still reads faintly cool over bronze (low-alpha; candidate refine). Full per-patch verdict awaits the director's pixels.

## 2026-06-22 — promoted into the repo at games/koi/
DECIDED: koi promoted from its founding-chat MVP (`koi-pond.html`) into the monorepo at **`games/koi/`** (PROCESS_new-game-bootup step 4). Promotion is **move + wire-up, not redesign** — the MVP is finished and stable, copied in byte-for-byte (verified by checksum). Game file lives as `games/koi/koi-pond.html` (matches the studio's descriptive-filename convention, e.g. `firefly-jar.html`).

CHANGED (this session):
- Scaffolded `games/koi/` from `games/_template`.
- Promoted `BRIEF_koi v0.1` → `games/koi/BRIEF.md` (stable repo name; git holds history).
- Seeded `games/koi/CLAUDE.md` (game context, distilled from `HANDOFF_koi`) and `games/koi/DESIGN.md` (build state: 3-pass water, patch-based show-accurate koi + per-fish seed, plant float physics, 4 skins, in-game codex + serenity unlocks).
- Verified the inline `<script>` parse-checks clean in node after the move.

DECIDED (provisional arcade hosting — folded in from `NOTE_koi_provisional-arcade-hosting v1.0`, a deliberate interim decision recorded so "temporary" can't quietly become "permanent"):
- **Ship Koi Garden live now, provisionally, inside the existing What If Arcade harness** while long-term strategy is still being shaped. Rationale: a small, un-marketed audience is the cheapest experimentation window; a live pond teaches what koi *is*; the move is reversible (static site).
- **Split by pod ownership:** POD_KOI promotes the MVP into `games/koi/` and owns only that folder; **POD_ARCADE** adds the provisional storefront entry on `index.html` and owns the harness/deploy.
- **Host koi lightly — it keeps its own look.** No reskin to the dusk-arcade palette, no heavy chrome. The arcade is a *doorway*, not a verdict.
- **Recommended placement: soft / quiet** (an "experiments" / low-key entry), not a headline cabinet. Exact placement is a human-ratified keystone gate (§7).
- **Measure return & dwell, not plays.** Koi is not a game; game-shaped metrics would mislead.

SEQUENCING: hard dependency — **POD_ARCADE is BLOCKED until `games/koi/` lands.** Order is promote-then-harness.

TRIPWIRE: set a deliberate revisit point for the permanent brand/home decision (a date or a threshold, e.g. "once N visitors have returned to the pond more than once"). Until then the interim home rides; at the tripwire the human re-opens the Tier-0 questions rather than letting the default calcify.

PARKED: blended growth curve (first BRIEF v0.1 build pass — next up); legible tending; unlock-economy tuning; creative mode; new skins/varieties.

OPEN (Tier-0 — human's call): brand architecture (sibling brand vs inside What If Arcade); visual brand (does the dusk-arcade palette apply); monetization (first cosmetic-only product?); name / shelf identity for the second-shelf concept. Plus growth/serenity tuning numbers.

## 2026-06-22 — pod founded; water + koi passes; in-game codex
DECIDED: koi becomes its own game with its own pod (POD_KOI); director seated. HANDOFF_koi + first BRIEF_koi (v0.1) written. Per-fish seeded patterns are saved, so individual koi persist exactly.

CHANGED (build, this founding run):
- Water: three layered passes shipped — drifting caustics + breathing shimmer + wandering sunbeam + koi wake-trails; refractive ripple trains (crest + trough) + sun-glint sparkles on the crests; glassy sky-sheen + Fresnel rim + cool depth. Kept featherlight (one soft sprite, capped counts, 40fps, pause-when-hidden).
- Koi: rebuilt to show-accurate Nishikigoi — patch model with sashi (soft front) / kiwa (sharp back) edges, per-variety placement, net + scale-shimmer texture; sleeker body silhouette; eight varieties incl. new Benigoi.
- Koi color: per-patch warmth/brightness tone + scattered multi-patch hi, so white-bodied koi carry many varied reds (matching the reference photo) instead of flat blocks.
- Plants: buoyant float added (idle bob, slow rotation, riding passing waves) on top of the existing watery click-drag.
- Codex: brought IN-GAME as a hideable side panel (first pond-management nav node), rendering every variety live with serenity-priced unlocks; unlocked koi join the release pool. Doubles as QA.

TRIED / FIXED: canvas state-leak between skins (hard reset + guard per frame); ink/metal crash on lotus (non-finite gradient radius); ink lotus retoned to skin palette; expensive ink shadowBlur swapped for a cheap stroke halo.

PARKED: blended growth curve (recommended; queued as BRIEF v0.1 scope); creative mode; new skins/varieties; cabinet/storefront placement (waits on the brand decision).

OPEN (Tier-0 — human's call): brand architecture (sibling brand vs inside What If Arcade); visual brand (does the dusk-arcade palette apply); monetization (first cosmetic-only product?). Plus growth/serenity tuning numbers.

FEELING: it crossed from "tech demo" into "a place" — the water reads as liquid, the koi read as individuals. The work now is the loop, not the look.
