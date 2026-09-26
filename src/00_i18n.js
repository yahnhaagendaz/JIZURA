/* ============================================================
   JIZURA — i18n: 中日双语国际化词典与语言管理
   ============================================================ */
(() => {
'use strict';
const J = (window.J = window.J || {});

const DICT = {
  zh: {
    // 顶部栏
    brand_tag: '文字PV动力学引擎',
    song_title_ph: '歌曲名称（显示于标题卡与HUD）',
    song_artist_ph: '歌手 / 创作者',
    mode_easy: '极简',
    mode_easy_title: '以一键生成为主的清爽界面',
    mode_pro: '详细',
    mode_pro_title: '展开全部详细调节参数',
    btn_open: '打开',
    btn_open_title: '读取已保存的工程文件 (.json)',
    btn_save: '保存',
    btn_save_title: '将当前工程保存为 .json',
    btn_ae: '导出AE脚本',
    btn_ae_title: '导出供 After Effects 面板还原工程的结构数据',

    // 左侧：歌词与节奏
    sec_lyrics: '歌词文本',
    btn_syntax: '语法标记',
    btn_sample_zh: '中文示例',
    btn_sample_ja: '日文示例',
    lyrics_ph: '歌词（一行为一个分句/镜头）',
    syntax_1: '一行为一个分句。空行会自动保留短暂间隔',
    syntax_2: '夜空中最亮的星/是否听清 … 用 / 明确划分镜头切片',
    syntax_3: '*重点词* … 强调（更大、更强视觉冲击力）',
    syntax_4: '行末加 ! … 触发白闪与震颤冲屏',
    syntax_5: '歌词|注解小字 … 注解布局的小字文本',
    syntax_6: '[01:23.45]歌词 … 兼容标准 LRC 时间戳',
    syntax_7: '# 开头的行 … 注释（忽略不显示）',

    sec_audio: '音乐与节奏卡点',
    audio_empty: '未加载音乐（导入音乐后将自动检测BPM强拍并卡点）',
    btn_load_audio: '导入音频',
    btn_load_audio_title: '支持 mp3 / wav / m4a / ogg / flac 等格式',
    btn_tap: '打点同步',
    btn_tap_title: '播放音乐并随节拍按空格记录各行起点',
    bpm_label: 'BPM',
    bpm_ph: '自动检测',
    offset_label: '起始延时(秒)',
    line_scale_label: '单句时长倍率',
    snap_label: '吸附到节拍',
    btn_reset_times: '清除手动时间',
    tap_hint: '跟随音乐节奏，在每句歌词开始的瞬间按下 <span class="kbd">空格键 (Space)</span> 或下方 TAP 按钮。',
    tap_next: '下一句: ',
    btn_tap_stop: '完成并结束',
    tap_undo: '↶ 撤销上一句 (Backspace)',
    tap_undo_title: '退回上一句重新打点并自动回退音频2.5秒',
    tap_countin: '预备拍',
    tap_speed_label: '打点倍速:',
    btn_tap_from: '从该句开始打点',
    time_start_tip: '开始（秒）',
    time_end_tip: '结束（秒）·留空自动衔接',
    time_to: '至',
    stamp_start_tip: '将当前播放头设为本句起点 (快捷键 S)',
    stamp_end_tip: '将当前播放头设为本句终点 (快捷键 E)',
    toast_tap_undone: '已回退到上一句，音乐已就绪，请继续打点',
    syntax_8: '[00:01.00-00:04.50]歌词 … 指定独立起止区间（支持静止留白）',

    sec_lines: '分句与镜头列表',
    time_manual_tip: '开始（秒）・手动设定',
    time_auto_tip: '开始（秒）・自动计算',
    opt_auto_layout: '自动布局',
    btn_dice_tip: '重新生成该行',
    btn_lock_tip: '锁定该行构图与动效',

    // 中间：播放与舞台
    btn_play: '播放',
    btn_pause: '暂停',
    btn_loop: '循环',
    btn_prev_tip: '返回上一套方案',
    btn_next_tip: '前进到下一套方案',
    btn_shuffle: '重组镜头',
    btn_shuffle_title: '保持当前风格，重新打乱排版与动画组合（锁定的行保持不变）',
    btn_omakase: '一键生成',
    btn_omakase_title: '全量随机：视觉风格、氛围、运镜与配色（快捷键 R）',
    no_cut_at_time: '当前播放时刻暂无镜头',
    chip_layout: '构图',
    chip_enter: '入场',
    chip_hold: '驻留',
    chip_exit: '退场',
    chip_decor: '装饰',
    chip_treat: '质感',
    chip_bg: '背景',
    chip_cam: '运镜',

    // 右侧极简模式
    omakase_big: '一键生成 (R)',
    omakase_desc: '每次点击，全片风格、氛围、运镜、配色与构图全部重新组合。键盘按 <span class="kbd">R</span> 亦可触发。',
    btn_prev2: '◀ 上一方案',
    btn_next2: '下一方案 ▶',
    easy_now_title: '当前配置',
    easy_tweak_title: '局部微调',
    btn_e_style: '换风格',
    btn_e_style_title: '仅更换全局视觉风格',
    btn_e_palette: '换配色',
    btn_e_palette_title: '仅随机重掷点缀色与色散色彩',
    btn_e_mood: '换氛围',
    btn_e_mood_title: '仅更换运动力度、故障率与表现手法',
    btn_e_cut: '换构图',
    btn_e_cut_title: '仅重新编排排版与出入场组合',
    easy_export_title: '快速导出',
    aspect_label: '画面比例',
    res_label: '分辨率',
    fps_label: '帧率 (FPS)',
    btn_mp4: '导出 MP4 视频',
    btn_cancel_export: '取消导出',

    // 右侧详细标签页
    tab_style: '视觉风格',
    tab_fx: '动效调优',
    tab_tech: '表现手法',
    tab_out: '渲染导出',

    // 风格选项卡
    font_roles_title: '核心字体指定',
    font_role_display: '核心大标题',
    font_role_serif: '宋体 / 衬线体',
    font_role_body: '正文与注脚小字',
    font_opt_default: '跟随风格默认',
    local_font_ph: '本地电脑字体名（如：思源黑体、微软雅黑、站酷快乐体）',
    btn_add_font: '添加字体',
    btn_load_font_file: '上传字体文件 (.ttf / .otf / .woff2)',
    accent_override_title: '自定义点缀色与色散通道',
    accent_override: '自定义色彩覆盖',
    accent_override_sub: '应用于全片分镜，自动根据背景明度矫正高可读性',
    btn_rand_palette: '随机互补配色',
    base_color_override_title: '自定义背景底色与文字主色',
    base_color_override: '自定义主背景与文字色',
    color_bg: '背景',
    color_fg: '文字',
    color_sub: '辅助',
    color_accent: '主点缀色 (Accent)',
    color_ghostA: '色散通道A (高光偏色)',
    color_ghostB: '色散通道B (阴影偏色)',

    // 动效选项卡
    slider_motion: '运动幅度',
    slider_glitch: '故障强度',
    slider_chroma: '色散偏离',
    slider_decor: '装饰密度',
    slider_density: '镜头节奏',
    slider_texture: '胶片/纸质',
    fx_flash_label: '冲击白闪',
    fx_koma_label: '手绘抽帧',
    koma_full: '全帧率流畅 (跟随输出FPS)',
    koma_12: '一拍二 (12格/秒・日漫定格感)',
    koma_8: '一拍三 (8格/秒・强定格感)',
    hud_label: 'HUD信息视窗',
    hud_auto: '由风格决定',
    hud_on: '始终开启',
    hud_off: '关闭隐藏',
    seed_label: '随机种子',
    btn_new_seed: '新种子',
    seed_note: '相同种子将保证镜头构图 100% 确定性重现。行级别的重新生成与锁定可在左侧列表配置。',

    // 手法选项卡 (356)
    tech_filter_ph: '按名称搜索过滤表现手法',
    btn_all_on: '全部开启',
    btn_all_off: '全部关闭',
    btn_invert: '反选',

    // 导出选项卡
    quality_label: '画质码率',
    quality_std: '标准',
    quality_high: '高品质 (推荐)',
    quality_max: '超高纯净',
    out_audio_label: '将音乐音轨封装进视频',
    btn_png_zip: '导出 PNG 序列帧 (ZIP)',
    btn_pnga_zip: '导出透明通道 PNG 序列帧 (ZIP・用于覆层合成)',
    codec_note: '基于浏览器内置 WebCodecs 显卡硬件加速直接导出，速度极快（推荐使用 Chrome 或 Edge）。',

    // 提示信息
    toast_copied: '已复制到剪贴板',
    toast_saved: '工程文件已成功下载保存',
    toast_ae_exported: 'AE 配置文件已成功导出',
    loading_fonts: '正在预加载字形数据…',
    encoding_audio: '正在编码封装音频轨道…',
    export_complete: '导出完毕！',
    export_cancelled: '已取消导出',
  },

  ja: {
    brand_tag: 'lyric motion engine',
    song_title_ph: '曲名（タイトルカード・HUDに表示）',
    song_artist_ph: 'アーティスト',
    mode_easy: 'かんたん',
    mode_easy_title: 'おまかせボタン中心のシンプルな画面',
    mode_pro: '詳細',
    mode_pro_title: 'すべての設定を表示',
    btn_open: '開く',
    btn_open_title: '保存したプロジェクト(.json)を開く',
    btn_save: '保存',
    btn_save_title: 'プロジェクトを .json で保存',
    btn_ae: 'AE用に書き出し',
    btn_ae_title: 'After Effects パネル用の構成データを書き出す',

    sec_lyrics: '歌詞',
    btn_syntax: '記法',
    btn_sample_zh: '中国語サンプル',
    btn_sample_ja: '日本語サンプル',
    lyrics_ph: '歌詞（1行 = 1フレーズ）',
    syntax_1: '1行が1フレーズ。空行は少し間を空けます',
    syntax_2: '夜明けの色を/覚えてる … / でカットの切れ目を指定',
    syntax_3: '*透明* … 強調（大きく・インパクト寄りの演出）',
    syntax_4: '行末の ! … フラッシュと揺れを入れる',
    syntax_5: '歌詞|ruby or note … 注釈レイアウトの小さな文字',
    syntax_6: '[01:23.45]歌詞 … LRC のタイムスタンプをそのまま使用',
    syntax_7: '# で始まる行 … コメント（無視）',

    sec_audio: '曲とタイミング',
    audio_empty: '曲なし（読み込むと拍を検出してカットを合わせます）',
    btn_load_audio: '曲を読み込む',
    btn_load_audio_title: 'mp3 / wav / m4a / ogg / flac など',
    btn_tap: 'タップで同期',
    btn_tap_title: '曲を再生しながら各行の頭でタップ',
    bpm_label: 'BPM',
    bpm_ph: '自動',
    offset_label: '開始(秒)',
    line_scale_label: '行の長さ',
    snap_label: '拍にスナップ',
    btn_reset_times: '手動タイミングを消す',
    tap_hint: '曲に合わせて、各行が始まる瞬間に <span class="kbd">Space</span> かボタンを押してください。',
    tap_next: '次: ',
    btn_tap_stop: '終了する',
    tap_undo: '↶ やり直す (Backspace)',
    tap_undo_title: '前の行に戻って曲を巻き戻す',
    tap_countin: '予備拍',
    tap_speed_label: 'タップ速度:',
    btn_tap_from: 'この行からタップ同期',
    time_start_tip: '開始（秒）',
    time_end_tip: '終了（秒）・空欄で自動',
    time_to: '〜',
    stamp_start_tip: '現在の再生位置を開始点にする (S)',
    stamp_end_tip: '現在の再生位置を終了点にする (E)',
    toast_tap_undone: '前の行に戻りました。タップを続けてください',
    syntax_8: '[00:01.00-00:04.50]歌詞 … 開始・終了時間を指定（空白区間対応）',

    sec_lines: '行とカット',
    time_manual_tip: '開始（秒）・手動',
    time_auto_tip: '開始（秒）・自動',
    opt_auto_layout: '自動',
    btn_dice_tip: 'この行を再抽選',
    btn_lock_tip: 'この行の構成をロック',

    btn_play: '再生',
    btn_pause: '一時停止',
    btn_loop: 'ループ',
    btn_prev_tip: '前の案に戻る',
    btn_next_tip: '次の案へ進む',
    btn_shuffle: 'シャッフル',
    btn_shuffle_title: '設定はそのままで構成だけ再抽選（ロックした行は維持）',
    btn_omakase: 'おまかせ',
    btn_omakase_title: 'スタイル・雰囲気・演出・配色をまるごとランダムに（キー R）',
    no_cut_at_time: 'この位置にカットはありません',
    chip_layout: 'レイアウト',
    chip_enter: '登場',
    chip_hold: '保持',
    chip_exit: '退場',
    chip_decor: '装飾',
    chip_treat: '加工',
    chip_bg: '背景',
    chip_cam: 'カメラ',

    omakase_big: 'おまかせで作る',
    omakase_desc: '押すたびに、スタイル・雰囲気・動き・配色・構成がまるごと変わります。キーボードの <span class="kbd">R</span> でも実行できます。',
    btn_prev2: '◀ 前の案',
    btn_next2: '次の案 ▶',
    easy_now_title: 'いまの案',
    easy_tweak_title: 'ここだけ変える',
    btn_e_style: 'スタイル',
    btn_e_style_title: 'スタイルだけ別のものに',
    btn_e_palette: '配色',
    btn_e_palette_title: 'アクセント・ズレ色A/Bをランダムに',
    btn_e_mood: '雰囲気',
    btn_e_mood_title: '動き・グリッチ・使う手法の雰囲気だけ',
    btn_e_cut: '構成',
    btn_e_cut_title: 'レイアウトと動きの組み合わせだけ',
    easy_export_title: '書き出し',
    aspect_label: '画面比',
    res_label: '解像度',
    fps_label: 'fps',
    btn_mp4: 'MP4 を書き出す',
    btn_cancel_export: '中止',

    tab_style: 'スタイル',
    tab_fx: '演出',
    tab_tech: '手法',
    tab_out: '書き出し',

    font_roles_title: 'フォントの役割',
    font_role_display: '見出し',
    font_role_serif: '明朝枠',
    font_role_body: '小さな文字',
    font_opt_default: 'スタイルの既定',
    local_font_ph: 'PCのフォント名（例: 游明朝、Noto Sans SC）',
    btn_add_font: '追加',
    btn_load_font_file: 'フォントファイル（.ttf/.otf）',
    accent_override_title: 'アクセント色の上書き',
    accent_override: '自分の色で上書き',
    accent_override_sub: '全シーンに適用。背景に合わせて明るさを自動調整します',
    btn_rand_palette: 'ランダムに配色',
    base_color_override_title: 'ベース色の上書き',
    base_color_override: 'メインの背景と文字を自分の色にする',
    color_bg: '背景',
    color_fg: '文字',
    color_sub: '補助',
    color_accent: 'アクセント',
    color_ghostA: 'ズレ色A',
    color_ghostB: 'ズレ色B',

    slider_motion: '動きの強さ',
    slider_glitch: 'グリッチ',
    slider_chroma: '色ズレ',
    slider_decor: '装飾の量',
    slider_density: 'カット細かさ',
    slider_texture: '質感',
    fx_flash_label: 'フラッシュ',
    fx_koma_label: 'コマ打ち',
    koma_full: 'フル（出力fpsのまま）',
    koma_12: '2コマ打ち（12枚/秒）',
    koma_8: '3コマ打ち（8枚/秒）',
    hud_label: 'HUD',
    hud_auto: 'スタイル次第',
    hud_on: '常に表示',
    hud_off: '表示しない',
    seed_label: 'シード',
    btn_new_seed: '新しいシード',
    seed_note: '同じシードなら同じ構成になります。行ごとの「再抽選」「ロック」は左の行リストから。',

    tech_filter_ph: '手法を名前で絞り込み',
    btn_all_on: 'すべてON',
    btn_all_off: 'すべてOFF',
    btn_invert: '反転',

    quality_label: '画質',
    quality_std: '標準',
    quality_high: '高',
    quality_max: '最高',
    out_audio_label: '曲を動画に含める',
    btn_png_zip: '連番PNG（ZIP）',
    btn_pnga_zip: '透過PNG（ZIP・背景なし）',
    codec_note: '書き出しはこのブラウザの中で行われます（Chrome / Edge 推奨）。',

    toast_copied: 'クリップボードにコピーしました',
    toast_saved: 'プロジェクトを保存しました',
    toast_ae_exported: 'AE構成データを書き出しました',
    loading_fonts: 'フォントを読み込み中…',
    encoding_audio: '音声をエンコード中…',
    export_complete: '完了',
    export_cancelled: 'キャンセルしました',
  }
};

let currentLang = 'zh';
try {
  const saved = localStorage.getItem('jizura_lang');
  if (saved === 'ja' || saved === 'zh') currentLang = saved;
} catch (e) {}

J.getLang = () => currentLang;

J.t = (key, fallback) => {
  const lang = currentLang;
  if (DICT[lang] && DICT[lang][key] !== undefined) return DICT[lang][key];
  if (DICT.zh && DICT.zh[key] !== undefined) return DICT.zh[key];
  if (DICT.ja && DICT.ja[key] !== undefined) return DICT.ja[key];
  return fallback !== undefined ? fallback : key;
};

J.setLang = (lang) => {
  if (lang !== 'zh' && lang !== 'ja') return;
  currentLang = lang;
  try { localStorage.setItem('jizura_lang', lang); } catch (e) {}
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'ja';
  if (window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent('jizura:langchange', { detail: { lang } }));
  }
};

// 中文示例歌词与日文示例歌词
J.SAMPLE_LYRICS_ZH = `夜空中最亮的星 / 是否听清
那仰望的人 / 心底的孤独和叹息
我祈祷拥有一颗 / *透明*的心灵
和会流泪的眼睛!`;

J.SAMPLE_LYRICS_JA = `夜明けの色を/覚えてる
ほどけた声が遠くで鳴った
ねえ、まだ間に合うかな
*透明*なままじゃ終われない!`;


J.TECH_NAMES = {
  "layout": {
    "center": {
      "zh": "居中排版",
      "ja": "中央"
    },
    "mixed": {
      "zh": "错落混排",
      "ja": "大小ミックス"
    },
    "vcols": {
      "zh": "垂直竖排",
      "ja": "縦書き"
    },
    "marquee": {
      "zh": "跑马灯横幅",
      "ja": "流れる帯"
    },
    "tile": {
      "zh": "满屏矩阵平铺",
      "ja": "敷き詰め"
    },
    "scatter": {
      "zh": "随机散落",
      "ja": "散らし"
    },
    "ring": {
      "zh": "圆周环抱",
      "ja": "円環"
    },
    "wave": {
      "zh": "正弦波浪轨迹",
      "ja": "波の軌跡"
    },
    "huge": {
      "zh": "冲屏特写巨字",
      "ja": "画面突き抜け"
    },
    "labels": {
      "zh": "标签贴纸堆叠",
      "ja": "ラベル貼り"
    },
    "condensed": {
      "zh": "纵向紧凑压缩",
      "ja": "縦長圧縮"
    },
    "gloss": {
      "zh": "词条注脚小字",
      "ja": "注釈"
    },
    "type": {
      "zh": "打字机展开",
      "ja": "タイプ"
    },
    "diag": {
      "zh": "斜向倾斜横幅",
      "ja": "斜め帯"
    },
    "circle": {
      "zh": "透视圆窗遮罩",
      "ja": "円窓"
    },
    "stack": {
      "zh": "动态残影层叠",
      "ja": "残像スタック"
    },
    "pill": {
      "zh": "胶囊药丸视窗",
      "ja": "カプセル"
    },
    "lowerThird": {
      "zh": "底部字幕条",
      "ja": "下部テロップ"
    },
    "corners": {
      "zh": "对角构图",
      "ja": "対角配置"
    },
    "staircase": {
      "zh": "阶梯拾级",
      "ja": "階段"
    },
    "zigzag": {
      "zh": "之字错位走位",
      "ja": "ジグザグ"
    },
    "arcTop": {
      "zh": "彩虹拱弧",
      "ja": "虹の弧"
    },
    "spiral": {
      "zh": "向心螺旋",
      "ja": "螺旋"
    },
    "gridCells": {
      "zh": "九宫格阵列",
      "ja": "升目"
    },
    "dropCap": {
      "zh": "首字巨化强调",
      "ja": "大きな頭文字"
    },
    "justified": {
      "zh": "齐头齐尾版面",
      "ja": "版面"
    },
    "frameBox": {
      "zh": "画框封边",
      "ja": "額縁"
    },
    "bubble": {
      "zh": "对话气泡框",
      "ja": "吹き出し"
    },
    "subtitleBar": {
      "zh": "经典字幕底栏",
      "ja": "字幕帯"
    },
    "ticker": {
      "zh": "走字资讯条",
      "ja": "ティッカー"
    },
    "splitScreen": {
      "zh": "双分屏对比",
      "ja": "二分割"
    },
    "mirror": {
      "zh": "上下镜像倒影",
      "ja": "鏡像"
    },
    "sideways": {
      "zh": "90度倒置横排",
      "ja": "縦倒し"
    },
    "edgeFrame": {
      "zh": "外周全环边框",
      "ja": "外周"
    },
    "perspective": {
      "zh": "Z轴空间纵深",
      "ja": "奥行き"
    },
    "hanko": {
      "zh": "朱红印章落款",
      "ja": "落款"
    },
    "genkou": {
      "zh": "原稿格子稿纸",
      "ja": "原稿用紙"
    },
    "panels": {
      "zh": "漫画分镜切格",
      "ja": "コマ割り"
    },
    "filmstrip": {
      "zh": "电影胶卷底片",
      "ja": "フィルム"
    },
    "quote": {
      "zh": "双引号引用",
      "ja": "引用"
    },
    "ruler": {
      "zh": "工程尺寸度量线",
      "ja": "寸法線"
    },
    "searchBar": {
      "zh": "搜索框输入界面",
      "ja": "検索窓"
    },
    "chat": {
      "zh": "聊天通讯气泡",
      "ja": "チャット"
    },
    "notification": {
      "zh": "系统通知推送卡片",
      "ja": "通知"
    },
    "ticket": {
      "zh": "票券打孔副券",
      "ja": "チケット"
    },
    "rain": {
      "zh": "字符数码雨",
      "ja": "文字の雨"
    },
    "hanging": {
      "zh": "悬挂垂落吊绳",
      "ja": "吊り下げ"
    },
    "orbit": {
      "zh": "环形轨道公转",
      "ja": "周回"
    },
    "tunnel": {
      "zh": "空间透视隧道",
      "ja": "トンネル"
    },
    "wordCloud": {
      "zh": "多维词云矩阵",
      "ja": "ワードクラウド"
    },
    "bounceLine": {
      "zh": "弹性折线蹦跳",
      "ja": "跳ねる"
    },
    "elastic": {
      "zh": "橡胶橡皮筋拉伸",
      "ja": "ゴム"
    },
    "crossBands": {
      "zh": "十字交叉警戒带",
      "ja": "交差帯"
    },
    "stickerBomb": {
      "zh": "潮酷贴纸炸弹",
      "ja": "ステッカー"
    },
    "neon": {
      "zh": "霓虹发光招牌",
      "ja": "ネオン"
    },
    "keycaps": {
      "zh": "机械键盘键帽",
      "ja": "キーキャップ"
    },
    "bubbles": {
      "zh": "浮动呼吸气泡",
      "ja": "泡"
    },
    "slotMachine": {
      "zh": "老虎机轮盘滚动",
      "ja": "スロット"
    },
    "flipBoard": {
      "zh": "翻页告示牌",
      "ja": "パタパタ"
    },
    "credits": {
      "zh": "垂直片尾滚屏",
      "ja": "エンドロール"
    },
    "zoomRepeat": {
      "zh": "逐级同心放大",
      "ja": "連続拡大"
    },
    "splitHalves": {
      "zh": "上下对半分屏",
      "ja": "上下割り"
    },
    "columnsBig": {
      "zh": "错落双列竖排",
      "ja": "大小縦組"
    },
    "circleWords": {
      "zh": "同心圆环词组",
      "ja": "同心円"
    },
    "dotMatrix": {
      "zh": "点阵LED显示屏",
      "ja": "ドット表示"
    },
    "depthStack": {
      "zh": "空间层次叠推",
      "ja": "奥行き重ね"
    },
    "typeSpecimen": {
      "zh": "字体样本排版",
      "ja": "書体見本"
    },
    "kanjiFocus": {
      "zh": "单字重音突显",
      "ja": "一字強調"
    },
    "halfVertical": {
      "zh": "横竖交错混排",
      "ja": "縦横混植"
    },
    "curtain": {
      "zh": "帷幕徐徐拉开",
      "ja": "幕"
    },
    "equalizer": {
      "zh": "音频频谱律动条",
      "ja": "イコライザー"
    },
    "tape": {
      "zh": "封箱胶带印贴",
      "ja": "テープ"
    }
  },
  "enter": {
    "cut": {
      "zh": "硬切瞬出",
      "ja": "カット"
    },
    "assemble": {
      "zh": "碎片聚拢拼合",
      "ja": "分解→集合"
    },
    "slice": {
      "zh": "错位切片滑入",
      "ja": "スライス"
    },
    "type": {
      "zh": "逐字打字录入",
      "ja": "タイプ"
    },
    "pop": {
      "zh": "弹性微缩弹出",
      "ja": "ポップ"
    },
    "drop": {
      "zh": "重力下坠落定",
      "ja": "落下"
    },
    "stretch": {
      "zh": "纵向弹性拉伸",
      "ja": "伸縮"
    },
    "wipe": {
      "zh": "线性擦除显现",
      "ja": "ワイプ"
    },
    "blur": {
      "zh": "径向虚化聚焦",
      "ja": "ブラー"
    },
    "spin": {
      "zh": "空间3D旋转进入",
      "ja": "回転"
    },
    "flicker": {
      "zh": "光效高频闪现",
      "ja": "点滅"
    },
    "scramble": {
      "zh": "乱码字符解析",
      "ja": "スクランブル"
    },
    "zoom": {
      "zh": "极速推焦变焦",
      "ja": "ズーム"
    },
    "riseMask": {
      "zh": "底部遮罩升起",
      "ja": "下から出現"
    },
    "dropMask": {
      "zh": "顶部遮罩下落",
      "ja": "上から出現"
    },
    "slideL": {
      "zh": "从左侧平移滑入",
      "ja": "左からスライド"
    },
    "slideR": {
      "zh": "从右侧平移滑入",
      "ja": "右からスライド"
    },
    "slideWhole": {
      "zh": "整行整块平移",
      "ja": "全体スライド"
    },
    "flipX": {
      "zh": "Y轴翻转展开",
      "ja": "縦軸フリップ"
    },
    "flipY": {
      "zh": "X轴翻板倒下",
      "ja": "横軸フリップ"
    },
    "domino": {
      "zh": "多米诺顺次翻倒",
      "ja": "ドミノ"
    },
    "fold": {
      "zh": "纸张折叠展开",
      "ja": "折り開き"
    },
    "unroll": {
      "zh": "卷轴向外延展",
      "ja": "巻き開き"
    },
    "strokeDraw": {
      "zh": "线稿笔画填色",
      "ja": "線画から塗り"
    },
    "outlineFill": {
      "zh": "轮廓绘制成型",
      "ja": "輪郭→塗り"
    },
    "splitJoin": {
      "zh": "上下两段合体",
      "ja": "上下合体"
    },
    "vSlice": {
      "zh": "竖条切片交错",
      "ja": "縦スライス"
    },
    "shutter": {
      "zh": "百叶快门开合",
      "ja": "シャッター"
    },
    "iris": {
      "zh": "圆形光圈开合",
      "ja": "アイリス"
    },
    "diagWipe": {
      "zh": "45度斜向擦除",
      "ja": "斜めワイプ"
    },
    "blinds": {
      "zh": "百叶窗翻转显现",
      "ja": "ブラインド"
    },
    "checker": {
      "zh": "棋盘方格错落",
      "ja": "市松"
    },
    "randomOrder": {
      "zh": "字符随机乱序浮现",
      "ja": "ランダム順"
    },
    "bounceBig": {
      "zh": "重力强力反弹",
      "ja": "大ジャンプ"
    },
    "squashDrop": {
      "zh": "落地挤压变形",
      "ja": "潰れて着地"
    },
    "rubber": {
      "zh": "橡皮筋回弹性拉扯",
      "ja": "ゴム伸び"
    },
    "glitchIn": {
      "zh": "信号故障撕裂入场",
      "ja": "グリッチ出現"
    },
    "echoIn": {
      "zh": "多重残影向心汇聚",
      "ja": "残像集束"
    },
    "whip": {
      "zh": "极速横向甩入",
      "ja": "ホイップ"
    },
    "skewIn": {
      "zh": "斜切剪切滑入",
      "ja": "スキュー"
    },
    "trackIn": {
      "zh": "字距由散收拢",
      "ja": "字間収束"
    },
    "trackOut": {
      "zh": "字距由聚推开",
      "ja": "字間拡張"
    },
    "blurStagger": {
      "zh": "阶梯式逐字失焦",
      "ja": "ブラー段差"
    },
    "fadeStagger": {
      "zh": "字符时序逐个淡入",
      "ja": "字ごとフェード"
    },
    "waveIn": {
      "zh": "正弦波浪涌动",
      "ja": "波立ち"
    },
    "spiralIn": {
      "zh": "向心螺旋汇聚",
      "ja": "螺旋集合"
    },
    "zoomOut": {
      "zh": "超大特写急退归位",
      "ja": "巨大→等倍"
    },
    "resolve": {
      "zh": "二进制密文解码",
      "ja": "解読"
    },
    "magnet": {
      "zh": "强磁极速吸附",
      "ja": "磁石"
    },
    "inkBleed": {
      "zh": "水墨浸润晕染",
      "ja": "にじみ"
    },
    "neonOn": {
      "zh": "霓虹发光通电点亮",
      "ja": "ネオン点灯"
    },
    "cursorSweep": {
      "zh": "雷达光标横扫显影",
      "ja": "カーソル掃引"
    },
    "stamp": {
      "zh": "印章重力砸落盖章",
      "ja": "スタンプ"
    }
  },
  "hold": {
    "still": {
      "zh": "纯净平稳静止",
      "ja": "静止"
    },
    "jitter": {
      "zh": "高频微弱抖动",
      "ja": "ジッター"
    },
    "drift": {
      "zh": "空间微漂漫游",
      "ja": "ドリフト"
    },
    "breathe": {
      "zh": "柔和起伏呼吸",
      "ja": "呼吸"
    },
    "wave": {
      "zh": "正弦平滑游走",
      "ja": "ウェーブ"
    },
    "glitchtick": {
      "zh": "偶发瞬断故障",
      "ja": "グリッチ"
    },
    "float": {
      "zh": "失重轻盈悬浮",
      "ja": "ふわふわ"
    },
    "sway": {
      "zh": "微风左右摇曳",
      "ja": "ゆらぎ"
    },
    "pulse": {
      "zh": "周期性律动脉冲",
      "ja": "脈動"
    },
    "shimmer": {
      "zh": "微细流光闪烁",
      "ja": "きらめき"
    },
    "colorRun": {
      "zh": "霓虹炫彩掠过",
      "ja": "色が走る"
    },
    "rotateSlow": {
      "zh": "恒速平缓自转",
      "ja": "ゆっくり回転"
    },
    "trackBreathe": {
      "zh": "字距舒缓伸缩",
      "ja": "字間の呼吸"
    },
    "skewWobble": {
      "zh": "倾斜剪切微颤",
      "ja": "斜め揺れ"
    },
    "beatHop": {
      "zh": "音乐重拍弹跳",
      "ja": "拍で跳ねる"
    },
    "hWave": {
      "zh": "水平波纹涟漪",
      "ja": "横波"
    },
    "heartbeat": {
      "zh": "强劲节奏鼓动",
      "ja": "鼓動"
    },
    "orbitSmall": {
      "zh": "微小椭圆轨道运转",
      "ja": "小さな円運動"
    },
    "jelly": {
      "zh": "果冻凝胶弹颤",
      "ja": "ゼリー"
    },
    "scanBand": {
      "zh": "CRT扫描光带滚掠",
      "ja": "走査帯"
    },
    "noiseDrift": {
      "zh": "噪波随机漂移",
      "ja": "ノイズ漂流"
    },
    "tilt": {
      "zh": "跷跷板左右微倾",
      "ja": "シーソー"
    },
    "zoomSlow": {
      "zh": "镜头极其缓慢推进",
      "ja": "じわ寄り"
    },
    "stretchPulse": {
      "zh": "横向微幅呼吸张弛",
      "ja": "横伸び拍"
    },
    "glitchJump": {
      "zh": "突发随机位移跳跃",
      "ja": "時々ずれる"
    },
    "echoTrail": {
      "zh": "连续拖曳轻微残影",
      "ja": "残像を引く"
    }
  },
  "exit": {
    "cut": {
      "zh": "硬切熄灭",
      "ja": "カット"
    },
    "explode": {
      "zh": "粒子炸裂迸发",
      "ja": "爆散"
    },
    "fall": {
      "zh": "结构崩塌坠落",
      "ja": "崩落"
    },
    "drift": {
      "zh": "化作微风雾散",
      "ja": "霧散"
    },
    "slice": {
      "zh": "水平切片划离",
      "ja": "スライス退場"
    },
    "wipe": {
      "zh": "线性擦除收场",
      "ja": "ワイプ退場"
    },
    "shrink": {
      "zh": "向心收缩消失",
      "ja": "収縮"
    },
    "blur": {
      "zh": "高速虚化散焦",
      "ja": "ブラー退場"
    },
    "stretch": {
      "zh": "弹性拉伸穿出",
      "ja": "伸縮退場"
    },
    "scatter": {
      "zh": "四散飞溅离析",
      "ja": "飛散"
    },
    "glitch": {
      "zh": "花屏解体解散",
      "ja": "グリッチ退場"
    },
    "sinkMask": {
      "zh": "水平沉落入地下",
      "ja": "沈む"
    },
    "riseOut": {
      "zh": "垂直冲顶穿出",
      "ja": "上へ抜ける"
    },
    "slideOutL": {
      "zh": "向左疾速滑离",
      "ja": "左へ流れる"
    },
    "slideOutR": {
      "zh": "向右疾速滑离",
      "ja": "右へ流れる"
    },
    "flipOutX": {
      "zh": "双扉合拢退场",
      "ja": "扉が閉まる"
    },
    "flipOutY": {
      "zh": "扑地向前倒塌",
      "ja": "パタン倒れ"
    },
    "foldOut": {
      "zh": "向内折叠闭合",
      "ja": "折り畳み"
    },
    "squash": {
      "zh": "垂直挤压压扁",
      "ja": "潰れる"
    },
    "trackOutWide": {
      "zh": "字距无限开阔散开",
      "ja": "字間が開く"
    },
    "collapse": {
      "zh": "黑洞中心坍缩",
      "ja": "吸い込み"
    },
    "zoomThrough": {
      "zh": "迎面扑屏冲过",
      "ja": "手前へ抜ける"
    },
    "zoomFar": {
      "zh": "深处景深隐退",
      "ja": "奥へ遠ざかる"
    },
    "spinOut": {
      "zh": "旋转离心飞离",
      "ja": "回って消える"
    },
    "twist": {
      "zh": "轴向旋钮式扭曲",
      "ja": "ねじれ"
    },
    "waveOut": {
      "zh": "随波浪波散坍塌",
      "ja": "波で崩れる"
    },
    "blurOutStagger": {
      "zh": "阶梯依次虚化失焦",
      "ja": "字ごとボケ"
    },
    "undraw": {
      "zh": "倒退缩回线框",
      "ja": "線に戻る"
    },
    "outlineOut": {
      "zh": "实色抽离留边",
      "ja": "塗りが抜ける"
    },
    "irisClose": {
      "zh": "光圈收拢封闭",
      "ja": "アイリス"
    },
    "diagWipeOut": {
      "zh": "斜向收拢收场",
      "ja": "斜めワイプ"
    },
    "blindsClose": {
      "zh": "百叶折叶闭合",
      "ja": "ブラインド"
    },
    "checkerOut": {
      "zh": "棋盘方格逐块离场",
      "ja": "市松"
    },
    "splitApart": {
      "zh": "上下分道扬镳",
      "ja": "上下に割れる"
    },
    "vSliceDrop": {
      "zh": "竖条错落坠落",
      "ja": "縦スライス落下"
    },
    "melt": {
      "zh": "熔融液化滴落",
      "ja": "溶ける"
    },
    "dissolve": {
      "zh": "细腻颗粒解离",
      "ja": "ほろほろ"
    },
    "backspace": {
      "zh": "退格一字一删",
      "ja": "バックスペース"
    },
    "scrambleOut": {
      "zh": "退化成乱码符",
      "ja": "記号化"
    },
    "glitchDissolve": {
      "zh": "像素块状崩解",
      "ja": "ブロック化"
    },
    "echoOut": {
      "zh": "层层回声回荡",
      "ja": "残響"
    },
    "whipOut": {
      "zh": "鞭甩横扫带走",
      "ja": "ホイップ"
    },
    "gravity": {
      "zh": "失重直线坠下",
      "ja": "重力落下"
    },
    "popOut": {
      "zh": "气泡戳破弹碎",
      "ja": "弾ける"
    },
    "burn": {
      "zh": "烈火烧尽灰烬",
      "ja": "焼失"
    },
    "sweepCover": {
      "zh": "黑色横条封挡",
      "ja": "バーで隠す"
    },
    "shatterLite": {
      "zh": "四片破碎飞离",
      "ja": "四分割飛散"
    }
  },
  "decor": {
    "brackets": {
      "zh": "直角对准框",
      "ja": "枠マーク"
    },
    "rings": {
      "zh": "空间定位圆环",
      "ja": "座標の円"
    },
    "dots": {
      "zh": "虚线刻度圆圈",
      "ja": "ドットの輪"
    },
    "arrows": {
      "zh": "动感指引箭头",
      "ja": "矢印"
    },
    "slash": {
      "zh": "斜切斩击切线",
      "ja": "スラッシュ"
    },
    "sparks": {
      "zh": "碰撞四溢火星",
      "ja": "スパーク"
    },
    "leaders": {
      "zh": "折线数据引线",
      "ja": "引き出し線"
    },
    "waveform": {
      "zh": "音乐音频声波",
      "ja": "波形"
    },
    "barcode": {
      "zh": "工业商品条形码",
      "ja": "バーコード"
    },
    "grid": {
      "zh": "工程视距网格",
      "ja": "グリッド"
    },
    "stripes": {
      "zh": "斜向警示斑马线",
      "ja": "ストライプ"
    },
    "blobs": {
      "zh": "潮流油墨污斑",
      "ja": "インクの染み"
    },
    "bars": {
      "zh": "粗质感色块条",
      "ja": "荒い帯"
    },
    "shapes": {
      "zh": "基础几何体组合",
      "ja": "図形"
    },
    "counter": {
      "zh": "动态滚动计数器",
      "ja": "大きな数字"
    },
    "crosshair": {
      "zh": "精准十字瞄准线",
      "ja": "照準線"
    },
    "cropMarks": {
      "zh": "印刷对位裁切角标",
      "ja": "トンボ"
    },
    "reticle": {
      "zh": "科技目标锁定框",
      "ja": "ロックオン"
    },
    "radar": {
      "zh": "雷达旋转扫描网",
      "ja": "レーダー"
    },
    "progressRing": {
      "zh": "百分比环形进度条",
      "ja": "進行リング"
    },
    "timecodeBar": {
      "zh": "电影级时间码条",
      "ja": "タイムコード"
    },
    "rulerEdge": {
      "zh": "画面外侧刻度标尺",
      "ja": "端の定規"
    },
    "dimension": {
      "zh": "工程制图尺寸线",
      "ja": "寸法線"
    },
    "indexNum": {
      "zh": "镜头编号序号码",
      "ja": "通し番号"
    },
    "dateStamp": {
      "zh": "复古相机日期水印",
      "ja": "日付写真"
    },
    "qrBlock": {
      "zh": "二维码矩阵图块",
      "ja": "QR風ブロック"
    },
    "glitchRects": {
      "zh": "数据故障碎片",
      "ja": "グリッチ片"
    },
    "concentricSquares": {
      "zh": "多重同心正方形",
      "ja": "同心四角"
    },
    "triangleSpin": {
      "zh": "立体旋转三角",
      "ja": "回転三角"
    },
    "lineBurst": {
      "zh": "放射性速度爆发线",
      "ja": "放射線"
    },
    "plusGrid": {
      "zh": "科技感十字十字点阵",
      "ja": "プラス格子"
    },
    "guides": {
      "zh": "版面辅助对齐虚线",
      "ja": "ガイド線"
    },
    "waveLine": {
      "zh": "正弦震荡波浪折线",
      "ja": "波線"
    },
    "spiralLine": {
      "zh": "螺旋回向连线",
      "ja": "渦巻き"
    },
    "halftonePatch": {
      "zh": "报纸网点印刷色块",
      "ja": "網点"
    },
    "checkerStrip": {
      "zh": "棋盘格修饰带",
      "ja": "市松の帯"
    },
    "beatRing": {
      "zh": "音乐重音律动环",
      "ja": "拍の輪"
    },
    "orbitDots": {
      "zh": "轨道运转公转光点",
      "ja": "周回する点"
    },
    "constellation": {
      "zh": "星座连线点阵",
      "ja": "星座"
    },
    "confetti": {
      "zh": "彩带节日纸屑",
      "ja": "紙吹雪"
    },
    "petals": {
      "zh": "飞舞飘落花瓣",
      "ja": "花びら"
    },
    "rainStreaks": {
      "zh": "纵向雨丝划痕",
      "ja": "雨の筋"
    },
    "snow": {
      "zh": "漫天飞雪微粒",
      "ja": "雪"
    },
    "lightLeak": {
      "zh": "胶片真实边缘漏光",
      "ja": "光漏れ"
    },
    "bokeh": {
      "zh": "梦幻散焦光斑",
      "ja": "ボケ玉"
    },
    "speedCorner": {
      "zh": "角落向心速度线",
      "ja": "集中線"
    },
    "risingParticles": {
      "zh": "空间升腾荧光微粒",
      "ja": "立ち上る粒"
    },
    "twinkle": {
      "zh": "四角十字闪烁星芒",
      "ja": "きらめき"
    },
    "brushStroke": {
      "zh": "水墨飞白书法笔触",
      "ja": "筆の払い"
    },
    "tapePieces": {
      "zh": "和纸遮蔽撕边胶带",
      "ja": "マスキングテープ"
    },
    "scribbleCircle": {
      "zh": "涂鸦圆圈圈记",
      "ja": "手描きの囲み"
    },
    "scribbleUnder": {
      "zh": "手绘波浪下划线",
      "ja": "手描き下線"
    },
    "crossOut": {
      "zh": "手写推敲划线修改",
      "ja": "推敲の走り書き"
    },
    "highlightMark": {
      "zh": "荧光笔高亮划记",
      "ja": "蛍光マーカー"
    },
    "heartsStars": {
      "zh": "潮流爱心与星芒徽章",
      "ja": "ハートと星"
    },
    "watermarkKanji": {
      "zh": "巨幅半透水印汉字",
      "ja": "透かし大漢字"
    },
    "verticalStrip": {
      "zh": "竖排装饰竖条",
      "ja": "縦書き帯"
    },
    "romajiLine": {
      "zh": "罗马拼音微型注字",
      "ja": "ローマ字"
    },
    "bracketsJP": {
      "zh": "六角黑括注符【】",
      "ja": "隅付き括弧"
    },
    "seal": {
      "zh": "篆刻朱红小印章",
      "ja": "落款"
    }
  },
  "treat": {
    "none": {
      "zh": "纯净原生无加工",
      "ja": "なし"
    },
    "outline": {
      "zh": "经典镂空描边字",
      "ja": "袋文字"
    },
    "outlineFill": {
      "zh": "实心填色加描边",
      "ja": "縁取り"
    },
    "doubleOutline": {
      "zh": "内外双层轮廓",
      "ja": "二重縁"
    },
    "extrude": {
      "zh": "3D厚度立体挤出",
      "ja": "立体"
    },
    "longShadow": {
      "zh": "45度极简长阴影",
      "ja": "長い影"
    },
    "hardShadow": {
      "zh": "硬边错位投下叠影",
      "ja": "ずらし影"
    },
    "softShadow": {
      "zh": "柔和高斯弥散阴影",
      "ja": "ぼかし影"
    },
    "glow": {
      "zh": "赛博电光外发光",
      "ja": "発光"
    },
    "marker": {
      "zh": "马克笔荧光底衬",
      "ja": "マーカー"
    },
    "underline": {
      "zh": "底部强化横下划线",
      "ja": "下線"
    },
    "strike": {
      "zh": "居中横穿删除线",
      "ja": "取り消し線"
    },
    "boxed": {
      "zh": "方框内嵌密封",
      "ja": "箱組"
    },
    "gradientV": {
      "zh": "垂直线性双色渐变",
      "ja": "縦グラデ"
    },
    "splitColor": {
      "zh": "上下双色平分切割",
      "ja": "上下二色"
    },
    "halftone": {
      "zh": "报刊网点半色调",
      "ja": "網点"
    },
    "stripes": {
      "zh": "斜向斑马斜纹填充",
      "ja": "ストライプ"
    },
    "hatch": {
      "zh": "细密排线阴影剖面",
      "ja": "斜線"
    },
    "dotted": {
      "zh": "虚线点阵外边缘",
      "ja": "点線輪郭"
    },
    "alternate": {
      "zh": "字符奇偶双色交错",
      "ja": "交互色"
    },
    "italic": {
      "zh": "动感斜体倾斜",
      "ja": "斜体"
    },
    "wide": {
      "zh": "横向压扁平体",
      "ja": "平体"
    },
    "tall": {
      "zh": "纵向拔高长体",
      "ja": "長体"
    },
    "echoOutline": {
      "zh": "回声轮廓外扩延展",
      "ja": "輪郭の残響"
    },
    "emphasisDots": {
      "zh": "文字着重着重号",
      "ja": "傍点"
    }
  },
  "bg": {
    "none": {
      "zh": "纯色极简单色底",
      "ja": "無地"
    },
    "sunburst": {
      "zh": "太阳芒射速度线",
      "ja": "放射"
    },
    "concentric": {
      "zh": "同心多层圆环",
      "ja": "同心円"
    },
    "halftoneFade": {
      "zh": "网点渐变半色调",
      "ja": "網点グラデ"
    },
    "bigStripes": {
      "zh": "巨幅斜向粗宽条带",
      "ja": "大きな斜線"
    },
    "splitV": {
      "zh": "左右垂直对半双色",
      "ja": "左右二色"
    },
    "splitH": {
      "zh": "上下水平对半双色",
      "ja": "上下二色"
    },
    "splitDiag": {
      "zh": "45度角对角双色分割",
      "ja": "斜め二色"
    },
    "gradientSweep": {
      "zh": "扫光平滑渐变",
      "ja": "グラデ"
    },
    "spotlight": {
      "zh": "聚光灯暗角光束",
      "ja": "スポットライト"
    },
    "tvBars": {
      "zh": "电视播控测试彩条",
      "ja": "テレビの帯"
    },
    "checker": {
      "zh": "棋盘格地砖阵列",
      "ja": "市松"
    },
    "bigChar": {
      "zh": "巨幅半透底纹汉字",
      "ja": "巨大文字"
    },
    "speedLines": {
      "zh": "热血动漫集中速度线",
      "ja": "集中線"
    },
    "scanBars": {
      "zh": "光栅电视扫描横条",
      "ja": "走査線の帯"
    },
    "dotGrid": {
      "zh": "工程点阵十字矩阵",
      "ja": "ドット格子"
    },
    "retroGrid": {
      "zh": "80s复古透视地网",
      "ja": "レトロ格子"
    },
    "bokehBg": {
      "zh": "大光圈虚焦漫反射斑",
      "ja": "ボケ玉"
    },
    "particlesBg": {
      "zh": "漫天浮动上升微粒",
      "ja": "舞い上がる粒"
    },
    "ripples": {
      "zh": "水波同心涟漪波纹",
      "ja": "波紋"
    },
    "polka": {
      "zh": "复古波尔卡大圆点",
      "ja": "水玉"
    },
    "eqBars": {
      "zh": "音频频谱背景柱",
      "ja": "背景イコライザー"
    },
    "borderFrame": {
      "zh": "四周封闭粗相框",
      "ja": "太枠"
    },
    "letterbox": {
      "zh": "宽银幕电影遮幅",
      "ja": "シネスコ帯"
    },
    "noiseField": {
      "zh": "柏林噪波流动场",
      "ja": "ノイズの揺らぎ"
    }
  },
  "cam": {
    "push": {
      "zh": "缓速景深向前推焦",
      "ja": "ゆっくり寄る"
    },
    "pullOut": {
      "zh": "景深缓缓向外拉远",
      "ja": "引き"
    },
    "panL": {
      "zh": "镜头向左摇镜头 (Pan Left)",
      "ja": "左パン"
    },
    "panR": {
      "zh": "镜头向右摇镜头 (Pan Right)",
      "ja": "右パン"
    },
    "tiltUp": {
      "zh": "仰角向上摇移 (Tilt Up)",
      "ja": "ティルト"
    },
    "dutch": {
      "zh": "倾斜荷兰角运镜 (Dutch Angle)",
      "ja": "ダッチ"
    },
    "handheld": {
      "zh": "真实手持微晃动态 (Handheld)",
      "ja": "手持ち"
    },
    "beatPunch": {
      "zh": "强拍重击急剧冲撞 (Beat Punch)",
      "ja": "拍でズーム"
    },
    "whipIn": {
      "zh": "极速横甩镜头进焦 (Whip Pan)",
      "ja": "ホイップイン"
    },
    "crashZoom": {
      "zh": "激进急推特写 (Crash Zoom)",
      "ja": "クラッシュズーム"
    },
    "bounce": {
      "zh": "垂直轻快弹震 (Bounce)",
      "ja": "バウンス"
    },
    "roll": {
      "zh": "镜头轴向连续旋转 (Roll)",
      "ja": "ロール"
    },
    "driftDiag": {
      "zh": "斜向对角漂移运镜",
      "ja": "斜めドリフト"
    },
    "shakeHard": {
      "zh": "剧烈震颤冲屏 (Shake)",
      "ja": "強い揺れ"
    },
    "dollyIn": {
      "zh": "平滑轨道推车推镜 (Dolly In)",
      "ja": "ドリー"
    },
    "stepZoom": {
      "zh": "阶梯式三段顿挫推焦",
      "ja": "段階ズーム"
    }
  },
  "fx": {
    "chroma": {
      "zh": "RGB色像差色散脉冲",
      "ja": "色ズレの跳ね"
    },
    "shake": {
      "zh": "画面全域剧烈抖动",
      "ja": "揺れ"
    },
    "slice": {
      "zh": "水平信号切片撕裂",
      "ja": "スライスグリッチ"
    },
    "block": {
      "zh": "数据块状马赛克故障",
      "ja": "ブロックグリッチ"
    },
    "invert": {
      "zh": "高能黑白反相闪烁",
      "ja": "反転"
    },
    "flash": {
      "zh": "击打高能纯白闪屏",
      "ja": "フラッシュ"
    },
    "zoom": {
      "zh": "径向变焦冲击模糊",
      "ja": "ズームブラー"
    },
    "mosaic": {
      "zh": "动态马赛克像素化",
      "ja": "モザイク"
    },
    "panelWipe": {
      "zh": "挡板面板划过转场",
      "ja": "パネルワイプ"
    },
    "irisTrans": {
      "zh": "镜头光圈圆形收缩",
      "ja": "アイリス"
    },
    "doors": {
      "zh": "双扇大门对开过渡",
      "ja": "扉"
    },
    "blindsTrans": {
      "zh": "百叶折叠切场",
      "ja": "ブラインド"
    },
    "rgbSplit": {
      "zh": "红绿蓝三原色分离",
      "ja": "RGB分離"
    },
    "smear": {
      "zh": "动态横向涂抹拖影",
      "ja": "横スミア"
    },
    "vhsRoll": {
      "zh": "老式录像带断带滚屏",
      "ja": "VHSロール"
    },
    "trackingNoise": {
      "zh": "磁头寻迹雪花噪波",
      "ja": "トラッキングノイズ"
    },
    "mirrorFlash": {
      "zh": "水平镜像对称爆闪",
      "ja": "ミラー"
    },
    "strobe": {
      "zh": "高频极速电子频闪",
      "ja": "ストロボ"
    },
    "posterize": {
      "zh": "色调色阶断层分离",
      "ja": "ポスタリゼ"
    },
    "hueShift": {
      "zh": "全色相环极速旋转",
      "ja": "色相シフト"
    },
    "tileShift": {
      "zh": "方块瓦片错位错动",
      "ja": "タイルずらし"
    },
    "filmBurn": {
      "zh": "老胶片过曝灼烧破损",
      "ja": "フィルム焼け"
    },
    "whipBlur": {
      "zh": "极速横甩动态模糊",
      "ja": "ホイップブラー"
    },
    "blackFrame": {
      "zh": "单帧纯黑场呼吸停顿",
      "ja": "黒コマ"
    },
    "whiteFrame": {
      "zh": "单帧纯白闪高能切点",
      "ja": "白コマ"
    },
    "gridRepeat": {
      "zh": "四分屏画面阵列镜像",
      "ja": "画面分割"
    },
    "waveWarp": {
      "zh": "正弦波浪扭曲失真",
      "ja": "波ゆがみ"
    },
    "pixelDrift": {
      "zh": "像素粒子随机漂移",
      "ja": "ピクセルずれ"
    },
    "zoomPunch": {
      "zh": "冲击波瞬间放大弹震",
      "ja": "ズームパンチ"
    },
    "lightSweep": {
      "zh": "变形镜头横向掠光",
      "ja": "光の筋"
    },
    "crtOff": {
      "zh": "显像管关机瞬间聚成光点",
      "ja": "ブラウン管オフ"
    },
    "splitSlide": {
      "zh": "上下对半错开平移",
      "ja": "上下スライド"
    }
  }
};

J.techName = (group, key) => {
  if (!key) return '';
  const lang = (J.getLang && J.getLang()) || 'zh';
  const grp = J.TECH_NAMES && J.TECH_NAMES[group];
  if (grp && grp[key]) {
    const val = lang === 'zh' ? grp[key].zh : grp[key].ja;
    if (val) return val;
  }
  if (J.registry) {
    try {
      const reg = J.registry(group);
      if (reg && reg[key] && reg[key].name) return reg[key].name;
    } catch (e) {}
  }
  return key;
};

})();
