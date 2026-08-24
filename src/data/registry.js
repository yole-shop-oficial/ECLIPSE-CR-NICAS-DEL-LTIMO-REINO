// data/registry — ContentRegistry: carga packs JSON, los valida y los indexa.
// El núcleo no cambia cuando entra contenido nuevo (ADR-004, ARCH §6).

import * as V from './validate.js';

const PACKS = [
  { url: 'content/ranks.json', type: 'rank', key: 'ranks', validate: V.validateRanks },
  { url: 'content/protagonists/protagonists.json', type: 'protagonist', key: 'protagonists', validate: V.validateProtagonists },
  { url: 'content/factions/factions.json', type: 'faction', key: 'factions', validate: V.validateFactions },
  { url: 'content/weapons/components.json', type: 'weaponComponents', key: null, validate: V.validateWeaponComponents },
  { url: 'content/story/prologue.json', type: 'story', key: 'scenes', validate: V.validateStory },
];

export class ContentRegistry {
  constructor(fetcher) {
    this._fetch = fetcher || ((url) => fetch(url).then(r => {
      if (!r.ok) throw new Error(`content: ${url} → ${r.status}`);
      return r.json();
    }));
    this._byType = new Map();
    this._raw = new Map();
  }

  async loadAll() {
    const results = await Promise.all(PACKS.map(p => this._fetch(p.url).then(d => ({ p, d }))));
    for (const { p, d } of results) this._register(p, d);
    return this;
  }

  _register(pack, data) {
    pack.validate(data);
    this._raw.set(pack.type, data);
    if (!pack.key) return;
    if (!this._byType.has(pack.type)) this._byType.set(pack.type, new Map());
    const map = this._byType.get(pack.type);
    for (const item of data[pack.key]) map.set(item.id, item);
  }

  get(type, id) {
    const item = this._byType.get(type)?.get(id);
    if (!item) throw new Error(`content: no existe ${type} '${id}'`);
    return item;
  }

  all(type) { return [...(this._byType.get(type)?.values() || [])]; }
  components() { return this._raw.get('weaponComponents'); }
  raw(type) { return this._raw.get(type); }
}
