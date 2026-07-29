(() => {
  const LANGUAGES = ['zh', 'chinese-traditional', 'en'];
  const HTML_LANG = { zh: 'zh-CN', 'chinese-traditional': 'zh-Hant', en: 'en' };
  const COPY = {
    zh: { eyebrow: '动态记录', post: '动态', updates: '返回动态', home: '主页', loading: '正在加载记录…', invalid: '缺少或非法的文章路径。', error: '文章加载失败，请检查路径与文件名大小写。', date: '日期：' },
    'chinese-traditional': { eyebrow: '動態記錄', post: '動態', updates: '返回動態', home: '主頁', loading: '正在載入記錄…', invalid: '缺少或非法的文章路徑。', error: '文章載入失敗，請檢查路徑與檔名大小寫。', date: '日期：' },
    en: { eyebrow: 'Update Record', post: 'Post', updates: 'Back to updates', home: 'Home', loading: 'Loading record…', invalid: 'The post path is missing or invalid.', error: 'The post failed to load. Check its path and filename case.', date: 'Date: ' }
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

  function withLanguage(target) {
    const raw = String(target || '');
    const url = new URL(raw, window.location.href);
    url.searchParams.set('lang', language);
    return `${url.pathname.replace(/^\//, '')}${url.search}${url.hash}`;
  }

  function safePath(value) {
    const path = String(value || '').trim();
    if (!path || path.includes('..') || path.startsWith('/') || path.startsWith('\\')) return '';
    return path;
  }

  function normalizePostPath(value) {
    const path = safePath(value);
    if (!path) return '';
    if (!path.includes('/')) return `posts/${language}/${path}`;
    if (path.startsWith('posts/')) {
      const segments = path.split('/');
      if (segments.length === 2) return `posts/${language}/${segments[1]}`;
      if (!LANGUAGES.includes(segments[1])) return `posts/${language}/${segments.slice(1).join('/')}`;
    }
    return path;
  }

  function splitFrontMatter(markdown) {
    const match = markdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/);
    if (!match) return { frontMatter: {}, body: markdown };
    let frontMatter = {};
    try {
      frontMatter = jsyaml.load(match[1]) || {};
    } catch {}
    return { frontMatter, body: markdown.slice(match[0].length) };
  }

  function formatDate(value, path) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
    const raw = String(value || '');
    const match = raw.match(/\d{4}-\d{2}-\d{2}/) || String(path).match(/\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : raw;
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
    $('#post-brand').textContent = homepage?.chrome?.brand?.[language] || homepage?.chrome?.brand?.zh || 'Graphite Archive';
    $('#post-eyebrow').textContent = copy.eyebrow;
    $('#post-list-link').textContent = copy.updates;
    $('#post-home-link').textContent = copy.home;
    $('#post-footer-list').textContent = copy.updates;
    $$('[data-preserve-lang]').forEach((link) => {
      link.href = withLanguage(link.getAttribute('href'));
    });
  }

  async function init() {
    language = currentLanguage();
    const copy = COPY[language];
    setState(copy.loading);

    try {
      const homepageResponse = await fetch('content/generated/homepage.json', { cache: 'no-cache' });
      const homepage = homepageResponse.ok ? await homepageResponse.json() : null;
      renderChrome(homepage);

      const path = normalizePostPath(new URL(window.location.href).searchParams.get('f'));
      if (!path) {
        $('#post-title').textContent = copy.post;
        $('#post-body').innerHTML = `<p class="evidence-empty">${copy.invalid}</p>`;
        setState('', true);
        return;
      }

      const response = await fetch(encodeURI(path), { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Cannot load ${path} (${response.status})`);
      const markdown = await response.text();
      const { frontMatter, body } = splitFrontMatter(markdown);
      const title = String(frontMatter.title || copy.post);
      const date = formatDate(frontMatter.date, path);

      document.title = `${title} · Li Yucheng`;
      $('#post-title').textContent = title;
      $('#post-meta').textContent = date ? `${copy.date}${date}` : '';
      $('#post-body').innerHTML = marked.parse(body);
      setState('');
    } catch (error) {
      console.error(error);
      $('#post-body').innerHTML = `<p class="evidence-empty">${copy.error}</p>`;
      setState(copy.error, true);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
