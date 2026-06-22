# CLAUDE.md — Koi Garden (game-specific context)
**Nested context for `games/koi/`. Read this with the repo-root `CLAUDE.md` (the studio brain) and `GOVERNANCE.md`. This file governs only this folder.**

> Distilled from `HANDOFF_koi v1.0` (2026-06-22). The studio brain is the constitution; this is the pod-local lens.

---

## What koi is
An **ambient, interactive koi-pond — "wallpaper you keep."** Not a game you beat: a living thing you live next to, with a gentle **tend-and-grow** loop. Persistent, calm, alive whether or not you're watching. One self-contained HTML file, canvas-2D, procedural, mobile/touch-first, static-host safe, built to sip GPU for hours.

## Why it exists (and why it's different)
- It proves a **third register** for the studio. IRONLINE is momentum and combat; Firefly is cozy no-fail play; **koi is something you don't "play" at all — you keep it.**
- It crystallized the studio's **platform thesis** — build the hard part once (the feel of water + fish), sell variety forever (skins, life packs). Koi is the clearest expression yet of **engine-plus-skins.**
- It's the lead concept for a possible **SECOND SHELF**: ambient companions ("things you live next to"), distinct from What If Arcade's "the games you wish existed." That makes koi strategically larger than one title — it may define a category.

## The non-negotiable principles this pod carries
- **The feeling IS the product.** Protect calm and aliveness above all — **no fail-states, timers, scores, or grind.** Anything that adds pressure, failure, urgency, or grind poisons the very thing koi sells.
- **Persistence = attachment.** The pond you keep; the fish that stay yours. Every koi carries a saved seed and persists exactly across reloads.
- **"Done" horizons.** The pond is already visually rich — guard against infinite fiddling. The next work is **loop, persistence, and product shape**, not proving the rendering.

## The open category question (Tier-0 — the human's call, NOT the pod's)
Surface these as proposals; recommend with reasoning, then defer. **Never decide them unilaterally:**
- **Brand architecture:** inside What If Arcade, or a **sibling brand** with its own shelf/storefront? (Leaning sibling; undecided.)
- **Visual brand:** the dusk-arcade palette likely does NOT carry to a pond. The **Noodle Studios soul** carries (made with care, only ships with magic, Noodle himself); the **arcade look** may not. **Promote koi as itself — do not reskin it to the dusk palette to make it "fit."**
- **Monetization:** koi may be the first product with real **(cosmetic-only)** monetization. That platform thesis is itself still pending ratification into the studio brain.

## This pod's lane (what `games/koi/` owns — and only this)
- Everything under **`games/koi/`** — the game file and the game's docs (`BRIEF.md`, `CLAUDE.md`, `DESIGN.md`, `CHANGELOG.md`).
- **Read from** `/shared/*` and `/tools/*`; **never edit them** (keystone territory). If koi ever needs a `/shared` change, **propose it to the human** (Tier-1, serialized — `GOVERNANCE.md` §7).
- **Never touch** `index.html`, `/shared`, `/services`, or another game's folder. The storefront/cabinet is **POD_ARCADE's** job (a separate `-READY` brief, after this promotion lands).

## Working notes
- **You can't render HTML/canvas headlessly** — the human's eyes judge anything visual. Describe the change, let them look.
- **Validate JS** by extracting the `<script>` and parse-checking in node before declaring anything done.
- **Before the first push of a session, confirm the remote and branch.**
- The game file is `games/koi/koi-pond.html` — a single self-contained file. **Promotion is move + wire-up, not redesign:** the MVP is finished and stable; don't rewrite it.

## Status & next
- MVP promoted into `games/koi/` and runs standalone (this session). **POD_ARCADE is unblocked** to add a provisional storefront entry (it owns `index.html` + the shelf).
- **First build pass (BRIEF_koi v0.1):** the **blended growth curve** — koi currently grow on **food only** (size advances only while actively eating; time alone does nothing). Recommended: a **blended curve** — slow passive growth over time + feeding as the accelerator — so an idle pond still rewards a return while tending stays the meaningful lever. Smallest, highest-feel change; do it first.
