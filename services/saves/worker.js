/* services/saves — THE WIRE (v1)
   One save blob per rig key, Workers KV, no accounts. The full shape lives in CONTRACT.md;
   if this file and the contract disagree, the contract wins and this file is wrong. */

const KEY_RE = /^RIG-[A-Z2-7]{5}-[A-Z2-7]{5}-[A-Z2-7]{5}-[A-Z2-7]{5}$/;
const MAX_BYTES = 32 * 1024;          // saves are ~2 KB today — 413 anything bloated
const WRITE_GAP_MS = 2000;            // per-key breathing room, enforced from the stored blob's _ts

const ORIGIN_OK = o =>
  o === 'https://whatifarcade.com' || o === 'https://www.whatifarcade.com' ||
  o === 'null' || (o && o.startsWith('http://localhost'));

function cors(origin) {
  return {
    'access-control-allow-origin': ORIGIN_OK(origin) ? origin : 'https://whatifarcade.com',
    'access-control-allow-methods': 'GET, PUT, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    'content-type': 'application/json',
  };
}
const J = (status, obj, h) => new Response(JSON.stringify(obj), { status, headers: h });

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const h = cors(req.headers.get('origin'));

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
    if (url.pathname === '/v1/health') return J(200, { ok: true, svc: 'ironlinesaves', v: 1 }, h);

    const m = url.pathname.match(/^\/v1\/save\/([^/]+)$/);
    if (!m) return J(404, { err: 'no such rail' }, h);
    const key = m[1];
    if (!KEY_RE.test(key)) return J(400, { err: 'bad key' }, h);

    if (req.method === 'GET') {
      const cur = await env.SAVES.get(key);
      return cur === null ? J(404, { err: 'no save' }, h) : new Response(cur, { status: 200, headers: h });
    }

    if (req.method === 'PUT') {
      const body = await req.text();
      if (body.length > MAX_BYTES) return J(413, { err: 'too heavy' }, h);
      let d; try { d = JSON.parse(body) } catch (e) { return J(400, { err: 'not json' }, h) }
      if (typeof d.seq !== 'number') return J(400, { err: 'no seq' }, h);

      const curRaw = await env.SAVES.get(key);
      if (curRaw !== null) {
        let cur; try { cur = JSON.parse(curRaw) } catch (e) { cur = null }
        if (cur && typeof cur.seq === 'number' && cur.seq > d.seq) return J(409, { err: 'stale', seq: cur.seq }, h);
        if (cur && cur._ts && Date.now() - cur._ts < WRITE_GAP_MS) return J(429, { err: 'breathe' }, h);
      }
      d._ts = Date.now();
      await env.SAVES.put(key, JSON.stringify(d));
      return J(200, { ok: true, seq: d.seq }, h);
    }

    return J(405, { err: 'method' }, h);
  },
};
