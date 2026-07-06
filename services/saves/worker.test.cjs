/* THE WIRE — contract proof. Runs the REAL worker handler against a mock KV.
   Run: node worker.test.cjs  (no deps, no network) */
(async () => {
  const { default: worker } = await import('./worker.js');
  const store = new Map();
  const env = { SAVES: {
    get: async k => (store.has(k) ? store.get(k) : null),
    put: async (k, v) => { store.set(k, v) },
  }};
  const call = (method, path, body, origin) => worker.fetch(
    new Request('https://ironlinesaves.test.workers.dev' + path, {
      method, body, headers: origin ? { origin } : {},
    }), env);

  let fails = 0;
  const ok = (name, cond) => { console.log((cond ? 'PASS' : 'FAIL') + '  ' + name); if (!cond) fails++ };
  const KEY = 'RIG-ABCDE-FGH23-JKLMN-PQRST';

  let r = await call('GET', '/v1/health');
  ok('health answers', r.status === 200 && (await r.json()).svc === 'ironlinesaves');

  r = await call('GET', '/v1/save/not-a-key');
  ok('bad key refused', r.status === 400);

  r = await call('GET', '/v1/save/' + KEY);
  ok('fresh rig: 404, not an error', r.status === 404);

  r = await call('PUT', '/v1/save/' + KEY, JSON.stringify({ v: 8, seq: 3, scrap: 100 }));
  ok('first write lands', r.status === 200 && (await r.json()).seq === 3);

  r = await call('GET', '/v1/save/' + KEY);
  const got = await r.json();
  ok('read-back returns the blob', r.status === 200 && got.seq === 3 && got.scrap === 100);

  r = await call('PUT', '/v1/save/' + KEY, JSON.stringify({ v: 8, seq: 2 }));
  ok('stale seq refused (409)', r.status === 409);

  r = await call('PUT', '/v1/save/' + KEY, JSON.stringify({ v: 8, seq: 4 }));
  ok('too-fast rewrite told to breathe (429)', r.status === 429);

  // age the stored blob past the write gap, then the newer seq lands
  { const cur = JSON.parse(store.get(KEY)); cur._ts = Date.now() - 3000; store.set(KEY, JSON.stringify(cur)) }
  r = await call('PUT', '/v1/save/' + KEY, JSON.stringify({ v: 8, seq: 4 }));
  ok('after the gap, newer seq lands', r.status === 200);

  r = await call('PUT', '/v1/save/' + KEY, 'x'.repeat(33 * 1024));
  ok('oversize blob refused (413)', r.status === 413);

  r = await call('PUT', '/v1/save/' + KEY, '{not json');
  ok('non-JSON refused', r.status === 400);

  r = await call('OPTIONS', '/v1/save/' + KEY, null, 'https://whatifarcade.com');
  ok('preflight 204 + origin echoed', r.status === 204 && r.headers.get('access-control-allow-origin') === 'https://whatifarcade.com');

  r = await call('GET', '/v1/health', null, 'https://evil.example');
  ok('unknown origin gets the house origin, not an echo', r.headers.get('access-control-allow-origin') === 'https://whatifarcade.com');

  console.log(fails ? '\n' + fails + ' FAILURES' : '\nTHE WIRE HOLDS (contract v1)');
  process.exit(fails ? 1 : 0);
})();
