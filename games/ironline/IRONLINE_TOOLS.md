# IRONLINE — Tool Inventory & Reuse Guide

The standing, reusable tooling built for IRONLINE: what each tool is, how to run it,
where it lives, and **how to get it back next session**. Keep this file with the game.

> **Source of truth:** the game is `battle-train-hd.html`. The tools read from / write to it.
> **Runtimes used:** Node `v22`, Python `3` with `PIL` (Pillow) + `numpy`. No network, no installs needed.

---

## 0. The one-minute version

| Tool | File | Runtime | Does |
|---|---|---|---|
| **Sprite / Scene / Animation exporter** | `ironline-export.js` | Node | Renders the game's own draw code to PNG — single sprites, **full world scenes**, and **animation frames** — headless, true 1:1. |
| **Asset → game-sprite importer** | `ironline-import.py` | Python + PIL | Turns a high-fidelity reference PNG into a faithful *game-resolution*, palette-locked sprite + an embed snippet. |
| **The game** | `battle-train-hd.html` | browser | The single-file game. The exporter reads its `<script>` to render. |

Both tools are plain scripts. Running them is **sub-second and free**. The only cost was ever writing them — already paid.

---

## 1. `ironline-export.js` — Sprite / Scene / Animation exporter

**What it is.** A headless renderer that loads the game's actual draw functions (extracts the `<script>` from
`battle-train-hd.html`, mocks the canvas/DOM, runs the real code) and writes a PNG. It is a *true snapshot of the
game's rendering*, not a re-drawing — so what it shows is what the game shows.

**Requires:** `battle-train-hd.html` sitting **next to it** (it reads the game from disk). Node only.

**Run:**
```bash
node ironline-export.js <subject> [options]
```

### Subjects
- `boss [tier]` — boss engine + convoy
- `boss-engine`, `boss-car <cannon|rocket|mortar|fuel>`
- `player [tier]`, `player-engine [tier]`
- `rig <comma-list> [tier]` — compose any consist, e.g. `rig oil,troop,gun:cannon` (`type:wpn` sets a gun's weapon)
- `raider <buggy|technical|bike>`, `trader`, `raider-train`, `elite [guns]`
- `fortress` — the imported hero engine sprite
- `scene [--off=N --T=N]` — **full 320×180 world frame** (backdrop + train) at world-position `off` (→ biome) and time `T` (→ day/night)
- `all` — render the whole sprite set at once (regression check)

### Options
- `--out=PATH` — output file (default under the outputs dir)
- `--scale=N` — pixel upscale factor (default per-subject; scenes use 4 → 1280×720)
- `--transparent` — transparent background (sprites)
- `--bg=#hex` — solid background color
- `--tier=N` — material tier for tiered subjects
- `--engine=NAME` — put a hero engine skin (e.g. `fortress`) on a `rig`/`player`/`scene`
- `--off=N` / `--T=N` — set world-position / time for a single `scene` frame
- `--anim=N` — render **N aligned animation frames** (one wheel rotation + one smoke cycle, seamless loop)

### Common recipes
```bash
# A single hero-headed consist, 1:1
node ironline-export.js rig oil,troop,gun:cannon --engine=fortress --scale=6 --out=out.png

# The world at a given place + time (midday Rust Flats)
node ironline-export.js scene --off=560 --T=192 --out=scene.png
#   T cheatsheet: 192 = midday · 0 = sunset · 91 = night · 156 = dawn

# Regression: render every sprite, scan for errors
node ironline-export.js all

# Animation: 16 aligned frames → assemble a GIF/strip with PIL (next section)
node ironline-export.js rig oil,troop,gun:cannon --engine=fortress --anim=16 --scale=6 --out=anim.png
```

**Under the hood (so a future Claude can extend it):** float "over"-compositing pixel buffer + hand-rolled PNG
encoder; affine matrix stack (`save/restore/translate/rotate/scale`); **real gradients** (`createLinear/RadialGradient`
record stops, `fillRect` samples per-pixel) and a **path system** (`beginPath/moveTo/lineTo/arc/ellipse/fill/stroke`
→ scanline polygon fill + segment stroke) so the backdrop renders fully; a mock `Image` that **decodes PNGs**
(inflate + unfilter) so imported heroes blit headless; `fixedBox` writer mode for full-frame scenes and aligned
anim frames. Gradient/path fills assume a **translate-only matrix** (true for the backdrop) — don't rely on them under rotation.

### Assembling a GIF / strip from `--anim` frames (PIL one-liner pattern)
```python
from PIL import Image
N=16
frames=[Image.open(f"anim-{i:02d}.png").convert("RGB") for i in range(N)]
frames[0].save("out.gif", save_all=True, append_images=frames[1:], duration=80, loop=0, optimize=True)
```

---

## 2. `ironline-import.py` — reference asset → game sprite

**What it is.** Turns a high-fidelity reference image (hand-made or AI-generated style-guide art) into a faithful
*game-resolution* sprite that matches IRONLINE's look: crops the subject off the card by **luminance+saturation**
(not modal color — the cards layer a cream card in a white grid margin, which fools single-color bg tests), keeps the
largest connected blob (drops labels/specks), Lanczos-downsamples to the game grid, **locks to the curated IRONLINE
palette** (so imported + procedural art share one color world), makes the bg transparent, and auto-trims any baked-in
rail line.

**Requires:** Python 3 + PIL (Pillow). Standalone — needs only the input PNG.

**Run:**
```bash
python3 ironline-import.py <asset.png> <name> [options]
```

### Options
- `--width=N` — target sprite width in game pixels (height follows aspect)
- `--palette=ironline|adaptive` — `ironline` locks to the shared palette (default, recommended); `adaptive` keeps the asset's own colors
- `--colors=N` — palette size for adaptive
- `--dither` — Floyd–Steinberg (note: leaks speckle into transparent edges — usually leave OFF)
- `--bg-threshold=N`, `--trim-bottom=N`, `--no-trim`, `--out-dir=DIR`

### Output (for `<name>`)
- `sprite-<name>.png` — the game-res sprite (transparent)
- `sprite-<name>@6x.png` — a 6× preview for eyeballing
- `sprite-<name>.js` — the **embed snippet**: `loadSprite('<name>', w, h, 'data:image/png;base64,...')` to paste into the game

### Recipe (how the Fortress was made)
```bash
python3 ironline-import.py fortress-style-guide.png fortress --width=112 --palette=ironline
# → produced a 100×50, 24-color, transparent, rail-trimmed sprite + loadSprite snippet
```

**In-game side:** `SPRITES` / `loadSprite(name,w,h,dataURI)` / `blitSprite(name,x,y,scale,flip)` near the canvas setup;
heroes can become a live engine via `S.engineSkin` (see handoff §3). The Fortress faces **right natively → `flip=false`**.

---

## 3. Supporting / generated files (not tools — outputs you can regenerate)

- **Hero sprite:** `sprite-fortress.png` / `@6x.png` / `.js` (the embedded engine).
- **Animation:** `IRONLINE_fortress_anim.gif`, `IRONLINE_fortress_anim_strip.png`.
- **Proofs / concept:** `IRONLINE_Fortress_proof.png/.pdf`, `IRONLINE_engine_slotmap.png`, `ironline-pipeline-proof.png`, `IRONLINE_*_proof.png`.
- **Sprite renders:** `ironline-boss*.png`, `ironline-player*.png`, `ironline-raider-*.png`, `ironline-trader.png`, etc. — all re-creatable via `node ironline-export.js all`.
- **Docs:** `IRONLINE_HANDOFF.md` (architecture), `IRONLINE_CHANGELOG.md` (history), this file.

---

## 4. How to access these tools again (important — the sandbox is ephemeral)

The working sandbox **resets between sessions** — files here do not automatically persist. To reuse the tools:

1. **Save the files now.** Download (or, if you're working in a Project, add to the Project) at minimum:
   `battle-train-hd.html`, `ironline-export.js`, `ironline-import.py`, `IRONLINE_HANDOFF.md`, `IRONLINE_CHANGELOG.md`, `IRONLINE_TOOLS.md`.
   Keep them **together in one folder** — the exporter reads the game HTML from beside it.
2. **Next session, re-upload them** into the chat. Then I can run:
   - `node ironline-export.js <subject> …`
   - `python3 ironline-import.py <asset.png> <name> …`
   Both runtimes (Node 22, Python 3 + PIL/numpy) are already available in the environment — nothing to install.
3. **Hand a future Claude the handoff first.** `IRONLINE_HANDOFF.md` §3 documents how the tools work internally,
   so they can be extended (e.g. new exporter subjects, new import palettes) without re-deriving anything.

**Minimum reuse kit:** `battle-train-hd.html` + `ironline-export.js` + `ironline-import.py` + the three `.md` docs.
With those five-plus files in one folder, the entire pipeline — render, import, animate, scene — is fully restored.

---

## 5. Quick command cheat-sheet

```bash
# RENDER a sprite
node ironline-export.js rig oil,troop,gun:cannon --scale=6 --out=consist.png
# RENDER the world (place + time)
node ironline-export.js scene --off=560 --T=192 --out=world.png
# ANIMATE a hero-headed train (frames → GIF via PIL)
node ironline-export.js rig oil,troop,gun:cannon --engine=fortress --anim=16 --out=a.png
# IMPORT a reference into a game sprite
python3 ironline-import.py my-asset.png myhero --width=112 --palette=ironline
# REGRESSION check after any game edit
node ironline-export.js all
# PARSE-check the game after editing
node -e 'const fs=require("fs");new Function(fs.readFileSync("battle-train-hd.html","utf8").match(/<script>([\s\S]*)<\/script>/)[1]);console.log("OK")'
```
