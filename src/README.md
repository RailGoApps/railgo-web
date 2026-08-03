# RailGo Web

RailGo（铁路行）官方网站源码 —— 一款铁路出行信息查询工具，由 AZ Studio 出品。

## 技术栈

纯 **HTML + CSS + JavaScript**，无构建步骤、无框架依赖。

- **设计语言**：Material Design 3 Expressive（MD3E）—— 大圆角、动态主题、柔和阴影
- **图标**：Material Symbols（不使用 Emoji）
- **多语言**：简体中文（`zh/`）+ English（`en/`）
- **主题**：浅色 / 深色 / 跟随系统

## 目录结构

```
src/
├── index.html          # 入口，按浏览器语言自动跳转 zh/ 或 en/
├── CNAME               # GitHub Pages 自定义域名
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── style.css       # MD3E 样式
│   └── app.js          # 导航/侧边栏/页脚/主题/进度条 注入
├── zh/                 # 简体中文
│   ├── index.html      # 首页
│   ├── 404.html
│   ├── guide/          # 前言、下载、使用、FAQ
│   ├── download/       # 各平台下载页
│   └── legal/          # 举报、赞赏、用户协议、隐私政策、API
└── en/                 # English（结构同 zh/）
```

## 本地预览

无需安装任何依赖，用任意静态服务器即可：

```bash
cd src
python -m http.server 8000
# 访问 http://localhost:8000/
```

## 部署

推送到 GitHub Pages（`gh-pages` 分支），域名 `railgo.dev`。

## 许可

© AZ Studio. 保留所有权利。
