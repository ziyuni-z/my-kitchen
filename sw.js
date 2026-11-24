const CACHE_NAME = 'my-kitchen-v1';

const APP_FILES = [
  '/my-kitchen/',
  '/my-kitchen/index.html',
  '/my-kitchen/manifest.json',
  '/my-kitchen/icons/icon-192.png',
  '/my-kitchen/icons/icon-512.png',
  '/my-kitchen/icons/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(async (keys) => {
      await Promise.all(
        keys.filter((key) => key.startsWith('my-kitchen-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin ||
      !url.pathname.startsWith('/my-kitchen/')) return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
