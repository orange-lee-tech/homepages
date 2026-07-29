(() => {
  function redirect() {
    const target = document.body.dataset.redirectTarget;
    if (!target) return;
    const current = new URL(window.location.href);
    const destination = new URL(target, window.location.href);
    const language = current.searchParams.get('lang');
    if (language) destination.searchParams.set('lang', language);
    current.searchParams.forEach((value, key) => {
      if (key !== 'lang' && !destination.searchParams.has(key)) destination.searchParams.set(key, value);
    });
    window.location.replace(`${destination.pathname.replace(/^\//, '')}${destination.search}${destination.hash}`);
  }
  document.addEventListener('DOMContentLoaded', redirect);
})();
