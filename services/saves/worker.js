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
    'access-control-allow-methods': 'GET, PUT, POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    'content-type': 'application/json',
  };
}
const J = (status, obj, h) => new Response(JSON.stringify(obj), { status, headers: h });

/* ---- THE LEDGER: name+password over the same rig key (see CONTRACT.md) ---- */
const NAME_MIN = 2, NAME_MAX = 24, PASS_MIN = 1, PASS_MAX = 100;
const PBKDF2_ITER = 50000; // conservative for a Worker's CPU budget — a save-slot latch, not a vault
const LOGIN_FAIL_MAX = 6, LOGIN_FAIL_TTL = 900; // 15 min

const canon = s => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
const validName = n => { const c = canon(n); return c.length >= NAME_MIN && c.length <= NAME_MAX };
const validPass = p => typeof p === 'string' && p.length >= PASS_MIN && p.length <= PASS_MAX;

const b64 = bytes => { let s = ''; for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]); return btoa(s) };
const unb64 = str => { const s = atob(str), b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i); return b };
const textEnc = new TextEncoder();
async function hashPassword(password, saltBytes) {
  const km = await crypto.subtle.importKey('raw', textEnc.encode(password), { name: 'PBKDF2' }, false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: saltBytes, iterations: PBKDF2_ITER, hash: 'SHA-256' }, km, 256);
  return new Uint8Array(bits);
}
function bytesEqual(a, b) { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i]; return d === 0 }

async function readJson(req) {
  const text = await req.text();
  if (text.length > MAX_BYTES) { const e = new Error('too heavy'); e.status = 413; e.body = { err: 'too heavy' }; throw e }
  try { return JSON.parse(text) } catch (e) { const er = new Error('not json'); er.status = 400; er.body = { err: 'not json' }; throw er }
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const h = cors(req.headers.get('origin'));

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
    if (url.pathname === '/v1/health') return J(200, { ok: true, svc: 'ironlinesaves', v: 1 }, h);

    if (url.pathname === '/v1/claim' && req.method === 'POST') {
      let body; try { body = await readJson(req) } catch (e) { return J(e.status, e.body, h) }
      const { name, password, rigKey } = body || {};
      if (!validName(name)) return J(400, { err: 'bad name' }, h);
      if (!validPass(password)) return J(400, { err: 'bad password' }, h);
      if (typeof rigKey !== 'string' || !KEY_RE.test(rigKey)) return J(400, { err: 'bad key' }, h);
      const ck = 'claim:' + canon(name);
      if ((await env.SAVES.get(ck)) !== null) return J(409, { err: 'taken' }, h);
      const salt = new Uint8Array(16); crypto.getRandomValues(salt);
      const hash = await hashPassword(password, salt);
      await env.SAVES.put(ck, JSON.stringify({ name: String(name).trim(), rigKey, salt: b64(salt), hash: b64(hash), iter: PBKDF2_ITER }));
      return J(200, { ok: true }, h);
    }

    if (url.pathname === '/v1/login' && req.method === 'POST') {
      let body; try { body = await readJson(req) } catch (e) { return J(e.status, e.body, h) }
      const { name, password } = body || {};
      if (!validName(name) || !validPass(password)) return J(400, { err: 'bad request' }, h);
      const c = canon(name), fk = 'fail:' + c;
      const failsRaw = await env.SAVES.get(fk);
      const fails = failsRaw ? (parseInt(failsRaw, 10) || 0) : 0;
      if (fails >= LOGIN_FAIL_MAX) return J(429, { err: 'breathe' }, h);
      const markFail = () => env.SAVES.put(fk, String(fails + 1), { expirationTtl: LOGIN_FAIL_TTL });
      const rec = await env.SAVES.get('claim:' + c);
      if (rec === null) { await markFail(); return J(401, { err: 'invalid' }, h) }
      let claim; try { claim = JSON.parse(rec) } catch (e) { await markFail(); return J(401, { err: 'invalid' }, h) }
      const hash = await hashPassword(password, unb64(claim.salt));
      if (!bytesEqual(hash, unb64(claim.hash))) { await markFail(); return J(401, { err: 'invalid' }, h) }
      if (fails > 0) await env.SAVES.delete(fk);
      return J(200, { ok: true, rigKey: claim.rigKey }, h);
    }

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
