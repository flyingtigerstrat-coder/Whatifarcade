# BRIEF - KOI GARDEN v1.1 - THE LIVING POND (ecosystem sprint)
**v1.1 . 2026-07-02 . STATUS: READY** - supersedes v1.0 (same day; archive it). This is the CANONICAL sprint spec - promote THIS to `games/koi/BRIEF.md`.
CHANGED from v1.0 (human rulings, 2026-07-02): (1) fireflies-at-dusk APPROVED - day cycle + dusk fireflies now committed Phase C scope (a deliberate cross-title nod to Firefly Jar, human-ratified); (2) capacity guidance: BE GENEROUS, weighted by on-screen legibility + perf; (3) NEW: graceful koi departure ("let it swim on") + koi card selection; (4) breeding CONFIRMED in-sprint (Phase D); (5) Phase B expanded into THE DREAM POND - pad/flora variety + decorative hardscape + a third organizing principle (below). Lane: `games/koi/` only. Phased A-D, each deployable + screenshot-reviewable; §10 micro-loops sanctioned, CONTEXT notes back.

> **The vision, one line:** the pond stops being a picture you keep and becomes a place that keeps you - a living ecosystem you also COMPOSE, where life you never placed arrives because of what you tended, arranged, and grew.

## Director's analysis (grounded in the live build, read 2026-07-02)
Architecture is ready: documented render contract (`water/koi/plant/fx/overlay`; skins register in `SKINS`, optional handlers fall back to Natural); plants carry a `grow` 0-1 field (metal's patina keys off it - generalizes); economy is `thriving() = .7*fed + .3*plantGrow` scaling serenity; save `koipond_v2` = econ, unlocked, koi{variety,age,x,y,seed}, plants{type,x,y,size,grow,bloom}; caps ripples 40 / sparkles 80; ~40fps, pause-hidden, reduced-motion. Parse-clean. This sprint INHABITS the platform; it does not rewrite it.

## THREE ORGANIZING PRINCIPLES (the sprint's spine)
**1. Three planes of life.** BELOW (submerged grasses, a darting school - darker/softer, parallax) / ON (koi, flora, rocks, a resident frog) / ABOVE (dragonfly + its water shadow; fireflies at dusk). Every entity declares its plane; planes render in order.
**2. The pond earns its visitors.** Rare species are never bought. Hidden ecology scores DERIVE from what exists - **shelter** (rocks, submerged grass, mature pads), **bloom** (lotus/iris/lily blooms), **life** (extends `thriving()`), **calm** - and visitors arrive when thresholds cross. Numbers stay hidden; legible through life, never meters.
**3. Beauty and ecology are one system (the dream pond).** Everything placeable is BOTH decoration and habitat: a pad is decor and shelter; a lantern is beauty and calm; arrangement is expression and function. There is no separate "decorate mode" - curating your dream pond and tending a thriving one are the same act. Composition belongs to the player; the pond rewards it with life.

## HARD LAWS
- **No fail states, timers, scores, grind, or pressure.** Nothing dies, starves, or is lost. An untended pond pauses gracefully.
- **No on-screen predation, ever.** The frog never hunts; the school is never eaten. Attraction and coexistence, not a food chain. (Product law: the product sells calm.)
- **Persistence = attachment; save migration is sacred.** `koipond_v2 -> koipond_v3`, lossless upgrader, tested against a real v2 save before Phase A merges. Never reset a pond. Corollary: no destructive action without a gentle two-step confirm (see departure).
- **Featherlight forever:** ~40fps cap, one reusable soft sprite, no per-frame full-canvas filters, pause-when-hidden; every new mover honors reduced-motion (school tightens/slows, dragonfly perches, fireflies drift slower, frog sits).

## CAPACITY DOCTRINE (human ruling)
Be GENEROUS. Builder proposes a capacity ledger in Phase A with per-entity rationale on two axes: perf cost (frame budget at worst case, all fauna active, oldest target device) and on-screen legibility (a cluttered pond is not calm - composition is the aesthetic ceiling). Err toward abundance within those; human ratifies the feel. Ballpark to beat, not to obey: koi ~15, plants ~30 total, rocks/decor ~10, school ~20, plus visitors. Departure (below) is the release valve that makes generosity safe.

## PHASE A - FOUNDATIONS
1. **Entity/skin contract v2.** Every entity type registers per-skin draw handlers OR inherits Natural fallback tinted through per-skin palette-role tokens (metal renders a reed as patinaed bronze without bespoke code). Standing rule: **no entity ships unless it reads correctly in all four skins.**
2. **Save schema v3 + migration.** Adds: rocks/decor, new plant types, frog residency, koi `parents:[seedA,seedB]|null` (lineage), **departed-koi memory** (variety, seed, dates - the Almanac remembers), ecology timestamps (idle sim). Derived things (school positions, dragonfly, fireflies) are NOT saved - they re-derive from ecology on load.
3. **Blended growth + life stages.** Koi grow slowly with TIME, faster when FED. Stages from age: fry -> young -> adult -> **elder** (prestige, not decline: longer flowing trailing fins via spine extension, slower drift; never death).
4. **Idle return simulation.** On load, apply CAPPED gentle progression for elapsed time + roll visitor chances - returning can mean finding a dragonfly already there. Away-progress is a gift, never an obligation or exploit.
5. **Hygiene:** header version comment is stale (reads v2.2); bump now and every merge (`koi v3.x (living pond, phase A)` ...).
ACCEPTANCE A: real v2 save loads losslessly; koi grow while away; elder fins read at a glance; all four skins coherent; capacity ledger proposed with rationale.

## PHASE B - THE DREAM POND (flora, hardscape, curation, departure)
The player's palette. Everything here is decor AND habitat (Principle 3); all carry `grow` where it makes sense (things that persist wear their time); all obey the skin contract; procedural only.
**Flora expansion:**
1. **Lily pad varieties** - the pads themselves become a palette: classic green; red/copper-edged; a small-pad clustering species; and an occasional **water-lily bloom ON a mature pad** (distinct from lotus - pink/white cup, feeds the bloom score). Variety picker lives in the tend tray; pads remain draggable/arrangeable as today.
2. **Reeds/cattails** - emergent vertical clusters, gentle sway, koi steer around; the pond's first vertical element; dragonfly/firefly perch.
3. **Water iris** - emergent accent bloom (bloom score; brass/gold in metal).
4. **Duckweed** - drifting micro-pad clusters riding ripple trains; koi occasionally nibble it (a tiny ambient self-feeding trickle powering part of passive growth - the pond feeds itself; tending feeds it better).
5. **Submerged grass** - below-plane sway + parallax; major shelter.
**Hardscape & decoration:**
6. **Rock set** - 2-3 forms (river stone, weathered boulder, flat slate); placeable with WEIGHT (drag-to-reposition allowed but heavy - builder proposes the feel); koi steer around; ripple rings visually break/foam at rims (cheap arc masking, NOT wave physics); **moss creeps over `grow`** (metal: oxidizing ore).
7. **Driftwood** - one long low form; part perch, part shelter, part composition line.
8. **Stone lantern (toro)** - the pond's decor anchor: a small classic stone lantern, mossing over time, contributing CALM. (No light emission yet - it may glow at dusk in Phase C; see fireflies.)
**Curation & management:**
9. **Tend tray** - the shop nav grows gracefully: release koi / plant (pad varieties, lotus, reed, iris) / place (rock forms, driftwood, lantern). Serenity-priced on gentle curves. Same quiet chrome.
10. **Koi card + graceful departure (human ruling).** Long-press (or select) a koi -> a small quiet card: variety, life stage, lineage if pond-born. One action: **"let it swim on."** Gentle two-step confirm, then the koi departs downstream - swims to the pond's edge with a wake, a farewell ripple, gone. The **Almanac remembers it** (card marked "swam on," date kept); its lineage persists in descendants. **NO serenity refund** - a refund would make fish currency and invite churn; departure is curation, not commerce. Departed koi do not return. This is the release valve that lets caps stay generous.
ACCEPTANCE B: a tended pond reads visibly LUSHER and more COMPOSED than a fresh one (side-by-side screenshot); pad varieties + a lily bloom read distinctly; lantern/rocks read heavy, mossy with age; the departure moment feels like a farewell, not a delete; every new entity correct in all four skins; ledger held.

## PHASE C - THE THREE PLANES COME ALIVE (fauna + the day)
1. **The school (BELOW).** 15-20 small goldfish/minnows, single boids flock (hard cap), small + darkened/softened for depth; shimmer; darts from approaching koi - prey grammar, zero predation. Arrives when SHELTER threshold is met: the school lives here because you built somewhere to hide. (Value: scale contrast makes koi majestic; the below-plane gets inhabitants; darting vs gliding makes both more alive.)
2. **The frog (ON).** A RESIDENT: arrives when mature pads + calm cross threshold. Sits on a pad (one frog - the pond's mayor), idle throat-bob; occasionally plops in (ripple + below-plane silhouette swim), resurfaces on another pad. Never hunts.
3. **The dragonfly (ABOVE).** Visits in bright hours when bloom is high: hovers, darts, casts a live **shadow on the water**, occasionally dips a wingtip - spawning a real ring in the existing ripple system. Perches on reeds/rocks (and under reduced-motion).
4. **Day cycle + FIREFLIES AT DUSK (human-approved).** A slow, real-time ambient light drift - the existing sun/grade modulated warm (day) -> amber (dusk) -> cool-dark (night) -> pale (dawn); long, unhurried periods. At DUSK, if the pond is calm+grown: **fireflies** - a handful of soft winking motes above the water (reuse the soft sprite; screen blend; capped ~10), drifting among reeds, reflecting faintly on the surface. The stone lantern may carry a soft warm glow at dusk (cheap radial - the lantern earns its place). This is a deliberate, human-ratified nod to Firefly Jar - the studio's games waving at each other. Keep it subtle: a visitor, not a light show. All four skins must handle the day tint (ink may keep its own eternal-dusk; builder proposes per-skin behavior).
5. **Moments.** Visitor events (dragonfly lands, frog plops, school flashes a sunbeam, first firefly of dusk) grant small serenity bursts. Presence is quietly rewarded; nothing demands watching.
ACCEPTANCE C: visitors appear ONLY when earned (fresh pond = none); dragonfly shadow + dip-ripple reads on a short recording; dusk fireflies read as tender, not gimmicky; day cycle is felt, not watched; no predation; reduced-motion verified; ledger held with everything active.

## PHASE D - THE ALMANAC & THE LONG LOOP
1. **Codex -> Pond Almanac.** Sections: **Koi** / **Flora** / **Visitors** - same live-render pattern. Undiscovered visitors are silhouettes with soft hints ("prefers still water and old pads..."). Includes the pond's HISTORY: departed koi kept as remembered cards.
2. **Lineage.** Pond-born koi show their parents' patterns (Phase A seeds). Your fish have ancestry; departures leave descendants.
3. **Breeding - the signature (CONFIRMED in-sprint).** When the pond THRIVES, two adult koi exist, and count is under cap: rarely, quietly, a FRY appears - its seed DERIVED from both parents (seed-mix in `buildPattern`: blended template jitter, inherited hi-placement tendencies). No breeding UI, no pairing, no management. Rare enough to be an event. Ship simple inheritance first if genetics runs deep; refine fast-follow.
4. **Serenity economy rebalance** across sources (thriving, moments, idle trickle) and sinks (tend tray, variety unlocks -> real curve replacing 40-120 placeholders). Target arc: first calm week earns the pond's first visitor; a kept month earns a pond-born koi. Never grindy; returning after absence always feels welcomed.
ACCEPTANCE D: a month-old pond contains things no menu sold - a resident frog, a native-born koi with visible lineage, moss on the first rock, fireflies that consider dusk here worth visiting - and the Almanac tells that pond's whole story, departures included.

## OUT OF SCOPE
Storefront/brand/Tier-0 (parked by human; POD_ARCADE lane). Audio (own future pass - the shishi-odoshi waits for it). New skins / ink+rain polish (queued behind this sprint). Monetization mechanics (this sprint builds shelves, not a store). Cloud saves/accounts. Single-file discipline holds; PROPOSE a split before doing one.

## OPEN QUESTIONS (human's)
1. Capacity ledger numbers - builder proposes with rationale (Phase A), human ratifies the feel. Doctrine: generous.
2. Per-skin day-cycle behavior (does ink keep an eternal dusk?) - builder proposes, director reviews, human's eye rules.
3. Naming koi (the koi card invites it someday) - NOT this sprint; flagged as a natural fast-follow.

## HOW WE RUN IT
Per phase: builder proposes the phase plan -> human OKs -> build (node parse-check; version comment bumped) -> deploy -> human screenshots (Phase C: short RECORDING - motion is the point) -> director reads against acceptance -> §10 micro-loop tuning, CONTEXT notes back. Phases land in order; each leaves the live pond healthy. The human's eyes are final.

## THE FEELING TEST (the sprint's acceptance)
Open a pond someone has kept for a month next to a fresh one. The kept pond reads - instantly, wordlessly - as a PLACE WITH ITS OWN LIFE AND ITS OWNER'S HAND: old fish with flowing fins, a composition of pads and stone that is clearly someone's taste, moss on the lantern, a frog that lives there, a school that trusts the shelter, fireflies at dusk, and a young koi wearing its parents' colors. If a stranger asks "how do I get all that?" and the honest answer is "you keep it" - the sprint succeeded.
