// game/evolution — Reglas canónicas de evolución (GDD cap. 03 §3).
// Regla del +3 para cartas normales; protagonistas G→XG.
// La regla vive AQUÍ (motor), nunca solo en la interfaz (Mega §6).

export const CARD_TYPE_PROTAGONIST = 'protagonist';
export const NORMAL_MAX_OFFSET = 3;   // base + 3 rangos, tope duro
export const NORMAL_ABSOLUTE_CAP = 'URRX'; // XG es exclusivo de los Portadores
export const PROTAGONIST_FLOOR = 'G'; // los Portadores empiezan en G

export class EvolutionRules {
  constructor(rankService) { this._ranks = rankService; }

  /**
   * Techo evolutivo de una carta.
   * @param {{type:string, baseRank:string}} card
   * @returns {string} id de rango máximo alcanzable
   */
  ceiling(card) {
    if (card.type === CARD_TYPE_PROTAGONIST) return 'XG';
    // XG es exclusivo de los Portadores: el techo normal nunca supera URRX,
    // aunque base+3 cayera matemáticamente en XG (canon GDD cap. 03 §3).
    const raw = this._ranks.atOffset(card.baseRank, NORMAL_MAX_OFFSET);
    const capIdx = this._ranks.index(NORMAL_ABSOLUTE_CAP);
    return raw.order > capIdx ? NORMAL_ABSOLUTE_CAP : raw.id;
  }

  /** Rango inicial de una carta (protagonista = G; normal = su base). */
  startingRank(card) {
    return card.type === CARD_TYPE_PROTAGONIST ? PROTAGONIST_FLOOR : card.baseRank;
  }

  /**
   * ¿Puede esta carta evolucionar a `targetRank`? Decisión de motor.
   * @returns {{ok:boolean, reason:string}}
   */
  canEvolve(card, targetRank) {
    const target = this._ranks.index(targetRank);
    const baseIdx = card.type === CARD_TYPE_PROTAGONIST
      ? this._ranks.index(PROTAGONIST_FLOOR)
      : this._ranks.index(card.baseRank);
    if (target < baseIdx) return { ok: false, reason: 'rango por debajo del origen' };
    if (card.type === CARD_TYPE_PROTAGONIST) {
      return target <= this._ranks.index('XG')
        ? { ok: true, reason: 'el Portador puede alcanzar XG' }
        : { ok: false, reason: 'no existe rango superior a XG' };
    }
    const ceilingIdx = this._ranks.index(this.ceiling(card));
    if (target > ceilingIdx) {
      return { ok: false, reason: `regla +3: techo de ${card.baseRank} es ${this.ceiling(card)}` };
    }
    return { ok: true, reason: 'dentro del límite +3' };
  }

  /** Escalera evolutiva completa disponible para la carta. */
  evolutionPath(card) {
    return this._ranks.path(this.startingRank(card), this.ceiling(card));
  }
}
