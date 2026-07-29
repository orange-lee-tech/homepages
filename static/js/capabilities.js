(() => {
  const LANGUAGES = ['zh', 'chinese-traditional', 'en'];
  const HTML_LANG = { zh: 'zh-CN', 'chinese-traditional': 'zh-Hant', en: 'en' };
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
    if (!raw || raw.startsWith('#') || /^(https?:|mailto:)/i.test(raw)) return raw;
    const url = new URL(raw, window.location.href);
    url.searchParams.set('lang', language);
    return `${url.pathname.replace(/^\//, '')}${url.search}${url.hash}`;
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function setState(message, isError = false) {
    const element = $('#archive-state');
    element.textContent = message;
    element.classList.toggle('is-error', isError);
    element.classList.toggle('is-hidden', !message);
  }

  function renderChrome(homepage) {
    document.documentElement.lang = HTML_LANG[language];
    setText('capability-brand', localized(homepage.chrome.brand));
    setText('capability-home', language === 'en' ? 'Home' : language === 'zh' ? '主页' : '主頁');
    setText('capability-projects', language === 'en' ? 'Projects' : language === 'zh' ? '项目' : '專案');
    setText('capability-research', language === 'en' ? 'Research' : '研究');
    setText('capability-knowledge', language === 'en' ? 'Knowledge' : language === 'zh' ? '知识' : '知識');
    setText('capability-back', language === 'en' ? '← Back to profile' : language === 'zh' ? '← 返回主页' : '← 返回主頁');

    $$('[data-preserve-lang]').forEach((link) => {
      link.href = withLanguage(link.getAttribute('href'));
    });

    $$('.archive-language button').forEach((button) => {
      const active = button.dataset.language === language;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function renderPage(data) {
    document.title = `${localized(data.page.title)} · Li Yucheng`;
    setText('capability-eyebrow', localized(data.page.eyebrow));
    setText('capability-title', localized(data.page.title));
    setText('capability-description', localized(data.page.description));

    $('#capability-index').innerHTML = data.items.map((item) =>
      `<a href="#${escapeHtml(item.id)}">${escapeHtml(localized(item.title))}</a>`
    ).join('');

    const noEvidence = language === 'en'
      ? 'Detailed public evidence is intentionally left empty until a verifiable record is available.'
      : language === 'zh'
        ? '暂无可公开核验的细化证据；保留为空，不以推断或包装代替事实。'
        : '暫無可公開核驗的細化證據；保留為空，不以推斷或包裝代替事實。';

    $('#capability-list').innerHTML = data.items.map((item, index) => {
      const levels = (item.levels || []).map((level) => `
        <span class="level-chip${level.primary ? ' is-primary' : ''}">
          ${level.year} · LEVEL ${level.level}${level.primary ? ' · PRIMARY ◆' : ''}
        </span>
      `).join('');

      const tools = (item.tools || []).length
        ? `<div class="level-history">${item.tools.map((tool) => `<span class="level-chip">${escapeHtml(tool)}</span>`).join('')}</div>`
        : '';

      const evidence = (item.evidence || []).length
        ? `<ul class="evidence-list">${item.evidence.map((entry) => {
            const text = escapeHtml(localized(entry.text));
            return `<li>${entry.target ? `<a href="${escapeHtml(withLanguage(entry.target))}">${text}</a>` : text}</li>`;
          }).join('')}</ul>`
        : `<p class="evidence-empty">${escapeHtml(noEvidence)}</p>`;

      return `
        <article class="capability-entry" id="${escapeHtml(item.id)}">
          <header>
            <span class="capability-entry-id">${String(index + 1).padStart(2, '0')} / ${escapeHtml(item.id.toUpperCase())}</span>
            <h2>${escapeHtml(localized(item.title))}</h2>
          </header>
          <div>
            <p class="capability-definition">${escapeHtml(localized(item.definition))}</p>
            <div class="level-history">${levels}</div>
            ${tools}
            ${evidence}
          </div>
        </article>`;
    }).join('');
  }

  function wireLanguage() {
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
  }

  async function init() {
    language = currentLanguage();
    try {
      const [capabilityResponse, homepageResponse] = await Promise.all([
        fetch('content/generated/capabilities.json', { cache: 'no-cache' }),
        fetch('content/generated/homepage.json', { cache: 'no-cache' })
      ]);
      if (!capabilityResponse.ok || !homepageResponse.ok) throw new Error('Cannot load capability archive data');
      const [capabilities, homepage] = await Promise.all([
        capabilityResponse.json(),
        homepageResponse.json()
      ]);
      renderChrome(homepage);
      renderPage(capabilities);
      wireLanguage();
      setState('');
    } catch (error) {
      console.error(error);
      setState(language === 'en' ? 'Capability archive failed to load.' : '能力档案加载失败。', true);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
