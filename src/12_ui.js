/* ============================================================
   JIZURA — editor UI
   ============================================================ */
(() => {
'use strict';
if (!document.getElementById('app')) return;          // engine-only pages (tests)
const $ = id => document.getElementById(id);
const LS_KEY = 'jizura.project.v1';
const HUD_CHARS = '0123456789:./-_()【】・No.LYRICRECUNTITLEDXYlinebpminterlude—─／ ';
const ICON = {
  dice: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2" width="12" height="12" rx="2"/><circle cx="5.5" cy="5.5" r="1" fill="currentColor"/><circle cx="10.5" cy="10.5" r="1" fill="currentColor"/><circle cx="10.5" cy="5.5" r="1" fill="currentColor"/><circle cx="5.5" cy="10.5" r="1" fill="currentColor"/></svg>',
  lock: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5 7V5a3 3 0 0 1 6 0v2"/></svg>',
};

const S = { project: null, plan: null, audio: null, renderer: new J.Renderer(), playing: false, t: 0, t0: 0, loop: true, need: true, exporting: null, tap: null, tapRate: 1.0, slow: false, lineEls: [], curLine: -2 };

/* WebAudio player (works inside sandboxed pages where blob media may be blocked) */
const AP = {
  ctx: null, src: null, startAt: 0, rate: 1.0, startCtxTime: 0,
  play(buffer, offset, rate = 1.0) {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.stop();
    this.rate = rate || 1.0;
    const s = this.ctx.createBufferSource(); s.buffer = buffer;
    s.playbackRate.value = this.rate;
    s.connect(this.ctx.destination);
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
  o.overrides = (p && p.overrides) || {};
  o.colors = Object.assign({ enabled: false }, (p && p.colors) || {});
  o.fonts = (p && p.fonts) || {};
  o.userFonts = (p && p.userFonts) || [];
  for (const uf of o.userFonts) if (!J.FONTS[uf.key]) J.addUserFont(uf.key, uf.label, uf.family, uf.weight || 400);
  return o;
}
function loadLocal() { try { const s = localStorage.getItem(LS_KEY); if (s) return mergeProject(JSON.parse(s)); } catch (e) {} return mergeProject(null); }
let saveTimer = 0;
function autosave() { clearTimeout(saveTimer); saveTimer = setTimeout(() => { try { localStorage.setItem(LS_KEY, JSON.stringify(S.project)); } catch (e) {} }, 700); }

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
  }
  if (S.need) { S.need = false; draw(); }
}
function updateTimeUI() {
  $('timeNow').textContent = J.fmtTime(S.t);
  $('timeDur').textContent = J.fmtTime(S.plan.duration);
  if (!S.scrubbing) $('scrub').value = String(Math.round(S.t / Math.max(0.001, S.plan.duration) * 10000));
}
function play() {
  const rate = (S.tap && S.tapRate) || 1.0;
  if (S.audio) AP.play(S.audio.buffer, S.t, rate);
  else S.t0 = performance.now() - (S.t * 1000) / rate;
  S.playing = true; $('btnPlay').textContent = '❚❚'; $('btnPlay').setAttribute('aria-label', (J.getLang && J.getLang() === 'zh') ? '暂停' : '一時停止');
}
function pause() {
  S.playing = false; AP.stop();
  $('btnPlay').textContent = '▶'; $('btnPlay').setAttribute('aria-label', (J.getLang && J.getLang() === 'zh') ? '播放' : '再生'); S.need = true;
}
function seek(t) {
  S.t = J.clamp(t, 0, Math.max(0, S.plan.duration - 1e-3));
  const rate = (S.tap && S.tapRate) || 1.0;
  if (S.audio) { if (S.playing) AP.play(S.audio.buffer, S.t, rate); }
  else S.t0 = performance.now() - (S.t * 1000) / rate;
  S.need = true;
}

/* ---------------- timeline ---------------- */
const layoutHue = k => (J.LAYOUT_ORDER.indexOf(k) * 37 + 30) % 360;
function drawTimeline() {
  const c = $('timeline'), dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(10, Math.round(c.clientWidth * dpr)), h = Math.max(10, Math.round(c.clientHeight * dpr));
  if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
  const x = c.getContext('2d'), D = Math.max(0.001, S.plan.duration), X = t => t / D * w;
  x.fillStyle = '#131316'; x.fillRect(0, 0, w, h);
  if (S.audio && S.audio.peaks) {
    const pk = S.audio.peaks, n = pk.length, sd = S.audio.duration;
    x.fillStyle = '#2b2b33';
    for (let i = 0; i < w; i += 2) { const t = i / w * D; if (t > sd) break; const v = pk[Math.min(n - 1, Math.floor(t / sd * n))]; const hh = v * h * 0.8; x.fillRect(i, h * 0.6 - hh / 2, 1.5, hh); }
  }
  const beats = S.plan.beats || [];
  x.fillStyle = '#3a3a44';
  for (const b of beats) { if (b > D) break; x.fillRect(Math.round(X(b)), h - 6 * dpr, 1, 6 * dpr); }
  const trackH = Math.round(h * 0.35);
  const cutTop = trackH + 2 * dpr, cutBot = h - 8 * dpr;
  const isZh = J.getLang && J.getLang() === 'zh';

  // 1. Video track lyric blocks & gap indicators
  const lines = S.plan.lines || [];
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    const lx0 = Math.round(X(ln.start));
    const lx1 = Math.round(X(ln.end));
    const lw = Math.max(3 * dpr, lx1 - lx0);
    const active = S.t >= ln.start && S.t < ln.end;

    // Line block background
    x.fillStyle = active ? 'rgba(245,165,12,0.32)' : 'rgba(22,244,212,0.18)';
    x.fillRect(lx0, 2 * dpr, lw, trackH - 3 * dpr);
    
    // Left boundary accent bar
    x.fillStyle = active ? '#f5a50c' : '#16f4d4';
    x.fillRect(lx0, 2 * dpr, 2 * dpr, trackH - 3 * dpr);

    // Right boundary accent
    x.fillStyle = active ? 'rgba(245,165,12,0.8)' : 'rgba(22,244,212,0.5)';
    x.fillRect(lx0 + lw - dpr, 2 * dpr, dpr, trackH - 3 * dpr);

    // Block text (line number, lyric snippet, range)
    if (lw > 26 * dpr) {
      x.save();
      x.beginPath();
      x.rect(lx0 + 3 * dpr, 2 * dpr, lw - 5 * dpr, trackH - 3 * dpr);
      x.clip();
      x.fillStyle = active ? '#ffffff' : 'rgba(236,231,225,0.9)';
      x.font = `bold ${9 * dpr}px sans-serif`;
      const durSec = (ln.end - ln.start).toFixed(1);
      x.fillText(`${String(i + 1).padStart(2, '0')}. ${ln.text} [${durSec}s]`, lx0 + 4 * dpr, trackH - 5 * dpr);
      x.restore();
    }

    // Gap indicator between lines (e.g. 3-5s musical pause / interlude)
    if (i < lines.length - 1) {
      const nextStart = lines[i + 1].start;
      const gapSec = nextStart - ln.end;
      if (gapSec > 0.35) {
        const gx0 = lx1, gx1 = Math.round(X(nextStart));
        const gw = gx1 - gx0;
        if (gw > 4 * dpr) {
          x.fillStyle = 'rgba(255,255,255,0.03)';
          x.fillRect(gx0, 3 * dpr, gw, trackH - 4 * dpr);
          if (gw > 35 * dpr) {
            x.save();
            x.beginPath();
            x.rect(gx0, 3 * dpr, gw, trackH - 4 * dpr);
            x.clip();
            x.fillStyle = 'rgba(160,160,170,0.5)';
            x.font = `${8 * dpr}px monospace`;
            x.fillText(isZh ? `留白 ${gapSec.toFixed(1)}s` : `間隔 ${gapSec.toFixed(1)}s`, gx0 + 3 * dpr, trackH - 5 * dpr);
            x.restore();
          }
        }
      }
    }
  }

  // Track divider line
  x.fillStyle = '#2b2b36';
  x.fillRect(0, trackH, w, dpr);

  // 2. Cut layouts track
  for (const cut of S.plan.cuts) {
    const x0 = X(cut.start), x1 = X(cut.end);
    const hue = layoutHue(cut.layout);
    x.fillStyle = `hsla(${hue},70%,58%,0.28)`; x.fillRect(x0, cutTop, Math.max(1, x1 - x0 - 1), cutBot - cutTop);
    x.fillStyle = `hsla(${hue},80%,62%,0.95)`; x.fillRect(x0, cutTop, Math.max(1, 2 * dpr), cutBot - cutTop);
    if (x1 - x0 > 34 * dpr) {
      x.fillStyle = 'rgba(236,231,225,0.85)'; x.font = `${10 * dpr}px ${getComputedStyle(document.body).getPropertyValue('--mono') || 'monospace'}`;
      x.save(); x.beginPath(); x.rect(x0, cutTop, x1 - x0 - 3, cutBot - cutTop); x.clip();
      x.fillText(J.techName('layout', cut.layout) || cut.layout, x0 + 5 * dpr, cutTop + 13 * dpr); x.restore();
    }
  }
  const px = X(S.t);
  x.fillStyle = '#f5a50c'; x.fillRect(Math.round(px) - dpr, 0, 2 * dpr, h);
}
function timelineSeek(ev) {
  const r = $('timeline').getBoundingClientRect();
  seek((ev.clientX - r.left) / r.width * S.plan.duration);
}

/* ---------------- cut info ---------------- */
let lastCutIdx = -2;
function updateCutInfo(force) {
  if (!S.plan) return;
  const cut = J.cutAt(S.plan, S.t);
  const idx = cut ? cut.index : -1;
  const li = cut ? cut.line : -1;
  if (li !== S.curLine) { S.lineEls.forEach((el, i) => el.classList.toggle('cur', i === li)); S.curLine = li; }
  if (!force && idx === lastCutIdx) return;
  lastCutIdx = idx;
  const el = $('cutInfo');
  if (!cut) { el.innerHTML = `<span class="hint">${J.t('no_cut_at_time', 'この位置にカットはありません')}</span>`; return; }
  const chip = (cls, k, v) => `<span class="chip ${cls}"><b>${k}</b>${v}</span>`;
  const n = (g, k) => J.techName(g, k);
  el.innerHTML = [
    `<span class="chip mono">#${String(cut.index + 1).padStart(2, '0')}</span>`,
    chip('l', J.t('chip_layout', 'レイアウト'), n('layout', cut.layout)),
    chip('e', J.t('chip_enter', '登場'), n('enter', cut.enter)),
    chip('h', J.t('chip_hold', '保持'), n('hold', cut.hold)),
    chip('x', J.t('chip_exit', '退場'), n('exit', cut.exit)),
    cut.decor && cut.decor.length ? chip('', J.t('chip_decor', '装飾'), cut.decor.map(d => n('decor', d.id)).join('・')) : '',
    cut.treat && cut.treat !== 'none' ? chip('t', J.t('chip_treat', '加工'), n('treat', cut.treat)) : '',
    cut.bg && cut.bg !== 'none' ? chip('b', J.t('chip_bg', '背景'), n('bg', cut.bg)) : '',
    cut.cam && cut.cam !== 'push' ? chip('c', J.t('chip_cam', 'カメラ'), n('cam', cut.cam)) : '',
  ].join('');
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
    const manualStart = S.project.timing.lineTimes && S.project.timing.lineTimes[i] != null;
    const manualEnd = S.project.timing.lineEnds && S.project.timing.lineEnds[i] != null ? S.project.timing.lineEnds[i] : null;
    const dur = Math.max(0.1, ln.end - ln.start);
    const startTitle = isZh ? `开始（秒）${manualStart ? '·手动' : '·自动'}` : `開始（秒）${manualStart ? '・手動' : '・自動'}`;
    const endTitle = isZh ? `结束（秒）${manualEnd != null ? '·手动' : '·自动'}` : `終了（秒）${manualEnd != null ? '・手動' : '・自動'}`;
    const toText = isZh ? '至' : '〜';
    const stampSTitle = isZh ? '将当前播放头设为本句起点 (快捷键 S)' : '現在の再生位置を開始点にする (S)';
    const stampETitle = isZh ? '将当前播放头设为本句终点 (快捷键 E)' : '現在の再生位置を終了点にする (E)';
    const tapFromTitle = isZh ? '从本句开始打点同步' : 'この行からタップ同期を開始';
    const diceTitle = isZh ? '重新生成该行' : 'この行を再抽選';
    const lockTitle = isZh ? '锁定该行构图' : 'この行の構成をロック';
    const layoutAria = isZh ? '指定排版' : 'レイアウト指定';

    const timeVal = manualEnd != null ? `${ln.start.toFixed(2)}-${manualEnd.toFixed(2)}` : ln.start.toFixed(2);
    const timeTitle = isZh ? '开始秒数。支持填 0.5 或范围 0-3（视频轨独立区间）' : '開始秒。0-3などの区間指定も可能';
    const noTitle = isZh ? '点击从此句开始对齐打点 (预卷2秒)' : 'この行からタップ同期を開始（2秒巻き戻し）';

    li.innerHTML = `<span class="no" title="${noTitle}">${String(i + 1).padStart(2, '0')}</span>
      <input class="time mono" type="text" value="${timeVal}" title="${timeTitle}" aria-label="${i + 1}行目の時間" style="${manualEnd != null ? 'border-color:var(--amber);color:var(--amber)' : manualStart ? 'border-color:var(--cyan)' : ''}">
      <span class="txt" title="${escapeHtml(ln.text)}">${escapeHtml(ln.text)}</span>
      <div class="meta"><span class="cuts"></span>
      <span class="tools">
        <select aria-label="${layoutAria}">${layoutOpts}</select>
        <button class="icon ghost dice" title="${diceTitle}">${ICON.dice}</button>
        <button class="icon ghost lock" title="${lockTitle}" aria-pressed="${o.lock ? 'true' : 'false'}">${ICON.lock}</button>
      </span></div>`;
    li.querySelector('select').value = o.layout || '';
    li.querySelector('.time').addEventListener('change', e => {
      const s = e.target.value.trim();
      const m = s.match(/^(\d+(?:\.\d+)?)\s*[-~至到,，]\s*(\d+(?:\.\d+)?)$/);
      if (!S.project.timing.lineTimes) S.project.timing.lineTimes = {};
      if (!S.project.timing.lineEnds) S.project.timing.lineEnds = {};
      if (m) {
        const t0 = parseFloat(m[1]), t1 = parseFloat(m[2]);
        S.project.timing.lineTimes[i] = Math.max(0, t0);
        S.project.timing.lineEnds[i] = Math.max(t0 + 0.1, t1);
      } else {
        const v = parseFloat(s);
        if (isFinite(v)) {
          S.project.timing.lineTimes[i] = Math.max(0, v);
        } else {
          delete S.project.timing.lineTimes[i];
        }
        delete S.project.timing.lineEnds[i];
      }
      replan();
    });
    li.querySelector('.no').addEventListener('click', () => startTap(i));
    li.querySelector('.txt').addEventListener('click', () => seek(ln.start + 0.001));
    li.querySelector('select').addEventListener('change', e => { setOv(i, { layout: e.target.value || undefined }); replan(); });
    li.querySelector('.dice').addEventListener('click', () => { const cur = ov[i] || {}; setOv(i, { seed: (cur.seed | 0) + 1, lock: false }); replan(); seek(ln.start + 0.001); });
    li.querySelector('.lock').addEventListener('click', () => {
      const cur = ov[i] || {};
      if (cur.lock) setOv(i, { lock: false, lockedSeed: undefined });
      else setOv(i, { lock: true, lockedSeed: ln.seed });
      replan();
    });
    const cutsEl = li.querySelector('.cuts');
    if (manualEnd != null) {
      const sp = document.createElement('span');
      sp.textContent = `${dur.toFixed(1)}s区间`;
      sp.style.borderColor = 'var(--amber)';
      sp.style.color = 'var(--amber)';
      cutsEl.appendChild(sp);
    }
    S.plan.cuts.filter(c => c.line === i && J.LAYOUTS[c.layout] && !J.LAYOUTS[c.layout].special).forEach(c => {
      const sp = document.createElement('span'); sp.textContent = J.techName('layout', c.layout); sp.title = `${c.text}｜${J.techName('enter', c.enter)} → ${J.techName('exit', c.exit)}`;
      sp.style.borderColor = `hsla(${layoutHue(c.layout)},70%,58%,0.7)`;
      sp.addEventListener('click', () => seek(c.start + Math.min(c.dur * 0.5, c.inDur + 0.05)));
      cutsEl.appendChild(sp);
    });
    ol.appendChild(li); S.lineEls.push(li);
  });
  $('linesInfo').textContent = isZh ? `${S.plan.lines.length} 行 / ${S.plan.cuts.length} 镜头` : `${S.plan.lines.length}行 / ${S.plan.cuts.length}カット`;
}
function setOv(i, patch) {
  const cur = Object.assign({}, S.project.overrides[i] || {}, patch);
  for (const k of Object.keys(cur)) if (cur[k] === undefined || cur[k] === false || cur[k] === '') delete cur[k];
  if (Object.keys(cur).length) S.project.overrides[i] = cur; else delete S.project.overrides[i];
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
  const r = J.omakase(S.project);
  Object.assign(S.project, r);
  fontKey = ''; syncUI(); replan(); commit();
  const isZh = J.getLang && J.getLang() === 'zh';
  const moodObj = J.MOODS[r.mood];
  const moodName = moodObj ? (isZh ? moodObj.name_zh || moodObj.name : moodObj.name) : r.mood;
  toast(`${isZh ? '一键生成' : 'おまかせ'}：${J.styleName(r.style)} × ${moodName}`, r.colors.accentOn ? [r.colors.accent, r.colors.ghostA, r.colors.ghostB] : null);
  restartPreview();
}
// change just one aspect of the current look
function rerollPart(part) {
  if (S.exporting || S.tap) return;
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

function startTap(startIndex = 0) {
  if (!S.plan || !S.plan.lines || !S.plan.lines.length) return;
  pause();
  if (!S.project.timing.lineTimes) S.project.timing.lineTimes = {};
  if (!S.project.timing.lineEnds) S.project.timing.lineEnds = {};
  const n = S.plan.lines.length;
  const idx = Math.max(0, Math.min(startIndex, n - 1));
  S.tap = { i: idx, history: [], counting: false };
  $('tapPanel').hidden = false;
  $('btnTap').setAttribute('aria-pressed', 'true');

  let targetT = 0;
  if (idx > 0) {
    const curStart = (S.project.timing.lineTimes[idx] != null) ? S.project.timing.lineTimes[idx] : S.plan.lines[idx].start;
    targetT = Math.max(0, curStart - 2.0);
  }
  seek(targetT);
  updateTap();

  const countInCheck = $('tapCountIn');
  const doCountIn = countInCheck ? countInCheck.checked : true;
  if (doCountIn) {
    runCountIn(() => {
      seek(targetT);
      play();
      updateTap();
      $('tapBtn').focus();
    });
  } else {
    seek(targetT);
    play();
    updateTap();
    $('tapBtn').focus();
  }
}

function tapNow() {
  if (!S.tap || S.tap.counting) return;
  const curT = +S.t.toFixed(3);
  J.playTick(620, 0.05, 0.2);
  const idx = S.tap.i;
  S.tap.history.push({
    i: idx,
    prevStart: S.project.timing.lineTimes[idx],
    prevEnd: S.project.timing.lineEnds ? S.project.timing.lineEnds[idx] : undefined,
  });
  S.project.timing.lineTimes[idx] = curT;
  S.tap.i++;
  if (S.tap.i >= S.plan.lines.length) {
    replan();
    toast((J.getLang && J.getLang() === 'zh') ? '所有歌词打点已完成！' : '全行のタイミング合わせが完了しました！');
    stopTap();
  } else {
    replan();
    updateTap();
    if (S.lineEls[S.tap.i]) S.lineEls[S.tap.i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

function tapUndo() {
  if (!S.tap) return;
  clearTimeout(countInTimer);
  const isZh = J.getLang && J.getLang() === 'zh';

  if (S.tap.history.length > 0) {
    const h = S.tap.history.pop();
    S.tap.i = h.i;
    if (h.prevStart !== undefined) S.project.timing.lineTimes[h.i] = h.prevStart;
    else delete S.project.timing.lineTimes[h.i];
    if (h.prevEnd !== undefined) S.project.timing.lineEnds[h.i] = h.prevEnd;
    else if (S.project.timing.lineEnds) delete S.project.timing.lineEnds[h.i];

    const rewindT = Math.max(0, (S.project.timing.lineTimes[h.i] != null ? S.project.timing.lineTimes[h.i] : S.t) - 2.0);
    seek(rewindT);
    J.playTick(320, 0.08, 0.25);
    replan();
    updateTap();
    toast(isZh ? `已撤回至第 ${h.i + 1} 句，音乐已回退` : `第 ${h.i + 1} 行に戻しました`);
  } else if (S.tap.i > 0) {
    S.tap.i--;
    delete S.project.timing.lineTimes[S.tap.i];
    const rewindT = Math.max(0, (S.project.timing.lineTimes[S.tap.i] || S.t) - 2.0);
    seek(rewindT);
    J.playTick(320, 0.08, 0.25);
    replan();
    updateTap();
    toast(isZh ? `已回退至第 ${S.tap.i + 1} 句` : `第 ${S.tap.i + 1} 行に戻しました`);
  }
}

function stopTap() {
  clearTimeout(countInTimer);
  S.tap = null;
  $('tapPanel').hidden = true;
  $('btnTap').setAttribute('aria-pressed', 'false');
  const isZh = J.getLang && J.getLang() === 'zh';
  const tapBtn = $('tapBtn');
  if (tapBtn) tapBtn.textContent = isZh ? 'TAP 敲击打点 (空格)' : 'TAP 打点 (Space)';
  if (S.tapRate !== 1.0) setTapRate(1.0);
  replan();
}

function updateTap() {
  if (!S.tap) return;
  const n = S.plan.lines.length;
  const i = S.tap.i;
  const curLn = i < n ? S.plan.lines[i] : null;
  const nextLn = i + 1 < n ? S.plan.lines[i + 1] : null;
  const isZh = J.getLang && J.getLang() === 'zh';

  const numEl = $('tapLineNum');
  if (numEl) numEl.textContent = `${String(i + 1).padStart(2, '0')}/${String(n).padStart(2, '0')}`;
  const curEl = $('tapLine');
  if (curEl) curEl.textContent = curLn ? curLn.text : (isZh ? '所有歌词已对齐完毕！' : '全行の同期が完了しました！');
  const nextEl = $('tapNextLine');
  if (nextEl) nextEl.textContent = nextLn ? `${isZh ? '下句' : '次'}: ${nextLn.text}` : '';

  S.lineEls.forEach((el, idx) => el.classList.toggle('cur-tap', idx === i));
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
  const cut = J.cutAt(S.plan, S.t);
  const idx = cut && cut.line >= 0 ? cut.line : (S.tap ? S.tap.i : -1);
  if (idx < 0) return;
  const isZh = J.getLang && J.getLang() === 'zh';
  if (type === 'start') {
    if (!S.project.timing.lineTimes) S.project.timing.lineTimes = {};
    S.project.timing.lineTimes[idx] = +S.t.toFixed(2);
    toast(isZh ? `已将第 ${idx + 1} 句起点设为 ${S.t.toFixed(2)}s (S)` : `${idx + 1}行目の開始点を ${S.t.toFixed(2)}s に設定 (S)`);
  } else {
    if (!S.project.timing.lineEnds) S.project.timing.lineEnds = {};
    const curStart = (S.project.timing.lineTimes && S.project.timing.lineTimes[idx] != null) ? S.project.timing.lineTimes[idx] : S.plan.lines[idx].start;
    S.project.timing.lineEnds[idx] = Math.max(curStart + 0.1, +S.t.toFixed(2));
    toast(isZh ? `已将第 ${idx + 1} 句终点设为 ${S.t.toFixed(2)}s (E)` : `${idx + 1}行目の終了点を ${S.t.toFixed(2)}s に設定 (E)`);
  }
  replan();
}

function nudgeCurrentLine(delta) {
  const cut = J.cutAt(S.plan, S.t);
  const idx = cut && cut.line >= 0 ? cut.line : -1;
  if (idx < 0) return;
  if (!S.project.timing.lineTimes) S.project.timing.lineTimes = {};
  const curStart = (S.project.timing.lineTimes[idx] != null) ? S.project.timing.lineTimes[idx] : S.plan.lines[idx].start;
  const nextStart = Math.max(0, +(curStart + delta).toFixed(2));
  S.project.timing.lineTimes[idx] = nextStart;
  if (S.project.timing.lineEnds && S.project.timing.lineEnds[idx] != null) {
    S.project.timing.lineEnds[idx] = Math.max(nextStart + 0.1, +(S.project.timing.lineEnds[idx] + delta).toFixed(2));
  }
  const isZh = J.getLang && J.getLang() === 'zh';
  toast(isZh ? `第 ${idx + 1} 句微调: ${delta > 0 ? '+' : ''}${delta.toFixed(2)}s → ${nextStart}s` : `第 ${idx + 1} 行を微調整: ${delta > 0 ? '+' : ''}${delta.toFixed(2)}s`);
  replan();
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
    const isZh = J.getLang && J.getLang() === 'zh';
    $('audioName').textContent = isZh ? '正在解析音乐节奏…' : '解析中…';
    try {
      pause();
      S.audio = await J.analyzeAudio(f);
      $('audioName').textContent = `${f.name}（${J.fmtTime(S.audio.duration)} · ${isZh ? '约' : '約'}${S.audio.bpm}BPM）`;
      S.project.timing.snap = true;
      syncUI(); replan();
    } catch (err) { $('audioName').textContent = (isZh ? '无法读取音频: ' : '読み込めませんでした: ') + err.message; S.audio = null; }
  });
  $('btnTap').addEventListener('click', () => (S.tap ? stopTap() : startTap()));
  $('tapBtn').addEventListener('click', tapNow);
  if ($('tapUndo')) $('tapUndo').addEventListener('click', tapUndo);
  $('tapStop').addEventListener('click', () => { pause(); stopTap(); });
  document.querySelectorAll('.tap-spd').forEach(b => b.addEventListener('click', () => setTapRate(parseFloat(b.dataset.spd))));
  $('btnPlay').addEventListener('click', () => (S.playing ? pause() : play()));
  if ($('btnStampS')) $('btnStampS').addEventListener('click', () => stampCurrentLine('start'));
  if ($('btnStampE')) $('btnStampE').addEventListener('click', () => stampCurrentLine('end'));
  $('btnLoop').addEventListener('click', e => { S.loop = !S.loop; e.target.setAttribute('aria-pressed', String(S.loop)); });
  $('btnShuffle').addEventListener('click', () => { remember(); S.project.seed = (Math.random() * 1e9) | 0; $('seed').value = S.project.seed; replan(); commit(); });
  const sc = $('scrub');
  sc.addEventListener('input', () => { S.scrubbing = true; seek(sc.value / 10000 * S.plan.duration); });
  sc.addEventListener('change', () => { S.scrubbing = false; });
  const tl = $('timeline');
  let drag = false;
  tl.addEventListener('pointerdown', e => { drag = true; tl.setPointerCapture(e.pointerId); timelineSeek(e); });
  tl.addEventListener('pointermove', e => { if (drag) timelineSeek(e); });
  tl.addEventListener('pointerup', () => { drag = false; });
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
  if ($('langZh')) $('langZh').addEventListener('click', () => { J.setLang('zh'); updateUILanguage(); replan(); });
  if ($('langJa')) $('langJa').addEventListener('click', () => { J.setLang('ja'); updateUILanguage(); replan(); });
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
    try { S.project = mergeProject(JSON.parse(await f.text())); syncUI(); replan(); }
    catch (err) { showMsg((J.getLang && J.getLang() === 'zh') ? '无法读取工程文件' : 'プロジェクトを読み込めませんでした'); setTimeout(() => showMsg(null), 2500); }
    e.target.value = '';
  });
  document.addEventListener('keydown', e => {
    const tag = (e.target && e.target.tagName) || '';
    const typing = /INPUT|TEXTAREA|SELECT/.test(tag) && e.target.type !== 'range' && e.target.type !== 'checkbox';
    if (S.tap) {
      if ((e.code === 'Space' || e.code === 'Enter') && !typing) { e.preventDefault(); tapNow(); return; }
      if ((e.code === 'Backspace' || ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ')) && !typing) { e.preventDefault(); tapUndo(); return; }
      if (e.code === 'Escape') { e.preventDefault(); pause(); stopTap(); return; }
    }
    if (typing) return;
    if (e.code === 'Space') { e.preventDefault(); S.playing ? pause() : play(); }
    else if (e.code === 'ArrowRight') seek(S.t + (e.shiftKey ? 1 : 1 / S.plan.fps));
    else if (e.code === 'ArrowLeft') seek(S.t - (e.shiftKey ? 1 : 1 / S.plan.fps));
    else if (e.code === 'KeyS' && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); stampCurrentLine('start'); }
    else if (e.code === 'KeyE' && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); stampCurrentLine('end'); }
    else if (e.code === 'BracketLeft') { e.preventDefault(); nudgeCurrentLine(-0.05); }
    else if (e.code === 'BracketRight') { e.preventDefault(); nudgeCurrentLine(0.05); }
    else if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.code === 'KeyZ') { e.preventDefault(); histGo(-1); }
    else if ((e.ctrlKey || e.metaKey) && (e.code === 'KeyY' || (e.shiftKey && e.code === 'KeyZ'))) { e.preventDefault(); histGo(1); }
    else if (e.code === 'KeyR' && !e.metaKey && !e.ctrlKey && !e.altKey && !S.exporting) { e.preventDefault(); omakase(); }
  });
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
  renderFontRoles();
  renderColors();
  renderFx();
  renderTech();
  drawStyleGrid();
  showNow();
  updateCutInfo(true);
  codecNote();
  renderLines();
}

/* ---------------- boot ---------------- */
function boot() {
  S.project = loadLocal();
  bind(); syncUI(); replan(); updateUILanguage();
  let mode = 'easy'; try { mode = localStorage.getItem('jizura.mode') || 'easy'; } catch (e) {}
  setMode(mode); commit();
  // open on a representative frame (end of the first cut's entrance)
  const c0 = (S.plan && S.plan.cuts) ? S.plan.cuts.find(c => c.line >= 0) : null;
  if (c0) seek(c0.start + Math.min(c0.dur * 0.6, c0.inDur + 0.25));
  requestAnimationFrame(tick);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
J.ui = S;
})();
