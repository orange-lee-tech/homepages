const FEATURED_LANGS = ['zh', 'en', 'chinese-traditional'];

function getFeaturedLang() {
  const url = new URL(window.location.href);
  const requested = url.searchParams.get('lang');
  if (FEATURED_LANGS.includes(requested)) return requested;
  const saved = localStorage.getItem('lang');
  return FEATURED_LANGS.includes(saved) ? saved : 'zh';
}

function featuredText(value, lang) {
  if (typeof value === 'string') return value;
  return value?.[lang] || value?.zh || '';
}

function escapeFeaturedHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function featuredWithLang(href, lang) {
  const url = new URL(href, window.location.href);
  url.searchParams.set('lang', lang);
  return url.pathname + url.search + url.hash;
}

function applyFeaturedStaticText(lang) {
  const copy = {
    zh: {
      nav: '项目资产',
      title: '精选项目',
      description: '持续维护的软件工程、科研探索与开源资产。',
      all: '查看全部项目',
      updated: '更新'
    },
    'chinese-traditional': {
      nav: '專案資產',
      title: '精選專案',
      description: '持續維護的軟體工程、科研探索與開源資產。',
      all: '查看全部專案',
      updated: '更新'
    },
    en: {
      nav: 'Projects',
      title: 'Featured Projects',
      description: 'Maintained software, research explorations, and open-source assets.',
      all: 'View all projects',
      updated: 'Updated'
    }
  }[lang];

  const nav = document.getElementById('nav-projects');
  const navLink = document.getElementById('nav-projects-link');
  const title = document.getElementById('featured-projects-title-text');
  const description = document.getElementById('featured-projects-description');
  const all = document.getElementById('featured-projects-all');

  if (nav) nav.textContent = copy.nav;
  if (navLink) navLink.href = featuredWithLang('projects.html', lang);
  if (title) title.textContent = copy.title;
  if (description) description.textContent = copy.description;
  if (all) {
    all.textContent = copy.all;
    all.href = featuredWithLang('projects.html', lang);
  }
  return copy;
}

async function renderFeaturedProjects() {
  const lang = getFeaturedLang();
  const copy = applyFeaturedStaticText(lang);
  const grid = document.getElementById('featured-projects-grid');
  const state = document.getElementById('featured-projects-state');
  if (!grid) return;

  const response = await fetch('content/generated/projects.json?v=' + Date.now(), { cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to load projects: ${response.status}`);
  const data = await response.json();
  const items = (data.items || [])
    .filter((item) => item.featured)
    .sort((a, b) => String(b.updated || '').localeCompare(String(a.updated || '')))
    .slice(0, 3);

  grid.innerHTML = items.map((item) => {
    const firstLink = (item.links || [])[0];
    const title = escapeFeaturedHtml(featuredText(item.title, lang));
    const summary = escapeFeaturedHtml(featuredText(item.summary, lang));
    const tags = (item.tags || []).slice(0, 4).map((tag) => `<span>${escapeFeaturedHtml(tag)}</span>`).join('');
    const link = firstLink
      ? `<a class="featured-project-link" href="${escapeFeaturedHtml(firstLink.url)}" target="_blank" rel="noopener">${escapeFeaturedHtml(featuredText(firstLink.label, lang))}<i class="bi bi-arrow-up-right"></i></a>`
      : `<a class="featured-project-link" href="${featuredWithLang('projects.html', lang)}">${escapeFeaturedHtml(copy.all)}<i class="bi bi-arrow-right"></i></a>`;

    return `<article class="featured-project-card">
      <div class="featured-project-meta">
        <span>${escapeFeaturedHtml(item.category || '')}</span>
        <span>${escapeFeaturedHtml(copy.updated)} ${escapeFeaturedHtml(item.updated || '')}</span>
      </div>
      <h3>${title}</h3>
      <p>${summary}</p>
      <div class="featured-project-tags">${tags}</div>
      ${link}
    </article>`;
  }).join('');

  if (state) state.hidden = true;
}

window.addEventListener('DOMContentLoaded', () => {
  renderFeaturedProjects().catch((error) => {
    console.error(error);
    const state = document.getElementById('featured-projects-state');
    if (state) state.textContent = 'Featured projects are temporarily unavailable.';
  });
});
