(() => {
  const COPY = {
    zh: {
      eyebrow: '学习',
      title: '学习',
      value: '把好奇心训练成可验证的理解，把短期输入沉淀为长期可复用的知识。终身学习不是不断收藏，而是持续求证、连接与实践。',
      note: '研究回答“如何求证”，知识系统回答“如何保存与复用”；两者共同构成持续成长的方法。',
      researchLink: '研究记录',
      knowledgeLink: '知识系统',
      researchLabel: '01 / 研究记录',
      researchTitle: '研究记录',
      knowledgeLabel: '02 / 知识系统',
      knowledgeTitle: '知识系统',
      loading: '正在加载学习档案…',
      error: '学习档案加载失败。'
    },
    'chinese-traditional': {
      eyebrow: '學習',
      title: '學習',
      value: '把好奇心訓練成可驗證的理解，把短期輸入沉澱為長期可複用的知識。終身學習不是不斷收藏，而是持續求證、連接與實踐。',
      note: '研究回答「如何求證」，知識系統回答「如何保存與複用」；兩者共同構成持續成長的方法。',
      researchLink: '研究記錄',
      knowledgeLink: '知識系統',
      researchLabel: '01 / 研究記錄',
      researchTitle: '研究記錄',
      knowledgeLabel: '02 / 知識系統',
      knowledgeTitle: '知識系統',
      loading: '正在載入學習檔案…',
      error: '學習檔案載入失敗。'
    },
    en: {
      eyebrow: 'Learning',
      title: 'Learning',
      value: 'Train curiosity into verifiable understanding, and turn short-term input into reusable long-term knowledge. Lifelong learning is sustained inquiry, connection, and practice—not endless collection.',
      note: 'Research asks how to verify; the knowledge system asks how to preserve and reuse. Together they form a durable learning method.',
      researchLink: 'Research records',
      knowledgeLink: 'Knowledge system',
      researchLabel: '01 / RESEARCH',
      researchTitle: 'Research Records',
      knowledgeLabel: '02 / KNOWLEDGE',
      knowledgeTitle: 'Knowledge System',
      loading: 'Loading learning archive…',
      error: 'Learning archive failed to load.'
    }
  };
  const $ = (selector) => document.querySelector(selector);

  function text(value) { return ArchiveChrome.localized(value); }
  function esc(value) { return ArchiveChrome.escapeHtml(value); }

  function setState(message, isError = false) {
    const state = $('#learning-state');
    state.textContent = message;
    state.classList.toggle('is-error', isError);
  }

  function renderResearch(data) {
    $('#research-description').textContent = text(data.page?.description);
    $('#research-list').innerHTML = (data.items || []).map((item, index) => {
      const links = (item.links || []).map((entry) => {
        const href = ArchiveChrome.safeExternalUrl(entry.url);
        return href ? `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(text(entry.label))} ↗</a>` : '';
      }).join('');
      const tags = (item.tags || []).map((tag) => `<span>${esc(tag)}</span>`).join('');
      return `
        <article class="learning-record" id="${esc(item.id || `research-${index + 1}`)}">
          <div class="learning-card-header">
            <span class="learning-card-index">${String(index + 1).padStart(2, '0')} · ${esc(item.status || item.category || 'record')}</span>
            <span class="learning-card-index">${esc(item.updated || '')}</span>
          </div>
          <h3>${esc(text(item.title))}</h3>
          <p>${esc(text(item.summary))}</p>
          ${tags ? `<div class="learning-tags">${tags}</div>` : ''}
          ${links ? `<div class="learning-links">${links}</div>` : ''}
        </article>`;
    }).join('');
  }

  function renderKnowledge(data) {
    $('#knowledge-description').textContent = text(data.page?.description);
    $('#knowledge-grid').innerHTML = (data.items || []).map((item, index) => {
      const tags = (item.tags || []).map((tag) => `<span>${esc(tag)}</span>`).join('');
      return `
        <article class="learning-card" id="${esc(item.id || `knowledge-${index + 1}`)}">
          <div class="learning-card-header">
            <span class="learning-card-index">${String(index + 1).padStart(2, '0')} · ${esc(item.category || 'knowledge')}</span>
          </div>
          <h3>${esc(text(item.title))}</h3>
          <p>${esc(text(item.summary))}</p>
          ${tags ? `<div class="learning-tags">${tags}</div>` : ''}
        </article>`;
    }).join('');
  }

  async function init() {
    const copy = COPY[ArchiveChrome.language];
    document.title = `${copy.title} · Li Yucheng`;
    $('#learning-eyebrow').textContent = copy.eyebrow;
    $('#learning-title').textContent = copy.title;
    $('#learning-value').textContent = copy.value;
    $('#learning-note').textContent = copy.note;
    $('#learning-research-link').textContent = copy.researchLink;
    $('#learning-knowledge-link').textContent = copy.knowledgeLink;
    $('#research-label').textContent = copy.researchLabel;
    $('#research-title').textContent = copy.researchTitle;
    $('#knowledge-label').textContent = copy.knowledgeLabel;
    $('#knowledge-title').textContent = copy.knowledgeTitle;
    setState(copy.loading);

    try {
      const [researchResponse, knowledgeResponse] = await Promise.all([
        fetch('content/generated/research.json', { cache: 'no-cache' }),
        fetch('content/generated/knowledge.json', { cache: 'no-cache' })
      ]);
      if (!researchResponse.ok || !knowledgeResponse.ok) throw new Error('Learning data unavailable');
      const [research, knowledge] = await Promise.all([researchResponse.json(), knowledgeResponse.json()]);
      renderResearch(research);
      renderKnowledge(knowledge);
      setState('');
    } catch (error) {
      console.error(error);
      setState(copy.error, true);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
