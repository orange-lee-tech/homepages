(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const esc = (value) => ArchiveChrome.escapeHtml(value);
  const text = (value) => ArchiveChrome.localized(value);
  const language = () => ArchiveChrome.language;

  const KIND = {
    engineering: { zh: '工程项目', 'chinese-traditional': '工程專案', en: 'Engineering' },
    modeling: { zh: '数学建模', 'chinese-traditional': '數學建模', en: 'Modeling' },
    research: { zh: '研究转化', 'chinese-traditional': '研究轉化', en: 'Research' },
    education: { zh: '学习经历', 'chinese-traditional': '學習經歷', en: 'Learning' },
    practice: { zh: '工作实践', 'chinese-traditional': '工作實踐', en: 'Practice' },
    service: { zh: '公益服务', 'chinese-traditional': '公益服務', en: 'Service' },
    honor: { zh: '荣誉', 'chinese-traditional': '榮譽', en: 'Honor' },
    credential: { zh: '认证', 'chinese-traditional': '認證', en: 'Credential' },
    software: { zh: '软件资产', 'chinese-traditional': '軟體資產', en: 'Software' }
  };

  const COPY = {
    zh: { records: '本科履历主记录', note: '同一段连续经历只保留一张主卡；证书、影像与动态作为证据。', actions: '关键行动', outcomes: '结果与证据', details: '展开过程', related: '查看关联记录', evidence: '本科荣誉与证据矩阵', media: '本科履历影像证据', engineering: '工程、专利与能源成果', modeling: '建模、英语与学习成果', service: '公益服务与体育成长' },
    'chinese-traditional': { records: '本科履歷主記錄', note: '同一段連續經歷只保留一張主卡；證書、影像與動態作為證據。', actions: '關鍵行動', outcomes: '結果與證據', details: '展開過程', related: '查看關聯記錄', evidence: '本科榮譽與證據矩陣', media: '本科履歷影像證據', engineering: '工程、專利與能源成果', modeling: '建模、英語與學習成果', service: '公益服務與體育成長' },
    en: { records: 'Undergraduate Portfolio Records', note: 'One continuous experience uses one canonical card; certificates, images, and posts remain supporting evidence.', actions: 'Key actions', outcomes: 'Outcomes and evidence', details: 'Expand process', related: 'Open related record', evidence: 'Undergraduate Evidence Matrix', media: 'Undergraduate Evidence Images', engineering: 'Engineering, Patents, and Energy', modeling: 'Modeling, English, and Learning', service: 'Public Service and Physical Growth' }
  };

  async function waitFor(selector, predicate = () => true, timeout = 5000) {
    const start = performance.now();
    while (performance.now() - start < timeout) {
      const element = $(selector);
      if (element && predicate(element)) return element;
      await new Promise((resolve) => setTimeout(resolve, 40));
    }
    return null;
  }

  function ensureEvidenceDialog() {
    if ($('#portfolio-evidence-dialog')) return;
    const dialog = document.createElement('dialog');
    dialog.id = 'portfolio-evidence-dialog';
    dialog.className = 'portfolio-evidence-dialog';
    dialog.innerHTML = `<div class="portfolio-evidence-dialog-toolbar"><p></p><button type="button" aria-label="Close">×</button></div><img alt="">`;
    document.body.append(dialog);
    const image = $('img', dialog);
    const caption = $('p', dialog);
    const close = $('button', dialog);
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    document.addEventListener('click', (event) => {
      const button = event.target.closest('.portfolio-evidence-strip [data-media-src]');
      if (!button) return;
      image.src = button.dataset.mediaSrc;
      image.alt = button.dataset.mediaCaption || '';
      caption.textContent = button.dataset.mediaCaption || '';
      dialog.showModal();
    });
  }

  function localizedKind(kind) { return text(KIND[kind] || { zh: kind, en: kind }); }

  function listMarkup(title, entries) {
    if (!entries?.length) return '';
    return `<div class="portfolio-record-list"><strong>${esc(title)}</strong><ul>${entries.map((entry) => `<li>${esc(text(entry))}</li>`).join('')}</ul></div>`;
  }

  function evidenceMarkup(record) {
    const images = (record.media || []).slice(0, record.size === 'extended' ? 3 : 1);
    if (!images.length) return '';
    return `<div class="portfolio-evidence-strip">${images.map((item) => `<button type="button" data-media-src="${esc(item.path)}" data-media-caption="${esc(text(item.alt))}"><img src="${esc(item.path)}" alt="${esc(text(item.alt))}" loading="lazy" decoding="async"></button>`).join('')}</div>`;
  }

  function linkMarkup(record) {
    const links = [...(record.links || [])];
    if (record.relatedPost) links.unshift({ label: { zh: '阅读全文', 'chinese-traditional': '閱讀全文', en: 'Read full record' }, url: `post.html?f=${record.relatedPost}` });
    if (!links.length) return '';
    return `<div class="portfolio-record-links">${links.map((entry) => {
      const raw = String(entry.url || '');
      const external = /^https?:/i.test(raw);
      const href = external ? ArchiveChrome.safeExternalUrl(raw) : ArchiveChrome.withLanguage(raw);
      return href ? `<a href="${esc(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${esc(text(entry.label))} ↗</a>` : '';
    }).join('')}</div>`;
  }

  function recordCard(record, index) {
    const copy = COPY[language()];
    const extra = [...(record.actions || []), ...(record.outcomes || [])].length > 4;
    const details = extra ? `<details class="portfolio-record-details"><summary>${esc(copy.details)}</summary>${listMarkup(copy.actions, record.actions)}${listMarkup(copy.outcomes, record.outcomes)}</details>` : `${listMarkup(copy.actions, record.actions)}${listMarkup(copy.outcomes, record.outcomes)}`;
    return `<article class="portfolio-record is-${esc(record.size || 'standard')}" id="record-${esc(record.id)}">
      <header><span>${String(index + 1).padStart(2, '0')} · ${esc(localizedKind(record.kind))}</span><time>${esc(text(record.period || record.timelineDate))}</time></header>
      <p class="portfolio-record-role">${esc(text(record.role))}</p>
      <h3>${esc(text(record.title))}</h3>
      <p class="portfolio-record-summary">${esc(text(record.summary))}</p>
      ${details}
      ${(record.tags || []).length ? `<div class="portfolio-record-tags">${record.tags.map((tag) => `<span>${esc(text(tag))}</span>`).join('')}</div>` : ''}
      ${evidenceMarkup(record)}${linkMarkup(record)}
    </article>`;
  }

  function filters(records, root) {
    const kinds = [...new Set(records.map((item) => item.kind))];
    if (kinds.length < 2) return;
    const allLabel = language() === 'en' ? 'All' : '全部';
    const bar = document.createElement('div');
    bar.className = 'portfolio-filter-bar';
    bar.innerHTML = `<button class="is-active" data-record-kind="all">${allLabel}</button>${kinds.map((kind) => `<button data-record-kind="${esc(kind)}">${esc(localizedKind(kind))}</button>`).join('')}`;
    root.before(bar);
    bar.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-record-kind]');
      if (!button) return;
      bar.querySelectorAll('button').forEach((item) => item.classList.toggle('is-active', item === button));
      const kind = button.dataset.recordKind;
      root.querySelectorAll('.portfolio-record').forEach((card) => card.hidden = kind !== 'all' && !card.classList.contains(`kind-${kind}`));
    });
  }

  function renderCards(records, root) {
    root.className = 'portfolio-record-grid';
    root.innerHTML = records.map((record, index) => recordCard(record, index).replace('portfolio-record is-', `portfolio-record kind-${record.kind} is-`)).join('');
    filters(records, root);
  }

  async function renderProjects(records) {
    const root = await waitFor('#collaboration-grid', (element) => element.children.length > 0);
    if (!root) return;
    await new Promise((resolve) => setTimeout(resolve, 120));
    records.filter((record) => !record.pages?.length && record.relatedPost && String(record.target || '').startsWith('projects.html#')).forEach((record) => {
      const id = String(record.target).split('#')[1];
      const card = id ? document.getElementById(id) : null;
      if (!card || card.querySelector('[data-related-record-post]')) return;
      let links = $('.project-links', card);
      if (!links) {
        links = document.createElement('div');
        links.className = 'project-links';
        card.append(links);
      }
      const anchor = document.createElement('a');
      anchor.dataset.relatedRecordPost = record.relatedPost;
      anchor.href = ArchiveChrome.withLanguage(`post.html?f=${record.relatedPost}`);
      anchor.textContent = `${language() === 'en' ? 'Read project record' : language() === 'zh' ? '阅读项目复盘' : '閱讀專案復盤'} ↗`;
      links.append(anchor);
    });
    const selected = records.filter((record) => record.pages?.includes('projects'));
    renderCards(selected, root);
    const title = $('#collaboration-title'); if (title) title.textContent = COPY[language()].records;
    const description = $('#collaboration-description'); if (description) description.textContent = COPY[language()].note;
    const label = $('#collaboration-label'); if (label) label.textContent = '02 / PORTFOLIO RECORDS';
    const anchor = $('#projects-collaboration-link'); if (anchor) anchor.textContent = COPY[language()].records;
    const count = $('#projects-count'); if (count) count.textContent = String(Number(count.textContent || 0) + selected.length);
  }

  async function renderLearning(records) {
    const root = await waitFor('#research-list'); if (!root) return;
    await waitFor('#knowledge-grid', (element) => element.children.length > 0);
    const selected = records.filter((record) => record.pages?.includes('learning'));
    renderCards(selected, root);
    const title = $('#research-title'); if (title) title.textContent = COPY[language()].records;
    const description = $('#research-description'); if (description) description.textContent = COPY[language()].note;
    const label = $('#research-label'); if (label) label.textContent = '02 / PORTFOLIO RECORDS';
    const anchor = $('#learning-research-link'); if (anchor) anchor.textContent = COPY[language()].records;
  }

  async function renderCapabilities(records) {
    const root = await waitFor('#honors-content', (element) => element.children.length > 0); if (!root) return;
    const selected = records.filter((record) => record.pages?.includes('capabilities'));
    const undergraduateMarker = $('#awards-ug', root);
    const preserved = [];
    if (undergraduateMarker) {
      let node = root.firstChild;
      while (node && node !== undergraduateMarker) {
        preserved.push(node.cloneNode(true));
        node = node.nextSibling;
      }
    }
    const matrix = document.createElement('div');
    matrix.className = 'portfolio-evidence-grid';
    matrix.innerHTML = selected.map((record) => `<a id="record-${esc(record.id)}" href="${esc(ArchiveChrome.withLanguage(record.target))}"><span>${esc(record.timelineDate)}</span><strong>${esc(text(record.title))}</strong><small>${esc((record.capabilities || []).join(' · '))}</small></a>`).join('');
    root.replaceChildren(...preserved, matrix);
    const title = $('#honors-title'); if (title) title.textContent = COPY[language()].evidence;
  }

  function initTrack(viewport) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let paused = false; let last = performance.now();
    const frame = (now) => { const delta = Math.min(48, now - last); last = now; if (!paused) viewport.scrollLeft += delta * .012; if (viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 2) viewport.scrollLeft = 0; requestAnimationFrame(frame); };
    viewport.addEventListener('pointerdown', () => { paused = true; }, { passive: true });
    viewport.addEventListener('pointerleave', () => { paused = false; });
    requestAnimationFrame(frame);
  }

  async function renderUpdates(records) {
    const rows = await waitFor('.media-rows', (element) => element.children.length > 0); if (!rows) return;
    const copy = COPY[language()];
    for (const stream of ['engineering', 'modeling', 'service']) {
      const items = records.flatMap((record) => (record.media || []).filter((item) => item.stream === stream));
      if (!items.length) continue;
      const section = document.createElement('section'); section.className = 'media-row portfolio-media-row';
      section.innerHTML = `<header class="media-row-header"><span class="media-row-index">+</span><div><h3>${esc(copy[stream])}</h3><p>${esc(copy.media)}</p></div></header><div class="media-viewport portfolio-media-viewport" tabindex="0"><div class="media-track"><div class="media-sequence">${items.map((item) => `<button type="button" class="media-item" data-media-src="${esc(item.path)}" data-media-caption="${esc(text(item.alt))}"><img src="${esc(item.path)}" alt="${esc(text(item.alt))}" loading="lazy" decoding="async" draggable="false"></button>`).join('')}</div></div></div>`;
      rows.append(section); initTrack($('.portfolio-media-viewport', section));
    }
  }

  async function init() {
    try {
      const response = await fetch('content/generated/records.json', { cache: 'no-cache' });
      if (!response.ok) return;
      const records = (await response.json()).items || [];
      ensureEvidenceDialog();
      const page = document.body.dataset.archivePage;
      if (page === 'projects') await renderProjects(records);
      if (page === 'learning') await renderLearning(records);
      if (page === 'capabilities') await renderCapabilities(records);
      if (page === 'updates') await renderUpdates(records);
    } catch (error) { console.error('Portfolio records:', error); }
  }
  document.addEventListener('DOMContentLoaded', init);
})();
