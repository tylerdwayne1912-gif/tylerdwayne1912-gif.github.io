/* ============================================================
   NextTrade Service Worker
   v3 — network-first for HTML/manifest, cache-first for assets
   ============================================================ */

const CACHE_NAME = 'nexttrade-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/app.html',
  '/download.html',
  '/icon-192.png',
  '/icon-512.png'
];
/* Never cache these — always go to network */
const NO_CACHE = [
  '/manifest.json',
  '/service-worker.js'
];

/* ---------- Install: precache core assets (tolerant) ---------- */
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

/* ---------- Activate: nuke ALL old caches ---------- */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ---------- Fetch ---------- */
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* Skip cross-origin (Binance WS, CoinDesk, TradingView, ethers CDN) */
  if (url.origin !== self.location.origin) return;

  /* Skip non-HTTP (chrome-extension, etc.) */
  if (!url.protocol.startsWith('http')) return;

  /* Never cache: manifest + SW itself */
  if (NO_CACHE.some(p => url.pathname === p)) {
    event.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  /* Network-first for HTML pages so updates land immediately */
  const isHtml = req.headers.get('accept')?.includes('text/html')
              || url.pathname === '/'
              || url.pathname.endsWith('.html');

  if (isHtml) {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(req, clone)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(req).then(cached => cached || caches.match('/app.html')))
    );
    return;
  }

  /* Cache-first for static assets (icons, images) */
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
    })
  );
});

/* ---------- Allow page to trigger SW update ---------- */
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
