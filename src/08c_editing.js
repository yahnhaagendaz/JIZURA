/* Editing operations shared by the browser and headless tests.
 * Line overrides remain backwards compatible. cuts[subIndex] addresses one shot.
 * Resolved lock snapshots include the render context, not just preset names.
 */
(() => {
'use strict';
const copy = x => JSON.parse(JSON.stringify(x));
const dims = ['layout', 'enter', 'hold', 'exit', 'cam', 'treat', 'bg', 'decor'];
const lineOv = (p, i) => (p.overrides ||= {})[i] ||= {};
const editable = c => c && c.line >= 0 && c.subIndex != null;
J.isCutLocked = (p, c) => !!(c && c.line >= 0 && (p.overrides?.[c.line]?.lock || p.overrides?.[c.line]?.cuts?.[c.subIndex]?.lock));
J.cutOverride = (p, c) => Object.assign({}, p.overrides?.[c.line] || {}, p.overrides?.[c.line]?.cuts?.[c.subIndex] || {});
J.patchOverride = (p, i, patch) => {
  const ov = Object.assign({}, p.overrides?.[i], patch);
  for (const k of Object.keys(ov)) if (ov[k] === undefined || ov[k] === false || ov[k] === '') delete ov[k];
  p.overrides ||= {};
  if (Object.keys(ov).length) p.overrides[i] = ov; else delete p.overrides[i];
};
function structure(p, plan, i) {
  const ov = lineOv(p, i), ln = plan.lines[i];
  ov._structure = { text: ln.text, cuts: plan.cuts.filter(c => c.line === i && c.subIndex != null).map(c => ({text:c.text, start:c.start-ln.start, end:c.end-ln.start, recap:c.recap, subIndex:c.subIndex})) };
}
function snapshot(plan, c) {
  const context = c.renderContext || {style:plan.style, fx:plan.fx, hud:plan.hud};
  const saved = copy(c); delete saved.renderContext; delete saved.index;
  return { cut:saved, context:copy(context), events:copy(c.lockedEvents || plan.events.filter(e => e.t >= c.start - 0.6 && e.t < c.end)) };
}
function unfreeze(ov) {
  // Old builds copied automatic values into overrides; remove those explicitly.
  for (const k of ov._frozen || []) delete ov[k];
  delete ov._frozen; delete ov.lockedSeed; delete ov._snapshot; delete ov.lock;
}
J.editLock = (p, plan, cutOrLine) => {
  const byLine = typeof cutOrLine === 'number';
  const i = byLine ? cutOrLine : cutOrLine.line;
  const cuts = plan.cuts.filter(c => c.line === i && editable(c));
  if (!cuts.length) return false;
  const ov = lineOv(p, i);
  const targets = byLine ? cuts : cuts.filter(c => c.subIndex === cutOrLine.subIndex);
  if (!targets.length) return false;
  const unlock = byLine ? cuts.every(c => J.isCutLocked(p,c)) : J.isCutLocked(p,cutOrLine);
  if (ov.lock) {
    // Convert the old whole-line flag to individual locks before editing one shot.
    ov.cuts ||= {};
    for (const c of cuts) { const item = ov.cuts[c.subIndex] ||= {}; item.lock = true; item._snapshot ||= snapshot(plan,c); }
    unfreeze(ov);
  }
  structure(p,plan,i);
  for (const c of targets) {
    const item = (ov.cuts ||= {})[c.subIndex] ||= {};
    if (unlock) unfreeze(item);
    else { item.lock = true; item._snapshot = snapshot(plan,c); }
  }
  return !unlock;
};
J.editTechnique = (p, plan, cut, dim, key) => {
  if (!editable(cut) || !dims.includes(dim)) return;
  if (key !== 'auto' && key !== 'noneDecor' && !J.registry(dim)[key]) throw new Error('Unknown technique: '+dim+'.'+key);
  structure(p,plan,cut.line);
  const item = (lineOv(p,cut.line).cuts ||= {})[cut.subIndex] ||= {};
  // null explicitly restores automatic selection even if a legacy line override exists.
  if (key === 'auto') item[dim] = null;
  else if (dim === 'decor') {
    const current = item.decor == null ? (cut.decor || []).map(d => d.id || d) : item.decor;
    item.decor = key === 'noneDecor' ? [] : current.includes(key) ? current.filter(k => k !== key) : [...current,key];
  } else item[dim] = key;
  // Editing one dimension of a locked shot must not refresh its other dimensions.
  const previous = item._snapshot && copy(item._snapshot);
  delete item._snapshot;
  if (item.lock || p.overrides[cut.line].lock) {
    const nextPlan = J.plan(p);
    const next = nextPlan.cuts.find(c => c.line === cut.line && c.subIndex === cut.subIndex);
    if (next) {
      item.lock = true;
      item._snapshot = previous || snapshot(nextPlan, next);
      if (previous) {
        const fields = {layout:['layout','params'],enter:['enter','inDur'],exit:['exit','outDur'],cam:['cam','camP'],bg:['bg','bgP'],treat:['treat','treatP'],hold:['hold'],decor:['decor']}[dim];
        for (const field of fields) item._snapshot.cut[field] = copy(next[field]);
      }
    }
  }
};
J.upgradeLegacyLocks = (p,plan) => {
  for (const [i,ov] of Object.entries(p.overrides || {})) {
    if (!ov.lock) continue;
    const cuts = plan.cuts.filter(c => c.line === +i && editable(c));
    if (!cuts.length) continue;
    structure(p,plan,+i); ov.cuts ||= {};
    for (const c of cuts) { const item = ov.cuts[c.subIndex] ||= {}; item.lock = true; item._snapshot ||= snapshot(plan,c); }
    unfreeze(ov);
  }
};
J.editShuffle = (p, plan, cutOrLine) => {
  const targets = typeof cutOrLine === 'number' ? plan.cuts.filter(c => c.line === cutOrLine && editable(c)) : [cutOrLine].filter(editable);
  let changed = 0, locked = 0;
  for (const c of targets) {
    if (J.isCutLocked(p,c)) { locked++; continue; }
    structure(p,plan,c.line);
    const item = (lineOv(p,c.line).cuts ||= {})[c.subIndex] ||= {};
    item.seed = (item.seed|0)+1;
    changed++;
  }
  return {changed,locked};
};
J.editShuffleAll = (p, plan) => {
  const cuts = plan.cuts.filter(editable);
  const locked = cuts.filter(c => J.isCutLocked(p,c)).length;
  p.seed = (p.seed|0)+1;
  return {changed:cuts.length-locked,locked};
};
J.restoreLockedCuts = (p, plan) => {
  for (let idx=0; idx<plan.cuts.length; idx++) {
    const c = plan.cuts[idx], ov = p.overrides?.[c.line];
    const item = ov?.cuts?.[c.subIndex];
    if (!item?.lock || !item._snapshot) continue;
    const saved = item._snapshot, shift = c.start-saved.cut.start;
    // Text/timing remain editable; frozen visual parameters and effects do not drift.
    plan.cuts[idx] = Object.assign(copy(saved.cut), {index:idx, line:c.line, subIndex:c.subIndex, text:c.text, lineText:c.lineText, start:c.start,end:c.end,dur:c.dur,locked:true,renderContext:copy(saved.context),lockedEvents:saved.events.map(e => ({...e,t:e.t+shift}))});
  }
};
J.renderPlanAt = (plan,t) => {
  const cut = J.cutAt(plan,t);
  return cut?.renderContext ? Object.assign({},plan,cut.renderContext,{events:cut.lockedEvents || plan.events}) : plan;
};
})();
