/* ============================================================================
   RailGo — 全局脚本
   注入：导航栏 / 侧边栏 / 页脚 / 主题切换 / 阅读进度条 / 语言切换
   纯原生 JS，无依赖。使用 Material Symbols 图标（无 Emoji）
   ============================================================================ */
(function () {
  'use strict';

  // 站点图标（本地 PNG，无外部依赖）
  const LOGO = root() + 'assets/icons/logo.png';
  const SITE_NAME = 'RailGo';

  // 当前语言：由页面 meta 标签或路径推断
  const lang = (document.documentElement.lang || 'zh').startsWith('en') ? 'en' : 'zh';
  const t = (zh, en) => (lang === 'en' ? en : zh);

  // 相对根：页面通过 <meta name="rg-root" content="../"> 声明到 src 根的相对路径
  function root() {
    const m = document.querySelector('meta[name="rg-root"]');
    return m ? m.content : '';
  }

  /* ---------- 1. 顶部导航栏 ---------- */
  function buildAppBar() {
    const r = root();
    const navItems = [
      { href: `${r}${lang}/`, label: t('首页', 'Home'), icon: 'home' },
      { href: `${r}${lang}/guide/preface.html`, label: t('前言', 'Preface'), icon: 'menu_book' },
      { href: `${r}${lang}/guide/download.html`, label: t('下载', 'Download'), icon: 'download' },
      { href: `${r}${lang}/guide/usage.html`, label: t('使用', 'Usage'), icon: 'play_circle' },
      { href: `${r}${lang}/guide/faq.html`, label: t('常见问题', 'FAQ'), icon: 'help' },
      { href: `${r}${lang}/legal/report.html`, label: t('举报', 'Report'), icon: 'report' },
      { href: `${r}${lang}/legal/sponsor.html`, label: t('赞赏', 'Sponsor'), icon: 'favorite' },
    ];

    const navLinks = navItems.map(n =>
      `<a href="${n.href}" data-nav="${n.href}">${n.label}</a>`
    ).join('');

    // 语言切换：在 zh 与 en 间切换
    const langLinks = ['zh', 'en'].map(l => {
      const active = l === lang ? ' active' : '';
      // 同名页面在另一语言下的路径
      const here = location.pathname.split(`/${lang}/`)[1] || '';
      return `<a href="${r}${l}/${here}" class="${active}">${l === 'zh' ? '中' : 'EN'}</a>`;
    }).join('');

    const bar = document.createElement('header');
    bar.className = 'appbar';
    bar.innerHTML = `
      <div class="container">
        <a class="appbar-brand" href="${r}${lang}/">
          <img src="${LOGO}" alt="${SITE_NAME}" loading="lazy">
          <span>${SITE_NAME}</span>
        </a>
        <nav class="appbar-nav" id="appNav">${navLinks}
          <span class="lang-switch">${langLinks}</span>
        </nav>
        <div class="appbar-actions">
          <button class="icon-btn" id="themeBtn" aria-label="${t('切换主题', 'Toggle theme')}">
            <span class="material-symbols-rounded" id="themeIcon">dark_mode</span>
          </button>
          <button class="icon-btn sidenav-toggle" id="sidenavToggle" aria-label="${t('目录', 'Contents')}" style="display:none">
            <span class="material-symbols-rounded">menu_book</span>
          </button>
          <button class="icon-btn appbar-toggle" id="navToggle" aria-label="${t('菜单', 'Menu')}">
            <span class="material-symbols-rounded">menu</span>
          </button>
        </div>
      </div>`;
    document.body.insertBefore(bar, document.body.firstChild);

    // 高亮当前导航项
    const here = location.pathname.split('/').pop();
    bar.querySelectorAll('.appbar-nav a[data-nav]').forEach(a => {
      const target = a.getAttribute('data-nav').split('/').pop();
      if (target === here || (here === '' && target === '')) a.classList.add('active');
    });

    // 菜单开关：主导航改为左侧抽屉，配遮罩层
    const nav = document.getElementById('appNav');
    const navOverlay = document.createElement('div');
    navOverlay.className = 'page-overlay nav-overlay';
    document.body.appendChild(navOverlay);
    const toggleNav = () => {
      nav.classList.toggle('open');
      navOverlay.classList.toggle('open');
    };
    document.getElementById('navToggle').addEventListener('click', toggleNav);
    navOverlay.addEventListener('click', toggleNav);
  }

  /* ---------- 2. 侧边栏（文档页用） ---------- */
  function buildSidebar(target) {
    if (!target) return;
    const r = root();
    const groups = [
      {
        title: t('安装', 'Install'),
        items: [
          { href: `${r}${lang}/download/android.html`, label: t('Android', 'Android'), icon: 'android' },
          { href: `${r}${lang}/download/harmony.html`, label: t('鸿蒙', 'HarmonyOS'), icon: 'devices' },
          { href: `${r}${lang}/download/ios.html`, label: t('iOS', 'iOS'), icon: 'ios' },
          { href: `${r}${lang}/download/windows.html`, label: t('Windows', 'Windows'), icon: 'laptop_windows' },
        ]
      },
      {
        title: t('使用', 'Usage'),
        items: [
          { href: `${r}${lang}/guide/preface.html`, label: t('前言', 'Preface'), icon: 'menu_book' },
          { href: `${r}${lang}/guide/usage.html`, label: t('使用教程', 'Usage Guide'), icon: 'play_circle' },
          { href: `${r}${lang}/guide/faq.html`, label: t('常见问题', 'FAQ'), icon: 'help' },
        ]
      },
      {
        title: t('其它', 'More'),
        items: [
          { href: `${r}${lang}/legal/report.html`, label: t('举报反馈', 'Report'), icon: 'report' },
          { href: `${r}${lang}/legal/sponsor.html`, label: t('赞赏我们', 'Sponsor'), icon: 'favorite' },
        ]
      },
      {
        title: t('协议', 'Legal'),
        items: [
          { href: `${r}${lang}/legal/user-agreement.html`, label: t('用户协议', 'User Agreement'), icon: 'gavel' },
          { href: `${r}${lang}/legal/privacy.html`, label: t('隐私政策', 'Privacy Policy'), icon: 'privacy_tip' },
          { href: `${r}${lang}/legal/api.html`, label: t('API 协议', 'API Terms'), icon: 'api' },
        ]
      },
    ];

    const here = location.pathname.split('/').pop();
    target.innerHTML = groups.map(g => `
      <div class="sidenav-group">
        <p class="sidenav-title">${g.title}</p>
        <ul class="sidenav-list">
          ${g.items.map(it => `
            <li><a href="${it.href}" class="${it.href.split('/').pop() === here ? 'active' : ''}">
              <span class="material-symbols-rounded">${it.icon}</span>${it.label}
            </a></li>`).join('')}
        </ul>
      </div>`).join('');

    // 显示顶部“目录”按钮（由 appbar 提供），并绑定抽屉逻辑
    const sidenavToggle = document.getElementById('sidenavToggle');
    if (sidenavToggle) {
      sidenavToggle.style.display = '';
      // 创建遮罩层
      const overlay = document.createElement('div');
      overlay.className = 'page-overlay';
      document.body.appendChild(overlay);
      const toggleDrawer = () => {
        target.classList.toggle('open');
        overlay.classList.toggle('open');
      };
      sidenavToggle.addEventListener('click', toggleDrawer);
      overlay.addEventListener('click', toggleDrawer);
      // 点击侧边栏链接后自动收起
      target.addEventListener('click', e => {
        if (e.target.closest('a')) {
          target.classList.remove('open');
          overlay.classList.remove('open');
        }
      });
    }
  }

  /* ---------- 3. 页脚 ---------- */
  function buildFooter() {
    const r = root();
    const f = document.createElement('footer');
    f.className = 'footer';
    f.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-brand">
              <img src="${LOGO}" alt="${SITE_NAME}">
              <span>${SITE_NAME}</span>
            </div>
            <p class="muted">${t('铁路出行信息查询工具，由 AZ Studio 开发。', 'Railway travel info query tool, by AZ Studio.')}</p>
            <p class="muted" style="margin-top:8px">railgo.dev</p>
          </div>
          <div>
            <h4>${t('产品', 'Product')}</h4>
            <ul>
              <li><a href="${r}${lang}/index.html">${t('首页', 'Home')}</a></li>
              <li><a href="${r}${lang}/guide/download.html">${t('下载', 'Download')}</a></li>
              <li><a href="${r}${lang}/guide/usage.html">${t('使用', 'Usage')}</a></li>
            </ul>
          </div>
          <div>
            <h4>${t('支持', 'Support')}</h4>
            <ul>
              <li><a href="${r}${lang}/guide/faq.html">${t('常见问题', 'FAQ')}</a></li>
              <li><a href="${r}${lang}/legal/report.html">${t('举报', 'Report')}</a></li>
              <li><a href="${r}${lang}/legal/sponsor.html">${t('赞赏', 'Sponsor')}</a></li>
            </ul>
          </div>
          <div>
            <h4>${t('法律', 'Legal')}</h4>
            <ul>
              <li><a href="${r}${lang}/legal/user-agreement.html">${t('用户协议', 'User Agreement')}</a></li>
              <li><a href="${r}${lang}/legal/privacy.html">${t('隐私政策', 'Privacy')}</a></li>
              <li><a href="${r}${lang}/legal/api.html">API</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; 2020–${new Date().getFullYear()} AZ Studio. ${t('保留所有权利。', 'All rights reserved.')}</span>
          <span>${t('本站不隶属于任何铁路运营机构。', 'Not affiliated with any railway operator.')}</span>
        </div>
      </div>`;
    document.body.appendChild(f);
  }

  /* ---------- 4. 主题切换（跟随系统 + 手动覆盖） ---------- */
  function initTheme() {
    const saved = localStorage.getItem('rg-theme');
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const theme = saved || (mq.matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
      updateThemeIcon(theme);
    };
    apply();
    // 用户未手动设过时，实时跟随系统主题切换
    if (!saved) mq.addEventListener('change', apply);
    document.getElementById('themeBtn').addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('rg-theme', next);
      updateThemeIcon(next);
    });
  }
  function updateThemeIcon(theme) {
    const i = document.getElementById('themeIcon');
    if (i) i.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
  }

  /* ---------- 5. 阅读进度条 ---------- */
  function initProgress() {
    const bar = document.createElement('div');
    bar.className = 'progress-bar';
    document.body.appendChild(bar);
    const update = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const total = h.scrollHeight - h.clientHeight;
      bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
    };
    addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- 6. 无障碍跳转链接 ---------- */
  function addSkipLink() {
    const s = document.createElement('a');
    s.className = 'skip-link';
    s.href = '#main';
    s.textContent = t('跳到正文', 'Skip to content');
    document.body.insertBefore(s, document.body.firstChild);
  }

  /* ---------- Android 实时下载 ---------- */
  // 通过 AList API（update.railgo.zenglingkun.cn）获取最新版本 APK
  // 按钮 id="rg-android-dl" 会被自动赋值最新的下载直链
  const ALIST_BASE = 'https://update.railgo.zenglingkun.cn';
  const ALIST_DIR = '/update/pack/android';

  // 从文件名解析版本号，用于排序找出最新版
  // 例：「2.0.2 Build 20002.apk」→ [2,0,2,20002]
  function parseVer(name) {
    const m = name.match(/(\d+)\.(\d+)\.(\d+)\s+Build\s+(\d+)/i);
    return m ? [+m[1], +m[2], +m[3], +m[4]] : [0, 0, 0, 0];
  }
  function cmpVer(a, b) {
    for (let i = 0; i < 4; i++) {
      if (a[i] !== b[i]) return a[i] - b[i];
    }
    return 0;
  }

  async function initAndroidDownload() {
    const btn = document.getElementById('rg-android-dl');
    if (!btn) return;
    try {
      const resp = await fetch(ALIST_BASE + '/api/fs/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: ALIST_DIR, page: 1, per_page: 100, refresh: false })
      });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const j = await resp.json();
      if (j.code !== 200 || !j.data || !Array.isArray(j.data.content)) throw new Error('API ' + j.message);

      // 仅保留 .apk 文件，按版本号降序，取最新
      const apks = j.data.content.filter(f => !f.is_dir && /\.apk$/i.test(f.name));
      if (!apks.length) throw new Error('no apk');
      apks.sort((a, b) => cmpVer(parseVer(b.name), parseVer(a.name)));
      const latest = apks[0];

      // AList 直链：/d/<路径>/<文件名>?sign=<sign>
      const url = ALIST_BASE + '/d' + ALIST_DIR + '/' + encodeURIComponent(latest.name) +
        '?sign=' + encodeURIComponent(latest.sign) + '&type=0';

      // 更新按钮：href 指向直链，target=_blank 触发下载
      btn.setAttribute('href', url);
      btn.setAttribute('target', '_blank');
      btn.setAttribute('rel', 'noopener');
      btn.removeAttribute('aria-disabled');
      btn.classList.remove('disabled');

      // 更新按钮文案，附带版本号
      const span = btn.querySelector('.material-symbols-rounded');
      const ver = latest.name.replace(/\.apk$/i, '').trim();
      const tpl = btn.dataset.labelTemplate || '{ver}';
      const label = document.createElement('span');
      label.textContent = tpl.replace('{ver}', ver);
      btn.textContent = '';
      if (span) btn.appendChild(span);
      btn.appendChild(label);

      // 同时更新版本元信息
      document.querySelectorAll('[data-android-version]').forEach(el => {
        el.textContent = ver;
      });
    } catch (e) {
      console.warn('[RailGo] Android 下载接口失败：', e);
      // 失败时保留兜底链接（自选版本页面）
      const fallback = btn.getAttribute('href') || (ALIST_BASE + '/#update/pack/android');
      btn.setAttribute('href', fallback);
    }
  }

  /* ---------- 初始化 ---------- */
  function init() {
    addSkipLink();
    buildAppBar();
    buildSidebar(document.getElementById('sidenav'));
    buildFooter();
    initTheme();
    initProgress();
    initDismissals();
    initAndroidDownload();
  }
  // 移动端：点击导航链接后自动关闭菜单；点击空白关闭侧边栏抽屉
  function initDismissals() {
    // 点击导航链接后自动关闭对应抽屉
    document.getElementById('appNav')?.addEventListener('click', e => {
      if (e.target.closest('a')) {
        document.getElementById('appNav').classList.remove('open');
        document.querySelector('.nav-overlay')?.classList.remove('open');
      }
    });
    // 点击页面空白处关闭已打开的抽屉
    document.addEventListener('click', e => {
      const aside = document.getElementById('sidenav');
      const nav = document.getElementById('appNav');
      const sidenavToggle = document.getElementById('sidenavToggle');
      const navToggle = document.getElementById('navToggle');
      const sidenavOverlay = document.querySelector('.page-overlay:not(.nav-overlay)');
      const navOverlay = document.querySelector('.nav-overlay');
      // 文档侧边栏抽屉
      if (aside?.classList.contains('open') &&
          !aside.contains(e.target) &&
          !sidenavToggle?.contains(e.target) &&
          !sidenavOverlay?.contains(e.target)) {
        aside.classList.remove('open');
        sidenavOverlay?.classList.remove('open');
      }
      // 主导航抽屉
      if (nav?.classList.contains('open') &&
          !nav.contains(e.target) &&
          !navToggle?.contains(e.target) &&
          !navOverlay?.contains(e.target)) {
        nav.classList.remove('open');
        navOverlay?.classList.remove('open');
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
