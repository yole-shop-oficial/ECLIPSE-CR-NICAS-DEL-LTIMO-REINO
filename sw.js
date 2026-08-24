// sw.js — Service Worker: app-shell cache-first. OFFLINE FIRST (Mega §35).
const VERSION = 'eclipse-v0.1.1';

const SHELL = [
  'index.html',
  'manifest.webmanifest',
  'styles/base.css',
  'styles/codex.css',
  'src/main.js',
  'src/core/kernel.js',
  'src/core/events.js',
  'src/core/rng.js',
  'src/core/platform.js',
  'src/data/registry.js',
  'src/data/validate.js',
  'src/game/rank/service.js',
  'src/game/evolution/rules.js',
  'src/game/cards/model.js',
  'src/game/cards/geom.js',
  'src/game/cards/gemPainter.js',
  'src/game/cards/framePainter.js',
  'src/game/cards/sigilPainter.js',
  'src/game/cards/sigilMotifs.js',
  'src/game/cards/textPainter.js',
  'src/game/cards/composer.js',
  'src/game/weapons/generator.js',
  'src/game/weapons/names.js',
  'src/storage/db.js',
  'src/storage/saveEngine.js',
  'src/security/crypto.js',
  'src/offline/offlineEngine.js',
  'src/ui/engine.js',
  'src/ui/components/cardView.js',
  'src/ui/screens/splash.js',
  'src/ui/screens/prologue.js',
  'src/ui/screens/choose.js',
  'src/ui/screens/sanctum.js',
  'content/ranks.json',
  'content/protagonists/protagonists.json',
  'content/factions/factions.json',
  'content/weapons/components.json',
  'content/story/prologue.json',
  'assets/brand/icon-192.png',
  'assets/brand/icon-512.png',
  'assets/brand/prologue-bg.jpg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('index.html'))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(hit => {
      if (hit) return hit;
      return fetch(e.request).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(e.request, copy));
        }
        return res;
      });
    })
  );
});
