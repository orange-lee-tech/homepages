(() => {
  const LANGUAGES = ['zh', 'chinese-traditional', 'en'];
  const COPY = {
    zh: { detail: '查看完整卡片', linked: '关联记录' },
    'chinese-traditional': { detail: '查看完整卡片', linked: '關聯記錄' },
    en: { detail: 'Open full card', linked: 'Linked record' }
  };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value) => String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

  let records = [];
  let rendering = false;
  let observer;
  let outsideClickBound = false;

  function language() {
    const requested = new URL(location.href).searchParams.get('lang');
    if (LANGUAGES.includes(requested)) return requested;
    try {
      const stored = localStorage.getItem('lang');
      if (LANGUAGES.includes(stored)) return stored;
    } catch {}
    return 'zh';
  }

  function localized(value) {
    const lang = language();
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return value?.[lang] || value?.zh || value?.en || '';
  }

  function withLanguage(target) {
    const raw = String(target || '');
    if (!raw) return '#';
    if (/^(https?:|mailto:|#)/i.test(raw)) return raw;
    const url = new URL(raw, location.href);
    url.searchParams.set('lang', language());
    return `${url.pathname}${url.search}${url.hash}`;
  }

  function cardTarget(record) {
    const pages = Array.isArray(record.pages) ? record.pages : [];
    if (pages.includes('projects')) return `projects.html#record-${record.id}`;
    if (pages.includes('learning')) return `learning.html#record-${record.id}`;
    if (pages.includes('capabilities')) return `capabilities.html#record-${record.id}`;
    return record.target || '#';
  }

  function compactText(value, limit) {
    const normalized = String(value || '').replace(/\s+/g, ' ').trim();
    if (normalized.length <= limit) return normalized;
    return `${normalized.slice(0, Math.max(1, limit - 1)).replace(/[，,、；;：:\s]+$/u, '')}…`;
  }

  function timelineSummary(record) {
    const explicit = localized(record.timelineSummary);
    if (explicit) return compactText(explicit, language() === 'en' ? 148 : 70);
    const full = localized(record.summary);
    const firstSentence = full.split(/(?<=[。！？.!?])\s*/u).find(Boolean) || full;
    return compactText(firstSentence, language() === 'en' ? 148 : 70);
  }

  function temporalFraction(value) {
    const text = String(value || '');
    if (/^\d{4}$/.test(text)) return 0.5;
    if (/^\d{4}-\d{2}$/.test(text)) {
      const [year, month] = text.split('-').map(Number);
      return (Date.UTC(year, month - 1, 15) - Date.UTC(year, 0, 1)) /
        (Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1));
    }
    const date = new Date(`${text}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return 0.5;
    const year = date.getUTCFullYear();
    return (date - new Date(Date.UTC(year, 0, 1))) /
      (Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1));
  }

  function positions(events, isRtl) {
    const values = events.map((event) => 9 + temporalFraction(event.timelineDate) * 82);
    const minGap = events.length > 12 ? 3.8 : 5;
    for (let index = 1; index < values.length; index += 1) {
      values[index] = Math.max(values[index], values[index - 1] + minGap);
    }
    if (values.at(-1) > 91) {
      const shift = values.at(-1) - 91;
      for (let index = 0; index < values.length; index += 1) values[index] -= shift;
    }
    if (values[0] < 9) {
      const shift = 9 - values[0];
      for (let index = 0; index < values.length; index += 1) values[index] += shift;
    }
    return isRtl ? values.map((value) => 100 - value) : values;
  }

  function mobilePositions(events, height) {
    const values = events.map((event) => 54 + temporalFraction(event.timelineDate) * (height - 108));
    for (let index = 1; index < values.length; index += 1) {
      values[index] = Math.max(values[index], values[index - 1] + 50);
    }
    if (values.at(-1) > height - 42) {
      const shift = values.at(-1) - (height - 42);
      for (let index = 0; index < values.length; index += 1) values[index] -= shift;
    }
    return values;
  }

  function eventMarkup(event, position, index, mobile = false) {
    const milestone = event.timelineType === 'milestone';
    const lane = index % 3 - 1;
    const edge = mobile ? '' : position < 19 ? ' edge-start' : position > 81 ? ' edge-end' : '';
    const title = esc(localized(event.title));
    const summary = esc(timelineSummary(event));
    const role = esc(localized(event.role));
    const href = esc(withLanguage(cardTarget(event)));
    const capabilities = esc((event.capabilities || []).join(' · '));
    const period = esc(localized(event.period || event.timelineDate));
    const style = mobile ? `top:${position}px;left:56px;--lane:0` : `left:${position}%;--lane:${lane}`;
    const detailId = `timeline-detail-${esc(event.id)}`;
    return `<article class="timeline-event portfolio-timeline-event ${milestone ? 'is-milestone' : 'is-progress'} lane-${lane}${edge}"
      style="${style}" data-record-id="${esc(event.id)}" data-year="${String(event.timelineDate).slice(0, 4)}" data-capabilities="${capabilities}"
      role="button" tabindex="0" aria-expanded="false" aria-controls="${detailId}" aria-label="${title}, ${period}">
      <span class="event-node" aria-hidden="true"></span>
      <span class="event-label">${title}</span>
      <span class="event-detail" id="${detailId}" role="group">
        <span class="event-date">${period}</span>
        <strong>${title}</strong>
        ${role ? `<span class="event-role">${role}</span>` : ''}
        <span class="event-summary">${summary}</span>
        <a href="${href}">${esc(COPY[language()].detail)} →</a>
      </span>
    </article>`;
  }

  function closeCard(card) {
    card.classList.remove('is-open');
    card.setAttribute('aria-expanded', 'false');
  }

  function closeAll(root, except = null) {
    $$('.portfolio-timeline-event.is-open', root).forEach((card) => {
      if (card !== except) closeCard(card);
    });
  }

  function syncRadar(year) {
    const radar = $(`#year-switch button[data-year="${year}"]`);
    if (!radar) return;
    radar.dispatchEvent(new MouseEvent('click', {
      bubbles: false,
      cancelable: true,
      view: window
    }));
  }

  function openCard(eventCard, root) {
    closeAll(root, eventCard);
    eventCard.classList.add('is-open');
    eventCard.setAttribute('aria-expanded', 'true');

    const year = eventCard.dataset.year;
    syncRadar(year);
    const message = $('#timeline-link-message');
    if (message) {
      message.textContent = `${COPY[language()].linked}: ${year}${eventCard.dataset.capabilities ? ` · ${eventCard.dataset.capabilities}` : ''}`;
    }
  }

  function bindEvents(root) {
    $$('.portfolio-timeline-event', root).forEach((eventCard) => {
      const activate = (event) => {
        if (event.target?.closest?.('a')) return;
        event.preventDefault();
        event.stopPropagation();
        openCard(eventCard, root);
      };
      eventCard.addEventListener('click', activate);
      eventCard.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') activate(event);
      });
    });

    if (!outsideClickBound) {
      document.addEventListener('click', (event) => {
        const currentRoot = $('#timeline-list');
        if (!currentRoot || event.target?.closest?.('.portfolio-timeline-event')) return;
        closeAll(currentRoot);
      });
      outsideClickBound = true;
    }
  }

  function render() {
    const root = $('#timeline-list');
    if (!root || !records.length) return;
    rendering = true;
    const grouped = new Map();
    for (const record of records) {
      const year = Number(String(record.timelineDate).slice(0, 4));
      if (!Number.isFinite(year)) continue;
      if (!grouped.has(year)) grouped.set(year, []);
      grouped.get(year).push(record);
    }
    const years = [...grouped.keys()].sort((a, b) => a - b);
    const mobile = matchMedia('(max-width: 760px)').matches;
    root.innerHTML = years.map((year, rowIndex) => {
      const events = grouped.get(year).sort((a, b) => String(a.timelineDate).localeCompare(String(b.timelineDate)));
      if (mobile) {
        const height = Math.max(250, 112 + events.length * 58);
        const eventPositions = mobilePositions(events, height);
        return `<div class="timeline-row portfolio-timeline-row is-mobile is-ltr" style="--row-height:${height}px" data-timeline-year="${year}">
          <strong class="timeline-year">${year}</strong><span class="timeline-direction" aria-hidden="true">↓</span>
          ${events.map((event, index) => eventMarkup(event, eventPositions[index], index, true)).join('')}
        </div>`;
      }
      const rtl = rowIndex % 2 === 1;
      const eventPositions = positions(events, rtl);
      const height = Math.min(300, 176 + Math.max(0, events.length - 5) * 11);
      return `<div class="timeline-row portfolio-timeline-row ${rtl ? 'is-rtl' : 'is-ltr'}" style="--row-height:${height}px" data-timeline-year="${year}">
        <strong class="timeline-year">${year}</strong><span class="timeline-direction" aria-hidden="true">→</span>
        ${events.map((event, index) => eventMarkup(event, eventPositions[index], index)).join('')}
      </div>`;
    }).join('');
    bindEvents(root);
    window.__portfolioTimelineCount = $$('.portfolio-timeline-event', root).length;
    window.__portfolioTimelineYears = years;
    queueMicrotask(() => { rendering = false; });
  }

  async function load() {
    const response = await fetch(`content/generated/records.json?v=portfolio-5-${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`records.json: ${response.status}`);
    records = (await response.json()).items || [];
    render();
    const root = $('#timeline-list');
    if (!root) return;
    observer = new MutationObserver(() => {
      if (rendering) return;
      if (!root.querySelector('.portfolio-timeline-event')) requestAnimationFrame(render);
    });
    observer.observe(root, { childList: true, subtree: false });
    $$('.archive-language button').forEach((button) => button.addEventListener('click', () => setTimeout(render, 80)));
    matchMedia('(max-width: 760px)').addEventListener?.('change', render);
  }

  const start = () => setTimeout(() => load().catch((error) => console.error('Portfolio timeline:', error)), 180);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
