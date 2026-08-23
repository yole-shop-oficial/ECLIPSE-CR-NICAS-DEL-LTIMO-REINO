/**
 * core/state-manager.js — Store central por rutas ('profile.name').
 * La UI lee snapshots; las mutaciones pasan por set/update y notifican suscriptores.
 * snapshot()/hydrate() alimentan al Save System.
 */

function clone(value) {
  if (value === undefined) return undefined;
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

export function createStateManager(initial = {}) {
  let state = clone(initial);
  const listeners = new Map(); // path | '*' -> Set<fn>

  function notify(path, value) {
    const exact = listeners.get(path);
    const wildcard = listeners.get('*');
    for (const set of [exact, wildcard]) {
      if (!set) continue;
      for (const fn of [...set]) fn(value, path);
    }
  }

  function get(path) {
    if (!path) return clone(state);
    let node = state;
    for (const part of path.split('.')) {
      if (node == null || typeof node !== 'object') return undefined;
      node = node[part];
    }
    return clone(node);
  }

  function set(path, value) {
    if (typeof path !== 'string' || path.length === 0) {
      throw new Error('state.set requiere una ruta');
    }
    const parts = path.split('.');
    let node = state;
    for (let i = 0; i < parts.length - 1; i += 1) {
      const key = parts[i];
      if (node[key] == null || typeof node[key] !== 'object') node[key] = {};
      node = node[key];
    }
    const stored = clone(value);
    node[parts[parts.length - 1]] = stored;
    notify(path, stored);
    return stored;
  }

  function update(path, fn) {
    if (typeof fn !== 'function') throw new TypeError('state.update requiere función');
    return set(path, fn(get(path)));
  }

  /** Suscripción por ruta exacta o '*' para todo el árbol. Devuelve unsubscribe. */
  function subscribe(path, fn) {
    if (typeof fn !== 'function') throw new TypeError('state.subscribe requiere función');
    if (!listeners.has(path)) listeners.set(path, new Set());
    listeners.get(path).add(fn);
    return () => {
      const set = listeners.get(path);
      if (!set) return;
      set.delete(fn);
      if (set.size === 0) listeners.delete(path);
    };
  }

  /** Copia profunda del estado completo, lista para persistir. */
  function snapshot() {
    return clone(state);
  }

  /** Restaura estado desde un snapshot (carga de partida). */
  function hydrate(next) {
    state = clone(next ?? {});
    notify('*', state);
    return state;
  }

  function reset() {
    return hydrate(initial);
  }

  return Object.freeze({ get, set, update, subscribe, snapshot, hydrate, reset });
}
