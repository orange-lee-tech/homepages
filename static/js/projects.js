const PROJECT_LANG_KEY = 'projects-lang';

function getProjectLang() {
  const url = new URL(window.location.href);
  const lang = url.searchParams.get('lang');
  if (['zh', 'en', 'chinese-traditional'].includes(lang)) {
    localStorage.setItem(PROJECT_LANG_KEY, lang);
    return lang;
  }
  return localStorage.getItem(PROJECT_LANG_KEY) || localStorage.getItem('lang') || 'zh';
}

function withLang(href, lang) {
  const url = new URL(href, window.location.href);
  url.searchParams.set('lang', lang);
  return url.pathname + url.search + url.hash;
}

const text = (value, lang) => {
  if (typeof value === 'string') return value;
  return value?.[lang] || value?.zh || '';
};

function renderProjects(data, lang) {
  const items = data.items || [];
  const grid = document.getElementById('projects-grid');
  const filters = document.getElementById('projects-filters');
  const status = document.getElementById('projects-status');
  const count = document.getElementById('projects-count');

  count.textContent = items.length;

  const categories = ['all', ...new Set(items.map(item => item.category))];
  const categoryLabels = {
    all: { zh: '全部', 'chinese-traditional': '全部', en: 'All' },
    engineering: { zh: '工程', 'chinese-traditional': '工程', en: 'Engineering' },
    research: { zh: '研究', 'chinese-traditional': '研究', en: 'Research' },
    opensource: { zh: '开源', 'chinese-traditional': '開源', en: 'Open Source' },
    profile: { zh: '身份', 'chinese-traditional': '身分', en: 'Profile' }
  };

  let active = 'all';

  function draw() {
    const visible = active === 'all' ? items : items.filter(item => item.category === active);
    grid.innerHTML = visible.map(item => `
      <article class="project-card">
        <div class="project-card-top">
          <span class="project-category">${text(categoryLabels[item.category] || item.category, lang)}</span>
          <span class="project-status">${item.status || ''}</span>
        </div>
        <h2>${text(item.title, lang)}</h2>
        <p>${text(item.summary, lang)}</p>
        <div class="project-tags">${(item.tags || []).map(tag => `<span>${tag}</span>`).join('')}</div>
        <div class="project-links">
          ${(item.links || []).map(link => `<a target="_blank" rel="noopener" href="${link.url}">${text(link.label, lang)}</a>`).join('')}
        </div>
      </article>
    `).join('');
    status.textContent = `${visible.length} / ${items.length}`;
  }

  filters.innerHTML = categories.map(category =>
    `<button class="project-filter ${category === active ? 'active' : ''}" data-category="${category}">${text(categoryLabels[category] || category, lang)}</button>`
  ).join('');

  filters.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      active = button.dataset.category;
      filters.querySelectorAll('button').forEach(item => item.classList.toggle('active', item === button));
      draw();
    });
  });

  draw();
}

async function initProjects() {
  const lang = getProjectLang();
  document.querySelectorAll('[data-lang]').forEach(button => {
    button.addEventListener('click', () => {
      localStorage.setItem('lang', button.dataset.lang);
      window.location.href = withLang('projects.html', button.dataset.lang);
    });
  });

  const response = await fetch('content/generated/projects.json?v=' + Date.now());
  const data = await response.json();
  const page = data.page || {};

  document.getElementById('projects-title').textContent = text(page.title, lang);
  document.getElementById('projects-description').textContent = text(page.description, lang);
  renderProjects(data, lang);
}

initProjects().catch(error => {
  console.error(error);
  document.getElementById('projects-status').textContent = 'Failed to load projects.';
});
