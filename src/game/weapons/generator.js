// game/weapons — WeaponGenerator: miles de armas por componentes con semilla
// determinista (GDD cap. 05). Se guarda la semilla, no el resultado. Puro.

import { makeRng } from '../../core/rng.js';
import { buildWeaponName, buildLoreLine } from './names.js';

export class WeaponGenerator {
  /**
   * @param {object} components  content/weapons/components.json
   * @param {RankService} ranks  para ponderar rangos y techo estadístico
   */
  constructor(components, ranks) {
    if (!components?.types?.length) throw new Error('WeaponGenerator: componentes inválidos');
    this._c = components;
    this._ranks = ranks;
  }

  /**
   * Genera un arma completa y reproducible.
   * @param {{seed:string|number, constraints?:{typeId?:string, maxRankIndex?:number}}} opts
   */
  generate({ seed, constraints = {} }) {
    const rng = makeRng(`weapon:${seed}`);
    const type = constraints.typeId
      ? this._c.types.find(t => t.id === constraints.typeId)
      : rng.pick(this._c.types);
    const material = rng.pick(this._c.materials);
    const core = rng.chance(0.85) ? rng.pick(this._c.cores) : null;
    const rune = rng.chance(0.7) ? rng.pick(this._c.runes) : null;
    const effect = rune?.effect
      ? this._c.effects.find(e => e.id === rune.effect)
      : (rng.chance(0.35) ? rng.pick(this._c.effects) : null);
    const rank = this._rollRank(rng, material.tier, constraints.maxRankIndex);
    const { name } = buildWeaponName(type, core, rune, material);
    const power = this._power(type, material, rank);
    return {
      id: `wpn/${seed}`,
      seed: String(seed),
      typeId: type.id, materialId: material.id,
      coreId: core?.id || null, runeId: rune?.id || null,
      effectId: effect?.id || null,
      rank: rank.id, name, power,
      affinity: core?.affinity || null,
      lore: buildLoreLine(rng, name, material, core),
    };
  }

  _rollRank(rng, materialTier, capIndex = 15) { // botín normal nunca llega a XG
    const base = rng.int(0, 9) + (materialTier - 1) * 2;
    const idx = Math.min(base + (rng.chance(0.12) ? rng.int(1, 3) : 0), capIndex);
    return this._ranks.list()[idx];
  }

  _power(type, material, rank) {
    return Math.round((type.atk * 2 + material.tier * 3) * (1 + rank.order * 0.1));
  }
}
