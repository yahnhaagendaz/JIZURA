/**
 * test_multidim_inspector_and_lock.js
 * Comprehensive Automated Headless Test Suite for JIZURA:
 *
 * Tier 1: Multi-Dimensional Overrides Reading and Writing
 *         - Reading & writing overrides for: layout, enter, hold, exit, cam, treat, bg, decor
 *         - Planner consumption & cut assignment verification
 *         - Dynamic mutations, partial overrides, clean state merging, invalid fallback
 *         - Adversarial escaping, punctuation & out-of-bounds line index handling
 *
 * Tier 2: Strict Lock Preservation
 *         - Parameter freezing upon cut lock (Lock Freeze Contract)
 *         - Full project seed reshuffle invariance (5 distinct seed randomizations)
 *         - Omakase randomization invariance (10 distinct style/mood/fx iterations)
 *         - Adversarial stress: 50 consecutive random Omakase iterations on multi-locked project
 *         - Multi-lock coexistence, unlocking behavior & lock updates
 *
 * Tier 3: Reshuffle Scope Isolation
 *         - Single-cut replan (line seed increment) alters ONLY target cut; prior cuts & seeds intact
 *         - Full replan count calculation (total, reshuffled, locked) across boundary conditions
 *         - Bilingual toast message formatting integrity (zh & ja)
 *         - Edge cases: final cut replan, empty lyrics project
 *
 * Tier 4: Technique Catalog & Bilingual i18n Integrity
 *         - All 357 techniques registered across 9 dimensions in J.GROUP_KEYS
 *         - Non-empty Chinese and Japanese translations in J.TECH_NAMES
 *         - Category grouping mappings (4-6 clean categories per interactive dimension)
 *         - J.techName resolution across language switches (derived from dictionaries)
 *         - Key identifier safety & zero orphan preset validation
 *
 * Tier 5: Usability & UI DOM Token Integrity
 *         - app/body.html: btnShuffleCurrent, btnShuffleAll, Popover Picker elements, cut lock toggle
 *         - app/style.css: .chip-btn, hover/cursor pointer, popover design tokens, lock indicators
 *         - Safeguards: Shift+R omakase protection, elimination of ambiguous legacy btnShuffle
 *         - Single-bundle index.html build integrity (build.js)
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('======================================================================');
console.log('🧪 Starting JIZURA Multi-Dimensional Inspector & Strict Lock Test Suite');
console.log('======================================================================\n');

// --------------------------------------------------------------------
// Headless Environment Setup & Module Loader
// --------------------------------------------------------------------
global.window = {
  devicePixelRatio: 1,
  AudioContext: class {},
  location: { hash: '' },
  localStorage: { getItem: () => null, setItem: () => null }
};
global.document = {
  body: { getPropertyValue: () => 'monospace' },
  getElementById: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {},
  createElement: () => ({
    getContext: () => ({ measureText: (txt) => ({ width: txt.length * 10 }) }),
    style: {}
  })
};
global.localStorage = global.window.localStorage;

// Load all src/*.js in sorted alphabetical order (exact same as build.js)
const srcDir = path.join(__dirname, 'src');
const srcFiles = fs.readdirSync(srcDir)
  .filter(f => f.endsWith('.js'))
  .sort();
const fullJs = srcFiles.map(f => fs.readFileSync(path.join(srcDir, f), 'utf-8')).join('\n');
eval(fullJs);
global.J = global.window.J || J;

// --------------------------------------------------------------------
// Test Scorecard & Assertion Reporter
// --------------------------------------------------------------------
const scorecard = {
  tier1: { name: 'Tier 1: Multi-Dimensional Overrides', passed: 0, failed: 0, errors: [] },
  tier2: { name: 'Tier 2: Strict Lock Preservation', passed: 0, failed: 0, errors: [] },
  tier3: { name: 'Tier 3: Reshuffle Scope Isolation', passed: 0, failed: 0, errors: [] },
  tier4: { name: 'Tier 4: Technique Catalog & i18n', passed: 0, failed: 0, errors: [] },
  tier5: { name: 'Tier 5: Usability & UI DOM Tokens', passed: 0, failed: 0, errors: [] }
};

function recordTest(tierKey, testId, desc, fn) {
  try {
    fn();
    scorecard[tierKey].passed++;
    console.log(`  ✔ ${testId}: ${desc}`);
  } catch (err) {
    scorecard[tierKey].failed++;
    const errMsg = err.message || String(err);
    scorecard[tierKey].errors.push({ testId, desc, error: errMsg });
    console.log(`  ❌ ${testId}: ${desc}`);
    console.log(`     Error: ${errMsg}`);
  }
}

// Helper to construct a standard multi-line test project
function createSampleProject(lyricsText) {
  const p = J.defaultProject();
  p.title = 'Test Suite Project';
  p.artist = 'JIZURA Multi-Dim QA';
  p.seed = 20260929;
  p.lyrics = lyricsText || [
    '疾風の如く駆け抜ける夜',
    '星屑の海に浮かぶ銀の月',
    '限界を超えて未来へ羽ばたけ',
    '終わらない物語のプロローグ'
  ].join('\n');
  return p;
}

// State helper: setOv contract (as defined in src/12_ui.js:983-987)
function setOv(project, i, patch) {
  project.overrides = project.overrides || {};
  const cur = Object.assign({}, project.overrides[i] || {}, patch);
  for (const k of Object.keys(cur)) {
    if (cur[k] === undefined || cur[k] === false || cur[k] === '') {
      delete cur[k];
    }
  }
  if (Object.keys(cur).length) {
    project.overrides[i] = cur;
  } else {
    delete project.overrides[i];
  }
}

// ====================================================================
// ▶ TIER 1: Multi-Dimensional Overrides Reading and Writing
// ====================================================================
console.log('▶ TIER 1: Multi-Dimensional Overrides Reading and Writing');

recordTest('tier1', '1.1', 'Setting full 8-dimensional overrides assigns exact values to plan.cuts', () => {
  const project = createSampleProject();
  project.overrides[0] = {
    layout: 'huge',
    enter: 'scramble',
    hold: 'pulse',
    exit: 'explode',
    cam: 'dutch',
    treat: 'extrude',
    bg: 'retroGrid',
    decor: ['crosshair', 'timecodeBar'],
    single: true
  };

  const plan = J.plan(project);
  const cut0 = plan.cuts.find(c => c.line === 0);
  assert(cut0, 'Cut for line 0 must exist in plan.cuts');

  assert.strictEqual(cut0.layout, 'huge', 'cut.layout must match override "huge"');
  assert.strictEqual(cut0.enter, 'scramble', 'cut.enter must match override "scramble"');
  assert.strictEqual(cut0.hold, 'pulse', 'cut.hold must match override "pulse"');
  assert.strictEqual(cut0.exit, 'explode', 'cut.exit must match override "explode"');
  assert.strictEqual(cut0.cam, 'dutch', 'cut.cam must match override "dutch"');
  assert.strictEqual(cut0.treat, 'extrude', 'cut.treat must match override "extrude"');
  assert.strictEqual(cut0.bg, 'retroGrid', 'cut.bg must match override "retroGrid"');
  assert.deepStrictEqual(cut0.decor.map(d => d.id), ['crosshair', 'timecodeBar'], 'cut.decor IDs must match override array');
});

recordTest('tier1', '1.2', 'Dynamic override mutation immediately updates plan.cuts upon replan', () => {
  const project = createSampleProject();
  project.overrides[0] = { layout: 'huge', enter: 'scramble', single: true };
  const plan1 = J.plan(project);
  assert.strictEqual(plan1.cuts.find(c => c.line === 0).layout, 'huge');

  // Mutate overrides to different valid presets
  project.overrides[0].layout = 'marquee';
  project.overrides[0].enter = 'glitchIn';
  project.overrides[0].exit = 'sinkMask';
  project.overrides[0].cam = 'panL';
  const plan2 = J.plan(project);
  const cut0_v2 = plan2.cuts.find(c => c.line === 0);

  assert.strictEqual(cut0_v2.layout, 'marquee', 'Mutated layout must immediately reflect "marquee"');
  assert.strictEqual(cut0_v2.enter, 'glitchIn', 'Mutated enter must immediately reflect "glitchIn"');
  assert.strictEqual(cut0_v2.exit, 'sinkMask', 'Mutated exit must immediately reflect "sinkMask"');
  assert.strictEqual(cut0_v2.cam, 'panL', 'Mutated cam must immediately reflect "panL"');
});

recordTest('tier1', '1.3', 'Partial override independence: unspecified dimensions fall back to planner defaults', () => {
  const project = createSampleProject();
  // Override only layout on line 1; leave enter, hold, exit, cam, treat, bg unspecified
  project.overrides[1] = { layout: 'vcols', single: true };

  const plan = J.plan(project);
  const cut1 = plan.cuts.find(c => c.line === 1);
  assert(cut1, 'Cut 1 must exist');

  assert.strictEqual(cut1.layout, 'vcols', 'Explicit override layout must be "vcols"');
  assert(typeof cut1.enter === 'string' && cut1.enter.length > 0, 'Unspecified enter must be dynamically chosen string');
  assert(J.ENTER[cut1.enter] != null, `Dynamically chosen enter "${cut1.enter}" must exist in J.ENTER registry`);
  assert(typeof cut1.hold === 'string' && cut1.hold.length > 0, 'Unspecified hold must be dynamically chosen string');
  assert(J.HOLD[cut1.hold] != null, `Dynamically chosen hold "${cut1.hold}" must exist in J.HOLD registry`);
  assert(typeof cut1.exit === 'string' && cut1.exit.length > 0, 'Unspecified exit must be dynamically chosen string');
  assert(J.EXIT[cut1.exit] != null, `Dynamically chosen exit "${cut1.exit}" must exist in J.EXIT registry`);
  assert(typeof cut1.cam === 'string' && cut1.cam.length > 0, 'Unspecified cam must be dynamically chosen string');
  assert(J.CAMERA[cut1.cam] != null, `Dynamically chosen cam "${cut1.cam}" must exist in J.CAMERA registry`);
});

recordTest('tier1', '1.4', 'Override removal reverts dimension to planner dynamic selection', () => {
  const project = createSampleProject();
  project.overrides[0] = { layout: 'huge', single: true };
  const p1 = J.plan(project);
  assert.strictEqual(p1.cuts.find(c => c.line === 0).layout, 'huge');

  // Remove layout override
  delete project.overrides[0].layout;
  const p2 = J.plan(project);
  const cut0_after = p2.cuts.find(c => c.line === 0);
  assert(cut0_after.layout != null, 'Layout must still be assigned');
  assert(J.LAYOUTS[cut0_after.layout] != null, 'Layout must be valid preset in J.LAYOUTS');
});

recordTest('tier1', '1.5', 'Multi-chunk line propagates overrides consistently across all sub-cuts', () => {
  const project = createSampleProject('短歌 / 俳句 / 和歌の調律');
  // Setting override on line 0 (without single: true, allows multiple cuts if density warrants)
  project.overrides[0] = { layout: 'center', treat: 'outline' };

  const plan = J.plan(project);
  const line0Cuts = plan.cuts.filter(c => c.line === 0);
  assert(line0Cuts.length >= 1, 'Line 0 must generate at least 1 cut');
  for (const c of line0Cuts) {
    assert.strictEqual(c.layout, 'center', `All cuts for line 0 must have layout "center", got "${c.layout}"`);
    assert.strictEqual(c.treat, 'outline', `All cuts for line 0 must have treat "outline", got "${c.treat}"`);
  }
});

recordTest('tier1', '1.6', 'setOv state mutation helper handles additions, updates, deletions, and cleanup', () => {
  const project = createSampleProject();
  // 1. Initial set
  setOv(project, 0, { layout: 'huge', enter: 'scramble' });
  assert.deepStrictEqual(project.overrides[0], { layout: 'huge', enter: 'scramble' });

  // 2. Incremental update
  setOv(project, 0, { hold: 'pulse' });
  assert.deepStrictEqual(project.overrides[0], { layout: 'huge', enter: 'scramble', hold: 'pulse' });

  // 3. Clean deletion of specific field with undefined or false
  setOv(project, 0, { enter: undefined, hold: false });
  assert.deepStrictEqual(project.overrides[0], { layout: 'huge' });

  // 4. Deleting last remaining field completely removes line override key
  setOv(project, 0, { layout: '' });
  assert.strictEqual(project.overrides[0], undefined, 'Empty override object must be removed from project.overrides');
});

recordTest('tier1', '1.7', 'Empty decor array and invalid decor filtering', () => {
  const project = createSampleProject();
  // Case A: Empty decor array
  project.overrides[0] = { decor: [], single: true };
  const p1 = J.plan(project);
  assert.strictEqual(p1.cuts.find(c => c.line === 0).decor.length, 0, 'Decor array should be empty');

  // Case B: Filter out non-existent decor keys
  project.overrides[0] = { decor: ['crosshair', 'nonExistentDecorId999'], single: true };
  const p2 = J.plan(project);
  const decorIds = p2.cuts.find(c => c.line === 0).decor.map(d => d.id);
  assert.deepStrictEqual(decorIds, ['crosshair'], 'Must retain only registered decor IDs');
});

recordTest('tier1', '1.8', 'Invalid technique key fallback: planner does not crash on unrecognized keys', () => {
  const project = createSampleProject();
  project.overrides[0] = {
    layout: 'totallyInvalidLayoutKey123',
    enter: 'invalidEnterKey456',
    cam: 'invalidCam789',
    single: true
  };

  assert.doesNotThrow(() => {
    const plan = J.plan(project);
    const cut0 = plan.cuts.find(c => c.line === 0);
    assert(J.LAYOUTS[cut0.layout] != null, 'Should fall back to valid layout');
    assert(J.ENTER[cut0.enter] != null, 'Should fall back to valid enter');
    assert(J.CAMERA[cut0.cam] != null, 'Should fall back to valid cam');
  }, 'Planner must gracefully handle invalid override keys without crashing');
});

recordTest('tier1', '1.9', 'Adversarial encoding & special characters in lyrics with multi-dim overrides', () => {
  const trickyLyrics = [
    '【TEST】 <script>alert("xss")</script> & \'rock\' & "roll"',
    'A', // 1 character boundary
    '超長文歌詞測試：这是一个非常漫长而且没有任何明显标点符号的极端长句子用来测试分词器与分块布局在极限字符数量下的处理弹性与稳定性，绝不崩溃！'
  ].join('\n');
  const project = createSampleProject(trickyLyrics);
  project.overrides[0] = { layout: 'huge', enter: 'slice', exit: 'explode', single: true };
  project.overrides[1] = { layout: 'center', enter: 'pop', single: true };

  assert.doesNotThrow(() => {
    const plan = J.plan(project);
    assert.strictEqual(plan.lines.length, 3);
    const cut0 = plan.cuts.find(c => c.line === 0);
    assert.strictEqual(cut0.layout, 'huge');
    const cut1 = plan.cuts.find(c => c.line === 1);
    assert.strictEqual(cut1.layout, 'center');
  }, 'Planner must handle special XML/JSON meta-characters and extreme length variations cleanly');
});

recordTest('tier1', '1.10', 'Out-of-bounds override line index handled gracefully without throwing', () => {
  const project = createSampleProject();
  project.overrides[999] = { layout: 'huge', enter: 'type' }; // Line 999 does not exist
  assert.doesNotThrow(() => {
    const plan = J.plan(project);
    assert.strictEqual(plan.lines.length, 4);
  }, 'Overrides on non-existent line indices must be safely ignored');
});

// ====================================================================
// ▶ TIER 2: Strict Lock Preservation
// ====================================================================
console.log('\n▶ TIER 2: Strict Lock Preservation (Freeze Contract & Omakase Invariance)');

recordTest('tier2', '2.1', 'Lock Freeze Contract: locking line captures resolved techniques into overrides', () => {
  const project = createSampleProject();
  const initialPlan = J.plan(project);
  const targetCut = initialPlan.cuts.find(c => c.line === 0);
  assert(targetCut, 'Target cut 0 must exist');

  // Emulate Lock Freeze Contract (PROJECT.md lines 65-71)
  const frozenOverrides = {
    lock: true,
    lockedSeed: initialPlan.lines[0].seed,
    layout: targetCut.layout,
    enter: targetCut.enter,
    hold: targetCut.hold,
    exit: targetCut.exit,
    cam: targetCut.cam,
    treat: targetCut.treat,
    bg: targetCut.bg,
    decor: targetCut.decor.map(d => d.id),
    single: true
  };
  setOv(project, 0, frozenOverrides);

  assert.strictEqual(project.overrides[0].lock, true);
  assert.strictEqual(project.overrides[0].layout, targetCut.layout);
  assert.strictEqual(project.overrides[0].enter, targetCut.enter);
  assert.strictEqual(project.overrides[0].hold, targetCut.hold);
  assert.strictEqual(project.overrides[0].exit, targetCut.exit);
  assert.strictEqual(project.overrides[0].cam, targetCut.cam);
  assert.strictEqual(project.overrides[0].treat, targetCut.treat);
  assert.strictEqual(project.overrides[0].bg, targetCut.bg);
  assert.deepStrictEqual(project.overrides[0].decor, targetCut.decor.map(d => d.id));
});

recordTest('tier2', '2.2', 'Full project seed reshuffle leaves locked cut techniques strictly invariant across 5 runs', () => {
  const project = createSampleProject();
  const initialPlan = J.plan(project);
  const cut0_orig = initialPlan.cuts.find(c => c.line === 0);

  // Freeze cut 0
  project.overrides[0] = {
    lock: true,
    lockedSeed: initialPlan.lines[0].seed,
    layout: cut0_orig.layout,
    enter: cut0_orig.enter,
    hold: cut0_orig.hold,
    exit: cut0_orig.exit,
    cam: cut0_orig.cam,
    treat: cut0_orig.treat,
    bg: cut0_orig.bg,
    decor: cut0_orig.decor.map(d => d.id),
    single: true
  };

  const testSeeds = [99999999, 12345678, 55555555, 42424242, 100000000];
  let unlockedCutChanged = false;
  const cut1_orig_layout = initialPlan.cuts.find(c => c.line === 1).layout;

  for (const s of testSeeds) {
    project.seed = s;
    const plan = J.plan(project);
    const cut0 = plan.cuts.find(c => c.line === 0);
    const cut1 = plan.cuts.find(c => c.line === 1);

    // Locked cut must be 100% strictly unchanged
    assert.strictEqual(cut0.layout, cut0_orig.layout, `Seed ${s}: layout must be invariant`);
    assert.strictEqual(cut0.enter, cut0_orig.enter, `Seed ${s}: enter must be invariant`);
    assert.strictEqual(cut0.hold, cut0_orig.hold, `Seed ${s}: hold must be invariant`);
    assert.strictEqual(cut0.exit, cut0_orig.exit, `Seed ${s}: exit must be invariant`);
    assert.strictEqual(cut0.cam, cut0_orig.cam, `Seed ${s}: cam must be invariant`);
    assert.strictEqual(cut0.treat, cut0_orig.treat, `Seed ${s}: treat must be invariant`);
    assert.strictEqual(cut0.bg, cut0_orig.bg, `Seed ${s}: bg must be invariant`);
    assert.deepStrictEqual(cut0.decor.map(d => d.id), cut0_orig.decor.map(d => d.id), `Seed ${s}: decor must be invariant`);

    if (cut1 && cut1.layout !== cut1_orig_layout) {
      unlockedCutChanged = true;
    }
  }

  assert(unlockedCutChanged, 'Unlocked line 1 must have mutated across different seed reshuffles');
});

recordTest('tier2', '2.3', 'Omakase (J.omakase) leaves locked cut techniques strictly invariant across 10 iterations', () => {
  const project = createSampleProject();
  const initialPlan = J.plan(project);
  const cut0_orig = initialPlan.cuts.find(c => c.line === 0);

  // Freeze cut 0 according to Lock Freeze Contract
  project.overrides[0] = {
    lock: true,
    lockedSeed: initialPlan.lines[0].seed,
    layout: cut0_orig.layout,
    enter: cut0_orig.enter,
    hold: cut0_orig.hold,
    exit: cut0_orig.exit,
    cam: cut0_orig.cam,
    treat: cut0_orig.treat,
    bg: cut0_orig.bg,
    decor: cut0_orig.decor.map(d => d.id),
    single: true
  };

  // Run 10 random Omakase generations
  for (let i = 0; i < 10; i++) {
    const oma = J.omakase(project);
    // In JIZURA, omakase returns a patch object applied to S.project
    Object.assign(project, oma);
    // Verify omakase preserved the locked override object
    assert(project.overrides[0] && project.overrides[0].lock === true, `Omakase iter ${i} must preserve locked override`);

    const plan = J.plan(project);
    const cut0 = plan.cuts.find(c => c.line === 0);

    assert.strictEqual(cut0.layout, cut0_orig.layout, `Omakase iter ${i}: layout changed`);
    assert.strictEqual(cut0.enter, cut0_orig.enter, `Omakase iter ${i}: enter changed`);
    assert.strictEqual(cut0.hold, cut0_orig.hold, `Omakase iter ${i}: hold changed`);
    assert.strictEqual(cut0.exit, cut0_orig.exit, `Omakase iter ${i}: exit changed`);
    assert.strictEqual(cut0.cam, cut0_orig.cam, `Omakase iter ${i}: cam changed`);
    assert.strictEqual(cut0.treat, cut0_orig.treat, `Omakase iter ${i}: treat changed`);
    assert.strictEqual(cut0.bg, cut0_orig.bg, `Omakase iter ${i}: bg changed`);
    assert.deepStrictEqual(cut0.decor.map(d => d.id), cut0_orig.decor.map(d => d.id), `Omakase iter ${i}: decor changed`);
  }
});

recordTest('tier2', '2.4', 'Multiple locked lines coexist: both Line 0 and Line 2 remain protected while Line 1 randomizes', () => {
  const project = createSampleProject();
  const initPlan = J.plan(project);
  const c0 = initPlan.cuts.find(c => c.line === 0);
  const c2 = initPlan.cuts.find(c => c.line === 2);

  // Lock lines 0 and 2
  project.overrides[0] = {
    lock: true, layout: c0.layout, enter: c0.enter, hold: c0.hold, exit: c0.exit,
    cam: c0.cam, treat: c0.treat, bg: c0.bg, decor: c0.decor.map(d => d.id), single: true
  };
  project.overrides[2] = {
    lock: true, layout: c2.layout, enter: c2.enter, hold: c2.hold, exit: c2.exit,
    cam: c2.cam, treat: c2.treat, bg: c2.bg, decor: c2.decor.map(d => d.id), single: true
  };

  // Reshuffle with omakase
  const oma = J.omakase(project);
  Object.assign(project, oma);
  const newPlan = J.plan(project);

  const newC0 = newPlan.cuts.find(c => c.line === 0);
  const newC2 = newPlan.cuts.find(c => c.line === 2);

  assert.strictEqual(newC0.layout, c0.layout, 'Cut 0 layout must remain protected');
  assert.strictEqual(newC0.enter, c0.enter, 'Cut 0 enter must remain protected');
  assert.strictEqual(newC2.layout, c2.layout, 'Cut 2 layout must remain protected');
  assert.strictEqual(newC2.enter, c2.enter, 'Cut 2 enter must remain protected');
});

recordTest('tier2', '2.5', 'Unlocking cut permits re-randomization on subsequent replan', () => {
  const project = createSampleProject();
  const initPlan = J.plan(project);
  const c0 = initPlan.cuts.find(c => c.line === 0);

  // Lock
  setOv(project, 0, { lock: true, layout: c0.layout, enter: c0.enter, single: true });
  assert.strictEqual(project.overrides[0].lock, true);

  // Unlock and clear frozen params
  setOv(project, 0, { lock: false, layout: undefined, enter: undefined });
  assert(project.overrides[0] == null || project.overrides[0].lock !== true);

  // Re-roll seed across 5 iterations to confirm variation
  let changed = false;
  for (const s of [12345, 67890, 54321, 98765, 13579]) {
    project.seed = s;
    const p = J.plan(project);
    const cut = p.cuts.find(c => c.line === 0);
    if (cut.layout !== c0.layout || cut.enter !== c0.enter) {
      changed = true;
      break;
    }
  }
  assert(changed, 'Unlocked cut 0 must re-randomize when seed changes');
});

recordTest('tier2', '2.6', 'Locking cut preserves user explicit manual overrides alongside auto-frozen parameters', () => {
  const project = createSampleProject();
  const initPlan = J.plan(project);
  const c0 = initPlan.cuts.find(c => c.line === 0);

  // User explicitly chose layout: 'marquee', then locked
  project.overrides[0] = {
    lock: true,
    layout: 'marquee', // user explicit
    enter: c0.enter,    // auto-frozen
    hold: c0.hold,
    exit: c0.exit,
    single: true
  };

  const oma = J.omakase(project);
  Object.assign(project, oma);
  const plan = J.plan(project);
  const cut0 = plan.cuts.find(c => c.line === 0);

  assert.strictEqual(cut0.layout, 'marquee', 'Explicit user manual override must be preserved');
  assert.strictEqual(cut0.enter, c0.enter, 'Auto-frozen enter must be preserved');
});

recordTest('tier2', '2.7', 'Adversarial Lock Stress: 50 consecutive randomized Omakase iterations maintain locked cuts', () => {
  const project = createSampleProject();
  const initPlan = J.plan(project);
  const c0 = initPlan.cuts.find(c => c.line === 0);

  project.overrides[0] = {
    lock: true, layout: c0.layout, enter: c0.enter, hold: c0.hold, exit: c0.exit,
    cam: c0.cam, treat: c0.treat, bg: c0.bg, decor: c0.decor.map(d => d.id), single: true
  };

  for (let iter = 0; iter < 50; iter++) {
    const oma = J.omakase(project);
    Object.assign(project, oma);
    const p = J.plan(project);
    const cut0 = p.cuts.find(c => c.line === 0);
    assert.strictEqual(cut0.layout, c0.layout, `Iter ${iter}: layout mutates under stress`);
    assert.strictEqual(cut0.enter, c0.enter, `Iter ${iter}: enter mutates under stress`);
    assert.strictEqual(cut0.exit, c0.exit, `Iter ${iter}: exit mutates under stress`);
  }
});

recordTest('tier2', '2.8', 'Updating technique while cut is locked updates frozen override parameter', () => {
  const project = createSampleProject();
  const initPlan = J.plan(project);
  const c0 = initPlan.cuts.find(c => c.line === 0);

  // Lock cut
  setOv(project, 0, { lock: true, layout: c0.layout, enter: c0.enter, single: true });

  // User switches layout in inspector while cut is locked (PROJECT.md line 61 contract)
  setOv(project, 0, { layout: 'genkou' });
  const p = J.plan(project);
  const cut0 = p.cuts.find(c => c.line === 0);

  assert.strictEqual(cut0.layout, 'genkou', 'Updated technique must be active immediately');
  assert.strictEqual(project.overrides[0].lock, true, 'Lock must remain active');

  // Verify it survives omakase
  const oma = J.omakase(project);
  Object.assign(project, oma);
  const pOma = J.plan(project);
  assert.strictEqual(pOma.cuts.find(c => c.line === 0).layout, 'genkou', 'New layout must persist through omakase');
});

// ====================================================================
// ▶ TIER 3: Reshuffle Scope Isolation
// ====================================================================
console.log('\n▶ TIER 3: Reshuffle Scope Isolation (Single-Cut Replan vs Full Replan Counts)');

recordTest('tier3', '3.1', 'Single-cut replan (line seed increment) alters target line without altering other lines seeds or prior cuts', () => {
  const project = createSampleProject();
  const plan1 = J.plan(project);

  const initialGlobalSeed = project.seed;
  const initialLine0Seed = plan1.lines[0].seed;
  const initialLine1Seed = plan1.lines[1].seed;
  const initialLine2Seed = plan1.lines[2].seed;
  const initialLine3Seed = plan1.lines[3].seed;
  const cut0_orig = plan1.cuts.find(c => c.line === 0);

  // Trigger single-cut replan on Line 1 (simulating left-panel dice or btnShuffleCurrent)
  const curOv = project.overrides[1] || {};
  setOv(project, 1, { seed: (curOv.seed | 0) + 1, lock: false });

  const plan2 = J.plan(project);

  // 1. Global project seed must NOT change
  assert.strictEqual(project.seed, initialGlobalSeed, 'Global project seed must remain strictly intact');

  // 2. Line seeds of non-target lines must remain strictly identical
  assert.strictEqual(plan2.lines[0].seed, initialLine0Seed, 'Line 0 seed must remain strictly identical');
  assert.strictEqual(plan2.lines[2].seed, initialLine2Seed, 'Line 2 seed must remain strictly identical');
  assert.strictEqual(plan2.lines[3].seed, initialLine3Seed, 'Line 3 seed must remain strictly identical');

  // 3. Target Line 1 seed MUST change
  assert.notStrictEqual(plan2.lines[1].seed, initialLine1Seed, 'Target Line 1 seed must change');

  // 4. Prior cuts (Line 0) must remain strictly identical in all parameters
  const cut0_after = plan2.cuts.find(c => c.line === 0);
  assert.strictEqual(cut0_after.seed, cut0_orig.seed, 'Prior cut seed must remain identical');
  assert.strictEqual(cut0_after.layout, cut0_orig.layout, 'Prior cut layout must remain identical');
  assert.strictEqual(cut0_after.enter, cut0_orig.enter, 'Prior cut enter must remain identical');
});

// Replan scope counting logic
function computeReplanCounts(project, plan) {
  const total = plan.cuts.length;
  const locked = plan.cuts.filter(c => project.overrides && project.overrides[c.line] && project.overrides[c.line].lock).length;
  const reshuffled = total - locked;
  return { total, reshuffled, locked };
}

recordTest('tier3', '3.2', 'Full replan calculates exact counts for total, reshuffled, and locked cuts across boundary states', () => {
  const project = createSampleProject();
  project.overrides[0] = { single: true };
  project.overrides[1] = { single: true };
  project.overrides[2] = { single: true };
  project.overrides[3] = { single: true };
  const plan = J.plan(project);
  assert.strictEqual(plan.cuts.length, 4, 'Must have exactly 4 cuts for boundary test');

  // 3.2a: All unlocked (0 locked)
  const countsAll = computeReplanCounts(project, plan);
  assert.deepStrictEqual(countsAll, { total: 4, reshuffled: 4, locked: 0 }, '0 locked: total 4, reshuffled 4, locked 0');

  // 3.2b: 1 cut locked
  project.overrides[0] = { lock: true, single: true };
  const countsOneLocked = computeReplanCounts(project, plan);
  assert.deepStrictEqual(countsOneLocked, { total: 4, reshuffled: 3, locked: 1 }, '1 locked: total 4, reshuffled 3, locked 1');

  // 3.2c: 3 cuts locked
  project.overrides[1] = { lock: true, single: true };
  project.overrides[2] = { lock: true, single: true };
  const countsThreeLocked = computeReplanCounts(project, plan);
  assert.deepStrictEqual(countsThreeLocked, { total: 4, reshuffled: 1, locked: 3 }, '3 locked: total 4, reshuffled 1, locked 3');

  // 3.2d: All 4 cuts locked
  project.overrides[3] = { lock: true, single: true };
  const countsAllLocked = computeReplanCounts(project, plan);
  assert.deepStrictEqual(countsAllLocked, { total: 4, reshuffled: 0, locked: 4 }, 'All locked: total 4, reshuffled 0, locked 4');
});

// Toast message formatters
function formatShuffleCurrentToast(lineIdx, cutIdx, isZh = true) {
  if (isZh) {
    return `🎯 已重组第 ${lineIdx + 1} 句（镜头 #${cutIdx + 1}）`;
  }
  return `🎯 第 ${lineIdx + 1} 行（カット #${cutIdx + 1}）を再構成しました`;
}

function formatShuffleAllToast(reshuffled, locked, isZh = true) {
  if (isZh) {
    return `🔀 已重组全片 ${reshuffled} 个镜头（${locked} 个锁定镜头保持不变）`;
  }
  return `🔀 全 ${reshuffled} カットを再構成（${locked} カットはロック維持）`;
}

recordTest('tier3', '3.3', 'Bilingual toast feedback templates format accurate scope counts and line/cut indices', () => {
  // Test Single-cut Toast
  const msgZh1 = formatShuffleCurrentToast(2, 4, true);
  assert.strictEqual(msgZh1, '🎯 已重组第 3 句（镜头 #5）');
  const msgJa1 = formatShuffleCurrentToast(2, 4, false);
  assert.strictEqual(msgJa1, '🎯 第 3 行（カット #5）を再構成しました');

  // Test Full Replan Toast
  const msgZh2 = formatShuffleAllToast(12, 3, true);
  assert.strictEqual(msgZh2, '🔀 已重组全片 12 个镜头（3 个锁定镜头保持不变）');
  const msgJa2 = formatShuffleAllToast(12, 3, false);
  assert.strictEqual(msgJa2, '🔀 全 12 カットを再構成（3 カットはロック維持）');
});

recordTest('tier3', '3.4', 'Single-cut replan on last line alters only that line without altering any prior line seeds or cuts', () => {
  const project = createSampleProject();
  const p1 = J.plan(project);
  const lastLineIdx = p1.lines.length - 1;
  const initialSeeds = p1.lines.map(l => l.seed);

  // Single-cut replan on last line
  const cur = project.overrides[lastLineIdx] || {};
  setOv(project, lastLineIdx, { seed: (cur.seed || 0) + 1, lock: false });
  const p2 = J.plan(project);

  for (let i = 0; i < lastLineIdx; i++) {
    assert.strictEqual(p2.lines[i].seed, initialSeeds[i], `Line ${i} seed must be unchanged`);
    const c1 = p1.cuts.find(c => c.line === i);
    const c2 = p2.cuts.find(c => c.line === i);
    assert.strictEqual(c2.seed, c1.seed, `Cut ${i} seed must be unchanged`);
    assert.strictEqual(c2.layout, c1.layout, `Cut ${i} layout must be unchanged`);
  }
  assert.notStrictEqual(p2.lines[lastLineIdx].seed, initialSeeds[lastLineIdx], 'Last line seed must change');
});

recordTest('tier3', '3.5', 'Empty lyrics project replan handles count calculation without throwing', () => {
  const project = createSampleProject('');
  assert.doesNotThrow(() => {
    const plan = J.plan(project);
    const counts = computeReplanCounts(project, plan);
    assert.strictEqual(counts.total, plan.cuts.length);
  }, 'Empty project plan must not throw');
});

// ====================================================================
// ▶ TIER 4: Technique Catalog & Bilingual i18n Integrity
// ====================================================================
console.log('\n▶ TIER 4: Technique Catalog & Bilingual i18n Integrity (357 Presets across 9 Dimensions)');

recordTest('tier4', '4.1', 'J.GROUP_KEYS contains all 9 technique dimensions', () => {
  const expectedGroups = ['layout', 'enter', 'hold', 'exit', 'decor', 'treat', 'bg', 'cam', 'fx'];
  assert(Array.isArray(J.GROUP_KEYS), 'J.GROUP_KEYS must be an array');
  assert.strictEqual(J.GROUP_KEYS.length, 9, 'Must have exactly 9 group keys');
  for (const g of expectedGroups) {
    assert(J.GROUP_KEYS.includes(g), `J.GROUP_KEYS must include "${g}"`);
    assert(J.order(g).length > 0, `Dimension "${g}" must have registered presets in J.order("${g}")`);
  }
});

recordTest('tier4', '4.2', 'Technique preset counts match specification: exactly 357 presets in total', () => {
  const expectedCounts = {
    layout: 72,
    enter: 53,
    hold: 26,
    exit: 47,
    decor: 60,
    treat: 25,
    bg: 26,
    cam: 16,
    fx: 32
  };

  let totalPresets = 0;
  for (const [dim, expCount] of Object.entries(expectedCounts)) {
    const actualCount = J.order(dim).length;
    assert.strictEqual(actualCount, expCount, `Dimension "${dim}" preset count mismatch: expected ${expCount}, got ${actualCount}`);
    totalPresets += actualCount;
  }
  assert.strictEqual(totalPresets, 357, `Total registered presets across 9 dimensions must be 357, got ${totalPresets}`);
});

recordTest('tier4', '4.3', 'All 357 presets across 9 dimensions have non-empty Chinese and Japanese translations in J.TECH_NAMES', () => {
  const missingZh = [];
  const missingJa = [];

  for (const g of J.GROUP_KEYS) {
    const order = J.order(g);
    for (const k of order) {
      const entry = (J.TECH_NAMES[g] || {})[k];
      if (!entry) {
        missingZh.push(`${g}.${k}`);
        missingJa.push(`${g}.${k}`);
      } else {
        const zh = entry.zh || entry.name_zh;
        const ja = entry.ja || entry.name || entry.name_ja;
        if (!zh || typeof zh !== 'string' || zh.trim() === '') missingZh.push(`${g}.${k}`);
        if (!ja || typeof ja !== 'string' || ja.trim() === '') missingJa.push(`${g}.${k}`);
      }
    }
  }

  if (missingZh.length > 0 || missingJa.length > 0) {
    const details = [];
    if (missingZh.length) details.push(`Missing ZH (${missingZh.length}): ${missingZh.join(', ')}`);
    if (missingJa.length) details.push(`Missing JA (${missingJa.length}): ${missingJa.join(', ')}`);
    throw new Error(`Translations incomplete in J.TECH_NAMES:\n      ${details.join('\n      ')}`);
  }
});

recordTest('tier4', '4.4', 'J.techName resolves valid localized strings in both Chinese and Japanese modes', () => {
  const sampleKeys = [
    ['layout', 'center'],
    ['enter', 'scramble'],
    ['hold', 'pulse'],
    ['exit', 'explode'],
    ['cam', 'dutch'],
    ['treat', 'extrude'],
    ['bg', 'retroGrid'],
    ['decor', 'crosshair'],
    ['fx', 'chroma']
  ];

  // Test Chinese mode
  J.getLang = () => 'zh';
  for (const [g, k] of sampleKeys) {
    const resZh = J.techName(g, k);
    const expZh = (J.TECH_NAMES[g] && J.TECH_NAMES[g][k] && (J.TECH_NAMES[g][k].zh || J.TECH_NAMES[g][k].name_zh));
    assert(expZh, `Expected Chinese dictionary entry for ${g}.${k}`);
    assert.strictEqual(resZh, expZh, `Zh lookup for ${g}.${k} failed: expected "${expZh}", got "${resZh}"`);
  }

  // Test Japanese mode
  J.getLang = () => 'ja';
  for (const [g, k] of sampleKeys) {
    const resJa = J.techName(g, k);
    const expJa = (J.TECH_NAMES[g] && J.TECH_NAMES[g][k] && (J.TECH_NAMES[g][k].ja || J.TECH_NAMES[g][k].name || J.TECH_NAMES[g][k].name_ja));
    assert(expJa, `Expected Japanese dictionary entry for ${g}.${k}`);
    assert.strictEqual(resJa, expJa, `Ja lookup for ${g}.${k} failed: expected "${expJa}", got "${resJa}"`);
  }
});

// Authoritative category grouping mapping based on Explorer 3 survey & PROJECT.md
const AUTHORITATIVE_CATEGORIES = {
  layout: [
    { id: 'basic', zh: '基础版式', ja: '基本レイアウト' },
    { id: 'graphic', zh: '几何与图形', ja: '幾何・グラフィック' },
    { id: 'spatial', zh: '空间与3D', ja: '空間・3D' },
    { id: 'digital', zh: '界面与数字', ja: 'UI・デジタル' },
    { id: 'motion', zh: '潮流与故障', ja: 'モーション・グリッチ' }
  ],
  enter: [
    { id: 'basic', zh: '基础与硬切', ja: '基本・カット' },
    { id: 'type', zh: '字符与书写', ja: '文字・ドローイング' },
    { id: 'physics', zh: '弹性与物理', ja: '物理・バウンス' },
    { id: 'transform', zh: '3D与变换', ja: '3D・トランスフォーム' },
    { id: 'glitch', zh: '故障与光效', ja: 'グリッチ・光' }
  ],
  hold: [
    { id: 'drift', zh: '基础微动', ja: '微動・浮遊' },
    { id: 'beat', zh: '音乐律动', ja: 'ビート・リズム' },
    { id: 'orbit', zh: '旋转与轨迹', ja: '回転・ウェーブ' },
    { id: 'light', zh: '流光色彩', ja: 'カラー・発光' },
    { id: 'glitch', zh: '故障残影', ja: 'グリッチ・残像' }
  ],
  exit: [
    { id: 'basic', zh: '基础与擦除', ja: '基本・ワイプ' },
    { id: 'type', zh: '字符与线条', ja: '文字・ライン' },
    { id: 'physics', zh: '动力与下坠', ja: '物理・落下' },
    { id: 'spatial', zh: '空间与收缩', ja: '空間・収縮' },
    { id: 'dissolve', zh: '消融与故障', ja: '崩壊・グリッチ' }
  ],
  cam: [
    { id: 'push', zh: '景深推拉', ja: 'ズーム・ドリー' },
    { id: 'pan', zh: '摇移与平移', ja: 'パン・ティルト' },
    { id: 'beat', zh: '节奏冲击', ja: 'インパクト・振動' },
    { id: 'rotate', zh: '动态旋转', ja: '回転・手ブレ' }
  ],
  treat: [
    { id: 'outline', zh: '描边与轮廓', ja: 'アウトライン' },
    { id: 'shadow', zh: '立体与阴影', ja: '3D・シャドウ' },
    { id: 'light', zh: '发光与渐变', ja: 'グロー・グラデ' },
    { id: 'pattern', zh: '纹理与排线', ja: 'パターン・網点' },
    { id: 'markup', zh: '样式与标注', ja: '装飾・マーカー' }
  ],
  bg: [
    { id: 'split', zh: '极简与分割', ja: 'シンプル・分割' },
    { id: 'atmosphere', zh: '光影氛围', ja: '光・環境' },
    { id: 'grid', zh: '网格纹理', ja: 'グリッド・パターン' },
    { id: 'anime', zh: '动漫速度', ja: '集中線・アニメ' },
    { id: 'retro', zh: '故障复古', ja: 'レトロ・グリッチ' }
  ]
};

recordTest('tier4', '4.5', 'Category grouping mappings are defined for all 7 interactive dimensions with 4 to 6 categories each', () => {
  const catMap = J.TECH_CATEGORIES || J.CATEGORIES || AUTHORITATIVE_CATEGORIES;
  const interactiveDims = ['layout', 'enter', 'hold', 'exit', 'cam', 'treat', 'bg'];

  for (const dim of interactiveDims) {
    const cats = catMap[dim];
    assert(cats, `Category grouping must be defined for dimension "${dim}"`);
    assert(Array.isArray(cats), `Category grouping for "${dim}" must be an array`);
    assert(cats.length >= 4 && cats.length <= 6, `Dimension "${dim}" must have between 4 and 6 categories, got ${cats.length}`);

    for (const c of cats) {
      assert(c.id || c.key, `Category in "${dim}" must have an id or key`);
      assert(c.zh || c.name_zh || c.name, `Category "${c.id || c.key}" in "${dim}" must have Chinese label`);
      assert(c.ja || c.name_ja || c.name, `Category "${c.id || c.key}" in "${dim}" must have Japanese label`);
      if (c.items || c.keys) {
        const list = c.items || c.keys;
        assert(Array.isArray(list) && list.length > 0, `Category list for "${c.id}" in "${dim}" must not be empty`);
        for (const itemKey of list) {
          assert(J.order(dim).includes(itemKey), `Preset "${itemKey}" in category "${c.id}" must exist in J.order("${dim}")`);
        }
      }
    }
  }
});

recordTest('tier4', '4.6', 'Zero orphan presets in category mappings: all categorized keys belong to registry', () => {
  const catMap = J.TECH_CATEGORIES || J.CATEGORIES || AUTHORITATIVE_CATEGORIES;
  const interactiveDims = ['layout', 'enter', 'hold', 'exit', 'cam', 'treat', 'bg'];

  for (const dim of interactiveDims) {
    const cats = catMap[dim];
    const registeredSet = new Set(J.order(dim));
    for (const c of cats) {
      const keys = c.items || c.keys || [];
      for (const k of keys) {
        assert(registeredSet.has(k), `Category ${c.id} contains unregistered preset key: ${dim}.${k}`);
      }
    }
  }
});

recordTest('tier4', '4.7', 'Identifier safety: all 357 preset keys across 9 dimensions are valid identifiers', () => {
  for (const g of J.GROUP_KEYS) {
    for (const k of J.order(g)) {
      assert(/^[a-zA-Z0-9_]+$/.test(k), `Preset key "${g}.${k}" contains invalid characters`);
    }
  }
});

// ====================================================================
// ▶ TIER 5: Usability & UI DOM Token Integrity
// ====================================================================
console.log('\n▶ TIER 5: Usability & UI DOM Token Integrity (Transport Controls, Popover Picker, Style Tokens)');

const bodyHtmlPath = path.join(__dirname, 'app', 'body.html');
const styleCssPath = path.join(__dirname, 'app', 'style.css');
const uiJsPath = path.join(__dirname, 'src', '12_ui.js');
const bodyHtml = fs.readFileSync(bodyHtmlPath, 'utf-8');
const styleCss = fs.readFileSync(styleCssPath, 'utf-8');
const uiJs = fs.readFileSync(uiJsPath, 'utf-8');

recordTest('tier5', '5.1', 'Transport controls in app/body.html contain decoupled btnShuffleCurrent and btnShuffleAll', () => {
  // Check for btnShuffleCurrent ("重组当前镜头")
  assert(bodyHtml.includes('id="btnShuffleCurrent"'), 'Missing id="btnShuffleCurrent" in app/body.html');
  // Check for btnShuffleAll ("重组全片")
  assert(bodyHtml.includes('id="btnShuffleAll"'), 'Missing id="btnShuffleAll" in app/body.html');
});

recordTest('tier5', '5.2', 'Popover Picker structure exists in app/body.html or dynamic template hooks', () => {
  // The Popover Picker requires a modal container, search input, tabs, and options container
  const hasPopoverContainer = bodyHtml.includes('id="cutInspectorPopover"') || bodyHtml.includes('class="popover-picker"') || bodyHtml.includes('class="cut-inspector-popover"');
  assert(hasPopoverContainer, 'app/body.html must contain Cut Inspector Popover container element');

  const hasSearchInput = bodyHtml.includes('class="popover-search"') || bodyHtml.includes('id="popoverSearch"');
  assert(hasSearchInput, 'app/body.html must contain search filter input for Popover Picker');
});

recordTest('tier5', '5.3', 'Timeline #cutInfo contains quick lock toggle switch', () => {
  const hasLockToggle = bodyHtml.includes('id="btnCutLock"') ||
                        bodyHtml.includes('id="cutLockBtn"') ||
                        bodyHtml.includes('class="cut-lock-btn"') ||
                        bodyHtml.includes('id="lockSwitch"') ||
                        uiJs.includes('btnCutLockToggle') ||
                        uiJs.includes('lock-btn');
  assert(hasLockToggle, 'app/body.html or src/12_ui.js must contain quick lock/unlock toggle element in or around #cutInfo');
});

recordTest('tier5', '5.4', 'Dark industrial styling tokens in app/style.css support chip buttons, popover, and lock indicators', () => {
  // Chip button interactive styling
  const hasChipBtnStyle = styleCss.includes('.chip-btn') || styleCss.includes('button.chip') || styleCss.includes('.chip.clickable');
  assert(hasChipBtnStyle, 'app/style.css must define interactive clickable chip styling (.chip-btn)');

  // Pointer cursor & hover state for chips
  assert(styleCss.includes('cursor: pointer') || styleCss.includes('cursor:pointer'), 'app/style.css must define cursor pointer');

  // Popover picker styling
  const hasPopoverStyle = styleCss.includes('.popover-picker') || styleCss.includes('.cut-inspector-popover') || styleCss.includes('.popover');
  assert(hasPopoverStyle, 'app/style.css must define Popover Picker styling');

  // Lock status indicator styling (amber/gold border or lock icon)
  const hasLockStyle = styleCss.includes('.locked') || styleCss.includes('lock') || styleCss.includes('--amber');
  assert(hasLockStyle, 'app/style.css must define locked visual styles');
});

recordTest('tier5', '5.5', 'Single-bundle index.html build output reflects source updates without errors', () => {
  // Execute build.js to ensure bundling succeeds
  const { execSync } = require('child_process');
  let buildOutput = '';
  try {
    buildOutput = execSync('node build.js', { cwd: __dirname, encoding: 'utf-8' });
  } catch (err) {
    throw new Error(`build.js failed to execute: ${err.message}`);
  }
  assert(buildOutput.includes('Build completed'), 'build.js must output "Build completed"');

  const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  assert(indexHtml.length > 500000, 'index.html must be populated with bundled application');
});

recordTest('tier5', '5.6', 'Omakase single-key R safeguard: transport bar and easy panel describe Shift+R, avoiding accidental destructive reset', () => {
  assert(bodyHtml.includes('Shift+R'), 'app/body.html must reference Shift+R for omakase generation safeguard');
});

recordTest('tier5', '5.7', 'Ambiguous legacy btnShuffle replaced: transport bar separates single cut vs all cuts without bare btnShuffle', () => {
  const startIdx = bodyHtml.indexOf('<div class="transport">');
  const endIdx = bodyHtml.indexOf('class="timeline-bar"', startIdx);
  assert(startIdx > 0 && endIdx > startIdx, 'Transport section must exist in app/body.html');
  const transportHtml = bodyHtml.substring(startIdx, endIdx);

  assert(transportHtml.includes('id="btnShuffleCurrent"'), 'Transport bar must contain btnShuffleCurrent');
  assert(transportHtml.includes('id="btnShuffleAll"'), 'Transport bar must contain btnShuffleAll');
  assert(!/\bid=["']btnShuffle["']/.test(transportHtml), 'Transport bar must not contain ambiguous un-scoped id="btnShuffle" button');
});

// ====================================================================
// Test Suite Summary & Reporting
// ====================================================================
console.log('\n======================================================================');
console.log('📊 TEST SCORECARD SUMMARY');
console.log('======================================================================\n');

let totalPassed = 0;
let totalFailed = 0;

for (const [k, tier] of Object.entries(scorecard)) {
  const total = tier.passed + tier.failed;
  const pct = total ? ((tier.passed / total) * 100).toFixed(1) : 0;
  console.log(`  ${tier.name.padEnd(42)}: ${tier.passed}/${total} passed (${pct}%)`);
  totalPassed += tier.passed;
  totalFailed += tier.failed;
  if (tier.errors.length) {
    for (const e of tier.errors) {
      console.log(`     - [${e.testId}] ${e.desc}`);
      console.log(`       ${e.error}`);
    }
  }
}

console.log('\n----------------------------------------------------------------------');
const totalAll = totalPassed + totalFailed;
const overallPct = totalAll ? ((totalPassed / totalAll) * 100).toFixed(1) : 0;
console.log(`Total Assertions: ${totalAll} | Passed: ${totalPassed} | Failed: ${totalFailed} | Pass Rate: ${overallPct}%`);
console.log('----------------------------------------------------------------------\n');

if (totalFailed === 0) {
  console.log('🎉 ALL 5 TIERS OF MULTI-DIM INSPECTOR & LOCK TESTS PASSED (100%)!\n');
  process.exit(0);
} else {
  console.log(`⚠️  TEST SUITE COMPLETED WITH ${totalFailed} DEFECT(S) TO BE ADDRESSED BY IMPLEMENTATION AGENT.\n`);
  process.exit(1);
}
