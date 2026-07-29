(() => {
  const LANGUAGES = ['zh', 'chinese-traditional', 'en'];
  const HTML_LANG = { zh: 'zh-CN', 'chinese-traditional': 'zh-Hant', en: 'en' };
  const CATEGORY_LABELS = {
    all: { zh: '全部', 'chinese-traditional': '全部', en: 'All' },
    engineering: { zh: '工程', 'chinese-traditional': '工程', en: 'Engineering' },
    research: { zh: '研究', 'chinese-traditional': '研究', en: 'Research' },
    opensource: { zh: '开源', 'chinese-traditional': '開源', en: 'Open Source' },
    profile: { zh: '身份', 'chinese-traditional': '身分', en: 'Profile' }
  };
  const CHROME = {
    zh: {
      home: '主页', research: '研究', knowledge: '知识', updates: '动态',
      eyebrow: '项目资产', count: '项资产', source: '由单一数据源持续维护。',
      loading: '正在加载项目数据…', error: '项目数据加载失败。'
    },
    'chinese-traditional': {
      home: '主頁', research: '研究', knowledge: '知識', updates: '動態',
      eyebrow: '專案資產', count: '項資產', source: '由單一資料來源持續維護。',
      loading: '正在載入專案資料…', error: '專案資料載入失敗。'
    },
    en: {
      home: 'Home', research: 'Research', knowledge: 'Knowledge', updates: 'Updates',
      eyebrow: 'Project Assets', count: 'assets', source: 'Generated from a single maintained data source.',
      loading: 'Loading project data…', error: 'Project data failed to load.'
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

  function withLanguage(target) {
    const raw = String(target || '');
    if (!raw || /^(https?:|mailto:)/i.test(raw)) return raw;
    const url = new URL(raw, window.location.href);
    url.searchParams.set('lang', language);
    return `${url.pathname.replace(/^\//, '')}${url.search}${url.hash}`;
  }

  function safeExternalUrl(value) {
    try {
      const url = new URL(String(value));
      return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  }

  function renderChrome(homepage) {
    const copy = CHROME[language];
    document.documentElement.lang = HTML_LANG[language];
    $('#projects-site-name').textContent = localized(homepage.chrome.brand);
    $('#projects-home-link').textContent = copy.home;
    $('#projects-research-link').textContent = copy.research;
    $('#projects-knowledge-link').textContent = copy.knowledge;
    $('#projects-posts-link').textContent = copy.updates;
    $('#projects-eyebrow').textContent = copy.eyebrow;
    $('#projects-count-label').textContent = copy.count;
    $('#projects-source-note').textContent = copy.source;
    $('#projects-status').textContent = copy.loading;

    $$('[data-preserve-lang]').forEach((link) => {
      link.href = withLanguage(link.getAttribute('href'));
    });

    $$('.projects-language button').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.lang === language);
    });
  }

  function renderProjects(data) {
    const items = Array.isArray(data.items) ? data.items : [];
    const categories = ['all', ...new Set(items.map((item) => item.category).filter(Boolean))];
    let active = 'all';

    $('#projects-count').textContent = String(items.length);
    document.title = `${localized(data.page?.title) || 'Projects'} · Li Yucheng`;
    $('#projects-title').textContent = localized(data.page?.title);
    $('#projects-description').textContent = localized(data.page?.description);

    function draw() {
      const visible = active === 'all' ? items : items.filter((item) => item.category === active);
      $('#projects-grid').innerHTML = visible.map((item) => {
        const links = (item.links || []).map((link) => {
          const href = safeExternalUrl(link.url);
          if (!href) return '';
          return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(localized(link.label))} ↗</a>`;
        }).join('');
        return `
          <article class="project-card">
            <div class="project-card-top">
              <span class="project-category">${escapeHtml(localized(CATEGORY_LABELS[item.category] || item.category))}</span>
              <span class="project-status">${escapeHtml(item.status || '')}</span>
            </div>
            <h2>${escapeHtml(localized(item.title))}</h2>
            <p>${escapeHtml(localized(item.summary))}</p>
            <div class="project-tags">${(item.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
            <div class="project-links">${links}</div>
          </article>`;
      }).join('');
      $('#projects-status').textContent = `${visible.length} / ${items.length}`;
    }

    $('#projects-filters').innerHTML = categories.map((category) =>
      `<button type="button" class="project-filter${category === active ? ' active' : ''}" data-category="${escapeHtml(category)}">${escapeHtml(localized(CATEGORY_LABELS[category] || category))}</button>`
    ).join('');

    $('#projects-filters').addEventListener('click', (event) => {
      const button = event.target.closest('button[data-category]');
      if (!button) return;
      active = button.dataset.category;
      $$('#projects-filters button').forEach((candidate) => candidate.classList.toggle('active', candidate === button));
      draw();
    });

    draw();
  }

  async function init() {
    language = currentLanguage();
    try {
      const [projectResponse, homepageResponse] = await Promise.all([
        fetch('content/generated/projects.json', { cache: 'no-cache' }),
        fetch('content/generated/homepage.json', { cache: 'no-cache' })
      ]);
      if (!projectResponse.ok || !homepageResponse.ok) throw new Error('Cannot load project assets');
      const [projects, homepage] = await Promise.all([projectResponse.json(), homepageResponse.json()]);
      renderChrome(homepage);
      renderProjects(projects);

      $$('.projects-language button').forEach((button) => {
        button.addEventListener('click', () => {
          const nextLanguage = button.dataset.lang;
          if (!LANGUAGES.includes(nextLanguage)) return;
          localStorage.setItem('lang', nextLanguage);
          const url = new URL(window.location.href);
          url.searchParams.set('lang', nextLanguage);
          window.location.href = url.href;
        });
      });
    } catch (error) {
      console.error(error);
      $('#projects-status').textContent = CHROME[language].error;
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
