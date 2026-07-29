(() => {
  const LANGUAGES = ['zh', 'chinese-traditional', 'en'];
  const HTML_LANG = { zh: 'zh-CN', 'chinese-traditional': 'zh-Hant', en: 'en' };
  const COPY = {
    zh: { home: '主页', projects: '项目', research: '研究', knowledge: '知识', posts: '动态', gallery: '影像', loading: '正在加载内容…', empty: '当前尚无公开内容。', error: '内容加载失败，请刷新页面或返回主页。', updated: '更新', open: '打开记录' },
    'chinese-traditional': { home: '主頁', projects: '專案', research: '研究', knowledge: '知識', posts: '動態', gallery: '影像', loading: '正在載入內容…', empty: '目前尚無公開內容。', error: '內容載入失敗，請重新整理頁面或返回主頁。', updated: '更新', open: '開啟記錄' },
    en: { home: 'Home', projects: 'Projects', research: 'Research', knowledge: 'Knowledge', posts: 'Updates', gallery: 'Gallery', loading: 'Loading content…', empty: 'No public entries yet.', error: 'Unable to load this catalog. Refresh the page or return home.', updated: 'Updated', open: 'Open record' }
  };
  const LABELS = {
    engineering: { zh: '工程', 'chinese-traditional': '工程', en: 'Engineering' },
    research: { zh: '研究', 'chinese-traditional': '研究', en: 'Research' },
    publication: { zh: '论文', 'chinese-traditional': '論文', en: 'Publication' },
    submitted: { zh: '已投稿', 'chinese-traditional': '已投稿', en: 'Submitted' }
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
    return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  }

  function safeExternalUrl(value) {
    try {
      const url = new URL(String(value));
      return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
    } catch { return null; }
  }

  function withLanguage(target) {
    const raw = String(target || '');
    if (!raw || /^(https?:|mailto:)/i.test(raw)) return raw;
    const url = new URL(raw, window.location.href);
    url.searchParams.set('lang', language);
    return `${url.pathname.replace(/^\//, '')}${url.search}${url.hash}`;
  }

  function setText(id, value) { const element = document.getElementById(id); if (element) element.textContent = value; }
  function label(value) { return localized(LABELS[value] || value); }

  function renderChrome(homepage) {
    const copy = COPY[language];
    document.documentElement.lang = HTML_LANG[language];
    setText('asset-brand', localized(homepage.chrome.brand));
    setText('asset-home', copy.home);
    setText('asset-projects', copy.projects);
    setText('asset-research', copy.research);
    setText('asset-knowledge', copy.knowledge);
    setText('asset-posts', copy.posts);
    setText('asset-gallery', copy.gallery);
    $$('[data-preserve-lang]').forEach((link) => { link.href = withLanguage(link.getAttribute('href')); });
    $$('.subpage-language button').forEach((button) => {
      const active = button.dataset.language === language;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function renderLinks(links) {
    return (links || []).map((link) => {
      const href = safeExternalUrl(link.url);
      if (!href) return '';
      return `<a class="asset-card-link" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(localized(link.label))}<span aria-hidden="true"> ↗</span></a>`;
    }).join('');
  }

  function renderCard(item, index) {
    const copy = COPY[language];
    const descriptors = [item.category, item.status].filter(Boolean).map(label).filter(Boolean);
    const tags = (item.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
    const links = renderLinks(item.links);
    return `<article class="asset-card archive-catalog-card" id="${escapeHtml(item.id || `asset-${index + 1}`)}">
      <div class="asset-card-meta catalog-card-header">
        <span class="catalog-card-index">${String(index + 1).padStart(2, '0')}</span>
        <span>${escapeHtml(descriptors.join(' · ') || (item.updated ? `${copy.updated} ${item.updated}` : 'ARCHIVE'))}</span>
      </div>
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
    const copy = COPY[language];
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
      $$('.subpage-language button').forEach((button) => button.addEventListener('click', () => {
        const nextLanguage = button.dataset.language;
        if (!LANGUAGES.includes(nextLanguage)) return;
        localStorage.setItem('lang', nextLanguage);
        const url = new URL(window.location.href);
        url.searchParams.set('lang', nextLanguage);
        window.location.href = url.href;
      }));
    } catch (error) {
      console.error(error);
      setText('asset-state', copy.error);
      $('#asset-state')?.classList.add('is-error');
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
