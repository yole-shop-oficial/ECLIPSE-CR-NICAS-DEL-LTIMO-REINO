// Service Worker de SEIRYU TACTICS — estrategia offline-first.
// Cachea el app shell y los assets en la instalación, y sirve todo
// desde caché primero para que el juego funcione sin conexión.

const CACHE_VERSION = 'seiryu-v2';
const CACHE_NAME = `seiryu-tactics-${CACHE_VERSION}`;

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/art/loading_bg.webp',
  '/assets/art/title_bg.webp',
  '/assets/art/menu_bg.webp',
  '/assets/art/world_map.webp',
  '/assets/art/hero_male.webp',
  '/assets/art/hero_female.webp',
  '/assets/art/card_back.webp',
  '/assets/art/prologue_1.webp',
  '/assets/art/prologue_2.webp',
  '/assets/art/prologue_3.webp',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn('[SW] Falló el precache del app shell', err))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('seiryu-tactics-') && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isAppOrigin(url) {
  return url.origin === self.location.origin;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (!isAppOrigin(url)) return; // deja pasar fuentes externas (Google Fonts) a la red normal

  // Navegación (carga/recarga de página): network-first para no atascar a los
  // jugadores en una versión vieja del HTML; si no hay red, cae al app shell cacheado.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', resClone));
          return res;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Assets estáticos: cache-first, y se actualiza en segundo plano (stale-while-revalidate).
  event.respondWith(
    caches.match(req).then((cached) => {
      const networkFetch = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return res;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
