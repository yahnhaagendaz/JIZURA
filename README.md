## 写在前面

是的 这个git甚至都是Gemini帮我put上来的/

这个项目这两天在国内的很多平台都有看见宣传，在中秋前看到852話发布这个工具之前 我就是一个对BGA/PV 感兴趣的学生。

这个分支说到底就三个事情：

1. **汉化**  
   我没做名词表 所以汉化的不是很到位 后续这些名词我的想法是可以和更多有实际项目经验的老师同步下，根据项目中AE特效插件名词组合去翻译（如果以后有新的内容 新的模板也是）尽可能的不要新造词组

2. **提供一个Agent 配合 歌曲BPM 节奏 鼓点 量产 特效文字的思路**  
   让文字预设能在大语言模型的理解下 变得更加实用，要是能让公共项目中的文字排版提升审美在商业上落地就更好了*

3. **作为我自己的分支开发路径**  
   2026年我的工作重心在视频生成与Agent 工具落地上，目前短剧业务在公司中跑的还算不错，但是未来我还是会很想通过生成式的内容在日本/亚洲市场能有更多的工作机会，希望我做的能帮到看到这段文字的你，也非常期待你能够帮助到我w


# JIZURA 字面 — 文字PV动力学引擎 (中日双语旗舰版 / Agent-Ready Fork)

<p align="center">
  <img src="https://img.shields.io/badge/Release-v2.2.0-blue.svg" alt="Release v2.2.0">
  <img src="https://img.shields.io/badge/Language-中日双语%20%7C%20Bilingual-success.svg" alt="Language">
  <img src="https://img.shields.io/badge/AI%20Agent-Antigravity%20%7C%20Codex%20Ready-blueviolet.svg" alt="Agent Ready">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/After%20Effects-JSX%20ScriptUI-red.svg" alt="After Effects">
  <img src="https://img.shields.io/badge/Export-WebCodecs%20MP4-orange.svg" alt="WebCodecs MP4">
</p>

> 歌詞を入れると文字PV風動画を自動で組み立てるブラウザアプリ  
> **歌词动力学排版与文字PV自动生成工具 —— 让每一句歌词随节奏律动起舞。**

[**🇨🇳 简体中文 (当前默认)**](#-快速开始) | [**🇯🇵 日本語原版文档 (README_JA.md)**](./README_JA.md) | [**📦 绿色发行包下载 (Releases)**](https://github.com/yahnhaagendaz/JIZURA/releases) | [**🌐 在线免安装即用 (GitHub Pages)**](https://yahnhaagendaz.github.io/JIZURA/)

---

## 🆕 v2.2.0 核心更新重点 (Changelog & Highlights)

本版本重点解决了创作者在实际卡点制作时的**“精准度”**与视觉排版时的**“克制美学（做减法）”**，并进一步夯实了底层单镜头隔离与工程持久化：

### 1. 🎯 分句与镜头排列：逐句 `S` / `E` 严格卡点工匠流
- **高频卡点手操体验**：导入歌词后，用户可在「分句与镜头排列」视图中边听边打点。
  - 按 `S` 键：将当前播放进度严格打标为目标句**起点**，并支持自动步进至下一句（`autoStepEnabled`）。
  - 按 `E` 键：将当前播放进度打标为目标句**终点**，精准截断分句区间。
- **无缝键盘导航与微调**：
  - `Q` / `W`（或 `↑` / `↓`）无需鼠标即可上下切换目标句；
  - `[` / `]` 键微调单句时间戳（步长 ±0.1s / ±0.5s）；`Alt+[` / `Alt+]` 波纹顺延后续所有分句；
  - `Ctrl+Z` 专属时间打点撤销栈，点错拍子即刻回退。

### 2. 🎨 单镜头八维手法解耦与严格锁定（支持“做减法”）
- **单镜头作用域彻底解耦 (`src/08c_editing.js`)**：
  - 修复以往“调一个镜头导致同句其他切片或前后句乱变”的痛点，当前镜头的微调 100% 隔离。
- **开放更多组合 & 克制审美（做减法）**：
  - 开放构图、入场、驻留、退场、运镜、质感、背景、装饰 8 个维度共 357 项预设，支持中日双语关键词搜索与即时预览。
  - **拒绝死板预制菜堆砌**：动效堆满往往导致画面杂乱无章。新版强化了“做减法”能力——装饰（Decor）支持多选、反选、完全置空（`decor: []`），背景和质感亦可一键回归极简纯色，让排版重心回归文字咬字与节拍本身。
- **严格锁定契约（Strict Lock Snapshot）**：
  - 锁定单个镜头时，系统不仅冻结参数名称，更会固化解析后的完整渲染上下文（Style / FX / HUD / Events 快照）。即使全片使用 `Shift+R` 重组或 Omakase 百次，锁定的镜头依然分毫不差。

### 3. 📝 批量填词与时间轴对齐原型
- 内置「批量填词」弹窗（`openBatchLyricsDialog`），支持粘贴多行纯文本歌词快速与空白节奏打点对齐。
- *注：当前该功能为基础原型阶段，对于复杂切分音与特殊拍号，建议优先搭配 `S`/`E` 逐句人工卡点。*

### 4. 🛡️ 架构稳定性与工程安全
- 修复进度条缺少声明导致的页面启动白屏崩溃（`sc is not defined`）。
- 修复八维检查器弹窗在切换维度时意外关闭的问题。
- 服务端增加并发写入串行化、工程 ID 强校验与自动 `.bak` 备份机制；另存为（Save As）自动完整克隆音轨与媒体格式。
- 实测 720p/24fps WebCodecs 硬件加速 MP4 导出，轨道完整无报错。

### 🔮 下一阶段演进规划 (Roadmap)
- **🤖 本地 Gemini 模型 API 对话式接入**：在编辑器内以对话流形式与 Gemini 沟通，实现语义化的歌词意境分析与自动分镜。
- **📋 自动化出片工作流 Markdown 规范**：编写标准化的 Agent 出片提示词与工程排版准则（规范留白率、动效做减法比例、字体节奏映射），让 Agent 真正具备专业文字 PV 导演的审美与交付水准。

---

## 📢 开源致谢与版权声明 (Credits & Attribution)

> **特别致谢原作者**：  
> 本项目由 **yahnhaagendaz** 维护，深度基于日本开发者 **[852話 (@852wa)](https://github.com/852wa)** 创作的开源项目 **[852wa/JIZURA](https://github.com/852wa/JIZURA)** 进行重构与二次开发。
> 
> 感谢 **852話** 老师构筑了惊艳优雅的 350+ 文字PV动力学表现组件库与单文件 WebCodecs / AE 渲染架构！本项目在原版优秀能力的基础上持续演进，严格遵循 MIT 开源许可协议。
> - 原版仓库：https://github.com/852wa/JIZURA
> - 原版在线体验：https://852wa.github.io/JIZURA/
> - 版权归属：Copyright (c) 2026 hakoniwa (852wa) / Modified & Maintained by yahnhaagendaz

---

## 🧭 本分支的两大核心演进方向

本分支致力于将 JIZURA 从一个优秀的单机文字PV制作工具，演进为一个**兼具极致中文创作体验**与**原生拥抱 AI Agent 协同生态**的现代动力学引擎：

```
                    ┌───────────────────────────────────────────────┐
                    │      JIZURA v2.0+ (Agent-Ready Architecture)  │
                    └───────────────────────┬───────────────────────┘
                                            │
                ┌───────────────────────────┴───────────────────────────┐
                ▼                                                       ▼
  【方向一：深度汉化与创作者交互重塑】                     【方向二：AI Agent 协同与深度自定义开发】
  • 中日双语一键无缝热切换                                 • 工具侧加深自定义：解耦配置协议与组件扩展
  • 3-2-1 非侵入式节拍倒计时预备                           • 规范化 JSON 数据契约 (时间轴/排版/镜头/留白)
  • 0.5x / 0.75x 变速慢放打点 (快歌从容对点)               • 接入 Antigravity / Codex 等 Agent 驱动范式
  • ↶ 撤销重做 (智能回退音频 2.5s 随时纠错)               • 自动化工作流：Agent 歌词解析 ➔ 镜头编排 ➔ AE脚本导出
  • 独立视频轨时间轴与留白标定 (杜绝文字拉伸)               • 支持本地 HTTP / CLI 无头渲染自动化批处理
```

---

### 方向一：深度中文化与创作者交互重塑 (Localization & UX Overhaul)

针对中文音乐创作者与原版快歌对齐门槛高的痛点，进行了深度体验重构：

| 特性 | 功能说明与解决的痛点 |
|---|---|
| **🌐 中日双语无缝切换** | 顶部导航栏实时无缝切换「中文 / 日本語」，所有按钮、专业排版与 AE 动效术语完整本地化。 |
| **⏱️ 3-2-1 节拍倒计时预备** | 告别开局 `0.xx` 秒进唱措手不及！打点按键内部播放脉冲音画倒计时，**完全不遮挡**中央视频预览画面。 |
| **🐢 慢放变速打点 (0.5x / 0.75x)** | 极速快歌、密集说唱也能慢放从容对点；底层毫秒级采样自动无损换算映射至原曲绝对时间。 |
| **↶ 撤销上一句 (Backspace / Ctrl+Z)** | 点错拍子无需推倒重来！按 Backspace 键即刻撤销上一句打点，音乐智能倒退 2.5 秒无缝继续。 |
| **🎯 行号快速跳转与智能单框录入** | 点击歌词行号（如 `01`、`02`）直接预卷对齐；输入框直接支持时间点 `0.45` 或区间 `0-3`、`0.5-3.2`。 |
| **🎬 独立视频轨时间轴与留白标定** | 顶部开辟独立【歌词视频轨】，精准显示每句歌词的显示区间；静止间歇自动标出「留白 X.Xs」，**彻底杜绝文字僵硬拉伸**。 |
| **⌨️ 播放控制台快捷印章** | `S` 键直接将当前播放头打标为当前句起点，`E` 键打标为终点；`[` / `]` 键毫秒级前后微调。 |
| **🎨 100% 还原 Adobe AE 脚本** | `JIZURA_AE.jsx` 自动还原每段镜头的入点 (inPoint) 与出点 (outPoint)，留白期间图层自然隐藏。 |

---

### 方向二：AI Agent（如 Antigravity / Codex 等）协同调用与深度自定义结构

为了让大语言模型与自主代码代理（如 **Google Antigravity**、**OpenAI Codex**、**Claude Code** 等）能够无缝操控、扩展和批处理 JIZURA，本分支正在深化底层架构解耦：

#### 1. 工具侧加深自定义的开发结构 (Deeply Customizable Tooling)
- **数据契约标准化**：
  将歌词结构、时间区间（`startTime` ~ `endTime`）、动效组合（布局 Layout、运动 Motion、装饰 Decor、镜头 Camera、调色 Color）规范为纯净的 JSON 协议，不仅可在前端加载，更可由外部代码程序化生成。
- **表现包 (Expression Packs) 模块化机制**：
  将 350+ 个排版与动效片段解耦为规范化的函数库（`src/` 下），支持开发者与 Agent 自由编写自定义动效扩展，无需深入侵入核心渲染管线。
- **轻量本地服务与跨域调用支持**：
  提供内置的 `server.py` 与 `server.js`，预留了与外部自动化工具和浏览器扩展跨域通信的通道。

#### 2. Agent 工具协同调用范式 (Agent Invocation Paradigms)
在配合 **Antigravity / Codex** 等 AI Agent 时，Agent 可直接承担「自动化导演与编排师」的角色：

```mermaid
flowchart LR
    A["用户提供歌词与音频"] --> B["AI Agent (Antigravity / Codex)"]
    B -->|"1. 语义分词与韵律分析"| C["生成精确时间轴与留白区间"]
    B -->|"2. 情感判断与视觉风格匹配"| D["挑选字体 / 配色 / 表现包"]
    B -->|"3. 生成标准 JIZURA 工程 JSON"| E["JIZURA 渲染内核"]
    E --> F["一键生成 MP4 视频"]
    E --> G["一键生成 After Effects 工程脚本"]
```

* **歌词韵律理解与时间轴生成**：  
  利用大模型的音频听打 (Whisper) 与韵律分析能力，Agent 可自动将歌词转换为带时间起止标签的格式：
  ```lrc
  [00:00.50-00:03.20] 这是第一句歌词（高能排版）
  [00:05.00-00:08.50] 这是第二句歌词（带 1.8s 纯净留白）
  ```
* **风格与分镜自适应推选**：  
  Agent 根据歌曲流派（古风、赛博朋克、摇滚、J-POP、抒情等），自动配置 Google Fonts 中文字体库、色环对比参数与故障强度。
* **工程脚本与批量产出**：  
  Agent 通过本地执行环境驱动 `build.py` / `build.js`，或直接生成用于 Adobe After Effects 渲染的 `_ae.json`，实现全自动无人值守批量制片。

---

## 🚀 快速开始

### 方式 1：绿色解压即用包（最简推荐）
1. 在 [Releases 发布页面](https://github.com/yahnhaagendaz/JIZURA/releases) 下载最新版 `JIZURA_v2.0.0_CN_Bilingual_Release.zip`。
2. 解压到任意文件夹。
3. **Windows 用户**：双击运行 `start.bat`，脚本将自动检测环境、启动加速服务并在浏览器中打开。
4. **离线免安装**：亦可直接双击解压出的 `index.html`，在任意现代浏览器（Chrome / Edge / Firefox）中离线使用。

### 方式 2：命令行服务启动
```bash
# 克隆仓库
git clone https://github.com/yahnhaagendaz/JIZURA.git
cd JIZURA

# 方式 A：使用 Python 启动本地服务（支持 WebCodecs 极速导出）
python server.py

# 方式 B：使用 Node.js 启动服务
node server.js
```
启动后访问：`http://localhost:8520/`。

### 方式 3：在线免安装体验
无需下载任何文件，直接在浏览器中打开：  
👉 **[https://yahnhaagendaz.github.io/JIZURA/](https://yahnhaagendaz.github.io/JIZURA/)**

---

## ⌨️ 常用快捷键一览

| 快捷键 | 所在模式 / 视图 | 作用 |
|---|---|---|
| `Space` (空格) | 全局 / 主界面 | 播放 / 暂停视频与音频预览 |
| `S` 键 | 分句与镜头排列 / 预览 | 将当前播放头精确打标为当前分句**起点**，并自动步进下一句 |
| `E` 键 | 分句与镜头排列 / 预览 | 将当前播放头精确打标为当前分句**终点** |
| `Q` / `W` 或 `↑` / `↓` | 分句与镜头排列 | 纯键盘上下切换目标编辑分句（无需鼠标点选） |
| `[` / `]` | 预览与微调 | 将目标分句时间戳前后微调（单按 ±0.1s，按住 Shift ±0.5s） |
| `Alt+[` / `Alt+]` | 预览与微调 | **波纹顺延**：将当前句及后续所有分句整体同步前移/后移 |
| `Ctrl+Z` | 预览与微调 | **撤销时间打点**：回退上一次 S/E 打点或时间戳变更 |
| `Ctrl+Alt+Z` / `Y` | 全局 | **视觉方案撤销 / 重做**：回退或重做八维手法与排版调整历史 |
| `Shift+R` | 主界面 | **全片智能重构（Omakase）**（单按 R 会防误触提示，已锁定的镜头不会被重置） |
| `D` 键 | 主界面 | 仅对**当前未锁定镜头**单发重roll随机手法 |
| `F` 键 | 全局 | 视图居中聚焦至当前分句在时间轴上的位置 |
| `M` 键 | 全局 | 音频快速静音 / 取消静音切换 |
| `Space` / `Enter` | 节拍打点模式 (Tap) | 录入当前句节奏点并推进 |
| `Backspace` | 节拍打点模式 (Tap) | 撤销上一句打点，并智能倒带 2 秒无缝重来 |

---

## 🛠️ 开发者指南与构建说明

JIZURA 采用极为优雅的单文件分发架构。所有源码均位于 `src/` 与 `app/` 中：

```bash
# 使用 Node.js 打包构建 index.html
node build.js

# 或使用 Python 打包构建 index.html
python build.py

# 构建 After Effects 脚本 (ae/ -> JIZURA_AE.jsx)
python build_ae.py
```

---

## 🤝 参与贡献与致谢

- 再次致谢原作者 **[852話 (@852wa)](https://github.com/852wa/JIZURA)** 开创的优秀基石。
- 欢迎各位开发者、文字PV创作者与 AI Agent 探索者提交 Issue 与 Pull Request！
- 无论是新增汉字排版字体、扩展动效表现包，还是探索更多与 Agent（如 Antigravity / Codex）联动的自动化工作流，我们都非常期待与你一同探讨！

---

## 📄 开源许可证

本项目继承原作者项目的开源许可，采用 [MIT License](./LICENSE)。  
使用的第三方库（mp4-muxer 等）遵循各自开源协议，详见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。
