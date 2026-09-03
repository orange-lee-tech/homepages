(() => {
  const LANGUAGES = ['zh', 'chinese-traditional', 'en'];
  const HTML_LANG = { zh: 'zh-CN', 'chinese-traditional': 'zh-Hant', en: 'en' };
  const CURRENT_YEAR = 2026;

  const COPY = {
    zh: {
      profileKicker: '01 / 当前档案',
      profileTitle: '当前档案',
      profileDescription: '当前身份、能力配置与公开入口。',
      active: '当前有效',
      status: '状态',
      phase: '阶段',
      focus: '主线',
      radarCode: '能力雷达',
      current: '当前',
      selected: '已选',
      primary: '主线 ◆',
      timelineKicker: '02 / 形成轨迹',
      timelineTitle: '形成轨迹',
      timelineDescription: '普通事件是轨迹上的小节点，里程碑以更大的黄铜节点主动标记。',
      archiveKicker: '03 / 档案入口',
      archiveTitle: '档案入口',
      archiveDescription: '四个入口，连接完整个人内容世界。',
      railProfile: '当前',
      railTimeline: '轨迹',
      railArchive: '档案',
      pending: '待补链接',
      open: '进入档案',
      linked: '关联快照',
      detail: '查看关联档案',
      loading: '正在加载数字档案…',
      error: '首页档案数据加载失败，请刷新页面。'
    },
    'chinese-traditional': {
      profileKicker: '01 / 目前檔案',
      profileTitle: '目前檔案',
      profileDescription: '目前身分、能力配置與公開入口。',
      active: '目前有效',
      status: '狀態',
      phase: '階段',
      focus: '主線',
      radarCode: '能力雷達',
      current: '目前',
      selected: '已選',
      primary: '主線 ◆',
      timelineKicker: '02 / 形成軌跡',
      timelineTitle: '形成軌跡',
      timelineDescription: '普通事件是軌跡上的小節點，里程碑以較大的黃銅節點主動標記。',
      archiveKicker: '03 / 檔案入口',
      archiveTitle: '檔案入口',
      archiveDescription: '四個入口，連接完整個人內容世界。',
      railProfile: '目前',
      railTimeline: '軌跡',
      railArchive: '檔案',
      pending: '待補連結',
      open: '進入檔案',
      linked: '關聯快照',
      detail: '查看關聯檔案',
      loading: '正在載入數位檔案…',
      error: '首頁檔案資料載入失敗，請重新整理頁面。'
    },
    en: {
      profileKicker: '01 / PROFILE',
      profileTitle: 'Current Profile',
      profileDescription: 'Current identity, capability configuration, and public ports.',
      active: 'Active',
      status: 'Status',
      phase: 'Phase',
      focus: 'Focus',
      radarCode: 'Capability radar',
      current: 'CURRENT',
      selected: 'SELECTED',
      primary: 'PRIMARY ◆',
      timelineKicker: '02 / TIMELINE',
      timelineTitle: 'Formation Path',
      timelineDescription: 'Progress events remain small ticks; milestones are actively labeled with larger brass nodes.',
      archiveKicker: '03 / ARCHIVE',
      archiveTitle: 'Archive Portals',
      archiveDescription: 'Four entrances into the complete personal content world.',
      railProfile: 'Now',
      railTimeline: 'Path',
      railArchive: 'Archive',
      pending: 'Link pending',
      open: 'Open archive',
      linked: 'Linked snapshot',
      detail: 'Open related archive',
      loading: 'Loading archive…',
      error: 'Homepage archive data failed to load. Refresh the page.'
    }
  };

  const TRAD_TERMS = {
    '团队协作': '團隊協作', '项目主持': '專案主持', '学工办': '學工辦', '志愿服务': '志願服務',
    '公开表达': '公開表達', '交付': '交付', '协作': '協作', '能源动力': '能源動力',
    '科学计算': '科學計算', '工程经济': '工程經濟', '神经算子': '神經算子', '仿真': '模擬',
    '能源': '能源', '知识资产': '知識資產', '读书笔记': '讀書筆記', '工程方法': '工程方法',
    '实验设计': '實驗設計', '可复现': '可重現', '索引': '索引', '复用': '複用',
    '全国一等奖': '全國一等獎', '专利': '專利', '数学建模': '數學建模', '证书': '證書'
  };

  const ECHO_LAYOUTS = {
    collaboration: [
      { x: 9, y: 52 }, { x: 88, y: 16 }, { x: 83, y: 84 }, { x: 35, y: 9 }, { x: 43, y: 92 }
    ],
    interests: [
      { x: 10, y: 47 }, { x: 86, y: 13 }, { x: 90, y: 73 }, { x: 37, y: 8 }, { x: 48, y: 91 }
    ],
    knowledge: [
      { x: 10, y: 51 }, { x: 88, y: 18 }, { x: 86, y: 82 }, { x: 40, y: 8 }, { x: 45, y: 92 }
    ],
    honors: [
      { x: 10, y: 50 }, { x: 88, y: 15 }, { x: 86, y: 82 }, { x: 35, y: 9 }, { x: 48, y: 92 }
    ]
  };

  let language = 'zh';
  let data = null;
  let selectedYear = CURRENT_YEAR;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function readStoredLanguage() {
    try { return localStorage.getItem('lang'); } catch { return null; }
  }

  function storeLanguage(value) {
    try { localStorage.setItem('lang', value); } catch { /* storage may be unavailable in local previews */ }
  }

  function currentLanguage() {
    const requested = new URL(window.location.href).searchParams.get('lang');
    if (LANGUAGES.includes(requested)) return requested;
    const saved = readStoredLanguage();
    return LANGUAGES.includes(saved) ? saved : 'zh';
  }

  function localized(value) {
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return value?.[language] || value?.zh || value?.en || '';
  }

  function localizedTerm(term) {
    if (language === 'en') return term.en || term.text || '';
    if (language === 'chinese-traditional') return term['chinese-traditional'] || TRAD_TERMS[term.text] || term.text || '';
    return term.text || term.zh || '';
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function safeHref(value) {
    const raw = String(value || '').trim();
    if (!raw) return '#';
    if (raw.startsWith('#')) return raw;
    if (/^(https?:|mailto:)/i.test(raw)) {
      try {
        const url = new URL(raw);
        return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? url.href : '#';
      } catch {
        return '#';
      }
    }
    const base = /^https?:/i.test(window.location.href) ? window.location.href : 'https://archive.local/index.html';
    const url = new URL(raw, base);
    url.searchParams.set('lang', language);
    return `${url.pathname}${url.search}${url.hash}`;
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function setState(message, isError = false) {
    const element = $('#archive-state');
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('is-error', isError);
    element.classList.toggle('is-hidden', !message);
  }

  function renderChrome() {
    const copy = COPY[language];
    document.documentElement.lang = HTML_LANG[language];
    document.title = `${localized(data.chrome.brand)} · ${language === 'en' ? data.profile.name : data.profile.chineseName}`;

    setText('archive-brand', localized(data.chrome.brand));
    setText('profile-kicker', copy.profileKicker);
    setText('profile-section-title', copy.profileTitle);
    setText('profile-section-description', copy.profileDescription);
    setText('profile-active', copy.active);
    setText('label-status', copy.status);
    setText('label-phase', copy.phase);
    setText('label-focus', copy.focus);
    setText('radar-code', copy.radarCode);
    setText('timeline-kicker', copy.timelineKicker);
    setText('timeline-title', copy.timelineTitle);
    setText('timeline-description', copy.timelineDescription);
    setText('archive-kicker', copy.archiveKicker);
    setText('archive-title', copy.archiveTitle);
    setText('archive-description', copy.archiveDescription);
    setText('rail-profile', copy.railProfile);
    setText('rail-timeline', copy.railTimeline);
    setText('rail-archive', copy.railArchive);

    $$('.archive-language button').forEach((button) => {
      const active = button.dataset.language === language;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function renderProfile() {
    const profile = data.profile;
    setText('profile-display-name', language === 'en' ? profile.name : profile.chineseName);
    setText('profile-role', localized(profile.role));
    setText('profile-thesis', localized(profile.thesis));
    setText('profile-status', localized(profile.status));
    setText('profile-phase', localized(profile.phase));
    setText('profile-focus', localized(profile.focus));
    const buildDate = String(profile.build || '').replace(/^PROFILE BUILD\s*/i, '');
    setText('profile-build', language === 'en' ? profile.build : `${language === 'zh' ? '档案版本' : '檔案版本'} ${buildDate}`);

    $('#identity-ports').innerHTML = profile.ports.map((port) => {
      const label = escapeHtml(localized(port.label));
      if (port.pending) {
        return `<span class="pending-port" title="${escapeHtml(COPY[language].pending)}">${label} · ${escapeHtml(COPY[language].pending)}</span>`;
      }
      const href = escapeHtml(safeHref(port.url));
      const external = /^https?:/i.test(port.url);
      return `<a href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}${external ? '<span aria-hidden="true"> ↗</span>' : ''}</a>`;
    }).join('');
  }

  function svgElement(name, attributes = {}) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    return element;
  }

  function polygonPoints(count, radius, centerX, centerY) {
    return Array.from({ length: count }, (_, index) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / count;
      return [centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius];
    });
  }

  function labelDimensions(label, isPrimary) {
    const wide = language === 'en';
    const width = Math.min(wide ? 174 : 134, Math.max(wide ? 112 : 96, label.length * (wide ? 7.2 : 15) + 24));
    return { width, height: isPrimary ? 52 : 44 };
  }

  function renderRadar(yearData) {
    const svg = $('#radar-svg');
    if (!svg || !yearData) return;

    selectedYear = yearData.year;
    const count = yearData.capabilities.length;
    const centerX = 300;
    const centerY = 240;
    const maxRadius = 178;
    const labelRadius = 205;
    const copy = COPY[language];

    svg.replaceChildren();

    const title = svgElement('title', { id: 'radar-svg-title' });
    title.textContent = `${yearData.year} ${copy.radarCode}`;
    svg.append(title);

    const description = svgElement('desc', { id: 'radar-svg-desc' });
    description.textContent = yearData.capabilities
      .map((capability) => `${localized(capability.name)} level ${capability.level}`)
      .join(', ');
    svg.append(description);

    for (let level = 1; level <= 5; level += 1) {
      svg.append(svgElement('polygon', {
        points: polygonPoints(count, maxRadius * level / 5, centerX, centerY).map((point) => point.join(',')).join(' '),
        class: 'radar-grid'
      }));
    }

    polygonPoints(count, maxRadius, centerX, centerY).forEach((point, index) => {
      const capability = yearData.capabilities[index];
      svg.append(svgElement('line', {
        x1: centerX,
        y1: centerY,
        x2: point[0],
        y2: point[1],
        class: `radar-axis${capability.id === yearData.primary ? ' is-primary' : ''}`
      }));
    });

    const dataPoints = yearData.capabilities.map((capability, index) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / count;
      const radius = maxRadius * capability.level / 5;
      return [centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius];
    });

    svg.append(svgElement('polygon', {
      points: dataPoints.map((point) => point.join(',')).join(' '),
      class: 'radar-shape'
    }));

    dataPoints.forEach((point) => {
      svg.append(svgElement('circle', {
        cx: point[0], cy: point[1], r: 5, class: 'radar-point'
      }));
    });

    yearData.capabilities.forEach((capability, index) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / count;
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;
      const isPrimary = capability.id === yearData.primary;
      const label = localized(capability.name);
      const dimensions = labelDimensions(label, isPrimary);
      const group = svgElement('g', {
        class: `radar-label-link${isPrimary ? ' is-primary' : ''}`,
        tabindex: '0', role: 'link',
        'aria-label': `${label}, level ${capability.level}${isPrimary ? ', primary' : ''}`
      });

      group.append(svgElement('rect', {
        x: x - dimensions.width / 2,
        y: y - dimensions.height / 2,
        width: dimensions.width,
        height: dimensions.height,
        rx: 9,
        class: 'radar-label-plate'
      }));

      const text = svgElement('text', {
        x, y: y + (isPrimary ? -4 : 1),
        'text-anchor': 'middle',
        class: 'radar-label-text'
      });
      text.textContent = label;
      group.append(text);

      const level = svgElement('text', {
        x, y: y + (isPrimary ? 13 : 15),
        'text-anchor': 'middle',
        class: 'radar-label-level'
      });
      level.textContent = language === 'en' ? `LEVEL ${capability.level}` : `${language === 'zh' ? '等级' : '等級'} ${capability.level}`;
      group.append(level);

      if (isPrimary) {
        const marker = svgElement('text', {
          x, y: y - 18,
          'text-anchor': 'middle',
          class: 'radar-primary-marker'
        });
        marker.textContent = copy.primary;
        group.append(marker);
      }

      const navigate = () => {
        window.location.href = safeHref(`capabilities.html#${capability.id}`);
      };
      group.addEventListener('click', navigate);
      group.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigate();
        }
      });
      svg.append(group);
    });

    setText('radar-heading', yearData.year);
    setText(
      'radar-current-state',
      yearData.year === CURRENT_YEAR
        ? `${copy.current} ${CURRENT_YEAR}`
        : `${copy.selected} ${yearData.year} · ${copy.current} ${CURRENT_YEAR}`
    );
    setText('radar-summary', localized(yearData.snapshot));

    $$('#year-switch button').forEach((button) => {
      const active = Number(button.dataset.year) === yearData.year;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function renderRadarControls() {
    const years = data.radar.years;
    $('#year-switch').innerHTML = years.map((year) =>
      `<button type="button" data-year="${year.year}" aria-pressed="false">${year.year}</button>`
    ).join('');

    $$('#year-switch button').forEach((button) => {
      button.addEventListener('click', () => {
        const next = years.find((item) => item.year === Number(button.dataset.year));
        if (next) renderRadar(next);
      });
    });

    $('#scale-legend').innerHTML = data.scale.map((item) => `
      <span class="scale-item">
        <strong>${language === 'en' ? `L${item.level}` : `${item.level}${language === 'zh' ? '级' : '級'}`}</strong>
        ${escapeHtml(localized(item.label))}
      </span>
    `).join('');

    renderRadar(years.find((year) => year.year === data.radar.defaultYear) || years.at(-1));
  }

  function eventPosition(index, count, isRtl) {
    if (count <= 1) return 50;
    const visualIndex = isRtl ? count - 1 - index : index;
    return 16 + visualIndex * (68 / (count - 1));
  }

  function timelineEventMarkup(event, index, count, isRtl) {
    const position = eventPosition(index, count, isRtl);
    const edgeClass = position < 25 ? ' edge-start' : position > 75 ? ' edge-end' : '';
    const labelClass = index % 2 === 0 ? ' label-up' : ' label-down';
    const milestone = event.type === 'milestone';
    const title = escapeHtml(localized(event.title));
    const summary = escapeHtml(localized(event.summary));
    const href = escapeHtml(safeHref(event.target));
    const capabilityText = (event.capabilityIds || []).join(' · ');

    return `
      <button class="timeline-event ${milestone ? 'is-milestone' : 'is-progress'}${labelClass}${edgeClass}"
        type="button" style="left:${position}%" data-year="${event.year}"
        data-capabilities="${escapeHtml(capabilityText)}"
        aria-label="${title}, ${escapeHtml(event.date || String(event.year))}">
        <span class="event-node" aria-hidden="true"></span>
        <span class="event-label">${title}</span>
        <span class="event-detail" role="tooltip">
          <span class="event-date">${escapeHtml(event.date || String(event.year))}</span>
          <strong>${title}</strong>
          <span>${summary}</span>
          ${event.target ? `<a href="${href}">${escapeHtml(COPY[language].detail)} →</a>` : ''}
        </span>
      </button>
    `;
  }

  function renderTimeline() {
    const grouped = new Map();
    data.timeline.events.forEach((event) => {
      if (!grouped.has(event.year)) grouped.set(event.year, []);
      grouped.get(event.year).push(event);
    });

    const years = [...grouped.keys()].sort((a, b) => a - b);
    $('#timeline-list').innerHTML = years.map((year, rowIndex) => {
      const events = grouped.get(year);
      const isRtl = rowIndex % 2 === 1;
      return `
        <div class="timeline-row ${isRtl ? 'is-rtl' : 'is-ltr'}" data-timeline-year="${year}">
          <strong class="timeline-year">${year}</strong>
          <span class="timeline-direction" aria-hidden="true">→</span>
          ${events.map((event, index) => timelineEventMarkup(event, index, events.length, isRtl)).join('')}
        </div>
      `;
    }).join('');

    $$('.timeline-event').forEach((button) => {
      button.addEventListener('click', (event) => {
        if (event.target.closest('a')) return;
        const wasOpen = button.classList.contains('is-open');
        $$('.timeline-event.is-open').forEach((item) => item.classList.remove('is-open'));
        button.classList.toggle('is-open', !wasOpen);
        if (!wasOpen) {
          const year = Number(button.dataset.year);
          const snapshot = data.radar.years.find((item) => item.year === year);
          if (snapshot) renderRadar(snapshot);
          setText(
            'timeline-link-message',
            `${COPY[language].linked}: ${year}${button.dataset.capabilities ? ` · ${button.dataset.capabilities}` : ''}`
          );
        }
      });
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.timeline-event')) {
        $$('.timeline-event.is-open').forEach((item) => item.classList.remove('is-open'));
      }
    });
  }

  function echoTerms(portal) {
    const layout = ECHO_LAYOUTS[portal.id] || ECHO_LAYOUTS.collaboration;
    const source = portal.terms.filter((term) => term.size !== 'echo').slice(0, layout.length);
    return layout.map((position, index) => ({
      ...source[index % source.length],
      ...position,
      size: 'echo',
      echo: true
    }));
  }

  function renderPortals() {
    $('#archive-portals').innerHTML = data.portals.map((portal, index) => {
      const terms = [...portal.terms, ...echoTerms(portal)];
      const target = escapeHtml(safeHref(portal.target));
      const portalCode = language === 'en' ? portal.id.toUpperCase() : localized(portal.title);
      const updatedLabel = language === 'en' ? 'UPDATED' : language === 'zh' ? '更新' : '更新';
      const stampLabel = language === 'en' ? 'ARCHIVE / 2026' : language === 'zh' ? '档案 / 2026' : '檔案 / 2026';
      return `
        <a class="portal-card portal-${escapeHtml(portal.visual)}" id="portal-${escapeHtml(portal.id)}" href="${target}">
          <span class="portal-motif" data-stamp="${escapeHtml(stampLabel)}" aria-hidden="true"></span>
          <span class="portal-card-inner">
            <span class="portal-copy">
              <span class="portal-index">0${index + 1} / ${escapeHtml(portalCode)}</span>
              <h3>${escapeHtml(localized(portal.title))}</h3>
              <p>${escapeHtml(localized(portal.description))}</p>
              <span class="portal-meta">
                <strong>${escapeHtml(localized(portal.count))}</strong>
                <span>${updatedLabel} ${escapeHtml(portal.updated)}</span>
              </span>
            </span>
            <span class="portal-cloud" aria-hidden="true">
              ${terms.map((term) => `
                <span class="cloud-term is-${escapeHtml(term.size)}${term.echo ? ' is-repeat' : ''}"
                  style="left:${Number(term.x)}%;top:${Number(term.y)}%">
                  ${escapeHtml(localizedTerm(term))}
                </span>
              `).join('')}
            </span>
          </span>
        </a>
      `;
    }).join('');
  }

  function setupLanguageControls() {
    $$('.archive-language button').forEach((button) => {
      button.addEventListener('click', () => {
        const next = button.dataset.language;
        if (!LANGUAGES.includes(next)) return;
        storeLanguage(next);
        const url = new URL(window.location.href);
        url.searchParams.set('lang', next);
        window.location.href = url.href;
      });
    });
  }

  function setupSectionRail() {
    const sections = ['profile', 'timeline', 'archive']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const activate = (id) => {
      $$('[data-section-link]').forEach((link) => {
        link.classList.toggle('is-active', link.dataset.sectionLink === id);
      });
      document.body.classList.toggle('is-paper-chapter', id === 'archive');
    };

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) activate(visible.target.id);
    }, { threshold: [0.35, 0.55, 0.72] });

    sections.forEach((section) => observer.observe(section));

    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const progress = $('#rail-progress');
      if (progress) progress.style.height = `${ratio * 100}%`;
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  async function load() {
    language = currentLanguage();
    setState(COPY[language].loading);

    try {
      const response = await fetch('content/generated/homepage.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Homepage data: HTTP ${response.status}`);
      data = await response.json();

      renderChrome();
      renderProfile();
      renderRadarControls();
      renderTimeline();
      renderPortals();
      setupLanguageControls();
      setupSectionRail();
      setState('');
    } catch (error) {
      console.error(error);
      setState(COPY[language].error, true);
    }
  }

  document.addEventListener('DOMContentLoaded', load);
})();
