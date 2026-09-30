'use strict';
const assert = require('node:assert/strict');
const J = require('./tools/test_engine');
const clone = x => JSON.parse(JSON.stringify(x));
let passed=0;
function test(name,fn) { fn(); passed++; console.log('PASS '+name); }
function project() {
  const p=J.defaultProject(); p.title='Acceptance';p.seed=42;
  p.lyrics='[00:00.00-00:04.00] Alpha / beta / gamma / delta\n[00:04.00-00:08.00] One / two / three / four\n[00:08.00-00:12.00] Red / green / blue / white';
  p.timing={...p.timing,bpm:120,snap:false,tail:0,lineTimes:{},lineEnds:{}};p.overrides={}; return p;
}
const visual = c => Object.fromEntries(Object.entries(c).filter(([k])=>!['index','locked','renderContext','lockedEvents'].includes(k)));
test('real headless UI helpers: no uninitialized browser state',()=>{
  const p=project(),plan=J.plan(p);J.setOv(0,{hold:'pulse'},p);J.toggleCutLock(0,p,plan);
  assert(J.plan(p).cuts.filter(c=>c.line===0).every(c=>J.isCutLocked(p,c)));
  J.toggleCutLock(0,p,J.plan(p));assert(J.plan(p).cuts.every(c=>!J.isCutLocked(p,c)));
});
test('single-shot edits leave sibling shots and all other lines unchanged',()=>{
  for(const dim of ['layout','enter','hold','exit','cam','treat','bg','decor']) {
    const p=project(),before=J.plan(p),target=before.cuts[1];assert(before.cuts.filter(c=>c.line===target.line).length>1);
    const key=J.order(dim).find(k=>!J.registry(dim)[k].special && k!==target[dim]);
    J.editTechnique(p,before,target,dim,key);const after=J.plan(p);
    assert.equal(after.cuts.length,before.cuts.length);
    before.cuts.forEach((c,i)=>{if(i!==1) assert.deepEqual(after.cuts[i],c,dim+' changed shot '+i);});
    if(dim!=='decor') assert.equal(after.cuts[1][dim],key);
  }
});
test('single-shot shuffle isolates preceding AND following shots, including siblings',()=>{
  const p=project();for(let n=0;n<30;n++) {const before=J.plan(p),i=n%before.cuts.length;J.editShuffle(p,before,before.cuts[i]);const after=J.plan(p);before.cuts.forEach((c,k)=>{if(k!==i)assert.deepEqual(after.cuts[k],c);});}
});
test('full resolved visuals, render style, fx and events survive 100 Omakase/seed replans',()=>{
  const p=project(),before=J.plan(p),c=before.cuts[1];J.editLock(p,before,c);
  const initial=J.plan(p).cuts[1];
  for(let n=0;n<100;n++) {
    if(n%2) Object.assign(p,J.omakase(p,J.rng(n+123))); else p.seed=n*777;
    const plan=J.plan(p),actual=plan.cuts.find(x=>x.line===c.line&&x.subIndex===c.subIndex);
    assert.deepEqual(visual(actual),visual(initial));assert.deepEqual(actual.renderContext,initial.renderContext);assert.deepEqual(actual.lockedEvents,initial.lockedEvents);
    const view=J.renderPlanAt(plan,actual.start+0.1);assert.deepEqual(view.style,initial.renderContext.style);assert.deepEqual(view.fx,initial.renderContext.fx);
  }
});
test('a locked shot rejects both current and whole-line shuffle',()=>{
 const p=project(),b=J.plan(p),c=b.cuts[1];J.editLock(p,b,c);const snap=J.plan(p).cuts[1];
 assert.deepEqual(J.editShuffle(p,J.plan(p),c),{changed:0,locked:1});
 J.editShuffle(p,J.plan(p),c.line);assert.deepEqual(J.plan(p).cuts[1],snap);
});
test('unlock removes snapshots and allows reroll while retaining explicit user choices',()=>{
 const p=project();let plan=J.plan(p),c=plan.cuts[1];J.editTechnique(p,plan,c,'enter','spin');plan=J.plan(p);c=plan.cuts[1];J.editLock(p,plan,c);
 J.editTechnique(p,J.plan(p),c,'hold','pulse');J.editLock(p,J.plan(p),c);
 const ov=p.overrides[c.line].cuts[c.subIndex];assert(!ov._snapshot);assert(!ov.lock);assert.equal(ov.hold,'pulse');assert.equal(ov.enter,'spin');
});
test('automatic selection removes the explicit choice and can override legacy line choice',()=>{
 const p=project();p.overrides[0]={enter:'spin'};let plan=J.plan(p),c=plan.cuts[1];J.editTechnique(p,plan,c,'enter','wipe');J.editTechnique(p,J.plan(p),c,'enter','auto');assert.equal(p.overrides[0].cuts[c.subIndex].enter,null);
 const results=new Set();for(let n=0;n<15;n++){J.editShuffle(p,J.plan(p),c);results.add(J.plan(p).cuts[1].enter);}assert(results.size>1);
});
test('decor is multi-select, toggleable, clearable and serialized',()=>{
 const p=project();let c=J.plan(p).cuts[1];J.editTechnique(p,J.plan(p),c,'decor','noneDecor');
 J.editTechnique(p,J.plan(p),c,'decor','crosshair');J.editTechnique(p,J.plan(p),c,'decor','timecodeBar');
 assert.deepEqual(J.plan(p).cuts[1].decor.map(d=>d.id),['crosshair','timecodeBar']);
 J.editTechnique(p,J.plan(p),c,'decor','crosshair');assert.deepEqual(J.plan(clone(p)).cuts[1].decor.map(d=>d.id),['timecodeBar']);
});
test('project JSON round-trip preserves all locked and edited cuts',()=>{
 const p=project();J.editLock(p,J.plan(p),0);J.editTechnique(p,J.plan(p),J.plan(p).cuts[1],'cam','crashZoom');assert.deepEqual(J.plan(clone(p)),J.plan(p));
});
test('every selectable preset has a category and both translations',()=>{
 for(const dim of ['layout','enter','hold','exit','cam','treat','bg','decor'])for(const key of J.order(dim).filter(k=>!J.registry(dim)[k].special)){
 assert(J.TECH_CATEGORIES[dim].some(c=>c.keys.includes(key)),dim+'.'+key);assert(J.TECH_NAMES[dim][key].zh);assert(J.TECH_NAMES[dim][key].ja);
 }
});
test('actual full-shuffle function reports only editable shots and respects locks',()=>{
 const p=project(),b=J.plan(p);J.editLock(p,b,b.cuts[1]);const count=J.plan(p).cuts.filter(c=>c.subIndex!=null).length;
 assert.deepEqual(J.shuffleAllCuts(p,J.plan(p)),{changed:count-1,locked:1});
});
test('editing one locked dimension after Omakase preserves all other resolved parameters',()=>{
 const p=project();let plan=J.plan(p),c=plan.cuts[1];J.editLock(p,plan,c);
 Object.assign(p,J.omakase(p,J.rng(555)));plan=J.plan(p);const before=clone(plan.cuts[1]);
 J.editTechnique(p,plan,plan.cuts[1],'enter','spin');const after=clone(J.plan(p).cuts[1]);
 assert.equal(after.enter,'spin');delete before.enter;delete after.enter;delete before.inDur;delete after.inDur;
 assert.deepEqual(after,before);
});
console.log(`${passed}/${passed} editor acceptance groups passed`);
