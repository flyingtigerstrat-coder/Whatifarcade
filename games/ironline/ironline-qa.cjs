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
 +'\n;globalThis.__T={S,tick,stopArrive,stopDepart,save,load,migrate,STATION_HOME};';
eval(script);
(async()=>{
await new Promise(r=>setTimeout(r,20)); // let the async boot IIFE settle
const {S,tick,stopArrive,stopDepart,save,load,migrate,STATION_HOME}=globalThis.__T;
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
ok('v1 save: re-saves stamped v2', JSON.parse(__getStore()).v===2);

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

console.log(fails? '\n'+fails+' FAILURES':'\nALL CHECKS PASS ('+((s=>s)(0)||'choreography + save schema')+')');process.exit(fails?1:0);
})();
