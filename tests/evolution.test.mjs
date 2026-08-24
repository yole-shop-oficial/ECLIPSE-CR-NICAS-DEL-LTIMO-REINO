// tests/evolution — Reglas canónicas (Mega §5/§6): protagonista G→XG, normal base+3.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { RankService } from '../src/game/rank/service.js';
import { EvolutionRules, CARD_TYPE_PROTAGONIST } from '../src/game/evolution/rules.js';

const ranksData = JSON.parse(await readFile(new URL('../content/ranks.json', import.meta.url)));
const rules = new EvolutionRules(new RankService(ranksData.ranks));

test('protagonista empieza en G y puede llegar a XG', () => {
  const p = { type: CARD_TYPE_PROTAGONIST, baseRank: 'G' };
  assert.equal(rules.startingRank(p), 'G');
  assert.equal(rules.ceiling(p), 'XG');
  assert.equal(rules.canEvolve(p, 'XG').ok, true);
  assert.equal(rules.evolutionPath(p).length, 17);
});

test('carta normal base B: techo AA (base + 3)', () => {
  const c = { type: 'normal', baseRank: 'B' };
  assert.equal(rules.startingRank(c), 'B');
  assert.equal(rules.ceiling(c), 'AA');
  assert.equal(rules.canEvolve(c, 'AA').ok, true);
  assert.equal(rules.canEvolve(c, 'AAA').ok, false);
  assert.match(rules.canEvolve(c, 'AAA').reason, /regla \+3/);
  assert.deepEqual(rules.evolutionPath(c), ['B', 'BB', 'A', 'AA']);
});

test('carta normal base SSSR: techo URRX, jamás XG', () => {
  const c = { type: 'normal', baseRank: 'SSSR' };
  assert.equal(rules.ceiling(c), 'URRX');
  assert.equal(rules.canEvolve(c, 'URRX').ok, true);
  assert.equal(rules.canEvolve(c, 'XG').ok, false);
});

test('ninguna carta normal puede evolucionar a XG cualesquiera sea su base', () => {
  for (const r of ['G', 'C', 'A', 'S', 'SSS', 'UR', 'URR']) {
    assert.equal(rules.canEvolve({ type: 'normal', baseRank: r }, 'XG').ok, false, `base ${r}`);
  }
});

test('no se puede bajar del origen', () => {
  const p = { type: CARD_TYPE_PROTAGONIST, baseRank: 'G' };
  assert.equal(rules.canEvolve({ type: 'normal', baseRank: 'D' }, 'C').ok, false);
  assert.equal(rules.canEvolve(p, 'G').ok, true); // quedarse en origen es válido
});

test('los 12 protagonistas reales siguen la regla', async () => {
  const data = JSON.parse(await readFile(
    new URL('../content/protagonists/protagonists.json', import.meta.url)));
  for (const def of data.protagonists) {
    const path = rules.evolutionPath({ type: 'protagonist', baseRank: 'G' });
    assert.equal(path.length, 17, def.id);
    assert.equal(path.at(-1), 'XG');
  }
});
