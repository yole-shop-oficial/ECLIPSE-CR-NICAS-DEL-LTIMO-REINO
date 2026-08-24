// tests/rank — RankService sobre los datos canónicos reales (content/ranks.json).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { RankService } from '../src/game/rank/service.js';

const ranksData = JSON.parse(await readFile(new URL('../content/ranks.json', import.meta.url)));
const ranks = new RankService(ranksData.ranks);

test('la escalera tiene 17 rangos y orden canónico', () => {
  assert.equal(ranks.list().length, 17);
  assert.equal(ranks.list()[0].id, 'G');
  assert.equal(ranks.list()[16].id, 'XG');
});

test('index y compare respetan la jerarquía', () => {
  assert.equal(ranks.index('G'), 0);
  assert.equal(ranks.index('XG'), 16);
  assert.ok(ranks.compare('SSS', 'B') > 0);
  assert.ok(ranks.isAbove('URR', 'UR'));
  assert.ok(!ranks.isAbove('F', 'C'));
});

test('next avanza un rango y se detiene en XG', () => {
  assert.equal(ranks.next('G').id, 'F');
  assert.equal(ranks.next('URRX').id, 'XG');
  assert.equal(ranks.next('XG'), null);
});

test('atOffset calcula techos (regla +3)', () => {
  assert.equal(ranks.atOffset('B', 3).id, 'AA');
  assert.equal(ranks.atOffset('SSSR', 3).id, 'URRX');
  assert.equal(ranks.atOffset('URRX', 3).id, 'XG'); // tope de la escala
});

test('path devuelve escaleras inclusivas', () => {
  assert.deepEqual(ranks.path('G', 'C'), ['G', 'F', 'C']);
  assert.equal(ranks.path('G', 'XG').length, 17);
  assert.deepEqual(ranks.path('S', 'B'), []);
});

test('familias correctas', () => {
  assert.equal(ranks.family('G'), 'sealed');
  assert.equal(ranks.family('B'), 'awakened');
  assert.equal(ranks.family('URRX'), 'ultra');
  assert.equal(ranks.family('XG'), 'xg');
});
