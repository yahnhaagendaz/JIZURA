/* ============================================================
   JIZURA — editor UI
   ============================================================ */
(() => {
'use strict';

const TECH_CATEGORIES = {
  layout: [
    { id: 'basic', name_zh: '基础版式', name_ja: '基本レイアウト', keys: ['center', 'vcols', 'mixed', 'condensed', 'justified', 'dropCap', 'typeSpecimen', 'halfVertical', 'columnsBig', 'sideways', 'hanko', 'genkou', 'quote', 'lowerThird', 'subtitleBar'] },
    { id: 'graphic', name_zh: '几何图形', name_ja: '幾何学・図形', keys: ['marquee', 'tile', 'scatter', 'ring', 'wave', 'huge', 'diag', 'corners', 'staircase', 'zigzag', 'arcTop', 'spiral', 'gridCells', 'frameBox', 'edgeFrame', 'splitScreen', 'splitHalves', 'circleWords', 'tape', 'crossBands', 'ruler'] },
    { id: '3d', name_zh: '空间与3D', name_ja: '空間・3D', keys: ['perspective', 'tunnel', 'depthStack', 'stack', 'circle', 'zoomRepeat', 'orbit', 'mirror'] },
    { id: 'digital', name_zh: '界面数字', name_ja: 'デジタル・UI', keys: ['labels', 'pill', 'gloss', 'type', 'searchBar', 'chat', 'notification', 'ticket', 'keycaps', 'flipBoard', 'ticker', 'credits', 'dotMatrix', 'panels', 'filmstrip'] },
    { id: 'glitch', name_zh: '故障潮流', name_ja: 'グリッチ・トレンド', keys: ['rain', 'stickerBomb', 'neon', 'bubbles', 'slotMachine', 'bounceLine', 'elastic', 'hanging', 'wordCloud', 'kanjiFocus', 'curtain', 'equalizer'] }
  ],
  enter: [
    { id: 'basic', name_zh: '基础硬切', name_ja: '基本・カット', keys: ['cut', 'wipe', 'diagWipe', 'fadeStagger', 'trackIn', 'trackOut', 'riseMask', 'dropMask', 'shutter', 'iris', 'blinds', 'slideL', 'slideR', 'slideWhole', 'splitJoin', 'cursorSweep'] },
    { id: 'type', name_zh: '字符书写', name_ja: 'タイポ・筆跡', keys: ['type', 'strokeDraw', 'outlineFill', 'inkBleed', 'unroll', 'stamp', 'domino', 'fold', 'checker', 'randomOrder'] },
    { id: 'elastic', name_zh: '弹性物理', name_ja: '弾性・物理', keys: ['pop', 'drop', 'bounceBig', 'squashDrop', 'rubber', 'stretch', 'whip', 'skewIn', 'waveIn', 'magnet'] },
    { id: '3d', name_zh: '3D变换', name_ja: '3D・変形', keys: ['assemble', 'spin', 'flipX', 'flipY', 'spiralIn', 'zoom', 'zoomOut', 'echoIn', 'vSlice', 'slice'] },
    { id: 'glitch', name_zh: '故障光效', name_ja: 'グリッチ・発光', keys: ['glitchIn', 'scramble', 'resolve', 'flicker', 'blur', 'blurStagger', 'neonOn'] }
  ],
  hold: [
    { id: 'drift', name_zh: '基础微动', name_ja: '微動・浮遊', keys: ['still', 'drift', 'breathe', 'float', 'sway', 'tilt', 'zoomSlow', 'trackBreathe'] },
    { id: 'beat', name_zh: '音乐律动', name_ja: 'ビート・リズム', keys: ['pulse', 'beatHop', 'heartbeat', 'stretchPulse', 'jelly', 'skewWobble'] },
    { id: 'orbit', name_zh: '旋转波纹', name_ja: '回転・ウェーブ', keys: ['wave', 'hWave', 'rotateSlow', 'orbitSmall'] },
    { id: 'light', name_zh: '流光色彩', name_ja: '発光・カラー', keys: ['shimmer', 'colorRun', 'scanBand'] },
    { id: 'glitch', name_zh: '故障残影', name_ja: 'グリッチ・残像', keys: ['jitter', 'glitchtick', 'glitchJump', 'noiseDrift', 'echoTrail'] }
  ],
  exit: [
    { id: 'basic', name_zh: '基础擦除', name_ja: '基本・消去', keys: ['cut', 'wipe', 'diagWipeOut', 'sinkMask', 'riseOut', 'slideOutL', 'slideOutR', 'sweepCover', 'irisClose', 'blindsClose', 'splitApart'] },
    { id: 'line', name_zh: '字符折线', name_ja: 'タイポ・ライン', keys: ['backspace', 'scrambleOut', 'undraw', 'outlineOut', 'trackOutWide', 'blurOutStagger', 'checkerOut', 'foldOut', 'flipOutX', 'flipOutY'] },
    { id: 'physics', name_zh: '动力坠落', name_ja: '重力・落下', keys: ['gravity', 'fall', 'squash', 'stretch', 'whipOut', 'popOut', 'shatterLite', 'twist', 'waveOut'] },
    { id: '3d', name_zh: '空间收缩', name_ja: '空間・収縮', keys: ['shrink', 'collapse', 'zoomThrough', 'zoomFar', 'spinOut', 'echoOut', 'slice', 'vSliceDrop'] },
    { id: 'dissolve', name_zh: '消融故障', name_ja: '消滅・グリッチ', keys: ['explode', 'scatter', 'drift', 'blur', 'glitch', 'glitchDissolve', 'melt', 'dissolve', 'burn'] }
  ],
  cam: [
    { id: 'push', name_zh: '景深推拉', name_ja: 'ズーム・ドリー', keys: ['push', 'pullOut', 'dollyIn'] },
    { id: 'pan', name_zh: '摇移平移', name_ja: 'パン・ティルト', keys: ['panL', 'panR', 'tiltUp', 'driftDiag'] },
    { id: 'beat', name_zh: '节奏冲击', name_ja: 'ビート・衝撃', keys: ['beatPunch', 'stepZoom', 'crashZoom', 'bounce'] },
    { id: 'action', name_zh: '旋转手持', name_ja: '回転・手ブレ', keys: ['dutch', 'roll', 'handheld', 'whipIn', 'shakeHard'] }
  ],
  treat: [
    { id: 'outline', name_zh: '描边轮廓', name_ja: '輪郭・アウトライン', keys: ['none', 'outline', 'outlineFill', 'doubleOutline', 'dotted', 'echoOutline'] },
    { id: '3d', name_zh: '立体阴影', name_ja: '立体・影', keys: ['extrude', 'longShadow', 'hardShadow', 'softShadow'] },
    { id: 'light', name_zh: '发光渐变', name_ja: '発光・グラデーション', keys: ['glow', 'gradientV', 'splitColor', 'alternate'] },
    { id: 'pattern', name_zh: '纹理排线', name_ja: 'パターン・網点', keys: ['halftone', 'stripes', 'hatch'] },
    { id: 'style', name_zh: '样式标注', name_ja: '強調・装飾', keys: ['marker', 'underline', 'strike', 'boxed', 'italic', 'wide', 'tall', 'emphasisDots'] }
  ],
  bg: [
    { id: 'simple', name_zh: '极简分割', name_ja: 'シンプル・分割', keys: ['none', 'splitV', 'splitH', 'splitDiag', 'borderFrame', 'letterbox'] },
    { id: 'atmosphere', name_zh: '光影氛围', name_ja: '光・パーティクル', keys: ['gradientSweep', 'spotlight', 'bokehBg', 'particlesBg', 'ripples'] },
    { id: 'grid', name_zh: '网格纹理', name_ja: 'グリッド・パターン', keys: ['halftoneFade', 'bigStripes', 'checker', 'dotGrid', 'polka'] },
    { id: 'anime', name_zh: '动漫速度', name_ja: 'アニメ・集中線', keys: ['sunburst', 'speedLines', 'eqBars'] },
    { id: 'retro', name_zh: '故障复古', name_ja: 'レトロ・サイバー', keys: ['retroGrid', 'tvBars', 'scanBars', 'noiseField', 'bigChar', 'rettouStreetDecor'] }
  ],
  decor: [
    { id: 'hud', name_zh: 'UI/HUD仪表', name_ja: 'HUD・UI', keys: ['timecodeBar', 'cornerCrosses', 'crosshair', 'recFrame', 'targetReticle', 'scanlinesOverlay', 'audioWaveSmall', 'bpmBadge', 'hudStatusTag', 'counterBox', 'levelMeter'] },
    { id: 'geo', name_zh: '几何符号', name_ja: '幾何記号', keys: ['brackets', 'rings', 'dots', 'arrows', 'slash', 'sparks', 'leaders', 'shapes'] },
    { id: 'action', name_zh: '速度动态', name_ja: 'モーション・漫符', keys: ['speedLinesEdge', 'impactCircle', 'burstSparks', 'arrowTrail', 'shockwaves', 'sparkles'] },
    { id: 'frame', name_zh: '边框角标', name_ja: 'フレーム・枠', keys: ['borderFrameSlim', 'cornerTicks', 'bracketFrame', 'filmEdges', 'safetyFrame'] },
    { id: 'glitch', name_zh: '故障噪点', name_ja: 'グリッチ・ノイズ', keys: ['barcode', 'grid', 'stripes', 'blobs', 'bars', 'glitchBlocks', 'noiseBand'] }
  ]
};
for (const dim of Object.keys(TECH_CATEGORIES)) {
  const grouped = new Set(TECH_CATEGORIES[dim].flatMap(c => c.keys));
  const missing = J.order(dim).filter(k => !grouped.has(k) && !J.registry(dim)[k]?.special);
  if (missing.length) TECH_CATEGORIES[dim].push({id:'extra',name_zh:'其他扩展',name_ja:'追加の演出',keys:missing});
}
J.TECH_CATEGORIES = TECH_CATEGORIES;

function setOv(i, patch, proj) {
  const p = proj || J.ui?.project;
  if (p) J.patchOverride(p,i,patch);
}
J.setOv = setOv;
function editContext(proj,pl) {
  const p = proj || J.ui?.project, plan = pl || J.ui?.plan;
  return {p,plan,live:!!(J.ui && p === J.ui.project)};
}
function finishEdit(ctx) {
  if (!ctx.live) return;
  replan(); commit(); updateCutInfo(true);
}
function toggleCutLock(lineIdx, proj, pl, cut) {
  const ctx = editContext(proj,pl);
  if (!ctx.p || !ctx.plan || lineIdx < 0) return;
  if (ctx.live) remember();
  const locked = J.editLock(ctx.p,ctx.plan,cut || lineIdx);
  finishEdit(ctx);
  if (ctx.live) toast(J.getLang() === 'zh' ? `${locked ? '🔒 已锁定' : '🔓 已解锁'}${cut ? '镜头 #'+(cut.index+1) : '第 '+(lineIdx+1)+' 句的全部镜头'}` : `${cut ? 'カット #'+(cut.index+1) : '第 '+(lineIdx+1)+' 行の全カット'}：${locked ? 'ロックしました' : 'ロック解除しました'}`);
  return locked;
}
J.toggleCutLock = toggleCutLock;
function shuffleCutLine(activeLine, proj, pl, cut) {
  const ctx = editContext(proj,pl);
  if (!ctx.p || !ctx.plan || activeLine < 0) return;
  if (ctx.live) remember();
  const result = J.editShuffle(ctx.p,ctx.plan,cut || activeLine);
  finishEdit(ctx);
  if (ctx.live) {
    const target = cut || ctx.plan.cuts.find(c => c.line === activeLine);
    if (target) seek(target.start + Math.min(target.dur/2,0.3));
    toast(J.getLang() === 'zh' ? `已重组${cut ? '镜头 #'+(cut.index+1) : '第 '+(activeLine+1)+' 句'}：${result.changed} 个镜头，${result.locked} 个锁定镜头保持不变（保留手动指定）` : `${cut ? 'カット #'+(cut.index+1) : '第 '+(activeLine+1)+' 行'}：${result.changed} カット再構成、${result.locked} カットはロック維持（手動指定を保持）`);
  }
  return result;
}
J.shuffleCutLine = shuffleCutLine;
function shuffleAllCuts(proj,pl) {
  const ctx = editContext(proj,pl);
  if (!ctx.p || !ctx.plan) return;
  if (ctx.live) remember();
  const result = J.editShuffleAll(ctx.p,ctx.plan);
  finishEdit(ctx);
  if (ctx.live) {
    $('seed').value = ctx.p.seed;
    toast(J.getLang() === 'zh' ? `已重组全片 ${result.changed} 个镜头，${result.locked} 个锁定镜头保持不变（保留手动指定）` : `全編 ${result.changed} カット再構成、${result.locked} カットはロック維持（手動指定を保持）`);
  }
  return result;
}
J.shuffleAllCuts = shuffleAllCuts;

if (!document.getElementById('app')) return;          // engine-only pages (tests)
const $ = id => document.getElementById(id);
const LS_KEY = 'jizura.project.v1';
let currentProjectId = null;
const HUD_CHARS = '0123456789:./-_()【】・No.LYRICRECUNTITLEDXYlinebpminterlude—─／ ';
const ICON = {
  dice: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2" width="12" height="12" rx="2"/><circle cx="5.5" cy="5.5" r="1" fill="currentColor"/><circle cx="10.5" cy="10.5" r="1" fill="currentColor"/><circle cx="10.5" cy="5.5" r="1" fill="currentColor"/><circle cx="5.5" cy="10.5" r="1" fill="currentColor"/></svg>',
  lock: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5 7V5a3 3 0 0 1 6 0v2"/></svg>',
};

const S = { project: null, plan: null, audio: null, renderer: new J.Renderer(), playing: false, t: 0, t0: 0, loop: true, need: true, exporting: null, tap: null, tapRate: 1.0, slow: false, lineEls: [], curLine: -2 };

/* WebAudio player (works inside sandboxed pages where blob media may be blocked) */
const AP = {
  ctx: null, src: null, gainNode: null, startAt: 0, rate: 1.0, startCtxTime: 0, volume: 1.0, muted: false,
  ensureGain() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (!this.gainNode) {
      this.gainNode = this.ctx.createGain();
      this.gainNode.connect(this.ctx.destination);
      this.updateGain();
    }
  },
  updateGain() {
    if (this.gainNode && this.ctx) {
      const v = this.muted ? 0 : this.volume;
      this.gainNode.gain.setValueAtTime(v, this.ctx.currentTime);
    }
  },
  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    this.updateGain();
  },
  setMute(m) {
    this.muted = !!m;
    this.updateGain();
  },
  play(buffer, offset, rate = 1.0) {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.ensureGain();
    this.stop();
    this.rate = rate || 1.0;
    const s = this.ctx.createBufferSource(); s.buffer = buffer;
    s.playbackRate.value = this.rate;
    s.connect(this.gainNode);
    const off = Math.max(0, Math.min(offset, buffer.duration - 0.01));
    s.start(0, off); this.src = s;
    this.startCtxTime = this.ctx.currentTime;
    this.startAt = off;
  },
  stop() { if (this.src) { try { this.src.stop(); } catch (e) {} try { this.src.disconnect(); } catch (e) {} this.src = null; } },
  time() {
    if (!this.ctx || !this.src) return this.startAt || 0;
    return this.startAt + (this.ctx.currentTime - this.startCtxTime) * this.rate;
  },
};

/* ---------------- project persistence ---------------- */
function mergeProject(p) {
  const d = J.defaultProject();
  const o = Object.assign(d, p || {});
  o.fx = Object.assign(J.defaultProject().fx, (p && p.fx) || {});
  o.timing = Object.assign(J.defaultProject().timing, (p && p.timing) || {});
  const en = J.defaultProject().enabled;
  for (const g of Object.keys(en)) en[g] = Object.assign(en[g], ((p && p.enabled) || {})[g] || {});
  o.enabled = en;
  o.overrides = (p && (p.overrides || p.custom)) || {};
  o.colors = Object.assign({ enabled: false }, (p && p.colors) || {});
  o.fonts = (p && p.fonts) || {};
  o.userFonts = (p && p.userFonts) || [];
  for (const uf of o.userFonts) if (!J.FONTS[uf.key]) J.addUserFont(uf.key, uf.label, uf.family, uf.weight || 400);
  o.audioMeta = (p && p.audioMeta) || null;
  return o;
}
function loadLocal() { try { const s = localStorage.getItem(LS_KEY); if (s) return mergeProject(JSON.parse(s)); } catch (e) {} return mergeProject(null); }

async function importProjectFile(p) {
  if (!p || typeof p.lyrics !== 'string') throw new Error('Invalid project: lyrics must be text');
  if (currentProjectId && isDirty && !await saveCurrentProjectToDisk(true)) throw new Error('Please save the current project first');
  clearTimeout(autoDiskTimer); clearTimeout(saveTimer);
  await diskSaveQueue;
  ++projectLoadToken; ++audioLoadToken; pause(); closeCutInspector();
  currentProjectId = null; S.audio = null; S.project = mergeProject(p);
  J.upgradeLegacyLocks(S.project,J.plan(S.project));
  H.list = []; H.i = -1; targetLineIdx = 0; S.t = 0; S.curLine = -2; lastCutIdx = -2;
  if ($('projectSelect')) $('projectSelect').value = '';
  initTimingHistory(); syncUI(); replan(); remember(); updateHist();
  showMissingMediaAlert(); setSaveStatus(true);
  toast(J.getLang()==='zh' ? '已打开独立 JSON；请用「另存为」建立磁盘工程。' : 'JSONを開きました。「別名で保存」で新しいプロジェクトを作成してください。');
}

let isDirty = false;
let loadingProject = true;
let projectLoadToken = 0;
let diskSaveQueue = Promise.resolve();
let autoDiskTimer = 0;

function setSaveStatus(dirty) {
  isDirty = dirty;
  const badge = $('saveStatusBadge');
  const btnSave = $('btnSaveDisk');
  const isZh = J.getLang && J.getLang() === 'zh';
  if (badge) {
    if (dirty) {
      badge.textContent = isZh ? '● 未保存修改' : '● 未保存の変更';
      badge.classList.add('dirty');
      badge.style.background = 'rgba(245,165,12,0.18)';
      badge.style.color = 'var(--amber)';
      badge.style.borderColor = 'rgba(245,165,12,0.5)';
      badge.title = isZh ? '当前有修改尚未保存到磁盘文件' : 'ローカル変更あり・未保存';
    } else {
      badge.textContent = isZh ? '✓ 已同步磁盘' : '✓ ディスク同期済';
      badge.classList.remove('dirty');
      badge.style.background = 'rgba(30,200,100,0.15)';
      badge.style.color = '#2bd67b';
      badge.style.borderColor = 'rgba(30,200,100,0.3)';
      badge.title = isZh ? '当前工程已与磁盘 project.json 保持同步' : 'ディスクと同期中';
    }
  }
  if (btnSave) {
    btnSave.style.boxShadow = dirty ? '0 0 8px rgba(255,230,0,0.7)' : 'none';
    if (btnSave.textContent && !btnSave.textContent.includes('中') && !btnSave.textContent.includes('已')) {
      const orig = isZh ? '💾 保存' : '💾 保存';
      btnSave.textContent = dirty ? orig + '*' : orig;
    }
  }
}

async function saveCurrentProjectToDisk(quiet = false) {
  const pid = currentProjectId, project = S.project;
  if (!pid || !project || loadingProject) return false;
  const body = JSON.stringify(project,null,2);
  const task = () => persistProject(pid,project,body,quiet);
  diskSaveQueue = diskSaveQueue.then(task,task);
  return diskSaveQueue;
}
async function persistProject(pid,project,body,quiet) {
  if (!pid || !project) return false;
  const btnSave = $('btnSaveDisk');
  const isZh = J.getLang && J.getLang() === 'zh';
  const origText = btnSave ? (isZh ? '💾 保存' : '💾 保存') : '';
  if (btnSave && !quiet) btnSave.textContent = isZh ? '💾 保存中…' : '保存中…';
  try {
    const r = await fetch(`/api/project?id=${encodeURIComponent(pid)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });
    if (r.ok) {
      if (S.project === project && currentProjectId === pid && JSON.stringify(S.project,null,2) === body) setSaveStatus(false);
      if (S.project !== project || currentProjectId !== pid) return true;
      if (btnSave) {
        btnSave.textContent = isZh ? '✅ 已保存!' : '保存完了!';
        setTimeout(() => { btnSave.textContent = origText; }, 1500);
      }
      return true;
    } else {
      if (btnSave) {
        btnSave.textContent = isZh ? '❌ 保存失败' : '失敗';
        setTimeout(() => { btnSave.textContent = origText; }, 1500);
      }
    }
  } catch (err) {
    console.error('保存到磁盘失败:', err);
    if (btnSave) {
      btnSave.textContent = isZh ? '❌ 出错' : 'エラー';
      setTimeout(() => { btnSave.textContent = origText; }, 1500);
    }
  }
  return false;
}

let saveTimer = 0;
function autosave() {
  if (loadingProject) return;
  const project = S.project, pid = currentProjectId;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(project)); } catch (e) {}
  }, 700);

  setSaveStatus(true);

  const chk = $('chkAutoSave');
  if (chk && chk.checked && currentProjectId) {
    clearTimeout(autoDiskTimer);
    autoDiskTimer = setTimeout(() => {
      if (S.project === project && currentProjectId === pid && !loadingProject) saveCurrentProjectToDisk(true);
    }, 1500);
  }
}

/* ---------------- planning ---------------- */
function audioLike() {
  const T = S.project.timing;
  if (S.audio) {
    const a = Object.assign({}, S.audio);
    if (T.bpm > 0) a.beats = J.beatGrid(T.bpm, T.beatOffset || 0, S.audio.duration);
    return a;
  }
  if (T.bpm > 0) return { beats: J.beatGrid(T.bpm, T.beatOffset || 0, 600) };
  return null;
}
function replan() {
  S.plan = J.plan(S.project, audioLike());
  if (S.t > S.plan.duration) S.t = 0;
  renderLines(); sizeViewport(); drawTimeline(); updateTimeUI();
  updateCutInfo(true);
  S.need = true; autosave(); ensureFonts(); drawSwatch(); showNow();
  clearTimeout(warmTimer); warmTimer = setTimeout(warm, 450);
}
/* pre-decompose glyphs used by piece animations while the editor is idle, so playback does not hitch */
let warmTimer = 0, warmJob = 0;
function warm() {
  const job = ++warmJob;
  const cuts = S.plan.cuts.filter(c => c.enter === 'assemble' || ['explode', 'fall', 'drift'].includes(c.exit));
  const src = $('view');
  const cv = document.createElement('canvas'); cv.width = src.width; cv.height = src.height;
  const ctx = cv.getContext('2d');
  let i = 0;
  const idle = window.requestIdleCallback ? (f) => window.requestIdleCallback(f, { timeout: 400 }) : (f) => setTimeout(() => f(null), 40);
  const step = (deadline) => {
    if (job !== warmJob || S.exporting) return;
    do {
      const c = cuts[i++]; if (!c) break;
      const ts = [];
      if (c.enter === 'assemble') ts.push(c.start + Math.min(c.inDur * 0.3, c.dur * 0.2));
      if (c.outDur > 0) ts.push(c.end - c.outDur * 0.5);
      for (const t of ts) { try { S.renderer.frame(ctx, S.plan, t, { scale: cv.width / S.plan.W, fast: true, noHud: true, noGhost: true }); } catch (e) {} }
    } while (i < cuts.length && deadline && deadline.timeRemaining() > 10);
    if (i < cuts.length) idle(step);
  };
  idle(step);
}
let replanTimer = 0;
const replanSoon = (ms = 220) => { clearTimeout(replanTimer); replanTimer = setTimeout(replan, ms); };
let fontKey = '';
async function ensureFonts() {
  const txt = S.project.lyrics + (S.project.title || '') + (S.project.artist || '') + HUD_CHARS;
  const key = txt + '|' + Object.keys(J.FONTS).length;
  if (key === fontKey) return;
  fontKey = key;
  showMsg(J.t('loading_fonts', 'フォントを読み込み中…'));
  try { await J.ensureFonts(txt, null); } catch (e) {}
  showMsg(null); S.need = true; drawStyleGrid();
}
function showMsg(m) { const el = $('viewMsg'); if (!m) { el.hidden = true; return; } el.textContent = m; el.hidden = false; }

/* ---------------- viewport & drawing ---------------- */
function sizeViewport() {
  const vp = $('viewport'), c = $('view');
  const ar = S.plan.W / S.plan.H;
  let cssW = vp.clientWidth || 800, cssH = cssW / ar;
  const maxH = Math.max(220, window.innerHeight * 0.68);
  if (cssH > maxH) { cssH = maxH; cssW = cssH * ar; }
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const pw = Math.round(Math.min(S.plan.W, cssW * dpr)), ph = Math.round(pw / ar);
  if (c.width !== pw || c.height !== ph) { c.width = pw; c.height = ph; }
  c.style.width = cssW + 'px'; c.style.height = cssH + 'px';
  S.need = true;
}
function draw() {
  const c = $('view'), ctx = c.getContext('2d');
  const t0 = performance.now();
  S.renderer.frame(ctx, S.plan, S.t, { scale: c.width / S.plan.W, fast: S.playing && S.slow });
  const dt = performance.now() - t0;
  S.slow = S.playing ? (dt > 30 ? true : dt < 14 ? false : S.slow) : false;
  updateTimeUI(); drawTimeline(); updateCutInfo();
}
let lastMetronomeBeat = -1;

function checkMetronomeTick(t) {
  const isMetroActive = ($('chkMetro') && $('chkMetro').checked) || ($('tapMetroInPanel') && $('tapMetroInPanel').checked);
  if (!isMetroActive) return;

  const bpm = (S.audio && S.audio.bpm > 0) ? S.audio.bpm : ((S.project.timing && S.project.timing.bpm > 0) ? S.project.timing.bpm : 120);
  const offset = (S.project.timing && S.project.timing.offset) || 0;
  const spb = 60 / bpm;
  const curBeat = Math.floor((t - offset + 0.008) / spb);

  if (curBeat !== lastMetronomeBeat && curBeat >= 0) {
    lastMetronomeBeat = curBeat;
    const isDownbeat = (curBeat % 4 === 0);
    J.playTick(isDownbeat ? 880 : 520, isDownbeat ? 0.04 : 0.025, 0.35);
    triggerBeatPulse(isDownbeat);
  }
}

function triggerBeatPulse(isDownbeat) {
  const el = $('tapBeatPulse');
  if (el) {
    el.classList.remove('pulse-accent', 'pulse-tick');
    void el.offsetWidth;
    el.classList.add(isDownbeat ? 'pulse-accent' : 'pulse-tick');
  }
}

function tick(now) {
  requestAnimationFrame(tick);
  if (S.exporting) return;
  if (S.playing) {
    // rAF timestamps can precede the moment play()/seek() stamped t0 → clamp so t never goes negative
    const curRate = (S.tap && S.tapRate) || 1.0;
    let t = Math.max(0, S.audio ? AP.time() : (now - S.t0) / 1000 * curRate);
    if (t >= S.plan.duration - 1e-3) {
      if (S.loop && !S.tap) { seek(0); t = 0; }
      else { pause(); t = S.plan.duration - 1e-3; if (S.tap) stopTap(); }
    }
    S.t = t; S.need = true;
    checkMetronomeTick(t);
  }
  if (S.need) { S.need = false; draw(); }
}
let lastStampT = -1;
function updateTimeUI() {
  $('timeNow').textContent = J.fmtTime(S.t);
  $('timeDur').textContent = J.fmtTime(S.plan.duration);
  if (!S.scrubbing) $('scrub').value = String(Math.round(S.t / Math.max(0.001, S.plan.duration) * 10000));
  if (Math.abs(S.t - lastStampT) >= 0.05) {
    lastStampT = S.t;
    updateStampButtons();
  }
}
function play() {
  const rate = (S.tap && S.tapRate) || 1.0;
  if (S.audio) AP.play(S.audio.buffer, S.t, rate);
  else S.t0 = performance.now() - (S.t * 1000) / rate;
  S.playing = true; $('btnPlay').textContent = '❚❚'; $('btnPlay').setAttribute('aria-label', (J.getLang && J.getLang() === 'zh') ? '暂停' : '一時停止');
}
function pause() {
  S.playing = false; AP.stop();
  lastMetronomeBeat = -1;
  $('btnPlay').textContent = '▶'; $('btnPlay').setAttribute('aria-label', (J.getLang && J.getLang() === 'zh') ? '播放' : '再生'); S.need = true;
}
function seek(t) {
  S.t = J.clamp(t, 0, Math.max(0, S.plan.duration - 1e-3));
  lastMetronomeBeat = -1;
  const rate = (S.tap && S.tapRate) || 1.0;
  if (S.audio) { if (S.playing) AP.play(S.audio.buffer, S.t, rate); }
  else S.t0 = performance.now() - (S.t * 1000) / rate;
  S.need = true;
}

/* ---------------- timeline & zoom ---------------- */
const layoutHue = k => (J.LAYOUT_ORDER.indexOf(k) * 37 + 30) % 360;
let tlZoom = 1.0;
let tlViewStart = 0.0;

function getTimelineView() {
  const totalD = (S.plan && S.plan.duration) ? Math.max(0.001, S.plan.duration) : 10;
  const viewDur = totalD / Math.max(1, tlZoom);
  const maxStart = Math.max(0, totalD - viewDur);
  tlViewStart = Math.max(0, Math.min(tlViewStart, maxStart));
  return { totalD, viewDur, viewStart: tlViewStart, viewEnd: tlViewStart + viewDur };
}

function setTimelineZoom(newZoom, anchorT = null, anchorRatio = 0.5) {
  const totalD = (S.plan && S.plan.duration) ? Math.max(0.001, S.plan.duration) : 10;
  tlZoom = Math.max(1, Math.min(16, +newZoom.toFixed(2)));
  const newViewDur = totalD / tlZoom;
  const targetAnchor = anchorT != null ? anchorT : (S.t || 0);
  tlViewStart = Math.max(0, Math.min(totalD - newViewDur, targetAnchor - newViewDur * anchorRatio));
  document.querySelectorAll('.tl-zoom-btn').forEach(btn => {
    const z = parseFloat(btn.dataset.zoom);
    btn.classList.toggle('active', Math.abs(z - tlZoom) < 0.2);
  });
  drawTimeline();
}

function focusCutOnTimeline(idx = -1) {
  if (!S.plan || !S.plan.lines || !S.plan.lines.length) return;
  const i = idx >= 0 ? idx : (targetLineIdx >= 0 ? targetLineIdx : S.curLine);
  if (i < 0 || i >= S.plan.lines.length) return;
  const ln = S.plan.lines[i];
  const { totalD, viewDur } = getTimelineView();
  const lineMid = (ln.start + ln.end) * 0.5;
  tlViewStart = Math.max(0, Math.min(totalD - viewDur, lineMid - viewDur * 0.5));
  drawTimeline();
}

/* ---------------- timing undo / redo stack ---------------- */
const timingHistory = [];
let timingHistoryIdx = -1;
const MAX_TIMING_HISTORY = 50;

function initTimingHistory() {
  timingHistory.length = 0;
  if (S.project && S.project.timing) {
    timingHistory.push({
      desc: J.getLang && J.getLang() === 'zh' ? '初始时间' : '初期状態',
      lineTimes: JSON.parse(JSON.stringify(S.project.timing.lineTimes || {})),
      lineEnds: JSON.parse(JSON.stringify(S.project.timing.lineEnds || {})),
    });
    timingHistoryIdx = 0;
  } else {
    timingHistoryIdx = -1;
  }
  updateUndoRedoUI();
}

function pushTimingState(actionDesc = '') {
  if (!S.project || !S.project.timing) return;
  if (timingHistory.length === 0) {
    timingHistory.push({
      desc: J.getLang && J.getLang() === 'zh' ? '初始时间' : '初期状態',
      lineTimes: {},
      lineEnds: {},
    });
    timingHistoryIdx = 0;
  }
  if (timingHistoryIdx < timingHistory.length - 1) {
    timingHistory.splice(timingHistoryIdx + 1);
  }
  const state = {
    desc: actionDesc,
    lineTimes: JSON.parse(JSON.stringify(S.project.timing.lineTimes || {})),
    lineEnds: JSON.parse(JSON.stringify(S.project.timing.lineEnds || {})),
  };
  timingHistory.push(state);
  if (timingHistory.length > MAX_TIMING_HISTORY) timingHistory.shift();
  timingHistoryIdx = timingHistory.length - 1;
  updateUndoRedoUI();
}

function updateUndoRedoUI() {
  const btnU = $('btnUndoTiming'), btnR = $('btnRedoTiming');
  const isZh = J.getLang && J.getLang() === 'zh';
  if (btnU) {
    const canU = timingHistoryIdx > 0;
    btnU.disabled = !canU;
    btnU.title = canU ? (isZh ? `撤销: ${timingHistory[timingHistoryIdx].desc} (Ctrl+Z)` : `元に戻す: ${timingHistory[timingHistoryIdx].desc} (Ctrl+Z)`) : (isZh ? '无撤销历史' : '履歴なし');
  }
  if (btnR) {
    const canR = timingHistoryIdx < timingHistory.length - 1;
    btnR.disabled = !canR;
    btnR.title = canR ? (isZh ? `重做: ${timingHistory[timingHistoryIdx + 1]?.desc} (Ctrl+Y)` : `やり直す: ${timingHistory[timingHistoryIdx + 1]?.desc} (Ctrl+Y)`) : (isZh ? '无重做历史' : '履歴なし');
  }
}

function undoTiming() {
  if (timingHistoryIdx > 0) {
    timingHistoryIdx--;
    const st = timingHistory[timingHistoryIdx];
    S.project.timing.lineTimes = JSON.parse(JSON.stringify(st.lineTimes || {}));
    S.project.timing.lineEnds = JSON.parse(JSON.stringify(st.lineEnds || {}));
    replan();
    updateUndoRedoUI();
    toast(J.getLang && J.getLang() === 'zh' ? `↶ 已撤销: ${st.desc || '时间调整'}` : `元に戻しました: ${st.desc || ''}`);
  }
}

function redoTiming() {
  if (timingHistoryIdx < timingHistory.length - 1) {
    timingHistoryIdx++;
    const st = timingHistory[timingHistoryIdx];
    S.project.timing.lineTimes = JSON.parse(JSON.stringify(st.lineTimes || {}));
    S.project.timing.lineEnds = JSON.parse(JSON.stringify(st.lineEnds || {}));
    replan();
    updateUndoRedoUI();
    toast(J.getLang && J.getLang() === 'zh' ? `↷ 已重做: ${st.desc || '时间调整'}` : `やり直しました: ${st.desc || ''}`);
  }
}

function drawTimeline() {
  const c = $('timeline'), dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(10, Math.round(c.clientWidth * dpr)), h = Math.max(10, Math.round(c.clientHeight * dpr));
  if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
  const x = c.getContext('2d');
  // Auto-follow playhead if zoomed and playing
  if (S.playing && tlZoom > 1) {
    const totalD = (S.plan && S.plan.duration) ? Math.max(0.001, S.plan.duration) : 10;
    const curViewDur = totalD / tlZoom;
    if (S.t < tlViewStart + curViewDur * 0.05 || S.t > tlViewStart + curViewDur * 0.95) {
      tlViewStart = Math.max(0, Math.min(totalD - curViewDur, S.t - curViewDur * 0.25));
    }
  }

  const { totalD, viewDur, viewStart, viewEnd } = getTimelineView();
  const X = t => (t - viewStart) / viewDur * w;

  // Background
  x.fillStyle = '#111114'; x.fillRect(0, 0, w, h);

  // Zoom window overview bar on top edge
  if (tlZoom > 1) {
    const ovX = (viewStart / totalD) * w;
    const ovW = Math.max(4 * dpr, (viewDur / totalD) * w);
    x.fillStyle = 'rgba(255, 255, 255, 0.15)';
    x.fillRect(0, 0, w, 2 * dpr);
    x.fillStyle = 'rgba(245, 165, 12, 0.95)';
    x.fillRect(ovX, 0, ovW, 2 * dpr);
  }

  // High-contrast vibrant dual-layer waveform
  if (S.audio && S.audio.peaks) {
    const pk = S.audio.peaks, n = pk.length, sd = S.audio.duration;
    for (let i = 0; i < w; i += 2) {
      const t = viewStart + (i / w) * viewDur;
      if (t < 0 || t > sd) continue;
      const binIdx = Math.min(n - 1, Math.max(0, Math.floor(t / sd * n)));
      const v = pk[binIdx];
      const hh = Math.max(1, v * h * 0.76);
      const yCenter = h * 0.58;

      if (v > 0.45) {
        x.fillStyle = 'rgba(245, 165, 12, 0.8)';
      } else if (v > 0.2) {
        x.fillStyle = 'rgba(22, 244, 212, 0.7)';
      } else {
        x.fillStyle = 'rgba(22, 244, 212, 0.32)';
      }
      x.fillRect(i, yCenter - hh * 0.5, 1.5, hh);
    }
  }

  // Musical beat lines
  const beats = S.plan.beats || [];
  for (let bIdx = 0; bIdx < beats.length; bIdx++) {
    const b = beats[bIdx];
    if (b < viewStart) continue;
    if (b > viewEnd) break;
    const bx = Math.round(X(b));
    const isDownbeat = (bIdx % 4 === 0);
    x.fillStyle = isDownbeat ? 'rgba(245, 165, 12, 0.9)' : 'rgba(255, 255, 255, 0.28)';
    const tickH = isDownbeat ? (10 * dpr) : (5 * dpr);
    x.fillRect(bx, h - tickH, dpr, tickH);
  }

  const trackH = Math.round(h * 0.35);
  const cutTop = trackH + 2 * dpr, cutBot = h - 8 * dpr;
  const isZh = J.getLang && J.getLang() === 'zh';

  // 1. Video track lyric blocks
  const lines = S.plan.lines || [];
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    if (ln.end < viewStart || ln.start > viewEnd) continue;
    const lx0 = Math.round(X(ln.start));
    const lx1 = Math.round(X(ln.end));
    const lw = Math.max(3 * dpr, lx1 - lx0);
    const active = S.t >= ln.start && S.t < ln.end;
    const isTarget = (i === targetLineIdx);

    // Line block background
    if (isTarget) {
      x.fillStyle = active ? 'rgba(22, 244, 212, 0.45)' : 'rgba(22, 244, 212, 0.28)';
    } else {
      x.fillStyle = active ? 'rgba(245, 165, 12, 0.36)' : 'rgba(255, 255, 255, 0.08)';
    }
    x.fillRect(lx0, 2 * dpr, lw, trackH - 3 * dpr);
    
    // Left boundary accent bar
    x.fillStyle = isTarget ? '#16f4d4' : (active ? '#f5a50c' : 'rgba(255, 255, 255, 0.4)');
    x.fillRect(lx0, 2 * dpr, (isTarget ? 3 : 2) * dpr, trackH - 3 * dpr);

    // Right boundary accent
    x.fillStyle = isTarget ? '#16f4d4' : (active ? 'rgba(245,165,12,0.85)' : 'rgba(255,255,255,0.2)');
    x.fillRect(lx0 + lw - dpr, 2 * dpr, dpr, trackH - 3 * dpr);

    // Target outline border
    if (isTarget) {
      x.strokeStyle = '#16f4d4';
      x.lineWidth = 1.5 * dpr;
      x.strokeRect(lx0 + 0.5 * dpr, 2 * dpr + 0.5 * dpr, lw - dpr, trackH - 4 * dpr);
    }

    // Block text
    if (lw > 24 * dpr) {
      x.save();
      x.beginPath();
      x.rect(lx0 + 3 * dpr, 2 * dpr, lw - 5 * dpr, trackH - 3 * dpr);
      x.clip();
      const isLocked = S.plan.cuts.some(c => c.line === i && J.isCutLocked(S.project,c));
      x.fillStyle = isTarget ? '#16f4d4' : (active ? '#ffffff' : 'rgba(236,231,225,0.92)');
      x.font = `${isTarget ? 'bold ' : ''}${9 * dpr}px sans-serif`;
      const durSec = (ln.end - ln.start).toFixed(1);
      x.fillText(`${isTarget ? '🎯 ' : ''}${isLocked ? '🔒 ' : ''}${String(i + 1).padStart(2, '0')}. ${ln.text} [${durSec}s]`, lx0 + 4 * dpr, trackH - 5 * dpr);
      x.restore();
    }
  }

  // Track divider line
  x.fillStyle = '#2b2b36';
  x.fillRect(0, trackH, w, dpr);

  // 2. Cut layouts track
  for (const cut of S.plan.cuts) {
    if (cut.end < viewStart || cut.start > viewEnd) continue;
    const x0 = X(cut.start), x1 = X(cut.end);
    const hue = layoutHue(cut.layout);
    const isLocked = J.isCutLocked(S.project,cut);
    const cutW = Math.max(1, x1 - x0 - 1);
    const cutH = cutBot - cutTop;

    x.fillStyle = isLocked ? `hsla(${hue},65%,48%,0.4)` : `hsla(${hue},70%,58%,0.32)`;
    x.fillRect(x0, cutTop, cutW, cutH);

    x.fillStyle = isLocked ? '#f5a50c' : `hsla(${hue},80%,62%,0.95)`;
    x.fillRect(x0, cutTop, Math.max(1, 2 * dpr), cutH);

    if (isLocked) {
      x.strokeStyle = '#f5a50c';
      x.lineWidth = 1.2 * dpr;
      x.strokeRect(x0 + 0.5 * dpr, cutTop + 0.5 * dpr, cutW - dpr, cutH - dpr);
    }

    if (x1 - x0 > 24 * dpr) {
      x.save();
      x.beginPath();
      x.rect(x0, cutTop, x1 - x0 - 3, cutH);
      x.clip();
      const txt = J.techName('layout', cut.layout) || cut.layout;
      if (isLocked) {
        x.font = `${10 * dpr}px sans-serif`;
        x.fillText('🔒', x0 + 4 * dpr, cutTop + 13 * dpr);
        x.fillStyle = '#ffd56b';
        x.font = `bold ${10 * dpr}px ${getComputedStyle(document.body).getPropertyValue('--mono') || 'monospace'}`;
        x.fillText(txt, x0 + 18 * dpr, cutTop + 13 * dpr);
      } else {
        x.fillStyle = 'rgba(236,231,225,0.9)';
        x.font = `${10 * dpr}px ${getComputedStyle(document.body).getPropertyValue('--mono') || 'monospace'}`;
        x.fillText(txt, x0 + 5 * dpr, cutTop + 13 * dpr);
      }
      x.restore();
    }
  }

  // Playhead line
  if (S.t >= viewStart && S.t <= viewEnd) {
    const px = X(S.t);
    x.fillStyle = '#f5a50c'; x.fillRect(Math.round(px) - dpr, 0, 2 * dpr, h);
  }
}

function timelineSeek(ev, isDown = false) {
  const r = $('timeline').getBoundingClientRect();
  const { totalD, viewDur, viewStart } = getTimelineView();
  const clickRatio = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width));
  const targetT = viewStart + clickRatio * viewDur;
  const clampedT = Math.max(0, Math.min(totalD, targetT));

  if (isDown && (ev.clientY - r.top) < r.height * 0.42 && S.plan && S.plan.lines && S.plan.lines.length) {
    let hit = -1;
    for (let i = 0; i < S.plan.lines.length; i++) {
      const ln = S.plan.lines[i];
      if (clampedT >= ln.start && clampedT <= ln.end) {
        hit = i;
        break;
      }
    }
    if (hit === -1) {
      let minDiff = Infinity;
      for (let i = 0; i < S.plan.lines.length; i++) {
        const diff = Math.min(Math.abs(clampedT - S.plan.lines[i].start), Math.abs(clampedT - S.plan.lines[i].end));
        if (diff < minDiff) {
          minDiff = diff;
          hit = i;
        }
      }
    }
    if (hit >= 0) {
      setTargetLineIdx(hit, false);
    }
  }

  seek(clampedT);
}

/* ---------------- technique categorization & cut inspector ---------------- */
let currentInspectorDim = 'layout';
let currentInspectorCut = null;
let currentInspectorCat = 'all';
let currentInspectorSearch = '';

function closeCutInspector() {
  const p = typeof $ === 'function' ? $('cutInspectorPopover') : null;
  if (p) p.hidden = true;
  currentInspectorCut = null;
}

function openCutInspector(dimension, cut, anchorEl) {
  if (!cut || cut.line < 0 || cut.subIndex == null) return;
  pause();
  const p = typeof $ === 'function' ? $('cutInspectorPopover') : null;
  if (!p) return;

  currentInspectorDim = dimension;
  currentInspectorCut = cut;
  currentInspectorCat = 'all';
  currentInspectorSearch = '';

  const isZh = J.getLang && J.getLang() === 'zh';
  const dimMeta = {
    layout: { icon: '📐', name: isZh ? '构图排版' : 'レイアウト' },
    enter: { icon: '🚪', name: isZh ? '入场动效' : '登場アニメーション' },
    hold: { icon: '⏳', name: isZh ? '驻留动效' : '保持アニメーション' },
    exit: { icon: '🚪', name: isZh ? '退场动效' : '退場アニメーション' },
    cam: { icon: '🎥', name: isZh ? '运镜轨迹' : 'カメラワーク' },
    treat: { icon: '✨', name: isZh ? '文字质感' : '文字エフェクト' },
    bg: { icon: '🖼️', name: isZh ? '背景图形' : '背景グラフィック' },
    decor: { icon: '🎨', name: isZh ? '装饰组件' : '装飾グラフィック' }
  }[dimension] || { icon: '⚙️', name: dimension };

  $('popoverAutoBtn').textContent = J.t('inspector_auto');
  $('popoverNoneDecor').textContent = J.t('inspector_no_decor');
  $('popoverClose').title = isZh ? '关闭 (Esc)' : '閉じる (Esc)';
  $('popoverSearchClear').title = isZh ? '清空搜索' : '検索をクリア';
  if ($('popoverIcon')) $('popoverIcon').textContent = dimMeta.icon;
  if ($('popoverTitle')) $('popoverTitle').textContent = `${dimMeta.name}`;
  if ($('popoverCutBadge')) {
    $('popoverCutBadge').textContent = isZh ? `第 ${cut.line + 1} 句 · 镜头 #${cut.index + 1}` : `第 ${cut.line + 1} 行 · カット #${cut.index + 1}`;
  }

  const searchInp = $('popoverSearch');
  if (searchInp) {
    searchInp.value = '';
    searchInp.placeholder = isZh ? `搜索 ${dimMeta.name} (中文/日本語/ID)…` : `${dimMeta.name} 検索…`;
  }
  if ($('popoverSearchClear')) $('popoverSearchClear').hidden = true;

  const dimensions = $('popoverDimensions');
  dimensions.innerHTML = ['layout','enter','hold','exit','cam','treat','bg','decor'].map(d => `<button type="button" class="popover-tab-btn ${d===dimension?'active':''}" data-dim="${d}">${J.t('chip_'+d,d)}</button>`).join('');
  dimensions.querySelectorAll('button').forEach(b => b.onclick = () => openCutInspector(b.dataset.dim,currentInspectorCut,anchorEl));
  $('popoverNoneDecor').hidden = dimension !== 'decor';
  renderPopoverTabs();
  renderPopoverGrid();

  p.hidden = false;
  p.style.transform = '';

  // Position popover
  if (anchorEl && typeof anchorEl.getBoundingClientRect === 'function') {
    const r = anchorEl.getBoundingClientRect();
    const pw = Math.min(620, (typeof window !== 'undefined' ? window.innerWidth : 1280) * 0.94);
    let left = r.left + r.width / 2 - pw / 2;
    left = Math.max(10, Math.min((typeof window !== 'undefined' ? window.innerWidth : 1280) - pw - 10, left));
    let top = r.top - 460;
    if (top < 50) top = r.bottom + 8;
    if (top + 450 > (typeof window !== 'undefined' ? window.innerHeight : 720)) {
      top = Math.max(50, (typeof window !== 'undefined' ? window.innerHeight : 720) - 460);
    }
    p.style.left = `${left}px`;
    p.style.top = `${top}px`;
  } else {
    p.style.left = '50%';
    p.style.top = '100px';
    p.style.transform = 'translateX(-50%)';
  }

  if (searchInp && typeof searchInp.focus === 'function') setTimeout(() => searchInp.focus(), 60);
}

function renderPopoverTabs() {
  const tabsEl = typeof $ === 'function' ? $('popoverTabs') : null;
  if (!tabsEl) return;
  const isZh = J.getLang && J.getLang() === 'zh';
  const cats = (TECH_CATEGORIES && TECH_CATEGORIES[currentInspectorDim]) || [];

  let html = `<button type="button" class="popover-tab-btn ${currentInspectorCat === 'all' ? 'active' : ''}" data-cat="all">${isZh ? '全部' : 'すべて'}</button>`;
  cats.forEach(c => {
    const label = isZh ? c.name_zh : c.name_ja;
    html += `<button type="button" class="popover-tab-btn ${currentInspectorCat === c.id ? 'active' : ''}" data-cat="${c.id}">${escapeHtml(label)}</button>`;
  });
  tabsEl.innerHTML = html;
  tabsEl.querySelectorAll('.popover-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentInspectorCat = btn.dataset.cat;
      tabsEl.querySelectorAll('.popover-tab-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderPopoverGrid();
    });
  });
}

function renderPopoverGrid() {
  const gridEl = typeof $ === 'function' ? $('popoverGrid') : null;
  if (!gridEl || !currentInspectorCut) return;
  const isZh = J.getLang && J.getLang() === 'zh';
  const dim = currentInspectorDim;
  const cut = currentInspectorCut;
  const li = cut.line;
  const ov = J.cutOverride(S.project,cut);

  let allKeys = [];
  if (dim === 'layout') allKeys = J.LAYOUT_ORDER ? J.LAYOUT_ORDER.slice() : Object.keys(J.LAYOUTS || {});
  else if (dim === 'enter') allKeys = J.ENTER_ORDER ? J.ENTER_ORDER.slice() : Object.keys(J.ENTER || {});
  else if (dim === 'hold') allKeys = J.HOLD_ORDER ? J.HOLD_ORDER.slice() : Object.keys(J.HOLD || {});
  else if (dim === 'exit') allKeys = J.EXIT_ORDER ? J.EXIT_ORDER.slice() : Object.keys(J.EXIT || {});
  else if (dim === 'cam') allKeys = J.CAMERA_ORDER ? J.CAMERA_ORDER.slice() : Object.keys(J.CAMERA || {});
  else if (dim === 'treat') allKeys = J.TREAT_ORDER ? J.TREAT_ORDER.slice() : Object.keys(J.TREAT || {});
  else if (dim === 'bg') allKeys = J.BG_ORDER ? J.BG_ORDER.slice() : Object.keys(J.BG || {});
  else if (dim === 'decor') allKeys = J.DECOR_ORDER ? J.DECOR_ORDER.slice() : Object.keys(J.DECOR || {});

  allKeys = allKeys.filter(k => !J.registry(dim)[k]?.special);
  const curVal = ov[dim] != null ? ov[dim] : (dim === 'decor' ? (cut.decor && cut.decor[0] ? (typeof cut.decor[0] === 'string' ? cut.decor[0] : cut.decor[0].id) : null) : cut[dim]);

  let filteredKeys = allKeys;
  if (currentInspectorCat !== 'all') {
    const catDef = (TECH_CATEGORIES[dim] || []).find(c => c.id === currentInspectorCat);
    if (catDef && catDef.keys) {
      const set = new Set(catDef.keys);
      filteredKeys = filteredKeys.filter(k => set.has(k));
    }
  }

  const q = (currentInspectorSearch || '').trim().toLowerCase();
  if (q) {
    filteredKeys = filteredKeys.filter(k => {
      if (k.toLowerCase().includes(q)) return true;
      const zh = (J.TECH_NAMES && J.TECH_NAMES[dim] && J.TECH_NAMES[dim][k] && J.TECH_NAMES[dim][k].zh) || '';
      const ja = (J.TECH_NAMES && J.TECH_NAMES[dim] && J.TECH_NAMES[dim][k] && J.TECH_NAMES[dim][k].ja) || '';
      return zh.toLowerCase().includes(q) || ja.toLowerCase().includes(q);
    });
  }

  if ($('popoverCount')) {
    $('popoverCount').textContent = isZh ? `${filteredKeys.length} 个可用手法` : `${filteredKeys.length} 件の手法`;
  }

  if (!filteredKeys.length) {
    gridEl.innerHTML = `<div style="grid-column:1/-1;padding:30px;text-align:center;color:var(--muted);font-size:12px;">${isZh ? '未找到匹配的手法' : '該当する手法が見つかりません'}</div>`;
    return;
  }

  let html = '';
  filteredKeys.forEach(k => {
    const name = J.techName(dim, k) || k;
    const at = name.toLowerCase().indexOf(q);
    const label = q && at >= 0 ? escapeHtml(name.slice(0,at))+'<mark>'+escapeHtml(name.slice(at,at+q.length))+'</mark>'+escapeHtml(name.slice(at+q.length)) : escapeHtml(name);
    const isActive = dim === 'decor' ? (ov.decor ?? (cut.decor || []).map(d => d.id || d)).includes(k) : curVal === k;

    html += `<button type="button" class="popover-card ${isActive ? 'is-active' : ''}" aria-pressed="${isActive}" data-key="${escapeHtml(k)}" title="${escapeHtml(name)}">
      <div class="card-name">${label}</div>

      ${isActive ? `<span class="card-badge">${isZh ? '已应用' : '適用中'} ✓</span>` : ''}
    </button>`;
  });

  gridEl.innerHTML = html;

  gridEl.querySelectorAll('.popover-card').forEach(card => {
    card.addEventListener('click', (event) => {
      event.stopPropagation();
      const selectedKey = card.dataset.key;
      applyInspectorTechnique(dim, selectedKey);
    });
  });
}

function applyInspectorTechnique(dim, selectedKey) {
  if (!currentInspectorCut) return;
  const cut = currentInspectorCut;
  const li = cut.line;
  const isZh = J.getLang && J.getLang() === 'zh';
  const techName = J.techName(dim, selectedKey) || selectedKey;

  remember();
  J.editTechnique(S.project,S.plan,cut,dim,selectedKey);
  replan();
  commit();

  const updatedCut = S.plan && S.plan.cuts ? (S.plan.cuts.find(c => c.line === li && c.subIndex === cut.subIndex) || S.plan.cuts.find(c => c.line === li) || cut) : cut;
  currentInspectorCut = updatedCut;

  renderPopoverGrid();
  updateCutInfo(true);

  const dimNames = {
    layout: isZh ? '构图排版' : 'レイアウト',
    enter: isZh ? '入场动效' : '登場',
    hold: isZh ? '驻留动效' : '保持',
    exit: isZh ? '退场动效' : '退場',
    cam: isZh ? '运镜' : 'カメラ',
    treat: isZh ? '文字质感' : '加工',
    bg: isZh ? '背景' : '背景',
    decor: isZh ? '装饰' : '装飾'
  };
  const dName = dimNames[dim] || dim;
  if (selectedKey === 'noneDecor') { toast(isZh ? `已清空镜头 #${cut.index+1} 的装饰` : `カット #${cut.index+1} の装飾をクリアしました`); return; }
  if (selectedKey === 'auto') {
    toast(isZh ? `已将镜头 #${cut.index+1}【${dName}】恢复为自动推荐${J.isCutLocked(S.project,cut) ? "（本次推荐已锁定）" : ""}` : `第 ${li + 1} 行の【${dName}】を自動推薦に戻しました`);
  } else {
    toast(isZh ? `已应用【${dName} · ${techName}】到镜头 #${cut.index+1}` : `第 ${li + 1} 行に【${dName} · ${techName}】を適用しました`);
  }
}

/* ---------------- cut info ---------------- */
let lastCutIdx = -2;
function updateCutInfo(force) {
  if (!S.plan) return;
  const cut = J.cutAt(S.plan, S.t);
  const idx = cut ? cut.index : -1;
  const li = cut ? cut.line : -1;
  if (li !== S.curLine) {
    S.curLine = li;
    if (S.lineEls && S.lineEls.length) {
      S.lineEls.forEach((el, i) => {
        el.classList.toggle('cur', i === li || i === targetLineIdx);
        el.classList.toggle('is-playing', i === li);
      });
    }
  }
  if (!force && idx === lastCutIdx) return;
  lastCutIdx = idx;
  const el = typeof $ === 'function' ? $('cutInfo') : (typeof document !== 'undefined' ? document.getElementById('cutInfo') : null);
  if (!el) return;
  if (!cut || cut.line < 0 || cut.subIndex == null) {
    el.innerHTML = `<span class="hint">${J.t('no_cut_at_time', '当前播放时刻暂无镜头')}</span>`;
    return;
  }
  const isZh = J.getLang && J.getLang() === 'zh';
  const isLocked = J.isCutLocked(S.project,cut);

  const chipBtn = (dim, cls, label, valKey, isGhost = false) => {
    const valName = J.techName(dim, valKey) || valKey || (isGhost ? (isZh ? '无 / 点选' : 'なし / 選択') : (isZh ? '默认' : '既定'));
    return `<button type="button" class="chip chip-btn ${cls} ${isGhost ? 'ghost-chip' : ''}" data-dim="${dim}" title="${label}: ${valName} (${isZh ? '点击调出手法检查器' : 'クリックで手法変更'})"><b>${label}</b><span>${escapeHtml(valName)}</span></button>`;
  };

  const decorNames = (cut.decor && cut.decor.length)
    ? cut.decor.map(d => J.techName('decor', typeof d === 'string' ? d : d.id)).join('・')
    : null;

  const decorHtml = decorNames
    ? `<button type="button" class="chip chip-btn" data-dim="decor" title="${J.t('chip_decor', '装饰')}: ${escapeHtml(decorNames)} (${isZh ? '点击调出手法检查器' : 'クリックで手法変更'})"><b>${J.t('chip_decor', '装饰')}</b><span>${escapeHtml(decorNames)}</span></button>`
    : chipBtn('decor', '', J.t('chip_decor', '装饰'), '', true);

  const lockBtnHtml = cut.line >= 0
    ? `<button type="button" class="chip chip-btn lock-btn ${isLocked ? 'is-locked' : ''}" id="btnCutLockToggle" title="${J.t('btn_lock_current_tip', '锁定/解锁当前镜头手法与参数')}">${isLocked ? (isZh ? '🔒 已锁定' : '🔒 ロック中') : (isZh ? '🔓 未锁定' : '🔓 ロック解除')}</button>`
    : '';

  el.innerHTML = [
    lockBtnHtml,
    `<span class="chip mono">#${String(cut.index + 1).padStart(2, '0')}</span>`,
    chipBtn('layout', 'l', J.t('chip_layout', '构图'), cut.layout),
    chipBtn('enter', 'e', J.t('chip_enter', '入场'), cut.enter),
    chipBtn('hold', 'h', J.t('chip_hold', '驻留'), cut.hold),
    chipBtn('exit', 'x', J.t('chip_exit', '退场'), cut.exit),
    chipBtn('cam', 'c', J.t('chip_cam', '运镜'), cut.cam, !cut.cam || cut.cam === 'push'),
    chipBtn('treat', 't', J.t('chip_treat', '质感'), cut.treat, !cut.treat || cut.treat === 'none'),
    chipBtn('bg', 'b', J.t('chip_bg', '背景'), cut.bg, !cut.bg || cut.bg === 'none'),
    decorHtml
  ].filter(Boolean).join('');

  const lockBtn = el.querySelector('#btnCutLockToggle');
  if (lockBtn) {
    lockBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleCutLock(cut.line, undefined, undefined, cut);
    });
  }

  el.querySelectorAll('.chip-btn[data-dim]').forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      openCutInspector(b.dataset.dim, cut, b);
    });
  });
}

if (typeof window !== 'undefined') {
  window.openCutInspector = openCutInspector;
  window.closeCutInspector = closeCutInspector;
  window.toggleCutLock = toggleCutLock;
}
J.openCutInspector = openCutInspector;
J.closeCutInspector = closeCutInspector;
J.toggleCutLock = toggleCutLock;

/* ---------------- line timing & target line control ---------------- */
let targetLineIdx = 0;
let autoStepEnabled = true;

function setTargetLineIdx(idx, doSeek = false) {
  const n = (S.plan && S.plan.lines) ? S.plan.lines.length : 0;
  if (n === 0) {
    targetLineIdx = 0;
    updateActiveLineHeader();
    return;
  }
  targetLineIdx = Math.max(0, Math.min(idx, n - 1));
  updateActiveLineHeader();
  updateLineListTargetHighlight();
  if (doSeek && S.plan.lines[targetLineIdx]) {
    seek(S.plan.lines[targetLineIdx].start + 0.001);
  }
  drawTimeline();
}

function updateLineListTargetHighlight() {
  if (!S.lineEls || !S.lineEls.length) return;
  S.lineEls.forEach((el, i) => {
    el.classList.toggle('is-target', i === targetLineIdx);
  });
}

function updateStampButtons() {
  const isZh = J.getLang && J.getLang() === 'zh';
  const curTStr = S.t.toFixed(2) + 's';
  const ln = (S.plan && S.plan.lines) ? S.plan.lines[targetLineIdx] : null;
  const numStr = targetLineIdx + 1;
  const preview = ln ? (ln.text.slice(0, 8) + (ln.text.length > 8 ? '…' : '')) : '';

  const btnS = $('btnStampS');
  const btnE = $('btnStampE');
  const panelS = $('btnPanelStampS');
  const panelE = $('btnPanelStampE');

  const sLabel = isZh ? `S 起点 (${curTStr})` : `S 開始 (${curTStr})`;
  const eLabel = isZh ? `E 终点 (${curTStr})` : `E 終了 (${curTStr})`;
  const sTitle = isZh ? `将【第 ${numStr} 句 "${preview}"】起点设为当前 ${curTStr} (快捷键 S)` : `第 ${numStr} 行 "${preview}" の開始点を ${curTStr} に設定 (S)`;
  const eTitle = isZh ? `将【第 ${numStr} 句 "${preview}"】终点设为当前 ${curTStr} (快捷键 E)` : `第 ${numStr} 行 "${preview}" の終了点を ${curTStr} に設定 (E)`;

  if (btnS) { btnS.textContent = sLabel; btnS.title = sTitle; }
  if (btnE) { btnE.textContent = eLabel; btnE.title = eTitle; }
  if (panelS) { panelS.textContent = sLabel; panelS.title = sTitle; }
  if (panelE) { panelE.textContent = eLabel; panelE.title = eTitle; }
}

function updateActiveLineHeader() {
  const lbl = $('timingActiveLabel');
  const prevEl = $('timingActivePreview');
  const rngEl = $('timingActiveRange');
  const badgeEl = $('transportTargetBadge');
  const isZh = J.getLang && J.getLang() === 'zh';

  if (!S.plan || !S.plan.lines || !S.plan.lines.length) {
    if (lbl) lbl.textContent = isZh ? '🎯 目标: 无分句' : '🎯 対象: なし';
    if (prevEl) prevEl.textContent = '—';
    if (rngEl) rngEl.textContent = '';
    if (badgeEl) badgeEl.textContent = isZh ? '🎯 目标: 无' : '🎯 対象: なし';
    return;
  }

  const n = S.plan.lines.length;
  targetLineIdx = Math.max(0, Math.min(targetLineIdx, n - 1));
  const ln = S.plan.lines[targetLineIdx];
  const manStart = S.project.timing.lineTimes && S.project.timing.lineTimes[targetLineIdx] != null;
  const manEnd = S.project.timing.lineEnds && S.project.timing.lineEnds[targetLineIdx] != null ? S.project.timing.lineEnds[targetLineIdx] : null;
  const startT = manStart ? S.project.timing.lineTimes[targetLineIdx] : ln.start;
  const endT = manEnd != null ? manEnd : ln.end;

  const rawTxt = ln ? ln.text : '';
  const preview = rawTxt.slice(0, 14) + (rawTxt.length > 14 ? '…' : '');

  if (lbl) {
    lbl.textContent = isZh ? `🎯 目标: 第 ${targetLineIdx + 1}/${n} 句` : `🎯 対象: 第 ${targetLineIdx + 1}/${n} 行`;
  }
  if (prevEl) {
    prevEl.textContent = `"${preview}"`;
    prevEl.title = `第 ${targetLineIdx + 1} 句: ${rawTxt}`;
  }
  if (rngEl) {
    rngEl.textContent = `[${startT.toFixed(2)}s ~ ${endT.toFixed(2)}s]`;
  }
  if (badgeEl) {
    badgeEl.textContent = `🎯 ${String(targetLineIdx + 1).padStart(2, '0')} ${preview}`;
    badgeEl.title = isZh ? `当前目标句: 第 ${targetLineIdx + 1} 句 "${rawTxt}" (${startT.toFixed(2)}s-${endT.toFixed(2)}s)` : `第 ${targetLineIdx + 1} 行 "${rawTxt}"`;
  }

  updateStampButtons();
  updateLineListTargetHighlight();
}

function getActiveLineIdx() {
  const n = (S.plan && S.plan.lines) ? S.plan.lines.length : 0;
  if (n === 0) return 0;
  if (targetLineIdx >= 0 && targetLineIdx < n) return targetLineIdx;
  if (S.curLine >= 0 && S.curLine < n) return S.curLine;
  return 0;
}

function nudgeLine(idx, delta) {
  if (!S.plan || !S.plan.lines || !S.plan.lines[idx]) return;
  if (!S.project.timing.lineTimes) S.project.timing.lineTimes = {};
  const ln = S.plan.lines[idx];
  const curStart = (S.project.timing.lineTimes[idx] != null) ? S.project.timing.lineTimes[idx] : ln.start;
  const nextStart = Math.max(0, +(curStart + delta).toFixed(2));
  S.project.timing.lineTimes[idx] = nextStart;
  if (S.project.timing.lineEnds && S.project.timing.lineEnds[idx] != null) {
    S.project.timing.lineEnds[idx] = Math.max(nextStart + 0.1, +(S.project.timing.lineEnds[idx] + delta).toFixed(2));
  }
  setTargetLineIdx(idx, false);
  const isZh = J.getLang && J.getLang() === 'zh';
  pushTimingState(isZh ? `第 ${idx + 1} 句微调 ${delta > 0 ? '+' : ''}${delta.toFixed(2)}s` : `第 ${idx + 1} 行微調整 ${delta > 0 ? '+' : ''}${delta.toFixed(2)}s`);
  replan();
  seek(nextStart + 0.001);
  toast(isZh ? `第 ${idx + 1} 句微调: ${delta > 0 ? '+' : ''}${delta.toFixed(2)}s → ${nextStart.toFixed(2)}s` : `第 ${idx + 1} 行微調整: ${delta > 0 ? '+' : ''}${delta.toFixed(2)}s`);
}

function rippleShiftFrom(startIdx, delta) {
  if (!S.plan || !S.plan.lines || startIdx < 0 || startIdx >= S.plan.lines.length) return;
  if (!S.project.timing.lineTimes) S.project.timing.lineTimes = {};
  if (!S.project.timing.lineEnds) S.project.timing.lineEnds = {};
  const total = S.plan.lines.length;
  let count = 0;
  for (let i = startIdx; i < total; i++) {
    const ln = S.plan.lines[i];
    const curStart = (S.project.timing.lineTimes[i] != null) ? S.project.timing.lineTimes[i] : ln.start;
    const nextStart = Math.max(0, +(curStart + delta).toFixed(2));
    S.project.timing.lineTimes[i] = nextStart;
    if (S.project.timing.lineEnds[i] != null) {
      S.project.timing.lineEnds[i] = Math.max(nextStart + 0.1, +(S.project.timing.lineEnds[i] + delta).toFixed(2));
    }
    count++;
  }
  setTargetLineIdx(startIdx, false);
  const isZh = J.getLang && J.getLang() === 'zh';
  pushTimingState(isZh ? `从第 ${startIdx + 1} 句起平移 ${delta > 0 ? '+' : ''}${delta.toFixed(2)}s` : `${startIdx + 1}行目以降シフト ${delta > 0 ? '+' : ''}${delta.toFixed(2)}s`);
  replan();
  seek(S.project.timing.lineTimes[startIdx] + 0.001);
  toast(isZh ? `已将第 ${startIdx + 1}~${total} 句 (共${count}句) 整体平移 ${delta > 0 ? '+' : ''}${delta.toFixed(2)}s` : `${startIdx + 1}行目以降 (${count}行) を ${delta > 0 ? '+' : ''}${delta.toFixed(2)}s シフト`);
}

/* ---------------- inline lyric edit in line list ---------------- */
function startInlineLyricEdit(lineIndex, textElement) {
  if (!S.plan || !S.plan.lines || !S.plan.lines[lineIndex]) return;
  const ln = S.plan.lines[lineIndex];
  const oldText = ln.text;
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'txt-inline-edit';
  input.value = oldText;

  textElement.replaceWith(input);
  input.focus();
  input.select();

  let committed = false;
  function commitChange() {
    if (committed) return;
    committed = true;
    const newText = input.value.trim();
    if (newText && newText !== oldText) {
      updateSingleLyricText(lineIndex, newText);
    } else {
      replan();
    }
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitChange();
      setTimeout(() => {
        if (lineIndex + 1 < S.plan.lines.length) {
          const nextLi = S.lineEls[lineIndex + 1];
          if (nextLi) {
            const nextTxt = nextLi.querySelector('.txt');
            if (nextTxt) startInlineLyricEdit(lineIndex + 1, nextTxt);
          }
        }
      }, 60);
    } else if (e.key === 'Escape') {
      committed = true;
      replan();
    }
  });

  input.addEventListener('blur', () => {
    commitChange();
  });
}

function updateSingleLyricText(lineIndex, newText) {
  const lines = String(S.project.lyrics || '').replace(/\r/g, '').split('\n');
  let nonCommentIdx = 0;
  for (let i = 0; i < lines.length; i++) {
    const s0 = lines[i].trim();
    if (!s0 || s0.startsWith('#') || /^\[(ti|ar|al|by|offset):/i.test(s0)) continue;
    if (nonCommentIdx === lineIndex) {
      const m = lines[i].match(/^(\s*(?:\[\d+:\d+(?:[.:]\d+)?(?:\s*[-~至到]\s*\d+:\d+(?:[.:]\d+)?)?\])+)/);
      const tag = m ? m[1] : '';
      lines[i] = tag + newText;
      break;
    }
    nonCommentIdx++;
  }
  S.project.lyrics = lines.join('\n');
  if ($('lyrics')) $('lyrics').value = S.project.lyrics;
}

/* ---------------- line list ---------------- */
function renderLines() {
  const ol = $('lineList'); ol.innerHTML = ''; S.lineEls = []; S.curLine = -2;
  if (!S.plan || !S.plan.lines) return;
  const isZh = J.getLang && J.getLang() === 'zh';
  const ov = S.project.overrides;
  const layoutOpts = `<option value="">${isZh ? '自动' : '自動'}</option>` + J.LAYOUT_ORDER.map(k => `<option value="${k}">${J.techName('layout', k)}</option>`).join('');
  S.plan.lines.forEach((ln, i) => {
    const o = ov[i] || {};
    const li = document.createElement('li'); li.className = 'ln';
    if (i === targetLineIdx) li.classList.add('is-target');
    if (i === S.curLine) li.classList.add('is-playing');
    const manualStart = S.project.timing.lineTimes && S.project.timing.lineTimes[i] != null;
    const manualEnd = S.project.timing.lineEnds && S.project.timing.lineEnds[i] != null ? S.project.timing.lineEnds[i] : null;
    const dur = Math.max(0.1, ln.end - ln.start);
    const startTitle = isZh ? `开始（秒）${manualStart ? '·手动' : '·自动'}` : `開始（秒）${manualStart ? '・手動' : '・自動'}`;
    const endTitle = isZh ? `结束（秒）${manualEnd != null ? '·手动' : '·自动'}` : `終了（秒）${manualEnd != null ? '・手動' : '・自動'}`;
    const diceTitle = isZh ? '重组本句全部未锁定镜头（保留手动指定）' : 'この行の未ロックカットを再構成（手動指定を保持）';
    const lockTitle = isZh ? '锁定／解锁本句全部镜头' : 'この行の全カットをロック／解除';
    const layoutAria = isZh ? '指定排版' : 'レイアウト指定';

    const timeVal = manualEnd != null ? `${ln.start.toFixed(2)}-${manualEnd.toFixed(2)}` : ln.start.toFixed(2);
    const timeTitle = isZh ? '开始秒数。支持秒数 (如 12.5)、分秒 (如 1:23.45)、区间 (如 10-15) 或相对增减 (如 +0.5)' : '開始秒。0-3などの区間指定や1:23形式も可能';
    const noTitle = isZh ? '点击从此句开始对齐打点 (预卷2秒)' : 'この行からステップ同期を開始（2秒巻き戻し）';

    li.innerHTML = `<span class="no" title="${noTitle}">${String(i + 1).padStart(2, '0')}</span>
      <div class="time-wrap" style="display:inline-flex;align-items:center;gap:1px;">
        <button type="button" class="mini-nudge" data-delta="-0.1" title="${isZh ? '本句向前微调 0.1s' : '0.1秒戻す'}" style="padding:1px 3px;font-size:10px;line-height:1;background:transparent;border:none;color:var(--muted);cursor:pointer;">◀</button>
        <input class="time mono" type="text" value="${timeVal}" title="${timeTitle}\n${isZh ? '💡 支持鼠标滚轮直接微调 (±0.05s / 按住Shift ±0.2s)' : 'ホイールで微調整可能'}" aria-label="${i + 1}行目の時間" style="${manualEnd != null ? 'border-color:var(--amber);color:var(--amber)' : manualStart ? 'border-color:var(--cyan)' : ''}">
        <button type="button" class="mini-nudge" data-delta="0.1" title="${isZh ? '本句向后微调 0.1s' : '0.1秒進める'}" style="padding:1px 3px;font-size:10px;line-height:1;background:transparent;border:none;color:var(--muted);cursor:pointer;">▶</button>
      </div>
      <span class="txt" title="${escapeHtml(ln.text)}\n💡 ${isZh ? '单击选择目标句，双击可直接编辑文本' : 'クリックで対象選択、ダブルクリックで歌詞編集'}">${escapeHtml(ln.text)}</span>
      <div class="meta"><span class="cuts"></span>
      <span class="tools">
        <select aria-label="${layoutAria}">${layoutOpts}</select>
        <button class="icon ghost dice" title="${diceTitle}">${ICON.dice}</button>
        <button class="icon ghost lock" title="${lockTitle}" aria-pressed="${S.plan.cuts.some(c => c.line === i && J.isCutLocked(S.project,c)) ? 'true' : 'false'}">${ICON.lock}</button>
      </span></div>`;
    const rowCuts = S.plan.cuts.filter(c => c.line === i && c.subIndex != null);
    li.querySelector('select').value = rowCuts.length && rowCuts.every(c => c.layout === rowCuts[0].layout) ? rowCuts[0].layout : '';
    li.querySelector('select').title = isZh ? '修改本句全部镜头的构图；下方标签可独立编辑' : 'この行の全カットのレイアウトを変更';
    li.querySelector('.time').addEventListener('change', e => {
      const s = e.target.value.trim();
      const parsedRange = J.parseTimeRange ? J.parseTimeRange(s, ln.start, manualEnd) : null;
      if (!S.project.timing.lineTimes) S.project.timing.lineTimes = {};
      if (!S.project.timing.lineEnds) S.project.timing.lineEnds = {};
      if (parsedRange) {
        S.project.timing.lineTimes[i] = parsedRange.start;
        if (parsedRange.end != null) {
          S.project.timing.lineEnds[i] = parsedRange.end;
        } else {
          delete S.project.timing.lineEnds[i];
        }
      } else if (!s) {
        delete S.project.timing.lineTimes[i];
        delete S.project.timing.lineEnds[i];
      }
      const isZh = J.getLang && J.getLang() === 'zh';
      pushTimingState(isZh ? `第 ${i + 1} 句输入时间` : `第 ${i + 1} 行時間入力`);
      replan();
    });
    li.querySelector('.no').addEventListener('click', () => startTap(i, 'lyrics'));
    const txtSpan = li.querySelector('.txt');
    txtSpan.addEventListener('click', () => {
      setTargetLineIdx(i, true);
    });
    txtSpan.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      startInlineLyricEdit(i, txtSpan);
    });
    li.addEventListener('click', (e) => {
      if (['INPUT', 'SELECT', 'BUTTON'].includes(e.target.tagName)) return;
      setTargetLineIdx(i, false);
    });
    li.querySelectorAll('.mini-nudge').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        setTargetLineIdx(i, false);
        const d = parseFloat(btn.dataset.delta);
        nudgeLine(i, d);
      });
    });
    const timeInp = li.querySelector('.time');
    timeInp.addEventListener('wheel', e => {
      e.preventDefault();
      setTargetLineIdx(i, false);
      const delta = e.deltaY < 0 ? (e.shiftKey ? 0.2 : 0.05) : (e.shiftKey ? -0.2 : -0.05);
      nudgeLine(i, delta);
    }, { passive: false });
    li.querySelector('select').addEventListener('change', e => { remember(); for (const c of S.plan.cuts.filter(c => c.line === i && c.subIndex != null)) J.editTechnique(S.project,S.plan,c,'layout',e.target.value || 'auto'); replan(); commit(); });
    li.querySelector('.dice').addEventListener('click', () => {
      setTargetLineIdx(i, false);
      shuffleCutLine(i);
    });
    li.querySelector('.lock').addEventListener('click', () => {
      setTargetLineIdx(i, false);
      toggleCutLock(i);
    });
    const inspectBtn = document.createElement('button');
    inspectBtn.type = 'button';
    inspectBtn.className = 'icon ghost cut-inspect-btn';
    inspectBtn.title = isZh ? '编辑本句第一个镜头；下方标签可选其他镜头' : '最初のカットを編集（下のタグで各カットを選択）';
    inspectBtn.innerHTML = '🔍';
    inspectBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setTargetLineIdx(i, false);
      const cut = S.plan.cuts.find(c => c.line === i);
      if (cut) {
        seek(cut.start + Math.min(cut.dur * 0.5, cut.inDur + 0.05));
        openCutInspector('layout', cut, inspectBtn);
      }
    });
    li.querySelector('.tools').appendChild(inspectBtn);

    const cutsEl = li.querySelector('.cuts');
    if (manualEnd != null) {
      const sp = document.createElement('span');
      sp.textContent = `${dur.toFixed(1)}s区间`;
      sp.style.borderColor = 'var(--amber)';
      sp.style.color = 'var(--amber)';
      cutsEl.appendChild(sp);
    }
    S.plan.cuts.filter(c => c.line === i && J.LAYOUTS[c.layout] && !J.LAYOUTS[c.layout].special).forEach(c => {
      const sp = document.createElement('span');
      sp.className = 'cut-tag';
      sp.textContent = J.techName('layout', c.layout);
      sp.title = `${c.text}｜${J.techName('enter', c.enter)} → ${J.techName('exit', c.exit)} (${isZh ? '点击检查/修改手法' : 'クリックで手法変更'})`;
      sp.style.borderColor = `hsla(${layoutHue(c.layout)},70%,58%,0.7)`;
      sp.addEventListener('click', (e) => {
        e.stopPropagation();
        setTargetLineIdx(i, false);
        seek(c.start + Math.min(c.dur * 0.5, c.inDur + 0.05));
        openCutInspector('layout', c, sp);
      });
      cutsEl.appendChild(sp);
    });
    ol.appendChild(li); S.lineEls.push(li);
  });
  $('linesInfo').textContent = isZh ? `${S.plan.lines.length} 行 / ${S.plan.cuts.length} 镜头` : `${S.plan.lines.length}行 / ${S.plan.cuts.length}カット`;
  updateActiveLineHeader();
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

/* ---------------- style tab ---------------- */
function drawStyleGrid() {
  const g = $('styleGrid');
  const isZh = J.getLang && J.getLang() === 'zh';
  if (!g.children.length) {
    J.STYLE_ORDER.forEach(k => {
      const b = document.createElement('button'); b.className = 'stile'; b.dataset.k = k;
      b.title = J.styleDesc(k);
      b.innerHTML = `<canvas width="192" height="108"></canvas><span>${escapeHtml(J.styleName(k))}</span>`;
      b.addEventListener('click', () => { remember(); S.project.style = k; S.project.colors.enabled = false; syncUI(); replan(); commit(); });
      g.appendChild(b);
    });
  }
  [...g.children].forEach(b => {
    const k = b.dataset.k, st = J.STYLES[k], sc = st.schemes[0], cv = b.querySelector('canvas'), x = cv.getContext('2d');
    b.setAttribute('aria-pressed', S.project.style === k ? 'true' : 'false');
    b.title = J.styleDesc(k);
    const span = b.querySelector('span');
    if (span) span.textContent = J.styleName(k);
    x.fillStyle = sc.bg; x.fillRect(0, 0, 192, 108);
    st.schemes.slice(1, 4).forEach((s2, i) => { x.fillStyle = s2.bg; x.fillRect(192 - 14 * (i + 1), 0, 14, 10); });
    const f = (isZh && st.fonts_zh && st.fonts_zh.display) ? st.fonts_zh.display[0] : st.fonts.display[0];
    x.font = J.fontCSS(f, 46); x.textAlign = 'center'; x.textBaseline = 'middle';
    const mark = '字面';
    x.fillStyle = sc.ghostB; x.fillText(mark, 96 - 3, 54 - 1);
    x.fillStyle = sc.ghostA; x.fillText(mark, 96 + 3, 54 + 2);
    x.fillStyle = sc.fg; x.fillText(mark, 96, 54);
    x.fillStyle = sc.accent; x.fillRect(12, 90, 30, 4);
    x.font = J.fontCSS('mono', 9); x.textAlign = 'left'; x.fillStyle = sc.sub; x.fillText(k.toUpperCase(), 48, 93);
  });
}
function fontSelectOptions(sel) {
  const def = J.t('font_opt_default', 'スタイルの既定');
  return `<option value="">${def}</option>` + Object.entries(J.FONTS).map(([k, f]) => `<option value="${k}" ${sel === k ? 'selected' : ''}>${escapeHtml(f.label)}</option>`).join('');
}
function renderFontRoles() {
  const box = $('fontRoles'); box.innerHTML = '';
  [[ 'display', J.t('font_role_display', '見出し') ],
   [ 'serif', J.t('font_role_serif', '明朝枠') ],
   [ 'body', J.t('font_role_body', '小さな文字') ]].forEach(([role, label]) => {
    const row = document.createElement('div'); row.className = 'font-row';
    row.innerHTML = `<span class="muted">${label}</span><select aria-label="${label}のフォント">${fontSelectOptions(S.project.fonts[role])}</select>`;
    row.querySelector('select').addEventListener('change', e => { if (e.target.value) S.project.fonts[role] = e.target.value; else delete S.project.fonts[role]; fontKey = ''; replan(); });
    box.appendChild(row);
  });
}
function getBaseKeys() {
  return [['bg', J.t('color_bg', '背景')], ['fg', J.t('color_fg', '文字')], ['sub', J.t('color_sub', '補助')]];
}
function getAccentKeys() {
  return [['accent', J.t('color_accent', 'アクセント')], ['ghostA', J.t('color_ghostA', 'ズレ色A')], ['ghostB', J.t('color_ghostB', 'ズレ色B')]];
}
function renderColors() {
  const st = J.STYLES[S.project.style] || J.STYLES.noir, sc = st.schemes[0];
  const c = S.project.colors;
  $('colorOn').checked = !!c.enabled;
  $('accentOn').checked = !!c.accentOn;
  const fill = (rowId, keys, flag) => {
    const row = $(rowId); row.innerHTML = '';
    keys.forEach(([k, label]) => {
      const l = document.createElement('label');
      const v = (c[flag] && c[k]) || c[k] || sc[k];
      l.innerHTML = `${label}<input type="color" value="${toColorInput(v)}">`;
      l.querySelector('input').addEventListener('input', e => {
        c[k] = e.target.value.toUpperCase();
        if (!c[flag]) { c[flag] = true; $(flag === 'enabled' ? 'colorOn' : 'accentOn').checked = true; }
        replanSoon(60); drawSwatch();
      });
      row.appendChild(l);
    });
  };
  fill('colorRow', getBaseKeys(), 'enabled');
  fill('colorRowAccent', getAccentKeys(), 'accentOn');
  drawSwatch();
}
const toColorInput = v => { const h = String(v || '#000000'); return /^#[0-9a-f]{6}$/i.test(h) ? h.toLowerCase() : J.toHex(...J.hex(h)).toLowerCase(); };
function swatchHTML(cols) { return cols.map(c => `<i style="background:${c}" title="${c}"></i>`).join(''); }
function drawSwatch() {
  const sc = S.plan ? S.plan.style.schemes[0] : null; if (!sc) return;
  $('paletteSwatch').innerHTML = swatchHTML([sc.accent, sc.ghostA, sc.ghostB]);
}
function randomPalette() {
  remember();
  const c = S.project.colors;
  const sc0 = J.STYLES[S.project.style].schemes[0];
  const bg = c.enabled && c.bg ? c.bg : sc0.bg;
  let p, guard = 0;
  do { p = J.randomPalette(bg); } while (guard++ < 6 && p.ghostA === c.ghostA && p.ghostB === c.ghostB);
  Object.assign(c, { accent: p.accent, ghostA: p.ghostA, ghostB: p.ghostB, accentOn: true });
  renderColors(); replan(); commit();
  const isZh = J.getLang && J.getLang() === 'zh';
  toast(isZh ? '配色：已更换点缀色与色散通道' : '配色：アクセント・ズレ色A/Bを変更', [p.accent, p.ghostA, p.ghostB]);
}

/* ---------------- history of looks (◀ ▶) ---------------- */
// only the "look" is tracked — lyrics, timing and output settings are never rolled back
const HKEYS = ['style', 'mood', 'seed', 'fx', 'enabled', 'fonts', 'colors', 'overrides'];
const H = { list: [], i: -1 };
const lookSnap = () => JSON.stringify(Object.fromEntries(HKEYS.map(k => [k, S.project[k] ?? null])));
function remember() {            // call before changing the look: makes sure the current look is on the stack
  const s = lookSnap();
  if (H.i >= 0 && H.list[H.i] === s) return;
  H.list = H.list.slice(0, H.i + 1); H.list.push(s); H.i = H.list.length - 1;
}
function commit() {              // call after changing the look
  const s = lookSnap();
  if (H.list[H.i] !== s) { H.list = H.list.slice(0, H.i + 1); H.list.push(s); H.i = H.list.length - 1; }
  if (H.list.length > 80) { H.list.splice(0, H.list.length - 80); H.i = H.list.length - 1; }
  updateHist();
}
function histGo(d) {
  if (S.exporting) return;
  remember();                    // hand edits made since the last step become a stop of their own
  const j = H.i + d; if (j < 0 || j >= H.list.length) return;
  H.i = j;
  Object.assign(S.project, JSON.parse(H.list[j]));
  fontKey = ''; syncUI(); replan(); updateHist();
  const isZh = J.getLang && J.getLang() === 'zh';
  toast(`${j + 1} / ${H.list.length} ${isZh ? '套方案' : '案目'}`);
  restartPreview();
}
function updateHist() {
  const canB = H.i > 0, canF = H.i < H.list.length - 1;
  ['btnPrev', 'btnPrev2'].forEach(id => { $(id).disabled = !canB; });
  ['btnNext', 'btnNext2'].forEach(id => { $(id).disabled = !canF; });
  $('histPos').textContent = H.list.length > 1 ? `${H.i + 1} / ${H.list.length}` : '';
}

/* ---------------- おまかせ ---------------- */
function restartPreview() { seek(0); if (!S.playing && S.mode === 'easy') play(); }
function omakase() {
  if (S.exporting || S.tap) return;
  remember();
  const lockedCount = S.plan.cuts.filter(c => J.isCutLocked(S.project,c)).length;
  const changedCount = S.plan.cuts.filter(c => c.subIndex != null).length-lockedCount;
  const r = J.omakase(S.project);
  Object.assign(S.project, r);
  fontKey = ''; syncUI(); replan(); commit();
  const isZh = J.getLang && J.getLang() === 'zh';
  const moodObj = J.MOODS[r.mood];
  const moodName = moodObj ? (isZh ? moodObj.name_zh || moodObj.name : moodObj.name) : r.mood;
  toast(`${isZh ? '一键生成' : 'おまかせ'}：${J.styleName(r.style)} × ${moodName} · ${isZh ? changedCount+' 个镜头重新生成，'+lockedCount+' 个锁定保持不变' : changedCount+' カット生成、'+lockedCount+' カットはロック維持'}`, r.colors.accentOn ? [r.colors.accent, r.colors.ghostA, r.colors.ghostB] : null);
  restartPreview();
}
// change just one aspect of the current look
function rerollPart(part) {
  if (S.exporting || S.tap) return;
  if (part === 'cut') { shuffleAllCuts(); return; }
  remember();
  const P = S.project;
  const isZh = J.getLang && J.getLang() === 'zh';
  let msg = '';
  if (part === 'style') {
    const pool = J.STYLE_ORDER.filter(k => k !== P.style);
    P.style = pool[Math.floor(Math.random() * pool.length)];
    P.colors.enabled = false;
    msg = `${isZh ? '视觉风格' : 'スタイル'}：${J.styleName(P.style)}`;
  } else if (part === 'mood') {
    const r = J.omakase(P);
    Object.assign(P, { mood: r.mood, fx: r.fx, enabled: r.enabled });
    const moodObj = J.MOODS[r.mood];
    const moodName = moodObj ? (isZh ? moodObj.name_zh || moodObj.name : moodObj.name) : r.mood;
    msg = `${isZh ? '情绪氛围' : '雰囲気'}：${moodName}`;
  } else if (part === 'cut') {
    P.seed = (Math.random() * 1e9) | 0;
    msg = isZh ? '镜头构成：重新编排排版与动效' : '構成：レイアウトと動きを再抽選';
  }
  fontKey = ''; syncUI(); replan(); commit();
  toast(msg);
  restartPreview();
}
function showNow() {
  const el = $('easyNow'); if (!el || !S.plan || el.closest('[hidden]')) return;
  const P = S.project, sc = S.plan.style.schemes[0];
  const isZh = J.getLang && J.getLang() === 'zh';
  const moodName = P.mood && J.MOODS[P.mood] ? (isZh ? J.MOODS[P.mood].name_zh || J.MOODS[P.mood].name : J.MOODS[P.mood].name) : (isZh ? '自定义' : 'カスタム');
  const fk = S.plan.style.fonts.display[0];
  const fontName = J.FONTS[fk] ? J.FONTS[fk].label : fk;
  const cuts = S.plan.cuts.filter(c => c.line >= 0 && c.layout !== 'interlude');
  const kinds = new Set(cuts.map(c => c.layout)).size;
  const row = (k, v) => `<div class="now-row"><span class="k">${k}</span><span class="v">${v}</span></div>`;
  el.innerHTML = row(isZh ? '视觉风格' : 'スタイル', `<b>${escapeHtml(J.styleName(P.style))}</b>`)
    + row(isZh ? '情绪氛围' : '雰囲気', escapeHtml(moodName))
    + row(isZh ? '色彩搭配' : '配色', `<span class="swatches">${swatchHTML([sc.bg, sc.fg, sc.accent, sc.ghostA, sc.ghostB])}</span>${P.colors.accentOn ? `<span class="tagl">${isZh ? '随机' : 'ランダム'}</span>` : ''}`)
    + row(isZh ? '标题字体' : '見出し書体', escapeHtml(fontName))
    + row(isZh ? '镜头构成' : '構成', isZh ? `${cuts.length} 个镜头 · ${kinds} 种排版` : `${cuts.length} カット・レイアウト ${kinds} 種`)
    + row(isZh ? '动态表现' : '演出', isZh ? `质感 ${cuts.filter(c => c.treat && c.treat !== 'none').length} · 背景 ${new Set(cuts.map(c => c.bg).filter(b => b && b !== 'none')).size} 种 · 运镜 ${cuts.filter(c => c.cam && c.cam !== 'push').length}` : `加工 ${cuts.filter(c => c.treat && c.treat !== 'none').length}・背景 ${new Set(cuts.map(c => c.bg).filter(b => b && b !== 'none')).size}種・カメラ ${cuts.filter(c => c.cam && c.cam !== 'push').length}`);
}
let toastTimer = 0;
function toast(m, cols) {
  const el = $('toast'); if (!el) return;
  el.innerHTML = escapeHtml(m) + (cols ? `<span class="swatches">${swatchHTML(cols)}</span>` : '');
  el.hidden = false; el.classList.remove('out'); void el.offsetWidth; el.classList.add('in');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.classList.remove('in'); el.classList.add('out'); toastTimer = setTimeout(() => { el.hidden = true; }, 260); }, 1700);
}

/* ---------------- かんたん / 詳細 ---------------- */
function setMode(m) {
  S.mode = m === 'easy' ? 'easy' : 'pro';
  const easy = S.mode === 'easy';
  $('app').classList.toggle('is-easy', easy);
  $('easyPanel').hidden = !easy;
  $('modeEasy').setAttribute('aria-pressed', String(easy));
  $('modePro').setAttribute('aria-pressed', String(!easy));
  try { localStorage.setItem('jizura.mode', S.mode); } catch (e) {}
  if (easy) { showNow(); syncOut(); codecNote(); }
  sizeViewport(); drawTimeline();
}

/* ---------------- fx tab ---------------- */
function getFxList() {
  const isZh = J.getLang && J.getLang() === 'zh';
  return [
    ['motion', J.t('slider_motion', '動きの強さ')],
    ['glitch', J.t('slider_glitch', 'グリッチ')],
    ['chroma', J.t('slider_chroma', '色ズレ')],
    ['decor', J.t('slider_decor', '装飾の量')],
    ['density', J.t('slider_density', 'カットの細かさ')],
    ['texture', J.t('slider_texture', '質感')],
    ['bgSwitch', isZh ? '背景交替频率' : '背景の切替']
  ];
}
function renderFx() {
  const box = $('fxSliders'); box.innerHTML = '';
  getFxList().forEach(([k, label]) => {
    const row = document.createElement('div'); row.className = 'slider';
    const v = S.project.fx[k] ?? 0.5;
    row.innerHTML = `<label for="fx_${k}">${label}</label><input id="fx_${k}" type="range" min="0" max="1" step="0.01" value="${v}"><output>${Math.round(v * 100)}</output>`;
    const inp = row.querySelector('input'), out = row.querySelector('output');
    inp.addEventListener('input', () => { S.project.fx[k] = +inp.value; S.project.mood = null; out.textContent = Math.round(inp.value * 100); replanSoon(120); });
    box.appendChild(row);
  });
  $('fxFlash').checked = !!S.project.fx.flash;
  $('fxKoma').value = String(J.komaOf(S.project.fx));
  $('fxHud').value = S.project.fx.hud || 'auto';
  $('seed').value = S.project.seed;
}

/* ---------------- technique tab ---------------- */
const GROUPS_DEF = [
  ['layout', '排版构图', 'レイアウト'],
  ['enter', '登场动效', '登場'],
  ['hold', '驻留状态', '保持'],
  ['exit', '退场动效', '退場'],
  ['decor', '装饰元素', '装飾'],
  ['treat', '文字质感', '文字の加工'],
  ['bg', '背景图形', '背景'],
  ['cam', '动态运镜', 'カメラ'],
  ['fx', '画面特效', '画面効果']
];
const openGroups = new Set();
function techItems(g) { return J.order(g).filter(k => J.registry(g)[k] && !J.registry(g)[k].special); }
function renderTech() {
  const box = $('techLists'); box.innerHTML = '';
  const q = ($('techFilter').value || '').trim().toLowerCase();
  const isZh = J.getLang && J.getLang() === 'zh';
  let total = 0, onAll = 0;
  GROUPS_DEF.forEach(([g, zhLabel, jaLabel]) => {
    const label = isZh ? zhLabel : jaLabel;
    const tbl = J.registry(g), items = techItems(g), en = S.project.enabled[g] || (S.project.enabled[g] = {});
    const shown = q ? items.filter(k => (J.techName(g, k) + ' ' + tbl[k].name + ' ' + k).toLowerCase().includes(q)) : items;
    const onN = items.filter(k => en[k] !== false).length;
    total += items.length; onAll += onN;
    if (q && !shown.length) return;
    const d = document.createElement('details'); d.className = 'tgroup';
    d.open = !!q || openGroups.has(g);
    d.addEventListener('toggle', () => { if (d.open) openGroups.add(g); else openGroups.delete(g); });
    d.innerHTML = `<summary><span class="tg-name">${label}</span><span class="tg-cnt mono">${onN}/${items.length}</span></summary><div class="tg-tools"><button class="ghost small" data-a="on">${J.t('btn_all_on', 'すべてON')}</button><button class="ghost small" data-a="off">${J.t('btn_all_off', 'すべてOFF')}</button><button class="ghost small" data-a="flip">${J.t('btn_invert', '反転')}</button></div>`;
    const list = document.createElement('div'); list.className = 'checks';
    shown.forEach(k => {
      const l = document.createElement('label');
      l.title = k + (tbl[k].tags && tbl[k].tags.length ? '（' + tbl[k].tags.map(t => (J.MOODS[t] ? (isZh ? J.MOODS[t].name_zh || J.MOODS[t].name : J.MOODS[t].name) : t)).join('・') + '）' : '');
      l.innerHTML = `<input type="checkbox" ${en[k] !== false ? 'checked' : ''}> ${escapeHtml(J.techName(g, k))}`;
      l.querySelector('input').addEventListener('change', e => { en[k] = e.target.checked; S.project.mood = null; d.querySelector('.tg-cnt').textContent = `${items.filter(x => en[x] !== false).length}/${items.length}`; replanSoon(60); });
      list.appendChild(l);
    });
    d.querySelectorAll('.tg-tools button').forEach(b => b.addEventListener('click', () => {
      const a = b.dataset.a;
      shown.forEach(k => { en[k] = a === 'on' ? true : a === 'off' ? false : en[k] === false; });
      // keep a fallback so the planner always has something to use
      if (g === 'layout' && !items.some(k => en[k] !== false)) en.center = true;
      if (g === 'enter') en.cut = true; if (g === 'exit') en.cut = true; if (g === 'hold') en.still = true;
      if (g === 'treat') en.none = true; if (g === 'bg') en.none = true; if (g === 'cam') en.push = true;
      S.project.mood = null; openGroups.add(g); renderTech(); replan();
    }));
    d.appendChild(list);
    box.appendChild(d);
  });
  $('techTotal').textContent = `${onAll}/${total}`;
}

/* ---------------- output tab ---------------- */
function syncOut() {
  $('outAspect').value = S.project.aspect; $('outRes').value = String(S.project.res); $('outFps').value = String(S.project.fps);
  $('eAspect').value = S.project.aspect; $('eRes').value = String(S.project.res); $('eFps').value = String(S.project.fps);
  $('outQuality').value = S.project.quality || 'high'; $('outAudio').checked = S.project.includeAudio !== false;
}
async function codecNote() {
  const [w, h] = J.outputSize(S.project);
  const vc = await J.pickVideoCodec(w, h, S.project.fps, 12e6);
  const isZh = J.getLang && J.getLang() === 'zh';
  $('codecNote').textContent = vc
    ? (isZh ? `当前浏览器将采用 ${vc.label} 硬件加速导出（${w}×${h} / ${S.project.fps}fps）。导出期间请保持此标签页处于激活状态。` : `このブラウザでは ${vc.label} で書き出します（${w}×${h} / ${S.project.fps}fps）。書き出し中はタブを開いたままにしてください。`)
    : (isZh ? '当前浏览器不支持硬件视频编码（WebCodecs）。请使用最新版 Chrome 或 Edge，或导出序列帧 PNG。' : 'このブラウザは動画エンコード（WebCodecs）に対応していません。Chrome / Edge の最新版で開くか、連番PNGを使ってください。');
  $('btnMP4').disabled = !vc; $('eMP4').disabled = !vc;
  if (!vc) $('eMP4').title = isZh ? '当前浏览器不支持 MP4 导出（推荐 Chrome / Edge）' : 'このブラウザは MP4 書き出しに対応していません（Chrome / Edge 推奨）';
}
const EXP_BTNS = ['btnMP4', 'btnPNG', 'btnPNGA', 'eMP4'];
function baseName() { return ((S.project.title || 'jizura').replace(/[\\/:*?"<>|]+/g, '_').slice(0, 60) || 'jizura'); }
async function runExport(kind) {
  if (S.exporting) return;
  pause();
  const isZh = J.getLang && J.getLang() === 'zh';
  const ac = new AbortController(); S.exporting = ac;
  const boxes = [...document.querySelectorAll('.exp-box')];
  const setText = m => boxes.forEach(b => { b.querySelector('.exp-text').textContent = m; });
  const txt = { set textContent(m) { setText(m); }, get textContent() { return boxes[0].querySelector('.exp-text').textContent; } };
  boxes.forEach(b => { b.hidden = false; b.querySelector('.exp-bar').style.width = '0%'; });
  setText(isZh ? '正在准备渲染…' : '準備中…');
  EXP_BTNS.forEach(id => { $(id).disabled = true; });
  const onProgress = (p, m) => { boxes.forEach(b => { b.querySelector('.exp-bar').style.width = (p * 100).toFixed(1) + '%'; }); setText(m); };
  const t0 = performance.now();
  try {
    await J.ensureFonts(S.project.lyrics + (S.project.title || '') + (S.project.artist || '') + HUD_CHARS, null);
    if (kind === 'mp4') {
      const r = await J.exportMP4({ plan: S.plan, project: S.project, audio: S.project.includeAudio !== false ? S.audio : null, quality: S.project.quality || 'high', onProgress, signal: ac.signal });
      txt.textContent = `${isZh ? '完成' : '完了'} ${(r.blob.size / 1048576).toFixed(1)}MB · ${r.codec}${r.audio ? ' + ' + r.audio.toUpperCase() : ''} · ${((performance.now() - t0) / 1000).toFixed(0)} ${isZh ? '秒' : '秒'}`;
      const res = await J.saveFile(baseName() + '.mp4', r.blob);
      if (res === 'declined') txt.textContent += isZh ? '（已取消保存）' : '（保存はキャンセルされました）';
    } else {
      const blob = await J.exportPNGZip({ plan: S.plan, project: S.project, transparent: kind === 'pnga', onProgress, signal: ac.signal });
      txt.textContent = `${isZh ? '完成' : '完了'} ${(blob.size / 1048576).toFixed(1)}MB`;
      await J.saveFile(baseName() + (kind === 'pnga' ? '_alpha' : '') + '_png.zip', blob);
    }
  } catch (e) {
    txt.textContent = (isZh ? '错误: ' : 'エラー: ') + (e && e.message ? e.message : e);
    console.error(e);
  } finally {
    S.exporting = null; S.need = true;
    EXP_BTNS.forEach(id => { $(id).disabled = false; });
    codecNote();
  }
}

/* ---------------- tap sync & time stamps ---------------- */
let countInTimer = null;
function runCountIn(onReady) {
  clearTimeout(countInTimer);
  const tapBtn = $('tapBtn');
  if (!tapBtn) { onReady(); return; }
  if (S.tap) S.tap.counting = true;
  const isZh = J.getLang && J.getLang() === 'zh';
  const steps = [
    { text: isZh ? '预备 3...' : 'カウント 3...', pitch: 440 },
    { text: isZh ? '预备 2...' : 'カウント 2...', pitch: 440 },
    { text: isZh ? '预备 1...' : 'カウント 1...', pitch: 440 },
    { text: isZh ? 'GO! (按空格打点)' : 'GO! (スペースで記録)', pitch: 880 }
  ];
  let step = 0;
  function nextStep() {
    if (!S.tap) return;
    if (step < steps.length) {
      const s = steps[step];
      tapBtn.textContent = s.text;
      tapBtn.classList.remove('pulse');
      void tapBtn.offsetWidth;
      tapBtn.classList.add('pulse');
      J.playTick(s.pitch, step === 3 ? 0.15 : 0.08, step === 3 ? 0.35 : 0.25);
      step++;
      countInTimer = setTimeout(nextStep, 680);
    } else {
      if (S.tap) {
        S.tap.counting = false;
        tapBtn.textContent = isZh ? 'TAP 敲击打点 (空格)' : 'TAP 打点 (Space)';
        onReady();
      }
    }
  }
  nextStep();
}

function isPlaceholderLyrics(text) {
  if (!text || !text.trim()) return true;
  const t = text.trim();
  return t.includes('在这里输入第一句歌词') || t.includes('ここに最初の歌詞を入力');
}

let currentBatchCues = [];

function startTap(startIndex = 0, tapMode = 'lyrics') {
  const isZh = J.getLang && J.getLang() === 'zh';
  
  // Ensure AudioContext is resumed synchronously on user interaction
  if (AP.ctx && AP.ctx.state === 'suspended') {
    try { AP.ctx.resume(); } catch (e) {}
  }
  if (J._tickCtx && J._tickCtx.state === 'suspended') {
    try { J._tickCtx.resume(); } catch (e) {}
  }
  pause();

  const isBlank = (tapMode === 'blank' || tapMode === 'freestyle' || tapMode === true);
  const n = (S.plan && S.plan.lines) ? S.plan.lines.length : 0;

  if (!isBlank && n === 0) {
    toast(isZh ? '⚠️ 当前歌词为空，请先在左侧输入歌词，或使用【⚡ 空白节拍打点】！' : '⚠️ 歌詞がありません。歌詞を入力するか【⚡ 空白ビート打点】を使用してください');
    return;
  }

  if (!S.project.timing.lineTimes) S.project.timing.lineTimes = {};
  if (!S.project.timing.lineEnds) S.project.timing.lineEnds = {};

  const idx = isBlank ? 0 : Math.max(0, Math.min(startIndex, n - 1));
  setTargetLineIdx(idx, false);

  S.tap = {
    mode: isBlank ? 'blank' : 'lyrics',
    freestyle: isBlank,
    i: idx,
    history: [],
    counting: false,
    cues: [],
    createdCount: 0
  };

  $('tapPanel').hidden = false;
  $('btnTap').setAttribute('aria-pressed', !isBlank ? 'true' : 'false');
  if ($('btnTapFreestyle')) $('btnTapFreestyle').setAttribute('aria-pressed', isBlank ? 'true' : 'false');
  const modeLbl = $('tapModeLabel');
  if (modeLbl) {
    modeLbl.textContent = isBlank ? (isZh ? '⚡ 空白节拍打点' : '⚡ 空白ビート打点') : (isZh ? '🎤 歌词逐句打点' : '🎤 歌詞ステップ打点');
  }

  const bufSelect = $('tapBuffer');
  const bufferSec = bufSelect ? (parseFloat(bufSelect.value) || 2.0) : 2.0;

  let targetT = 0;
  if (!isBlank && idx > 0 && n > 0) {
    const curStart = (S.project.timing.lineTimes[idx] != null) ? S.project.timing.lineTimes[idx] : S.plan.lines[idx].start;
    targetT = Math.max(0, curStart - bufferSec);
  } else if (isBlank && S.t > 0) {
    targetT = S.t;
  }
  seek(targetT);
  updateTap();

  const countInCheck = $('tapCountIn');
  const doCountIn = countInCheck ? countInCheck.checked : false;

  const onReady = () => {
    seek(targetT);
    play();
    updateTap();
    $('tapBtn').focus();
    if (isBlank) {
      toast(isZh ?
        '⚡ 空白打点模式：随音乐重拍按【空格】记录节拍点，【Backspace】撤回，【ESC】完成打点去批量填词！' :
        '⚡ 空白ビート打点：曲に合わせて [Space] でビートを刻み、[Backspace] でやり直し、[ESC] で完了！');
    } else {
      toast(isZh ?
        '🎤 歌词逐句打点：跟随歌曲按【空格】标记当前句开始，打完自动跳下一句，【Backspace】撤回倒带！' :
        '🎤 歌詞ステップ同期：曲に合わせて [Space] で各行の頭を記録、次行へ自動進行！');
    }
  };

  if (doCountIn) {
    runCountIn(onReady);
  } else {
    onReady();
  }
}

let lastTapTime = 0;
function tapNow() {
  if (!S.tap) return;
  const now = performance.now();
  if (now - lastTapTime < 80) return; // debounce Space keydown + button click
  lastTapTime = now;

  // If user tapped during count-in, immediately finish countdown and start playback
  if (S.tap.counting) {
    clearTimeout(countInTimer);
    S.tap.counting = false;
    const isZh = J.getLang && J.getLang() === 'zh';
    const tapBtn = $('tapBtn');
    if (tapBtn) tapBtn.textContent = isZh ? 'TAP 敲击打点 (空格)' : 'TAP 打点 (Space)';
    if (!S.playing) play();
  } else if (!S.playing) {
    play();
  }

  const curT = +S.t.toFixed(3);
  J.playTick(620, 0.05, 0.25);
  const isZh = J.getLang && J.getLang() === 'zh';
  const isBlank = S.tap.mode === 'blank' || S.tap.freestyle;

  if (isBlank) {
    if (!S.tap.cues) S.tap.cues = [];
    S.tap.cues.push(curT);
    S.blankCues = S.tap.cues.slice();
    S.tap.createdCount = S.tap.cues.length;
    S.tap.history.push({
      mode: 'blank',
      time: curT,
      index: S.tap.cues.length - 1
    });
    updateTap();
  } else {
    const idx = S.tap.i;
    const n = (S.plan && S.plan.lines) ? S.plan.lines.length : 0;
    if (idx < n) {
      const prevStart = S.project.timing.lineTimes[idx];
      const prevEnd = S.project.timing.lineEnds ? S.project.timing.lineEnds[idx] : undefined;
      S.tap.history.push({
        mode: 'lyrics',
        i: idx,
        stampedTime: curT,
        prevStart,
        prevEnd
      });
      S.project.timing.lineTimes[idx] = curT;
      S.tap.i++;
      setTargetLineIdx(S.tap.i < n ? S.tap.i : n - 1, false);

      if (S.tap.i >= n) {
        replan();
        updateTap();
        stopTap();
        toast(isZh ? '🎉 所有歌词打点同步完成！已自动对齐各句时间' : '🎉 全行のタイミング合わせ完了！');
        return;
      }
      replan();
      updateTap();
      if (S.lineEls && S.lineEls[S.tap.i]) {
        S.lineEls[S.tap.i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }
}

function tapUndo() {
  if (!S.tap) return;
  clearTimeout(countInTimer);
  const isZh = J.getLang && J.getLang() === 'zh';
  const bufSelect = $('tapBuffer');
  const bufferSec = bufSelect ? (parseFloat(bufSelect.value) || 2.0) : 2.0;

  if (S.tap.history.length > 0) {
    const h = S.tap.history.pop();
    if (h.mode === 'blank') {
      if (S.tap.cues && S.tap.cues.length) S.tap.cues.pop();
      S.blankCues = S.tap.cues ? S.tap.cues.slice() : [];
      S.tap.createdCount = S.blankCues.length;
      const rewindT = Math.max(0, +(h.time - bufferSec).toFixed(3));
      seek(rewindT);
      if (!S.playing) play();
      J.playTick(350, 0.08, 0.35);
      updateTap();
      toast(isZh ? `已撤销第 ${h.index + 1} 个打点，倒带 ${bufferSec.toFixed(1)}s 重跑` : `打点をやり直します (${bufferSec.toFixed(1)}秒前)`);
    } else {
      S.tap.i = h.i;
      setTargetLineIdx(h.i, false);
      if (h.prevStart !== undefined) S.project.timing.lineTimes[h.i] = h.prevStart;
      else delete S.project.timing.lineTimes[h.i];
      if (h.prevEnd !== undefined) S.project.timing.lineEnds[h.i] = h.prevEnd;
      else if (S.project.timing.lineEnds) delete S.project.timing.lineEnds[h.i];

      const targetCueT = (h.stampedTime != null) ? h.stampedTime : S.t;
      const rewindT = Math.max(0, +(targetCueT - bufferSec).toFixed(3));
      seek(rewindT);
      if (!S.playing) play();
      J.playTick(350, 0.08, 0.35);
      replan();
      updateTap();
      if (S.lineEls && S.lineEls[S.tap.i]) S.lineEls[S.tap.i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      toast(isZh ? `已撤回第 ${h.i + 1} 句，音频回退 ${bufferSec.toFixed(1)}s 重新开跑！` : `第 ${h.i + 1} 行をやり直します (${bufferSec.toFixed(1)}秒前)`);
    }
  } else {
    seek(0);
    if (!S.playing) play();
    J.playTick(350, 0.08, 0.35);
    updateTap();
    toast(isZh ? '已在起始位置，从头重新开跑！' : '先頭から再開します！');
  }
}

function stopTap() {
  clearTimeout(countInTimer);
  const isZh = J.getLang && J.getLang() === 'zh';
  const wasBlank = S.tap && (S.tap.mode === 'blank' || S.tap.freestyle);
  const cueCount = S.tap ? ((S.tap.cues && S.tap.cues.length) || S.tap.createdCount || 0) : 0;
  const blankCues = S.tap && S.tap.cues ? S.tap.cues.slice() : (S.blankCues || []);

  S.tap = null;
  $('tapPanel').hidden = true;
  $('btnTap').setAttribute('aria-pressed', 'false');
  if ($('btnTapFreestyle')) $('btnTapFreestyle').setAttribute('aria-pressed', 'false');
  const tapBtn = $('tapBtn');
  if (tapBtn) tapBtn.textContent = isZh ? 'TAP 敲击打点 (空格)' : 'TAP 打点 (Space)';
  if (S.tapRate !== 1.0) setTapRate(1.0);
  replan();

  if (wasBlank && cueCount > 0) {
    S.blankCues = blankCues;
    openBatchLyricsDialog(blankCues);
    toast(isZh ? `⚡ 空白打点完成！共切分 ${cueCount} 个节拍点，可在此直接批量填入歌词！` : `⚡ 打点完了！${cueCount} 個のビートを記録。歌詞を一括流し込みできます`);
  }
}

function updateTap() {
  if (!S.tap) return;
  const isZh = J.getLang && J.getLang() === 'zh';
  const isBlank = S.tap.mode === 'blank' || S.tap.freestyle;

  const numEl = $('tapLineNum');
  const curEl = $('tapLine');
  const nextEl = $('tapNextLine');

  if (isBlank) {
    const count = (S.tap.cues ? S.tap.cues.length : 0);
    if (numEl) numEl.textContent = String(count + 1).padStart(2, '0');
    if (curEl) {
      curEl.textContent = isZh ?
        `⚡ 空白打点中：已记录 ${count} 个节拍点（按空格记录下一拍）` :
        `⚡ 空白打点中: ${count} 個のビートを記録中 (Spaceで次を記録)`;
    }
    if (nextEl) {
      const bufVal = $('tapBuffer') ? $('tapBuffer').value : '2.0';
      nextEl.textContent = isZh ?
        `[空格] 记录节拍点 | [退格] 撤销倒带${bufVal}s | [ESC] 完成去批量填词` :
        `[Space] 記録 | [BS] やり直し (${bufVal}s) | [ESC] 完了して歌詞流し込み`;
    }
  } else {
    const n = (S.plan && S.plan.lines) ? S.plan.lines.length : 0;
    const i = S.tap.i;
    const curLn = i < n ? S.plan.lines[i] : null;
    const nextLn = i + 1 < n ? S.plan.lines[i + 1] : null;

    if (numEl) numEl.textContent = `${String(i + 1).padStart(2, '0')}/${String(n).padStart(2, '0')}`;
    if (curEl) {
      curEl.textContent = curLn ? `【第 ${i + 1} 句】${curLn.text}` : (isZh ? '所有歌词已打点完成！' : '全行同期完了！');
    }
    if (nextEl) {
      nextEl.textContent = nextLn ? `${isZh ? '下句预告' : '次'}: ${nextLn.text}` : (isZh ? '（已是最后一句）' : '（最後の行）');
    }
  }

  if (S.lineEls) {
    S.lineEls.forEach((el, idx) => el.classList.toggle('cur-tap', idx === (S.tap ? S.tap.i : -1)));
  }
}

function setTapRate(r) {
  S.tapRate = r;
  document.querySelectorAll('.tap-spd').forEach(b => {
    b.classList.toggle('active', Math.abs(parseFloat(b.dataset.spd) - r) < 0.01);
  });
  if (S.playing) {
    const cur = S.t;
    if (S.audio) AP.play(S.audio.buffer, cur, r);
    else S.t0 = performance.now() - (cur * 1000) / r;
  }
}

function stampCurrentLine(type) {
  const n = (S.plan && S.plan.lines) ? S.plan.lines.length : 0;
  if (n === 0) return;
  const idx = Math.max(0, Math.min(targetLineIdx, n - 1));
  const ln = S.plan.lines[idx];
  const curT = +S.t.toFixed(2);
  const isZh = J.getLang && J.getLang() === 'zh';
  const previewTxt = ln ? (ln.text.slice(0, 12) + (ln.text.length > 12 ? '…' : '')) : '';

  if (!S.project.timing.lineTimes) S.project.timing.lineTimes = {};
  if (!S.project.timing.lineEnds) S.project.timing.lineEnds = {};

  if (type === 'start') {
    S.project.timing.lineTimes[idx] = curT;
    if (S.project.timing.lineEnds[idx] != null && S.project.timing.lineEnds[idx] <= curT) {
      delete S.project.timing.lineEnds[idx];
    }
    pushTimingState(isZh ? `第 ${idx + 1} 句设起点 ${curT}s` : `第 ${idx + 1} 行開始点 ${curT}s`);
    toast(isZh ? `🎯 已将第 ${idx + 1} 句 "${previewTxt}" 起点设为 ${curT}s (S)` : `🎯 第 ${idx + 1} 行 "${previewTxt}" 開始点を ${curT}s に設定 (S)`);
    if (autoStepEnabled && idx < n - 1) {
      setTargetLineIdx(idx + 1, false);
    }
  } else {
    const curStart = (S.project.timing.lineTimes[idx] != null) ? S.project.timing.lineTimes[idx] : ln.start;
    const endT = Math.max(curStart + 0.1, curT);
    S.project.timing.lineEnds[idx] = endT;
    pushTimingState(isZh ? `第 ${idx + 1} 句设终点 ${endT}s` : `第 ${idx + 1} 行終了点 ${endT}s`);
    toast(isZh ? `🏁 已将第 ${idx + 1} 句 "${previewTxt}" 终点设为 ${endT}s (E)` : `🏁 第 ${idx + 1} 行 "${previewTxt}" 終了点を ${endT}s に設定 (E)`);
  }
  replan();
  updateActiveLineHeader();
  drawTimeline();
}

/* ---------------- batch lyrics match & sync LRC ---------------- */
function openBatchLyricsDialog(cues = null) {
  const dlg = $('batchLyricsDialog');
  if (!dlg) return;
  const isZh = J.getLang && J.getLang() === 'zh';

  if (Array.isArray(cues) && cues.length > 0) {
    currentBatchCues = cues.slice();
  } else if (S.blankCues && S.blankCues.length > 0) {
    currentBatchCues = S.blankCues.slice();
  } else if (S.plan && S.plan.lines && S.plan.lines.length > 0) {
    currentBatchCues = S.plan.lines.map(ln => ln.start);
  } else {
    currentBatchCues = [];
  }

  const inp = $('batchLyricsInput');
  if (inp) {
    const clean = J.extractCleanLyrics ? J.extractCleanLyrics(S.project.lyrics) : [];
    if (clean.length > 0 && !clean.some(s => s.startsWith('镜头 ') || s.startsWith('カット ') || s.startsWith('♪ '))) {
      inp.value = clean.join('\n');
    } else {
      inp.value = '';
    }
  }

  updateBatchPreview();
  if (typeof dlg.showModal === 'function') {
    try { dlg.showModal(); } catch (e) { dlg.style.display = 'flex'; }
  } else {
    dlg.style.display = 'flex';
  }
  if (inp) inp.focus();
}

function closeBatchLyricsDialog() {
  const dlg = $('batchLyricsDialog');
  if (!dlg) return;
  if (typeof dlg.close === 'function') {
    try { dlg.close(); } catch (e) { dlg.style.display = 'none'; }
  } else {
    dlg.style.display = 'none';
  }
}

function updateBatchPreview() {
  const inp = $('batchLyricsInput');
  const listEl = $('batchLyricsPreviewList');
  const statEl = $('batchMatchStat');
  if (!inp || !listEl) return;

  const isZh = J.getLang && J.getLang() === 'zh';
  const val = inp.value;
  const res = J.batchMatchLyrics ? J.batchMatchLyrics(currentBatchCues, val, isZh) : { text: '', matchedCount: 0, totalCues: 0, totalLyrics: 0, pairs: [] };

  if (statEl) {
    const pct = res.totalCues > 0 ? Math.round((res.matchedCount / res.totalCues) * 100) : (res.totalLyrics > 0 ? 100 : 0);
    statEl.textContent = isZh ?
      `打点: ${res.totalCues} | 歌词: ${res.totalLyrics} 句 | 匹配度: ${pct}%` :
      `打点: ${res.totalCues} | 歌詞: ${res.totalLyrics} 行 | 一致率: ${pct}%`;
  }

  if (!res.pairs.length) {
    listEl.innerHTML = `<div style="padding:20px;text-align:center;color:var(--muted);">${isZh ? '在此直接粘贴歌词文本…' : '歌詞を貼り付けてください…'}</div>`;
    return;
  }

  listEl.innerHTML = res.pairs.map(p => {
    const timeTag = J.fmtLrc(p.time);
    const cls = p.isPlaceholder ? 'batch-preview-row placeholder' : 'batch-preview-row';
    const num = String(p.index + 1).padStart(2, '0');
    return `<div class="${cls}">
      <span style="color:var(--cyan);font-weight:700;">${num}</span>
      <span style="color:var(--amber);">${timeTag}</span>
      <span style="color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">${escapeHtml(p.text)}</span>
    </div>`;
  }).join('');
}

function applyBatchLyrics() {
  const inp = $('batchLyricsInput');
  if (!inp) return;
  const isZh = J.getLang && J.getLang() === 'zh';
  const res = J.batchMatchLyrics ? J.batchMatchLyrics(currentBatchCues, inp.value, isZh) : null;

  if (!res || !res.pairs.length) {
    toast(isZh ? '请先输入或粘贴歌词文本' : '歌詞を入力してください');
    return;
  }

  pushTimingState(isZh ? `批量匹配填入 ${res.matchedCount} 句歌词` : `歌詞一括流し込み ${res.matchedCount} 行`);
  S.project.lyrics = res.text;
  if ($('lyrics')) $('lyrics').value = res.text;
  S.project.timing.lineTimes = {};
  S.project.timing.lineEnds = {};
  S.blankCues = [];

  replan();
  closeBatchLyricsDialog();
  toast(isZh ? `✨ 批量配词成功！已对齐 ${res.matchedCount} 句歌词` : `✨ 歌詞一括流し込み成功！${res.matchedCount} 行を割り当てました`);
}

function syncLrcToLyricsTextarea() {
  const isZh = J.getLang && J.getLang() === 'zh';
  if (!S.plan || !S.plan.lines || !S.plan.lines.length) return;
  const lrcText = J.syncPlanToLrc ? J.syncPlanToLrc(S.plan, S.project) : S.project.lyrics;
  S.project.lyrics = lrcText;
  if ($('lyrics')) $('lyrics').value = lrcText;
  toast(isZh ? '✨ 精准时间戳已同步写回歌词文本框！' : '✨ 歌詞テキストへLRC同期完了！');
}

function nudgeCurrentLine(delta) {
  nudgeLine(getActiveLineIdx(), delta);
}

function initTimingTools() {
  const byId = id => document.getElementById(id);
  const n05m = byId('nudgeM05'), n01m = byId('nudgeM01'), n01p = byId('nudgeP01'), n05p = byId('nudgeP05');
  if (n05m) n05m.onclick = () => nudgeLine(getActiveLineIdx(), -0.5);
  if (n01m) n01m.onclick = () => nudgeLine(getActiveLineIdx(), -0.1);
  if (n01p) n01p.onclick = () => nudgeLine(getActiveLineIdx(), 0.1);
  if (n05p) n05p.onclick = () => nudgeLine(getActiveLineIdx(), 0.5);

  const r10m = byId('rippleM10'), r05m = byId('rippleM05'), r01m = byId('rippleM01');
  const r01p = byId('rippleP01'), r05p = byId('rippleP05'), r10p = byId('rippleP10');
  const rCust = byId('rippleCustom');

  if (r10m) r10m.onclick = () => rippleShiftFrom(getActiveLineIdx(), -1.0);
  if (r05m) r05m.onclick = () => rippleShiftFrom(getActiveLineIdx(), -0.5);
  if (r01m) r01m.onclick = () => rippleShiftFrom(getActiveLineIdx(), -0.1);
  if (r01p) r01p.onclick = () => rippleShiftFrom(getActiveLineIdx(), 0.1);
  if (r05p) r05p.onclick = () => rippleShiftFrom(getActiveLineIdx(), 0.5);
  if (r10p) r10p.onclick = () => rippleShiftFrom(getActiveLineIdx(), 1.0);

  if (rCust) {
    rCust.onclick = () => {
      const idx = getActiveLineIdx();
      const isZh = J.getLang && J.getLang() === 'zh';
      const promptTxt = isZh ?
        `请输入从第 ${idx + 1} 句起向后所有镜头的整体平移秒数 (例如: +1.5 或 -2.04):` :
        `${idx + 1}行目以降の全カットをシフトする秒数を入力してください (例: +1.5, -2.0):`;
      const valStr = prompt(promptTxt, '+0.5');
      if (valStr) {
        const val = parseFloat(valStr.replace('+', ''));
        if (isFinite(val) && val !== 0) {
          rippleShiftFrom(idx, val);
        }
      }
    };
  }

  // Target line HUD controls
  const bPrev = byId('btnTargetPrev');
  const bNext = byId('btnTargetNext');
  const bSeek = byId('btnTargetSeek');
  const bPanelS = byId('btnPanelStampS');
  const bPanelE = byId('btnPanelStampE');
  const chkStep = byId('chkAutoStep');
  const bSync = byId('btnSyncLrc');
  const bBatchOpen = byId('btnBatchLyricsOpen');
  const bBatchModal = byId('btnBatchLyricsModal');
  const bBatchCancel = byId('btnCancelBatchLyrics');
  const bBatchCancelTop = byId('btnCancelBatchLyricsTop');
  const bBatchConfirm = byId('btnConfirmBatchLyrics');
  const bBatchPlaceholders = byId('btnBatchFillPlaceholders');
  const bTrBadge = byId('transportTargetBadge');
  const batchInput = byId('batchLyricsInput');

  if (bPrev) bPrev.onclick = () => setTargetLineIdx(targetLineIdx - 1, true);
  if (bNext) bNext.onclick = () => setTargetLineIdx(targetLineIdx + 1, true);
  if (bSeek) bSeek.onclick = () => setTargetLineIdx(targetLineIdx, true);
  if (bPanelS) bPanelS.onclick = () => stampCurrentLine('start');
  if (bPanelE) bPanelE.onclick = () => stampCurrentLine('end');
  if (chkStep) {
    chkStep.onchange = e => { autoStepEnabled = e.target.checked; };
    autoStepEnabled = chkStep.checked;
  }
  if (bSync) bSync.onclick = syncLrcToLyricsTextarea;
  if (bBatchOpen) bBatchOpen.onclick = () => openBatchLyricsDialog();
  if (bBatchModal) bBatchModal.onclick = () => openBatchLyricsDialog();
  if (bBatchCancel) bBatchCancel.onclick = closeBatchLyricsDialog;
  if (bBatchCancelTop) bBatchCancelTop.onclick = closeBatchLyricsDialog;
  if (bBatchConfirm) bBatchConfirm.onclick = applyBatchLyrics;
  if (bTrBadge) bTrBadge.onclick = () => setTargetLineIdx(targetLineIdx, true);
  if (batchInput) batchInput.oninput = updateBatchPreview;
  if (bBatchPlaceholders) {
    bBatchPlaceholders.onclick = () => {
      const isZh = J.getLang && J.getLang() === 'zh';
      const phrases = isZh ?
        ['♪ 前奏 INTRO', '♪ 主歌 VERSE A', '♪ 副歌 CHORUS', '♪ 变奏 BRIDGE', '♪ 高潮 DROP', '♪ 尾声 OUTRO'] :
        ['♪ INTRO', '♪ VERSE A', '♪ CHORUS', '♪ BRIDGE', '♪ DROP', '♪ OUTRO'];
      const cues = currentBatchCues && currentBatchCues.length ? currentBatchCues : (S.plan && S.plan.lines ? S.plan.lines.map(l => l.start) : [0, 3, 6, 9]);
      const n = Math.max(1, cues.length);
      const generated = [];
      for (let i = 0; i < n; i++) {
        const p = phrases[i % phrases.length];
        generated.push(`${p} ${String(i + 1).padStart(2, '0')}`);
      }
      batchInput.value = generated.join('\n');
      updateBatchPreview();
    };
  }
}

/* ---------------- sync all inputs from project ---------------- */
function syncUI() {
  $('songTitle').value = S.project.title || ''; $('songArtist').value = S.project.artist || '';
  $('lyrics').value = S.project.lyrics;
  $('bpm').value = S.project.timing.bpm > 0 ? S.project.timing.bpm : '';
  const isZh = J.getLang && J.getLang() === 'zh';
  $('bpm').placeholder = S.audio ? (isZh ? `自动 ${S.audio.bpm}` : `自動 ${S.audio.bpm}`) : (isZh ? '无' : 'なし');
  $('offset').value = S.project.timing.offset ?? 0.4;
  $('lineScale').value = S.project.timing.lineScale ?? 1;
  $('snap').checked = !!S.project.timing.snap;
  renderFontRoles(); renderColors(); renderFx(); renderTech(); syncOut(); drawStyleGrid();
}

/* ---------------- wiring ---------------- */
function bind() {
  $('lyrics').addEventListener('input', e => { S.project.lyrics = e.target.value; replanSoon(260); });
  if ($('btnSmartPhrases')) {
    $('btnSmartPhrases').addEventListener('click', () => {
      const isZh = J.getLang && J.getLang() === 'zh';
      const lyrics = $('lyrics').value;
      const bpm = (S.project.timing && S.project.timing.bpm) || (S.audio && S.audio.bpm) || 120;
      const res = J.generateSmartBeatPhrases(lyrics, S.audio, bpm);
      if (res) {
        $('lyrics').value = res;
        S.project.lyrics = res;
        replan();
        commit();
        toast(isZh ? '✨ 已按节拍自动生成分句时间模版并对齐' : '✨ ビートに合わせたフレーズを生成しました');
      }
    });
  }
  const chkMetro = $('chkMetro');
  const tapMetro = $('tapMetroInPanel');
  if (chkMetro && tapMetro) {
    chkMetro.addEventListener('change', () => {
      tapMetro.checked = chkMetro.checked;
      lastMetronomeBeat = -1;
    });
    tapMetro.addEventListener('change', () => {
      chkMetro.checked = tapMetro.checked;
      lastMetronomeBeat = -1;
    });
  }
  $('songTitle').addEventListener('input', e => { S.project.title = e.target.value; replanSoon(300); });
  $('songArtist').addEventListener('input', e => { S.project.artist = e.target.value; replanSoon(300); });
  $('btnSyntax').addEventListener('click', e => { const s = $('syntax'); s.hidden = !s.hidden; e.target.setAttribute('aria-expanded', String(!s.hidden)); });
  $('bpm').addEventListener('change', e => { S.project.timing.bpm = Math.max(0, parseFloat(e.target.value) || 0); replan(); });
  $('offset').addEventListener('change', e => { S.project.timing.offset = Math.max(0, parseFloat(e.target.value) || 0); replan(); });
  $('lineScale').addEventListener('change', e => { S.project.timing.lineScale = J.clamp(parseFloat(e.target.value) || 1, 0.3, 4); replan(); });
  $('snap').addEventListener('change', e => { S.project.timing.snap = e.target.checked; replan(); });
  $('btnResetTimes').addEventListener('click', () => { S.project.timing.lineTimes = {}; replan(); });
  $('audioFile').addEventListener('change', async e => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    handleAudioRelink(f, false);
  });
  window.addEventListener('dragover', e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
  });
  window.addEventListener('drop', async e => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer && e.dataTransfer.files;
    if (!files || !files.length) return;
    const f = files[0];
    const name = f.name.toLowerCase();
    const isZh = J.getLang && J.getLang() === 'zh';
    if (name.endsWith('.json')) {
      try {
        const text = await f.text();
        const p = JSON.parse(text);
        if (p && (p.lyrics !== undefined || p.lines || p.timing)) {
          await importProjectFile(p);
        }
      } catch (err) {
        toast((isZh ? '无法解析工程 JSON: ' : 'JSON解析失敗: ') + err.message);
      }
    } else if (/\.(mp3|wav|m4a|aac|ogg|flac|mp4|mov|webm)$/i.test(name) || f.type.startsWith('audio/') || f.type.startsWith('video/')) {
      toast(isZh ? `正在提取并分析文件音频: ${f.name}...` : `音声データを解析中: ${f.name}...`);
      handleAudioRelink(f, false);
    }
  });
  $('btnTap').addEventListener('click', () => (S.tap ? stopTap() : startTap(targetLineIdx, 'lyrics')));
  if ($('btnTapFreestyle')) $('btnTapFreestyle').addEventListener('click', () => (S.tap ? stopTap() : startTap(0, 'blank')));
  $('tapBtn').addEventListener('click', tapNow);
  if ($('tapUndo')) $('tapUndo').addEventListener('click', tapUndo);
  $('tapStop').addEventListener('click', () => { pause(); stopTap(); });
  document.querySelectorAll('.tap-spd').forEach(b => b.addEventListener('click', () => setTapRate(parseFloat(b.dataset.spd))));
  $('btnPlay').addEventListener('click', () => (S.playing ? pause() : play()));
  if ($('btnStampS')) $('btnStampS').addEventListener('click', () => stampCurrentLine('start'));
  if ($('btnStampE')) $('btnStampE').addEventListener('click', () => stampCurrentLine('end'));
  if ($('btnShuffleCurrent')) {
    $('btnShuffleCurrent').addEventListener('click', () => {
      const activeLine = (S.curLine >= 0 && S.curLine < (S.plan ? S.plan.lines.length : 0)) ? S.curLine : targetLineIdx;
      shuffleCutLine(activeLine, undefined, undefined, J.cutAt(S.plan,S.t));
    });
  }
  if ($('btnShuffleAll')) {
    $('btnShuffleAll').addEventListener('click', () => shuffleAllCuts());
  }
  if ($('btnShuffle')) {
    $('btnShuffle').addEventListener('click', () => shuffleAllCuts());
  }

  // Popover Picker Controls
  $('cutInspectorPopover').addEventListener('click', e => e.stopPropagation());
  if ($('popoverNoneDecor')) $('popoverNoneDecor').onclick = () => applyInspectorTechnique('decor','noneDecor');
  if ($('popoverClose')) $('popoverClose').addEventListener('click', closeCutInspector);
  if ($('popoverAutoBtn')) $('popoverAutoBtn').addEventListener('click', () => {
    applyInspectorTechnique(currentInspectorDim, 'auto');
  });
  if ($('popoverSearch')) {
    $('popoverSearch').addEventListener('input', (e) => {
      currentInspectorSearch = e.target.value;
      if ($('popoverSearchClear')) $('popoverSearchClear').hidden = !currentInspectorSearch;
      renderPopoverGrid();
    });
  }
  if ($('popoverSearchClear')) {
    $('popoverSearchClear').addEventListener('click', () => {
      currentInspectorSearch = '';
      if ($('popoverSearch')) $('popoverSearch').value = '';
      $('popoverSearchClear').hidden = true;
      renderPopoverGrid();
      if ($('popoverSearch')) $('popoverSearch').focus();
    });
  }
  document.addEventListener('click', (e) => {
    const pop = $('cutInspectorPopover');
    if (pop && !pop.hidden) {
      if (!pop.contains(e.target) && !e.target.closest('#cutInfo') && !e.target.closest('.cuts') && !e.target.closest('.cut-inspect-btn')) {
        closeCutInspector();
      }
    }
  });
  const sc = $('scrub');
  sc.addEventListener('input', () => { S.scrubbing = true; seek(sc.value / 10000 * S.plan.duration); });
  sc.addEventListener('change', () => { S.scrubbing = false; });
  const tl = $('timeline');
  let drag = false;
  tl.addEventListener('pointerdown', e => { drag = true; tl.setPointerCapture(e.pointerId); timelineSeek(e, true); });
  tl.addEventListener('pointermove', e => { if (drag) timelineSeek(e, false); });
  tl.addEventListener('pointerup', () => { drag = false; });
  tl.addEventListener('wheel', e => {
    e.preventDefault();
    const { totalD, viewDur, viewStart } = getTimelineView();
    if (e.ctrlKey || e.metaKey) {
      const r = tl.getBoundingClientRect();
      const mouseRatio = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      const mouseT = viewStart + mouseRatio * viewDur;
      const factor = e.deltaY < 0 ? 1.25 : 0.8;
      setTimelineZoom(tlZoom * factor, mouseT, mouseRatio);
    } else {
      const panDelta = (e.deltaX !== 0 ? e.deltaX : e.deltaY) * (viewDur / 1200);
      tlViewStart = Math.max(0, Math.min(totalD - viewDur, tlViewStart + panDelta));
      drawTimeline();
    }
  }, { passive: false });

  // Volume & Mute
  if ($('volumeSlider')) {
    $('volumeSlider').addEventListener('input', e => {
      const v = parseFloat(e.target.value) / 100;
      AP.setVolume(v);
    });
  }
  if ($('btnMute')) {
    $('btnMute').addEventListener('click', () => {
      AP.setMute(!AP.muted);
      $('btnMute').textContent = AP.muted ? '🔇' : '🔊';
      $('btnMute').title = AP.muted ? '解除静音 (M)' : '静音切换 (M)';
      const isZh = J.getLang && J.getLang() === 'zh';
      toast(AP.muted ? (isZh ? '🔇 已静音' : 'ミュート') : (isZh ? '🔊 已恢复音量' : 'ミュート解除'));
    });
  }

  // Timeline zoom & navigation buttons
  document.querySelectorAll('.tl-zoom-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const z = parseFloat(btn.dataset.zoom) || 1;
      setTimelineZoom(z);
    });
  });
  if ($('btnFocusCut')) $('btnFocusCut').addEventListener('click', () => focusCutOnTimeline());
  if ($('btnUndoTiming')) $('btnUndoTiming').addEventListener('click', undoTiming);
  if ($('btnRedoTiming')) $('btnRedoTiming').addEventListener('click', redoTiming);
  document.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.tabs button').forEach(x => x.setAttribute('aria-selected', String(x === b)));
    document.querySelectorAll('.tabpane').forEach(p => { p.hidden = p.dataset.pane !== b.dataset.tab; });
    if (b.dataset.tab === 'out') codecNote();
  }));
  $('fxFlash').addEventListener('change', e => { S.project.fx.flash = e.target.checked; replan(); });
  $('techFilter').addEventListener('input', () => renderTech());
  $('fxKoma').addEventListener('change', e => { const k = +e.target.value; S.project.fx.koma = k; S.project.fx.onTwos = k > 0; S.project.mood = null; replan(); });
  $('fxHud').addEventListener('change', e => { S.project.fx.hud = e.target.value; replan(); });
  $('seed').addEventListener('change', e => { S.project.seed = parseInt(e.target.value, 10) || 0; replan(); });
  $('btnSeed').addEventListener('click', () => { S.project.seed = (Math.random() * 1e9) | 0; $('seed').value = S.project.seed; replan(); });
  const colorToggle = (flag, getKeysFn) => e => {
    remember();
    const c = S.project.colors; c[flag] = e.target.checked;
    if (c[flag]) {
      const sc0 = J.STYLES[S.project.style].schemes[0];
      const keys = typeof getKeysFn === 'function' ? getKeysFn() : getKeysFn;
      keys.forEach(([k]) => { if (!c[k]) c[k] = sc0[k]; });
    }
    renderColors(); replan(); commit();
  };
  $('colorOn').addEventListener('change', colorToggle('enabled', getBaseKeys));
  $('accentOn').addEventListener('change', colorToggle('accentOn', getAccentKeys));
  $('btnRandPalette').addEventListener('click', randomPalette);
  $('btnAddFont').addEventListener('click', () => {
    const name = $('localFont').value.trim(); if (!name) return;
    const key = 'local_' + name.replace(/\s+/g, '_');
    const weight = /bold|太|black|heavy|w[6-9]|[6-9]00/i.test(name) ? 700 : 400;
    J.addUserFont(key, name + '（PC）', name, weight);
    S.project.userFonts = (S.project.userFonts || []).filter(u => u.key !== key).concat([{ key, label: name + '（PC）', family: name, weight }]);
    S.project.fonts.display = key; $('localFont').value = '';
    fontKey = ''; renderFontRoles(); replan();
  });
  $('fontFile').addEventListener('change', async e => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    try { const key = await J.loadFontFile(f); S.project.fonts.display = key; fontKey = ''; renderFontRoles(); replan(); }
    catch (err) { showMsg((J.getLang && J.getLang() === 'zh') ? '无法读取字体文件' : 'フォントを読み込めませんでした'); setTimeout(() => showMsg(null), 2500); }
  });
  // 语言切换与示例歌词按钮
  if ($('langZh')) $('langZh').addEventListener('click', () => { closeCutInspector(); J.setLang('zh'); updateUILanguage(); replan(); });
  if ($('langJa')) $('langJa').addEventListener('click', () => { closeCutInspector(); J.setLang('ja'); updateUILanguage(); replan(); });
  if ($('btnSampleZh')) $('btnSampleZh').addEventListener('click', () => {
    remember();
    S.project.lyrics = J.SAMPLE_LYRICS_ZH;
    $('lyrics').value = S.project.lyrics;
    replan(); commit();
    toast(J.getLang() === 'zh' ? '已填入中文示例歌词' : '中国語サンプル歌詞を挿入しました');
  });
  if ($('btnSampleJa')) $('btnSampleJa').addEventListener('click', () => {
    remember();
    S.project.lyrics = J.SAMPLE_LYRICS_JA;
    $('lyrics').value = S.project.lyrics;
    replan(); commit();
    toast(J.getLang() === 'zh' ? '已填入日文示例歌词' : '日本語サンプル歌詞を挿入しました');
  });

  ['outAspect', 'eAspect'].forEach(id => $(id).addEventListener('change', e => { S.project.aspect = e.target.value; syncOut(); replan(); codecNote(); }));
  ['outRes', 'eRes'].forEach(id => $(id).addEventListener('change', e => { S.project.res = +e.target.value; syncOut(); autosave(); codecNote(); }));
  ['outFps', 'eFps'].forEach(id => $(id).addEventListener('change', e => { S.project.fps = +e.target.value; syncOut(); replan(); codecNote(); }));
  $('outQuality').addEventListener('change', e => { S.project.quality = e.target.value; autosave(); });
  $('outAudio').addEventListener('change', e => { S.project.includeAudio = e.target.checked; autosave(); });
  $('btnMP4').addEventListener('click', () => runExport('mp4'));
  $('btnPNG').addEventListener('click', () => runExport('png'));
  $('btnPNGA').addEventListener('click', () => runExport('pnga'));
  document.querySelectorAll('.exp-cancel').forEach(b => b.addEventListener('click', () => { if (S.exporting) S.exporting.abort(); }));
  $('eMP4').addEventListener('click', () => runExport('mp4'));
  // かんたんモード
  $('modeEasy').addEventListener('click', () => setMode('easy'));
  $('modePro').addEventListener('click', () => setMode('pro'));
  $('btnOmakase').addEventListener('click', omakase);
  $('btnOmakaseBig').addEventListener('click', omakase);
  ['btnPrev', 'btnPrev2'].forEach(id => $(id).addEventListener('click', () => histGo(-1)));
  ['btnNext', 'btnNext2'].forEach(id => $(id).addEventListener('click', () => histGo(1)));
  $('eStyle').addEventListener('click', () => rerollPart('style'));
  $('eMood').addEventListener('click', () => rerollPart('mood'));
  $('eCut').addEventListener('click', () => rerollPart('cut'));
  $('ePalette').addEventListener('click', () => { randomPalette(); restartPreview(); });
  $('btnSave').addEventListener('click', () => J.saveFile(baseName() + '.jizura.json', JSON.stringify(S.project, null, 1)));
  $('btnAE').addEventListener('click', () => J.saveFile(baseName() + '_ae.json', JSON.stringify(J.planForAE(S.plan, S.project), null, 1)));
  $('fileProject').addEventListener('change', async e => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    try { await importProjectFile(JSON.parse(await f.text())); }
    catch (err) { showMsg((J.getLang && J.getLang() === 'zh') ? '无法读取工程文件' : 'プロジェクトを読み込めませんでした'); setTimeout(() => showMsg(null), 2500); }
    e.target.value = '';
  });
  document.addEventListener('keydown', e => {
    const tag = (e.target && e.target.tagName) || '';
    const isTextInput = (tag === 'TEXTAREA' || (tag === 'INPUT' && e.target.type !== 'checkbox' && e.target.type !== 'range'));
    if (S.tap) {
      if ((e.code === 'Space' || e.code === 'Enter') && !isTextInput) {
        e.preventDefault();
        if (e.target && e.target.tagName === 'SELECT') e.target.blur();
        tapNow();
        return;
      }
      if ((e.code === 'Backspace' || ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ')) && !isTextInput) {
        e.preventDefault();
        if (e.target && e.target.tagName === 'SELECT') e.target.blur();
        tapUndo();
        return;
      }
      if (e.code === 'Escape') { e.preventDefault(); pause(); stopTap(); return; }
    }
    if (!$('cutInspectorPopover').hidden) { if (e.code === 'Escape') { e.preventDefault(); closeCutInspector(); } return; }
    const typing = isTextInput || tag === 'SELECT';
    if (typing) return;
    if (e.code === 'Space') { e.preventDefault(); S.playing ? pause() : play(); }
    else if (e.code === 'ArrowRight') seek(S.t + (e.shiftKey ? 1 : 1 / S.plan.fps));
    else if (e.code === 'ArrowLeft') seek(S.t - (e.shiftKey ? 1 : 1 / S.plan.fps));
    else if ((e.code === 'ArrowUp' || e.code === 'KeyQ') && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      setTargetLineIdx(targetLineIdx - 1, true);
    }
    else if ((e.code === 'ArrowDown' || e.code === 'KeyW') && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      setTargetLineIdx(targetLineIdx + 1, true);
    }
    else if (e.code === 'KeyS' && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); stampCurrentLine('start'); }
    else if (e.code === 'KeyE' && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); stampCurrentLine('end'); }
    else if (e.code === 'BracketLeft') {
      e.preventDefault();
      if (e.altKey) rippleShiftFrom(getActiveLineIdx(), e.shiftKey ? -0.5 : -0.1);
      else nudgeLine(getActiveLineIdx(), e.shiftKey ? -0.5 : -0.1);
    }
    else if (e.code === 'BracketRight') {
      e.preventDefault();
      if (e.altKey) rippleShiftFrom(getActiveLineIdx(), e.shiftKey ? 0.5 : 0.1);
      else nudgeLine(getActiveLineIdx(), e.shiftKey ? 0.5 : 0.1);
    }
    else if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
      e.preventDefault();
      saveCurrentProjectToDisk(false);
    }
    else if (e.code === 'KeyM' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      AP.setMute(!AP.muted);
      if ($('btnMute')) {
        $('btnMute').textContent = AP.muted ? '🔇' : '🔊';
        $('btnMute').title = AP.muted ? '解除静音 (M)' : '静音切换 (M)';
      }
      const isZh = J.getLang && J.getLang() === 'zh';
      toast(AP.muted ? (isZh ? '🔇 已静音' : 'ミュート') : (isZh ? '🔊 已恢复音量' : 'ミュート解除'));
    }
    else if (e.code === 'KeyF' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      focusCutOnTimeline();
      const isZh = J.getLang && J.getLang() === 'zh';
      toast(isZh ? '🎯 已聚焦当前分句' : '🎯 現在の行にフォーカス');
    }
    else if (e.code === 'KeyT' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      if (S.tap) stopTap();
      else if (e.shiftKey) startTap(0, 'blank');
      else startTap(targetLineIdx, 'lyrics');
    }
    else if ((e.ctrlKey || e.metaKey) && e.altKey && e.code === 'KeyZ') { e.preventDefault(); histGo(-1); }
    else if ((e.ctrlKey || e.metaKey) && e.altKey && e.code === 'KeyY') { e.preventDefault(); histGo(1); }
    else if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.code === 'KeyZ') {
      e.preventDefault();
      const isZh = J.getLang && J.getLang() === 'zh';
      if (timingHistoryIdx > 0) {
        undoTiming();
        toast(isZh ? '↶ [时间微调撤销] 已还原歌词时间点 (Ctrl+Z)' : '↶ [タイミング取消] 歌詞のタイミングを復元しました (Ctrl+Z)');
      } else {
        histGo(-1);
        toast(isZh ? '↶ [视觉方案回退] 已还原上一个视觉方案 (Ctrl+Z)' : '↶ [ビジュアル復元] 直前のビジュアル案に戻しました (Ctrl+Z)');
      }
    }
    else if ((e.ctrlKey || e.metaKey) && (e.code === 'KeyY' || (e.shiftKey && e.code === 'KeyZ'))) {
      e.preventDefault();
      const isZh = J.getLang && J.getLang() === 'zh';
      if (timingHistoryIdx < timingHistory.length - 1) {
        redoTiming();
        toast(isZh ? '↷ [时间微调重做] 已重做歌词时间点 (Ctrl+Y)' : '↷ [タイミングやり直し] 歌詞のタイミングを復元しました (Ctrl+Y)');
      } else {
        histGo(1);
        toast(isZh ? '↷ [视觉方案前进] 已前进到下一个视觉方案 (Ctrl+Y)' : '↷ [ビジュアル進む] 次のビジュアル案に進みました (Ctrl+Y)');
      }
    }
    else if (e.code === 'KeyR' && !e.metaKey && !e.ctrlKey && !e.altKey && !S.exporting) {
      e.preventDefault();
      if (e.shiftKey) {
        omakase();
      } else {
        const isZh = J.getLang && J.getLang() === 'zh';
        toast(isZh ? '💡 请按 Shift+R 执行全量一键生成，或点击右侧面板按钮' : '💡 Shift+R で全編一括生成を実行します');
      }
    }
    else if (e.code === 'KeyD' && !e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey && !S.exporting) {
      e.preventDefault();
      const activeLine = (S.curLine >= 0 && S.curLine < (S.plan ? S.plan.lines.length : 0)) ? S.curLine : targetLineIdx;
      shuffleCutLine(activeLine, undefined, undefined, J.cutAt(S.plan,S.t));
    }
    else if (e.code === 'Escape') {
      closeCutInspector();
    }
  });
  initTimingTools();
  window.addEventListener('resize', () => { sizeViewport(); drawTimeline(); });
  if (window.ResizeObserver) new ResizeObserver(() => { sizeViewport(); drawTimeline(); }).observe($('viewport'));
}

/* ---------------- i18n DOM update ---------------- */
function updateSelectOptions(isZh) {
  const aspectLabels = isZh ? {
    '16:9': '16:9 横屏', '9:16': '9:16 竖屏', '4:3': '4:3', '3:4': '3:4 竖',
    '1:1': '1:1 正方', '4:5': '4:5 竖', '21:9': '21:9 宽幅'
  } : {
    '16:9': '16:9 横', '9:16': '9:16 縦', '4:3': '4:3', '3:4': '3:4 縦',
    '1:1': '1:1 正方形', '4:5': '4:5 縦', '21:9': '21:9 シネスコ'
  };
  ['eAspect', 'outAspect'].forEach(id => {
    const el = $(id); if (!el) return;
    [...el.options].forEach(opt => { if (aspectLabels[opt.value]) opt.textContent = aspectLabels[opt.value]; });
  });
  const komaLabels = isZh ? {
    '0': '全帧率流畅 (跟随输出FPS)', '12': '一拍二 (12格/秒・日漫定格感)', '8': '一拍三 (8格/秒・强定格感)'
  } : {
    '0': 'フル（出力fpsのまま）', '12': '2コマ打ち（12枚/秒）', '8': '3コマ打ち（8枚/秒）'
  };
  const komaEl = $('fxKoma');
  if (komaEl) [...komaEl.options].forEach(opt => { if (komaLabels[opt.value]) opt.textContent = komaLabels[opt.value]; });
  const hudLabels = isZh ? {
    'auto': '由风格决定', 'on': '始终开启', 'off': '关闭隐藏'
  } : {
    'auto': 'スタイル任せ', 'on': '常に表示', 'off': '非表示'
  };
  const hudEl = $('fxHud');
  if (hudEl) [...hudEl.options].forEach(opt => { if (hudLabels[opt.value]) opt.textContent = hudLabels[opt.value]; });
  const qLabels = isZh ? {
    'standard': '标准', 'high': '高品质 (推荐)', 'max': '超高纯净'
  } : {
    'standard': '標準', 'high': '高品質（おすすめ）', 'max': '最高品質'
  };
  const qEl = $('outQuality');
  if (qEl) [...qEl.options].forEach(opt => { if (qLabels[opt.value]) opt.textContent = qLabels[opt.value]; });
}

function updateUILanguage() {
  const lang = J.getLang();
  const isZh = lang === 'zh';
  if ($('langZh')) $('langZh').setAttribute('aria-pressed', String(isZh));
  if ($('langJa')) $('langJa').setAttribute('aria-pressed', String(!isZh));
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (k) el.innerHTML = J.t(k);
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const k = el.dataset.i18nPh;
    if (k) el.placeholder = J.t(k);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const k = el.dataset.i18nTitle;
    if (k) el.title = J.t(k);
  });
  updateSelectOptions(isZh);
  const editorLabels = {
    btnNewProject:['➕ 新建','➕ 新規'],btnSaveAsDisk:['📑 另存为','📑 別名で保存'],
    btnSmartPhrases:['✨ 智能节拍分句','✨ ビートで自動分割'],btnTargetSeek:['🎯跳到本句','🎯対象行へ'],
    btnUndoTiming:['↶ 撤销时间','↶ 時間を戻す'],btnRedoTiming:['↷ 重做时间','↷ 時間をやり直す'],
    tlZoom1x:['1x全景','1x 全体'],tlZoom8x:['8x精修','8x 詳細'],btnFocusCut:['🎯 聚焦当前句','🎯 現在の行にフォーカス']
  };
  for (const [id,labels] of Object.entries(editorLabels)) if ($(id)) $(id).textContent = labels[isZh?0:1];
  const editorTitles = {
    btnNewProject:['新建全新文字PV工程','新しい文字PVプロジェクトを作成'],
    btnSaveDisk:['保存当前磁盘工程 (Ctrl+S)','ディスクに保存 (Ctrl+S)'],
    btnSaveAsDisk:['另存为独立工程副本','独立したプロジェクトとして保存'],
    btnSmartPhrases:['按音频节拍生成分句模板','音声のビートから歌詞の区切りを生成'],
    btnTargetPrev:['上一目标句 (Q / ↑)','前の対象行 (Q / ↑)'],btnTargetNext:['下一目标句 (W / ↓)','次の対象行 (W / ↓)'],
    btnTargetSeek:['跳到目标句起点','対象行の開始位置へ移動'],
    btnFocusCut:['聚焦当前播放句 (F)','現在の再生行にフォーカス (F)'],
    tlZoom1x:['全片时间轴','時間軸全体'],tlZoom2x:['2倍放大','2倍拡大'],tlZoom4x:['4倍放大','4倍拡大'],tlZoom8x:['8倍放大','8倍拡大'],
    popoverAutoBtn:['清除本维度手动指定；锁定镜头会固定本次推荐','この項目を自動選択。ロック中は今回の結果を保持'],
    btnPrev:['上一视觉方案 (Ctrl+Alt+Z)','前の演出案 (Ctrl+Alt+Z)'],btnNext:['下一视觉方案 (Ctrl+Alt+Y)','次の演出案 (Ctrl+Alt+Y)']
  };
  for (const [id,labels] of Object.entries(editorTitles)) if ($(id)) $(id).title = labels[isZh?0:1];
  if ($('lblAutoSave')) $('lblAutoSave').lastChild.textContent = isZh ? ' 自动存盘' : ' 自動保存';
  if (S.audio) $('audioName').textContent = `${S.audio.name}（${J.fmtTime(S.audio.duration)} · ${S.audio.bpm} BPM）`;
  setSaveStatus(isDirty); updateUndoRedoUI();
  renderFontRoles();
  renderColors();
  renderFx();
  renderTech();
  drawStyleGrid();
  showNow();
  updateCutInfo(true);
  if (currentInspectorCut) { renderPopoverTabs(); renderPopoverGrid(); }
  codecNote();
  renderLines();
}

/* ---------------- project persistence & manager ---------------- */
// Project identity is supplied by the server, never guessed from a sample name.
let audioLoadToken = 0;

function showMissingMediaAlert() {
  const box = $('mediaMissingBox');
  if (!box) return;
  const isZh = J.getLang && J.getLang() === 'zh';
  const meta = S.project.audioMeta || {};
  const expName = meta.name || meta.file || (isZh ? '未指定文件' : '未設定');
  const expDur = meta.duration ? J.fmtTime(meta.duration) : (S.plan && S.plan.duration ? J.fmtTime(S.plan.duration) : '未知');
  const expBpm = meta.bpm || (S.project.timing && S.project.timing.bpm) || 0;

  if ($('missingTitle')) $('missingTitle').textContent = isZh ? '⚠️ 音频素材缺失 / 未找到' : '⚠️ 音声ファイルが見つかりません';
  if ($('missingDesc')) $('missingDesc').textContent = isZh ? `当前工程 [${currentProjectId}] 缺少绑定的物理音频文件。` : `音声ファイルがリンクされていません。`;
  if ($('missingExpected')) {
    $('missingExpected').innerHTML = `${isZh ? '原工程预期' : '想定'}: <b style="color:#fff;">${expName}</b> | 时长约: <b style="color:#ffcc00;">${expDur}</b> | 节奏: <b style="color:#00F0FF;">${expBpm ? expBpm + ' BPM' : '未知'}</b>`;
  }
  box.style.display = 'block';
}

async function autoLoadProjectAudio(pid) {
  const token = ++audioLoadToken;
  const isZh = J.getLang && J.getLang() === 'zh';
  const audioUri = pid ? `/api/audio?id=${encodeURIComponent(pid)}` : '/api/audio';
  try {
    if ($('audioName')) $('audioName').textContent = isZh ? '正在载入工程音频…' : '音楽を読み込み中…';
    const resp = await fetch(audioUri);
    if (token !== audioLoadToken) return;

    if (!resp.ok) {
      S.audio = null;
      if ($('audioName')) $('audioName').textContent = isZh ? '❌ 关联音频文件缺失 (404 Not Found)' : '❌ 音楽ファイルが見つかりません';
      showMissingMediaAlert();
      syncUI();
      replan();
      return;
    }
    const blob = await resp.blob();
    if (token !== audioLoadToken) return;

    if (blob.size < 1000) {
      S.audio = null;
      showMissingMediaAlert();
      syncUI();
      replan();
      return;
    }
    const audioFileName = S.project.audioMeta?.file || 'audio.'+((blob.type.includes('wav')?'wav':blob.type.includes('mp4')?'mp4':'mp3'));
    const f = new File([blob], audioFileName, { type: blob.type || 'audio/mpeg' });
    const analyzed = await J.analyzeAudio(f);
    if (token !== audioLoadToken) return;

    S.audio = analyzed;
    if ($('audioName')) {
      $('audioName').textContent = `${f.name}（${J.fmtTime(S.audio.duration)} · ${isZh ? '约' : '約'}${S.audio.bpm}BPM）`;
    }
    if ($('mediaMissingBox')) $('mediaMissingBox').style.display = 'none';
    if (!S.project.audioMeta) {
      S.project.audioMeta = {
        file: audioFileName,
        name: f.name,
        duration: S.audio.duration,
        bpm: S.audio.bpm,
        size: blob.size
      };
    }
    syncUI();
    replan();
  } catch (e) {
    if (token !== audioLoadToken) return;
    console.warn('[JIZURA] 音频自动加载失败:', e);
    S.audio = null;
    showMissingMediaAlert();
    syncUI();
    replan();
  }
}

async function handleAudioRelink(file, isManualRelink = false) {
  if (!file) return;
  const project = S.project, pid = currentProjectId, token = ++audioLoadToken;
  const stillCurrent = () => S.project === project && currentProjectId === pid && token === audioLoadToken;
  const isZh = J.getLang && J.getLang() === 'zh';
  pause();

  showMsg(isZh ? '正在解析并比对音频指纹…' : '音楽ファイルを解析中…');
  let newAudio = null;
  try {
    newAudio = await J.analyzeAudio(file);
  } catch (err) {
    showMsg(null);
    alert((isZh ? '音频文件解析失败: ' : '解析エラー: ') + err.message);
    return;
  }
  if (!stillCurrent()) return;
  showMsg(null);

  const meta = project.audioMeta || {};
  const expDur = meta.duration || (S.plan && S.plan.duration) || 0;
  const expBpm = meta.bpm || (S.project.timing && S.project.timing.bpm) || 0;
  const durDiff = expDur > 0 ? Math.abs(newAudio.duration - expDur) : 0;
  const bpmDiff = expBpm > 0 ? Math.abs(newAudio.bpm - expBpm) : 0;

  // 防呆判定：如果原工程有记录预期，且时长偏差大于 3.0 秒，或 BPM 偏差大于 12
  const isMismatch = (expDur > 0 && durDiff > 3.0) || (expBpm > 0 && bpmDiff > 12);

  const applyAudio = async () => {
    if (!stillCurrent()) return;
    S.audio = newAudio;
    $('audioName').textContent = `${file.name}（${J.fmtTime(S.audio.duration)} · ${isZh ? '约' : '約'}${S.audio.bpm}BPM）`;
    if ($('mediaMissingBox')) $('mediaMissingBox').style.display = 'none';

    const ext = (file.name.match(/\.[a-zA-Z0-9]+$/) || ['.mp3'])[0].toLowerCase();
    const storedFileName = `audio${ext}`;
    S.project.audioMeta = {
      file: storedFileName,
      name: file.name,
      duration: S.audio.duration,
      bpm: S.audio.bpm,
      size: file.size,
      updated_at: new Date().toISOString()
    };
    if (!S.project.timing.bpm && S.audio.bpm) S.project.timing.bpm = S.audio.bpm;

    syncUI();
    replan();

    if (!pid) {
      toast(isZh ? '音频已载入；请另存为工程以保留音频文件。' : '音声を読み込みました。音声を保持するには別名で保存してください。');
      return;
    }

    try {
      showMsg(isZh ? '正在上传音频并持久化保存至工程…' : 'サーバーに保存中…');
      const arrayBuf = await file.arrayBuffer();
      const upload = await fetch(`/api/upload_audio?id=${encodeURIComponent(pid)}&filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: arrayBuf
      });
      if (!upload.ok) throw new Error('HTTP '+upload.status);
      const body = JSON.stringify(project,null,2);
      const task = () => persistProject(pid,project,body,true);
      diskSaveQueue = diskSaveQueue.then(task,task);
      if (!await diskSaveQueue) throw new Error(isZh ? '工程保存失败' : '保存に失敗しました');
      if (stillCurrent()) showMsg(null);
      console.log('[JIZURA] 音频已成功上传并与工程永久绑定');
    } catch (e) {
      if (stillCurrent()) { showMsg(null); setSaveStatus(true); toast((isZh ? '音频未成功存盘：' : '音声の保存に失敗：')+e.message); }
      console.warn('[JIZURA] 音频上传至服务端时出错 (本地预览仍生效):', e);
    }
  };

  if (isMismatch) {
    const dlg = $('mediaMismatchDialog');
    if (dlg) {
      $('mismatchExp').textContent = `${meta.name || '原始工程设定'} (${expDur ? J.fmtTime(expDur) : '未知'} · ${expBpm || 0} BPM)`;
      $('mismatchAct').textContent = `${file.name} (${J.fmtTime(newAudio.duration)} · 约${newAudio.bpm} BPM · 时长偏差 ${durDiff.toFixed(1)}秒)`;

      const onConfirm = () => {
        dlg.close();
        cleanup();
        applyAudio();
      };
      const onCancel = () => {
        dlg.close();
        cleanup();
        if ($('audioRelinkFile')) $('audioRelinkFile').value = '';
        if ($('audioFile')) $('audioFile').value = '';
      };
      const cleanup = () => {
        $('btnConfirmRelink').removeEventListener('click', onConfirm);
        $('btnCancelRelink').removeEventListener('click', onCancel);
      };
      $('btnConfirmRelink').addEventListener('click', onConfirm);
      $('btnCancelRelink').addEventListener('click', onCancel);
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      return;
    }
  }

  await applyAudio();
}

async function loadServerProject(pid, autoAudio = true) {
  const token = ++projectLoadToken;
  loadingProject = true;
  clearTimeout(autoDiskTimer); clearTimeout(saveTimer);
  closeCutInspector();
  try {
    const res = await fetch(pid ? `/api/project?id=${encodeURIComponent(pid)}` : '/api/project');
    if (!res.ok) return false;
    const serverProj = await res.json();
    if (token !== projectLoadToken || !serverProj || typeof serverProj.lyrics !== 'string') return false;
    ++audioLoadToken; pause(); S.audio = null;
    currentProjectId = pid || serverProj.id;
    if ($('projectSelect')) $('projectSelect').value = currentProjectId;
    S.project = mergeProject(serverProj);
    J.upgradeLegacyLocks(S.project,J.plan(S.project));
    targetLineIdx = 0; S.t = 0; S.curLine = -2; lastCutIdx = -2;
    H.list = []; H.i = -1;
    initTimingHistory(); syncUI(); replan(); remember(); updateHist();
    if (autoAudio) await autoLoadProjectAudio(currentProjectId);
    if (token !== projectLoadToken) return false;
    const c0 = S.plan.cuts.find(c => c.line >= 0);
    if (c0) seek(c0.start + Math.min(c0.dur * 0.6,c0.inDur + 0.25));
    setSaveStatus(false); updateActiveLineHeader();
    return true;
  } catch (err) { console.warn('[JIZURA] Project load failed:',err); return false; }
  finally { if (token === projectLoadToken) loadingProject = false; }
}

async function initProjectManager() {
  const sel = $('projectSelect');
  const btnSave = $('btnSaveDisk');

  try {
    const r = await fetch('/api/projects');
    if (r.ok) {
      const list = await r.json();
      if (Array.isArray(list) && list.length && sel) {
        sel.innerHTML = '';
        list.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p.id;
          opt.textContent = `${p.title} (${p.id})`;
          if (p.active) {
            opt.selected = true;
            currentProjectId = p.id;
          }
          sel.appendChild(opt);
        });
        const box = $('projectBox');
        if (box) box.style.display = 'inline-flex';
      }
    }
  } catch (e) {}

  if (sel && !sel._hasBoundChange) {
    sel._hasBoundChange = true;
    sel.addEventListener('change', async e => {
      const newId = e.target.value;
      console.log('[DEBUG] projectSelect change event fired! newId:', newId);
      if (!newId) return;
      if (isDirty) {
        const isZh = J.getLang && J.getLang() === 'zh';
        const ok = confirm(isZh ?
          `当前工程有未保存修改。确定：保存后切换；取消：留在当前工程。` :
          `未保存の変更があります。保存してから切り替えますか？`);
        if (!ok || !(await saveCurrentProjectToDisk(true))) { sel.value = currentProjectId; return; }
      }
      try {
        const previousId = currentProjectId;
        if (await loadServerProject(newId,true)) await fetch(`/api/active?id=${encodeURIComponent(newId)}`, {method:'POST'});
        else { sel.value = previousId; toast(J.getLang()==='zh'?'工程加载失败，保留当前工程':'読み込み失敗。現在のプロジェクトを保持しました'); }
      } catch (err) {
        console.error('切换工程失败:', err);
      }
    });
  }

  if (btnSave && !btnSave._hasBoundClick) {
    btnSave._hasBoundClick = true;
    btnSave.addEventListener('click', async () => {
      await saveCurrentProjectToDisk(false);
    });
  }

  window.addEventListener('beforeunload', (e) => {
    if (isDirty && currentProjectId) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  const btnNewProj = $('btnNewProject');
  const dlgNewProj = $('newProjectDialog');
  if (btnNewProj && dlgNewProj && !btnNewProj._hasBoundClick) {
    btnNewProj._hasBoundClick = true;
    const isZh = J.getLang && J.getLang() === 'zh';

    const closeDialog = () => {
      if (typeof dlgNewProj.close === 'function') dlgNewProj.close();
      else dlgNewProj.removeAttribute('open');
    };

    if ($('btnCancelNewProjTop')) $('btnCancelNewProjTop').onclick = closeDialog;
    if ($('btnCancelNewProj')) $('btnCancelNewProj').onclick = closeDialog;

    btnNewProj.addEventListener('click', () => {
      const nowStr = Date.now().toString().slice(-4);
      $('newProjId').value = `pv_${nowStr}`;
      $('newProjTitle').value = '';
      $('newProjArtist').value = '';
      if (typeof dlgNewProj.showModal === 'function') dlgNewProj.showModal();
      else dlgNewProj.setAttribute('open', '');
      setTimeout(() => $('newProjTitle').focus(), 50);
    });

    if ($('btnConfirmNewProj')) {
      $('btnConfirmNewProj').onclick = async () => {
        const rawId = $('newProjId').value.trim();
        const rawTitle = $('newProjTitle').value.trim();
        const rawArtist = $('newProjArtist').value.trim();
        const cleanId = rawId.replace(/[^a-zA-Z0-9_\-]/g, '_').toLowerCase();
        if (!cleanId) {
          alert(isZh ? '请输入有效的工程标识 ID（英文、数字或下划线）' : '有効なプロジェクトIDを入力してください');
          return;
        }
        const title = rawTitle || cleanId;
        const artist = rawArtist || '';

        const btnConfirm = $('btnConfirmNewProj');
        const origText = btnConfirm.textContent;
        btnConfirm.textContent = isZh ? '创建中…' : '作成中…';
        btnConfirm.disabled = true;

        try {
          const freshProj = J.defaultProject();
          freshProj.id = cleanId;
          freshProj.title = title;
          freshProj.artist = artist;
          freshProj.lyrics = isZh ?
            '在这里输入第一句歌词\n输入第二句歌词\n输入第三句歌词' :
            'ここに最初の歌詞を入力\n二行目の歌詞\n三行目の歌詞';
          freshProj.audioMeta = null;
          freshProj.timing = { bpm: 0, offset: 0.4, snap: true, tail: 0.9, lineTimes: {}, lineEnds: {}, lineScale: 1 };

          const payload = {
            newId: cleanId,
            title: title,
            artist: artist,
            project: freshProj,
            copyAudio: false
          };

          clearTimeout(autoDiskTimer); clearTimeout(saveTimer);
          await diskSaveQueue;
          const r = await fetch('/api/save_as', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (r.ok) {
            closeDialog();
            btnConfirm.textContent = origText;
            btnConfirm.disabled = false;
            await initProjectManager();
            await loadServerProject(cleanId, false);
            toast(isZh ? `✅ 新工程「${title}」创建成功！可直接拖拽音乐或录屏 MP4 开始卡点制作。` : `✅ 新規プロジェクト「${title}」を作成しました！`);
          } else {
            const errData = await r.json().catch(() => ({}));
            alert((isZh ? '创建工程失败: ' : '作成失敗: ') + (errData.error || r.statusText));
            btnConfirm.textContent = origText;
            btnConfirm.disabled = false;
          }
        } catch (err) {
          alert((isZh ? '创建工程出错: ' : 'エラー: ') + err.message);
          btnConfirm.textContent = origText;
          btnConfirm.disabled = false;
        }
      };
    }
  }

  const btnSaveAs = $('btnSaveAsDisk');
  if (btnSaveAs && !btnSaveAs._hasBoundClick) {
    btnSaveAs._hasBoundClick = true;
    btnSaveAs.addEventListener('click', async () => {
      const isZh = J.getLang && J.getLang() === 'zh';
      const defaultNewId = currentProjectId ? `${currentProjectId}_v2` : 'new_project';
      const dlg = $('saveAsDialog');
      if (dlg.open) return;
      $('saveAsHeading').textContent = isZh ? '另存为独立工程' : '別名で保存';
      $('saveAsIdLabel').textContent = isZh ? '新工程 ID（字母、数字、下划线或横线）' : '新しいID（英数字・_・-）';
      $('saveAsTitleLabel').textContent = isZh ? '工程名称' : 'プロジェクト名';
      $('saveAsCancel').textContent = isZh ? '取消' : 'キャンセル';
      $('saveAsConfirm').textContent = isZh ? '创建副本' : 'コピーを作成';
      $('saveAsId').value = defaultNewId;
      $('saveAsTitle').value = (S.project.title || defaultNewId)+(isZh?' (副本)':' (コピー)');
      const accepted = await new Promise(resolve => {
        const cleanup = () => { $('saveAsForm').onsubmit = null; $('saveAsCancel').onclick = null; dlg.oncancel = null; };
        $('saveAsForm').onsubmit = e => { e.preventDefault(); cleanup(); dlg.close(); resolve(true); };
        $('saveAsCancel').onclick = () => { cleanup(); dlg.close(); resolve(false); };
        dlg.oncancel = () => { cleanup(); resolve(false); };
        dlg.showModal();
      });
      if (!accepted) return;
      const cleanNewId = $('saveAsId').value.trim().toLowerCase();
      const newTitleInput = $('saveAsTitle').value;

      const origText = btnSaveAs.textContent;
      btnSaveAs.textContent = isZh ? '📑 另存中…' : '保存中…';
      try {
        const sourceAudio = S.audio?.file;
        const payload = {
          fromId: currentProjectId,
          newId: cleanNewId,
          title: newTitleInput.trim(),
          project: S.project,
          copyAudio: true
        };
        clearTimeout(autoDiskTimer); clearTimeout(saveTimer);
        await diskSaveQueue;
        const r = await fetch('/api/save_as', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (r.ok) {
          if (sourceAudio) {
            const uploaded = await fetch(`/api/upload_audio?id=${encodeURIComponent(cleanNewId)}&filename=${encodeURIComponent(sourceAudio.name)}`,{method:'POST',body:await sourceAudio.arrayBuffer()});
            if (!uploaded.ok) throw new Error(isZh ? '新工程已创建，但音频保存失败。请切换到新工程重新链接。' : 'プロジェクトは作成されましたが、音声の保存に失敗しました。再リンクしてください。');
          }
          btnSaveAs.textContent = isZh ? '✅ 另存成功!' : '完了!';
          setTimeout(() => { btnSaveAs.textContent = origText; }, 1500);
          await initProjectManager();
          await loadServerProject(cleanNewId, true);
        } else {
          const errData = await r.json().catch(() => ({}));
          alert((isZh ? '另存为失败: ' : '失敗: ') + (errData.error || r.statusText));
          btnSaveAs.textContent = origText;
        }
      } catch (err) {
        alert((isZh ? '另存为出错: ' : 'エラー: ') + err.message);
        btnSaveAs.textContent = origText;
      }
    });
  }

  const relinkInput = $('audioRelinkFile');
  if (relinkInput && !relinkInput._hasBoundChange) {
    relinkInput._hasBoundChange = true;
    relinkInput.addEventListener('change', e => {
      const f = e.target.files && e.target.files[0];
      if (f) handleAudioRelink(f, true);
    });
  }
}

/* ---------------- boot ---------------- */
async function boot() {
  S.project = loadLocal();
  initTimingHistory();
  bind(); syncUI(); replan(); updateUILanguage();
  let mode = 'easy'; try { mode = localStorage.getItem('jizura.mode') || 'easy'; } catch (e) {}
  setMode(mode); commit();
  requestAnimationFrame(tick);

  // 优先立即加载工程列表并绑定切换事件
  await initProjectManager();

  const urlParams = new URLSearchParams(window.location.search);
  const targetPid = urlParams.get('project') || currentProjectId || null;

  const loaded = await loadServerProject(targetPid, true);

  if (!loaded) {
    const c0 = (S.plan && S.plan.cuts) ? S.plan.cuts.find(c => c.line >= 0) : null;
    if (c0) seek(c0.start + Math.min(c0.dur * 0.6, c0.inDur + 0.25));
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
J.ui = S;
J.ui.loadServerProject = loadServerProject;
J.ui.autoLoadProjectAudio = autoLoadProjectAudio;
J.ui.handleAudioRelink = handleAudioRelink;
J.ui.showMissingMediaAlert = showMissingMediaAlert;
window.loadServerProject = loadServerProject;
window.handleAudioRelink = handleAudioRelink;
window.autoLoadProjectAudio = autoLoadProjectAudio;
window.showMissingMediaAlert = showMissingMediaAlert;
})();
