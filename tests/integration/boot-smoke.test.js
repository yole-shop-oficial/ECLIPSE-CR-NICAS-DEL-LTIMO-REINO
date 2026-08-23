import test from 'node:test';
import assert from 'node:assert/strict';

/** Smoke de integración: replica la secuencia de arranque de main.js sin DOM. */

import { createConfig, EVENTS, GAME_VERSION } from '../../src/core/config.js';
import { createEventBus } from '../../src/core/event-bus.js';
import { createLogger } from '../../src/core/logger.js';
import { createErrorHandler } from '../../src/core/error-handler.js';
import { createStateManager } from '../../src/core/state-manager.js';
import { createContentRegistry } from '../../src/core/content-registry.js';
import { createMemoryDriver } from '../../src/storage/memory-driver.js';
import { createSaveSystem, AUTO_SLOT } from '../../src/storage/save-system.js';
import { registerRanks, RANK_ORDER } from '../../data/ranks.js';

test('secuencia de boot completa en modo memoria', async () => {
  const logger = createLogger({ level: 'silent' });
  const bus = createEventBus({ onError: (e) => { throw e; } });
  const errors = createErrorHandler({ logger, bus });
  const config = createConfig({ qualityTier: 'MEDIUM' });

  let ready = null;
  bus.on(EVENTS.CORE_READY, (p) => { ready = p; });
  errors.report(new Error('de prueba'), 'smoke');
  assert.equal(errors.stats().reported, 1);

  const registry = createContentRegistry();
  registerRanks(registry);
  assert.equal(registry.all('rank').length, RANK_ORDER.length);

  const state = createStateManager({ profile: { version: config.version } });
  const saves = createSaveSystem({ driver: createMemoryDriver(), bus, logger });

  assert.equal(await saves.recover(), null);
  await saves.autosave(state.snapshot());
  state.set('protagonist', 'heredero_cenizas');
  await saves.autosave(state.snapshot());

  const recovered = await saves.recover();
  state.hydrate(recovered.record.data);
  assert.equal(state.get('protagonist'), 'heredero_cenizas');

  const auto = await saves.load(AUTO_SLOT);
  assert.equal(auto.data.profile.version, GAME_VERSION);

  bus.emit(EVENTS.CORE_READY, { version: config.version });
  assert.deepEqual(ready, { version: GAME_VERSION });
});
