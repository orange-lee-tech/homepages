(() => {
  const ENDPOINT = 'https://homepage-aggregate-analytics.orangelee30.workers.dev/view';

  if (!ENDPOINT.startsWith('https://') || ENDPOINT.includes('REPLACE_WITH_')) return;
  if (location.hostname !== 'orange-lee-tech.github.io') return;

  const body = new URLSearchParams({ p: location.pathname });

  fetch(ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    credentials: 'omit',
    cache: 'no-store',
    referrerPolicy: 'no-referrer',
    keepalive: true,
    body,
  }).catch(() => {
    // Analytics is optional. Blocking or network failure must never affect the site.
  });
})();
