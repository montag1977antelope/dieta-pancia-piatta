// sw.js — PWA app-shell cache (minimo e solido)
const CACHE = 'dieta-shell-v1';

// Metti SOLO file realmente esistenti per evitare errori in install:
const ASSETS = [
  '/',                // se servi dalla root del dominio
  '/index.html',
  '/manifest.json',
  '/css/style.css',
  '/js/app.js',
  '/js/utils.js',
  '/js/database.js',
  '/js/weekly-planner.js',
  '/pages/weekly.html',
  '/pages/settings.html'
  // Se hai anche icone, aggiungi:
  // '/assets/icons/icon-192.png',
  // '/assets/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((net) => {
          const copy = net.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return net;
        })
        .catch(() =>
          // Fallback offline: se non ho la risorsa, torno l'index
          caches.match('/index.html')
        );
      return cached || fetchPromise;
    })
  );
});
