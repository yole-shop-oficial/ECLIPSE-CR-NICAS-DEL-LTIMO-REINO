// tests/weapons — WeaponGenerator: determinismo, gramática y límites (GDD cap. 05).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { RankService } from '../src/game/rank/service.js';
import { WeaponGenerator } from '../src/game/weapons/generator.js';

const url = (p) => new URL(`../content/${p}`, import.meta.url);
const ranksData = JSON.parse(await readFile(url('ranks.json')));
const components = JSON.parse(await readFile(url('weapons/components.json')));
const gen = new WeaponGenerator(components, new RankService(ranksData.ranks));

test('misma semilla ⇒ mismo arma exacta (determinismo, ADR-004)', () => {
  const a = gen.generate({ seed: 'protag/kael:0' });
  const b = gen.generate({ seed: 'protag/kael:0' });
  assert.deepEqual(a, b);
});

test('semillas distintas generan armas distintas', () => {
  const set = new Set();
  for (let i = 0; i < 200; i++) set.add(gen.generate({ seed: `loot:${i}` }).name);
  assert.ok(set.size > 150, `solo ${set.size} nombres únicos en 200`);
});

test('el nombre respeta la gramática castellana', () => {
  const w = gen.generate({ seed: 'protag/kael:0' });
  const type = components.types.find(t => t.id === w.typeId);
  assert.ok(w.name.startsWith(type.name), `${w.name} debe empezar por ${type.name}`);
  assert.ok(!/\s{2,}/.test(w.name));
});

test('los efectos de las runas existen y coinciden', () => {
  for (let i = 0; i < 80; i++) {
    const w = gen.generate({ seed: `x:${i}` });
    if (w.runeId) {
      const rune = components.runes.find(r => r.id === w.runeId);
      if (rune.effect) assert.equal(w.effectId, rune.effect);
    }
    if (w.effectId) assert.ok(components.effects.some(e => e.id === w.effectId));
  }
});

test('el botín ordinario nunca genera XG', () => {
  const ranks = new RankService(ranksData.ranks);
  for (let i = 0; i < 300; i++) {
    const w = gen.generate({ seed: `loot:${i}` });
    assert.ok(ranks.index(w.rank) <= 15, `${w.name} salió en ${w.rank}`);
  }
});

test('restricciones de generación (tipo forzado)', () => {
  const w = gen.generate({ seed: 'forge:1', constraints: { typeId: 'scythe' } });
  assert.equal(w.typeId, 'scythe');
});

test('toda arma lleva lore (pilar: un objeto tiene historia)', () => {
  const w = gen.generate({ seed: 'lore:1' });
  assert.ok(w.lore.length > w.name.length);
});
