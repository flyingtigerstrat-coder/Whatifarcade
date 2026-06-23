# BRIEF - Koi: METAL polish, refinement pass (v0.5)
**v0.5 . 2026-06-22 . STATUS: READY** · koi pod. Focused refinement on top of v0.4 (which partly shipped - see "What shipped"). Same lane (`games/koi/` only), same two principles (full-frame world; metal is a finish, not a palette). This brief lists only the DELTAS - everything in v0.4 still stands unless contradicted here.

> The frame went from "pond with grey pads" to a real bronze metal field - structure fixed. Now the finish is underbaked: it reads muddy because it's nearly all warm mid-tones. v0.5 is a **dynamic-range + finish** pass, plus the deferred pad conversion.

## What shipped in v0.4 (KEEP - do not regress)
- **Substrate converted** to a warm bronze metallic field with a soft specular sheen - the whole frame now reads as one material (Principle 1 achieved). Keep this.
- **Koi warmed** to copper/bronze/tan. Palette direction is right. Keep warm.

## What's still off (the v0.5 job)
1. **Muddy / low dynamic range.** The field is almost entirely warm mid-brown - too little that's genuinely bright, too little genuinely dark. Metal sells on **specular contrast**; without hot highlights and deep darks, bronze reads as varnish/mud, not mercury.
2. **No temperature split.** It's monochrome-warm. Real liquid metal reflecting a dusk sky has **warm mids + COOL (silver-blue) highlights.** That cool-on-warm in the speculars is the single biggest "real metal" cue and it's missing.
3. **Pads never converted** - still the natural jade-green lily pads. They're now the brightest, most-saturated thing in the frame, which breaks the focal hierarchy (foliage should not out-shout the speculars). Bring them into the metal world.
4. **Koi camouflage.** Several koi sink into the bronze mid-frame - too little separation. They should read as polished objects sitting ON the mirror.
5. **Ripples + glints too faint** to sell a reflective surface.

## Focused targets (v0.5)
1. **PUSH DYNAMIC RANGE (primary).** Raise contrast in the metal grade: let specular hotspots blow out genuinely bright, let shadow/edge areas sink genuinely dark. The surface should look wet and reflective, not matte. (Do this in the grade/gradient/draw VALUES - see guardrail; not a per-frame full-canvas filter.)
2. **TEMPERATURE SPLIT (the unlock).** Keep the warm bronze mids, but make the **highlights cool - silver / steel-blue**, as if the metal reflects a dusk sky. Warm body, cool speculars. Avoid uniform brown. This is the difference between "molten" and "varnish."
3. **Pads -> brass-aging-to-verdigris** (the deferred v0.4 item): convert them now. Young/new = polished brass, mature = verdigris patina, interpolated over the plant's existing growth state; strong specular hotspot + dark rim; brass/gold lotus blooms. Per v0.4 phasing: if the growth hookup is fiddly, ship **static verdigris** now, aging as fast-follow - but get them OFF green this pass.
4. **Koi separation.** Add bright (cool) specular rim/leading-edge highlights so koi pop off the substrate. Ensure the **silver/platinum Ogon** is clearly the cool focal point among the warm koi - it should be the brightest fish.
5. **Ripples -> brighter mercury beading; let a few glints actually blow out** on the specular band. Currently too subtle to register as a reflective surface.

## Focal hierarchy (the test for "did the temperature/DR work land")
Brightest things in frame, in order: **specular hotspots on the water -> the silver koi -> warm-koi edge highlights.** The pads should NOT be the brightest/most-saturated element anymore. If the green pads still draw the eye first, the pass isn't done.

## Guardrails (engine-aware - important for THIS pass)
- **Get contrast from the GRADE, not a filter.** Achieve the dynamic-range push via gradient stops / fill values / the specular draw - **do NOT** add a per-frame full-canvas `ctx.filter = 'contrast()'/'brightness()'` or any full-res post filter in the draw loop (that's the expensive class of op that crashed ink). Cool highlights = cooler color stops + cool specular sprite tint, not a filter.
- **Stay featherlight:** ~40fps cap, pause-when-hidden, reduced-motion; reuse the existing sprite blob; if a true full-frame treatment is needed, follow the rain skin's low-res-buffer pattern.
- **Keep the per-frame canvas-state reset / try-catch.**
- Tonal/material only - **do not** touch koi shape or the pattern model.

## In / out
- **In:** metal skin only - dynamic range, temperature split, pad conversion (brass/verdigris), koi separation, ripple/glint punch.
- **Out:** natural / ink / rain; any new content; growth-curve (parked v0.1); anything outside `games/koi/`.

## How we judge (loop)
Build -> deploy -> human screenshots the metal skin (a few frames; include a young pad and a mature pad if possible, and try to catch the silver koi in frame) -> director reads pixels. **Acceptance:** the frame reads molten/wet - clear bright (cool) speculars against deep darks, not uniform brown; warm mids + cool highlights present; pads are brass/verdigris, not green; koi separate cleanly from the substrate and the silver koi is the focal point; the word "muddy" no longer applies. Validate JS in node before deploy; the human's eyes (via screenshot) are final.
