// game/cards — Modelo de instancia de carta (lo que se guarda del jugador).
// La definición vive en /content; la instancia solo guarda lo mutable (ARCH §7).

import { makeRng } from '../../core/rng.js';
import { CARD_TYPE_PROTAGONIST } from '../evolution/rules.js';

let counter = 0;

export function createCardInstance(def, evolutionRules, ownerRngSeed) {
  const rng = makeRng(`${ownerRngSeed}:${def.id}:${counter++}`);
  const baseRank = def.type === CARD_TYPE_PROTAGONIST ? 'G' : def.baseRank;
  return {
    instanceId: `ci/${def.id.replace('/', '-')}-${counter.toString(36)}${rng.int(0, 35).toString(36)}`,
    cardId: def.id,
    type: def.type || 'normal',
    rank: evolutionRules.startingRank({ type: def.type || 'normal', baseRank }),
    baseRank,
    echoes: [],      // formas anteriores conservadas (Echo System)
    bonds: [],       // vínculos desarrollados con otras cartas
    visualSeed: rng.int(0, 0xffffffff),
    acquiredAt: Date.now(),
  };
}

/** Poder bruto orientativo (UI, IA). Las fórmulas de combate viven en CombatEngine. */
export function powerHint(def, rankIndex) {
  const s = def.stats;
  return (s.atk * 2 + s.def + s.ene) * (1 + rankIndex * 0.12);
}
