/**
 * sw.js — Service Worker base (FASE 1). Estrategia:
 *  - install: precache del shell mínimo.
 *  - fetch: mismo origen GET → cache-first con rellenado de red (runtime cache),
 *    de modo que tras la primera visita el juego arranca sin Internet.
 * La estrategia completa (versionado de assets, datos, recuperación) llega en FASE 11.
 */

const CACHE_NAME = 'eclipse-shell-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/main.css',
  './assets/icons/icon.svg',
  './assets/icons/icon-maskable.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const refresh = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || refresh;
    })
  );
});
