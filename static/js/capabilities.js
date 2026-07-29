(() => {
  const COPY = {
    zh: {
      title: '能力',
      eyebrow: '能力',
      value: '能力不是标签，而是由系统学习、独立实践、完整交付与持续维护共同构成的证据链。',
      loading: '正在加载能力档案…',
      error: '能力档案加载失败。',
      noEvidence: '暂无可公开核验的细化证据；保留为空，不以推断或包装代替事实。',
      level: '等级',
      primary: '主线 ◆',
      honorsIndex: '荣誉与证据',
      honorsLabel: '荣誉 / 证据',
      honorsTitle: '荣誉与证据',
      honorsDescription: '荣誉不是能力本身，而是某些阶段性成果被外部规则认可后的记录；它应当回到能力形成和实际行动的证据链中。'
    },
    'chinese-traditional': {
      title: '能力',
      eyebrow: '能力',
      value: '能力不是標籤，而是由系統學習、獨立實踐、完整交付與持續維護共同構成的證據鏈。',
      loading: '正在載入能力檔案…',
      error: '能力檔案載入失敗。',
      noEvidence: '暫無可公開核驗的細化證據；保留為空，不以推斷或包裝代替事實。',
      level: '等級',
      primary: '主線 ◆',
      honorsIndex: '榮譽與證據',
      honorsLabel: '榮譽 / 證據',
      honorsTitle: '榮譽與證據',
      honorsDescription: '榮譽不是能力本身，而是某些階段性成果被外部規則認可後的記錄；它應回到能力形成與實際行動的證據鏈中。'
    },
    en: {
      title: 'Capabilities',
      eyebrow: 'Capabilities',
      value: 'Capability is not a label. It is an evidence chain built from structured learning, independent practice, complete delivery, and continued maintenance.',
      loading: 'Loading capability archive…',
      error: 'Capability archive failed to load.',
      noEvidence: 'Detailed evidence remains empty until a verifiable public record is available.',
      level: 'LEVEL',
      primary: 'PRIMARY ◆',
      honorsIndex: 'Honors & evidence',
      honorsLabel: 'HONORS / EVIDENCE',
      honorsTitle: 'Honors & Evidence',
      honorsDescription: 'An honor is not the capability itself. It records when a stage outcome was recognized by an external standard and belongs inside the evidence chain of action and formation.'
    }
  };
  const $ = (selector) => document.querySelector(selector);
  const text = (value) => ArchiveChrome.localized(value);
  const esc = (value) => ArchiveChrome.escapeHtml(value);

  function setState(message, isError = false) {
    const state = $('#archive-state');
    state.textContent = message;
    state.classList.toggle('is-error', isError);
  }

  async function fetchAwards() {
    const response = await fetch(`contents/${ArchiveChrome.language}/awards.md`, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Awards HTTP ${response.status}`);
    return response.text();
  }

  function render(data, awardsMarkdown) {
    const copy = COPY[ArchiveChrome.language];
    document.title = `${copy.title} · Li Yucheng`;
    $('#capability-eyebrow').textContent = copy.eyebrow;
    $('#capability-title').textContent = copy.title;
    $('#capability-value').textContent = copy.value;
    $('#capability-description').textContent = text(data.page?.description);
    $('#honors-label').textContent = copy.honorsLabel;
    $('#honors-title').textContent = copy.honorsTitle;
    $('#honors-description').textContent = copy.honorsDescription;
    $('#honors-content').innerHTML = marked.parse(awardsMarkdown);

    $('#capability-index').innerHTML = [
      ...(data.items || []).map((item) =>
        `<a href="#${esc(item.id)}">${esc(text(item.title))}</a>`
      ),
      `<a href="#honors">${esc(copy.honorsIndex)}</a>`
    ].join('');

    $('#capability-list').innerHTML = (data.items || []).map((item, index) => {
      const levels = (item.levels || []).map((entry) =>
        `<span class="level-chip${entry.primary ? ' is-primary' : ''}">${esc(entry.year)} · ${esc(copy.level)} ${esc(entry.level)}${entry.primary ? ` · ${esc(copy.primary)}` : ''}</span>`
      ).join('');
      const tools = (item.tools || []).map((tool) => `<span class="level-chip">${esc(tool)}</span>`).join('');
      const evidence = (item.evidence || []).length
        ? `<ul class="evidence-list">${item.evidence.map((entry) => {
            const content = esc(text(entry.text));
            return `<li>${entry.target ? `<a href="${esc(ArchiveChrome.withLanguage(entry.target))}">${content}</a>` : content}</li>`;
          }).join('')}</ul>`
        : `<p class="evidence-empty">${esc(copy.noEvidence)}</p>`;

      return `
        <article class="capability-entry" id="${esc(item.id)}">
          <header>
            <span class="catalog-card-index">${String(index + 1).padStart(2, '0')} / ${esc(item.id.toUpperCase())}</span>
            <h2>${esc(text(item.title))}</h2>
          </header>
          <div>
            <p class="capability-definition">${esc(text(item.definition))}</p>
            ${levels ? `<div class="level-history">${levels}</div>` : ''}
            ${tools ? `<div class="level-history">${tools}</div>` : ''}
            ${evidence}
          </div>
        </article>`;
    }).join('');
  }

  async function init() {
    const copy = COPY[ArchiveChrome.language];
    setState(copy.loading);
    try {
      const [response, awardsMarkdown] = await Promise.all([
        fetch('content/generated/capabilities.json', { cache: 'no-cache' }),
        fetchAwards()
      ]);
      if (!response.ok) throw new Error(`Capabilities HTTP ${response.status}`);
      render(await response.json(), awardsMarkdown);
      setState('');
    } catch (error) {
      console.error(error);
      setState(copy.error, true);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
