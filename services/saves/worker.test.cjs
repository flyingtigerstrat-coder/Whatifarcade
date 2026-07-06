/* THE WIRE — contract proof. Runs the REAL worker handler against a mock KV.
   Run: node worker.test.cjs  (no deps, no network) */
(async () => {
  const { default: worker } = await import('./worker.js');
  const store = new Map();
  const env = { SAVES: {
    get: async k => (store.has(k) ? store.get(k) : null),
    put: async (k, v) => { store.set(k, v) },
    delete: async k => { store.delete(k) },
  }};
  const call = (method, path, body, origin) => worker.fetch(
    new Request('https://ironlinesaves.test.workers.dev' + path, {
      method, body, headers: origin ? { origin, 'content-type': 'application/json' } : { 'content-type': 'application/json' },
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

  // ===== THE LEDGER — claim + login =====
  const RK1 = 'RIG-AAAAA-BBBBB-CCCCC-DDDDD', RK2 = 'RIG-ZZZZZ-YYYYY-XXXXX-WWWWW';
  const claim = (name, password, rigKey) => call('POST', '/v1/claim', JSON.stringify({ name, password, rigKey }));
  const login = (name, password) => call('POST', '/v1/login', JSON.stringify({ name, password }));

  r = await claim('Bob', 'hunter2', RK1);
  ok('claim: a fresh name lands', r.status === 200 && (await r.json()).ok === true);

  r = await claim('bob', 'whatever', RK2);
  ok('claim: canonicalized collision refused (Bob === bob === BOB)', r.status === 409);

  r = await claim('x', 'pw', RK2);
  ok('claim: name too short refused', r.status === 400);

  r = await claim('Perfectly Fine Name', '', RK2);
  ok('claim: empty password refused', r.status === 400);

  r = await claim('Someone Else', 'pw', 'not-a-rig-key');
  ok('claim: malformed rig key refused', r.status === 400);

  const t0 = Date.now();
  r = await login('Bob', 'hunter2');
  const hashMs = Date.now() - t0;
  const gotLogin = await r.json();
  ok('login: right name + password returns the rig key', r.status === 200 && gotLogin.rigKey === RK1);
  ok('login: PBKDF2 stays comfortably inside a Worker CPU budget (<500ms here)', hashMs < 500);

  r = await login('BOB', 'hunter2');
  ok('login: canonicalization matches on login too', r.status === 200);

  r = await login('Bob', 'wrongpassword');
  ok('login: wrong password refused (401)', r.status === 401);

  r = await login('Nobody Here', 'hunter2');
  ok('login: unknown name gets the SAME error as wrong password (no enumeration)', r.status === 401);

  { let last; for (let i = 0; i < 6; i++) last = await login('Bob', 'wrongpassword');
    ok('login: repeated failures trip the throttle (429)', last.status === 429) }

  r = await login('Bob', 'hunter2');
  ok('login: the throttle also blocks the RIGHT password until it cools', r.status === 429);

  console.log(fails ? '\n' + fails + ' FAILURES' : '\nTHE WIRE HOLDS (contract v1 + THE LEDGER)');
  process.exit(fails ? 1 : 0);
})();
