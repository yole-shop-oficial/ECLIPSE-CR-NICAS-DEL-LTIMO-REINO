// core/platform — Detección de capacidades del dispositivo (ARCH §5, §8).
// Ningún módulo consulta el DOM/navigator directamente: lo hace aquí.

export function detectPlatform() {
  const nav = typeof navigator !== 'undefined' ? navigator : {};
  const win = typeof window !== 'undefined' ? window : {};
  return {
    isBrowser: typeof document !== 'undefined',
    serviceWorker: 'serviceWorker' in nav,
    indexedDB: 'indexedDB' in win,
    webCrypto: !!(win.crypto && win.crypto.subtle),
    offscreenCanvas: typeof OffscreenCanvas !== 'undefined',
    webgl2: detectWebGL2(),
    touch: 'ontouchstart' in win || (nav.maxTouchPoints || 0) > 0,
    dpr: Math.min(win.devicePixelRatio || 1, 2), // presupuesto: DPR máx 2
    online: typeof nav.onLine === 'boolean' ? nav.onLine : true,
    language: nav.language || 'es',
  };
}

function detectWebGL2() {
  try {
    const c = document.createElement('canvas');
    return !!c.getContext('webgl2');
  } catch { return false; }
}
