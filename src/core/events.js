// core/events — EventBus mínimo. Los módulos publican/suscriben sin conocerse.

export class EventBus {
  constructor() { this._map = new Map(); }

  on(name, fn) {
    if (!this._map.has(name)) this._map.set(name, new Set());
    this._map.get(name).add(fn);
    return () => this.off(name, fn);
  }

  off(name, fn) { this._map.get(name)?.delete(fn); }

  emit(name, payload) {
    const set = this._map.get(name);
    if (set) for (const fn of [...set]) fn(payload);
    const wild = this._map.get('*');
    if (wild) for (const fn of [...wild]) fn({ name, payload });
  }

  clear() { this._map.clear(); }
}
