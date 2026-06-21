# /shared — the studio library

Lives once, referenced everywhere. **Update here = updates every game.** This is
`POD_ARCADE`'s keystone turf: changes here ripple to every game, so they are
**Tier-1 serialized** — one at a time, human-ratified, landed *between* game-pod
sessions (see `GOVERNANCE.md` §7).

Share by identity layer (`CLAUDE.md` §6): **share what the studio says; silo what
the game says.** A game's own sprites/scenes/attract screens never live here.

## Layout (target — `CLAUDE.md` §7)
- `brand.css` — palette + type as CSS variables — **✅ extracted & referenced**
- `marks/` — Dusk Coin · Noodle paw coin · wordmark · favicon — *still inline in `index.html`*
- `ident/` — the studio bumper (the shared boot moment) — **bumper present:** `ident/bumper.html`
- `chrome/` — nav · footer · back-to-arcade · cabinet frame · wish console — **✅ nav + footer + brand lockup extracted** (`chrome/chrome.css`); wish console + cabinet frame still inline (see below)
- `fx/` — CRT power-on · scanlines · dusk gradient · teal shimmer — **✅ scanlines + CRT power-on extracted** (`fx/fx.css`); dusk gradient is token-driven; teal shimmer still inline (in the wish console)
- `fonts/` — the actual font files (Google Fonts CDN today)
- `audio/` — studio sting · UI blips (later)

## Status (2026-06-21 — extraction in progress)
`brand.css`, `chrome/chrome.css`, and `fx/fx.css` are extracted and referenced by
`index.html` (and `brand.css` by the IRONLINE launcher). Computed styles are
unchanged — these were moves, not redesigns.

**Still inline in `index.html`, by design (each its own careful next pass):**
- **marks** — the SVG `<defs>` (Dusk Coin, thumb) render via `<use href="#id">`;
  moving them to an external file means external-fragment refs, which are
  browser-fragile. Do deliberately, not blind.
- **wish console** (+ its teal-shimmer cursor) — entangled with storefront
  utilities (`.btn`, `.eyebrow`); lifting it cleanly means relocating those too.
- **cabinet frame / arcade shelf** — storefront layout, not a studio widget.
