import test from 'node:test';
import assert from 'node:assert/strict';
import { createContentRegistry } from '../../src/core/content-registry.js';

test('register/get/has/all funcionan', () => {
  const registry = createContentRegistry();
  registry.register('card', { id: 'card_prueba', rank: 'G' });
  assert.equal(registry.has('card', 'card_prueba'), true);
  assert.equal(registry.get('card', 'card_prueba').rank, 'G');
  assert.equal(registry.all('card').length, 1);
});

test('definiciones quedan congeladas (inmutables)', () => {
  const registry = createContentRegistry();
  const def = registry.register('weapon', { id: 'w1', base: 'espada' });
  assert.throws(() => { def.base = 'hacha'; }, TypeError);
});

test('id duplicado lanza error', () => {
  const registry = createContentRegistry();
  registry.register('item', { id: 'i1' });
  assert.throws(() => registry.register('item', { id: 'i1' }), /duplicado/);
});

test('tipo desconocido lanza en modo estricto', () => {
  const registry = createContentRegistry();
  assert.throws(() => registry.register('cosas', { id: 'x' }), /desconocido/);
});

test('definición sin id lanza', () => {
  const registry = createContentRegistry();
  assert.throws(() => registry.register('card', { name: 'sin id' }), /id/);
});

test('registerPack registra múltiples tipos y cuenta', () => {
  const registry = createContentRegistry();
  const counts = registry.registerPack({
    id: 'pack_prueba',
    items: {
      card: [{ id: 'c1' }, { id: 'c2' }],
      enemy: [{ id: 'e1' }],
    },
  });
  assert.deepEqual(counts, { card: 2, enemy: 1 });
  assert.equal(registry.all('card').length, 2);
});

test('stats resume el contenido registrado', () => {
  const registry = createContentRegistry();
  registry.register('card', { id: 'c1' });
  registry.register('boss', { id: 'b1' });
  assert.deepEqual(registry.stats(), { card: 1, boss: 1 });
});
