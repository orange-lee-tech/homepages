(() => {
  function redirect() {
    const current = new URL(window.location.href);
    const language = current.searchParams.get('lang');
    const routes = {
      '#collaboration': ['projects.html', '#collaboration'],
      '#interests': ['learning.html', '#interests'],
      '#knowledge': ['learning.html', '#knowledge'],
      '#honors': ['capabilities.html', '#honors']
    };
    const [path, hash] = routes[current.hash] || ['index.html', '#archive'];
    const destination = new URL(path, window.location.href);
    if (language) destination.searchParams.set('lang', language);
    window.location.replace(`${destination.pathname.replace(/^\//, '')}${destination.search}${hash}`);
  }
  document.addEventListener('DOMContentLoaded', redirect);
})();
