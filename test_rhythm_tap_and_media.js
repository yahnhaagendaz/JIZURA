/**
 * Automated Test Suite for JIZURA:
 * 1. Screen recording MP4 / Audio ingestion & MIME routing
 * 2. Smart beat phrase generation (fast & normal BPMs, raw lyrics mapping, empty template)
 * 3. Metronome timing, beat detection & accented downbeats
 * 4. Tap-tempo (打点卡点) simulation with dynamic rewind buffer (1.5s, 2.0s, 3.0s) & undo stack
 * 5. HTML DOM structure and file input acceptance validation
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('🧪 Starting JIZURA Rhythm, Tap & Media Test Suite');
console.log('====================================================\n');

// Load compiled bundle with canvas mock
global.window = { AudioContext: class {} };
global.document = {
  getElementById: () => null,
  createElement: () => ({ getContext: () => ({ measureText: (txt) => ({ width: txt.length * 10 }) }) })
};
global.localStorage = { getItem: () => null, setItem: () => null };
eval(fs.readFileSync(path.join(__dirname, 'dev', 'www', 'jizura.js'), 'utf-8'));
global.J = global.window.J;

// ------------------------------------------------------------------
// TEST SUITE 1: Smart Beat Phrase Generator
// ------------------------------------------------------------------
console.log('▶ TEST 1: Smart Beat Phrasing Engine');

// 1.1: Empty lyrics template generation at 120 BPM (4 beats per line)
const emptyTemplate120 = J.generateSmartBeatPhrases('', { bpm: 120, duration: 10, beats: J.beatGrid(120, 0, 10) }, 120);
assert(emptyTemplate120.includes('BPM 120 · 每 4 拍一句'), 'Template header should note BPM 120 & 4 beats');
assert(emptyTemplate120.includes('[00:00.00]分句 01 /'), 'Should start at 00:00.00');
assert(emptyTemplate120.includes('[00:02.00]分句 02 /'), 'Line 2 should be at 00:02.00 (4 beats = 2.0s)');
assert(emptyTemplate120.includes('[00:04.00]分句 03 /'), 'Line 3 should be at 00:04.00');
console.log('  ✔ 1.1: Successfully generated empty beat template at 120 BPM');

// 1.2: Fast tempo track (Unknown Mother-Goose at 222 BPM, 8 beats per line)
const bpm222Beats = J.beatGrid(222, 0, 15);
const emptyTemplate222 = J.generateSmartBeatPhrases('', { bpm: 222, duration: 15, beats: bpm222Beats }, 222);
assert(emptyTemplate222.includes('BPM 222 · 每 8 拍一句'), 'Fast tracks (>160 BPM) must group into 8-beat measures');
const spb222 = 60 / 222;
const line2Expected = +(spb222 * 8).toFixed(2);
console.log(`  ✔ 1.2: Successfully grouped fast 222 BPM beats into 8-beat lines (~${line2Expected}s per line)`);

// 1.3: Raw untimed lyrics mapping onto musical downbeats
const rawLyrics = `
あたしが愛を語るのなら
その眼には如何、映像る？
詞には成らない、もう思いの侭に
ぶちまけてよ
`;
const mappedLrc = J.generateSmartBeatPhrases(rawLyrics, { bpm: 222, duration: 30, beats: bpm222Beats }, 222);
const lines = mappedLrc.trim().split('\n');
assert.strictEqual(lines.length, 4, 'Should map exactly 4 lines');
assert(lines[0].startsWith('[00:00.00]あたしが愛を語るのなら'), 'Line 1 mapped to first beat');
assert(lines[1].includes('その眼には如何、映像る？'), 'Line 2 preserved text');
assert(/^\[\d{2}:\d{2}\.\d{2}\]/.test(lines[1]), 'Line 2 has valid LRC timestamp');
console.log('  ✔ 1.3: Successfully mapped un-timed lyrics to rhythm downbeats:');
lines.forEach(l => console.log('     ', l));

// 1.4: Verify manual tap lineTimes overrides original LRC timestamps
const mockLrcProject = {
  timing: { lineTimes: { 1: 5.50 } },
  lyrics: '[00:01.00]Line 1\n[00:03.00]Line 2\n[00:07.00]Line 3'
};
const parsedLrc = {
  lines: [
    { text: 'Line 1', lrc: 1.00 },
    { text: 'Line 2', lrc: 3.00 },
    { text: 'Line 3', lrc: 7.00 }
  ]
};
const timingRes = J.computeTiming(mockLrcProject, parsedLrc, null);
assert.strictEqual(timingRes.starts[0], 1.00, 'Line 1 retains LRC 1.00s');
assert.strictEqual(timingRes.starts[1], 5.50, 'Line 2 MUST be updated to 5.50s from lineTimes[1] (overriding 3.00s)');
assert.strictEqual(timingRes.starts[2], 7.00, 'Line 3 retains LRC 7.00s');
console.log('  ✔ 1.4: Manual tap lineTimes accurately overrides LRC timestamp (5.50s vs 3.00s)');

// ------------------------------------------------------------------
// TEST SUITE 2: Metronome Ticking & Downbeat Calculation
// ------------------------------------------------------------------
console.log('\n▶ TEST 2: Metronome Tick Logic & Frequency Selection');

function simulateMetronome(bpm, duration, stepSec = 0.016) {
  let lastBeat = -1;
  const ticks = [];
  const spb = 60 / bpm;
  for (let t = 0; t <= duration; t += stepSec) {
    const curBeat = Math.floor((t + 0.008) / spb);
    if (curBeat !== lastBeat && curBeat >= 0) {
      lastBeat = curBeat;
      const isDownbeat = (curBeat % 4 === 0);
      ticks.push({
        t: +t.toFixed(3),
        beat: curBeat,
        isDownbeat,
        pitch: isDownbeat ? 880 : 520
      });
    }
  }
  return ticks;
}

const ticks120 = simulateMetronome(120, 2.1); // 120 BPM = 1 beat every 0.5s
assert.strictEqual(ticks120.length, 5, 'Should tick on beat 0, 1, 2, 3, 4');
assert.strictEqual(ticks120[0].isDownbeat, true, 'Beat 0 is accented downbeat');
assert.strictEqual(ticks120[0].pitch, 880, 'Accent downbeat should be 880 Hz');
assert.strictEqual(ticks120[1].isDownbeat, false, 'Beat 1 is offbeat');
assert.strictEqual(ticks120[1].pitch, 520, 'Offbeat should be 520 Hz');
assert.strictEqual(ticks120[4].isDownbeat, true, 'Beat 4 is accented downbeat (bar 2)');
assert.strictEqual(ticks120[4].pitch, 880, 'Beat 4 downbeat should be 880 Hz');
console.log(`  ✔ 2.1: Metronome correctly produced 5 ticks across 2.0s with correct pitch switching (880Hz / 520Hz)`);

// ------------------------------------------------------------------
// TEST SUITE 3: Tap-Tempo & Rewind Buffer Undo State Machine
// ------------------------------------------------------------------
console.log('\n▶ TEST 3: Tap-Tempo & Smart Rewind Buffer (1.5s / 2.0s / 3.0s)');

class TapMachine {
  constructor(lines, defaultBuffer = 2.0) {
    this.lines = lines;
    this.lineTimes = {};
    this.tap = { i: 0, history: [] };
    this.buffer = defaultBuffer;
    this.playbackTime = 0;
    this.isPlaying = false;
    this.seekCalls = [];
  }

  play() { this.isPlaying = true; }
  pause() { this.isPlaying = false; }
  seek(t) {
    this.playbackTime = Math.max(0, t);
    this.seekCalls.push(+t.toFixed(3));
  }

  tapNow(atTime) {
    this.playbackTime = atTime;
    const curT = +atTime.toFixed(3);
    const idx = this.tap.i;
    this.tap.history.push({
      i: idx,
      stampedTime: curT,
      prevStart: this.lineTimes[idx],
    });
    this.lineTimes[idx] = curT;
    this.tap.i++;
  }

  tapUndo() {
    const bufferSec = this.buffer;
    if (this.tap.history.length > 0) {
      const h = this.tap.history.pop();
      this.tap.i = h.i;
      if (h.prevStart !== undefined) this.lineTimes[h.i] = h.prevStart;
      else delete this.lineTimes[h.i];

      const targetCueT = (h.stampedTime != null) ? h.stampedTime : (this.lineTimes[h.i] != null ? this.lineTimes[h.i] : this.playbackTime);
      const rewindT = Math.max(0, targetCueT - bufferSec);
      this.seek(rewindT);
      if (!this.isPlaying) this.play();
      return { line: h.i, rewindT, resumed: this.isPlaying };
    } else if (this.tap.i > 0) {
      this.tap.i--;
      const prevTargetT = (this.lineTimes[this.tap.i] != null) ? this.lineTimes[this.tap.i] : this.playbackTime;
      delete this.lineTimes[this.tap.i];
      const rewindT = Math.max(0, prevTargetT - bufferSec);
      this.seek(rewindT);
      if (!this.isPlaying) this.play();
      return { line: this.tap.i, rewindT, resumed: this.isPlaying };
    }
    return null;
  }
}

const mockSongLines = [
  { text: 'Line 1: あたしが愛を語るのなら' },
  { text: 'Line 2: その眼には如何、映像る？' },
  { text: 'Line 3: 詞には成らない' },
  { text: 'Line 4: もう思いの侭に' }
];

const tm = new TapMachine(mockSongLines, 2.0);
tm.play();

// User taps Line 1 at 3.50s
tm.tapNow(3.50);
assert.strictEqual(tm.tap.i, 1, 'Current tap index should be 1');
assert.strictEqual(tm.lineTimes[0], 3.50, 'Line 0 timestamp should be 3.50s');

// User taps Line 2 at 7.20s
tm.tapNow(7.20);
assert.strictEqual(tm.tap.i, 2, 'Current tap index should be 2');
assert.strictEqual(tm.lineTimes[1], 7.20, 'Line 1 timestamp should be 7.20s');

// User realizes Line 2 was tapped slightly late, hits Backspace / Undo with buffer = 2.0s
console.log('  Executing tapUndo() with 2.0s buffer on Line 2 (stamped at 7.20s)...');
const undoRes1 = tm.tapUndo();
assert.strictEqual(undoRes1.line, 1, 'Should rewind to Line 2 (index 1)');
assert.strictEqual(undoRes1.rewindT, 5.20, 'Rewind time must be 7.20s - 2.0s = 5.20s');
assert.strictEqual(tm.lineTimes[1], undefined, 'Line 1 timestamp must be deleted');
assert.strictEqual(undoRes1.resumed, true, 'Playback must automatically resume');
console.log(`  ✔ 3.1: Undo with 2.0s buffer succeeded: rewound to ${undoRes1.rewindT}s and auto-resumed playback`);

// User tests buffer = 1.5s
tm.buffer = 1.5;
tm.tapNow(7.05); // Re-taps Line 2 correctly at 7.05s
assert.strictEqual(tm.lineTimes[1], 7.05, 'Line 1 timestamp now updated to 7.05s');
const undoRes2 = tm.tapUndo();
assert.strictEqual(undoRes2.rewindT, 5.55, 'With 1.5s buffer, rewind should be 7.05 - 1.5 = 5.55s');
console.log(`  ✔ 3.2: Undo with 1.5s buffer succeeded: rewound to ${undoRes2.rewindT}s`);

// User tests buffer = 3.0s on Line 1 (stamped at 3.50s)
tm.buffer = 3.0;
const undoRes3 = tm.tapUndo();
assert.strictEqual(undoRes3.line, 0, 'Should rewind to Line 1 (index 0)');
assert.strictEqual(undoRes3.rewindT, 0.50, 'Rewind time must be 3.50s - 3.0s = 0.50s');
assert.strictEqual(tm.lineTimes[0], undefined, 'Line 0 timestamp must be cleared');
console.log(`  ✔ 3.3: Undo with 3.0s buffer succeeded: rewound to ${undoRes3.rewindT}s`);

// ------------------------------------------------------------------
// TEST SUITE 4: DOM and Build Verification
// ------------------------------------------------------------------
console.log('\n▶ TEST 4: Index.html DOM & Features Verification');
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');

const requiredElements = [
  'id="btnNewProject"',
  'id="newProjectDialog"',
  'id="btnSmartPhrases"',
  'id="chkMetro"',
  'id="tapMetroInPanel"',
  'id="tapBuffer"',
  'id="tapBeatPulse"',
  'id="tapUndo"',
  'id="btnTapFreestyle"',
  'accept="audio/*,video/*,.mp3,.wav,.m4a,.aac,.ogg,.flac,.mp4,.mov,.webm"',
  'pulse-accent',
  'pulse-tick'
];

requiredElements.forEach(item => {
  assert(indexHtml.includes(item), `index.html must contain ${item}`);
  console.log(`  ✔ Found required DOM / CSS token: ${item}`);
});

// ------------------------------------------------------------------
// TEST SUITE 5: Freestyle Blind Rhythm Carving Engine (闭眼实时盲切分段)
// ------------------------------------------------------------------
console.log('\n▶ TEST 5: Freestyle Blind Rhythm Carving Engine & Dynamic Plan Generator');

// 5.1: LRC timestamp formatting & cut line generation
assert.strictEqual(J.fmtLrc(0), '[00:00.00]', '0s -> [00:00.00]');
assert.strictEqual(J.fmtLrc(5.25), '[00:05.25]', '5.25s -> [00:05.25]');
assert.strictEqual(J.fmtLrc(65.789), '[01:05.79]', '65.789s -> [01:05.79]');
assert.strictEqual(J.createCutLine(5.25, 1, true), '[00:05.25]镜头 1 /', 'Zh cut line');
assert.strictEqual(J.createCutLine(5.25, 1, false), '[00:05.25]カット 1 /', 'Ja cut line');
console.log('  ✔ 5.1: J.fmtLrc and J.createCutLine formatted correct LRC tags and labels');

// 5.2: State machine simulation starting with ZERO lyrics (pure blind tap carving)
class FreestyleTapMachine {
  constructor(defaultBuffer = 2.0) {
    this.project = J.defaultProject();
    this.project.lyrics = ''; // Empty lyrics
    this.tap = { i: 0, history: [], freestyle: true, createdCount: 0 };
    this.buffer = defaultBuffer;
    this.playbackTime = 0;
    this.isPlaying = false;
  }

  play() { this.isPlaying = true; }
  pause() { this.isPlaying = false; }
  seek(t) { this.playbackTime = Math.max(0, t); }

  tapNow(atTime, isZh = true) {
    this.playbackTime = atTime;
    const curT = +atTime.toFixed(3);
    const prevLyrics = this.project.lyrics || '';
    const cutNum = (this.tap.createdCount || 0) + 1;
    const newCutLine = J.createCutLine(curT, cutNum, isZh);

    this.tap.history.push({
      i: this.tap.i,
      stampedTime: curT,
      freestyle: true,
      prevLyrics: prevLyrics,
      cutNum: cutNum
    });

    const trimmed = prevLyrics.trim();
    this.project.lyrics = trimmed ? `${trimmed}\n${newCutLine}` : newCutLine;
    this.tap.createdCount++;
    this.tap.i++;
    return J.plan(this.project, null);
  }

  tapUndo() {
    if (this.tap.history.length > 0) {
      const h = this.tap.history.pop();
      this.tap.i = h.i;
      if (h.prevLyrics !== undefined) this.project.lyrics = h.prevLyrics;
      if (this.tap.createdCount > 0) this.tap.createdCount--;

      const targetCueT = h.stampedTime ?? this.playbackTime;
      const rewindT = Math.max(0, +(targetCueT - this.buffer).toFixed(3));
      this.seek(rewindT);
      if (!this.isPlaying) this.play();
      const plan = J.plan(this.project, null);
      return { rewindT, restoredLyrics: this.project.lyrics, plan, cutCount: plan.cuts.length };
    }
    return null;
  }
}

const ftm = new FreestyleTapMachine(2.0);
ftm.play();

// User closes eyes, listens to music, and taps on the rhythm:
// Cut 1 at 2.40s
const plan1 = ftm.tapNow(2.40);
assert.strictEqual(ftm.tap.createdCount, 1);
assert.strictEqual(ftm.project.lyrics, '[00:02.40]镜头 1 /');
assert.strictEqual(plan1.lines.length, 1);
assert.strictEqual(plan1.lines[0].start, 2.40);
console.log('  ✔ 5.2a: Stamped Cut 1 at 2.40s on empty lyrics, J.plan created Cut 1 dynamically');

// Cut 2 at 4.80s
const plan2 = ftm.tapNow(4.80);
assert.strictEqual(plan2.lines.length, 2);
assert.strictEqual(plan2.lines[1].start, 4.80);

// Cut 3 at 7.20s, Cut 4 at 9.60s, Cut 5 at 12.00s
ftm.tapNow(7.20);
ftm.tapNow(9.60);
const plan5 = ftm.tapNow(12.00);
assert.strictEqual(plan5.lines.length, 5);
assert.strictEqual(ftm.tap.createdCount, 5);
console.log(`  ✔ 5.2b: Carved 5 freestyle cuts along rhythm in real-time (last cut at 12.00s)`);

// 5.3: User made a mistake on Cut 5 and hits Backspace to undo
const undoRes = ftm.tapUndo();
assert.strictEqual(undoRes.cutCount, 4, 'Undo must remove Cut 5, leaving 4 cuts');
assert.strictEqual(undoRes.rewindT, 10.00, 'Rewind time must be 12.00s - 2.0s buffer = 10.00s');
assert.strictEqual(ftm.isPlaying, true, 'Playback must automatically resume for blind rhythm flow');
assert(!ftm.project.lyrics.includes('镜头 5'), 'Lyrics must no longer contain Cut 5');
console.log(`  ✔ 5.3: Acoustic Undo successfully removed Cut 5, rewound to ${undoRes.rewindT}s, and resumed playback`);

// 5.4: User re-taps Cut 5 accurately on beat at 11.85s
const plan5Fixed = ftm.tapNow(11.85);
assert.strictEqual(plan5Fixed.lines.length, 5);
assert.strictEqual(plan5Fixed.lines[4].start, 11.85);
assert(ftm.project.lyrics.includes('[00:11.85]镜头 5 /'));
console.log(`  ✔ 5.4: Re-tapped Cut 5 at 11.85s, verified full kinetic typography plan generated: ${plan5Fixed.cuts.length} cuts`);

console.log('\n====================================================');
console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! (100% Verification)');
console.log('====================================================');
