# CLAUDE.md — IRONLINE (game-specific context)
**Nested context for `games/ironline/`. Read this with the repo-root `CLAUDE.md` (studio brain) and `GOVERNANCE.md`. This file governs only this folder.**

> The deep technical/architecture record is `IRONLINE_HANDOFF.md`; the tool usage + internals are `IRONLINE_TOOLS.md`; the journey is `CHANGELOG.md` (current) + `IRONLINE_CHANGELOG.md` (pre-process history). The studio brain is the constitution; this is the pod-local lens.

---

## What IRONLINE is
A mobile-first, pixel-art **idle/management game about an upgradeable armored battle train crossing a post-apocalyptic "rail ocean" wasteland.** Tiny Rails coziness (side-on, watch-it-roll) crossed with a Mad-Max waste of rust, dusk, diesel and bone. You build a rig, send it across the wastes, watch it fight and roll through a living world, pull into named depots, and grow it over a long journey. **Feeling-first — whimsical, nostalgic, beautiful — not a metrics product.** IRONLINE shipped first; it's a loved, deep engine we're giving a spine (a journey, not a treadmill).

## Architecture (read the code; it's the source of truth)
- **One self-contained file: `battle-train-hd.html`** — the entire game, no build step, no runtime deps. Logical canvas is **320×180** (internal 640×360, `RS=2`); `BASE=138` is the rail baseline (bottom-anchor grammar). `battle-train.html` does not exist here; ignore any reference to an old 190×110 version.
- **Boot flow:** `play.html` boots the studio bumper -> IRONLINE's attract -> the game. Save via `window.storage` (game-local).
- **Render pipeline:** `draw()` -> `drawBackdrop()` (sky/sun/ridges/haze/ground/`storyAt` props/wrecks, all modulated by `dnLight`+haze) -> `lane()`s -> `drawTrain()` -> entities -> `drawOverlays()` (night wash + vignette). The procedural world is immediate-mode Canvas2D via helpers (`px`/`pxa`, `box`, `mat`, `panel`, `cyl`, `wheel`, …). Only the Fortress hero engine is a baked PNG sprite.
- **Day/night:** `dayNight()` sets `dnTop/dnMid/dnHor` (sky), `dnLight` (0..1), sun/moon. **T=0 is sunset/dusk** (the defaults at the `dn*` declaration are already a dusk frame).
- **Motion:** `tick()` — `spd` is `110` in `run` (0 during a set boss fight), else `14`. **idle AND depot both leave spd=14**, so docking never physically stops the world. Making the world come to REST at a station is Phase A's core change.

## This pod's lane (what `games/ironline/` owns — and only this)
- Everything under **`games/ironline/`** — the game, `play.html`/`attract.html`, `assets/`, `art-spec/`, `api/`, the tools, and the game's docs. Tier-2, parallel-safe.
- **Read from** `/shared/*` and `/tools/*`; **never edit them** (keystone territory). A `/shared` or brand change is **Tier-1** — propose to the human; don't edit it yourself (GOVERNANCE §7).
- **Never touch** `index.html`, `/shared`, `/services`, or another game's folder.

## Tools (yours to run — restored into this folder)
- **`ironline-export.js`** (Node, no deps) — headless renderer of the game's **own draw code** to PNG: single sprites, **full world scenes**, aligned anim frames. True 1:1 (mocks the 2D context into a pixel buffer; hand-rolls PNG via zlib). Reads `battle-train-hd.html` from beside it. The way to put a visual in front of the human without a browser.
  - `node ironline-export.js scene --T=0 --out=frame.png`  ← the dusk proof frame (T cheatsheet: 192 midday · **0 sunset** · 91 night · 156 dawn)
  - `node ironline-export.js all`  ← regression render of the sprite set after any edit
  - To render NEW backdrop content (e.g. The Railhead) the exporter's `scene` subject must set the state that triggers it — extend the SUBJECTS registry (in-lane, it's IRONLINE-local).
- **`ironline-import.py`** (Python + PIL/numpy) — reference image -> palette-locked game sprite + a `loadSprite()` embed snippet. For the "bitmap origin" option.

## Working notes & gotchas
- **You can't render the live canvas headlessly** — the exporter PNG is how you show the human; their eyes are final on visuals. Describe the change, render a still, let them look.
- **Validate JS** before declaring done: parse-check the `<script>` in node, and run `node ironline-export.js all` to catch render crashes.
  - `node -e 'const fs=require("fs");new Function(fs.readFileSync("battle-train-hd.html","utf8").match(/<script>([\s\S]*)<\/script>/)[1]);console.log("OK")'`
- **Pixel GIFs reserve a magenta transparent index** — skip it and dark fur/colors render transparent (it once turned Noodle white).
- **The Fortress hero engine faces RIGHT natively** (`flip=false`).
- **Don't regress:** camera coupling (EX holds native 216 under fire), combat-coords-absolute, the draw order, and save discipline (extend `save`/`load`/reset together). Begin-at-origin keys off "no save loaded" (fresh game only).
- **Before the first push of a session, confirm remote + branch.**
- **Save** serializes a fixed field set in `save()`/`load()`; reset is around the depart/limp-home paths. Any new persistent state must be added to all three.

## Status & next
- **Phase A · THE RAILHEAD (arrival-first) — building.** Tooling + docs promoted; the dusk exporter is proven. Next: author `drawRailhead()` (procedural, palette-locked, in the backdrop so the world lights it) and render the dusk proof frame for the human's blessing BEFORE wiring the arrival/departure choreography (spd->0 at rest), begin-at-origin, and the Dispatcher's ticker voice — hosted on the existing depot seam.
- **Phase B (tutorial / "Depart vs Guided Departure" fork) is PINNED** — do not build it this pass.
- See `BRIEF.md` for the full scope/out-of-scope and the named parked threads.
