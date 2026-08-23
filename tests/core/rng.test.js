import test from 'node:test';
import assert from 'node:assert/strict';
import { createRng, hashSeed } from '../../src/core/rng.js';

test('misma seed → misma secuencia (determinismo)', () => {
  const a = createRng('arma:semilla-42');
  const b = createRng('arma:semilla-42');
  for (let i = 0; i < 50; i += 1) assert.equal(a.next(), b.next());
});

test('distinta seed → secuencia distinta', () => {
  const a = createRng('seed-1');
  const b = createRng('seed-2');
  const seqA = Array.from({ length: 8 }, () => a.next());
  const seqB = Array.from({ length: 8 }, () => b.next());
  assert.notDeepEqual(seqA, seqB);
});

test('int() respeta el rango inclusivo', () => {
  const rng = createRng(7);
  for (let i = 0; i < 200; i += 1) {
    const value = rng.int(3, 9);
    assert.ok(Number.isInteger(value) && value >= 3 && value <= 9);
  }
});

test('shuffle() es una permutación y es determinista', () => {
  const base = [1, 2, 3, 4, 5, 6, 7, 8];
  const a = createRng('barajar').shuffle(base);
  const b = createRng('barajar').shuffle(base);
  assert.deepEqual(a, b);
  assert.deepEqual([...a].sort((x, y) => x - y), base);
});

test('pick() y chance() se comportan', () => {
  const rng = createRng(99);
  const options = ['espada', 'lanza', 'hacha'];
  for (let i = 0; i < 50; i += 1) assert.ok(options.includes(rng.pick(options)));
  assert.equal(rng.chance(0), false);
  assert.equal(rng.chance(1), true);
});

test('hashSeed es estable', () => {
  assert.equal(hashSeed('eclipse'), hashSeed('eclipse'));
  assert.notEqual(hashSeed('eclipse'), hashSeed('Eclipse'));
});
