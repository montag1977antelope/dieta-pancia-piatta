// sw.js — App shell caching base
const CACHE = 'dietapp-shell-v1';
const ASSETS = [
  '/', '/index.html',
  '/css/style.css',
  '/js/app.js', '/js/utils.js', '/js/database.js',
  '/pages/weekly.html', '/pages/settings.html'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.map(k => k === CACHE ? null : caches.delete(k)))
  ));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(net => {
      if (req.method === 'GET') {
        const clone = net.clone();
        caches.open(CACHE).then(c => c.put(req, clone));
      }
      return net;
    }).catch(() => caches.match('/index.html')))
  );
});
