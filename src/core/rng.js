/**
 * core/rng.js — RNG determinista para generación procedural (Mega Prompt §12).
 * Misma seed ⇒ mismo objeto. xmur3 (hash de strings) + mulberry32 (secuencia).
 * Base de WeaponGenerator, EnemyGenerator, EventGenerator, NameGenerator, etc.
 */

/** Hash de string → uint32 (xmur3). */
export function hashSeed(input) {
  const str = String(input);
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
}

/** Generador uint32 → float [0,1) (mulberry32). */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** RNG utilitario con seed numérica o de texto. API congelada y segura. */
export function createRng(seed) {
  const numeric = typeof seed === 'number' ? seed >>> 0 : hashSeed(seed);
  const next = mulberry32(numeric);

  return Object.freeze({
    seed: numeric,
    /** float [0,1) */
    next,
    /** float [min,max) */
    real: (min = 0, max = 1) => min + next() * (max - min),
    /** entero inclusivo [min,max] */
    int: (min, max) => Math.floor(min + next() * (max - min + 1)),
    /** elemento aleatorio de un array no vacío */
    pick: (array) => {
      if (!Array.isArray(array) || array.length === 0) {
        throw new Error('rng.pick requiere un array no vacío');
      }
      return array[Math.floor(next() * array.length)];
    },
    /** true con probabilidad p ∈ [0,1] */
    chance: (p) => next() < p,
    /** Fisher-Yates: permutación nueva determinista */
    shuffle: (array) => {
      const out = array.slice();
      for (let i = out.length - 1; i > 0; i -= 1) {
        const j = Math.floor(next() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    },
  });
}
