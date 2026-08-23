/**
 * storage/memory-driver.js — Driver volátil para tests y fallback de emergencia.
 * Imita la semántica de persistencia serializando con JSON (valores clonados).
 */

function clone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

export function createMemoryDriver() {
  const map = new Map();

  return Object.freeze({
    name: 'memory',
    get: async (key) => clone(map.get(key)),
    set: async (key, value) => {
      map.set(key, clone(value));
    },
    delete: async (key) => {
      map.delete(key);
    },
    keys: async () => [...map.keys()],
    clear: async () => {
      map.clear();
    },
  });
}
