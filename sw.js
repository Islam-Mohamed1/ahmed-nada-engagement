const CACHE_NAME = 'ahmed-nada-engagement-v6';
const ASSETS = [
  './',
  './index.html',
  './card.html',
  './manifest.json',
  './invitation-card.png',
  './icon-192.png',
  './icon-512.png',
  './mabrouk_aleina.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone)).catch(() => {});
      return res;
    }).catch(() => caches.match(event.request).then(r => r || caches.match('./index.html')))
  );
});
