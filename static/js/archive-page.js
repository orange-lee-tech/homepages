(() => {
  const LANGUAGES = ['zh', 'chinese-traditional', 'en'];
  const HTML_LANG = { zh: 'zh-CN', 'chinese-traditional': 'zh-Hant', en: 'en' };
  const CONTENT_MAP = {
    collaboration: ['experience', 'practice'],
    interests: ['interests'],
    honors: ['awards', 'publications']
  };
  const COPY = {
    zh: {
      eyebrow: '资产门户',
      title: '协作、兴趣与荣誉档案',
      description: '首页门户在这里展开，并继续复用现有事实内容源。',
      home: '主页',
      collaboration: '协作网络',
      interests: '兴趣图谱',
      honors: '荣誉档案',
      capabilities: '能力档案',
      loading: '正在加载档案内容…',
      error: '部分档案内容加载失败。'
    },
    'chinese-traditional': {
      eyebrow: '資產入口',
      title: '協作、興趣與榮譽檔案',
      description: '首頁入口在此展開，並繼續複用既有事實內容來源。',
      home: '主頁',
      collaboration: '協作網絡',
      interests: '興趣圖譜',
      honors: '榮譽檔案',
      capabilities: '能力檔案',
      loading: '正在載入檔案內容…',
      error: '部分檔案內容載入失敗。'
    },
    en: {
      eyebrow: 'Archive Portals',
      title: 'Collaboration, Interests, and Honors',
      description: 'Homepage portals expand here while continuing to reuse the existing factual content sources.',
      home: 'Home',
      collaboration: 'Collaboration',
      interests: 'Interests',
      honors: 'Honors',
      capabilities: 'Capabilities',
      loading: 'Loading archive content…',
      error: 'Some archive content failed to load.'
    }
  };

  let language = 'chinese-traditional';
  let homepage = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function currentLanguage() {
    const requested = new URL(window.location.href).searchParams.get('lang');
    if (LANGUAGES.includes(requested)) return requested;
    const saved = localStorage.getItem('lang');
    return LANGUAGES.includes(saved) ? saved : 'chinese-traditional';
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
    const raw = String(target || '');
    if (!raw || raw.startsWith('#') || /^(https?:|mailto:)/i.test(raw)) return raw;
    const url = new URL(raw, window.location.href);
    url.searchParams.set('lang', language);
    return `${url.pathname.replace(/^\//, '')}${url.search}${url.hash}`;
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function setState(message, isError = false) {
    const element = $('#archive-state');
    element.textContent = message;
    element.classList.toggle('is-error', isError);
    element.classList.toggle('is-hidden', !message);
  }

  async function fetchMarkdown(section) {
    const response = await fetch(`contents/${language}/${section}.md`, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Cannot load ${section} (${response.status})`);
    return response.text();
  }

  function renderChrome() {
    const copy = COPY[language];
    document.documentElement.lang = HTML_LANG[language];
    document.title = `${copy.title} · Li Yucheng`;
    setText('detail-brand', localized(homepage.chrome.brand));
    setText('detail-eyebrow', copy.eyebrow);
    setText('detail-title', copy.title);
    setText('detail-description', copy.description);
    setText('detail-home', copy.home);
    setText('detail-collaboration', copy.collaboration);
    setText('detail-interests', copy.interests);
    setText('detail-honors', copy.honors);
    setText('detail-capabilities', copy.capabilities);

    $$('[data-preserve-lang]').forEach((link) => {
      link.href = withLanguage(link.getAttribute('href'));
    });

    $$('.archive-language button').forEach((button) => {
      const active = button.dataset.language === language;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  async function renderSections() {
    const detailGrid = $('#archive-detail-grid');
    const portals = new Map(homepage.portals.map((portal) => [portal.id, portal]));
    const ids = ['collaboration', 'interests', 'honors'];

    const sections = await Promise.all(ids.map(async (id) => {
      const portal = portals.get(id);
      const markdownParts = await Promise.allSettled(CONTENT_MAP[id].map(fetchMarkdown));
      const body = markdownParts
        .filter((result) => result.status === 'fulfilled')
        .map((result) => marked.parse(result.value))
        .join('');
      const failed = markdownParts.some((result) => result.status === 'rejected');

      return `
        <section class="archive-detail-section" id="${escapeHtml(id)}">
          <p class="archive-eyebrow">${escapeHtml(id.toUpperCase())} / ${escapeHtml(portal?.updated || '')}</p>
          <h2>${escapeHtml(localized(portal?.title || id))}</h2>
          <p class="archive-detail-summary">${escapeHtml(localized(portal?.description || ''))}</p>
          ${failed ? `<p class="evidence-empty">${escapeHtml(COPY[language].error)}</p>` : ''}
          <div class="archive-markdown">${body}</div>
        </section>`;
    }));

    detailGrid.innerHTML = sections.join('');
  }

  function wireLanguage() {
    $$('.archive-language button').forEach((button) => {
      button.addEventListener('click', () => {
        const nextLanguage = button.dataset.language;
        if (!LANGUAGES.includes(nextLanguage)) return;
        localStorage.setItem('lang', nextLanguage);
        const url = new URL(window.location.href);
        url.searchParams.set('lang', nextLanguage);
        window.location.href = url.href;
      });
    });
  }

  async function init() {
    language = currentLanguage();
    setState(COPY[language].loading);
    try {
      const response = await fetch('content/generated/homepage.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Cannot load homepage data (${response.status})`);
      homepage = await response.json();
      renderChrome();
      await renderSections();
      wireLanguage();
      setState('');
    } catch (error) {
      console.error(error);
      setState(COPY[language].error, true);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
