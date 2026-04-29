const CACHE_NAME = 'dpavo-v1';
const MEDIA_CACHE = 'dpavo-media-v1';

const SHELL_ASSETS = [
  '/',
  '/menu',
  '/events',
  '/about',
  '/offline',
  '/manifest.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME && k !== MEDIA_CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin except media
  if (request.method !== 'GET') return;
  if (url.origin !== location.origin && !url.pathname.startsWith('/media/')) return;

  // Media: cache-first (images/videos are immutable after optimize)
  if (url.pathname.startsWith('/media/') || url.pathname.match(/\.(webp|avif|png|jpg|svg|mp4|woff2)$/)) {
    e.respondWith(
      caches.open(MEDIA_CACHE).then(async cache => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const fresh = await fetch(request);
        if (fresh.ok) cache.put(request, fresh.clone());
        return fresh;
      })
    );
    return;
  }

  // Navigation: network-first, fall back to cache, then /offline
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached ?? caches.match('/offline') ?? Response.error();
        })
    );
    return;
  }

  // Everything else: network-first
  e.respondWith(
    fetch(request).catch(() => caches.match(request).then(r => r ?? Response.error()))
  );
});
