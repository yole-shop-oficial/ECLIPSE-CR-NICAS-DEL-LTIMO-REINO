// tests/content — Todo el contenido del juego valida contra sus esquemas (data-driven).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as V from '../src/data/validate.js';

const load = async (p) => JSON.parse(await readFile(new URL(`../content/${p}`, import.meta.url)));

test('ranks.json es canónico y completo', async () => {
  assert.equal(V.validateRanks(await load('ranks.json')), true);
});

test('protagonists.json: exactamente 12 con índices únicos', async () => {
  const data = await load('protagonists/protagonists.json');
  assert.equal(V.validateProtagonists(data), true);
  const idx = data.protagonists.map(p => p.index).sort((a, b) => a - b);
  assert.deepEqual(idx, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
});

test('cada protagonista tiene facción y tipo de arma existentes', async () => {
  const [protags, factions, comps] = await Promise.all([
    load('protagonists/protagonists.json'), load('factions/factions.json'),
    load('weapons/components.json')]);
  const factIds = new Set(factions.factions.map(f => f.id));
  const typeIds = new Set(comps.types.map(t => t.id));
  for (const p of protags.protagonists) {
    assert.ok(factIds.has(p.faction), `${p.id}: facción desconocida ${p.faction}`);
    assert.ok(typeIds.has(p.weaponType), `${p.id}: arma desconocida ${p.weaponType}`);
  }
});

test('factions.json y components.json validan', async () => {
  assert.equal(V.validateFactions(await load('factions/factions.json')), true);
  assert.equal(V.validateWeaponComponents(await load('weapons/components.json')), true);
});

test('story/prologue.json valida y tiene prólogo', async () => {
  const data = await load('story/prologue.json');
  assert.equal(V.validateStory(data), true);
  assert.equal(data.scenes[0].id, 'scn/prologue');
});
