# services/saves — THE WIRE
Cloud save slots for the arcade (IRONLINE first). Contract: `CONTRACT.md` (read it first — the
game depends on the shape, not this host). Code: `worker.js`. Local proof: `worker.test.cjs`
(`node worker.test.cjs` — runs the real handler against a mock KV, no network).

## Deploying (the human's clicks — one time)
1. Cloudflare dashboard → **Storage & Databases → KV → Create namespace** → name it `wia-saves`. Copy its **ID**.
2. Edit `wrangler.toml` here (GitHub web editor is fine): replace `PASTE_KV_NAMESPACE_ID_HERE` with that ID. Commit.
3. Dashboard → **Workers & Pages → Create → Workers → Import a repository** → pick this repo,
   set **root directory** to `services/saves`. Deploy.
4. Copy the live URL (`https://wia-saves.<account>.workers.dev`) and hand it back to the builder —
   the game's `SAVES_URL` constant gets set to it, and the wire goes live.

After this, every push to the repo that touches `services/saves/` auto-redeploys. No API tokens,
no GitHub secrets.

## Verifying
```
curl https://wia-saves.<account>.workers.dev/v1/health
# {"ok":true,"svc":"wia-saves","v":1}
```

## Law
The game must play identically with this service down (CLAUDE.md §3.3 — the wish console is the
model). If a change here would force the game to care, the change is wrong.
