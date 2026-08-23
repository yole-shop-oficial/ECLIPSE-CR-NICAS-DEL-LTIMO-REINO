/**
 * storage/idb-driver.js — Driver IndexedDB promisificado (Mega Prompt §36).
 * Una sola object store key-value; el Save System compone las claves.
 * El driver es inyectable: los tests usan el driver de memoria.
 */

const STORE = 'keyval';

function asPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function createIdbDriver(dbName = 'eclipse-save') {
  let dbPromise = null;

  function open() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error('IndexedDB no disponible en este entorno'));
        return;
      }
      const request = indexedDB.open(dbName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('IndexedDB bloqueado'));
    });
    return dbPromise;
  }

  async function withStore(mode, run) {
    const db = await open();
    const store = db.transaction(STORE, mode).objectStore(STORE);
    return asPromise(run(store));
  }

  return Object.freeze({
    name: 'indexeddb',
    get: (key) => withStore('readonly', (s) => s.get(key)),
    set: (key, value) => withStore('readwrite', (s) => s.put(value, key)),
    delete: (key) => withStore('readwrite', (s) => s.delete(key)),
    keys: () => withStore('readonly', (s) => s.getAllKeys()),
    clear: () => withStore('readwrite', (s) => s.clear()),
  });
}
