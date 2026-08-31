(() => {
  const CONTENT_MAP = {
    collaboration: ['experience', 'practice'],
    interests: ['interests'],
    honors: ['awards', 'publications']
  };
  const COPY = {
    zh: {
      eyebrow: '延伸档案',
      title: '协作、兴趣与荣誉',
      value: '把经历按事实归档，把荣誉放回形成它的过程；记录的目的不是装饰身份，而是帮助未来判断自己如何行动。',
      description: '这里保留首页四个入口中的深层内容，与项目、学习、能力和动态共同构成完整档案。',
      collaboration: '协作网络',
      interests: '兴趣图谱',
      honors: '荣誉档案',
      loading: '正在加载档案内容…',
      error: '部分档案内容加载失败。'
    },
    'chinese-traditional': {
      eyebrow: '延伸檔案',
      title: '協作、興趣與榮譽',
      value: '把經歷按事實歸檔，把榮譽放回形成它的過程；記錄的目的不是裝飾身分，而是幫助未來判斷自己如何行動。',
      description: '此處保留首頁四個入口中的深層內容，與專案、學習、能力和動態共同構成完整檔案。',
      collaboration: '協作網絡',
      interests: '興趣圖譜',
      honors: '榮譽檔案',
      loading: '正在載入檔案內容…',
      error: '部分檔案內容載入失敗。'
    },
    en: {
      eyebrow: 'Extended Archive',
      title: 'Collaboration, Interests & Honors',
      value: 'Archive experience factually and return honors to the processes that formed them. Records should guide future action, not merely decorate identity.',
      description: 'This page preserves deeper material behind the homepage portals, alongside Projects, Learning, Capabilities, and Updates.',
      collaboration: 'Collaboration Network',
      interests: 'Interest Map',
      honors: 'Honors Archive',
      loading: 'Loading archive content…',
      error: 'Some archive content failed to load.'
    }
  };
  const $ = (selector) => document.querySelector(selector);
  const esc = (value) => ArchiveChrome.escapeHtml(value);
  let homepage = null;

  function setState(message, isError = false) {
    const state = $('#archive-state');
    state.textContent = message;
    state.classList.toggle('is-error', isError);
  }

  async function fetchMarkdown(section) {
    const response = await fetch(`contents/${ArchiveChrome.language}/${section}.md`, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Cannot load ${section} (${response.status})`);
    return response.text();
  }

  async function renderSections(copy) {
    const portals = new Map(homepage.portals.map((portal) => [portal.id, portal]));
    const ids = ['collaboration', 'interests', 'honors'];

    const sections = await Promise.all(ids.map(async (id) => {
      const portal = portals.get(id);
      const results = await Promise.allSettled(CONTENT_MAP[id].map(fetchMarkdown));
      const body = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => marked.parse(result.value))
        .join('');
      const failed = results.some((result) => result.status === 'rejected');

      return `
        <section class="archive-detail-section" id="${esc(id)}">
          <p class="section-label">${esc(id.toUpperCase())} / ${esc(portal?.updated || '')}</p>
          <h2>${esc(ArchiveChrome.localized(portal?.title || id))}</h2>
          <p class="page-catalog-note">${esc(ArchiveChrome.localized(portal?.description || ''))}</p>
          ${failed ? `<p class="evidence-empty">${esc(copy.error)}</p>` : ''}
          <div class="archive-markdown">${body}</div>
        </section>`;
    }));

    $('#archive-detail-grid').innerHTML = sections.join('');
  }

  async function init() {
    const copy = COPY[ArchiveChrome.language];
    document.title = `${copy.title} · Li Yucheng`;
    $('#detail-eyebrow').textContent = copy.eyebrow;
    $('#detail-title').textContent = copy.title;
    $('#detail-value').textContent = copy.value;
    $('#detail-description').textContent = copy.description;
    $('#detail-collaboration').textContent = copy.collaboration;
    $('#detail-interests').textContent = copy.interests;
    $('#detail-honors').textContent = copy.honors;
    setState(copy.loading);

    try {
      const response = await fetch('content/generated/homepage.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Homepage HTTP ${response.status}`);
      homepage = await response.json();
      await renderSections(copy);
      setState('');
    } catch (error) {
      console.error(error);
      setState(copy.error, true);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
