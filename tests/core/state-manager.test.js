import test from 'node:test';
import assert from 'node:assert/strict';
import { createStateManager } from '../../src/core/state-manager.js';

test('set/get por rutas anidadas crea estructura', () => {
  const state = createStateManager();
  state.set('profile.name', 'Heredero');
  assert.equal(state.get('profile.name'), 'Heredero');
  assert.deepEqual(state.get('profile'), { name: 'Heredero' });
});

test('get devuelve undefined para rutas inexistentes', () => {
  const state = createStateManager({ a: 1 });
  assert.equal(state.get('b.c.d'), undefined);
});

test('los snapshots son copias profundas (inmutabilidad de facto)', () => {
  const state = createStateManager({ deck: { cards: ['c1'] } });
  const snap = state.snapshot();
  snap.deck.cards.push('intruso');
  assert.deepEqual(state.get('deck.cards'), ['c1']);
  const read = state.get('deck.cards');
  read.push('otro');
  assert.deepEqual(state.get('deck.cards'), ['c1']);
});

test('subscribe notifica en la ruta exacta y con *', () => {
  const state = createStateManager();
  const hits = [];
  state.subscribe('hp', (v) => hits.push(['hp', v]));
  state.subscribe('*', () => hits.push(['*']));
  state.set('hp', 30);
  assert.deepEqual(hits, [['hp', 30], ['*']]);
});

test('update transforma el valor previo', () => {
  const state = createStateManager({ gold: 10 });
  state.update('gold', (g) => (g ?? 0) + 5);
  assert.equal(state.get('gold'), 15);
});

test('hydrate restaura y reset vuelve al inicial', () => {
  const state = createStateManager({ phase: 'inicio' });
  state.hydrate({ phase: 'cargado' });
  assert.equal(state.get('phase'), 'cargado');
  state.reset();
  assert.equal(state.get('phase'), 'inicio');
});
