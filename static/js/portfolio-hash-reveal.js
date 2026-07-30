(() => {
  const TARGET_PREFIX = 'record-';
  const MAX_ATTEMPTS = 80;
  const RETRY_DELAY_MS = 75;
  let retryTimer = 0;

  function decodedHashId() {
    const raw = String(location.hash || '').replace(/^#/, '');
    if (!raw) return '';
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }

  function clearTargetState() {
    document.querySelectorAll('.portfolio-record.is-targeted, .portfolio-evidence-grid .is-targeted')
      .forEach((element) => element.classList.remove('is-targeted'));
  }

  function revealTarget() {
    const id = decodedHashId();
    if (!id.startsWith(TARGET_PREFIX)) return true;

    const target = document.getElementById(id);
    if (!target) return false;

    clearTargetState();
    target.classList.add('is-targeted');

    const details = target.querySelector('details.portfolio-record-details');
    if (details) details.open = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        target.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'auto' });
        target.focus?.({ preventScroll: true });
      });
    });

    window.__portfolioHashTarget = id;
    return true;
  }

  function scheduleReveal(attempt = 0) {
    window.clearTimeout(retryTimer);
    if (revealTarget() || attempt >= MAX_ATTEMPTS) return;
    retryTimer = window.setTimeout(() => scheduleReveal(attempt + 1), RETRY_DELAY_MS);
  }

  window.addEventListener('hashchange', () => scheduleReveal());
  window.addEventListener('pageshow', () => scheduleReveal());
  document.addEventListener('DOMContentLoaded', () => scheduleReveal(), { once: true });

  if (document.readyState !== 'loading') scheduleReveal();
})();
