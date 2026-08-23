/**
 * core/error-handler.js — Captura global de errores y reporte estructurado.
 * Se conecta a `error` y `unhandledrejection` cuando hay DOM; en Node solo `report()`.
 */

export function createErrorHandler({ logger = null, bus = null } = {}) {
  let attached = false;
  let last = null;
  const counts = { reported: 0, window: 0, promise: 0 };

  function normalize(err) {
    if (err instanceof Error) return err;
    return new Error(typeof err === 'string' ? err : JSON.stringify(err) ?? 'error desconocido');
  }

  function report(err, context = 'unknown') {
    const error = normalize(err);
    counts.reported += 1;
    last = Object.freeze({
      at: Date.now(),
      context,
      message: error.message,
      stack: error.stack ?? null,
    });
    logger?.captureError(error, context);
    bus?.emit('error:captured', last);
    return last;
  }

  function onWindowError(event) {
    counts.window += 1;
    report(event.error ?? new Error(event.message ?? 'window error'), 'window');
  }

  function onUnhandledRejection(event) {
    counts.promise += 1;
    report(event.reason, 'promise');
  }

  /** Devuelve false si el entorno no soporta listeners (p. ej. tests en Node). */
  function attach(target = globalThis) {
    if (attached || typeof target?.addEventListener !== 'function') return false;
    target.addEventListener('error', onWindowError);
    target.addEventListener('unhandledrejection', onUnhandledRejection);
    attached = true;
    return true;
  }

  return Object.freeze({
    report,
    attach,
    stats: () => ({ ...counts }),
    lastError: () => last,
  });
}
