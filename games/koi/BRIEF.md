# BRIEF - Koi: skin polish pass (METAL pilot)
**v0.4 . 2026-06-22 . STATUS: READY** · koi pod. Supersedes v0.3-DRAFT (archive v0.2/v0.3 when convenient). CHANGE from v0.3: pads now **age with growth** (polished brass when young -> verdigris patina as they mature); one **cool silver koi** added as a focal accent among the warm metal. Active pass; v0.1 blended-growth work stays PARKED. Entirely the koi builder's lane (`games/koi/` only) - no storefront/brand entanglement, so promote to `games/koi/BRIEF.md` and run.

> Refine before adding. Zero new content this pass. Two principles govern it: **(1) a skin must treat the WHOLE frame, not just repaint props; (2) metal is a finish, not a palette.**

## Why this pass
Four skins ride one engine (natural / liquid metal / sumi ink / rain on glass). Ink and rain read finished; metal reads half-finished. The skins that work treat the **entire frame** (rain blurs+fogs; ink washes near-black); metal only repaints the props (grey pads over still-teal water, koi still warm/natural), so it reads "a pond with grey-painted lily pads," not "a world of liquid metal." Fix metal first as the cleanest test of both principles.

## PRINCIPLE 1 - full-frame world
The metal treatment covers the whole frame: substrate, light, ripples, pads, koi. No element keeps the natural-pond look.

## PRINCIPLE 2 - metal is a finish, not a palette
"Metal" does not mean "grey." The eye reads metal from **specular behavior** - sharp blown highlights against dark mirror surrounds - **not desaturation.** So **keep the koi pond's real colors and cast each element in its ORGANIC metal.** This keeps it a true koi pond *in a liquid-metal theme*, not an alien mercury pool:
- **Koi -> warm metal: copper, rose-gold, bronze** (NOT cold steel). Truer to koi, not a stylization - metallic koi are the prized real varieties (Ogon, Platinum, Yamabuki). A red-white Kohaku reads copper-and-silver; the gold koi reads molten brass. Warm, wet, bright specular hotspots; the most reflective objects in the field. **One exception for contrast (see target 5).**
- **Lily pads -> brass that ages to verdigris** (see "Dynamic material" below). Green like a lily pad, but as a real metal behavior (patina is something only metal does). Lotus blooms -> polished **brass / gold**.
- **Water/substrate -> tinted dark mercury** (a hint of warmth = metal reflecting a dusk sky), NOT dead-neutral steel. Neutral grey is what tips it into "alien"; the tint keeps it a pond.

The metal read comes from FINISH (specular highlights + mirror contrast, full-frame); the HUE stays loyal to a real koi pond.

## Dynamic material - the pond ages in metal (the signature idea)
The pads' finish is **not static** - it **ages with the plant's growth**:
- A **young / freshly placed** pad reads **polished, shiny brass** (new metal).
- As the plant **matures**, the finish **patinas toward verdigris** (aged, oxidized bronze-green).
- **Interpolate the finish across the plant's EXISTING growth state** - no new growth system; this is independent of the parked v0.1 growth-curve work.
Payoff: tending the pond literally patinates it. A mature pond wears its history in verdigris while new growth still gleams brass - the tend-and-grow loop made visible in the material. (Fits koi's "a thing you keep" identity: the skin records the time you put in.)
- **Phasing / de-risk:** if wiring the finish to growth proves fiddly, **ship static verdigris pads first** (the coherent metal world is the must-have) and add the brass->patina aging as a fast follow. The aging is the target; it must not block the core skin polish.

## What I see now (live screenshot) - the gap to close
- **Substrate still pond** (same dark blue-teal as natural) - biggest tell.
- **Pads read machined** - flat matte-pewter discs with a mechanical pinwheel seam.
- **Koi still read warm/natural** with no metal finish.
- **Light passes read underwater** - soft/diffuse; on a mirror they should be sharper, brighter, higher-contrast.

## Concrete targets (judge against these)
1. **Mercury substrate (tinted).** Replace the teal field grade with reflective dark mercury + faint warm tint, built on **specular contrast** (bright hotspots adjacent to deep darks). Never teal; never dead-neutral grey.
2. **Caustics -> mirror-warp.** Drifting layers read as slow molten ripples warping reflected light, not soft underwater dapple.
3. **Ripple wave-trains -> mercury beading.** Crests = bright specular highlights, dark troughs just outside; sharper/brighter than watery.
4. **Pads -> brass-aging-to-verdigris** (per "Dynamic material"): young = polished brass, mature = verdigris patina, interpolated over growth state; strong specular hotspot + dark rim; brass/gold lotus blooms. Lose the machined pinwheel-seam read.
5. **Koi -> warm wet metal** (copper / rose-gold / bronze): bright moving hotspots, sharp leading-edge highlights. **EXCEPT one cool focal accent:** keep a single **Platinum / silver Ogon** rendered cool silver-white - one cold note among the warm metal, the eye's focal point. Don't desaturate the rest to match it.

## Keep / don't regress
- Keep the sparkle/glint system (suits metal more than any skin).
- Keep the wake system, retuned to specular.
- Do NOT touch the koi *shape* or pattern model - tonal/material pass only. (A Kohaku is still a Kohaku, rendered copper-and-silver.)

## In scope / out of scope
- **In:** the **metal skin only** - mercury substrate, caustics/ripple retune, brass->verdigris pads + brass lotus, warm-metal koi + one silver accent.
- **Out:** natural, ink, rain (later passes); any new skin / variety / plant / feature; blended-growth-curve (parked v0.1); anything touching `index.html` / `/shared` / storefront (POD_ARCADE).

## Guardrails (engine-aware)
- **Stay featherlight:** ~40fps cap, pause-when-hidden, reduced-motion respected. **No new per-frame expensive ops** (no large `shadowBlur`, no full-res filters in the draw loop) - we crashed ink once on an expensive `shadowBlur` glow; don't reintroduce that cost.
- **Reuse what's there.** Lean on the reusable sprite blob + established cheap techniques. If metal needs a true full-frame treatment, **follow the rain skin's pattern** (low-res buffer, then treat), not full-res filtering.
- **Keep the per-frame canvas-state reset / try-catch** - cross-skin stability hardening is load-bearing.
- **Where to look:** the metal entry in `SKINS`; the 3-pass water/overlay (caustics, sunbeam, sky-sheen, ripple trains); the reusable sprite helper; the pad/lotus draw (+ the plant growth-state value, for the patina); the koi material path. Metal currently inherits the natural substrate and must stop.

## How we judge (the loop)
Build in `games/koi/` -> deploy -> human screenshots the metal skin (a few frames, koi spread; include a young pad and a mature pad if possible) -> director reads pixels against targets -> refine. **Acceptance:** whole frame reads liquid metal, NO teal substrate; specular contrast present; pads read verdigris-molten not machined-grey, with new pads gleaming brass and mature pads patinaed; exactly one cool silver koi reads as focal point among warm metal; nobody would call it an "alien pond." Validate JS in node before deploy; the human's eyes (via screenshot) are final.

## Lane check
Entirely inside `games/koi/`. No shared/brand/storefront touch -> no keystone serialization. Ready to promote to `games/koi/BRIEF.md`.
