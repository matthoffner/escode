const VERSION = 4;
const CACHENAME = `escode-pwa-v${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHENAME).then((cache) => {
      return cache.addAll([
        '/',
        './web_modules/react-live.js',
        './index.html',
        './index.js',
        './routes/notfound/index.js',
        './routes/home/index.js',
        'https://unpkg.com/es-react'
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName.startsWith('escode-pwa-') && cacheName !== CACHENAME)
          .map(cacheName => caches.delete(cacheName))
      )
    })
  )
});

self.addEventListener('fetch', async (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(caches.match('/'));
    return;
  }

  event.respondWith(caches.match(event.request).then(res => res || fetch(event.request)))
});
