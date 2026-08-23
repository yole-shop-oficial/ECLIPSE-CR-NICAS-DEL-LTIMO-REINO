import test from 'node:test';
import assert from 'node:assert/strict';
import { createSaveSystem, AUTO_SLOT, BACKUP_SLOT } from '../../src/storage/save-system.js';
import { createMemoryDriver } from '../../src/storage/memory-driver.js';
import { createEventBus } from '../../src/core/event-bus.js';
import { EVENTS } from '../../src/core/config.js';

function setup() {
  const bus = createEventBus();
  const saves = createSaveSystem({ driver: createMemoryDriver(), bus });
  return { bus, saves };
}

test('save/load en slot manual', async () => {
  const { saves } = setup();
  await saves.save('manual-1', { deck: ['c1'] });
  const record = await saves.load('manual-1');
  assert.deepEqual(record.data, { deck: ['c1'] });
  assert.equal(record.slot, 'manual-1');
  assert.ok(record.savedAt > 0);
});

test('load de slot inexistente devuelve null', async () => {
  const { saves } = setup();
  assert.equal(await saves.load('fantasma'), null);
});

test('autosave rota el slot auto hacia backup', async () => {
  const { saves } = setup();
  await saves.autosave({ paso: 1 });
  await saves.autosave({ paso: 2 });
  const auto = await saves.load(AUTO_SLOT);
  const backup = await saves.load(BACKUP_SLOT);
  assert.equal(auto.data.paso, 2);
  assert.equal(backup.data.paso, 1);
});

test('recover usa auto si existe', async () => {
  const { saves } = setup();
  await saves.autosave({ punto: 'a' });
  const result = await saves.recover();
  assert.equal(result.fromBackup, false);
  assert.equal(result.record.data.punto, 'a');
});

test('recover cae al backup si auto falta', async () => {
  const { saves } = setup();
  await saves.autosave({ punto: 'a' });
  await saves.autosave({ punto: 'b' });
  await saves.remove(AUTO_SLOT);
  const result = await saves.recover();
  assert.equal(result.fromBackup, true);
  assert.equal(result.record.data.punto, 'a');
});

test('recover sin datos devuelve null', async () => {
  const { saves } = setup();
  assert.equal(await saves.recover(), null);
});

test('listSlots excluye el backup', async () => {
  const { saves } = setup();
  await saves.autosave({});
  await saves.save('manual-x', {});
  const slots = await saves.listSlots();
  assert.ok(slots.includes(AUTO_SLOT));
  assert.ok(slots.includes('manual-x'));
  assert.ok(!slots.includes(BACKUP_SLOT));
});

test('save emite save:completed', async () => {
  const { bus, saves } = setup();
  const events = [];
  bus.on(EVENTS.SAVE_COMPLETED, (p) => events.push(p.slot));
  await saves.save('s1', { ok: true });
  assert.deepEqual(events, ['s1']);
});

test('probe verifica salud del driver', async () => {
  const { saves } = setup();
  assert.equal(await saves.probe(), true);
});
