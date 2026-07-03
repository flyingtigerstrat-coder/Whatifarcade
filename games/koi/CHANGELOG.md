# CHANGELOG — KOI GARDEN
(newest on top; fields: DECIDED / TRIED / PARKED / CHANGED / OPEN / FEELING)

## 2026-07-03 — C.4: size-led feeding hierarchy (§10 micro-loop, human's live read + koi research)
DECIDED (human, from watching real ponds): "the biggest koi be most aggressive for food — make it realistic." Researched wild/pond koi behavior first: koi run a **size-led pecking order** — larger, older fish hold higher rank and get priority access to food and prime position; the biggest/boldest reaches the food first and takes the first bite, pushing smaller fish aside. Boldness is a **second, personality axis** (partly genetic — "bold koi rush the surface; shy ones linger for leftovers"). Human ratified: **size-led (60% size / 40% seeded boldness)** + **nudge-and-yield** aggression (dominant holds the spot, subordinate shoved to leftovers, nobody starved). Engine v3.4 → **v3.4.1**.

CHANGED (the frenzy now has a pecking order — realistic, and still kind):
- **Feeding rank, `domin(k)`:** 60% body size (live `elen`, so a fish that grows up climbs the order) + 40% **boldness**, a stable per-fish temperament derived from the saved seed (`k.bold`, 0=timid..1=bold — persists for the life of the fish, never saved separately, never re-rolled). Two axes, exactly as the research describes.
- **Dominant fish go first:** they react to the splash harder (higher excitement floor — the timid still stir at .4 but hang back a beat), and **rush faster** toward the food, so they arrive and take the first bites.
- **Elders LEAD the charge** (resolves C.3's open question): the elder calm-drift brake is **lifted by excitement** — the biggest, oldest koi are a real pond's most aggressive feeders, so they charge at a feeding and only go statelier when calm.
- **Asymmetric jostle:** the shoulder-to-shoulder shove is now weighted by rank — the subordinate yields, the dominant holds its spot (a big fish pushes smaller ones aside).
- **The dominant takes the bite:** a dominant fish can snatch a *barely-touched* pellet from a lesser one — but only at the very start of the bite, and handling time still forces gaps, so the timid always get their turn on the next pellet. **No starvation, ever** (the no-fail-state law holds).
- **Settle-to-eat brake:** fish now decelerate hard in the last ~18px so they *park* on a pellet to mouth it instead of torpedoing through (also fixed fast fish overshooting while nimbler small ones camped the food).

TRIED / VERIFIED: new C.4 gate suite (16/16, deterministic) — boldness is a stable seeded trait that survives reload; `domin` ranks big>small and bold>timid at equal size; the biggest fish reaches equidistant food first; jostle is asymmetric by rank; **elders keep pace with adults at a feeding but drift slower when calm**; over a mixed-size feeding the **big half out-eats the small half (~+42%)** yet **every fish still eats** (no starvation); one splash still excites the whole pond; all four skins render clean. A/B/C/C2/C3 suites re-run green (**110/110 total**; also hardened Phase C's flaky "bare pond" test). REAL-BROWSER: mixed-size feeding renders naturally — fish settle onto the pellets, no overshoot chaos — screenshot shared.

OPEN: per-fish intake is noisy (boldness + ring position scatter on top of size) — that's realistic, not a bug; if the director wants a *stricter* size ladder it's a one-number tune (raise the size weight). Boldness is currently invisible in UI — a future Almanac could surface a fish's temperament.


## 2026-07-03 — C.3: the feeding frenzy (§10 micro-loop, human's live read)
DECIDED (human): eating should LOOK like eating, and koi should swarm a thrown handful the way a real pond does. Engine v3.3.2 → **v3.4**.

CHANGED (the pond's most alive moment, built honest — excitement, not urgency):
- **The splash is felt pond-wide:** feed() now excites every koi (`excite`, transient — never saved), scaled by distance and hunger. Excited fish sense food from across the water (280px → up to ~710px), steer hard for it, and **surge up to ~2.5×** with a sharper allowed turn-in (the C.1 curvature clamp still guards the spine — no ball-curls). They **brake in the last stretch** so the crowd gathers AT the food instead of overshooting.
- **The crowd is a crowd:** shoulder-to-shoulder jostling near the food (soft separation + churn ripples), and each fish targets the nearest **unclaimed** pellet so the swarm spreads across the throw instead of stacking on one pellet.
- **Eating is visible:** a claimed pellet is **drawn into the working mouth** and gulped; the final slurp pops a small ring other koi rush to (fish follow fish). New engine-level `drawGulps` renders the classic top-down **"O" mouth cycling open-shut** over any skin's koi (all four skins). Crowded fish gasp at the surface even between pellets.
- **The meal shares itself:** handling time (a fish finishes its gulp + a short chew before claiming the next pellet) and fed fish pressing slightly less hard — one quick fish can't hoover the whole throw. Slowest fish can still miss a small throw; you throw again, and hunger-scaled excitement gives the unfed ones the edge.
- **Frenzy holds, calm returns:** while a pellet is in sight excitement floors at .45 (real koi don't lose interest mid-rush); the moment the water is empty it decays away in ~2s and the pond is a pond again. Pellets now bob/drift on the surface (life 18–24s) instead of freezing in place. Reduced-motion: the surge is tempered, the gathering still happens.

TRIED / VERIFIED: new C.3 gate suite (17/17, 10/10 stable runs — 8 edge-ringed koi ALL excited by one splash, ≥7 of 8 converge <120px from ~300px out vs. control (no feed → no convergence, zero excitement); 3s rush displacement >1.5× base drift; most pellets EATEN not expired; two handfuls feed ≥5 of 8; excitement and mouths fully settle after; nothing transient saved; all four skins render mid-frenzy clean; reduced-motion still gathers). A/B/C/C.2 suites re-run green (76/76). REAL-BROWSER: click-feed → rush frame (all 8 turned in, mid-surge) + crowd frame (tight ring around bobbing pellets, open mouths visible) — screenshots shared.

OPEN: mouth "O" size/alpha is a taste dial for the director; a possible splash SOUND when audio arrives. *(RESOLVED in C.4: elders lead the rush — the biggest, oldest koi are a pond's most aggressive feeders.)*


## 2026-07-02 — C.2: seeded per-instance variety (§10 micro-loop, human's live read)
DECIDED (human): driftwood needs 2–3 variants; other flora gets slight within-subclass variety; rocks get variety too. Engine v3.3.1 → **v3.3.2**.

CHANGED (everything derives from a SAVED per-instance seed `sd` — the same koi principle, extended to the whole pond: your specific driftwood is yours across reloads):
- **Driftwood: three forms** keyed off the seed — a log with a broken branch stub · a slim bowed log with paired knots · a **forked snag** with two weathered prongs; trunk width, bow, stub placement/angle, and knot count/positions all seeded.
- **Rocks individualized:** pebble gets seeded elongation, outline wobble, tone shift, and band placement; boulder's facet silhouette is jittered per instance with varied crack paths (second crack only sometimes); slate stacks **2 or 3 plates**, each nudged and slightly turned like a real pile; overall rock size range widened (.75–1.25).
- **Flora within-subclass variety:** reeds vary blade count (5–8), spacing, and tone; iris varies stalk count, **petal count (5–6)**, bloom size, and tone; grass varies blade count and spread; pads/lotus/duckweed carry a per-instance tone shift (lotus colony pads and cluster-colony pads each offset slightly, so no two neighbors clone).
- **Save v3 additive fields:** plants and rocks now persist `sd`; factories accept an optional seed and derive all cosmetics via the seeded PRNG. Old saves seed once on first load, then are stable forever — nothing is lost, nothing re-rolls.

TRIED / VERIFIED: new C.2 gate suite (14/14 — identity stable across double reload; 12 driftwood hit all 3 variants; old copper-pad save upgrades losslessly; all four skins render seeded variety with zero warnings); A/B/C suites re-run green (62/62); real-Chromium lineup screenshot (3 seeds of every rock form + varied reeds/irises/pads/grass) captured and shared; `sd` confirmed byte-stable across reload in the live browser.

OPEN: pad tone variation is deliberately subtle (±14% brightness) — director's eye on whether it should push further; pebbles read close at small sizes (worn stones are worn stones).


## 2026-07-02 — C.1: hardscape/flora differentiation + graceful turns (§10 micro-loop, human's live read)
DECIDED (human, four items from the live Phase C build): plants too similar; koi still curl into a ball; driftwood the weakest visual; rocks under-differentiated. Engine v3.3 → **v3.3.1**.

CHANGED:
- **Koi never ball up (two layers):** turn rate now scales with speed (min turn radius ~ half a body length — a slow fish sweeps an arc instead of pivoting in place), plus a spine **curvature clamp** (max bend .34 rad/segment) so the body can never fold into a hairpin whatever the trail did. Verified under torture: 20s of forced max-turn → worst bend .45 rad incl. swim-wiggle (a ball is 1.5+); the fish arc, always.
- **Driftwood redesigned:** an actual weathered log — tapered trunk, broken branch stub, pale cut end with end-grain rings, bark grain following the taper, a knot, wet top sheen.
- **Rocks differentiated by construction, not just size:** river stone = smooth worn pebble with a sediment band + wet sheen; boulder = angular faceted chunk with a lit top plane, shadowed flank, and cracks; slate = three stacked layered plates with strata edges and a lit rim.
- **Flora voices separated:** copper pad's whole body reads warm olive-bronze with a strong copper rim (was rim-only); cluster is now a five-pad colony with varied sizes; reeds grew taller with proper cattail heads + tip shoots; submerged grass got shorter/thinner/cooler (no longer a reed twin); **iris blooms violet** via a new `bloomAlt` role (natural violet · metal gold · ink pale wash — contract-safe with fallback).

TRIED / VERIFIED: all three suites green (62/62); lineup screenshot captured (all 5 hardscape forms + all flora varieties side by side) and shared; spine-bend torture assertion in real Chromium.

OPEN: slate could show its layers even more at small sizes; duckweed remains subtle by design — both for the director's eye on the next read.


## 2026-07-02 — LIVING POND Phase C: the three planes come alive (BRIEF v1.1)
DECIDED (human: "Go into phase C" after B.2.4's fins verified live). All C rulings were batch-ratified earlier (quick visitor unlocks; real-clock day cycle; ink keeps its eternal dusk; thresholds shelter≥6 / 3 mature pads / bloom≥3). Engine **v3.2.4 → v3.3 (living pond, phase C)**.

CHANGED (the pond earns its visitors — none of this is bought):
- **The school (BELOW):** 15–20 minnows in one boids flock, small/dark/soft under the koi, occasional shimmer glints. **Arrives on its own when shelter ≥ 6** (rocks + submerged grass + mature pads); earned trust lingers (hysteresis). Darts away from approaching koi — prey grammar, **zero predation, ever** (gate-tested: count constant). Never saved; re-derives from ecology.
- **The frog (ON):** the pond's mayor — takes residence when 3+ mature pads + calm; **residency persists in the save**, position derives. Sits on a pad with an idle throat-bob; occasionally plops (real ripple) and glides below-plane to another pad. Never hunts. Reduced-motion: he just sits.
- **The dragonfly (ABOVE):** visits in bright hours when bloom ≥ 3 — hover-dart flight, a **live shadow on the water**, occasional wingtip dip spawning a real ring. Perches on reeds/driftwood; always perched under reduced-motion. Transient; never saved.
- **Day cycle LIVE:** the QA preview graduated — `auto` now follows the **real local clock** (day → amber dusk 17–21 → cool night → pale dawn, ~1.5h blends; felt, not watched). Ink keeps its eternal dusk; metal takes the grade as the mirror reflecting its sky (director tunes speculars later). Codex QA forcing + `?hour=N` dev override both work.
- **Fireflies at dusk (the Firefly Jar nod, human-ratified):** when dusk/night + a grown pond + sustained calm (~40s unstirred) — up to 10 winking motes drifting among the reeds and lantern, faint reflections beneath, **the stone lantern's window glows**. A visitor, not a light show. Gone by day.
- **Moments (zero UI):** first sightings stamp `seen{}` into the save (Almanac substrate) with small serenity gifts; frog plops, dragonfly dips, school flashes grant quiet throttled bursts. Presence rewarded; nothing demands watching.

TRIED / VERIFIED: 25/25 Phase C gates (fresh pond earns NOTHING; earned pond gets school+frog+dragonfly within sim-minutes; no predation; day-cycle math; fireflies dusk-only ≤10; frog residency + seen persist, derived life does NOT; all four skins render everything with zero warnings; reduced-motion perch). A+B suites re-run green (37/37). REAL-BROWSER: school/frog/dragonfly live at noon, 10 fireflies + glowing lantern at forced dusk, koi trails still full — screenshots captured and shared.

OPEN: director's read against Acceptance C wants a short RECORDING (motion is the point — the dip-ripple, the plop, the winking); metal's dusk speculars are the standing tune-later; Phase D (Almanac, lineage, breeding ~7–10 kept days, economy) is next and last.


## 2026-07-02 — B.2.4: trail commit fix — the fins bug, actually fixed and PROVEN
DECIDED (human: "fin bug still present" — correctly). Engine v3.2.3 → **v3.2.4**.

FOUND — B.2.3's trail gate had a self-defeating bug, and the verification method missed it: the gate dragged `trail[0]` along WITH the head every frame, so the 2px spacing threshold never tripped — **the trail starved at 1 point**. A 1-point trail hits the straight-line fallback (full-length STIFF fish), which photographs beautifully — my screenshot verification lied. On real machines, occasional frame spikes committed a second point ~2px away → a 2px "trail" → the collapsed boxes the human kept seeing. Confirmed with data: on the deployed build, every koi's trail measured **1 point, 0px span** after 9 seconds.

CHANGED:
- **Commit-or-replace trail:** the head point is exact every frame; the point behind it commits only once it is ≥2px behind (replaced until then). Trails measured at 49–83 points spanning 115–177px — full body coverage.
- **Trail pre-fill:** koi are born with a straight trail behind them, so fish render full-length from frame one instead of "growing" for their first seconds.
- **Version in the fps chip** (`v3.2.4 · NN fps`) so which-build-am-I-running is never a question again.

VERIFICATION UPGRADED (the meta-lesson): screenshots alone can lie — a stiff straight fish and a healthy curved fish look the same in a still. The gate test now **asserts on the trail data itself** (every koi: trail span ≥ body length, at t=1s and t=10s) and the screenshot confirms curvature. 8/8 full at both checkpoints; suites green (37/37).


## 2026-07-02 — B.2.3: full-length koi fix (founding-era bug) + quality-first adaptive DPR
DECIDED (human: "fins are broken" + "flip philosophy and fold in"). Engine v3.2.2 → **v3.2.3**.

FOUND — a FOUNDING-ERA latent bug, finally visible: the koi body is drawn along a trail of recorded positions, but the trail recorded a point EVERY frame with no distance gate, capped at ~36 points — at koi swim speed that is ~15–25px of trail for a ~100px body. **The rear two-thirds of every koi has always collapsed to a point** (why fish always rendered boxy-short, never the designed sleek taper). The elder work amplified it into visible breakage: elder fins scale with the INTENDED body length while elders also swim slower (even shorter trail) → tiny collapsed body wearing a giant detached fin.

CHANGED:
- **Trail fixed at the root:** points are distance-gated (2px spacing, head tracked exactly) and the cap now covers the full body length. Koi render at their designed length for the first time — rounded head, broad shoulders, smooth taper, fins attached and flowing. Verified by SCREENSHOT (Playwright renders the real canvas): before = the human's broken screenshot exactly; after = the koi as the founding chat designed them. **Flag for the director: this is a significant (corrective) visual change to every fish.**
- **Quality-first DPR (human-ratified flip):** DPR starts at full retina (cap 2); the adaptive shed now steps DOWN in rolling 5s windows (2 → 1.5/.45 → 1/.4), never up, max twice — and the shed level is **remembered per device** (`koipond_q`), so a slow machine skips the slow first seconds on every later visit. Good machines get retina crispness back.

MEASURED (software-raster container): visit 1 starts DPR 2, sheds once, settles 25.9 fps @ DPR 1.5; visit 2 starts at the remembered level immediately (24.9 fps from the first second). Suites green (37/37).

OPEN: the human re-verifies fins + feel on the laptop and the spark (spark first visit will be slow for ~5-10s while it finds its level, once).


## 2026-07-02 — B.2.2: half-res water buffer + adaptive quality shed (human: 11 fps live)
DECIDED: the human's live fps readout came back **11 fps** — their machine rasterizes the canvas in software (matches our headless software-raster measurements exactly), so the bottleneck is the full-frame WATER painting, as the B.2.1 profile predicted (JS ~2.5%; raster ~97%). Pulled the staged lever. Engine v3.2.1 → **v3.2.2**.

CHANGED:
- **Half-res water buffer:** the water passes (bg grade, caustics, beams, ribbons, wakes) — soft glows all — now paint into a persistent WS=.5 offscreen buffer and upscale to the frame. Water raster cost drops ~9× (WS² vs DPR²); the glow reads identically. (Rain already had its own buffer; untouched.)
- **One-shot adaptive shed:** the first ~6s are sampled; if the machine still can't hold ~22 fps, quality sheds ONCE (DPR cap → 1, WS → .4) instead of staying a slideshow. No oscillation; healthy machines never shed.

MEASURED (real Chromium, software raster — the environment that reproduces the human's 11 fps): natural **10.8 → 32.3 fps**, metal **13.3 → 33.5 fps**, worst frame gap 100 → 67ms — near the 40 fps cap, before any shed. Suites green (37/37).

OPEN: human re-verifies the live fps chip after deploy — expect ~30-40. If a machine still reads low after the 6s shed kicks in, the last lever is koi-pattern pre-render to body-space textures.


## 2026-07-02 — B.2.1: re-bake hitch fix (human: "even slower, almost unplayable" after B.2)
DECIDED: the human reported the live pond WORSE after the B.2 merge. Assessed in a REAL headless Chromium (Playwright), not the counting stub. Engine v3.2 → **v3.2.1**.

FOUND (measured in-browser):
- B.2 is NOT slower in throughput — on identical seeded ponds the pre-B.2 deployed build ran natural at **1.4 fps** vs B.2's **10.5 fps** (software raster; the per-koi blur was catastrophic). JS is ~2.5% of frame time; the rest is native rasterization.
- The real regression is **jank**: on a pond full of actively GROWING plants (the human's), B.2's `ArtCache` re-baked ~9 sprites/sec, each allocating a NEW canvas (a fresh GPU texture upload on real hardware), and at 240 entries the cache **cleared and re-baked the entire pond in one frame** — worst frame gaps of 117–167ms. Steady-slow before → hitchy-lurching after: reads as "almost unplayable."

CHANGED:
- **`ArtCache` map replaced with per-entity sprite slots:** each plant/rock owns ONE canvas for its lifetime and re-bakes IN PLACE when its look-key changes — no map growth, no clear-storms, no canvas/GPU-texture churn.
- **Bake budget:** at most 2 sprite re-bakes per frame; everything else draws its one-bucket-stale sprite until its turn (invisible; kills hitch clustering).
- **Dev fps readout:** `?dev=1` tray now shows live fps, so slowness reports come with a number.

MEASURED: growing-pond worst frame gap down (167→133ms even under pure-software raster where the floor dominates); allocation churn eliminated by construction; steady fps ≥ B.2 on both pond types; both gate suites green (37/37).

OPEN: the human should re-test the live pond with `?dev=1` and report the fps number on natural. If a GPU-rendered machine still reads slow at high fps, the next suspect is compositor stalls — next levers remain: half-res natural water buffer, adaptive quality shedding.


## 2026-07-02 — B.2: performance & architecture review pass (human-flagged slowness)
DECIDED (human): the pond ran slowly on the live build — full code/architecture review before Phase C. Profiled with an instrumented canvas stub (composed pond: 10 koi / 12 plants / 5 rocks) — the frame was paying retail every frame for art that barely changes. Engine v3.1.1 → **v3.2**.

FOUND (measured, per frame): natural created **198 gradient objects/frame** (caustic blobs, lotus petals, pad bodies, sashi feathers), metal **213 gradients + 2,009 individual arc strokes** (scale shimmer), rain **265 gradients + 11 blur filters**, and natural ran a **`blur(3px)` filter per koi per frame** for shadows — at DPR 2 (4× pixels). Plus a real rendering BUG the review caught: an earlier edit swallowed `beginPath()` in `tailFin`, so tail fins were appended to the previous path (the koi shadow) and misfilled every frame in every skin.

CHANGED (look-preserving; contrast/color values untouched):
- **Static-art sprite cache (`ArtCache`):** pads, lotus, and ALL hardscape bake into small offscreen canvases keyed by skin + growth/bloom buckets; per-frame cost collapses to one drawImage each. Caustic blobs use one pre-tinted sprite per color. Rain-drop highlights baked once.
- **Koi hot path:** body outline built ONCE per koi per frame as a reusable `Path2D` (shared by shadow/fill/clip/sheen/rim — was 4-5 rebuilds); per-koi `blur(3px)` shadow replaced with two offset fills; scale-shimmer + fukurin net arcs batched into 2 strokes per style (was ~90-180 strokes/koi); sashi feather de-gradiented into two stepped washes.
- **Misc:** chromeRibbon gradients cached (position-fixed paints slid under a translate); reed/iris/grass hoist one blade-gradient per plant; `syncShop` only touches the DOM when a value changed (was 3+ writes/frame + codex queries); **DPR capped 2 → 1.5** (44% fewer pixels; soft water does not need retina fill-rate).
- **BUG FIX:** `tailFin` missing `beginPath()` restored (fins no longer contaminate the prior path).

MEASURED (same composed pond, before → after): natural gradients **198→24**, strokes **828→42**, filters **10→0**; metal gradients **213→30**, strokes **2,009→53**; rain gradients **265→21**, filters **11→1** (the skin's one structural buffer blur). Both gate suites re-run green (37/37).

OPEN: if low-end devices still struggle after this, next levers (deliberately not pulled yet): half-res water buffer for natural (rain's pattern), koi pattern pre-render to body-space textures, adaptive quality (drop caustic layers under sustained frame misses).


## 2026-07-02 — B.1: QA time controls in the codex + chrome/lantern fixes (§10 micro-loop)
DECIDED (human, live, from the deployed A+B build): surface the **time cycle in the Koi Codex as a QA tool for now**. Engine v3.1 → v3.1.1.

CHANGED:
- **Codex "Pond QA — time" card** (top of the codex, which has doubled as a QA surface since founding): a **day-cycle preview row** (auto/dawn/day/dusk/night) and **time warps** (+1/+7/+30 days) that run the real `idleReturn()` return path. This pulls **Phase C's ambient grade forward in QA-only form** — `auto` stays plain day for players, forcing is session-only and never persisted; **ink keeps its eternal dusk** (per-skin ruling, previewable now). Dusk/night also light the **stone lantern's window** (cheap radial — the Phase C "lantern earns its place" moment, previewable). *Tripwire: remove or dev-gate this card before any wider audience push.*
- **BUG FIX — chrome auto-hide fought the tend tray:** the 3s UI fade was never taught about Phase B's states, so the top-tier menu greyed out (opacity 0 + pointer-events none) while a tray was open or a chip armed, then flickered back on mouse move. The chrome now **never auto-hides mid-task** (open tray, armed chip, live drag, or koi card up).
- **Stone lantern re-proportioned** — it read as a birdhouse on a stick (tall thin post, undersized cap). Now real *tōrō* proportions: grounded base stone, short thick post, chudai platform, larger hibukuro light box with window, **broad overhanging swept kasa cap** + hoju finial; ~25% larger overall (steer/hit radius bumped to match).

TRIED / VERIFIED: both gate suites re-run green (37/37); QA smoke forces every day phase across all four skins + codex build with zero warnings; parse clean.

OPEN: day-grade tint values are QA placeholders — the director tunes the real curve in Phase C; whether the QA card ships dev-gated is the tripwire above.

## 2026-07-02 — LIVING POND Phase B: the dream pond (BRIEF v1.1)
DECIDED (human, batch ratification 2026-07-02): all remaining phase proposals (B/C/D) ratified in one pass, with three riders — **visitors unlock QUICK** (first visitors within the first good session or two), **pond-born koi at ~7–10 kept days** (slower than visitors, faster than a month), and a **rapid-test requirement**: the human wants to drive the whole player lifecycle on demand while we refine. Engine **v3.0 → v3.1 (living pond, phase B)**.

CHANGED (the player's palette — everything is decor AND habitat, Principle 3):
- **Flora expansion:** pad varieties (classic / copper-edged / small clustering) via the saved `vr` field; **water-lily blooms open on mature pads** (distinct from lotus, feeds `Eco.bloom`); **reeds/cattails** (first vertical element, sway, koi steer around); **water iris** (accent bloom); **duckweed** (drifting micro-pads koi NIBBLE — a tiny ambient self-feeding trickle; regrows, never depletes); **submerged grass** (first BELOW-plane entity: darker, softer, under the koi; major shelter). All drawn ONCE against `ROLES()` — metal renders reeds as patinaed bronze with zero bespoke code (contract v2 paying off).
- **Hardscape:** river stone / boulder / slate (organic seeded forms), **driftwood**, and the **stone lantern (toro)** — all in the persisted `rocks[]`; **moss creeps over `grow`** (roles.moss; metal = oxidizing ore); koi steer around stone; **ripple rings foam at rock rims** (cheap arc highlight, not wave physics). Rocks **drag HEAVY** (~4× slower than flora, louder displacement ripple).
- **Tend tray:** release koi / **plant ▾** (8 flora chips) / **place ▾** (5 hardscape chips), serenity-priced placeholders (5–30 ❀; real curve in Phase D). **Placement is deliberate:** arm a chip, tap the water to put it exactly there — composition belongs to the player.
- **Koi card + graceful departure:** click a koi → quiet card (variety, life stage, lineage line); **click open water still feeds**. "let it swim on" with a gentle two-step confirm → the koi turns, gathers way to the pond's edge trailing its wake, one farewell ripple, gone. Written to `departed[]` — **the Almanac remembers**. **No serenity refund** (curation, not commerce). The ledger's release valve.
- **Dev lifecycle harness (`?dev=1`):** +1d/+7d/+30d warps that run the REAL `idleReturn()` path with the cap lifted (testing exercises production code, not a parallel fake), +200❀, mature-flora, age-koi. Invisible without the URL flag.

TRIED / VERIFIED (37/37 across both suites): Phase A gates re-run green against the pinned pre-v3 engine (real-v2 migration lossless, v2 key byte-identical); all 12 new entity types placed via the real placement path and rendered in **all four skins with zero warnings**; v3 round-trip preserves types/varieties/moss; departure removes the koi, records it, persists; caps refuse placement quietly; 30-day dev warp ages koi ~0.3 with moss grown. Parse-check clean.

OPEN: pacing riders land in Phase C (quick visitor thresholds) and Phase D (breeding ~7–10 kept days); copper-pad rim is suppressed under metal (patina owns the material story there) — flag for the director's eye; tray prices are placeholders.

FEELING TO CONFIRM (human's eyes): a tended pond should now read visibly LUSHER and more COMPOSED than a fresh one — side-by-side screenshot is the acceptance.

## 2026-07-02 — LIVING POND Phase A: foundations (BRIEF v1.1)
DECIDED: v0.x metal-pilot era closed (v0.6 flowing chrome PASSED). BRIEF v1.1 (THE LIVING POND ecosystem sprint) promoted as canonical; Phase A plan + capacity ledger proposed to the human and ratified (2026-07-02); built. Engine bumped to **koi v3.0 (living pond, phase A)**.

CHANGED (foundations — visible change is deliberately modest: koi grow while away, old fish wear elder fins; the rest is substrate):
- **Entity/skin contract v2:** every skin now carries `roles` palette tokens (foliage/foliageRim/stone/moss/wood/bloom/glow); `ROLES()` resolves active-skin roles with Natural fallback (rain inherits Natural by construction). New entities draw once against roles and read correctly in all four skins; bespoke handlers still win. Standing rule adopted: no entity ships unless correct in all four skins.
- **Save v3 + lossless migration:** new key `koipond_v3` (v flag, koi `parents` lineage, `rocks`, `frog`, `departed` Almanac memory, plant `vr` variety field, `eco.lastSeen`). v2 upgrader maps koi/plants/econ/unlocked verbatim; **the old `koipond_v2` key is left in place** (rollback safety); first migration stamps lastSeen=now (no retroactive windfall). Derived life is never saved.
- **Blended growth + life stages:** passive time growth (GROW_DAY=.01/day, live + idle) + faster fed growth (.02/s while eating — feeding stays the lever). Size stops at adult; age accrues to AGE_MAX 1.6 → stages fry/young/adult/**elder** derived from the one saved field. Elder = prestige: trailing fins flow out ~1.7× (smooth ramp), drift slows ~28%; never death.
- **Idle return sim:** on load, capped gift for elapsed time (≤3 days' worth: growth, plant grow/bloom, serenity trickle ≤60), then visitor rolls. 30-day absence = same gift as 3 (never an exploit).
- **Ecology scaffold (hidden):** `Eco.shelter/bloom/life/calm` as pure derivations + `rollVisitors()` hook; visitor list empty until Phase C plugs fauna into a working system.
- **Capacity ledger enforced quietly:** CAPS {koi 18, plants 36, rocks 12, school 20, fireflies 10}; tend buttons disable at cap, no error state. Departure (Phase B) is the release valve.

TRIED / VERIFIED (23/23, gate held): a **real v2 save captured from the actual pre-Phase-A engine** migrates losslessly (seeds/varieties/ages/positions/econ/unlocked verbatim; v2 key byte-identical after); 48h idle → capped gains; 30-day → 3-day cap; elder fin ramp + all four skins + codex render with zero warnings; node parse-check clean.

OPEN: ledger *feel* awaits the human's eyes on a full pond; per-skin day-cycle behavior (ink's eternal dusk?) proposed in Phase C; growth-rate tuning (§10 micro-loop) once elders exist in the wild.

## 2026-06-23 — metal skin: flowing chrome (liquid-metal motion) — human-directed, "v0.6"
DECIDED (human, live — not a Drive brief yet; **flag to the director to ratify as BRIEF_koi v0.6**): make the liquid-metal skin actually read *liquid* — flowing, reflective motion (mercury / liquid chrome), per the human's reference to liquid-metal animation effects. Chose the **"flowing chrome"** intensity (over full molten-mercury/T-1000), escalate only if it doesn't land. Built on top of v0.5's grade; metal-skin-only, all in `games/koi/`.

CHANGED (metal skin only):
- **Flowing reflection (the core liquid cue):** new `chromeRibbon()` helper draws bright COOL bands whose edges undulate and travel across the mirror — a reflected "horizon" glow plus 3 ribbons that scroll and wave like liquid mercury catching a moving environment. Deepened the substrate darks so the bright flows read with real contrast. Replaces the old flat rolling sheets.
- **Koi as flowing chrome:** the cool specular band now **slides along each koi's flank** over time (animated gradient-stop position) instead of sitting static — fish read as flowing metal, not painted.

KEPT / didn't regress: v0.5 dynamic range + temperature split (warm mids, cool speculars); muted verdigris pads; koi shape & pattern model untouched (tonal/motion only); per-frame canvas reset + try/catch; the arcade analytics hook + cabinet. Featherlight per guardrail — wavy filled paths + screen blend, **no `ctx.filter` contrast/brightness**, reduced-motion slows the flow.

TRIED / VERIFIED: node parse-check clean; headless smoke test drives all four skins + codex (exercises `chromeRibbon` + the traveling koi band) with zero render warnings.

OPEN / for screenshot review: does "flowing chrome" land, or escalate to full molten mercury (pooling/merging beads, low-res buffer)? Ribbon count/speed/brightness are the dials. Silver focal still needs a Platinum in the pond to show.

## 2026-06-23 — metal skin refinement: dynamic range + temperature split (BRIEF v0.5)
DECIDED: ran the v0.5 refinement on the liquid-metal skin (promoted to BRIEF.md). v0.4 fixed the *structure* (whole frame is one bronze material); v0.5 fixes the *finish* — it read muddy because it was nearly all warm mid-tones. Metal-skin-only, all in `games/koi/`. v0.4 direction kept (warm bodies, full-frame metal); these are deltas.

CHANGED (metal skin only):
- **Dynamic range pushed** from the grade (not a filter): deeper substrate darks (`#2a1d12→#120c07→#060403`), a deeper vignette, and genuinely bright blown speculars — so the surface reads wet/reflective, not matte varnish.
- **Temperature split** — the unlock: warm bronze **mids** kept (warm caustics), but the **speculars are now cool silver-blue** (`METAL_COOL`), as if the mirror reflects a dusk sky. Applied consistently to the water pool/sheets, the koi rim + moving hotspot + body band, the ripple crests, and the overlay sky-sheen. Cool-on-warm is the "real metal" cue.
- **Pads converted off green** — brass-when-young → **muted, oxidized verdigris** when mature (desaturated grey-green, not jade), interpolated over existing `grow`; pad specular toned down so foliage no longer out-shouts the water speculars (focal hierarchy fixed).
- **Koi separation** — bright cool rim/leading-edge + cool hotspot so koi sit ON the mirror; the **Platinum reads pure-white / brightest fish** (the cool focal point) among the warm koi.
- **Ripples** beaded brighter and cooler (`SKINS.metal.rip`) to register as a reflective surface.

KEPT / didn't regress: full-frame bronze substrate + warm koi palette (v0.4); koi shape & pattern model untouched (tonal/material only); per-frame canvas reset + try/catch; analytics hook (`play-counter.js`) and the arcade cabinet (`index.html`, `assets/cabinet.png`) untouched. No `ctx.filter` contrast/brightness in the draw loop — contrast comes from gradient stops/values per the guardrail.

TRIED / VERIFIED: node parse-check clean; headless smoke test drives all four skins + the codex with zero render warnings.

OPEN / for screenshot review: focal-hierarchy check (speculars → silver koi → warm-koi edges → pads); whether the cool highlights want to be cooler/stronger; the silver focal still needs a Platinum in the pond to be visible (default pond seeds none).

## 2026-06-23 — metal skin polish pass (BRIEF v0.4 pilot)
DECIDED: ran the first build pass on the **liquid-metal skin** under BRIEF_koi v0.4 (promoted to BRIEF.md). Two governing principles: a skin treats the WHOLE frame, and metal is a FINISH (specular behaviour), not a grey palette. Entirely within `games/koi/`; v0.1 blended-growth stays PARKED.

CHANGED (metal skin only — `SKINS.metal` + small shared hooks):
- Substrate: replaced the cold blue-grey field + rainbow hue-cycling caustics with **warm-tinted dark mercury** — a bright specular pool at the light source against deep darks (specular contrast), never teal/neutral.
- Light: caustics retuned to **mirror-warp** (slow warm molten ripples) + rolling specular sheets; rainbow hue cycling removed.
- Koi: now render each fish's **real Nishikigoi pattern cast in its organic metal** (reuses the existing pattern engine via a metal-recolored variety) — Kohaku reads copper-and-silver, Ogon molten brass, Benigoi copper-red, Showa dark bronze. Directional mirror gradient + a sliding specular hotspot + a sharp leading-edge highlight + strong scale shimmer. **Platinum reads cool silver-white** as the single focal accent among the warm metal.
- Pads: **brass-when-young → verdigris-when-mature**, interpolated over each plant's EXISTING `grow` state (no new growth system) — tending literally patinates the pond. Specular hotspot + dark mirror rim; the machined pinwheel-vein seam is dropped for metal. Lotus blooms gilded brass/gold.
- Ripples: `drawFX` made per-skin (`SKINS[skin].rip`); metal beads into **bright warm specular crests with deep troughs** ("mercury beading"). Default ripple look unchanged for the other skins.

KEPT / didn't regress: sparkle/glint + wake systems (read as specular on the mirror); the per-frame canvas-state reset + try/catch; koi shape and pattern model untouched (tonal/material pass only). `drawPad`/`drawLotus` gained an optional finish-options arg — other skins pass nothing and render identically.

TRIED / VERIFIED: node parse-check clean; headless smoke test drives all four skins (natural/metal/ink/rain) + the codex through several frames with **zero render warnings**.

OPEN / for screenshot review: the cool focal accent is mapped to the **Platinum** variety (its organic metal is silver). The default pond seeds no Platinum — release or unlock one to see the focal note. Asagi's blue net still reads faintly cool over bronze (low-alpha; candidate refine). Full per-patch verdict awaits the director's pixels.

## 2026-06-22 — promoted into the repo at games/koi/
DECIDED: koi promoted from its founding-chat MVP (`koi-pond.html`) into the monorepo at **`games/koi/`** (PROCESS_new-game-bootup step 4). Promotion is **move + wire-up, not redesign** — the MVP is finished and stable, copied in byte-for-byte (verified by checksum). Game file lives as `games/koi/koi-pond.html` (matches the studio's descriptive-filename convention, e.g. `firefly-jar.html`).

CHANGED (this session):
- Scaffolded `games/koi/` from `games/_template`.
- Promoted `BRIEF_koi v0.1` → `games/koi/BRIEF.md` (stable repo name; git holds history).
- Seeded `games/koi/CLAUDE.md` (game context, distilled from `HANDOFF_koi`) and `games/koi/DESIGN.md` (build state: 3-pass water, patch-based show-accurate koi + per-fish seed, plant float physics, 4 skins, in-game codex + serenity unlocks).
- Verified the inline `<script>` parse-checks clean in node after the move.

DECIDED (provisional arcade hosting — folded in from `NOTE_koi_provisional-arcade-hosting v1.0`, a deliberate interim decision recorded so "temporary" can't quietly become "permanent"):
- **Ship Koi Garden live now, provisionally, inside the existing What If Arcade harness** while long-term strategy is still being shaped. Rationale: a small, un-marketed audience is the cheapest experimentation window; a live pond teaches what koi *is*; the move is reversible (static site).
- **Split by pod ownership:** POD_KOI promotes the MVP into `games/koi/` and owns only that folder; **POD_ARCADE** adds the provisional storefront entry on `index.html` and owns the harness/deploy.
- **Host koi lightly — it keeps its own look.** No reskin to the dusk-arcade palette, no heavy chrome. The arcade is a *doorway*, not a verdict.
- **Recommended placement: soft / quiet** (an "experiments" / low-key entry), not a headline cabinet. Exact placement is a human-ratified keystone gate (§7).
- **Measure return & dwell, not plays.** Koi is not a game; game-shaped metrics would mislead.

SEQUENCING: hard dependency — **POD_ARCADE is BLOCKED until `games/koi/` lands.** Order is promote-then-harness.

TRIPWIRE: set a deliberate revisit point for the permanent brand/home decision (a date or a threshold, e.g. "once N visitors have returned to the pond more than once"). Until then the interim home rides; at the tripwire the human re-opens the Tier-0 questions rather than letting the default calcify.

PARKED: blended growth curve (first BRIEF v0.1 build pass — next up); legible tending; unlock-economy tuning; creative mode; new skins/varieties.

OPEN (Tier-0 — human's call): brand architecture (sibling brand vs inside What If Arcade); visual brand (does the dusk-arcade palette apply); monetization (first cosmetic-only product?); name / shelf identity for the second-shelf concept. Plus growth/serenity tuning numbers.

## 2026-06-22 — pod founded; water + koi passes; in-game codex
DECIDED: koi becomes its own game with its own pod (POD_KOI); director seated. HANDOFF_koi + first BRIEF_koi (v0.1) written. Per-fish seeded patterns are saved, so individual koi persist exactly.

CHANGED (build, this founding run):
- Water: three layered passes shipped — drifting caustics + breathing shimmer + wandering sunbeam + koi wake-trails; refractive ripple trains (crest + trough) + sun-glint sparkles on the crests; glassy sky-sheen + Fresnel rim + cool depth. Kept featherlight (one soft sprite, capped counts, 40fps, pause-when-hidden).
- Koi: rebuilt to show-accurate Nishikigoi — patch model with sashi (soft front) / kiwa (sharp back) edges, per-variety placement, net + scale-shimmer texture; sleeker body silhouette; eight varieties incl. new Benigoi.
- Koi color: per-patch warmth/brightness tone + scattered multi-patch hi, so white-bodied koi carry many varied reds (matching the reference photo) instead of flat blocks.
- Plants: buoyant float added (idle bob, slow rotation, riding passing waves) on top of the existing watery click-drag.
- Codex: brought IN-GAME as a hideable side panel (first pond-management nav node), rendering every variety live with serenity-priced unlocks; unlocked koi join the release pool. Doubles as QA.

TRIED / FIXED: canvas state-leak between skins (hard reset + guard per frame); ink/metal crash on lotus (non-finite gradient radius); ink lotus retoned to skin palette; expensive ink shadowBlur swapped for a cheap stroke halo.

PARKED: blended growth curve (recommended; queued as BRIEF v0.1 scope); creative mode; new skins/varieties; cabinet/storefront placement (waits on the brand decision).

OPEN (Tier-0 — human's call): brand architecture (sibling brand vs inside What If Arcade); visual brand (does the dusk-arcade palette apply); monetization (first cosmetic-only product?). Plus growth/serenity tuning numbers.

FEELING: it crossed from "tech demo" into "a place" — the water reads as liquid, the koi read as individuals. The work now is the loop, not the look.
