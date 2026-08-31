(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const esc = (value) => ArchiveChrome.escapeHtml(value);
  const language = () => ArchiveChrome.language;
  const localized = (value) => {
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    const lang = language();
    return value?.[lang] || value?.zh || value?.en || '';
  };

  const COPY = {
    zh: {
      engineeringTitle: '工程、专利与能源成果',
      engineeringDescription: '本科履历中的工程项目、专利、能源竞赛与优秀营员证据。',
      achievementTitle: '竞赛、学习与公益成果',
      achievementDescription: '数学建模、英语与学习成果，以及公益服务和体育成长证据。'
    },
    'chinese-traditional': {
      engineeringTitle: '工程、專利與能源成果',
      engineeringDescription: '本科履歷中的工程專案、專利、能源競賽與優秀營員證據。',
      achievementTitle: '競賽、學習與公益成果',
      achievementDescription: '數學建模、英語與學習成果，以及公益服務和體育成長證據。'
    },
    en: {
      engineeringTitle: 'Engineering, Patents, and Energy',
      engineeringDescription: 'Evidence from engineering projects, patents, energy competitions, and the outstanding-camper recognition.',
      achievementTitle: 'Competitions, Learning, and Service',
      achievementDescription: 'Evidence from modeling, English and learning outcomes, public service, and physical growth.'
    }
  };

  const ENGINEERING_RECORDS = new Set([
    'antimony-clean-energy',
    'tungsten-recycling'
  ]);
  const ACHIEVEMENT_RECORDS = new Set([
    'str-forensic-modeling',
    'rocket-debris-modeling',
    'mcm-olympic-medals',
    'mathorcup-brfc',
    'yuan-ze-study-group',
    'english-reading-award',
    'question-mark-weekend',
    'sun-tree-hole',
    'forest-messenger',
    'sun-student-companion',
    'yuelu-mountain',
    'campus-growth',
    'wps-and-certifications',
    'yuan-ze-exchange'
  ]);

  function uniqueMedia(records, predicate) {
    const seen = new Set();
    const result = [];
    for (const record of records) {
      for (const media of record.media || []) {
        if (!predicate(record, media)) continue;
        const src = String(media.path || '').trim();
        if (!src || seen.has(src)) continue;
        seen.add(src);
        result.push({ src, caption: localized(media.alt) || localized(record.title) });
      }
    }
    return result;
  }

  function mediaSequence(items, clone = false) {
    const markup = items.map((item) => `<button type="button" class="media-item" data-media-src="${esc(item.src)}" data-media-caption="${esc(item.caption)}"${clone ? ' tabindex="-1"' : ''}><img src="${esc(item.src)}" alt="${clone ? '' : esc(item.caption)}" loading="lazy" decoding="async" draggable="false"></button>`).join('');
    return `<div class="media-sequence"${clone ? ' aria-hidden="true"' : ''}>${markup}</div>`;
  }

  function mediaRow(collection, index) {
    return `<section class="media-row" data-portfolio-media-row="${esc(collection.id)}">
      <header class="media-row-header">
        <span class="media-row-index">${String(index).padStart(2, '0')}</span>
        <div><h3>${esc(collection.title)}</h3><p>${esc(collection.description)}</p></div>
      </header>
      <div class="media-viewport" tabindex="0" aria-label="${esc(collection.title)}">
        <div class="media-track">${mediaSequence(collection.items, true)}${mediaSequence(collection.items)}${mediaSequence(collection.items, true)}</div>
      </div>
    </section>`;
  }

  function initTrack(viewport) {
    const track = $('.media-track', viewport);
    const firstSequence = $('.media-sequence', track);
    const dialog = $('#media-dialog');
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let positioned = false;
    let manuallyPaused = false;
    let focusPaused = false;
    let dragging = false;
    let moved = false;
    let suppressClick = false;
    let startX = 0;
    let startScroll = 0;
    let last = performance.now();
    let visible = true;

    const setManualPause = (value) => {
      manuallyPaused = value;
      viewport.classList.toggle('is-manually-paused', value);
    };

    const loopSpan = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '0') || 0;
      return firstSequence.scrollWidth + gap;
    };

    const normalizePosition = () => {
      const span = loopSpan();
      if (!span) return;
      while (viewport.scrollLeft >= span * 2) viewport.scrollLeft -= span;
      while (viewport.scrollLeft < span) viewport.scrollLeft += span;
    };

    const positionAtMiddleCopy = () => {
      const span = loopSpan();
      if (!span) return;
      viewport.scrollLeft = span;
      positioned = true;
      last = performance.now();
    };

    requestAnimationFrame(positionAtMiddleCopy);
    const resizeObserver = new ResizeObserver(() => {
      if (!positioned) positionAtMiddleCopy();
      else normalizePosition();
    });
    resizeObserver.observe(viewport);

    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    }, { threshold: .04 });
    observer.observe(viewport);

    function frame(now) {
      const delta = Math.min(48, now - last);
      last = now;
      if (positioned && !reduceMotion && !manuallyPaused && !focusPaused && !dragging && visible) {
        viewport.scrollLeft += delta * 0.018;
        normalizePosition();
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    viewport.addEventListener('pointerdown', (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      dragging = true;
      moved = false;
      suppressClick = false;
      startX = event.clientX;
      startScroll = viewport.scrollLeft;
      setManualPause(true);
      viewport.classList.add('is-dragging');
      viewport.setPointerCapture?.(event.pointerId);
    });

    viewport.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      const distance = event.clientX - startX;
      if (Math.abs(distance) > 5) moved = true;
      viewport.scrollLeft = startScroll - distance;
    });

    const finishDrag = (event) => {
      if (!dragging) return;
      dragging = false;
      suppressClick = moved;
      viewport.classList.remove('is-dragging');
      if (viewport.hasPointerCapture?.(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
      normalizePosition();
    };

    viewport.addEventListener('pointerup', finishDrag);
    viewport.addEventListener('pointercancel', finishDrag);
    viewport.addEventListener('click', (event) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }, true);
    viewport.addEventListener('focusin', () => { focusPaused = true; });
    viewport.addEventListener('focusout', (event) => {
      if (!viewport.contains(event.relatedTarget)) focusPaused = false;
    });
    viewport.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      setManualPause(true);
      viewport.scrollLeft += event.key === 'ArrowRight' ? 140 : -140;
      normalizePosition();
    });
    document.addEventListener('pointerdown', (event) => {
      if (viewport.contains(event.target) || dialog?.contains(event.target)) return;
      setManualPause(false);
    }, true);
  }

  async function waitForRows(timeout = 8000) {
    const started = performance.now();
    while (performance.now() - started < timeout) {
      const rows = $('.media-rows');
      if (rows && rows.children.length >= 3) return rows;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return null;
  }

  async function init() {
    const rows = await waitForRows();
    if (!rows) return;
    const response = await fetch('content/generated/records.json', { cache: 'no-cache' });
    if (!response.ok) return;
    const records = (await response.json()).items || [];
    const copy = COPY[language()] || COPY.zh;

    const engineeringItems = uniqueMedia(records, (record, media) =>
      ENGINEERING_RECORDS.has(record.id) ||
      (record.id === 'imp-winter-camp' && String(media.path || '').includes('outstanding-camper'))
    );
    const achievementItems = uniqueMedia(records, (record) => ACHIEVEMENT_RECORDS.has(record.id));
    const collections = [
      { id: 'engineering-evidence', title: copy.engineeringTitle, description: copy.engineeringDescription, items: engineeringItems },
      { id: 'achievement-evidence', title: copy.achievementTitle, description: copy.achievementDescription, items: achievementItems }
    ].filter((collection) => collection.items.length);

    rows.querySelectorAll('[data-portfolio-media-row]').forEach((node) => node.remove());
    collections.forEach((collection, offset) => rows.insertAdjacentHTML('beforeend', mediaRow(collection, 4 + offset)));
    rows.querySelectorAll('[data-portfolio-media-row] .media-viewport').forEach(initTrack);

    window.__updateMediaRowCount = rows.children.length;
    window.__updateMediaRowIds = [...rows.children].map((row) => row.dataset.mediaRow || row.dataset.portfolioMediaRow || 'unknown');
    window.__portfolioEngineeringMediaCount = engineeringItems.length;
    window.__portfolioAchievementMediaCount = achievementItems.length;
  }

  document.addEventListener('DOMContentLoaded', () => init().catch(console.error));
})();
