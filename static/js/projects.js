(() => {
  const CATEGORY_LABELS = {
    all: { zh: '全部', 'chinese-traditional': '全部', en: 'All' },
    engineering: { zh: '工程', 'chinese-traditional': '工程', en: 'Engineering' },
    research: { zh: '研究', 'chinese-traditional': '研究', en: 'Research' },
    opensource: { zh: '开源', 'chinese-traditional': '開源', en: 'Open Source' },
    profile: { zh: '身份', 'chinese-traditional': '身分', en: 'Profile' },
    active: { zh: '维护中', 'chinese-traditional': '維護中', en: 'Active' },
    maintained: { zh: '持续维护', 'chinese-traditional': '持續維護', en: 'Maintained' }
  };
  const COPY = {
    zh: {
      eyebrow: '项目',
      value: '把想法做成可运行、可维护、可检验的成果；真正的工程价值来自长期迭代，而不是一次性的漂亮展示。',
      count: '项资产',
      source: '数据驱动 · 持续维护',
      loading: '正在加载项目数据…',
      error: '项目数据加载失败。'
    },
    'chinese-traditional': {
      eyebrow: '專案',
      value: '把想法做成可運行、可維護、可檢驗的成果；真正的工程價值來自長期迭代，而不是一次性的漂亮展示。',
      count: '項資產',
      source: '資料驅動 · 持續維護',
      loading: '正在載入專案資料…',
      error: '專案資料載入失敗。'
    },
    en: {
      eyebrow: 'Projects',
      value: 'Turn ideas into runnable, maintainable, and testable outcomes. Engineering value comes from sustained iteration, not a one-time polished demo.',
      count: 'assets',
      source: 'Data-driven · Maintained',
      loading: 'Loading project data…',
      error: 'Project data failed to load.'
    }
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function label(value) {
    return ArchiveChrome.localized(value);
  }

  function categoryLabel(value) {
    return label(CATEGORY_LABELS[value] || value || '');
  }

  function setState(message, isError = false) {
    const state = $('#projects-status');
    state.textContent = message;
    state.classList.toggle('is-error', isError);
  }

  function renderProjects(data) {
    const language = ArchiveChrome.language;
    const copy = COPY[language];
    const items = Array.isArray(data.items) ? data.items : [];
    const categories = ['all', ...new Set(items.map((item) => item.category).filter(Boolean))];
    let active = 'all';

    document.title = `${label(data.page?.title) || copy.eyebrow} · Li Yucheng`;
    $('#projects-eyebrow').textContent = copy.eyebrow;
    $('#projects-title').textContent = label(data.page?.title) || copy.eyebrow;
    $('#projects-value').textContent = copy.value;
    $('#projects-catalog-note').textContent = label(data.page?.description);
    $('#projects-count').textContent = String(items.length);
    $('#projects-count-label').textContent = copy.count;
    $('#projects-source-note').textContent = copy.source;

    function draw() {
      const visible = active === 'all' ? items : items.filter((item) => item.category === active);
      $('#projects-grid').innerHTML = visible.map((item, index) => {
        const links = (item.links || []).map((entry) => {
          const href = ArchiveChrome.safeExternalUrl(entry.url);
          return href
            ? `<a href="${ArchiveChrome.escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${ArchiveChrome.escapeHtml(label(entry.label))} ↗</a>`
            : '';
        }).join('');
        const tags = (item.tags || []).map((tag) => `<span>${ArchiveChrome.escapeHtml(tag)}</span>`).join('');
        return `
          <article class="archive-catalog-card" id="${ArchiveChrome.escapeHtml(item.id || `project-${index + 1}`)}">
            <div class="catalog-card-header">
              <span class="catalog-card-index">${String(index + 1).padStart(2, '0')} · ${ArchiveChrome.escapeHtml(categoryLabel(item.category))}</span>
              <span class="project-status">${ArchiveChrome.escapeHtml(categoryLabel(item.status) || item.updated || '')}</span>
            </div>
            <h2>${ArchiveChrome.escapeHtml(label(item.title))}</h2>
            <p>${ArchiveChrome.escapeHtml(label(item.summary))}</p>
            ${tags ? `<div class="project-tags">${tags}</div>` : ''}
            ${links ? `<div class="project-links">${links}</div>` : ''}
          </article>`;
      }).join('');
      setState(`${visible.length} / ${items.length}`);
    }

    $('#projects-filters').innerHTML = categories.map((category) =>
      `<button type="button" class="catalog-filter${category === active ? ' is-active' : ''}" data-category="${ArchiveChrome.escapeHtml(category)}">${ArchiveChrome.escapeHtml(categoryLabel(category))}</button>`
    ).join('');

    $('#projects-filters').addEventListener('click', (event) => {
      const button = event.target.closest('button[data-category]');
      if (!button) return;
      active = button.dataset.category;
      $$('#projects-filters button').forEach((candidate) => candidate.classList.toggle('is-active', candidate === button));
      draw();
    });
    draw();
  }

  async function init() {
    const copy = COPY[ArchiveChrome.language];
    setState(copy.loading);
    try {
      const response = await fetch('content/generated/projects.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Projects HTTP ${response.status}`);
      renderProjects(await response.json());
    } catch (error) {
      console.error(error);
      setState(copy.error, true);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
