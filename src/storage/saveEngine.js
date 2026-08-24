// storage/saveEngine — Perfil del Cronista + autosave (GDD/ARCH §7).
// Las mutaciones de dominio pasan por aquí; nunca se toca IDB desde la UI.

const PROFILE_ID = 'chronicle';

export class SaveEngine {
  constructor(db) { this._db = db; this._timer = null; this._pending = []; }

  async init() {
    // Recuperación de cierre inesperado: si quedó intención pendiente, la asentamos.
    await this._db.delete('meta', 'pendingIntent').catch(() => {});
  }

  async hasProfile() { return !!(await this._db.get('profile', PROFILE_ID)); }
  async loadProfile() { return this._db.get('profile', PROFILE_ID); }

  async createProfile({ name = 'Cronista', protagonist }) {
    const profile = {
      id: PROFILE_ID,
      name,
      protagonistId: protagonist.id,
      protagonistRank: 'G',
      createdAt: Date.now(),
      playtime: 0,
      echoes: [],
    };
    const protagonistCard = {
      id: `card-owned/${protagonist.id}`,
      cardId: protagonist.id, type: 'protagonist',
      rank: 'G', baseRank: 'G', echoes: [], bonds: [], acquiredAt: Date.now(),
    };
    await this._db.atomic([
      { store: 'profile', value: profile },
      { store: 'cards', value: protagonistCard },
      { store: 'storyFlags', value: { id: 'flags', data: { prologueSeen: false } } },
      { store: 'worldState', value: { id: 'world', scars: [], wars: {}, nodes: {} } },
    ]);
    return profile;
  }

  /** Autosave con debounce: los sistemas llaman a queue(). */
  queue(writes) {
    this._pending.push(...writes);
    clearTimeout(this._timer);
    this._timer = setTimeout(() => this.flush(), 500);
  }

  async flush() {
    if (!this._pending.length) return;
    const batch = this._pending.splice(0, this._pending.length);
    await this._db.atomic(batch);
  }

  /** Reinicia la crónica (nueva elección de Portador). */
  async reset() {
    for (const s of ['profile', 'cards', 'storyFlags', 'worldState', 'inventory',
      'weapons', 'characters', 'quests', 'deck']) {
      await this._db.clear(s);
    }
  }
}
