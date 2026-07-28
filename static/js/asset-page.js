const ASSET_LANGS = ['zh', 'chinese-traditional', 'en'];
const LANGUAGE_META = {
  zh: { html: 'zh-CN', label: '简体中文' },
  'chinese-traditional': { html: 'zh-Hant', label: '繁體中文' },
  en: { html: 'en', label: 'English' },
};

const CHROME_COPY = {
  zh: {
    brand: '李宇成 · 个人主页', home: '主页', projects: '项目', research: '研究', knowledge: '知识库', posts: '动态',
    loading: '正在加载内容…', empty: '当前尚无公开内容。', error: '内容加载失败，请刷新页面或返回主页。',
    updated: '更新', footer: '内容由 YAML 数据源生成并随仓库版本维护。',
  },
  'chinese-traditional': {
    brand: '李宇成 · 個人主頁', home: '主頁', projects: '專案', research: '研究', knowledge: '知識庫', posts: '動態',
    loading: '正在載入內容…', empty: '目前尚無公開內容。', error: '內容載入失敗，請重新整理頁面或返回主頁。',
    updated: '更新', footer: '內容由 YAML 資料來源產生並隨儲存庫版本維護。',
  },
  en: {
    brand: 'Li Yucheng · Homepage', home: 'Home', projects: 'Projects', research: 'Research', knowledge: 'Knowledge', posts: 'Updates',
    loading: 'Loading content…', empty: 'No public entries yet.', error: 'Unable to load this catalog. Refresh the page or return home.',
    updated: 'Updated', footer: 'Content is generated from YAML sources and versioned with the repository.',
  },
};

function currentLanguage() {
  const requested = new URL(window.location.href).searchParams.get('lang');
  if (ASSET_LANGS.includes(requested)) return requested;
  const saved = localStorage.getItem('lang');
  return ASSET_LANGS.includes(saved) ? saved : 'chinese-traditional';
}

function localized(value, lang) {
  if (typeof value === 'string') return value;
  return value?.[lang] || value?.zh || '';
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

function withLanguage(href, lang) {
  const url = new URL(href, window.location.href);
  url.searchParams.set('lang', lang);
  return `${url.pathname}${url.search}${url.hash}`;
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function applyChrome(lang) {
  const copy = CHROME_COPY[lang];
  document.documentElement.lang = LANGUAGE_META[lang].html;
  setText('asset-brand', copy.brand);
  setText('asset-nav-home', copy.home);
  setText('asset-nav-projects', copy.projects);
  setText('asset-nav-research', copy.research);
  setText('asset-nav-knowledge', copy.knowledge);
  setText('asset-nav-posts', copy.posts);
  setText('asset-footer-copy', copy.footer);

  document.querySelectorAll('[data-preserve-lang]').forEach((link) => {
    link.href = withLanguage(link.getAttribute('href'), lang);
  });

  document.querySelectorAll('[data-language]').forEach((button) => {
    const buttonLang = button.dataset.language;
    button.classList.toggle('is-active', buttonLang === lang);
    button.setAttribute('aria-pressed', String(buttonLang === lang));
    button.title = LANGUAGE_META[buttonLang]?.label || buttonLang;
  });
}

function renderLinks(links, lang) {
  return (links || []).map((link) => {
    const href = safeExternalUrl(link.url);
    if (!href) return '';
    return `<a class="asset-card-link" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(localized(link.label, lang))}<span aria-hidden="true">↗</span></a>`;
  }).join('');
}

function renderCard(item, lang) {
  const copy = CHROME_COPY[lang];
  const meta = [item.category, item.status].filter(Boolean).map(escapeHtml).join(' · ');
  const updated = item.updated ? `<span>${escapeHtml(copy.updated)} ${escapeHtml(item.updated)}</span>` : '';
  const tags = (item.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
  const links = renderLinks(item.links, lang);

  return `
    <article class="asset-card">
      <div class="asset-card-meta"><span>${meta}</span>${updated}</div>
      <h2>${escapeHtml(localized(item.title, lang))}</h2>
      <p>${escapeHtml(localized(item.summary, lang))}</p>
      ${tags ? `<div class="asset-tags">${tags}</div>` : ''}
      ${links ? `<div class="asset-card-links">${links}</div>` : ''}
    </article>`;
}

async function loadAssetPage() {
  const kind = document.body.dataset.assetKind;
  if (!['research', 'knowledge'].includes(kind)) throw new Error('Unsupported asset page');

  const lang = currentLanguage();
  const copy = CHROME_COPY[lang];
  applyChrome(lang);
  setText('asset-state', copy.loading);

  try {
    const response = await fetch(`content/generated/${kind}.json`, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Cannot load ${kind} assets (${response.status})`);
    const data = await response.json();

    document.title = `${localized(data.page.title, lang)} · Li Yucheng`;
    setText('asset-eyebrow', localized(data.page.eyebrow, lang));
    setText('page-title', localized(data.page.title, lang));
    setText('page-description', localized(data.page.description, lang));

    const items = Array.isArray(data.items) ? data.items : [];
    document.getElementById('content-grid').innerHTML = items.map((item) => renderCard(item, lang)).join('');
    setText('asset-state', items.length ? '' : copy.empty);
  } catch (error) {
    console.error(error);
    setText('asset-state', copy.error);
    document.getElementById('asset-state')?.classList.add('is-error');
  }
}

document.querySelectorAll('[data-language]').forEach((button) => {
  button.addEventListener('click', () => {
    const lang = button.dataset.language;
    if (!ASSET_LANGS.includes(lang)) return;
    localStorage.setItem('lang', lang);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.location.href = url.href;
  });
});

document.addEventListener('DOMContentLoaded', loadAssetPage);
