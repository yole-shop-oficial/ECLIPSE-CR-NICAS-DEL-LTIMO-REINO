import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RANK_ORDER, RANK_DEFINITIONS, registerRanks, rankIndex, canEvolveTo,
  NORMAL_MAX_EVOLUTION_STEPS,
} from '../../data/ranks.js';
import { createContentRegistry } from '../../src/core/content-registry.js';

test('orden canónico de 17 rangos (Mega Prompt §7)', () => {
  assert.deepEqual(RANK_ORDER, [
    'G', 'F', 'C', 'D', 'B', 'BB', 'A', 'AA', 'AAA',
    'S', 'SS', 'SSS', 'SSSR', 'UR', 'URR', 'URRX', 'XG',
  ]);
});

test('hay exactamente una definición por rango', () => {
  assert.equal(RANK_DEFINITIONS.length, 17);
  const ids = new Set(RANK_DEFINITIONS.map((d) => d.id));
  assert.equal(ids.size, 17);
  for (const code of RANK_ORDER) {
    assert.ok(RANK_DEFINITIONS.some((d) => d.code === code), `falta rango ${code}`);
  }
});

test('cada definición trae identidad visual completa', () => {
  for (const def of RANK_DEFINITIONS) {
    assert.ok(def.name, `${def.code}: nombre`);
    assert.ok(def.material, `${def.code}: material`);
    assert.match(def.palette.base, /^#[0-9a-f]{6}$/i, `${def.code}: base`);
    assert.match(def.palette.accent, /^#[0-9a-f]{6}$/i, `${def.code}: accent`);
    assert.match(def.palette.glow, /^#[0-9a-f]{6}$/i, `${def.code}: glow`);
    assert.ok(def.particles, `${def.code}: partículas`);
    assert.ok(def.audioCue, `${def.code}: audio`);
    assert.equal(def.framePath, `assets/cards/frames/${def.code}/`);
  }
});

test('registerRanks llena el Content Registry sin duplicados', () => {
  const registry = createContentRegistry();
  assert.equal(registerRanks(registry), 17);
  assert.equal(registry.all('rank').length, 17);
  assert.equal(registry.get('rank', 'rank_XG').code, 'XG');
  assert.throws(() => registerRanks(registry), /duplicado/);
});

test('regla de evolución: normales +3, protagonistas G→XG', () => {
  assert.equal(NORMAL_MAX_EVOLUTION_STEPS, 3);
  // Normal base B → BB, A, AA (sí) y AAA (no). GDD §10.
  assert.equal(canEvolveTo('B', 'AA'), true);
  assert.equal(canEvolveTo('B', 'AAA'), false);
  // Normal base SSSR → UR, URR, URRX (sí); no más allá.
  assert.equal(canEvolveTo('SSSR', 'URRX'), true);
  assert.equal(canEvolveTo('SSSR', 'XG'), false);
  // Retroceder nunca.
  assert.equal(canEvolveTo('A', 'G'), false);
  // Protagonista: todo el arco.
  assert.equal(canEvolveTo('G', 'XG', { protagonist: true }), true);
  assert.equal(rankIndex('G'), 0);
  assert.equal(rankIndex('XG'), 16);
});
