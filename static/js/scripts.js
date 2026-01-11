const content_dir = 'contents/';
const section_names = ['home', 'about', 'interests', 'publications', 'experience', 'awards'];

/**
 * Language resolver:
 * 1) URL param ?lang=zh|en
 * 2) localStorage.lang
 * 3) default zh
 */
function getLang(){
  const url = new URL(window.location.href);
  const q = url.searchParams.get('lang');
  if(q === 'zh' || q === 'en'){
    localStorage.setItem('lang', q);
    return q;
  }
  const saved = localStorage.getItem('lang');
  return (saved === 'en') ? 'en' : 'zh';
}

function withLang(href, lang){
  const u = new URL(href, window.location.href);
  u.searchParams.set('lang', lang);
  return u.pathname + u.search + u.hash;
}

function patchCrossPageLinks(lang){
  // Keep language when navigating across pages
  document.querySelectorAll('a[href^="posts.html"]').forEach(a => {
    a.setAttribute('href', withLang(a.getAttribute('href'), lang));
  });
  document.querySelectorAll('a[href^="post.html"]').forEach(a => {
    a.setAttribute('href', withLang(a.getAttribute('href'), lang));
  });
  document.querySelectorAll('a[href^="index.html"]').forEach(a => {
    a.setAttribute('href', withLang(a.getAttribute('href'), lang));
  });
}

/**
 * Closed-loop carousel (single active slide)
 */
function initCarouselSingle({ trackId, imgDir, files, intervalMs }) {
  const track = document.getElementById(trackId);
  if (!track) {
    console.error('[carousel] missing track element:', trackId);
    return;
  }
  if (!files || files.length === 0) {
    // do not treat as hard error; just skip rendering
    console.warn('[carousel] empty files for:', trackId);
    return;
  }

  // Build items once
  track.innerHTML = files.map(f => `
    <div class="carousel-item-single">
      <img src="${imgDir}${encodeURIComponent(f)}" alt="">
    </div>
  `).join('');

  const items = Array.from(track.querySelectorAll('.carousel-item-single'));
  let idx = 0;

  const render = () => {
    const n = items.length;
    const prevIdx = (idx - 1 + n) % n;
    const nextIdx = (idx + 1) % n;

    items.forEach((el, i) => {
      el.classList.remove('prev', 'active', 'next');
      if (i === prevIdx) el.classList.add('prev');
      else if (i === idx) el.classList.add('active');
      else if (i === nextIdx) el.classList.add('next');
    });
  };

  const next = () => {
    idx = (idx + 1) % items.length;   // closed loop
    render();
  };

  const prev = () => {
    idx = (idx - 1 + items.length) % items.length; // closed loop
    render();
  };

  // Initial render
  render();

  // Buttons (closed loop)
  document.querySelectorAll(`.carousel-btn[data-target="${trackId}"]`).forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.getAttribute('data-action') === 'prev') prev();
      else next();
    });
  });

  // Auto slide (optional)
  let timer = null;
  if (intervalMs && intervalMs > 0) {
    timer = setInterval(next, intervalMs);

    // Pause on hover (desktop)
    track.addEventListener('mouseenter', () => timer && clearInterval(timer));
    track.addEventListener('mouseleave', () => timer = setInterval(next, intervalMs));
  }
}

/**
 * Legacy scroll carousel (unused but kept for compatibility)
 */
function initCarousel({ trackId, imgDir, files, intervalMs }) {
  const track = document.getElementById(trackId);

  if (!track) {
    console.error('[carousel] missing track element:', trackId);
    return;
  }
  if (!files || files.length === 0) {
    console.warn('[carousel] empty files for:', trackId);
    return;
  }

  track.innerHTML = files.map(f => `
    <div class="carousel-item">
      <img src="${imgDir}${encodeURIComponent(f)}" alt="">
    </div>
  `).join('');

  const step = () => {
    const max = track.scrollWidth - track.clientWidth;
    if (max <= 0) return;
    const next = Math.min(track.scrollLeft + track.clientWidth, max);
    track.scrollLeft = (next >= max) ? 0 : next;
  };

  let timer = setInterval(step, intervalMs);

  document.querySelectorAll(`.carousel-btn[data-target="${trackId}"]`).forEach(btn => {
    btn.addEventListener('click', () => {
      clearInterval(timer);
      const dir = btn.getAttribute('data-action');
      const max = track.scrollWidth - track.clientWidth;
      if (dir === 'prev') {
        track.scrollLeft = Math.max(track.scrollLeft - track.clientWidth, 0);
      } else {
        track.scrollLeft = (track.scrollLeft >= max) ? 0 : Math.min(track.scrollLeft + track.clientWidth, max);
      }
      timer = setInterval(step, intervalMs);
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  // Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector('#mainNav');
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: '#mainNav',
      offset: 74,
    });
  }

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector('.navbar-toggler');
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll('#navbarResponsive .nav-link')
  );
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener('click', () => {
      if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
        navbarToggler.click();
      }
    });
  });

  // ===== i18n load =====
  const lang = getLang();
  document.documentElement.lang = (lang === 'en') ? 'en' : 'zh-CN';
  patchCrossPageLinks(lang);
document.querySelectorAll('.lang-switch').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = a.dataset.lang;
    const u = new URL(window.location.href);
    u.searchParams.set('lang', target);
    localStorage.setItem('lang', target);
    window.location.href = u.pathname + '?' + u.searchParams.toString() + window.location.hash;
  });
});

  // 1) Load YAML by lang
  const config_file = `config.${lang}.yml`;
  fetch(content_dir + config_file + '?v=' + Date.now(), { cache: 'no-store' })
    .then(r => {
      if(!r.ok) throw new Error('Failed to load config: ' + r.status);
      return r.text();
    })
    .then(text => {
      const yml = jsyaml.load(text) || {};

      // Inject all config keys into elements with matching ids
      Object.keys(yml).forEach(key => {
        const el = document.getElementById(key);
        if(el) el.innerHTML = yml[key];
      });

      // Carousels (shared across languages)
      initCarouselSingle({
        trackId: 'show-track',
        imgDir: 'static/assets/show/',
        files: yml['show-images'] || [],
        intervalMs: 2500
      });

      initCarouselSingle({
        trackId: 'person-track',
        imgDir: 'static/assets/person/',
        files: yml['person-images'] || [],
        intervalMs: 3000
      });

      // Graphic design folder contains Chinese name: "平面设计"
      initCarouselSingle({
        trackId: 'design-track',
        imgDir: 'static/assets/' + encodeURIComponent('平面设计') + '/',
        files: yml['design-images'] || [],
        intervalMs: 2600
      });
    })
    .catch(err => console.error('[yml] load failed:', err));

  // 2) Load Markdown by lang
  marked.use({ mangle: false, headerIds: false });

  section_names.forEach(name => {
    const url = `${content_dir}${lang}/${name}.md?v=${Date.now()}`;
    fetch(url, { cache: 'no-store' })
      .then(r => {
        if(!r.ok) throw new Error('Failed to load markdown: ' + r.status);
        return r.text();
      })
      .then(md => {
        const html = marked.parse(md);
        const el = document.getElementById(name + '-md');
        if(el) el.innerHTML = html;
      })
      .then(() => { if(window.MathJax) MathJax.typeset(); })
      .catch(err => console.error('[md] load failed:', name, err));
  });
});
