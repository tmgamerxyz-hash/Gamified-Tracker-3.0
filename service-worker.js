/* Simple offline-first service worker for Genius Tracker */
const CACHE_NAME = 'gt-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js', 'https://unpkg.com/@babel/standalone/babel.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Pre-cache assets; use no-cors to handle third-party CDNs
    await Promise.all(ASSETS.map(async (url) => {
      try {
        const resp = await fetch(url, { mode: 'no-cors' });
        if (resp) await cache.put(url, resp.clone());
      } catch (e) {
        // ignore failures; they'll be fetched on demand
      }
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  // App shell strategy for navigations
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const net = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put('./index.html', net.clone());
        return net;
      } catch (e) {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match('./index.html');
        return cached || Response.error();
      }
    })());
    return;
  }
  // Cache-first for everything else
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const net = await fetch(req);
      cache.put(req, net.clone());
      return net;
    } catch (e) {
      return cached || Response.error();
    }
  })());
});