/* ============================================================
   JIZURA — fonts: catalogue, loading, glyph decomposition
   ============================================================ */
(() => {
'use strict';

const JP_SANS_FB = '"Noto Sans JP","Noto Sans CJK JP","Hiragino Sans","Yu Gothic","Meiryo",sans-serif';
const JP_SERIF_FB = '"Noto Serif JP","Noto Serif CJK JP","Hiragino Mincho ProN","Yu Mincho",serif';
const CN_SANS_FB = '"Noto Sans SC","PingFang SC","Microsoft YaHei","Hiragino Sans GB","SimHei",sans-serif';
const CN_SERIF_FB = '"Noto Serif SC","Songti SC","SimSun","STSong","FangSong",serif';

/* role catalogue: key -> {label, family, weight, kind, lang, tags, fb} */
J.FONTS = {
  // Japanese Fonts
  gothic_black:  { label: 'Noto Sans JP Black',        family: '"Noto Sans JP"', weight: 900, kind: 'gothic', lang: 'jp', tags: ['noto', 'sans', 'gothic', 'black', 'heavy', '黑体', '粗体', '无衬线', '日文'], fb: JP_SANS_FB },
  gothic_bold:   { label: 'Noto Sans JP Bold',         family: '"Noto Sans JP"', weight: 700, kind: 'gothic', lang: 'jp', tags: ['noto', 'sans', 'gothic', 'bold', '黑体', '中粗', '日文'], fb: JP_SANS_FB },
  gothic_med:    { label: 'Noto Sans JP Medium',       family: '"Noto Sans JP"', weight: 500, kind: 'gothic', lang: 'jp', tags: ['noto', 'sans', 'gothic', 'medium', '黑体', '常规', '日文'], fb: JP_SANS_FB },
  gothic_light:  { label: 'Noto Sans JP Light',        family: '"Noto Sans JP"', weight: 300, kind: 'gothic', lang: 'jp', tags: ['noto', 'sans', 'gothic', 'light', '细黑', '纤细', '日文'], fb: JP_SANS_FB },
  dela:          { label: 'Dela Gothic One',           family: '"Dela Gothic One"', weight: 400, kind: 'display', lang: 'jp', tags: ['dela', 'gothic', 'one', 'headline', '超粗', '标题', '日漫', '冲击力', '扁黑'], fb: JP_SANS_FB },
  zenkaku:       { label: 'Zen Kaku Gothic New Black', family: '"Zen Kaku Gothic New"', weight: 900, kind: 'gothic', lang: 'jp', tags: ['zen', 'kaku', 'gothic', 'new', 'black', '黑体', '角黑', '现代'], fb: JP_SANS_FB },
  mincho_black:  { label: 'Zen Old Mincho Black',      family: '"Zen Old Mincho"', weight: 900, kind: 'mincho', lang: 'jp', tags: ['zen', 'old', 'mincho', 'black', '古风', '老明朝', '宋体', '粗衬线', '日文'], fb: JP_SERIF_FB },
  mincho_bold:   { label: 'Noto Serif JP Bold',        family: '"Noto Serif JP"', weight: 700, kind: 'mincho', lang: 'jp', tags: ['noto', 'serif', 'mincho', 'bold', '宋体', '明朝', '衬线', '粗体'], fb: JP_SERIF_FB },
  mincho:        { label: 'Noto Serif JP Medium',      family: '"Noto Serif JP"', weight: 500, kind: 'mincho', lang: 'jp', tags: ['noto', 'serif', 'mincho', 'medium', '宋体', '明朝', '标准衬线'], fb: JP_SERIF_FB },
  mincho_light:  { label: 'Noto Serif JP Light',       family: '"Noto Serif JP"', weight: 300, kind: 'mincho', lang: 'jp', tags: ['noto', 'serif', 'mincho', 'light', '细宋', '细明朝', '优雅'], fb: JP_SERIF_FB },
  tokumin:       { label: 'Kaisei Tokumin',            family: '"Kaisei Tokumin"', weight: 800, kind: 'mincho', lang: 'jp', tags: ['kaisei', 'tokumin', '特割', '解星', '宋体', '传统', '典雅'], fb: JP_SERIF_FB },
  round:         { label: 'M PLUS Rounded 1c',         family: '"M PLUS Rounded 1c"', weight: 800, kind: 'round', lang: 'jp', tags: ['mplus', 'rounded', '圆体', '柔和', '可爱', '二次元'], fb: JP_SANS_FB },
  pop:           { label: 'Mochiy Pop One',            family: '"Mochiy Pop One"', weight: 400, kind: 'display', lang: 'jp', tags: ['mochiy', 'pop', 'one', '可爱', '手绘', '萌系', '漫画', '波普'], fb: JP_SANS_FB },
  dot:           { label: 'DotGothic16',               family: '"DotGothic16"', weight: 400, kind: 'pixel', lang: 'jp', tags: ['dot', 'pixel', '8bit', '16bit', '像素', '点阵', '复古', '游戏', '电子'], fb: JP_SANS_FB },
  brush:         { label: 'Yuji Syuku',                family: '"Yuji Syuku"', weight: 400, kind: 'brush', lang: 'jp', tags: ['yuji', 'syuku', '毛笔', '书法', '手写', '国风', '墨迹', '和风'], fb: JP_SERIF_FB },
  mono:          { label: 'IBM Plex Mono',             family: '"IBM Plex Mono"', weight: 500, kind: 'mono', lang: 'all', tags: ['ibm', 'plex', 'mono', '等宽', '代码', '终端', '工业', '科技'], fb: '"IBM Plex Sans JP",' + JP_SANS_FB },
  sansui:        { label: 'IBM Plex Sans JP',          family: '"IBM Plex Sans JP"', weight: 500, kind: 'gothic', lang: 'jp', tags: ['ibm', 'plex', 'sans', '黑体', '现代', '理性'], fb: JP_SANS_FB },

  // Chinese Fonts (简体中文 / 常用商用开源字体)
  sc_gothic_black: { label: '思源黑体 Heavy (SC)',      family: '"Noto Sans SC"', weight: 900, kind: 'gothic', lang: 'sc', tags: ['noto', 'sans', 'sc', 'chinese', '思源', '黑体', '特粗', '简中', '粗黑'], fb: CN_SANS_FB },
  sc_gothic_bold:  { label: '思源黑体 Bold (SC)',       family: '"Noto Sans SC"', weight: 700, kind: 'gothic', lang: 'sc', tags: ['noto', 'sans', 'sc', 'chinese', '思源', '黑体', '粗体', '简中'], fb: CN_SANS_FB },
  sc_gothic_med:   { label: '思源黑体 Medium (SC)',     family: '"Noto Sans SC"', weight: 500, kind: 'gothic', lang: 'sc', tags: ['noto', 'sans', 'sc', 'chinese', '思源', '黑体', '常规', '简中'], fb: CN_SANS_FB },
  sc_gothic_light: { label: '思源黑体 Light (SC)',      family: '"Noto Sans SC"', weight: 300, kind: 'gothic', lang: 'sc', tags: ['noto', 'sans', 'sc', 'chinese', '思源', '黑体', '细黑', '简中'], fb: CN_SANS_FB },
  sc_serif_black:  { label: '思源宋体 Black (SC)',      family: '"Noto Serif SC"', weight: 900, kind: 'mincho', lang: 'sc', tags: ['noto', 'serif', 'sc', 'chinese', '思源', '宋体', '特粗', '衬线', '简中'], fb: CN_SERIF_FB },
  sc_serif_bold:   { label: '思源宋体 Bold (SC)',       family: '"Noto Serif SC"', weight: 700, kind: 'mincho', lang: 'sc', tags: ['noto', 'serif', 'sc', 'chinese', '思源', '宋体', '粗宋', '衬线', '简中'], fb: CN_SERIF_FB },
  sc_serif_med:    { label: '思源宋体 Medium (SC)',     family: '"Noto Serif SC"', weight: 500, kind: 'mincho', lang: 'sc', tags: ['noto', 'serif', 'sc', 'chinese', '思源', '宋体', '中宋', '标准', '简中'], fb: CN_SERIF_FB },
  zcool_kuaile:    { label: '站酷快乐体 (SC Display)',  family: '"ZCOOL KuaiLe"', weight: 400, kind: 'display', lang: 'sc', tags: ['zcool', 'kuaile', '站酷', '快乐体', '可爱', '卡通', '圆润', '简中'], fb: CN_SANS_FB },
  zcool_xiaowei:   { label: '站酷小薇体 (SC Serif)',    family: '"ZCOOL XiaoWei"', weight: 400, kind: 'mincho', lang: 'sc', tags: ['zcool', 'xiaowei', '站酷', '小薇体', '文艺', '手绘', '宋体', '简中'], fb: CN_SERIF_FB },
  zcool_qingke:    { label: '站酷庆科黄油体 (SC)',      family: '"ZCOOL QingKe HuangYou"', weight: 400, kind: 'display', lang: 'sc', tags: ['zcool', 'qingke', 'huangyou', '站酷', '庆科', '黄油体', '复古', '圆角', '简中'], fb: CN_SANS_FB },
  mashanzheng:     { label: '马善政毛笔楷书 (SC Brush)',family: '"Ma Shan Zheng"', weight: 400, kind: 'brush', lang: 'sc', tags: ['mashanzheng', 'brush', 'calligraphy', '马善政', '毛笔', '楷书', '国风', '古风', '简中'], fb: CN_SERIF_FB },
  longcang:        { label: '龙藏行草体 (SC Brush)',    family: '"Long Cang"', weight: 400, kind: 'brush', lang: 'sc', tags: ['longcang', 'brush', 'calligraphy', '龙藏', '行草', '草书', '毛笔', '狂放', '国风', '简中'], fb: CN_SERIF_FB },
};
J.GOOGLE_FONTS_URL = 'https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Noto+Sans+JP:wght@300;500;700;900&family=Noto+Serif+JP:wght@300;500;700&family=Zen+Kaku+Gothic+New:wght@900&family=Zen+Old+Mincho:wght@900&family=Kaisei+Tokumin:wght@800&family=M+PLUS+Rounded+1c:wght@800&family=Mochiy+Pop+One&family=DotGothic16&family=Yuji+Syuku&family=IBM+Plex+Mono:wght@500;600&family=IBM+Plex+Sans+JP:wght@400;500;700&family=Noto+Sans+SC:wght@300;500;700;900&family=Noto+Serif+SC:wght@300;500;700;900&family=ZCOOL+KuaiLe&family=ZCOOL+XiaoWei&family=ZCOOL+QingKe+HuangYou&family=Ma+Shan+Zheng&family=Long+Cang&display=swap';

/* font searching & filtering helper */
J.searchFonts = (query = '', category = 'all', lang = 'all') => {
  const q = String(query || '').trim().toLowerCase();
  const entries = Object.entries(J.FONTS);
  return entries.filter(([k, f]) => {
    // Category filter
    if (category && category !== 'all') {
      if (category === 'custom') {
        if (!f.user && f.kind !== 'custom') return false;
      } else if (f.kind !== category) {
        return false;
      }
    }
    // Language filter
    if (lang && lang !== 'all') {
      if (lang === 'sc' && f.lang === 'jp') return false;
      if (lang === 'jp' && f.lang === 'sc') return false;
    }
    // Search query
    if (q) {
      const matchKey = k.toLowerCase().includes(q);
      const matchLabel = f.label.toLowerCase().includes(q);
      const matchFamily = f.family.toLowerCase().includes(q);
      const matchKind = (f.kind || '').toLowerCase().includes(q);
      const matchTags = Array.isArray(f.tags) && f.tags.some(t => t.toLowerCase().includes(q));
      if (!matchKey && !matchLabel && !matchFamily && !matchKind && !matchTags) {
        return false;
      }
    }
    return true;
  }).map(([k, f]) => Object.assign({ key: k }, f));
};

/* test if local PC font is accessible in browser */
J.testLocalFont = (family) => {
  if (!family || typeof document === 'undefined') return false;
  try {
    const fam = family.replace(/["']/g, '').trim();
    if (!fam) return false;
    if (document.fonts && document.fonts.check && document.fonts.check(`16px "${fam}"`)) return true;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const testText = 'abcdefghijklmnopqrstuvwxyz0123456789爱字面';
    ctx.font = '72px monospace';
    const monoW = ctx.measureText(testText).width;
    ctx.font = `72px "${fam}", monospace`;
    const fontW = ctx.measureText(testText).width;
    return Math.abs(monoW - fontW) > 0.5;
  } catch (e) {
    return true;
  }
};

/* user fonts (local family names or uploaded files) */
J.addUserFont = (key, label, family, weight = 400, kind = 'custom') => {
  J.FONTS[key] = { label, family: `"${family.replace(/"/g, '')}"`, weight, kind, lang: 'all', tags: [family, label, 'custom', '本地', '用户'], fb: JP_SANS_FB, user: true };
  J.glyphs.clear();
};
J.loadFontFile = async (file) => {
  const buf = await file.arrayBuffer();
  const fam = 'UF_' + file.name.replace(/\.[^.]+$/, '').replace(/[^\w]/g, '_');
  const ff = new FontFace(fam, buf);
  await ff.load(); document.fonts.add(ff);
  const key = 'user_' + fam;
  J.addUserFont(key, file.name.replace(/\.[^.]+$/, ''), fam, 400, 'custom');
  return key;
};

J.fontCSS = (key, px) => {
  const f = J.FONTS[key] || J.FONTS.gothic_bold;
  return `${f.weight} ${px.toFixed(2)}px ${f.family},${f.fb}`;
};

/* make sure the glyphs we need are loaded (Google Fonts are unicode-range split) */
J.ensureFonts = async (text, keys) => {
  if (!document.fonts || !document.fonts.load) return;
  const uniq = [...new Set([...text])].join('') || 'あ';
  const jobs = [];
  for (const k of keys || Object.keys(J.FONTS)) {
    const f = J.FONTS[k]; if (!f) continue;
    jobs.push(document.fonts.load(`${f.weight} 64px ${f.family}`, uniq).catch(() => null));
  }
  await Promise.all(jobs);
  if (document.fonts.ready) await document.fonts.ready;
  J.glyphs.clear();
  J.metrics.clear();
};

/* ---------- metrics (advance widths) ---------- */
const _mc = document.createElement('canvas').getContext('2d');
J.metrics = {
  m: new Map(),
  clear() { this.m.clear(); },
  adv(fontKey, ch) {               // advance in em
    const k = fontKey + '\u0000' + ch;
    let v = this.m.get(k);
    if (v === undefined) {
      _mc.font = J.fontCSS(fontKey, 100);
      v = _mc.measureText(ch).width / 100;
      if (!(v > 0)) v = ch === ' ' ? 0.3 : 1;
      this.m.set(k, v);
    }
    return v;
  },
};

/* ---------- glyph decomposition (raster connected components) ----------
   A glyph is rasterised once per (font, char, resolution bucket); its alpha
   mask is split into connected pieces (strokes / radicals / dots) so that
   each can be flown, shattered or dropped independently. Works with any
   font the browser can render, including local and uploaded ones.        */
class GlyphCache {
  constructor() { this.map = new Map(); this.tint = new Map(); this.count = 0; this.maxRes = 512; }
  clear() { this.map.clear(); this.tint.clear(); }
  bucket(px) { let r = 64; while (r < px && r < this.maxRes) r *= 2; return r; }
  get(fontKey, ch, px) {
    const res = this.bucket(px);
    const key = fontKey + '|' + ch + '|' + res;
    let g = this.map.get(key);
    if (!g) { g = decompose(fontKey, ch, res); this.map.set(key, g); if (this.map.size > 1800) this.evict(); }
    return g;
  }
  evict() { let n = 0; for (const k of this.map.keys()) { this.map.delete(k); if (++n > 600) break; } this.tint.clear(); }
  sprite(piece, color) {              // tinted copy of a white piece sprite
    if (color === '#ffffff' || color === '#fff') return piece.cv;
    let m = this.tint.get(piece.id);
    if (!m) { m = new Map(); this.tint.set(piece.id, m); }
    let c = m.get(color);
    if (!c) {
      c = document.createElement('canvas'); c.width = piece.cv.width; c.height = piece.cv.height;
      const x = c.getContext('2d'); x.drawImage(piece.cv, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height);
      m.set(color, c);
    }
    return c;
  }
}
J.glyphs = new GlyphCache();
let _pid = 0;

function decompose(fontKey, ch, res) {
  const S = Math.ceil(res * 1.45), half = S / 2;
  const cv = document.createElement('canvas'); cv.width = S; cv.height = S;
  const x = cv.getContext('2d', { willReadFrequently: true });
  x.font = J.fontCSS(fontKey, res); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff';
  x.fillText(ch, half, half);
  const img = x.getImageData(0, 0, S, S).data;
  const N = S * S, A = new Uint8Array(N);
  for (let i = 0; i < N; i++) A[i] = img[i * 4 + 3];
  const L = new Int32Array(N), TH = 60;
  const stack = new Int32Array(N);
  let nl = 0; const boxes = [];
  for (let i = 0; i < N; i++) {
    if (A[i] < TH || L[i]) continue;
    nl++; let sp = 0; stack[sp++] = i; L[i] = nl;
    let x0 = S, y0 = S, x1 = 0, y1 = 0, area = 0;
    while (sp) {
      const p = stack[--sp], px = p % S, py = (p / S) | 0; area++;
      if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py;
      for (let dy = -1; dy <= 1; dy++) {
        const yy = py + dy; if (yy < 0 || yy >= S) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const xx = px + dx; if (xx < 0 || xx >= S) continue;
          const q = yy * S + xx;
          if (!L[q] && A[q] >= TH) { L[q] = nl; stack[sp++] = q; }
        }
      }
    }
    boxes[nl] = { x0, y0, x1, y1, area };
  }
  // attach anti-aliased fringe pixels to neighbouring labels (two dilation passes)
  for (let pass = 0; pass < 2; pass++) {
    const L2 = L.slice();
    for (let p = 0; p < N; p++) {
      if (L[p] || !A[p]) continue;
      const px = p % S, py = (p / S) | 0;
      let lab = 0;
      if (px > 0 && L[p - 1]) lab = L[p - 1]; else if (px < S - 1 && L[p + 1]) lab = L[p + 1];
      else if (py > 0 && L[p - S]) lab = L[p - S]; else if (py < S - 1 && L[p + S]) lab = L[p + S];
      if (lab) { L2[p] = lab; const b = boxes[lab]; if (px < b.x0) b.x0 = px; if (px > b.x1) b.x1 = px; if (py < b.y0) b.y0 = py; if (py > b.y1) b.y1 = py; }
    }
    L.set(L2);
  }
  // merge specks into nearest bigger piece
  const minA = res * res * 0.0012;
  const remap = new Int32Array(nl + 1);
  for (let l = 1; l <= nl; l++) remap[l] = l;
  for (let l = 1; l <= nl; l++) {
    const b = boxes[l]; if (b.area >= minA) continue;
    let best = 0, bd = 1e9; const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
    for (let m = 1; m <= nl; m++) {
      if (m === l || boxes[m].area < minA) continue;
      const o = boxes[m]; const dx = Math.max(o.x0 - cx, 0, cx - o.x1), dy = Math.max(o.y0 - cy, 0, cy - o.y1);
      const d = dx * dx + dy * dy; if (d < bd) { bd = d; best = m; }
    }
    if (best) { remap[l] = best; const o = boxes[best]; o.x0 = Math.min(o.x0, b.x0); o.y0 = Math.min(o.y0, b.y0); o.x1 = Math.max(o.x1, b.x1); o.y1 = Math.max(o.y1, b.y1); }
  }
  const pieces = [];
  for (let l = 1; l <= nl; l++) {
    if (remap[l] !== l) continue;
    const b = boxes[l]; const w = b.x1 - b.x0 + 1, h = b.y1 - b.y0 + 1;
    const pc = document.createElement('canvas'); pc.width = w; pc.height = h;
    const px = pc.getContext('2d'); const id = px.createImageData(w, h); const d = id.data;
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
      const p = (b.y0 + yy) * S + (b.x0 + xx);
      if (remap[L[p]] === l && L[p]) { const o = (yy * w + xx) * 4; d[o] = d[o + 1] = d[o + 2] = 255; d[o + 3] = A[p]; }
    }
    px.putImageData(id, 0, 0);
    pieces.push({
      id: ++_pid, cv: pc, res,
      // centre & size in em units, relative to glyph centre
      cx: ((b.x0 + b.x1 + 1) / 2 - half) / res, cy: ((b.y0 + b.y1 + 1) / 2 - half) / res,
      w: w / res, h: h / res, area: b.area / (res * res),
      frags: null,
    });
  }
  pieces.sort((a, b) => b.area - a.area);
  return { ch, res, pieces };
}

/* split a piece into up to 3 convex fragments (for shatter) — local em coords around piece centre */
J.fragments = (pc, seed) => {
  if (pc.frags) return pc.frags;
  const w = pc.w, h = pc.h;
  let polys = [[[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]];
  const cuts = Math.max(pc.w, pc.h) > 0.42 ? 2 : Math.max(pc.w, pc.h) > 0.2 ? 1 : 0;
  for (let c = 0; c < cuts; c++) {
    const next = [];
    for (const poly of polys) {
      const ang = (w > h ? Math.PI / 2 : 0) + J.rs(seed, pc.id, c) * 0.5;
      const nx = Math.cos(ang), ny = Math.sin(ang);
      const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length, cy = poly.reduce((s, p) => s + p[1], 0) / poly.length;
      const off = J.rs(seed, pc.id, c, 7) * 0.12 * Math.max(w, h);
      const d0 = nx * cx + ny * cy + off;
      next.push(clipHalf(poly, nx, ny, d0, 1), clipHalf(poly, nx, ny, d0, -1));
    }
    polys = next.filter(p => p.length >= 3);
  }
  pc.frags = polys.map(p => {
    const cx = p.reduce((s, q) => s + q[0], 0) / p.length, cy = p.reduce((s, q) => s + q[1], 0) / p.length;
    return { poly: p, cx, cy };
  });
  return pc.frags;
};
function clipHalf(poly, nx, ny, d0, sgn) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const da = sgn * (nx * a[0] + ny * a[1] - d0), db = sgn * (nx * b[0] + ny * b[1] - d0);
    if (da >= 0) out.push(a);
    if ((da >= 0) !== (db >= 0)) { const t = da / (da - db); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
  }
  return out;
}
})();
