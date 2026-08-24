// storage/db — Wrapper IndexedDB (base `eclipse-codex`, schema v1, Mega §36).
// Promesas, transacciones cortas. Puro de API (sin DOM fuera de indexedDB).

const DB_NAME = 'eclipse-codex';
export const SCHEMA_VERSION = 1;

export const STORES = [
  'profile', 'cards', 'inventory', 'weapons', 'characters', 'quests',
  'storyFlags', 'worldState', 'deck', 'settings', 'syncQueue', 'meta', 'keystore',
];

function reqToPromise(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export class CodexDB {
  async open() {
    this._db = await new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, SCHEMA_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        for (const name of STORES) {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name, { keyPath: 'id' });
          }
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return this;
  }

  _store(name, mode = 'readonly') {
    return this._db.transaction(name, mode).objectStore(name);
  }

  get(name, id) { return reqToPromise(this._store(name).get(id)); }
  getAll(name) { return reqToPromise(this._store(name).getAll()); }
  put(name, value) {
    return new Promise((resolve, reject) => {
      const tx = this._db.transaction(name, 'readwrite');
      tx.objectStore(name).put(value);
      tx.oncomplete = () => resolve(value);
      tx.onerror = () => reject(tx.error);
    });
  }
  delete(name, id) {
    return new Promise((resolve, reject) => {
      const tx = this._db.transaction(name, 'readwrite');
      tx.objectStore(name).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
  async clear(name) { return reqToPromise(this._store(name, 'readwrite').clear()); }

  /** Escritura multi-store transaccional con intención (recuperación de cierre). */
  async atomic(writes) {
    const stores = [...new Set(writes.map(w => w.store))];
    await this.put('meta', { id: 'pendingIntent', at: Date.now(), count: writes.length });
    await new Promise((resolve, reject) => {
      const tx = this._db.transaction(stores, 'readwrite');
      for (const w of writes) tx.objectStore(w.store).put(w.value);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    await this.delete('meta', 'pendingIntent').catch(() => {});
  }
}
