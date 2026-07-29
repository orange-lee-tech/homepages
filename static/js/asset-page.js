(() => {
  const LANGUAGES = ['zh', 'chinese-traditional', 'en'];
  const LANGUAGE_META = {
    zh: { html: 'zh-CN', label: '简体中文' },
    'chinese-traditional': { html: 'zh-Hant', label: '繁體中文' },
    en: { html: 'en', label: 'English' }
  };
  const CHROME = {
    zh: {
      home: '主页', projects: '项目', research: '研究', knowledge: '知识', posts: '动态',
      loading: '正在加载内容…', empty: '当前尚无公开内容。', error: '内容加载失败，请刷新页面或返回主页。',
      updated: '更新', footer: '内容由 YAML 数据源生成并随仓库版本维护。'
    },
    'chinese-traditional': {
      home: '主頁', projects: '專案', research: '研究', knowledge: '知識', posts: '動態',
      loading: '正在載入內容…', empty: '目前尚無公開內容。', error: '內容載入失敗，請重新整理頁面或返回主頁。',
      updated: '更新', footer: '內容由 YAML 資料來源產生並隨儲存庫版本維護。'
    },
    en: {
      home: 'Home', projects: 'Projects', research: 'Research', knowledge: 'Knowledge', posts: 'Updates',
      loading: 'Loading content…', empty: 'No public entries yet.', error: 'Unable to load this catalog. Refresh the page or return home.',
      updated: 'Updated', footer: 'Content is generated from YAML sources and versioned with the repository.'
    }
  };

  let language = 'chinese-traditional';

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

  function safeExternalUrl(value) {
    try {
      const url = new URL(String(value));
      return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  }

  function withLanguage(target) {
    const raw = String(target || '');
    if (!raw || /^(https?:|mailto:)/i.test(raw)) return raw;
    const url = new URL(raw, window.location.href);
    url.searchParams.set('lang', language);
    return `${url.pathname.replace(/^\//, '')}${url.search}${url.hash}`;
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function renderChrome(homepage) {
    const copy = CHROME[language];
    document.documentElement.lang = LANGUAGE_META[language].html;
    setText('asset-brand', localized(homepage.chrome.brand));
    setText('asset-nav-home', copy.home);
    setText('asset-nav-projects', copy.projects);
    setText('asset-nav-research', copy.research);
    setText('asset-nav-knowledge', copy.knowledge);
    setText('asset-nav-posts', copy.posts);
    setText('asset-footer-copy', copy.footer);

    $$('[data-preserve-lang]').forEach((link) => {
      link.href = withLanguage(link.getAttribute('href'));
    });

    $$('.asset-language-switch button').forEach((button) => {
      const active = button.dataset.language === language;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
      button.title = LANGUAGE_META[button.dataset.language]?.label || button.dataset.language;
    });
  }

  function renderLinks(links) {
    return (links || []).map((link) => {
      const href = safeExternalUrl(link.url);
      if (!href) return '';
      return `<a class="asset-card-link" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(localized(link.label))}<span aria-hidden="true"> ↗</span></a>`;
    }).join('');
  }

  function renderCard(item) {
    const copy = CHROME[language];
    const meta = [item.category, item.status].filter(Boolean).map(escapeHtml).join(' · ');
    const updated = item.updated ? `<span>${escapeHtml(copy.updated)} ${escapeHtml(item.updated)}</span>` : '';
    const tags = (item.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
    const links = renderLinks(item.links);

    return `
      <article class="asset-card">
        <div class="asset-card-meta"><span>${meta}</span>${updated}</div>
        <h2>${escapeHtml(localized(item.title))}</h2>
        <p>${escapeHtml(localized(item.summary))}</p>
        ${tags ? `<div class="asset-tags">${tags}</div>` : ''}
        ${links ? `<div class="asset-card-links">${links}</div>` : ''}
      </article>`;
  }

  async function init() {
    language = currentLanguage();
    const kind = document.body.dataset.assetKind;
    if (!['research', 'knowledge'].includes(kind)) return;
    const copy = CHROME[language];

    setText('asset-state', copy.loading);
    try {
      const [assetResponse, homepageResponse] = await Promise.all([
        fetch(`content/generated/${kind}.json`, { cache: 'no-cache' }),
        fetch('content/generated/homepage.json', { cache: 'no-cache' })
      ]);
      if (!assetResponse.ok || !homepageResponse.ok) throw new Error(`Cannot load ${kind} assets`);
      const [data, homepage] = await Promise.all([assetResponse.json(), homepageResponse.json()]);

      renderChrome(homepage);
      document.title = `${localized(data.page.title)} · Li Yucheng`;
      setText('asset-eyebrow', localized(data.page.eyebrow));
      setText('page-title', localized(data.page.title));
      setText('page-description', localized(data.page.description));

      const items = Array.isArray(data.items) ? data.items : [];
      $('#content-grid').innerHTML = items.map(renderCard).join('');
      setText('asset-state', items.length ? '' : copy.empty);

      $$('.asset-language-switch button').forEach((button) => {
        button.addEventListener('click', () => {
          const nextLanguage = button.dataset.language;
          if (!LANGUAGES.includes(nextLanguage)) return;
          localStorage.setItem('lang', nextLanguage);
          const url = new URL(window.location.href);
          url.searchParams.set('lang', nextLanguage);
          window.location.href = url.href;
        });
      });
    } catch (error) {
      console.error(error);
      setText('asset-state', copy.error);
      $('#asset-state')?.classList.add('is-error');
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
