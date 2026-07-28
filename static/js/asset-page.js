const ASSET_LANGS = ['zh', 'chinese-traditional', 'en'];

function assetLang() {
  const saved = localStorage.getItem('lang');
  return ASSET_LANGS.includes(saved) ? saved : 'chinese-traditional';
}

function assetText(value, lang) {
  if (typeof value === 'string') return value;
  return value?.[lang] || value?.zh || '';
}

function assetEscape(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function loadAssetPage(kind) {
  const lang = assetLang();
  const response = await fetch(`content/generated/${kind}.json?v=${Date.now()}`);
  if (!response.ok) throw new Error(`Cannot load ${kind} assets`);
  const data = await response.json();

  document.title = assetText(data.page.title, lang);
  document.getElementById('page-title').textContent = assetText(data.page.title, lang);
  document.getElementById('page-description').textContent = assetText(data.page.description, lang);

  document.getElementById('content-grid').innerHTML = (data.items || []).map((item) => `
    <article class="asset-card">
      <div class="asset-card-meta">${assetEscape(item.category || '')} · ${assetEscape(item.status || '')}</div>
      <h2>${assetEscape(assetText(item.title, lang))}</h2>
      <p>${assetEscape(assetText(item.summary, lang))}</p>
      <div class="asset-tags">${(item.tags || []).map(tag => `<span>${assetEscape(tag)}</span>`).join('')}</div>
    </article>
  `).join('');
}

window.loadAssetPage = loadAssetPage;
