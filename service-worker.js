const CACHE_NAME = 'nexttrade-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/app.html',
  '/download.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install: cache core assets (tolerant — a missing file won't fail the install)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.all(
        ASSETS.map(url =>
          cache.add(url).catch(err => console.warn('[SW] Skip cache:', url, err))
        )
      ))
      .catch(() => {})
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for our assets, network-first for everything else
self.addEventListener('fetch', event => {
  const req = event.request;
  if(req.method !== 'GET') return;

  // Don't cache API calls or cross-origin (Binance WS, CoinDesk, TradingView)
  const url = new URL(req.url);
  if(url.origin !== self.location.origin){
    return; // let the browser handle it normally
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if(cached) return cached;
      return fetch(req).then(res => {
        if(res && res.status === 200){
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
    })
  );
});
