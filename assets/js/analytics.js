// Public-site analytics only; private photographer and admin pages are excluded.
(function () {
  const publicPages = ['/', '/index.html', '/albums.html', '/materials.html', '/process.html', '/about.html', '/contact.html', '/albums', '/materials', '/process', '/about', '/contact', '/wedding-albums-cyprus.html', '/wedding-albums-cyprus'];
  if (!publicPages.includes(window.location.pathname) || window.alvezAnalyticsLoaded) return;
  window.alvezAnalyticsLoaded = true;
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  window.va('beforeSend', function (event) {
    const url = new URL(event.url);
    for (const key of Array.from(url.searchParams.keys())) {
      if (!['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'material'].includes(key)) url.searchParams.delete(key);
    }
    url.hash = '';
    return Object.assign({}, event, { url: url.toString() });
  });
  const script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  document.head.appendChild(script);
  document.addEventListener('click', function (event) {
    const quote = event.target.closest && event.target.closest('[data-quote]');
    if (quote) window.va('event', { name: 'Quote Open', data: { page: window.location.pathname } });
    const link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    let name;
    if (href.startsWith('mailto:')) name = 'Email Click';
    else if (href.startsWith('tel:')) name = 'Phone Click';
    else if (link.hostname === 'wa.me') name = 'WhatsApp Click';
    else if (/quote/i.test(link.textContent)) name = 'Quote Click';
    if (name) window.va('event', { name: name, data: { page: window.location.pathname } });
  });
})();

