// offline — OfflineEngine: registro del Service Worker + estado de red.
// La app funciona sin SW (desarrollo file://); nunca es exigible.

export class OfflineEngine {
  constructor(events) { this._events = events; }

  async init(swPath = 'sw.js') {
    window.addEventListener('online', () => this._events.emit('net:online', true));
    window.addEventListener('offline', () => this._events.emit('net:online', false));
    if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
    try {
      const reg = await navigator.serviceWorker.register(swPath);
      if (reg.waiting) this._events.emit('app:update-available', reg);
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        nw?.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            this._events.emit('app:update-available', reg);
          }
        });
      });
    } catch (err) {
      console.warn('[offline] SW no registrado:', err.message);
    }
  }
}
