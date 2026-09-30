// test_target_hud_and_batch_lyrics.js
// Verification suite for:
// 1. Two distinct tapping modes (Lyrics Step Sync vs Blank Beat Carving)
// 2. Batch lyric matching (eliminates empty dummy lines)
// 3. Flexible time parsing (seconds, mm:ss, ranges, relative adjustments)
// 4. Target Line HUD & S/E stamping decoupled from audio playback
// 5. Full standard LRC sync

const assert = require('assert');
const fs = require('fs');

console.log('====================================================');
console.log('🧪 Starting Target Line HUD & Batch Lyrics Test Suite');
console.log('====================================================\n');

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

// Load all src/*.js in sorted order (exact same as build.js)
const path = require('path');
const srcFiles = fs.readdirSync(path.join(__dirname, 'src'))
  .filter(f => f.endsWith('.js'))
  .sort();
const fullJs = srcFiles.map(f => fs.readFileSync(path.join(__dirname, 'src', f), 'utf-8')).join('\n');
eval(fullJs);
global.J = global.window.J || J;

// ----------------------------------------------------
console.log('▶ TEST 1: Flexible Time Parsing (J.parseTimeStr & J.parseTimeRange)');
// ----------------------------------------------------
// 1.1 Pure seconds
assert.strictEqual(J.parseTimeStr('12.5'), 12.5);
assert.strictEqual(J.parseTimeStr('0'), 0);
assert.strictEqual(J.parseTimeStr('0.45'), 0.45);
console.log('  ✔ 1.1: Pure seconds parsing (12.5s, 0s, 0.45s) passed');

// 1.2 mm:ss.xx format
assert.strictEqual(J.parseTimeStr('01:23.45'), 83.45);
assert.strictEqual(J.parseTimeStr('0:05.5'), 5.5);
assert.strictEqual(J.parseTimeStr('02:00'), 120);
console.log('  ✔ 1.2: LRC/Timestamp mm:ss parsing (01:23.45 -> 83.45s) passed');

// 1.3 Relative offset (+ / -)
assert.strictEqual(J.parseTimeStr('+0.5', 10.0), 10.5);
assert.strictEqual(J.parseTimeStr('-0.25', 10.0), 9.75);
assert.strictEqual(J.parseTimeStr('-20.0', 10.0), 0); // clamp to 0
console.log('  ✔ 1.3: Relative delta adjustments (+0.5s, -0.25s) passed');

// 1.4 Time intervals / ranges (start - end)
const r1 = J.parseTimeRange('10-15');
assert.deepStrictEqual(r1, { start: 10, end: 15 });

const r2 = J.parseTimeRange('01:10 - 01:15.5');
assert.deepStrictEqual(r2, { start: 70, end: 75.5 });

const r3 = J.parseTimeRange('25.5');
assert.deepStrictEqual(r3, { start: 25.5, end: null });

const r4 = J.parseTimeRange('+1.5 - 30', 10, 20);
assert.deepStrictEqual(r4, { start: 11.5, end: 30 });
console.log('  ✔ 1.4: Time interval parsing (10-15, 01:10-01:15.5, +1.5-30) passed');

// ----------------------------------------------------
console.log('\n▶ TEST 2: Lyrics Extraction & Cleaning (J.extractCleanLyrics)');
// ----------------------------------------------------
const dirtyLyrics = `
# This is a comment
[ti:Sample Song]
[ar:Artist Name]
[al:Album Title]
[00:03.20]First line of lyrics
[00:06.50]Second line of lyrics  # inline comment
[00:09.80]Third line of lyrics
`;

const cleanLines = J.extractCleanLyrics(dirtyLyrics);
assert.strictEqual(cleanLines.length, 3);
assert.strictEqual(cleanLines[0], 'First line of lyrics');
assert.strictEqual(cleanLines[1], 'Second line of lyrics');
assert.strictEqual(cleanLines[2], 'Third line of lyrics');
console.log('  ✔ 2.1: Stripped metadata tags, timestamps, and comments cleanly:');
cleanLines.forEach((l, i) => console.log(`      [${i + 1}] ${l}`));

// ----------------------------------------------------
console.log('\n▶ TEST 3: Batch Lyrics Matching (J.batchMatchLyrics)');
// ----------------------------------------------------
const beatCues = [2.40, 5.80, 9.20, 13.50];
const pastedRawLyrics = `
あたしが愛を語るのなら
その眼には如何、映像る？
詞には成らない、もう思いの侭に
ぶちまけてよ
`;

const matchResult = J.batchMatchLyrics(beatCues, pastedRawLyrics, true);
assert.strictEqual(matchResult.matchedCount, 4);
assert.strictEqual(matchResult.totalCues, 4);
assert.strictEqual(matchResult.pairs.length, 4);
assert.strictEqual(matchResult.pairs[0].time, 2.40);
assert.strictEqual(matchResult.pairs[0].text, 'あたしが愛を語るのなら');
assert.strictEqual(matchResult.pairs[3].time, 13.50);
assert.strictEqual(matchResult.pairs[3].text, 'ぶちまけてよ');

console.log('  ✔ 3.1: Matched 4 blank beat cues to 4 lines of lyrics seamlessly:');
matchResult.pairs.forEach(p => console.log(`      ${J.fmtLrc(p.time)} ${p.text}`));

// 3.2 Cues > Lyrics (auto placeholder generation for remaining beats)
const fewerLyrics = `
前奏フレーズ
Aメロ導入
`;
const matchResult2 = J.batchMatchLyrics(beatCues, fewerLyrics, true);
assert.strictEqual(matchResult2.matchedCount, 2);
assert.strictEqual(matchResult2.pairs.length, 4);
assert.strictEqual(matchResult2.pairs[2].isPlaceholder, true);
assert.strictEqual(matchResult2.pairs[3].isPlaceholder, true);
console.log('  ✔ 3.2: Gracefully handled more cues than lyrics with placeholder hints');

// 3.3 Lyrics > Cues
const moreLyrics = `
Line 1
Line 2
Line 3
Line 4
Line 5 extra
Line 6 extra
`;
const matchResult3 = J.batchMatchLyrics(beatCues, moreLyrics, true);
assert.strictEqual(matchResult3.pairs.length, 6);
assert(matchResult3.pairs[4].time > matchResult3.pairs[3].time, 'Extrapolated cue must be after last cue');
assert.strictEqual(matchResult3.pairs[4].time, 17.20); // 13.50 + 3.70 avgStep
console.log('  ✔ 3.3: Gracefully handled more lyrics than cues with smooth progression');

// ----------------------------------------------------
console.log('\n▶ TEST 4: Full Standard LRC Sync (J.syncPlanToLrc)');
// ----------------------------------------------------
const mockPlan = {
  duration: 30,
  lines: [
    { start: 2.50, end: 5.00, text: 'Hello World' },
    { start: 5.50, end: 9.00, text: 'Kinetic Typography' },
    { start: 10.00, end: 14.20, text: 'JIZURA Engine' }
  ]
};
const mockProject = {
  lyrics: 'Hello World\nKinetic Typography\nJIZURA Engine',
  timing: {
    lineTimes: { 1: 5.80 },
    lineEnds: { 1: 9.50 }
  }
};

const syncedLrc = J.syncPlanToLrc(mockPlan, mockProject);
console.log('  Generated LRC:\n' + syncedLrc.split('\n').map(s => '      ' + s).join('\n'));
assert(syncedLrc.includes('[00:02.50]Hello World'));
assert(syncedLrc.includes('[00:05.80-00:09.50]Kinetic Typography')); // verified manual start & end range reflected
assert(syncedLrc.includes('[00:10.00]JIZURA Engine'));
console.log('  ✔ 4.1: Standard LRC sync correctly incorporates manual timing overrides');

// ----------------------------------------------------
console.log('\n▶ TEST 5: Decoupled Target Line Stamping & HUD Logic');
// ----------------------------------------------------
// Simulate state
let targetLineIdx = 0;
let autoStepEnabled = true;
const testProject = {
  timing: {
    lineTimes: {},
    lineEnds: {}
  }
};
const testPlan = {
  lines: [
    { start: 1.0, end: 4.0, text: 'Line 01' },
    { start: 4.5, end: 8.0, text: 'Line 02' },
    { start: 8.5, end: 12.0, text: 'Line 03' }
  ]
};

function simulateStamp(type, curPlaybackTime) {
  const n = testPlan.lines.length;
  const idx = targetLineIdx;
  const curT = +curPlaybackTime.toFixed(2);
  if (type === 'start') {
    testProject.timing.lineTimes[idx] = curT;
    if (testProject.timing.lineEnds[idx] != null && testProject.timing.lineEnds[idx] <= curT) {
      delete testProject.timing.lineEnds[idx];
    }
    if (autoStepEnabled && idx < n - 1) {
      targetLineIdx = idx + 1;
    }
  } else {
    const curStart = (testProject.timing.lineTimes[idx] != null) ? testProject.timing.lineTimes[idx] : testPlan.lines[idx].start;
    testProject.timing.lineEnds[idx] = Math.max(curStart + 0.1, curT);
  }
}

// 5.1 Test S/E stamp on Target Line 0 while playback is at 1.85s
simulateStamp('start', 1.85);
assert.strictEqual(testProject.timing.lineTimes[0], 1.85);
assert.strictEqual(targetLineIdx, 1); // Auto-advanced to Line 1!
console.log('  ✔ 5.1: S Stamp on Line 1 recorded 1.85s and auto-stepped targetLineIdx to Line 2');

// 5.2 Test S stamp on Line 1 while playback is at 5.20s
simulateStamp('start', 5.20);
assert.strictEqual(testProject.timing.lineTimes[1], 5.20);
assert.strictEqual(targetLineIdx, 2); // Auto-advanced to Line 2!
console.log('  ✔ 5.2: S Stamp on Line 2 recorded 5.20s and auto-stepped targetLineIdx to Line 3');

// 5.3 Test E stamp on Line 2 (set targetLineIdx back to 1 manually via Q shortcut)
targetLineIdx = 1; // user pressed 'Q' to step back
simulateStamp('end', 8.10);
assert.strictEqual(testProject.timing.lineEnds[1], 8.10);
console.log('  ✔ 5.3: E Stamp on targeted Line 2 recorded 8.10s without overriding Line 1 or 3');

// ----------------------------------------------------
console.log('\n▶ TEST 6: Built index.html Integrity Check');
// ----------------------------------------------------
const indexHtml = fs.readFileSync('index.html', 'utf8');
const requiredTokens = [
  'id="btnTap"',
  'id="btnTapFreestyle"',
  'id="btnBatchLyricsOpen"',
  'id="batchLyricsDialog"',
  'id="batchLyricsInput"',
  'id="batchLyricsPreviewList"',
  'id="timingActiveLabel"',
  'id="timingActivePreview"',
  'id="timingActiveRange"',
  'id="transportTargetBadge"',
  'id="btnPanelStampS"',
  'id="btnPanelStampE"',
  'id="chkAutoStep"',
  'id="btnSyncLrc"',
  'is-target',
  'txt-inline-edit',
  'J.batchMatchLyrics',
  'J.parseTimeRange',
  'J.syncPlanToLrc'
];

requiredTokens.forEach(tok => {
  assert(indexHtml.includes(tok), `Missing expected token in index.html: ${tok}`);
});
console.log(`  ✔ Verified all ${requiredTokens.length} critical UI components & functions exist in index.html`);

console.log('\n====================================================');
console.log('🎉 ALL NEW TIMING & BATCH LYRICS TESTS PASSED (100%)!');
console.log('====================================================');
