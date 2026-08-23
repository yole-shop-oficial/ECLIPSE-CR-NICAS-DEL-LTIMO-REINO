/**
 * core/event-bus.js — Pub/sub central para comunicación entre módulos y capas.
 * Convención: eventos namespaciados con ':' (p. ej. 'combat:turn-end').
 * Los handlers que lanzan excepción se aíslan hacia `onError`; nunca rompen el bus.
 */

export function createEventBus(options = {}) {
  const handlers = new Map(); // event -> Set<fn>
  const onError = typeof options.onError === 'function' ? options.onError : null;

  function on(event, handler) {
    if (typeof event !== 'string' || event.length === 0) {
      throw new TypeError('event-bus.on: se requiere un nombre de evento');
    }
    if (typeof handler !== 'function') {
      throw new TypeError('event-bus.on: el handler debe ser una función');
    }
    if (!handlers.has(event)) handlers.set(event, new Set());
    handlers.get(event).add(handler);
    return () => off(event, handler);
  }

  function once(event, handler) {
    const off = on(event, (payload) => {
      off();
      handler(payload);
    });
    return off;
  }

  function off(event, handler) {
    const set = handlers.get(event);
    if (!set) return;
    set.delete(handler);
    if (set.size === 0) handlers.delete(event);
  }

  function emit(event, payload) {
    const set = handlers.get(event);
    if (!set || set.size === 0) return;
    for (const handler of [...set]) {
      try {
        handler(payload);
      } catch (err) {
        if (onError) onError(err, { event });
        else throw err;
      }
    }
  }

  /** Elimina todos los listeners de un evento, o del bus completo si se omite. */
  function clear(event) {
    if (event === undefined) handlers.clear();
    else handlers.delete(event);
  }

  function listenerCount(event) {
    return handlers.get(event)?.size ?? 0;
  }

  return Object.freeze({ on, once, off, emit, clear, listenerCount });
}
