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
      error: '项目数据加载失败。',
      assetsLink: '成果资产',
      collaborationLink: '协作与实践',
      assetsLabel: '01 / 成果资产',
      assetsTitle: '成果资产',
      assetsDescription: '软件、开源工程与长期维护项目，按实际可运行成果归档。',
      collaborationLabel: '02 / 协作与实践',
      collaborationTitle: '协作与实践',
      collaborationDescription: '工程成果并非独立生成；这里记录组织、沟通、服务与共同交付形成的协作能力。',
      experienceTitle: '协作经历',
      experienceDescription: '学生工作与企业实践中形成的沟通、组织和交付记录。',
      practiceTitle: '社会实践',
      practiceDescription: '面向学校、公益与志愿服务的长期协同实践。'
    },
    'chinese-traditional': {
      eyebrow: '專案',
      value: '把想法做成可運行、可維護、可檢驗的成果；真正的工程價值來自長期迭代，而不是一次性的漂亮展示。',
      count: '項資產',
      source: '資料驅動 · 持續維護',
      loading: '正在載入專案資料…',
      error: '專案資料載入失敗。',
      assetsLink: '成果資產',
      collaborationLink: '協作與實踐',
      assetsLabel: '01 / 成果資產',
      assetsTitle: '成果資產',
      assetsDescription: '軟體、開源工程與長期維護專案，按實際可運行成果歸檔。',
      collaborationLabel: '02 / 協作與實踐',
      collaborationTitle: '協作與實踐',
      collaborationDescription: '工程成果並非獨立生成；此處記錄組織、溝通、服務與共同交付形成的協作能力。',
      experienceTitle: '協作經歷',
      experienceDescription: '學生工作與企業實踐中形成的溝通、組織與交付記錄。',
      practiceTitle: '社會實踐',
      practiceDescription: '面向學校、公益與志願服務的長期協同實踐。'
    },
    en: {
      eyebrow: 'Projects',
      value: 'Turn ideas into runnable, maintainable, and testable outcomes. Engineering value comes from sustained iteration, not a one-time polished demo.',
      count: 'assets',
      source: 'Data-driven · Maintained',
      loading: 'Loading project data…',
      error: 'Project data failed to load.',
      assetsLink: 'Project assets',
      collaborationLink: 'Collaboration & practice',
      assetsLabel: '01 / PROJECT ASSETS',
      assetsTitle: 'Project Assets',
      assetsDescription: 'Software, open-source engineering, and maintained projects archived by runnable outcomes.',
      collaborationLabel: '02 / COLLABORATION',
      collaborationTitle: 'Collaboration & Practice',
      collaborationDescription: 'Engineering outcomes are not produced alone. This section records organization, communication, service, and shared delivery.',
      experienceTitle: 'Collaborative Experience',
      experienceDescription: 'Communication, organization, and delivery developed through student work and industry practice.',
      practiceTitle: 'Public Practice',
      practiceDescription: 'Long-term collaboration across schools, public service, and volunteering.'
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

  function splitTopLevelSections(markdown) {
    const normalized = String(markdown || '').replace(/\r\n/g, '\n');
    const matches = [...normalized.matchAll(/^#\s+.+$/gm)];
    if (!matches.length) return [normalized];
    return matches.map((match, index) => {
      const start = match.index;
      const end = index + 1 < matches.length ? matches[index + 1].index : normalized.length;
      return normalized.slice(start, end).trim();
    });
  }

  async function fetchMarkdown(section) {
    const response = await fetch(`contents/${ArchiveChrome.language}/${section}.md`, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Cannot load ${section} (${response.status})`);
    return response.text();
  }

  function contextCard(title, description, body, index) {
    return `
      <article class="context-card">
        <div class="context-card-heading">
          <span class="catalog-card-index">${String(index).padStart(2, '0')}</span>
          <div>
            <h3>${ArchiveChrome.escapeHtml(title)}</h3>
            <p>${ArchiveChrome.escapeHtml(description)}</p>
          </div>
        </div>
        <div class="archive-markdown">${marked.parse(body)}</div>
      </article>`;
  }

  async function renderCollaboration(copy) {
    const [experience, practice] = await Promise.all([
      fetchMarkdown('experience'),
      fetchMarkdown('practice')
    ]);

    // Exchange study belongs to Learning. Keep only student work and industry practice here.
    const collaborationExperience = splitTopLevelSections(experience).slice(1).join('\n\n');
    $('#collaboration-grid').innerHTML = [
      contextCard(copy.experienceTitle, copy.experienceDescription, collaborationExperience, 1),
      contextCard(copy.practiceTitle, copy.practiceDescription, practice, 2)
    ].join('');
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
    $('#projects-assets-link').textContent = copy.assetsLink;
    $('#projects-collaboration-link').textContent = copy.collaborationLink;
    $('#project-assets-label').textContent = copy.assetsLabel;
    $('#project-assets-title').textContent = copy.assetsTitle;
    $('#project-assets-description').textContent = copy.assetsDescription;
    $('#collaboration-label').textContent = copy.collaborationLabel;
    $('#collaboration-title').textContent = copy.collaborationTitle;
    $('#collaboration-description').textContent = copy.collaborationDescription;

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
      const [response] = await Promise.all([
        fetch('content/generated/projects.json', { cache: 'no-cache' }),
        renderCollaboration(copy)
      ]);
      if (!response.ok) throw new Error(`Projects HTTP ${response.status}`);
      renderProjects(await response.json());
    } catch (error) {
      console.error(error);
      setState(copy.error, true);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
