/* IRONLINE headless behavioral QA — boots the REAL game script, drives tick() manually, asserts
   the stop choreography and the save schema. Extend per wave (BRIEF v1.2 rule 1).
   Run: node ironline-qa.cjs   (reads battle-train-hd.html from beside it) */
const fs=require('fs');
const anyEl=()=>new Proxy(function(){},{get:(t,p)=>{if(p===Symbol.toPrimitive)return()=>0;return anyElCache},set:()=>true,apply:()=>anyElCache});
let anyElCache;anyElCache=anyEl();
let _store=null;                                  // in-memory storage backing (settable by tests)
global.__setStore=v=>{_store=v};global.__getStore=()=>_store;
global.window={storage:{get:async()=>_store?{value:_store}:null,set:async(k,v)=>{_store=v;return{ok:1}},delete:async()=>{_store=null;return{ok:1}}},addEventListener(){},matchMedia:()=>({matches:false,addEventListener(){}}),innerWidth:400,innerHeight:800};
global.document={getElementById:()=>anyElCache,querySelector:()=>anyElCache,querySelectorAll:()=>[],addEventListener(){},documentElement:anyElCache,fullscreenElement:null};
global.Image=class{set src(v){}};
global.requestAnimationFrame=()=>{};
const script=fs.readFileSync(__dirname+'/battle-train-hd.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1]
 +'\n;globalThis.__T={S,tick,stopArrive,stopDepart,save,load,migrate,STATION_HOME,REGIONS,navRows,nodeType,nodeEdges,nodeName,navVK,eff,finish,bossKill,navArrive,GOODS,GKEYS,GMKT,gPrice,cargoCap,seats,mkBoard,stationPers};';
eval(script);
(async()=>{
await new Promise(r=>setTimeout(r,20)); // let the async boot IIFE settle
const {S,tick,stopArrive,stopDepart,save,load,migrate,STATION_HOME,REGIONS,navRows,nodeType,nodeEdges,nodeName,navVK,eff,finish,bossKill,navArrive,GOODS,GKEYS,GMKT,gPrice,cargoCap,seats,mkBoard,stationPers}=globalThis.__T;
let t=0,fails=0;const step=n=>{for(let i=0;i<n;i++){t+=16;tick(t)}};
const ok=(name,cond)=>{console.log((cond?'PASS':'FAIL')+'  '+name);if(!cond)fails++};

// ===== THE STOP (choreography) =====
// 1 · fresh boot = begin-at-origin, docked, world at rest, no smoke
ok('boot: origin docked', S.origin===true&&S.stop&&S.stop.ph==='docked');
const off0=S.off;step(120);
ok('docked: world frozen (off unchanged over 2s)', Math.abs(S.off-off0)<1e-9);
ok('docked: no smoke at rest', S.smoke.length===0);
ok('docked: lamps lit', S.lampK===1);

// 2 · departure: spin-up, station slides west & clears, steady cruise
S.fuel=99;S.mode='run';S.jt=0;S.dur=9999;S.waves=[9999];S.wi=0;S.boss=null;S.ptrain=null;S.ptrainAt=-1;S.crateAt=-1;
stopDepart();step(500); // 8s
ok('depart: world rolling', S.off>300);
ok('depart: station cleared west + origin released', S.origin===false&&S.stop===null);
const offA=S.off;step(60);
ok('depart: steady cruise ~110/s', Math.abs((S.off-offA)-110*0.016*60)<8);

// 3 · ARRIVAL (vis): decel to rest, station lands exactly at HOME, lamps flicker up
S.mode='idle';S.smoke=[];stopArrive(true);
ok('arrive: station staged off-right', S.stationX>310);
step(80);const offMid=S.off;step(10);
ok('arrive: still decelerating (world moving)', S.off>offMid);
step(320); // past T=5.8s
ok('arrive: docked at rest', S.stop&&S.stop.ph==='docked');
ok('arrive: station landed at HOME', Math.abs(S.stationX-STATION_HOME)<0.75);
ok('arrive: lamps up', S.lampK===1);
const offR=S.off;step(60);ok('arrive: world at rest', Math.abs(S.off-offR)<1e-9);
step(200);ok('rest: smoke fully thinned', S.smoke.length===0);

// 4 · depot stop (no visual): gentle halt, gentle resume
S.origin=false;S.stop=null;S.stationX=null;S.mode='idle';
stopArrive(false);step(150);
ok('depot: halted', S.stop&&S.stop.ph==='docked');
const offD=S.off;step(60);ok('depot: world frozen', Math.abs(S.off-offD)<1e-9);
stopDepart();step(150);
ok('depot leave: choreography released', S.stop===null);
const offE=S.off;step(60);
ok('depot leave: idle drift ~14/s resumes', Math.abs((S.off-offE)-14*0.016*60)<3);

// 5 · save discipline: saved-while-docked-at-origin round-trips
S.origin=true;S.stationX=STATION_HOME;S.stop={ph:'docked',t:0,vis:true};S.lampK=1;
await save();
S.origin=false;S.stop=null;S.stationX=null;
const loaded=await load();
ok('save/load: docked origin round-trips', loaded&&S.origin===true&&S.stop&&S.stop.ph==='docked'&&S.stationX===STATION_HOME);
// and a mid-journey save must NOT re-dock
S.origin=false;S.stop=null;S.mode='idle';await save();S.origin=true;S.stop={ph:'docked',t:0,vis:true};
await load();
ok('save/load: mid-journey save does not re-dock', S.origin===false&&!S.stop);

// ===== SAVE SCHEMA v2 + migrate() (Wave 0) =====
// 6 · a v1 (unversioned, live-shipped shape) save loads, migrates, and re-saves as v2
__setStore(JSON.stringify({scrap:500,food:9,journeys:7,engine:3,caboose:1,maxSlots:4,
 slots:[{type:'gun',lvl:2},{type:'farm',lvl:1}],hull:50,dist:140,discount:false}));
const l1=await load();
ok('v1 save: loads via migrate', l1===true&&S.scrap===500&&S.journeys===7);
ok('v1 save: missing fuel gets default', S.fuel===30);
ok('v1 save: gun slot normalized (wpn/port)', S.slots[0].wpn==='cannon'&&S.slots[0].port==='auto');
ok('v1 save: no origin flag -> not docked', S.origin===false&&!S.stop);
await save();
ok('v1 save: re-saves stamped current ('+JSON.parse(__getStore()).v+')', JSON.parse(__getStore()).v===4);
ok('v1 save: 7 crossings land the veteran in region 1', S.nav.reg===1&&S.nav.col===0);

// 7 · v2 round-trip preserves the rig
S.scrap=321;S.engine=5;await save();S.scrap=0;S.engine=1;
await load();
ok('v2 save: round-trips', S.scrap===321&&S.engine===5);

// 8 · garbage blob: never crashes, falls back to fresh-boot path
__setStore('{{{not json');
ok('garbage save: load returns false, no crash', (await load())===false);

// 9 · future-version blob: fields load defensively, the rig is NEVER wiped
__setStore(JSON.stringify({v:99,scrap:777,food:5,fuel:12,journeys:20,engine:9,caboose:2,maxSlots:5,
 slots:[{type:'oil',lvl:3}],hull:80,dist:900}));
const l9=await load();
ok('future-version save: known fields load, rig preserved', l9===true&&S.scrap===777&&S.engine===9);
ok('future-version save: migrate passes it through untouched', migrate({v:99,x:1}).v===99);
ok('future-version save: missing nav defaults defensively', S.nav&&S.nav.reg===0&&S.nav.seed===1);

// ===== THE SPINE: node graph + region difficulty (Wave 1) =====
// 10 · the graph is seeded, deterministic, and shaped right
S.nav={seed:7,reg:0,col:0,row:0};S.visited=['0:0:0'];S.sel=0;S.navT=null;
ok('spine: the origin node is THE RAILHEAD', nodeName(0,0,0)==='THE RAILHEAD');
ok('spine: 4 regions, Seam runs 7 columns', REGIONS.length===4&&REGIONS[3].cols===7);
ok('spine: nodeType is deterministic', nodeType(1,3,1)===nodeType(1,3,1)&&['S','E','H','B'].includes(nodeType(1,3,1)));
let edgesOK=true;
for(let rg=0;rg<REGIONS.length;rg++)for(let c=0;c<REGIONS[rg].cols-1;c++)for(let rw=0;rw<navRows(rg,c);rw++){const E=nodeEdges(rg,c,rw);if(E.length<1||E.length>2)edgesOK=false;for(const e of E)if(e.reg!==rg||e.col!==c+1||e.row<0||e.row>=navRows(rg,c+1))edgesOK=false}
ok('spine: every non-gate node has 1-2 valid forward edges', edgesOK);
const g0=nodeEdges(0,REGIONS[0].cols-1,0);
ok('spine: a gate opens the next region’s entry', g0.length===1&&g0[0].reg===1&&g0[0].col===0&&g0[0].row===0);
ok('spine: the Terminus gate ends the line', nodeEdges(3,REGIONS[3].cols-1,0).length===0);
// 11 · position drives threat (BRIEF v1.2 rule 6)
S.nav={seed:7,reg:2,col:4,row:0};
ok('spine: eff() = reg*6 + col', eff()===16);
// 12 · a completed leg moves the rig on the map and the node speaks
S.nav={seed:7,reg:0,col:0,row:0};S.visited=['0:0:0'];S.sel=0;S.mode='run';S.journeys=0;S.origin=false;S.stop=null;S.stationX=null;S.depot=null;
S.navT={to:{reg:0,col:1,row:0},regChange:false};
finish();
ok('leg: arrival moves nav + logs the visit', S.nav.col===1&&S.nav.row===0&&S.visited.includes('0:1:0')&&S.journeys===1&&S.navT===null);
const t1=nodeType(0,1,0);
ok('leg: the node greets by type ('+t1+')', t1==='S'?(S.mode==='depot'&&!!S.depot):(!!S.stop&&S.stop.auto===true));
// 13 · v2->v3 migration places the veteran on the graph (one region per 5 crossings)
const m12=migrate({v:2,journeys:12,dist:140,scrap:500,origin:1});
ok('v2->v3: 12 crossings -> region 2 entry, Railhead dock released', m12.v===4&&m12.nav.reg===2&&m12.nav.col===0&&!m12.origin&&m12.visited.length===1);
const m3=migrate({v:2,journeys:3,dist:20,scrap:100,origin:1});
ok('v2->v3: 3 crossings -> region 0, origin dock kept', m3.v===4&&m3.nav.reg===0&&m3.origin===1);
// 14 · v3+ round-trips the map
S.nav={seed:41,reg:1,col:2,row:1};S.visited=['1:0:0','1:1:0','1:2:1'];S.origin=false;S.stop=null;S.stationX=null;S.mode='idle';S.depot=null;
await save();
S.nav={seed:1,reg:0,col:0,row:0};S.visited=['0:0:0'];
await load();
ok('v3 save: nav + visited round-trip', S.nav.seed===41&&S.nav.reg===1&&S.nav.col===2&&S.nav.row===1&&S.visited.length===3);

// ===== THE ECONOMY: goods, cars, fares, contracts (Wave 2) =====
// 15 · v3 -> v4 migration gives a clean ledger
const m4=migrate({v:3,journeys:2,nav:{seed:5,reg:0,col:1,row:0},visited:['0:0:0'],scrap:100});
ok('v3->v4: empty holds, seats, ledger', m4.v===4&&typeof m4.cargo==='object'&&Array.isArray(m4.pax)&&Array.isArray(m4.contracts));
// 16 · the regional spread is real: what the Flats sell cheap, the Seam pays dear for
S.nav={seed:7,reg:0,col:1,row:0};const pOre0=gPrice('ore');
S.nav={seed:7,reg:3,col:1,row:0};const pOre3=gPrice('ore');
ok('market: ore cheap in the Flats, dear in the Seam ('+pOre0+' < '+pOre3+')', pOre0<pOre3&&pOre0>=2);
ok('market: prices deterministic per node', gPrice('relic')===gPrice('relic'));
// 17 · capacity math
S.slots=[{type:'cargo',lvl:2},{type:'pass',lvl:1},null];S.slots.forEach(s=>{if(s)s.crew=null});
ok('cars: cargo lvl2 = 6 holds, coach lvl1 = 2 seats', cargoCap()===6&&seats()===2);
// 18 · station personalities: 2 distinct, the Railhead teaches the trade
const ps=stationPers(1,2,0);
ok('stations: 2 distinct personalities', ps.length===2&&ps[0]!==ps[1]);
ok('stations: the Railhead is YARD + MARKET', stationPers(0,0,0).join(',')==='yard,market');
// 19 · the Dispatcher board: 2 contracts, valid shapes, pay above spot
S.nav={seed:7,reg:0,col:1,row:0};const bd=mkBoard();
ok('board: 2 contracts, valid kinds', bd.length===2&&bd.every(c=>c.k==='haul'?(GKEYS.includes(c.g)&&c.n>=2&&c.pay>0):(c.k==='escort'&&c.legs>=2&&c.pay>0)));
// 20 · an escort pays out on the promised leg; a fare pays at the platform
const rnd=Math.random;Math.random=()=>0.99;                 // hold the platform crowd back for determinism
S.nav={seed:7,reg:0,col:0,row:0};S.visited=['0:0:0'];S.sel=0;S.mode='run';S.origin=false;S.stop=null;S.depot=null;
S.contracts=[{k:'escort',legs:1,left:1,pay:50}];S.pax=[{special:false,fare:10,legs:1}];S.cargo={};
const sc0=S.scrap;S.navT={to:{reg:0,col:1,row:0},regChange:false};
finish();                                                   // arrives at 0:1:0 — a station (asserted in wave 1)
Math.random=rnd;
ok('escort: pays out after the promised legs', S.contracts.length===0&&S.scrap>sc0+49);
ok('fares: the rider pays and steps down at the station', S.pax.length===0);
// 21 · the ledger survives a save
S.cargo={ore:3,relic:1};S.contracts=[{k:'haul',g:'grain',n:2,reg:1,src:'0:1:0',pay:60}];S.pax=[{special:true,nm:'X',fare:99,legs:2}];
S.mode='idle';S.depot=null;S.origin=false;S.stop=null;
await save();S.cargo={};S.contracts=[];S.pax=[];
await load();
ok('v4 save: cargo + contracts + passengers round-trip', S.cargo.ore===3&&S.cargo.relic===1&&S.contracts.length===1&&S.contracts[0].pay===60&&S.pax.length===1&&S.pax[0].fare===99);

console.log(fails? '\n'+fails+' FAILURES':'\nALL CHECKS PASS ('+((s=>s)(0)||'choreography + schema + spine + economy')+')');process.exit(fails?1:0);
})();
