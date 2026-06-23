#!/usr/bin/env node
/* ===========================================================================
   IRONLINE — sprite exporter
   ---------------------------------------------------------------------------
   Renders any sprite straight out of the game's own draw code into a real PNG.
   No browser, no canvas library, no network: it mocks the 2D context into a
   pixel buffer, runs the actual draw functions, then hand-encodes a PNG via
   Node's built-in zlib. The output is a true 1:1 snapshot of what the game
   paints — not a redraw.

   USAGE
     node ironline-export.js <subject> [options]

   SUBJECTS
     boss [tier]            full boss convoy (tier 0-3, default 3)
     boss-engine            boss locomotive, close-up
     boss-car <wpn>         single boss car: cannon | rocket | mortar | fuel
     player [tier]          player war-rig: engine + representative consist
     player-engine [tier]   player locomotive, close-up
     rig <list> [tier]      compose a consist: e.g. "oil,troop,farm" or
                            "gun:rocket,troop,gun:mortar" (gun:wpn sets weapon)
     raider [kind]          raider vehicle: buggy | technical | bike
     trader                 trader caravan (passing train)
     raider-train           raider convoy (passing train)
     elite [guns]           elite warband (passing convoy), guns 1-3
     all                    export a standard asset set in one run

   OPTIONS
     --tier=N | --lvl=N     tier (0-3) or car level override
     --scale=N              integer upscale (nearest-neighbor); default per-subject
     --transparent          transparent background instead of the tan style-guide bg
     --bg=#rrggbb           background color (default #d6cebd, the War Rig tan)
     --out=PATH             output file (default ./ironline-<subject>.png)

   EXAMPLES
     node ironline-export.js boss
     node ironline-export.js player 3 --scale=6
     node ironline-export.js rig gun:rocket,troop --transparent
     node ironline-export.js raider bike --out=/tmp/outrider.png
     node ironline-export.js all
   ===========================================================================*/
const fs = require('fs'), zlib = require('zlib'), path = require('path');

const GAME = path.join(__dirname, 'battle-train-hd.html');
const OUTDIR = __dirname;

// ---- pixel-buffer canvas mock --------------------------------------------
let W = 640, H = 180, buf = new Float64Array(W * H * 4);
function resize(w, h) { W = w; H = h; buf = new Float64Array(W * H * 4); }
function clearBuf() { buf.fill(0); }
function parseColor(c) {
  if (typeof c !== 'string') return null;
  if (c[0] === '#') { let h = c.slice(1); if (h.length === 3) h = h.split('').map(x => x + x).join('');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1]; }
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (m) { const p = m[1].split(',').map(s => parseFloat(s.trim())); return [p[0], p[1], p[2], p[3] == null ? 1 : p[3]]; }
  return null;
}
function sampleGrad(g, px, py) {
  let t;
  if (g.type === 'linear') { const dx = g.x1 - g.x0, dy = g.y1 - g.y0, L = dx * dx + dy * dy || 1; t = ((px - g.x0) * dx + (py - g.y0) * dy) / L; }
  else { const d = Math.hypot(px - g.x1, py - g.y1); t = (d - g.r0) / ((g.r1 - g.r0) || 1); }
  const s = g.stops; if (!s.length) return null;
  if (t <= s[0][0]) return s[0][1];
  if (t >= s[s.length - 1][0]) return s[s.length - 1][1];
  for (let i = 0; i < s.length - 1; i++) if (t >= s[i][0] && t <= s[i + 1][0]) {
    const u = (t - s[i][0]) / ((s[i + 1][0] - s[i][0]) || 1), a = s[i][1], b = s[i + 1][1];
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u, a[3] + (b[3] - a[3]) * u];
  }
  return s[s.length - 1][1];
}
function blend(x, y, r, g, b, a) {
  if (x < 0 || y < 0 || x >= W || y >= H || a <= 0) return;
  const i = (y * W + x) * 4, da = buf[i + 3], oa = a + da * (1 - a);
  if (oa <= 0) return;
  buf[i] = (r * a + buf[i] * da * (1 - a)) / oa;
  buf[i + 1] = (g * a + buf[i + 1] * da * (1 - a)) / oa;
  buf[i + 2] = (b * a + buf[i + 2] * da * (1 - a)) / oa;
  buf[i + 3] = oa;
}
// affine transform stack — matches canvas [a c e ; b d f]
let M = [1, 0, 0, 1, 0, 0], MSTACK = [];
function mul(n) { const [a, b, c, d, e, f] = M, [a2, b2, c2, d2, e2, f2] = n;
  M = [a * a2 + c * b2, b * a2 + d * b2, a * c2 + c * d2, b * c2 + d * d2, a * e2 + c * f2 + e, b * e2 + d * f2 + f]; }
function dev(px, py) { return [M[0] * px + M[2] * py + M[4], M[1] * px + M[3] * py + M[5]]; }
let PATH = [], CUR = null;
function fillPath(style) {
  const polys = PATH.filter(p => p && p.length >= 3); if (!polys.length) return;
  const grad = style && style.__grad ? style : null;
  const col = grad ? null : parseColor(style); if (!grad && !col) return;
  const ga = ctxState.globalAlpha == null ? 1 : ctxState.globalAlpha;
  let minY = Infinity, maxY = -Infinity;
  for (const p of polys) for (const pt of p) { if (pt[1] < minY) minY = pt[1]; if (pt[1] > maxY) maxY = pt[1]; }
  minY = Math.max(0, Math.floor(minY)); maxY = Math.min(H - 1, Math.ceil(maxY));
  for (let y = minY; y <= maxY; y++) {
    const xs = [];
    for (const p of polys) { const n = p.length; for (let i = 0; i < n; i++) { const a = p[i], b = p[(i + 1) % n]; if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) xs.push(a[0] + (y - a[1]) / (b[1] - a[1]) * (b[0] - a[0])); } }
    if (xs.length < 2) continue; xs.sort((u, v) => u - v);
    for (let i = 0; i + 1 < xs.length; i += 2) {
      const x0 = Math.max(0, Math.round(xs[i])), x1 = Math.min(W, Math.round(xs[i + 1]));
      for (let x = x0; x < x1; x++) { if (grad) { const c = sampleGrad(grad, x - M[4], y - M[5]); if (c) blend(x, y, c[0], c[1], c[2], c[3] * ga); } else blend(x, y, col[0], col[1], col[2], col[3] * ga); }
    }
  }
}
function drawSeg(x0, y0, x1, y1, col, lw, ga) {
  const dx = x1 - x0, dy = y1 - y0, steps = Math.max(1, Math.round(Math.hypot(dx, dy))), o = lw >> 1;
  for (let i = 0; i <= steps; i++) { const x = Math.round(x0 + dx * i / steps), y = Math.round(y0 + dy * i / steps); for (let yy = 0; yy < lw; yy++) for (let xx = 0; xx < lw; xx++) blend(x + xx - o, y + yy - o, col[0], col[1], col[2], col[3] * ga); }
}
function strokePath(style, lw) {
  const col = parseColor(style); if (!col) return; const ga = ctxState.globalAlpha == null ? 1 : ctxState.globalAlpha; lw = Math.max(1, Math.round(lw));
  for (const p of PATH) { if (!p || p.length < 2) continue; const n = p.closed ? p.length : p.length - 1; for (let i = 0; i < n; i++) { const a = p[i], b = p[(i + 1) % p.length]; drawSeg(a[0], a[1], b[0], b[1], col, lw, ga); } }
}
const ctxState = { fillStyle: '#000', globalAlpha: 1 };
const ctx = {
  get fillStyle() { return ctxState.fillStyle; }, set fillStyle(v) { ctxState.fillStyle = v; },
  get strokeStyle() { return ctxState.strokeStyle; }, set strokeStyle(v) { ctxState.strokeStyle = v; },
  get globalAlpha() { return ctxState.globalAlpha; }, set globalAlpha(v) { ctxState.globalAlpha = v; },
  lineWidth: 1, font: '',
  save() { MSTACK.push(M.slice()); },
  restore() { if (MSTACK.length) M = MSTACK.pop(); },
  translate(x, y) { mul([1, 0, 0, 1, x, y]); },
  rotate(r) { const c = Math.cos(r), s = Math.sin(r); mul([c, s, -s, c, 0, 0]); },
  scale(x, y) { mul([x, 0, 0, y, 0, 0]); },
  setTransform(a, b, c, d, e, f) { M = [a, b, c, d, e, f]; },
  resetTransform() { M = [1, 0, 0, 1, 0, 0]; },
  beginPath() { PATH = []; CUR = null; },
  moveTo(x, y) { CUR = [dev(x, y)]; PATH.push(CUR); },
  lineTo(x, y) { if (!CUR) { CUR = []; PATH.push(CUR); } CUR.push(dev(x, y)); },
  closePath() { if (CUR) CUR.closed = true; },
  rect(x, y, w, h) { this.moveTo(x, y); this.lineTo(x + w, y); this.lineTo(x + w, y + h); this.lineTo(x, y + h); this.closePath(); },
  arc(cx, cy, r, a0, a1, ccw) { let span = a1 - a0; if (ccw && span > 0) span -= 2 * Math.PI; if (!ccw && span < 0) span += 2 * Math.PI; const seg = Math.max(4, Math.ceil(Math.abs(span) / 0.35)); if (!CUR) { CUR = []; PATH.push(CUR); } for (let i = 0; i <= seg; i++) { const a = a0 + span * i / seg; CUR.push(dev(cx + Math.cos(a) * r, cy + Math.sin(a) * r)); } },
  ellipse(cx, cy, rx, ry, rot, a0, a1) { const seg = 28, cr = Math.cos(rot || 0), sr = Math.sin(rot || 0), s = a0 || 0, e = a1 == null ? Math.PI * 2 : a1, pts = []; for (let i = 0; i <= seg; i++) { const a = s + (e - s) * i / seg, ex = Math.cos(a) * rx, ey = Math.sin(a) * ry; pts.push(dev(cx + ex * cr - ey * sr, cy + ex * sr + ey * cr)); } pts.closed = true; PATH.push(pts); CUR = pts; },
  fill() { fillPath(ctxState.fillStyle); },
  stroke() { strokePath(ctxState.strokeStyle, this.lineWidth || 1); },
  clip() {}, quadraticCurveTo(cx, cy, x, y) { if (CUR) { CUR.push(dev(cx, cy)); CUR.push(dev(x, y)); } }, bezierCurveTo(a, b, c, d, x, y) { if (CUR) { CUR.push(dev(a, b)); CUR.push(dev(c, d)); CUR.push(dev(x, y)); } }, arcTo() {}, setLineDash() {}, strokeRect() {}, drawFocusIfNeeded() {},
  createLinearGradient(x0, y0, x1, y1) { return { __grad: 1, type: 'linear', x0, y0, x1, y1, stops: [], addColorStop(o, c) { const k = parseColor(c); if (k) this.stops.push([o, k]); } }; },
  createRadialGradient(x0, y0, r0, x1, y1, r1) { return { __grad: 1, type: 'radial', x0, y0, r0, x1, y1, r1, stops: [], addColorStop(o, c) { const k = parseColor(c); if (k) this.stops.push([o, k]); } }; },
  fillRect(x, y, w, h) {
    const fs = ctxState.fillStyle;
    if (fs && fs.__grad) {
      const ox = Math.round(x + M[4]), oy = Math.round(y + M[5]), rw = Math.round(w), rh = Math.round(h);
      const ga = ctxState.globalAlpha == null ? 1 : ctxState.globalAlpha;
      for (let j = 0; j < rh; j++) for (let k = 0; k < rw; k++) {
        const dxp = ox + k, dyp = oy + j, c = sampleGrad(fs, dxp - M[4], dyp - M[5]);
        if (c && c[3] > 0) blend(dxp, dyp, c[0], c[1], c[2], c[3] * ga);
      }
      return;
    }
    const col = parseColor(ctxState.fillStyle); if (!col) return;
    const a = col[3] * (ctxState.globalAlpha == null ? 1 : ctxState.globalAlpha); if (a <= 0) return;
    // fast path: axis-aligned (no rotation/scale) — matches the game's integer px() fills
    if (M[1] === 0 && M[2] === 0 && M[0] === 1 && M[3] === 1) {
      const ox = Math.round(x + M[4]), oy = Math.round(y + M[5]), rw = Math.round(w), rh = Math.round(h);
      for (let j = 0; j < rh; j++) for (let k = 0; k < rw; k++) blend(ox + k, oy + j, col[0], col[1], col[2], a);
      return;
    }
    // general path: transform the rect's corners, then inverse-map each device pixel
    const cs = [dev(x, y), dev(x + w, y), dev(x + w, y + h), dev(x, y + h)];
    let dminx = Infinity, dminy = Infinity, dmaxx = -Infinity, dmaxy = -Infinity;
    for (const [cx, cy] of cs) { if (cx < dminx) dminx = cx; if (cx > dmaxx) dmaxx = cx; if (cy < dminy) dminy = cy; if (cy > dmaxy) dmaxy = cy; }
    dminx = Math.max(0, Math.floor(dminx)); dminy = Math.max(0, Math.floor(dminy));
    dmaxx = Math.min(W - 1, Math.ceil(dmaxx)); dmaxy = Math.min(H - 1, Math.ceil(dmaxy));
    const det = M[0] * M[3] - M[1] * M[2]; if (!det) return;
    const ia = M[3] / det, ib = -M[1] / det, ic = -M[2] / det, id = M[0] / det,
      ie = -(M[4] * ia + M[5] * ic), iff = -(M[4] * ib + M[5] * id);
    for (let dy = dminy; dy <= dmaxy; dy++) for (let dx = dminx; dx <= dmaxx; dx++) {
      const X = dx + 0.5, Y = dy + 0.5, lx = ia * X + ic * Y + ie, ly = ib * X + id * Y + iff;
      if (lx >= x && lx < x + w && ly >= y && ly < y + h) blend(dx, dy, col[0], col[1], col[2], a);
    }
  },
  drawImage(img, dx, dy, dw, dh) {
    if (!img || !img._px) return;
    const sw = img.width, sh = img.height; if (dw == null) { dw = sw; dh = sh; }
    const ga = ctxState.globalAlpha == null ? 1 : ctxState.globalAlpha;
    const cs = [dev(dx, dy), dev(dx + dw, dy), dev(dx + dw, dy + dh), dev(dx, dy + dh)];
    let mnx = Infinity, mny = Infinity, mxx = -Infinity, mxy = -Infinity;
    for (const [cx, cy] of cs) { if (cx < mnx) mnx = cx; if (cx > mxx) mxx = cx; if (cy < mny) mny = cy; if (cy > mxy) mxy = cy; }
    mnx = Math.max(0, Math.floor(mnx)); mny = Math.max(0, Math.floor(mny));
    mxx = Math.min(W - 1, Math.ceil(mxx)); mxy = Math.min(H - 1, Math.ceil(mxy));
    const det = M[0] * M[3] - M[1] * M[2]; if (!det) return;
    const ia = M[3] / det, ib = -M[1] / det, ic = -M[2] / det, idd = M[0] / det,
      ie = -(M[4] * ia + M[5] * ic), iff = -(M[4] * ib + M[5] * idd);
    for (let py = mny; py <= mxy; py++) for (let pxx = mnx; pxx <= mxx; pxx++) {
      const X = pxx + 0.5, Y = py + 0.5, lx = ia * X + ic * Y + ie, ly = ib * X + idd * Y + iff;
      if (lx < dx || lx >= dx + dw || ly < dy || ly >= dy + dh) continue;
      let u = Math.floor((lx - dx) / dw * sw), v = Math.floor((ly - dy) / dh * sh);
      if (u < 0) u = 0; if (u >= sw) u = sw - 1; if (v < 0) v = 0; if (v >= sh) v = sh - 1;
      const si = (v * sw + u) * 4, a = (img._px[si + 3] / 255) * ga;
      if (a > 0) blend(pxx, py, img._px[si], img._px[si + 1], img._px[si + 2], a);
    }
  }
};
function el() {
  const stub = { style: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } } };
  const handler = {
    get(t, p) {
      if (p === 'getContext') return () => ctx;
      if (p === 'getBoundingClientRect') return () => ({ left: 0, top: 0, width: 320, height: 180 });
      if (p === 'querySelector') return () => el();
      if (p === 'querySelectorAll') return () => [];
      return p in t ? t[p] : () => {};
    }
  };
  return new Proxy(stub, handler);
}
global.window = { addEventListener() {}, storage: {}, matchMedia() { return { matches: false, addEventListener() {} }; } };
function decodePNG(b) {
  let p = 8, w, h, ct, idat = [], plte = null, trns = null;
  while (p < b.length) {
    const len = b.readUInt32BE(p), type = b.toString('ascii', p + 4, p + 8), data = b.slice(p + 8, p + 8 + len);
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); ct = data[9]; }
    else if (type === 'PLTE') plte = data; else if (type === 'tRNS') trns = data;
    else if (type === 'IDAT') idat.push(data); else if (type === 'IEND') break;
    p += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const ch = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ct], stride = w * ch, rec = Buffer.alloc(h * stride);
  let q = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[q++];
    for (let x = 0; x < stride; x++) {
      const cur = raw[q++], a = x >= ch ? rec[y * stride + x - ch] : 0, up = y > 0 ? rec[(y - 1) * stride + x] : 0,
        ul = (x >= ch && y > 0) ? rec[(y - 1) * stride + x - ch] : 0; let v;
      if (f === 1) v = cur + a; else if (f === 2) v = cur + up; else if (f === 3) v = cur + ((a + up) >> 1);
      else if (f === 4) { const pa = Math.abs(up - ul), pb = Math.abs(a - ul), pc = Math.abs(a + up - 2 * ul); v = cur + ((pa <= pb && pa <= pc) ? a : pb <= pc ? up : ul); }
      else v = cur;
      rec[y * stride + x] = v & 255;
    }
  }
  const px = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    let r, g, bl, al = 255;
    if (ct === 6) { r = rec[i * 4]; g = rec[i * 4 + 1]; bl = rec[i * 4 + 2]; al = rec[i * 4 + 3]; }
    else if (ct === 2) { r = rec[i * 3]; g = rec[i * 3 + 1]; bl = rec[i * 3 + 2]; }
    else if (ct === 0) { r = g = bl = rec[i]; }
    else if (ct === 4) { r = g = bl = rec[i * 2]; al = rec[i * 2 + 1]; }
    else { const k = rec[i]; r = plte[k * 3]; g = plte[k * 3 + 1]; bl = plte[k * 3 + 2]; al = trns && k < trns.length ? trns[k] : 255; }
    px[i * 4] = r; px[i * 4 + 1] = g; px[i * 4 + 2] = bl; px[i * 4 + 3] = al;
  }
  return { width: w, height: h, px };
}
global.Image = class {
  set src(v) { const m = /^data:image\/png;base64,(.+)$/.exec(v); if (m) { const d = decodePNG(Buffer.from(m[1], 'base64')); this.width = d.width; this.height = d.height; this._px = d.px; this.complete = true; if (this.onload) this.onload(); } }
};
global.document = { getElementById: () => el(), querySelector: () => el(), querySelectorAll: () => [], addEventListener() {} };
global.requestAnimationFrame = () => {};

// ---- load the game & expose its internals --------------------------------
let script = fs.readFileSync(GAME, 'utf8').match(/<script>([\s\S]*)<\/script>/)[1];
script += '\n;globalThis.__G={drawBoss,drawBossEngine,drawBossCar,drawTrain,drawRaider,drawPtrain,drawPElite,drawFortress,drawBackdrop,drawRailheadFront,drawRailheadBanner,STATION_HOME,S,BENGW,BCARW};';
try { eval(script); } catch (e) { console.error('Failed to load game:', e.message); process.exit(1); }
const G = globalThis.__G, S = G.S;

// neutral idle state shared by every render
function baseState() {
  Object.assign(S, { T: 0.25, off: 20, dt: 0, pan: 0, flash: 0,
    raiders: [], booms: [], tracers: [], turr: [], boss: null, ptrain: null });
}

// ---- PNG encoder ----------------------------------------------------------
const crcT = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); crcT[n] = c >>> 0; }
function crc32(b) { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = crcT[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function chunk(type, data) { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const t = Buffer.from(type);
  const cc = Buffer.alloc(4); cc.writeUInt32BE(crc32(Buffer.concat([t, data]))); return Buffer.concat([len, t, data, cc]); }
function encodePNG(w, h, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; for (let x = 0; x < w * 4; x++) raw[y * (w * 4 + 1) + 1 + x] = rgba[y * w * 4 + x]; }
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

// ---- crop + compose + upscale + write ------------------------------------
function writeSprite(out, F, opt) {
  const clipMax = opt.clipMax == null ? W : opt.clipMax;
  const clipMin = opt.clipMin == null ? 0 : opt.clipMin;
  let minx, miny, maxx, maxy;
  if (opt.fixedBox) { ({ minx, miny, maxx, maxy } = opt.fixedBox); }
  else {
    minx = W; miny = H; maxx = 0; maxy = 0; let any = false;
    for (let y = 0; y < H; y++) for (let x = clipMin; x < Math.min(W, clipMax); x++)
      if (buf[(y * W + x) * 4 + 3] > 0.04) { any = true; if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y; }
    if (!any) { console.error('  (nothing drawn — check subject state)'); return false; }
    const mg = 4;
    minx = Math.max(clipMin, minx - mg); miny = Math.max(0, miny - mg);
    maxx = Math.min(Math.min(W, clipMax) - 1, maxx + mg); maxy = Math.min(H - 1, maxy + mg);
  }
  const cw = maxx - minx + 1, chh = maxy - miny + 1, bg = opt.bg, trans = opt.transparent;
  const uw = cw * F, uh = chh * F, up = new Uint8ClampedArray(uw * uh * 4);
  for (let y = 0; y < uh; y++) for (let x = 0; x < uw; x++) {
    const sx = minx + ((x / F) | 0), sy = miny + ((y / F) | 0), si = (sy * W + sx) * 4, a = buf[si + 3], di = (y * uw + x) * 4;
    if (trans) { up[di] = buf[si]; up[di + 1] = buf[si + 1]; up[di + 2] = buf[si + 2]; up[di + 3] = Math.round(a * 255); }
    else { up[di] = buf[si] * a + bg[0] * (1 - a); up[di + 1] = buf[si + 1] * a + bg[1] * (1 - a); up[di + 2] = buf[si + 2] * a + bg[2] * (1 - a); up[di + 3] = 255; }
  }
  fs.writeFileSync(out, encodePNG(uw, uh, up));
  console.log('  wrote ' + path.basename(out) + '  (' + cw + 'x' + chh + ' native -> ' + uw + 'x' + uh + ')');
  return true;
}

// ---- subject registry -----------------------------------------------------
// each returns { scale, clipMin?, clipMax? } after drawing into the buffer
const bossCars = t => { const guns = Math.min(3, 1 + t), wp = ['cannon', 'rocket', 'mortar'], cars = [{ type: 'engine' }];
  for (let g = 0; g < guns; g++) cars.push({ type: 'gun', wpn: wp[g] }); cars.push({ type: 'fuel' }); return { cars, guns }; };

const SUBJECTS = {
  boss(o) { const t = o.tier == null ? 3 : o.tier, bc = bossCars(t);
    S.boss = { hp: 600, max: 600, x: 132, tx: 132, hitT: 1, dead: false, set: true, guns: bc.guns, tier: t, cars: bc.cars };
    G.drawBoss(); return { scale: 6 }; },
  'boss-engine'() { G.drawBossEngine(48, 46, { type: 'engine' }); return { scale: 12 }; },
  'boss-car'(o) { const w = o.arg || 'cannon';
    if (w === 'fuel') G.drawBossCar(40, 46, { type: 'fuel' }, 4);
    else G.drawBossCar(40, 46, { type: 'gun', wpn: w }, 1); return { scale: 12 }; },
  player(o) { const t = o.tier == null ? 2 : o.tier, lv = 1 + t * 5 + 1, segs = 5, EX = 250;
    S.engine = lv; S.ex = EX; S.pan = 0;
    S.slots = [{ type: 'oil', lvl: lv }, { type: 'troop', lvl: lv }, { type: 'farm', lvl: lv }, { type: 'repair', lvl: lv }, { type: 'gun', lvl: lv, wpn: 'cannon' }];
    G.drawTrain(); return { scale: 5, clipMin: EX - 44 * segs - 2, clipMax: EX + 105 }; },
  'player-engine'(o) { const t = o.tier == null ? 2 : o.tier; S.engine = 1 + t * 5 + 1; S.ex = 60; S.pan = 0; S.slots = [];
    G.drawTrain(); return { scale: 9 }; },
  // rig <comma-list> [tier] — compose any consist, e.g. "oil,troop,farm" or "gun:rocket,troop,gun:mortar".
  // tokens are leftmost-first; "type:wpn" sets a gun car's weapon (cannon|rocket|mortar).
  rig(o) { const spec = (o.arg || 'oil,troop,farm,repair,gun').split(',').map(s => s.trim()).filter(Boolean);
    const t = o.tier == null ? 2 : o.tier, lv = 1 + t * 5 + 1, segs = spec.length, EX = 44 * segs + 40;
    S.engine = lv; S.ex = EX; S.pan = 0;
    S.slots = spec.map(tok => { const [type, wpn] = tok.split(':'); return { type, lvl: lv, wpn: wpn || 'cannon' }; });
    G.drawTrain(); return { scale: segs <= 2 ? 8 : 5, clipMin: EX - 44 * segs - 2, clipMax: EX + 105 }; },
  raider(o) { G.drawRaider({ x: 30, kind: o.arg || 'buggy' }); return { scale: 12 }; },
  trader() { S.ptrain = { kind: 'trader', x: 24, state: 'mid', t: 0, gave: false, atkT: 1, muzzle: 0, hp: 60, max: 60, dead: false };
    G.drawPtrain(); return { scale: 8 }; },
  'raider-train'() { S.ptrain = { kind: 'raider', x: 24, state: 'mid', t: 0, gave: false, atkT: 1, muzzle: 0, hp: 60, max: 60, dead: false };
    G.drawPtrain(); return { scale: 8 }; },
  elite(o) { const guns = Math.min(3, Math.max(1, o.arg ? +o.arg : 3)), wp = ['cannon', 'rocket', 'mortar'], cars = [];
    for (let g = 0; g < guns; g++) cars.push({ wpn: wp[g % 3] });
    S.ptrain = { kind: 'raider', elite: true, cars, guns, x: 28, state: 'mid', t: 0, gave: false, atkT: 1.2, muzzle: 0, hp: 300, max: 300, dead: false };
    G.drawPtrain(); return { scale: 6 }; },
  fortress() { G.drawFortress(10, 150); return { scale: 5 }; },
  // railhead [--off=N --T=N] — the origin depot: full frame, rig docked AT REST at THE RAILHEAD.
  // Three depth bands: drawRailhead = band 4 (behind, in drawBackdrop) · drawRailheadFront = band 6 (front) · drawRailheadBanner = band 9 (UI).
  railhead(o) {
    S.off = o.off != null ? o.off : 0;        // origin biome (THE RUST FLATS) by default
    S.T = o.T != null ? o.T : 0;              // sunset by default
    // the FRESH begin-at-origin rig: short starting consist (engine 1, gun + farm, caboose) — not an endgame train
    S.engine = 1; S.caboose = 1; S.maxSlots = 3; S.ex = 216; S.pan = 0; S.engineSkin = o.engine || null;
    S.origin = true; S.stationX = null;       // settled-centered (STATION_HOME)
    S.slots = [{ type: 'gun', wpn: 'cannon', port: 'auto', lvl: 1 }, { type: 'farm', lvl: 1 }, null];
    G.drawBackdrop(); G.drawTrain(); G.drawRailheadFront(G.STATION_HOME); G.drawRailheadBanner(); // band 4 is inside drawBackdrop; front (6) + banner (9) go over the train
    return { scale: 4, fixedBox: { minx: 0, miny: 0, maxx: 319, maxy: 179 } };
  },
  // scene <off> — full world frame (backdrop + train) at world-position off (→ biome) and time S.T.
  scene(o) {
    S.off = o.off != null ? o.off : 560;
    S.T = o.T != null ? o.T : 192;            // ~midday by default
    S.engine = 8; S.ex = 216; S.pan = 0; S.engineSkin = o.engine || null;
    S.slots = [{ type: 'oil', lvl: 8 }, { type: 'troop', lvl: 8 }, { type: 'gun', lvl: 8, wpn: 'cannon' }];
    G.drawBackdrop(); G.drawTrain();
    return { scale: 4, fixedBox: { minx: 0, miny: 0, maxx: 319, maxy: 179 } };
  }
};

const ALL = [['boss'], ['boss-engine'], ['player'], ['player-engine'],
  ['raider', 'buggy'], ['raider', 'technical'], ['raider', 'bike'],
  ['trader'], ['raider-train'], ['elite']];

// ---- CLI ------------------------------------------------------------------
// render N animation frames with a SHARED (union) crop so they line up into a GIF/sheet.
function renderAnim(fn, arg, opt, meta, F) {
  const N = opt.anim, cmin = meta.clipMin == null ? 0 : meta.clipMin,
    cmax = meta.clipMax == null ? W : Math.min(W, meta.clipMax);
  const frames = []; let minx = W, miny = H, maxx = 0, maxy = 0;
  for (let f = 0; f < N; f++) {
    clearBuf(); M = [1, 0, 0, 1, 0, 0]; MSTACK = [];
    S.engineSkin = opt.engine || null;
    S.off = f * (2 * Math.PI / 0.55 / N);   // exactly one driver rotation across the loop
    S.T = 0.25 + f * (3.6 / 1.1 / N);       // ~one smoke cycle across the loop
    try { fn(Object.assign({ arg }, opt)); } catch (e) { console.error('  anim frame err: ' + e.message); return; }
    frames.push(Float64Array.from(buf));
    for (let y = 0; y < H; y++) for (let x = cmin; x < cmax; x++)
      if (buf[(y * W + x) * 4 + 3] > 0.04) { if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y; }
  }
  const mg = 4, box = { minx: Math.max(cmin, minx - mg), miny: Math.max(0, miny - mg), maxx: Math.min(cmax - 1, maxx + mg), maxy: Math.min(H - 1, maxy + mg) };
  const base = (opt.out || path.join(OUTDIR, 'ironline-anim')).replace(/\.png$/, '');
  for (let f = 0; f < N; f++) { buf.set(frames[f]); writeSprite(base + '-' + String(f).padStart(2, '0') + '.png', F, { bg: opt.bg, transparent: opt.transparent, fixedBox: box }); }
  console.log('  wrote ' + N + ' aligned frames -> ' + base + '-NN.png');
}

function run(subject, arg, opt) {
  const fn = SUBJECTS[subject];
  if (!fn) { console.error('Unknown subject: ' + subject + '  (try: ' + Object.keys(SUBJECTS).join(', ') + ', all)'); return; }
  resize(640, 180); baseState(); clearBuf(); M = [1, 0, 0, 1, 0, 0]; MSTACK = [];
  S.engineSkin = opt.engine || null;
  let meta; try { meta = fn(Object.assign({ arg }, opt)) || {}; }
  catch (e) { console.error('  render error [' + subject + (arg ? ' ' + arg : '') + ']: ' + e.message); return; }
  if (opt.engine && meta && meta.clipMax != null) meta.clipMax = Math.max(meta.clipMax, S.ex + 145);
  const F = opt.scale || meta.scale || 6;
  if (opt.anim) { renderAnim(fn, arg, opt, meta, F); return; }
  if (opt.off != null) S.off = opt.off; if (opt.T != null) S.T = opt.T;
  if (opt.off != null || opt.T != null) { clearBuf(); M = [1, 0, 0, 1, 0, 0]; MSTACK = []; try { fn(Object.assign({ arg }, opt)); } catch (e) { console.error('  re-render err: ' + e.message); } }
  const name = subject + (arg ? '-' + arg.replace(/[^a-z0-9]+/gi, '-') : '');
  const out = opt.out || path.join(OUTDIR, 'ironline-' + name + '.png');
  writeSprite(out, F, { bg: opt.bg, transparent: opt.transparent, clipMin: meta.clipMin, clipMax: meta.clipMax, fixedBox: meta.fixedBox });
}

(function main() {
  const argv = process.argv.slice(2);
  if (!argv.length || argv[0] === '-h' || argv[0] === '--help') {
    console.log(fs.readFileSync(__filename, 'utf8').split('===*/')[0].replace(/^#!.*\n/, '').replace(/\/\* =+\n/, '').replace(/ =+\n/g, ''));
    return;
  }
  const opt = { bg: [214, 206, 189] };
  const pos = [];
  for (const a of argv) {
    if (a === '--transparent') opt.transparent = true;
    else if (a.startsWith('--scale=')) opt.scale = +a.slice(8);
    else if (a.startsWith('--tier=')) opt.tier = +a.slice(7);
    else if (a.startsWith('--lvl=')) opt.lvl = +a.slice(6);
    else if (a.startsWith('--bg=')) { const c = parseColor(a.slice(5)); if (c) opt.bg = c; }
    else if (a.startsWith('--out=')) opt.out = a.slice(6);
    else if (a.startsWith('--engine=')) opt.engine = a.slice(9);
    else if (a.startsWith('--anim=')) opt.anim = +a.slice(7);
    else if (a.startsWith('--off=')) opt.off = +a.slice(6);
    else if (a.startsWith('--T=')) opt.T = +a.slice(4);
    else pos.push(a);
  }
  const subject = pos[0];
  if (subject === 'all') { console.log('Exporting standard asset set...'); for (const [s, a] of ALL) run(s, a, { bg: opt.bg, transparent: opt.transparent }); console.log('Done.'); return; }
  // positional: subject, then arg/tier depending on subject
  let arg = null;
  if (['boss-car', 'raider', 'rig', 'elite'].includes(subject)) arg = pos[1] || null;
  if (['boss', 'player', 'player-engine'].includes(subject) && pos[1] != null && opt.tier == null) opt.tier = +pos[1];
  if (subject === 'rig' && pos[2] != null && opt.tier == null) opt.tier = +pos[2];
  console.log('Rendering ' + subject + (arg ? ' ' + arg : '') + '...');
  run(subject, arg, opt);
})();
