(() => {
  const LANGUAGES = ['zh', 'chinese-traditional', 'en'];
  const COPY = {
    zh: {
      title: '动态',
      eyebrow: '动态',
      value: '记录正在发生的学习、生活与作品，让文字和影像共同保存变化，而不是只留下最后的结果。',
      note: '文档保留思考与方法，影像保留现场与质感；两种记录交替出现，共同构成连续的个人时间流。',
      imagesLink: '图片动态',
      documentsLink: '文档动态',
      loading: '正在加载动态…',
      error: '动态加载失败。',
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
      help: '轨道会缓慢播放；悬停、聚焦或拖动时暂停，点击图片可放大。',
      close: '关闭'
    },
    'chinese-traditional': {
      title: '動態',
      eyebrow: '動態',
      value: '記錄正在發生的學習、生活與作品，讓文字和影像共同保存變化，而不是只留下最後的結果。',
      note: '文檔保留思考與方法，影像保留現場與質感；兩種記錄交替出現，共同構成連續的個人時間流。',
      imagesLink: '圖片動態',
      documentsLink: '文檔動態',
      loading: '正在載入動態…',
      error: '動態載入失敗。',
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
      help: '軌道會緩慢播放；懸停、聚焦或拖動時暫停，點擊圖片可放大。',
      close: '關閉'
    },
    en: {
      title: 'Updates',
      eyebrow: 'Updates',
      value: 'Record learning, life, and work while they are happening, so words and images preserve change instead of only the final result.',
      note: 'Documents retain reasoning and method; images retain place and texture. Alternating both creates a continuous personal timeline.',
      imagesLink: 'Image updates',
      documentsLink: 'Written updates',
      loading: 'Loading updates…',
      error: 'Updates failed to load.',
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
      help: 'Tracks move slowly. Hover, focus, or drag to pause; select an image to enlarge it.',
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

  function excerpt(markdown, fallback) {
    return stripFrontMatter(markdown)
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^[-*>]\s+/gm, '')
      .replace(/[*_`~]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 170) || fallback;
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

  function mediaItems(collection) {
    const items = collection.files.map((file, index) => {
      const src = imageUrl(collection.directory, file);
      const caption = `${collection.title} ${index + 1}`;
      return `<button type="button" class="media-item${collection.design ? ' is-design' : ''}" data-media-src="${esc(src)}" data-media-caption="${esc(caption)}"><img src="${esc(src)}" alt="${esc(caption)}" loading="lazy" decoding="async"></button>`;
    }).join('');
    return items + items;
  }

  function mediaBlock(collection, index) {
    return `
      <section class="update-block is-dark" id="${index === 0 ? 'images' : esc(collection.id)}">
        <header class="update-block-header">
          <div>
            <p class="section-label">${String(index + 1).padStart(2, '0')} / IMAGE</p>
            <h2>${esc(collection.title)}</h2>
          </div>
          <p class="update-block-description">${esc(collection.description)}</p>
        </header>
        <div class="media-viewport" tabindex="0" aria-label="${esc(collection.title)}">
          <div class="media-track">${mediaItems(collection)}</div>
        </div>
        <p class="media-help">${esc(COPY[ArchiveChrome.language].help)}</p>
      </section>`;
  }

  function initTrack(viewport) {
    const track = $('.media-track', viewport);
    const originalCount = track.children.length / 2;
    [...track.children].slice(originalCount).forEach((item) => {
      item.setAttribute('aria-hidden', 'true');
      item.tabIndex = -1;
    });

    let paused = false;
    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let last = performance.now();
    let visible = true;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    }, { threshold: .05 });
    observer.observe(viewport);

    function frame(now) {
      const dt = Math.min(40, now - last);
      last = now;
      if (!reduce && !paused && !dragging && visible && viewport.scrollWidth > viewport.clientWidth) {
        viewport.scrollLeft += dt * .022;
        const half = track.scrollWidth / 2;
        if (viewport.scrollLeft >= half) viewport.scrollLeft -= half;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    viewport.addEventListener('mouseenter', () => { paused = true; });
    viewport.addEventListener('mouseleave', () => { paused = false; });
    viewport.addEventListener('focusin', () => { paused = true; });
    viewport.addEventListener('focusout', () => { paused = false; });
    viewport.addEventListener('pointerdown', (event) => {
      dragging = true;
      paused = true;
      startX = event.clientX;
      startScroll = viewport.scrollLeft;
      viewport.setPointerCapture(event.pointerId);
    });
    viewport.addEventListener('pointermove', (event) => {
      if (dragging) viewport.scrollLeft = startScroll - (event.clientX - startX);
    });
    const end = (event) => {
      dragging = false;
      paused = false;
      if (viewport.hasPointerCapture?.(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    };
    viewport.addEventListener('pointerup', end);
    viewport.addEventListener('pointercancel', end);
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
      <section class="update-block" id="documents">
        <header class="update-block-header">
          <div>
            <p class="section-label">02 / DOCUMENTS</p>
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

    const blocks = [];
    if (collections[0]) blocks.push(mediaBlock(collections[0], 0));
    blocks.push(documentBlock);
    collections.slice(1).forEach((collection, index) => blocks.push(mediaBlock(collection, index + 2)));
    $('#updates-stream').innerHTML = blocks.join('');
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
