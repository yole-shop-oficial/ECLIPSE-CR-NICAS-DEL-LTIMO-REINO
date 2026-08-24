// game/rank — RankService: la escalera oficial de 17 rangos (GDD cap. 03).
// Construido desde datos (content/ranks.json). Puro, sin DOM.

export class RankService {
  constructor(ranks) {
    this._list = [...ranks].sort((a, b) => a.order - b.order);
    this._byId = new Map(this._list.map(r => [r.id, r]));
  }

  list() { return this._list.slice(); }
  get(id) {
    const r = this._byId.get(id);
    if (!r) throw new Error(`rank desconocido: '${id}'`);
    return r;
  }

  index(id) { return this.get(id).order; }
  family(id) { return this.get(id).family; }

  compare(a, b) { return this.index(a) - this.index(b); }
  isAbove(a, b) { return this.compare(a, b) > 0; }

  next(id) {
    const i = this.index(id);
    return i < this._list.length - 1 ? this._list[i + 1] : null;
  }

  /** Rango situado `offset` posiciones por encima (o debajo) de `id`. */
  atOffset(id, offset) {
    const i = this.index(id) + offset;
    return this._list[Math.max(0, Math.min(this._list.length - 1, i))];
  }

  /** Escalera completa entre dos rangos, ambos inclusivos. */
  path(fromId, toId) {
    const a = this.index(fromId); const b = this.index(toId);
    if (b < a) return [];
    return this._list.slice(a, b + 1).map(r => r.id);
  }
}
