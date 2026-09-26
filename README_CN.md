# JIZURA 字面 (v2.0.0 中日双语旗舰版)

> 歌詞から文字PV風動画を自動で組み立てるブラウザアプリ / 歌词动力学排版与文字PV自动生成工具

[**🇨🇳 中文说明**](./README_CN.md) | [**🇯🇵 日本語原版说明**](./README.md) | [**📦 Releases / 绿色解压即用包下载**](https://github.com/yahnhaagendaz/JIZURA/releases)

---

## 📢 开源致谢与版权声明 (Credits & Attribution)

> **特别致谢与溯源**：  
> 本项目基于 **[852話 (@852wa)](https://github.com/852wa)** 的原创开源项目 **[852wa/JIZURA](https://github.com/852wa/JIZURA)** 深度二次开发与扩展。
> 
> 感谢 **852話** 老师构建了如此惊艳、优雅的文字PV自动排版与动力学渲染架构！
> 原项目仓库：https://github.com/852wa/JIZURA  
> 原项目在线体验：https://852wa.github.io/JIZURA/  
> 原项目许可证：MIT License (c) 2026 hakoniwa (852wa)

---

## ⚡ v2.0 重大更新特性

本版本在原版优秀的动力学排版与 AE 脚本联动基础上，深度解决了快歌对齐难、点错成本高、句子间缺乏独立留白、界面语言门槛等核心痛点：

1. **⏱️ 非侵入式 3-2-1 节拍倒计时预备**：
   - 打点按键内嵌 3-2-1-GO 脉冲与节拍滴答声，完全不遮挡主视频画面，彻底解决 0.xx 秒极速进唱反应不及的痛点。
2. **🐢 慢放打点变速（0.5x / 0.75x / 1.0x）**：
   - 支持多档播放倍速，极速快歌、密集说唱也能慢放从容对点，底层毫秒级换算自动映射至原速。
3. **↶ 撤销上一句（Backspace / Ctrl+Z）**：
   - 点错拍子无需推倒重来，按 Backspace 或界面撤回按钮即刻撤回上一句，音乐智能倒回 2.5 秒继续对点。
4. **🎯 行号快速跳转与智能单框时间录入**：
   - 歌词列表行号（如 `01`、`02`）一键点击即可指定从该句开始预卷对点；
   - 极简单框时间输入：支持直接输入时间点 `0.45` 或区间 `0-3`、`0.5-3.2`，自动生成时长标签。
5. **🎬 独立视频轨时间轴（0-3s, 5-8s 独立区间与留白）**：
   - 时间轴顶部开辟独立【歌词视频轨】：以色块清晰呈现每句歌词的起止区间与时长；
   - 句子之间的静止间歇自动标出「留白 X.Xs」，画面纯净呈现动态背景，彻底杜绝文字僵硬拉伸。
   - 原生兼容 LRC 范围语法 `[00:00.50-00:03.00]` 及各种波浪号区间。
6. **⌨️ 控制台起点终点印章与微调快捷键**：
   - `Space`: 打点记录当前句 / 主界面播放暂停
   - `S` 键 或 控制台 `[S起点]` 按钮：将当前播放头直接打标为当前句起点
   - `E` 键 或 控制台 `[E终点]` 按钮：将当前播放头直接打标为当前句终点
   - `[` / `]`: 时间前后微调 ±0.05 秒
7. **🎨 100% 兼容 Adobe After Effects**：
   - 完美适配 AE 脚本，自动还原每段镜头的入点 (inPoint) 与出点 (outPoint)，留白期间图层自然隐藏。
8. **🌐 全界面中日双语实时切换**：
   - 顶部导航栏支持一键切换「中文 / 日本語」，所有按钮、提示与控制面板无缝本地化。

---

## 🚀 快速启动运行

### 方式一：绿色免安装（推荐）
在 [GitHub Releases](https://github.com/yahnhaagendaz/JIZURA/releases) 下载 `JIZURA_v2.0.0_CN_Bilingual_Release.zip` 并解压：
- **Windows 用户**：双击运行 `start.bat` 即可自动启动并在浏览器打开。
- **直接双击**：亦可直接双击 `index.html` 在 Chrome / Edge 中离线使用。

### 方式二：命令行启动
```bash
# 方式 A：Python 极速服务
python server.py

# 方式 B：Node.js
node server.js
```
启动后在 Chrome 或 Edge 浏览器打开 `http://localhost:8520/`。

---

## 🛠️ 项目构建与开发者指南

修改 `src/` 或 `app/` 后，重新打包单文件 `index.html`：
```bash
# 使用 Node.js 构建
node build.js

# 或使用 Python 构建
python build.py
```

---

## 📄 开源许可证

本项目继承自 [852wa/JIZURA](https://github.com/852wa/JIZURA)，遵循 [MIT License](./LICENSE)。
第三方组件许可详见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。
