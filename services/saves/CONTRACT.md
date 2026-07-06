# services/saves — THE WIRE · endpoint contract v1 (+ THE LEDGER, v1 addendum)
**Status: ratified 2026-07-04 (human greenlight: "go, workers.dev URL, KV"). THE LEDGER (naming layer)
ratified 2026-07-06 (human: "Bob's train" — a memorable name+password over the raw rig key).**
**Contract-first per `[repo] CLAUDE.md` §3.4 — the game depends on THIS SHAPE, never on the host.**

## What it is
A tiny cloud save-slot service. One save blob per **rig key**. No accounts, no PII, no sessions —
the key IS the claim ticket (possession = ownership, like a coat-check token). Studio-wide by design:
any future cabinet can use the same service with its own `game` field.

## The rig key
- Format: `RIG-XXXXX-XXXXX-XXXXX-XXXXX` where `X` ∈ Crockford-ish base32 `A-Z2-7` (20 chars = 100 bits).
- Minted client-side with `crypto.getRandomValues`. Never enumerable, never guessable.
- Rides inside the save blob AND inside THE MANIFEST export, so restoring a manifest on a new
  device re-links the same cloud slot automatically.

## Endpoints
Base URL: the deployed worker (v1: `https://<name>.<account>.workers.dev`; later maybe `api.whatifarcade.com` — the game holds it as one constant).

### `GET /v1/health`
- `200 {"ok":true,"svc":"wia-saves","v":1}` — the connect test.

### `GET /v1/save/:rigKey`
- `200` + the exact JSON blob last stored (opaque to the service).
- `404 {"err":"no save"}` — unknown key (a fresh rig, not an error state).
- `400 {"err":"bad key"}` — key fails the format regex.

### `PUT /v1/save/:rigKey`
- Body: the save JSON. **Hard cap 32 KiB** (today's saves ≈ 2 KB; 413 above the cap).
- Body must parse as JSON and carry a numeric `seq` (the game's monotonic save counter).
- **Stale writes are refused**: if the stored blob's `seq` is greater than the incoming `seq`,
  respond `409 {"err":"stale","seq":<stored>}` — last-writer-wins is decided by seq, not clock.
- **Throttle without extra storage**: each stored blob carries a server `_ts`; a PUT for the same
  key within 2 seconds of the last accepted write gets `429 {"err":"breathe"}`.
- `200 {"ok":true,"seq":<stored>}` on accept.

## THE LEDGER — naming layer (addendum, additive over the rig key)
A memorable **name** the wire ever reveals to the player. **The rig key stays the real vault key
underneath, unchanged** — a claimed name is just a lookup that resolves to one. Nothing above this
section changes.

### `POST /v1/claim`
- Body: `{name, password, rigKey}` — "give my CURRENT rig this name."
- `name`: 2–24 chars after trim; canonicalized (trim + lowercase + collapse whitespace) as the
  lookup key, so `Bob` / `BOB` / `bob` are the same claim. The original casing is kept for display.
- `password`: 1–100 chars. **No complexity rule — loose by design (human call).**
- `rigKey` must match the rig-key format above. It is NOT required to already have a save.
- `409 {"err":"taken"}` if the canonical name is already claimed.
- `400 {"err":"bad name"}` / `{"err":"bad password"}` / `{"err":"bad key"}` on validation failure.
- `200 {"ok":true}` on success. Stored: `{name, rigKey, salt, hash, iter}` under `claim:<canonical>`
  — password hashed with PBKDF2-SHA256 (WebCrypto, native to both Workers and Node), never stored
  plain. Iteration count kept conservative on purpose, mindful of a Worker's per-request CPU budget
  — this is a save-slot latch, not a bank vault; revisit upward if ever moved to a paid Workers plan.
- **v1 simplification, stated plainly:** claiming again for an ALREADY-named rig is not exposed by
  the game client (the UI only offers "Name this rig" while unnamed) and the endpoint does not
  block it server-side either — a rename/reclaim flow that requires the OLD password is a natural
  future addition, not built this pass.

### `POST /v1/login`
- Body: `{name, password}` — "find my rig by name, hand back its key."
- Same canonicalization as claim. On match: `200 {"ok":true,"rigKey":"RIG-..."}` — the client then
  reuses the existing `GET /v1/save/:rigKey` to pull the actual record (no new save-shape endpoint).
- Unknown name AND wrong password return the **same** `401 {"err":"invalid"}` — deliberately not
  distinguishing them, so a login attempt can't be used to probe which names exist.
- **Throttled, because human-chosen name+password is guessable in a way the 100-bit rig key never
  was:** a per-canonical-name failure counter (`fail:<canonical>`, 15-minute TTL) trips `429
  {"err":"breathe"}` after 6 failed attempts, checked BEFORE the password is even verified. A
  success clears the counter.
- **No password recovery.** No email, no PII, by design (§ above). If a player forgets their
  password and never punched a manifest, that name is unrecoverable — same as any password-only
  system with no recovery channel. THE MANIFEST is the honest answer to "I forgot" as much as it
  is to "my browser died."

## CORS
- Allowed origins: `https://whatifarcade.com`, `https://www.whatifarcade.com`, plus `http://localhost:*` and `null` for development.
- Methods `GET, PUT, POST, OPTIONS`; header `content-type`. Preflight answered with `204` + 24h max-age.

## Storage
- Workers **KV**, binding `SAVES`, key = the rig key string, value = the blob (with server `_ts` added).
- KV is last-write-wins and eventually consistent — acceptable for a single-player save slot;
  the `seq` guard covers the realistic conflict (two devices, one player).

## Failure law (§3.3)
The game NEVER depends on this service. Endpoint down / blocked / slow → the game plays exactly as
today (localStorage + THE MANIFEST). Cloud sync is fire-and-forget on write, best-effort-with-timeout
on boot read. No error surfaces louder than one log line.

## Abuse posture (v1, documented honestly)
Key entropy (100 bits) + size cap + per-key 2s write throttle + seq monotonicity. No per-IP rate
limiting yet — add when real traffic justifies it (Cloudflare zone tools or a Durable Object counter).

## Versioning
Breaking changes bump the path (`/v2/...`). The blob's internal schema is the GAME's business
(`SAVE_V` + migrate chain); the service never inspects it beyond `seq`.
