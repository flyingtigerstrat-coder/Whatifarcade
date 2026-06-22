# BRIEF — KOI GARDEN
version: v0.1
date: 2026-06-22
status: exploring
changed-since-last: initial — baseline captured from the MVP, first build pass proposed

---

vision: A pond you keep on your screen and tend — not a game you beat. Calm, alive, and yours. Light moving on water, fish that wander and trail wakes, plants you nudge; it rewards returning and tending, never winning.

requirements (must stay true of the product):
- Always calm: no fail-states, timers, scores, or grind.
- Always alive: the surface and the fish move and catch light even when untouched.
- Always yours: the pond persists; your specific koi and your arrangement come back exactly.
- One engine, many looks: skins re-color cleanly; new varieties and skins are content, not rewrites.

scope (this pass — "make the loop felt"):
- Blended growth curve: koi grow slowly over time AND faster when fed, replacing today's food-only model — so returning to an untended pond still shows gentle progress, while feeding stays the meaningful lever.
- Make tending legible: serenity gain and koi/plant growth should be quietly readable at a glance — no meters that demand attention — so the loop is FELT, not just running underneath.
- Tune the unlock economy: the codex unlock costs (40–120 serenity) are placeholders; set a curve that feels earned over a few calm sessions, never grindy.

out-of-scope (this pass):
- The Tier-0 category / brand / monetization decisions (the human's call; see open-questions and HANDOFF_koi).
- New skins or new koi varieties (the system supports them — prove the loop first).
- A separate "creative mode" (arranging instantly) — parked until the tend-and-grow loop is felt.

open-questions:
- CATEGORY / BRAND / MONETIZATION (Tier-0, human decides): does koi live inside What If Arcade or under a sibling brand? Does the dusk-arcade visual brand apply? Is koi the first cosmetic-only monetized product? (See KICKOFF + HANDOFF.)
- Growth tuning: the passive-vs-fed rate ratio; how long a koi takes to mature; whether plants and the water itself also visibly mature.
- Serenity curve numbers, and what serenity should ultimately buy (varieties, life packs, seasonal drops).
- Where the cabinet / storefront lives — which depends on the brand decision.

---

## Baseline — what koi IS today (MVP)
Visually rich and stable. Water in three layered passes (caustics + breathing shimmer + wandering sunbeam + koi wakes; refractive ripple trains + sun-glint sparkles; glassy sky-sheen + Fresnel rim + depth). Koi rebuilt to show-accurate Nishikigoi — patch model with soft-front / sharp-back edges, per-variety placement, net and scale-shimmer texture, eight varieties, and a SAVED per-fish seed so every koi is an individual that persists. Plants drag and float with buoyant physics. Four skins on one engine; canvas state hardened. An in-game Koi Codex (hideable side panel) renders every variety live and gates them behind serenity unlocks.

The rendering is not the open work. The open work is the LOOP.

## The first build pass, in one line
Turn the already-beautiful pond into a loop you feel: blended growth, legible tending, and an earned unlock curve.

## Handoff to the builder
Promote koi-pond.html into the repo at games/koi/ with a CHANGELOG, then implement the blended growth curve first (smallest, highest-feel change). The director will react to the build and tune from there.
