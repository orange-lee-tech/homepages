(() => {
  const LANGUAGES = ['zh', 'chinese-traditional', 'en'];
  const COPY = {
    zh: { detail: '查看关联档案', linked: '关联记录' },
    'chinese-traditional': { detail: '查看關聯檔案', linked: '關聯記錄' },
    en: { detail: 'Open related record', linked: 'Linked record' }
  };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value) => String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

  let records = [];
  let rendering = false;
  let observer;

  function language() {
    const requested = new URL(location.href).searchParams.get('lang');
    if (LANGUAGES.includes(requested)) return requested;
    try {
      const stored = localStorage.getItem('lang');
      if (LANGUAGES.includes(stored)) return stored;
    } catch {}
    return 'chinese-traditional';
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
    const summary = esc(localized(event.summary));
    const href = esc(withLanguage(event.target));
    const capabilities = esc((event.capabilities || []).join(' · '));
    const period = esc(localized(event.period || event.timelineDate));
    const style = mobile ? `top:${position}px;left:56px;--lane:0` : `left:${position}%;--lane:${lane}`;
    return `<article class="timeline-event portfolio-timeline-event ${milestone ? 'is-milestone' : 'is-progress'} lane-${lane}${edge}"
      style="${style}" data-year="${String(event.timelineDate).slice(0, 4)}" data-capabilities="${capabilities}"
      role="button" tabindex="0" aria-label="${title}, ${period}">
      <span class="event-node" aria-hidden="true"></span>
      <span class="event-label">${title}</span>
      <span class="event-detail" role="tooltip">
        <span class="event-date">${period}</span><strong>${title}</strong><span>${summary}</span>
        <a href="${href}">${esc(COPY[language()].detail)} →</a>
      </span>
    </article>`;
  }
  function bindEvents(root) {
    $$('.portfolio-timeline-event', root).forEach((eventCard) => {
      const activate = (event) => {
        if (event.target?.closest?.('a')) return;
        const open = eventCard.classList.contains('is-open');
        $$('.timeline-event.is-open', root).forEach((item) => item.classList.remove('is-open'));
        eventCard.classList.toggle('is-open', !open);
        if (!open) {
          const year = eventCard.dataset.year;
          const radar = $(`#year-switch button[data-year="${year}"]`);
          if (radar) radar.click();
          const message = $('#timeline-link-message');
          if (message) message.textContent = `${COPY[language()].linked}: ${year}${eventCard.dataset.capabilities ? ` · ${eventCard.dataset.capabilities}` : ''}`;
        }
      };
      eventCard.addEventListener('click', activate);
      eventCard.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activate(event);
        }
      });
    });
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
    const response = await fetch(`content/generated/records.json?v=portfolio-3-${Date.now()}`, { cache: 'no-store' });
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
