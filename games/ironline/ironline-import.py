#!/usr/bin/env python3
"""
IRONLINE - asset -> sprite importer
-----------------------------------
Turns a high-fidelity reference asset (hand-made or AI-generated) into a faithful,
game-resolution sprite that drops straight into IRONLINE. It does NOT redraw the asset
by hand - it downsamples the real pixels to the game grid, locks them to a curated
IRONLINE palette so every train shares one color world, and emits a tiny transparent
PNG plus a ready-to-paste embed snippet for the single-file game.

This is the second half of the art pipeline (the first half, ironline-export.js,
goes procedural -> PNG; this goes PNG -> game sprite).

USAGE
  python3 ironline-import.py <asset.png> <name> [options]

OPTIONS
  --width=N        target native sprite width in logical px (default 140); height auto
  --height=N       target native sprite height instead (width auto)
  --palette=MODE   ironline (lock to game palette, default) | adaptive (asset's own colors)
  --colors=N       adaptive palette size (default 32)
  --dither         Floyd-Steinberg dither when locking to the IRONLINE palette (smoother)
  --bg-threshold=N background cut distance from the modal bg color (default 72)
  --out-dir=DIR    output directory (default .)

OUTPUTS  (for name "fortress")
  sprite-fortress.png        native transparent sprite (what the game blits, 1:1)
  sprite-fortress@6x.png     6x nearest-neighbor preview (for eyeballing)
  sprite-fortress.js         embed snippet: loadSprite('fortress', w, h, 'data:image/png;base64,...')

EXAMPLES
  python3 ironline-import.py asset.png fortress
  python3 ironline-import.py asset.png fortress --width=160 --dither
  python3 ironline-import.py asset.png boss_ram --palette=adaptive --colors=40
"""
import sys, os, base64, io
import numpy as np
from PIL import Image

# ---- curated IRONLINE master palette (the rust-iron + steel world) -------------------
# pulled straight from the game's material ramps so imported sprites match procedural ones
_HEX = (
    # darks / outlines
    "0a0807 16110b 1c140d 241a12 2a262a 3a4045"
    # BOSSM warlord rust-iron
    " 150c07 39271b 5e4233 876048 a37e5a"
    # MAT[1] neutral steel
    " 14110d 2f363b 566069 7e8a93 9aa0a6"
    # GUNM cool steel
    " 0e1218 243038 3e4e58 5e7280 8ea4b4"
    # RAIDM neutral dark steel
    " 0b0d10 1e2428 363d43 525c64 76838c"
    # RUSTR rust accents
    " 2a1505 5a341c 8a5026 b0703a"
    # warm accents / glints
    " e0a33a caa23a 9fd8d8"
).split()
IRONLINE_PAL = np.array([[int(h[i:i+2], 16) for i in (0, 2, 4)] for h in _HEX], dtype=np.float64)

def parse_args(argv):
    if len(argv) < 2:
        print(__doc__); sys.exit(1)
    asset, name = argv[0], argv[1]
    o = dict(width=140, height=None, palette="ironline", colors=32,
             dither=False, bg=72, out=".", trim=True, trim_n=None)
    for a in argv[2:]:
        if a == "--dither": o["dither"] = True
        elif a == "--no-trim": o["trim"] = False
        elif a.startswith("--trim-bottom="): o["trim_n"] = int(a.split("=")[1])
        elif a.startswith("--width="): o["width"] = int(a.split("=")[1]); o["height"] = None
        elif a.startswith("--height="): o["height"] = int(a.split("=")[1]); o["width"] = None
        elif a.startswith("--palette="): o["palette"] = a.split("=")[1]
        elif a.startswith("--colors="): o["colors"] = int(a.split("=")[1])
        elif a.startswith("--bg-threshold="): o["bg"] = int(a.split("=")[1])
        elif a.startswith("--out-dir="): o["out"] = a.split("=")[1]
    return asset, name, o

def crop_to_content(im, bg_thresh):
    """Separate the (dark, weathered) train subject from the light card/grid/margin.
    Style-guide cards layer a cream card inside a white margin with a faint grid, so a
    single modal-color test fails; luminance+saturation cleanly splits dark subject from
    light background. bg_thresh nudges the luminance cutoff."""
    a = np.asarray(im.convert("RGB")).astype(np.float64)
    lum = 0.299 * a[:, :, 0] + 0.587 * a[:, :, 1] + 0.114 * a[:, :, 2]
    mx = a.max(2); mn = a.min(2)
    sat = (mx - mn) / (mx + 1e-6)
    bg = (lum > (255 - bg_thresh - 20)) & (sat < 0.16)     # light + near-neutral = card/margin/grid
    mask = ~bg
    mask = _largest_blob(mask)                              # keep the train, drop the label text & specks
    ys, xs = np.where(mask)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    rgb = a.astype(np.uint8)
    rgba = np.dstack([rgb, np.where(mask, 255, 0).astype(np.uint8)])
    return Image.fromarray(rgba[y0:y1+1, x0:x1+1], "RGBA")

def _largest_blob(mask):
    """Largest 4-connected component, dependency-free (iterative BFS)."""
    H, W = mask.shape
    seen = np.zeros_like(mask, dtype=bool)
    best = None; best_n = 0
    idx = np.argwhere(mask)
    for sy, sx in idx:
        if seen[sy, sx]:
            continue
        stack = [(sy, sx)]; seen[sy, sx] = True; comp = []
        while stack:
            y, x = stack.pop(); comp.append((y, x))
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < H and 0 <= nx < W and mask[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True; stack.append((ny, nx))
        if len(comp) > best_n:
            best_n = len(comp); best = comp
    out = np.zeros_like(mask)
    if best:
        ys, xs = zip(*best); out[list(ys), list(xs)] = True
    return out

def downsample(im, width, height):
    w, h = im.size
    if width:  tw, th = width, max(1, round(h * width / w))
    else:      th, tw = height, max(1, round(w * height / h))
    return im.resize((tw, th), Image.LANCZOS)

def lock_to_ironline(rgb, alpha, dither):
    """Map every opaque pixel to its nearest IRONLINE palette color."""
    out = rgb.astype(np.float64).copy()
    H, W, _ = out.shape
    if not dither:
        flat = out.reshape(-1, 3)
        d = ((flat[:, None, :] - IRONLINE_PAL[None, :, :]) ** 2).sum(2)
        out = IRONLINE_PAL[d.argmin(1)].reshape(H, W, 3)
    else:
        for y in range(H):
            for x in range(W):
                if alpha[y, x] == 0:
                    continue
                old = out[y, x].copy()
                new = IRONLINE_PAL[((IRONLINE_PAL - old) ** 2).sum(1).argmin()]
                out[y, x] = new
                err = old - new
                for dx, dy, f in ((1, 0, 7/16), (-1, 1, 3/16), (0, 1, 5/16), (1, 1, 1/16)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < W and 0 <= ny < H and alpha[ny, nx] > 0:
                        out[ny, nx] += err * f
        out = np.clip(out, 0, 255)
    return out.astype(np.uint8)

def trim_rail(im, max_trim=4):
    """Remove a baked-in rail line: full-width solid row(s) at the very bottom that sit
    BELOW the (gappy) wheel rows. Leaves the wheels flush so they rest on the game's own rail."""
    a = np.asarray(im); al = a[:, :, 3]; H, W = al.shape
    cov = lambda r: (al[r] > 0).mean()
    gaps = lambda r: int(((( al[r] > 0).astype(int)[:-1] == 1) & ((al[r] > 0).astype(int)[1:] == 0)).sum())
    r, trim = H - 1, 0
    while r > 0 and trim < max_trim:
        c = cov(r)
        if c < 0.05:                       # stray speck row
            trim += 1; r -= 1; continue
        if c > 0.9 and gaps(r) <= 1:        # full-width rail-like row
            trim += 1; r -= 1; continue
        break
    # accept only if the row above the run is wheel-like (gappy / necked) -> it really was a rail
    if trim > 0 and r >= 0 and (gaps(r) >= 3 or cov(r) < 0.85):
        im = im.crop((0, 0, W, H - trim))
        a2 = np.asarray(im); ys, xs = np.where(a2[:, :, 3] > 0)
        return im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)), trim
    return im, 0

def quantize(im, opt):
    rgba = np.asarray(im)
    rgb, alpha = rgba[:, :, :3], rgba[:, :, 3]
    alpha = np.where(alpha >= 128, 255, 0).astype(np.uint8)   # crisp pixel edges
    if opt["palette"] == "ironline":
        rgb = lock_to_ironline(rgb, alpha, opt["dither"])
        result = np.dstack([rgb, alpha])
        return Image.fromarray(result, "RGBA")
    else:  # adaptive: the asset's own colors
        flat = Image.fromarray(np.dstack([rgb, alpha]), "RGBA")
        q = flat.convert("RGB").quantize(colors=opt["colors"], method=Image.MEDIANCUT).convert("RGB")
        return Image.fromarray(np.dstack([np.asarray(q), alpha]), "RGBA")

def main():
    asset, name, o = parse_args(sys.argv[1:])
    os.makedirs(o["out"], exist_ok=True)
    src = Image.open(asset)
    cropped = crop_to_content(src, o["bg"])
    small = downsample(cropped, o["width"], o["height"])
    sprite = quantize(small, o)
    if o["trim_n"] is not None:                       # manual override: chop exactly N rows
        sw, sh = sprite.size
        sprite = sprite.crop((0, 0, sw, sh - o["trim_n"]))
        aa = np.asarray(sprite); ys, xs = np.where(aa[:, :, 3] > 0)
        sprite = sprite.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
        trimmed = o["trim_n"]
    elif o["trim"]:
        sprite, trimmed = trim_rail(sprite)
    else:
        trimmed = 0
    w, h = sprite.size
    ncol = len({tuple(p) for p in np.asarray(sprite).reshape(-1, 4) if p[3] > 0})

    native = os.path.join(o["out"], f"sprite-{name}.png")
    sprite.save(native)
    sprite.resize((w * 6, h * 6), Image.NEAREST).save(os.path.join(o["out"], f"sprite-{name}@6x.png"))

    buf = io.BytesIO(); sprite.save(buf, format="PNG", optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode()
    snippet = f"loadSprite('{name}',{w},{h},'data:image/png;base64,{b64}');\n"
    with open(os.path.join(o["out"], f"sprite-{name}.js"), "w") as f:
        f.write(snippet)

    print(f"  {name}: {w}x{h} native, {ncol} colors, palette={o['palette']}"
          f"{' +dither' if o['dither'] else ''}{f' (trimmed {trimmed} rail rows)' if trimmed else ''}")
    print(f"  png {len(buf.getvalue())} bytes  ->  base64 {len(b64)} chars")
    print(f"  wrote sprite-{name}.png / @6x.png / .js (embed snippet)")

if __name__ == "__main__":
    main()
