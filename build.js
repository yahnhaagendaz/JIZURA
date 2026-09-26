const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf-8');

const srcFiles = fs.readdirSync(path.join(ROOT, 'src'))
  .filter(f => f.endsWith('.js'))
  .sort();

console.log(`Packing ${srcFiles.length} source files...`);
const js = srcFiles.map(f => read(path.join('src', f))).join('\n');
const mux = '/*! mp4-muxer v5.2.2 | MIT License | (c) 2023 Vanilagy | see THIRD_PARTY_NOTICES.md */\n' + read('vendor/mp4-muxer.min.js');

const fonts = ('https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Noto+Sans+JP:wght@300;500;700;900&family=Noto+Serif+JP:wght@300;500;700' +
  '&family=Zen+Kaku+Gothic+New:wght@900&family=Zen+Old+Mincho:wght@900&family=Kaisei+Tokumin:wght@800&family=M+PLUS+Rounded+1c:wght@800' +
  '&family=Mochiy+Pop+One&family=DotGothic16&family=Yuji+Syuku&family=IBM+Plex+Mono:wght@500;600&family=IBM+Plex+Sans+JP:wght@400;500;700' +
  '&family=Noto+Sans+SC:wght@300;500;700;900&family=Noto+Serif+SC:wght@300;500;700;900' +
  '&family=ZCOOL+KuaiLe&family=ZCOOL+XiaoWei&family=ZCOOL+QingKe+HuangYou&family=Ma+Shan+Zheng&family=Long+Cang&display=swap');

const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>JIZURA 字面</title>
<meta name="description" content="歌詞を入れると文字PV（リリックモーション）を自動で組み立てて MP4 に書き出すブラウザアプリ">
<link rel="canonical" href="https://852wa.github.io/JIZURA/">
<meta property="og:type" content="website">
<meta property="og:title" content="JIZURA 字面 — 文字PV自動構成ツール">
<meta property="og:description" content="歌詞を入れると文字PV（リリックモーション）を自動で組み立てて MP4 に書き出すブラウザアプリ">
<meta property="og:url" content="https://852wa.github.io/JIZURA/">
<meta name="twitter:card" content="summary">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fonts}">
<style>
${read('app/style.css')}
</style>
</head>
<body>
${read('app/body.html')}
<script>
${mux}
</script>
<script>
${js}
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, 'index.html'), html, 'utf-8');
console.log('Build completed! index.html written:', Buffer.byteLength(html, 'utf-8'), 'bytes');
