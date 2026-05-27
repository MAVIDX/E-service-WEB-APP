const CACHE = 'eservice-v1';
const PRECACHE = ['/', '/manifest.json', '/images/logo-services.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith('http')) return; // skip chrome-extension:// etc.
  if (e.request.url.includes('/api/')) return; // nunca cachear API calls

  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request).then(res => {
        if (res.ok) {
          const cloned = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, cloned));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
