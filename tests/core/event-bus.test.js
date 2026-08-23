import test from 'node:test';
import assert from 'node:assert/strict';
import { createEventBus } from '../../src/core/event-bus.js';

test('on/emit entrega el payload al handler', () => {
  const bus = createEventBus();
  const received = [];
  bus.on('combat:turn-end', (p) => received.push(p));
  bus.emit('combat:turn-end', { turn: 3 });
  assert.deepEqual(received, [{ turn: 3 }]);
});

test('unsubscribe detiene la entrega', () => {
  const bus = createEventBus();
  let count = 0;
  const off = bus.on('x', () => { count += 1; });
  bus.emit('x');
  off();
  bus.emit('x');
  assert.equal(count, 1);
});

test('once entrega una sola vez', () => {
  const bus = createEventBus();
  let count = 0;
  bus.once('y', () => { count += 1; });
  bus.emit('y');
  bus.emit('y');
  assert.equal(count, 1);
});

test('handler roto se aísla hacia onError y no rompe el bus', () => {
  const failures = [];
  const bus = createEventBus({ onError: (err, ctx) => failures.push(ctx.event) });
  bus.on('boom', () => { throw new Error('roto'); });
  let second = false;
  bus.on('boom', () => { second = true; });
  bus.emit('boom');
  assert.deepEqual(failures, ['boom']);
  assert.equal(second, true);
});

test('listenerCount refleja el estado', () => {
  const bus = createEventBus();
  assert.equal(bus.listenerCount('z'), 0);
  const off = bus.on('z', () => {});
  assert.equal(bus.listenerCount('z'), 1);
  off();
  assert.equal(bus.listenerCount('z'), 0);
});
