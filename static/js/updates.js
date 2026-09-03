(() => {
  const LANGUAGES = ['zh', 'chinese-traditional', 'en'];
  const COPY = {
    zh: {
      title: '动态',
      eyebrow: '动态',
      value: '记录正在发生的学习、生活与作品，让文字和影像共同保存变化，而不是只留下最后的结果。',
      note: '影像集中保存现场与质感，文字保留思考与方法；两者共同构成持续更新的个人时间流。',
      imagesLink: '图片动态',
      documentsLink: '文档动态',
      loading: '正在加载动态…',
      error: '动态加载失败。',
      imagesTitle: '影像动态',
      imagesDescription: '活动、个人交流与平面设计作品集中呈现，以连续影像轨道保留不同阶段的现场。',
      activitiesTitle: '活动与阶段现场',
      activitiesDescription: '项目、交流与阶段性经历的现场记录。',
      documentsTitle: '文字记录',
      documentsDescription: '项目复盘、学习笔记与阶段性思考。',
      personalTitle: '个人与交流',
      personalDescription: '保留生活、交流与交换经历中的真实片段。',
      designTitle: '设计作品',
      designDescription: '以视觉作品记录表达能力与审美实践的形成。',
      read: '阅读全文',
      fallback: '打开记录查看完整内容。',
      help: '轨道会持续缓慢移动；拖动后停留在所选位置，点击轮播之外的区域恢复自动播放，点击图片可放大。',
      close: '关闭'
    },
    'chinese-traditional': {
      title: '動態',
      eyebrow: '動態',
      value: '記錄正在發生的學習、生活與作品，讓文字和影像共同保存變化，而不是只留下最後的結果。',
      note: '影像集中保存現場與質感，文字保留思考與方法；兩者共同構成持續更新的個人時間流。',
      imagesLink: '圖片動態',
      documentsLink: '文檔動態',
      loading: '正在載入動態…',
      error: '動態載入失敗。',
      imagesTitle: '影像動態',
      imagesDescription: '活動、個人交流與平面設計作品集中呈現，以連續影像軌道保留不同階段的現場。',
      activitiesTitle: '活動與階段現場',
      activitiesDescription: '專案、交流與階段性經歷的現場記錄。',
      documentsTitle: '文字記錄',
      documentsDescription: '專案複盤、學習筆記與階段性思考。',
      personalTitle: '個人與交流',
      personalDescription: '保留生活、交流與交換經歷中的真實片段。',
      designTitle: '設計作品',
      designDescription: '以視覺作品記錄表達能力與審美實踐的形成。',
      read: '閱讀全文',
      fallback: '開啟記錄查看完整內容。',
      help: '軌道會持續緩慢移動；拖動後停留在所選位置，點擊輪播之外的區域恢復自動播放，點擊圖片可放大。',
      close: '關閉'
    },
    en: {
      title: 'Updates',
      eyebrow: 'Updates',
      value: 'Record learning, life, and work while they are happening, so words and images preserve change instead of only the final result.',
      note: 'Images preserve place and texture together; writing retains reasoning and method. Both form a continuously updated personal timeline.',
      imagesLink: 'Image updates',
      documentsLink: 'Written updates',
      loading: 'Loading updates…',
      error: 'Updates failed to load.',
      imagesTitle: 'Image Updates',
      imagesDescription: 'Activities, personal exchanges, and design work are gathered into continuous visual tracks that preserve each stage.',
      activitiesTitle: 'Activities & Milestones',
      activitiesDescription: 'On-site records of projects, exchanges, and formative stages.',
      documentsTitle: 'Written Records',
      documentsDescription: 'Project reviews, learning notes, and periodic reflections.',
      personalTitle: 'Personal & Exchange',
      personalDescription: 'Authentic fragments from life, communication, and exchange experiences.',
      designTitle: 'Design Work',
      designDescription: 'Visual records of how communication and design practice developed.',
      read: 'Read record',
      fallback: 'Open the record to read the complete entry.',
      help: 'Tracks move continuously at a restrained pace. After dragging, they stay where you leave them; click outside the carousel to resume. Select an image to enlarge it.',
      close: 'Close'
    }
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value) => ArchiveChrome.escapeHtml(value);

  function setState(message, isError = false) {
    const state = $('#updates-state');
    state.textContent = message;
    state.classList.toggle('is-error', isError);
  }

  function stripFrontMatter(markdown) {
    return String(markdown || '').replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*\r?\n?/, '');
  }

  function plainExcerptText(value) {
    return String(value || '')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<figure\b[^>]*>[\s\S]*?<\/figure>/gi, ' ')
      .replace(/<br\s*\/?\s*>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;|&#160;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;|&#34;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/<[^>]+>/g, ' ')
      .replace(/\\([\[\]().])/g, '$1')
      .replace(/\[\d+\]/g, ' ')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/~~~[\s\S]*?~~~/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^[-*>+]\s+/gm, '')
      .replace(/^\d+[.)]\s+/gm, '')
      .replace(/[*_`~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function excerpt(markdown, fallback) {
    const body = stripFrontMatter(markdown);
    const lede = body.match(/<p\b[^>]*class=(["'])[^"']*\bpost-lede\b[^"']*\1[^>]*>([\s\S]*?)<\/p>/i);
    const source = lede ? lede[2] : body;
    return plainExcerptText(source).slice(0, 170) || fallback;
  }

  function normalizePostPath(value) {
    let path = String(value || '').trim();
    if (!path) return '';
    const language = ArchiveChrome.language;
    if (!path.includes('/')) return `posts/${language}/${path}`;
    if (path.startsWith('posts/')) {
      const segments = path.split('/');
      if (segments.length === 2) return `posts/${language}/${segments[1]}`;
      if (!LANGUAGES.includes(segments[1])) return `posts/${language}/${segments.slice(1).join('/')}`;
    }
    return path;
  }

  async function enrichPost(post, fallback) {
    const file = normalizePostPath(post.file);
    try {
      const response = await fetch(encodeURI(file), { cache: 'no-cache' });
      if (!response.ok) return { ...post, file, excerpt: fallback };
      return { ...post, file, excerpt: excerpt(await response.text(), fallback) };
    } catch {
      return { ...post, file, excerpt: fallback };
    }
  }

  function imageUrl(directory, file) {
    return `${directory}${encodeURIComponent(String(file))}`;
  }

  function mediaSequence(collection, clone = false) {
    const items = collection.files.map((file, index) => {
      const src = imageUrl(collection.directory, file);
      const caption = `${collection.title} ${index + 1}`;
      return `<button type="button" class="media-item${collection.design ? ' is-design' : ''}" data-media-src="${esc(src)}" data-media-caption="${esc(caption)}"${clone ? ' tabindex="-1"' : ''}><img src="${esc(src)}" alt="${clone ? '' : esc(caption)}" loading="lazy" decoding="async" draggable="false"></button>`;
    }).join('');
    return `<div class="media-sequence"${clone ? ' aria-hidden="true"' : ''}>${items}</div>`;
  }

  function mediaRow(collection, index) {
    return `
      <section class="media-row" data-media-row="${esc(collection.id)}">
        <header class="media-row-header">
          <span class="media-row-index">${String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3>${esc(collection.title)}</h3>
            <p>${esc(collection.description)}</p>
          </div>
        </header>
        <div class="media-viewport" tabindex="0" aria-label="${esc(collection.title)}">
          <div class="media-track">${mediaSequence(collection, true)}${mediaSequence(collection)}${mediaSequence(collection, true)}</div>
        </div>
      </section>`;
  }

  function mediaArchiveBlock(collections) {
    const copy = COPY[ArchiveChrome.language];
    return `
      <section class="media-archive-section" id="images">
        <header class="media-archive-header">
          <div>
            <p class="section-label">IMAGE STREAM</p>
            <h2>${esc(copy.imagesTitle)}</h2>
          </div>
          <p>${esc(copy.imagesDescription)}</p>
        </header>
        <div class="media-rows">
          ${collections.map(mediaRow).join('')}
        </div>
        <p class="media-help">${esc(copy.help)}</p>
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
      if (viewport.hasPointerCapture?.(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
      }
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

    viewport.addEventListener('focusin', () => {
      focusPaused = true;
    });

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

  function initDialog() {
    const dialog = $('#media-dialog');
    const image = $('#media-dialog-image');
    const caption = $('#media-dialog-caption');

    $('#updates-stream').addEventListener('click', (event) => {
      const button = event.target.closest('[data-media-src]');
      if (!button) return;
      image.src = button.dataset.mediaSrc;
      image.alt = button.dataset.mediaCaption || '';
      caption.textContent = button.dataset.mediaCaption || '';
      dialog.showModal();
    });

    $('#media-dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  async function render(config) {
    const copy = COPY[ArchiveChrome.language];
    const posts = (Array.isArray(config.posts) ? config.posts : [])
      .filter((post) => post?.file)
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    const enriched = await Promise.all(posts.map((post) => enrichPost(post, copy.fallback)));

    const collections = [
      {
        id: 'activities',
        title: copy.activitiesTitle,
        description: copy.activitiesDescription,
        directory: 'static/assets/show/',
        files: config['show-images'] || []
      },
      {
        id: 'personal',
        title: copy.personalTitle,
        description: copy.personalDescription,
        directory: 'static/assets/person/',
        files: config['person-images'] || []
      },
      {
        id: 'design',
        title: copy.designTitle,
        description: copy.designDescription,
        directory: `static/assets/${encodeURIComponent('平面设计')}/`,
        files: config['design-images'] || [],
        design: true
      }
    ].filter((item) => item.files.length);

    const documentBlock = `
      <section class="update-block documents-block" id="documents">
        <header class="update-block-header">
          <div>
            <p class="section-label">DOCUMENTS</p>
            <h2>${esc(copy.documentsTitle)}</h2>
          </div>
          <p class="update-block-description">${esc(copy.documentsDescription)}</p>
        </header>
        <div class="post-card-grid">
          ${enriched.map((post, index) => {
            const href = `post.html?lang=${encodeURIComponent(ArchiveChrome.language)}&f=${encodeURIComponent(post.file)}`;
            return `<a class="update-post-card" href="${esc(href)}"><time>${esc(post.date || '—')}</time><h3>${esc(post.title || post.file)}</h3><p>${esc(post.excerpt)}</p><span class="read-link">${esc(copy.read)} · ${String(index + 1).padStart(2, '0')} ↗</span></a>`;
          }).join('')}
        </div>
      </section>`;

    $('#updates-stream').innerHTML = `${mediaArchiveBlock(collections)}${documentBlock}`;
    $$('.media-viewport').forEach(initTrack);
    initDialog();
  }

  async function init() {
    const copy = COPY[ArchiveChrome.language];
    document.title = `${copy.title} · Li Yucheng`;
    $('#updates-eyebrow').textContent = copy.eyebrow;
    $('#updates-title').textContent = copy.title;
    $('#updates-value').textContent = copy.value;
    $('#updates-note').textContent = copy.note;
    $('#updates-images-link').textContent = copy.imagesLink;
    $('#updates-documents-link').textContent = copy.documentsLink;
    $('#media-dialog-close').setAttribute('aria-label', copy.close);
    setState(copy.loading);

    try {
      const response = await fetch(`contents/config.${ArchiveChrome.language}.yml`, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Config HTTP ${response.status}`);
      const config = jsyaml.load(await response.text()) || {};
      await render(config);
      setState('');
    } catch (error) {
      console.error(error);
      setState(copy.error, true);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
