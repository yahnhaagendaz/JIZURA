/* The interrupted Antigravity stress suite used invalid preset IDs and a
 * superseded line-only lock contract. Its original is preserved in the handoff
 * backup. These tests exercise the actual current editing implementation. */
require('./test_editor_acceptance');
const assert = require('node:assert/strict');
const J = require('./tools/test_engine');
const p = J.defaultProject();
p.lyrics = '[00:00.00-00:04.00] First / second / third';
p.overrides = {0:{lock:true,hold:'invalid',cam:'invalid',enter:'spin'}};
let plan = J.plan(p);
J.upgradeLegacyLocks(p,plan);
plan = J.plan(p);
const baseline = JSON.stringify(plan.cuts.map(c=>[c.layout,c.enter,c.hold,c.cam,c.params,c.camP,c.renderContext]));
for(let n=0;n<50;n++) {
 Object.assign(p,J.omakase(p,J.rng(n+900)));
 assert.equal(JSON.stringify(J.plan(p).cuts.map(c=>[c.layout,c.enter,c.hold,c.cam,c.params,c.camP,c.renderContext])),baseline);
}
console.log('PASS legacy invalid preset fallback is frozen on migration across 50 Omakase runs');
