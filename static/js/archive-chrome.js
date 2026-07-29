(() => {
  const LANGUAGES = ['zh', 'chinese-traditional', 'en'];
  const HTML_LANG = { zh: 'zh-CN', 'chinese-traditional': 'zh-Hant', en: 'en' };
  const COPY = {
    zh: {
      brand: '石墨数字档案馆',
      nav: { home: '主页', projects: '项目', learning: '学习', capabilities: '能力', updates: '动态' },
      navigation: '档案导航',
      language: '语言切换',
      footer: '以事实、实践与长期维护构成的个人数字档案。'
    },
    'chinese-traditional': {
      brand: '石墨數位檔案館',
      nav: { home: '主頁', projects: '專案', learning: '學習', capabilities: '能力', updates: '動態' },
      navigation: '檔案導航',
      language: '語言切換',
      footer: '以事實、實踐與長期維護構成的個人數位檔案。'
    },
    en: {
      brand: 'Graphite Archive',
      nav: { home: 'Home', projects: 'Projects', learning: 'Learning', capabilities: 'Capabilities', updates: 'Updates' },
      navigation: 'Archive navigation',
      language: 'Language selector',
      footer: 'A personal digital archive built from facts, practice, and long-term maintenance.'
    }
  };
  const NAV_ITEMS = [
    { key: 'home', href: 'index.html' },
    { key: 'projects', href: 'projects.html' },
    { key: 'learning', href: 'learning.html' },
    { key: 'capabilities', href: 'capabilities.html' },
    { key: 'updates', href: 'updates.html' }
  ];

  let language = resolveLanguage();

  function resolveLanguage() {
    const requested = new URL(window.location.href).searchParams.get('lang');
    if (LANGUAGES.includes(requested)) return requested;
    try {
      const saved = localStorage.getItem('lang');
      if (LANGUAGES.includes(saved)) return saved;
    } catch {}
    return 'chinese-traditional';
  }

  function localized(value) {
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return value?.[language] || value?.zh || value?.en || '';
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function withLanguage(target) {
    const raw = String(target || '').trim();
    if (!raw || raw.startsWith('#') || /^(https?:|mailto:|tel:)/i.test(raw)) return raw;
    const url = new URL(raw, window.location.href);
    url.searchParams.set('lang', language);
    return `${url.pathname}${url.search}${url.hash}`;
  }

  function safeExternalUrl(value) {
    try {
      const url = new URL(String(value || ''));
      return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  }

  function navMarkup(current) {
    const copy = COPY[language];
    return NAV_ITEMS.map((item) => {
      const active = current === item.key;
      return `<a href="${escapeHtml(withLanguage(item.href))}" data-nav-key="${item.key}"${active ? ' aria-current="page"' : ''}>${escapeHtml(copy.nav[item.key])}</a>`;
    }).join('');
  }

  function languageMarkup() {
    return `
      <div class="unified-language" aria-label="${escapeHtml(COPY[language].language)}">
        <button type="button" data-unified-language="zh" aria-pressed="${language === 'zh'}">简</button>
        <button type="button" data-unified-language="chinese-traditional" aria-pressed="${language === 'chinese-traditional'}">繁</button>
        <button type="button" data-unified-language="en" aria-pressed="${language === 'en'}">EN</button>
      </div>`;
  }

  function renderSubpageChrome() {
    const header = document.querySelector('[data-archive-chrome]');
    if (!header) return;
    const current = document.body.dataset.archivePage || '';
    const copy = COPY[language];
    header.className = 'unified-chrome';
    header.innerHTML = `
      <div class="subpage-shell unified-chrome-inner">
        <a class="unified-brand" href="${escapeHtml(withLanguage('index.html'))}">
          <span class="unified-brand-mark" aria-hidden="true"></span>
          <span>${escapeHtml(copy.brand)}</span>
        </a>
        <nav class="unified-nav" aria-label="${escapeHtml(copy.navigation)}">
          ${navMarkup(current)}
        </nav>
        ${languageMarkup()}
      </div>`;
  }

  function renderFooter() {
    const footer = document.querySelector('[data-archive-footer]');
    if (!footer) return;
    footer.className = 'subpage-footer unified-footer';
    footer.innerHTML = `
      <div class="subpage-shell unified-footer-inner">
        <span>© Li Yucheng 2023–2026 · ${escapeHtml(COPY[language].brand)}</span>
        <span>${escapeHtml(COPY[language].footer)}</span>
        <span>
          <a href="https://github.com/orange-lee-tech" target="_blank" rel="noopener noreferrer">GitHub</a>
          ·
          <a href="https://openreview.net/profile?id=%7EYucheng_Li13" target="_blank" rel="noopener noreferrer">OpenReview</a>
        </span>
      </div>`;
  }

  function renderHomeFooterNav() {
    const nav = document.querySelector('[data-home-destination-nav]');
    if (!nav) return;
    nav.setAttribute('aria-label', COPY[language].navigation);
    nav.querySelectorAll('[data-nav-key]').forEach((link) => {
      const key = link.dataset.navKey;
      if (COPY[language].nav[key]) link.textContent = COPY[language].nav[key];
      const href = NAV_ITEMS.find((item) => item.key === key)?.href;
      if (href) link.href = withLanguage(href);
      link.toggleAttribute('aria-current', key === 'home');
      if (key === 'home') link.setAttribute('aria-current', 'page');
    });
    const label = document.querySelector('[data-home-destination-label]');
    if (label) {
      label.textContent = language === 'en'
        ? 'Continue through the archive'
        : language === 'zh'
          ? '继续浏览完整档案'
          : '繼續瀏覽完整檔案';
    }
  }

  function wireLanguage() {
    document.querySelectorAll('[data-unified-language]').forEach((button) => {
      const active = button.dataset.unifiedLanguage === language;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
      button.addEventListener('click', () => {
        const next = button.dataset.unifiedLanguage;
        if (!LANGUAGES.includes(next)) return;
        try { localStorage.setItem('lang', next); } catch {}
        const url = new URL(window.location.href);
        url.searchParams.set('lang', next);
        window.location.href = url.href;
      });
    });
  }

  function preserveLinks() {
    document.querySelectorAll('[data-preserve-lang]').forEach((link) => {
      link.href = withLanguage(link.getAttribute('href'));
    });
  }

  function init() {
    language = resolveLanguage();
    document.documentElement.lang = HTML_LANG[language];
    renderSubpageChrome();
    renderFooter();
    renderHomeFooterNav();
    preserveLinks();
    wireLanguage();
    document.dispatchEvent(new CustomEvent('archive:chrome-ready', { detail: { language } }));
  }

  window.ArchiveChrome = {
    LANGUAGES,
    get language() { return language; },
    get copy() { return COPY[language]; },
    localized,
    escapeHtml,
    withLanguage,
    safeExternalUrl,
    init
  };

  document.addEventListener('DOMContentLoaded', init);
})();
