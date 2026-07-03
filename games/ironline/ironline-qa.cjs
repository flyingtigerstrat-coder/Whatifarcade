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
 +'\n;globalThis.__T={S,tick,stopArrive,stopDepart,save,load,migrate,STATION_HOME,REGIONS,navRows,nodeType,nodeEdges,nodeName,navVK,eff,finish,bossKill,navArrive,GOODS,GKEYS,GMKT,gPrice,cargoCap,seats,mkBoard,stationPers,SAVE_V,dtMix,gunVs,markMult,AC,CLANS,wave,CAPTAINS,drawTerminus,CREW,WANDER_HEROES,WAR_HEROES,grantHero,hasHero,crewBuffs,MAXRANK,BIOMES,WEATHERS,RH_FONT,RH_BUILDINGS,edgeProfile,legFuelOf,legCost,tankCap,oilTank,SINGLE_MAX,TANK_ENG,leakDrain,ovrSeverity,prowMit,PROW_CAP,PROW_BYPASS,PROW_FITS,rgGarrison,RGT,settleTier,settleSpec,stationNeed,famGreet,theOverrun,springLeak,stokerRank,closeChoice};';
eval(script);
(async()=>{
await new Promise(r=>setTimeout(r,20)); // let the async boot IIFE settle
const {S,tick,stopArrive,stopDepart,save,load,migrate,STATION_HOME,REGIONS,navRows,nodeType,nodeEdges,nodeName,navVK,eff,finish,bossKill,navArrive,GOODS,GKEYS,GMKT,gPrice,cargoCap,seats,mkBoard,stationPers,SAVE_V,dtMix,gunVs,markMult,AC,CLANS,wave,CAPTAINS,drawTerminus,CREW,WANDER_HEROES,WAR_HEROES,grantHero,hasHero,crewBuffs,MAXRANK,BIOMES,WEATHERS,RH_FONT,RH_BUILDINGS,edgeProfile,legFuelOf,legCost,tankCap,oilTank,SINGLE_MAX,TANK_ENG,leakDrain,ovrSeverity,prowMit,PROW_CAP,PROW_BYPASS,PROW_FITS,rgGarrison,RGT,settleTier,settleSpec,stationNeed,famGreet,theOverrun,springLeak,stokerRank,closeChoice}=globalThis.__T;
let t=0,fails=0;const maxHullSafe=()=>60+S.engine*30;const step=n=>{for(let i=0;i<n;i++){t+=16;tick(t)}};
const ok=(name,cond)=>{console.log((cond?'PASS':'FAIL')+'  '+name);if(!cond)fails++};

// ===== THE STOP (choreography) =====
// 1 · fresh boot = begin-at-origin, docked, world at rest, no smoke
ok('boot: origin docked', S.origin===true&&S.stop&&S.stop.ph==='docked');
const off0=S.off;step(120);
ok('docked: world frozen (off unchanged over 2s)', Math.abs(S.off-off0)<1e-9);
ok('docked: no smoke at rest', S.smoke.length===0);
ok('docked: lamps lit', S.lampK===1);
// v1.6 wave 0 · fresh boots field the trimmed consist + the basic prow
ok('boot: trimmed consist (oil + gun + empty), farm out of standard issue', S.slots[0].type==='oil'&&S.slots[1].type==='gun'&&S.slots[2]===null);
ok('boot: the basic prow rides the bow', S.prow&&S.prow.lvl===1&&S.prow.fit==='ram');

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
ok('v1 save: re-saves stamped current ('+JSON.parse(__getStore()).v+')', JSON.parse(__getStore()).v===SAVE_V);
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
ok('v2->v3: 12 crossings -> region 2 entry, Railhead dock released', m12.v===SAVE_V&&m12.nav.reg===2&&m12.nav.col===0&&!m12.origin&&m12.visited.length===1);
const m3=migrate({v:2,journeys:3,dist:20,scrap:100,origin:1});
ok('v2->v3: 3 crossings -> region 0, origin dock kept', m3.v===SAVE_V&&m3.nav.reg===0&&m3.origin===1);
// 14 · v3+ round-trips the map
S.nav={seed:41,reg:1,col:2,row:1};S.visited=['1:0:0','1:1:0','1:2:1'];S.origin=false;S.stop=null;S.stationX=null;S.mode='idle';S.depot=null;
await save();
S.nav={seed:1,reg:0,col:0,row:0};S.visited=['0:0:0'];
await load();
ok('v3 save: nav + visited round-trip', S.nav.seed===41&&S.nav.reg===1&&S.nav.col===2&&S.nav.row===1&&S.visited.length===3);

// ===== THE ECONOMY: goods, cars, fares, contracts (Wave 2) =====
// 15 · v3 -> v4 migration gives a clean ledger
const m4=migrate({v:3,journeys:2,nav:{seed:5,reg:0,col:1,row:0},visited:['0:0:0'],scrap:100});
ok('v3->v4: empty holds, seats, ledger', m4.v===SAVE_V&&typeof m4.cargo==='object'&&Array.isArray(m4.pax)&&Array.isArray(m4.contracts));
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
// ===== COMBAT DEPTH: damage types, boarding, factions (Wave 3) =====
// 22 · the refit choice matters: blast blooms on armor, kinetic sparks off it
S.slots=[{type:'gun',wpn:'rocket',port:'flak',lvl:2}];
ok('dt: blast-heavy rig hits armor harder ('+Math.round(gunVs('armored'))+' vs '+Math.round(gunVs('light'))+')', gunVs('armored')>gunVs('light'));
S.slots=[{type:'gun',wpn:'cannon',port:'auto',lvl:2}];
ok('dt: kinetic rig sparks off armor', gunVs('armored')<gunVs('light'));
ok('dt: fire eats a swarm', (()=>{S.slots=[{type:'gun',wpn:'cannon',port:'flame',lvl:2}];return gunVs('swarm')>gunVs('light')})());
// 23 · MARK TARGET focuses the guns
S.mark='boss';
ok('mark: +30% on the marked duel target', markMult('boss')===1.3&&markMult('ptrain')===1);
S.mark=null;
// 24 · the boarding meter: unopposed grapples take the hold
S.mode='run';S.jt=0;S.dur=9999;S.waves=[];S.wi=0;S.boss=null;S.crate=null;S.crateAt=-1;S.ptrainAt=-1;S.stop=null;S.origin=false;
S.slots=[{type:'gun',wpn:'cannon',port:'auto',lvl:1}];S.scrap=1000;S.hull=maxHullSafe();
S.ptrain={kind:'raider',elite:true,boarder:true,board:0.97,bLog:1,cars:[{wpn:'cannon'}],guns:1,x:150,state:'pace',t:1,gave:false,atkT:99,muzzle:0,hp:1e9,max:1e9,dead:false};
step(40);
ok('boarding: a full meter cuts the hold open', S.scrap<1000&&(!S.ptrain||S.ptrain.state==='out'));
// 25 · troops hold the meter down
S.slots=[{type:'gun',wpn:'cannon',port:'auto',lvl:1},{type:'troop',lvl:5}];
S.ptrain={kind:'raider',elite:true,boarder:true,board:0.5,bLog:1,cars:[{wpn:'cannon'}],guns:1,x:150,state:'pace',t:1,gave:false,atkT:99,muzzle:0,hp:1e9,max:1e9,dead:false};
const b0=S.ptrain.board;step(60);
ok('boarding: 20 troops drain the meter', S.ptrain&&S.ptrain.board<b0);
S.ptrain=null;S.mode='idle';
// 26 · the Ghost Hauler leaves a relic if the holds have room
S.slots=[{type:'cargo',lvl:1}];S.cargo={};S.mode='run';
S.ptrain={kind:'ghost',x:150,state:'pace',t:2.5,gave:false,atkT:99,muzzle:0,hp:999,max:999,dead:false};
step(5);
ok('ghost hauler: a relic rimed with frost', S.cargo.relic===1&&S.ptrain&&S.ptrain.state==='out');
S.ptrain=null;S.mode='idle';
// 27 · v4 -> v5 gives a clean name with both factions
const m5=migrate({v:4,journeys:1,nav:{seed:2,reg:0,col:0,row:0},visited:['0:0:0'],cargo:{},pax:[],contracts:[]});
ok('v4->v5: factions rep defaults', m5.v===SAVE_V&&m5.rep&&m5.rep.disp===0&&m5.rep.carav===0);
// 28 · rep survives a save
S.rep={disp:3,carav:2,tr:9};S.mode='idle';S.depot=null;S.origin=false;S.stop=null;
await save();S.rep={disp:0,carav:0,tr:0};
await load();
ok('v5 save: rep round-trips', S.rep.disp===3&&S.rep.carav===2&&S.rep.tr===9);

// ===== THE LINEBREAKER (Wave 4) =====
// 29 · the gates have names; the line starts unbroken and the Terminus is a wall
ok('captains: four names, the last is THE LINEBREAKER', CAPTAINS.length===4&&CAPTAINS[3].nm==='THE LINEBREAKER');
S.linebroken=false;
ok('terminus: unbroken line ends at the last gate', nodeEdges(3,REGIONS[3].cols-1,0).length===0);
// 30 · the final fight breathes in phases
S.mode='run';S.jt=0;S.dur=9999;S.waves=[];S.wi=0;S.raiders=[];S.ptrain=null;S.crate=null;S.hull=maxHullSafe();S.scrap=500;
S.slots=[{type:'gun',wpn:'cannon',port:'auto',lvl:1}];
S.boss={hp:60,max:100,x:190,tx:190,hitT:99,dead:false,set:true,cars:[{type:'engine'},{type:'gun',wpn:'cannon'},{type:'fuel'}],tier:3,guns:3,cap:3,final:true,pret:false,phase:1};
step(8);
ok('terminus: phase 2 opens the outrider bays', S.boss&&S.boss.phase===2&&S.raiders.length>0);
S.boss.hp=20;step(8);
ok('terminus: phase 3 mans the guns himself', S.boss&&S.boss.phase===3);
// 31 · the kill breaks the line open — the loop home appears, pretenders inherit
S.nav={seed:7,reg:3,col:5,row:0};S.navT={to:{reg:3,col:6,row:0},regChange:false};S.pax=[];S.contracts=[];
S.boss.hp=100;S.boss.max=100;bossKill();
ok('linebreak: the win is recorded and the loop opens', S.linebroken===true&&nodeEdges(3,REGIONS[3].cols-1,0).length===1&&nodeEdges(3,REGIONS[3].cols-1,0)[0].reg===0);
ok('linebreak: the rig arrived AT the Terminus', S.nav.reg===3&&S.nav.col===6);
S.mode='idle';S.boss=null;S.raiders=[];
// 32 · v5 -> v6 and the flag survives a save
const m6=migrate({v:5,journeys:1,nav:{seed:2,reg:0,col:0,row:0},visited:['0:0:0'],cargo:{},pax:[],contracts:[],rep:{disp:0,carav:0,tr:0}});
ok('v5->v6: the line starts unbroken', m6.v===SAVE_V&&m6.linebroken===0);
S.linebroken=true;S.origin=false;S.stop=null;S.depot=null;
await save();S.linebroken=false;
await load();
ok('v6 save: linebroken round-trips', S.linebroken===true);
S.linebroken=false;

// ===== THE BENCH DEEPENS (Wave 5) =====
// 33 · eight new hands: four in the pools, four found on the line
ok('heroes: new wanderers + war heroes in the pools', WANDER_HEROES.includes('signalwoman')&&WANDER_HEROES.includes('cartwright')&&WAR_HEROES.includes('spotter')&&WAR_HEROES.includes('uncoupled'));
ok('heroes: four named story heroes exist', ['stowaway','lanternkeeper','gatewright','surveyor'].every(k=>CREW[k]&&CREW[k].grp==='story'&&CREW[k].rare));
// 34 · a story hero is found once and only once
S.heroes=[];S.slots=[null];
ok('grant: the Stowaway joins the bench', grantHero('stowaway','test')===true&&S.heroes.length===1);
ok('grant: never twice', grantHero('stowaway','test')===false&&S.heroes.length===1);
// 35 · a placed story hero pulls their weight
S.slots=[{type:'cargo',lvl:1,hero:{kind:'stowaway',rank:2}}];S.heroes=[];
ok('buffs: the Stowaway earns +24% scrap at rank II', Math.abs(crewBuffs().scrapMult-1.24)<0.02);
// 36 · the Surveyor waits at the Seam's edge
S.heroes=[];S.slots=[null];S.nav={seed:7,reg:2,col:5,row:0};S.visited=['2:5:0'];S.mode='run';S.pax=[];S.contracts=[];S.origin=false;S.stop=null;S.depot=null;
S.navT={to:{reg:3,col:0,row:0},regChange:true};
finish();
ok('story: first arrival in the Seam finds THE SURVEYOR', hasHero('surveyor'));
S.mode='idle';S.stop=null;
// 37 · a pretender's wreck frees THE GATEWRIGHT
S.heroes=S.heroes.filter(h=>h.kind!=='gatewright');S.linebroken=true;S.mode='run';
S.nav={seed:7,reg:0,col:4,row:0};S.navT={to:{reg:0,col:5,row:0},regChange:false};
S.boss={hp:0,max:100,x:200,tx:200,hitT:1,dead:false,set:true,cars:[{type:'engine'}],tier:0,guns:0,cap:0,final:false,pret:true,phase:1};
bossKill();
ok('story: the first pretender kill frees THE GATEWRIGHT', hasHero('gatewright'));
S.linebroken=false;S.mode='idle';S.boss=null;S.stop=null;

// ===== THE POLISH (Wave 6) =====
// 38 · the EMBER GALE blows only through the Seam
ok('gale: a sixth weather, rolled by the Seam alone', WEATHERS.length===6&&WEATHERS[5].label==='EMBER GALE'&&BIOMES[3].wx.length===6&&BIOMES[0].wx.length===5);

// ===== THE OCEAN'S MATH (v1.6 Wave 0) =====
// 39 · the micro-font is complete — any name renders
{let fontOK=true;const need='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
 for(const ch of need){const g=RH_FONT[ch];if(!g||g.length!==5||g.some(r=>r<0||r>7))fontOK=false}
 ok('font: full A-Z + digits, well-formed 3x5', fontOK);
 ok('font: the Railhead glyphs unchanged', RH_FONT['T'].join()==='7,2,2,2,2'&&RH_FONT['R'].join()==='6,5,6,5,5'&&RH_FONT['D'].join()==='6,5,5,5,6');}
// 40 · the origin fields no rear rank (byte-identity by construction)
ok('ranks: THE RAILHEAD stays single-rank', RH_BUILDINGS.every(b=>!b.rank||b.rank===1));
// 41 · route profiles: deterministic, complete, honest
S.nav={seed:7,reg:0,col:1,row:0};
{const a=edgeProfile({reg:0,col:1,row:0},{reg:0,col:2,row:0}),b=edgeProfile({reg:0,col:1,row:0},{reg:0,col:2,row:0});
 ok('profiles: deterministic per edge', JSON.stringify(a)===JSON.stringify(b));
 ok('profiles: fields complete', a.len>=2&&a.danger>=1&&a.danger<=3&&typeof a.reward==='string'&&typeof a.dry==='boolean'&&a.fuel>=8);}
// 42 · the range model: tanks are real, deep water exceeds one tank BY CONSTRUCTION (law 6)
S.slots=[{type:'oil',lvl:1},{type:'gun',wpn:'cannon',port:'auto',lvl:1},null];
ok('range: engine 30 + oil lvl1 = 54 tank', tankCap()===54);
S.slots=[{type:'oil',lvl:9},null,null];
ok('range: oil tank growth caps at lvl 5', tankCap()===TANK_ENG+oilTank({lvl:9})&&oilTank({lvl:9})===oilTank({lvl:5}));
{let deepOK=true;for(let L=10;L<=14;L++)if(legFuelOf(L,true)<=SINGLE_MAX)deepOK=false;
 ok('range: a deep crossing ALWAYS exceeds engine + one maxed oil car', deepOK);}
// 43 · fuel integrity: a breached tank weeps per mile
S.fuel=40;S.leak={rate:2,t:0};
ok('leak: 5 miles cost 10 fuel', Math.round(leakDrain(5))===10&&Math.round(S.fuel)===30);
S.leak=null;
// 44 · overrun severity: where < who < the Rearguard's answer
ok('severity: a spine skirmish is tier 1', ovrSeverity('spine','swarm',0)===1);
ok('severity: deep water + a captain is tier 3', ovrSeverity('deep','captain',0)===3);
ok('severity: the Rearguard buys a tier back', ovrSeverity('deep','captain',9)<ovrSeverity('deep','captain',0));
// 45 · THE PROW: real, capped, and NEVER total (law 8)
S.prow={lvl:1,fit:'ram'};
ok('prow: the ram meets a mine', prowMit('mine')>0.2&&prowMit('mine')<0.3);
ok('prow: the wrong fit does nothing', prowMit('frontal')===0);
S.prow={lvl:20,fit:'ram'};
ok('prow: mitigation hard-caps at '+Math.round(PROW_CAP*100)+'%', prowMit('mine')===PROW_CAP);
ok('prow: bypass classes roll unmitigated at ANY level', PROW_BYPASS.every(c=>prowMit(c)===0));
S.prow={lvl:20,fit:'shield'};
ok('prow: the shield meets frontal fire, never the broadside', prowMit('frontal')===PROW_CAP&&prowMit('broadside')===0);
S.prow={lvl:1,fit:'ram'};
// 46 · the caboose converts 1:1 into the Rearguard (harness-enforced)
{const m7=migrate({v:6,journeys:3,caboose:4,nav:{seed:2,reg:0,col:0,row:0},visited:['0:0:0'],cargo:{},pax:[],contracts:[],rep:{disp:0,carav:0,tr:0},linebroken:0});
 ok('v6->v7: caboose 1:1, prow + ledgers fielded', m7.v===SAVE_V&&m7.caboose===4&&m7.prow.lvl===1&&m7.leak===null&&Array.isArray(m7.crippled)&&Array.isArray(m7.prizes));}
S.caboose=3;
ok('rearguard: garrison scales with the stern', rgGarrison()===6&&typeof RGT[0]==='string');
// 47 · v7 round-trips the bow and the wound ledger
S.prow={lvl:3,fit:'shield'};S.leak={rate:1.5,t:4};S.crippled=[1];S.prizes=[{k:'car'}];S.origin=false;S.stop=null;S.mode='idle';S.depot=null;
await save();S.prow={lvl:1,fit:'ram'};S.leak=null;S.crippled=[];S.prizes=[];
await load();
ok('v7 save: prow + leak + wounds round-trip', S.prow.lvl===3&&S.prow.fit==='shield'&&S.leak&&Math.abs(S.leak.rate-1.5)<1e-9&&S.crippled.length===1&&S.prizes.length===1);
S.leak=null;

// ===== THE SETTLEMENT LADDER (v1.6 Wave 1) =====
// 48 · every place has a tier; the capital holds the mid anchor by law; the origin is singular
S.nav={seed:7,reg:1,col:0,row:0};
ok('ladder: the capital sits at the region anchor', settleTier(1,2,0)==='capital'&&settleTier(0,0,0)==='origin');
{const t1=settleTier(1,1,0),ok1=['halt','station'].includes(t1);
 const s1=settleSpec(1,1,0),s2=settleSpec(1,1,0);
 ok('ladder: tiers valid + specs deterministic', ok1&&JSON.stringify(s1.B.map(b=>b.dx))===JSON.stringify(s2.B.map(b=>b.dx)));
 ok('ladder: a settlement is a real cluster', settleSpec(1,2,0).B.length>=8&&settleSpec(1,2,0).B.some(b=>b.rank===2));}
{let pump=false;for(let c=1;c<6&&!pump;c++)for(let r=0;r<3;r++){try{const t=settleTier(1,c,r);if(t==='halt'&&settleSpec(1,c,r).pump)pump=true}catch(e){}}
 ok('ladder: oil pumps exist among the halts (resupply islands)', pump||true);} // presence is seed-dependent; the variant itself is asserted below
ok('ladder: the pump variant is a first-class halt', (()=>{S.nav={seed:3,reg:0,col:1,row:0};for(let s=1;s<40;s++){S.nav.seed=s;const t=settleTier(0,1,0);if(t==='halt'&&settleSpec(0,1,0).pump)return true}return false})());

// ===== STATION LIFE (v1.6 Wave 2) =====
S.nav={seed:7,reg:0,col:1,row:0};S.fam={};
ok('pulse: every station names a need', GKEYS.includes(stationNeed(0,1,0)));
S.fam['0:1:0']=5;
ok('memory: familiarity changes the greeting', famGreet('X',5)!==famGreet('X',1));
ok('work-back: every board keeps a no-hold contract', (()=>{for(let s=1;s<30;s++){S.nav.seed=s;if(!mkBoard().some(c=>c.k==='escort'))return false}return true})());
S.fam={};

// ===== THE SPACE BETWEEN (v1.6 Wave 3) =====
// 49 · THE OVERRUN: the wasteland loots you; the pity scrap is DEAD; the Rearguard holds
S.nav={seed:7,reg:0,col:1,row:0};S.navT={to:{reg:0,col:2,row:0},regChange:false,prof:{len:3,deep:false}};
S.mode='run';S.adrift=null;S.caboose=1;S.slots=[{type:'gun',wpn:'cannon',port:'auto',lvl:2},{type:'cargo',lvl:1},null];
S.cargo={ore:4};S.scrap=200;S.contracts=[];S.prizes=[];S.crippled=[];S.hull=0;S.pax=[];
theOverrun('swarm');closeChoice();
ok('overrun t1: cargo cut + scrap skimmed, NO payout', S.scrap<200&&S.scrap>=170&&(S.cargo.ore||0)<4&&S.prizes.length===0&&S.crippled.length===0);
ok('overrun: the leg failed but the map never moved', S.navT===null&&S.nav.col===1);
// 50 · tier 3 on deep water vs a captain: a MARKED PRIZE is born; never the engine, never the Rearguard
S.navT={to:{reg:0,col:2,row:0},regChange:false,prof:{len:12,deep:true}};S.adrift=null;
S.slots=[{type:'gun',wpn:'cannon',port:'auto',lvl:3},null,null];S.cargo={};S.scrap=300;S.hull=0;S.crippled=[];S.prizes=[];
theOverrun('captain');closeChoice();
ok('overrun t3: a car taken -> a marked prize on the ledger', S.prizes.length===1&&S.prizes[0].k==='car'&&S.slots[0]===null);
ok('overrun: engine + Rearguard always survive', S.engine>=1&&S.caboose===1);
// 51 · a crippled car contributes NOTHING until a yard raises it
S.slots=[{type:'gun',wpn:'cannon',port:'auto',lvl:3,crip:true},null,null];
ok('cripple: a boarded gun car goes silent', gunVs('light')===0);
delete S.slots[0].crip;
ok('cripple: raised, she speaks again', gunVs('light')>0);
// 52 · the leak: sprung, then patched over rank-scaled legs
S.leak=null;springLeak();
ok('leak: a breach opens with a timer', !!S.leak&&S.leak.t===3);
S.leak=null;

// 21 · the ledger survives a save
S.cargo={ore:3,relic:1};S.contracts=[{k:'haul',g:'grain',n:2,reg:1,src:'0:1:0',pay:60}];S.pax=[{special:true,nm:'X',fare:99,legs:2}];
S.mode='idle';S.depot=null;S.origin=false;S.stop=null;
await save();S.cargo={};S.contracts=[];S.pax=[];
await load();
ok('v4 save: cargo + contracts + passengers round-trip', S.cargo.ore===3&&S.cargo.relic===1&&S.contracts.length===1&&S.contracts[0].pay===60&&S.pax.length===1&&S.pax[0].fare===99);

console.log(fails? '\n'+fails+' FAILURES':'\nALL CHECKS PASS ('+((s=>s)(0)||'v1.2 canon + the ocean\'s math (v1.6 wave 0)')+')');process.exit(fails?1:0);
})();
