(() => {
  const LANGUAGES = ['zh', 'chinese-traditional', 'en'];
  const HTML_LANG = { zh: 'zh-CN', 'chinese-traditional': 'zh-Hant', en: 'en' };
  const COPY = {
    zh: {
      eyebrow: '即时动态', title: '即时动态', description: '这里仅展示标题与日期；打开条目进入全文。',
      home: '主页', projects: '项目', research: '研究', knowledge: '知识',
      loading: '正在加载动态…', empty: '当前没有公开动态。', error: '动态配置加载失败。'
    },
    'chinese-traditional': {
      eyebrow: '即時動態', title: '即時動態', description: '此處僅展示標題與日期；開啟條目進入全文。',
      home: '主頁', projects: '專案', research: '研究', knowledge: '知識',
      loading: '正在載入動態…', empty: '目前沒有公開動態。', error: '動態設定載入失敗。'
    },
    en: {
      eyebrow: 'Update Log', title: 'Updates', description: 'Titles and dates are shown here. Open an entry to read the full record.',
      home: 'Home', projects: 'Projects', research: 'Research', knowledge: 'Knowledge',
      loading: 'Loading updates…', empty: 'No public updates yet.', error: 'Update configuration failed to load.'
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

  function normalizePostPath(value) {
    let path = String(value || '').trim();
    if (!path) return '';
    if (!path.includes('/')) return `posts/${language}/${path}`;
    if (path.startsWith('posts/')) {
      const segments = path.split('/');
      if (segments.length === 2) return `posts/${language}/${segments[1]}`;
      if (!LANGUAGES.includes(segments[1])) return `posts/${language}/${segments.slice(1).join('/')}`;
    }
    return path;
  }

  function setState(message, isError = false) {
    const state = $('#archive-state');
    state.textContent = message;
    state.classList.toggle('is-error', isError);
    state.classList.toggle('is-hidden', !message);
  }

  function renderChrome(homepage) {
    const copy = COPY[language];
    document.documentElement.lang = HTML_LANG[language];
    document.title = `${copy.title} · Li Yucheng`;
    $('#posts-brand').textContent = homepage?.chrome?.brand?.[language] || homepage?.chrome?.brand?.zh || 'Graphite Archive';
    $('#posts-home').textContent = copy.home;
    $('#posts-projects').textContent = copy.projects;
    $('#posts-research').textContent = copy.research;
    $('#posts-knowledge').textContent = copy.knowledge;
    $('#posts-eyebrow').textContent = copy.eyebrow;
    $('#posts-title').textContent = copy.title;
    $('#posts-description').textContent = copy.description;

    $$('[data-preserve-lang]').forEach((link) => {
      link.href = withLanguage(link.getAttribute('href'));
    });

    $$('.archive-language button').forEach((button) => {
      const active = button.dataset.language === language;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function renderPosts(posts) {
    const normalized = (Array.isArray(posts) ? posts : [])
      .filter((post) => post && post.file)
      .map((post) => ({
        title: post.title || post.file,
        date: post.date || '—',
        file: normalizePostPath(post.file)
      }))
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));

    if (!normalized.length) {
      $('#posts-list').innerHTML = `<p class="evidence-empty">${escapeHtml(COPY[language].empty)}</p>`;
      return;
    }

    $('#posts-list').innerHTML = normalized.map((post) => {
      const href = `post.html?lang=${encodeURIComponent(language)}&f=${encodeURIComponent(post.file)}`;
      return `
        <article class="post-list-item">
          <time>${escapeHtml(post.date)}</time>
          <a href="${escapeHtml(href)}">${escapeHtml(post.title)}</a>
        </article>`;
    }).join('');
  }

  async function init() {
    language = currentLanguage();
    setState(COPY[language].loading);
    try {
      const [configResponse, homepageResponse] = await Promise.all([
        fetch(`contents/config.${language}.yml`, { cache: 'no-cache' }),
        fetch('content/generated/homepage.json', { cache: 'no-cache' })
      ]);
      if (!configResponse.ok || !homepageResponse.ok) throw new Error('Cannot load update configuration');
      const [configText, homepage] = await Promise.all([configResponse.text(), homepageResponse.json()]);
      const config = jsyaml.load(configText) || {};
      renderChrome(homepage);
      renderPosts(config.posts);
      setState('');

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
    } catch (error) {
      console.error(error);
      setState(COPY[language].error, true);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
