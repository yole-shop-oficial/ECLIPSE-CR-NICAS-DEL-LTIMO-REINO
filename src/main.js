/**
 * main.js — Secuencia de arranque (FASE 1).
 * Orden: logger → bus → errores → config → registry(+rangos) → state → storage → UI.
 * Emite 'core:ready' al terminar; la pantalla de diagnóstico muestra el resultado.
 */

import { createConfig, EVENTS } from './core/config.js';
import { createEventBus } from './core/event-bus.js';
import { createLogger } from './core/logger.js';
import { createErrorHandler } from './core/error-handler.js';
import { createStateManager } from './core/state-manager.js';
import { createContentRegistry } from './core/content-registry.js';
import { createIdbDriver } from './storage/idb-driver.js';
import { createMemoryDriver } from './storage/memory-driver.js';
import { createSaveSystem } from './storage/save-system.js';
import { registerRanks, RANK_ORDER } from '../data/ranks.js';
import { renderBootScreen } from './ui/boot-screen.js';

async function boot(app) {
  const report = [];
  const mark = (label, ok, detail = '') => report.push({ label, ok, detail });

  const logger = createLogger({ level: 'debug' });
  const bus = createEventBus({
    onError: (err, ctx) => logger.captureError(err, `bus:${ctx.event}`),
  });
  const errors = createErrorHandler({ logger, bus });
  errors.attach(globalThis);

  const config = createConfig();
  mark('Configuración', true, `calidad ${config.qualityTier}`);

  const registry = createContentRegistry();
  registerRanks(registry);
  mark('Content Registry', registry.all('rank').length === RANK_ORDER.length,
    `${registry.all('rank').length}/${RANK_ORDER.length} rangos registrados`);

  const state = createStateManager({
    profile: { createdAt: Date.now(), version: config.version },
    settings: { quality: config.qualityTier },
    story: { flags: {}, scars: {} },
    world: {},
    collection: {},
  });
  mark('State Manager', true, 'estado inicial montado');

  let driver = createIdbDriver('eclipse-save');
  const saves = createSaveSystem({ driver, bus, logger });
  let storageOk = await saves.probe();
  if (!storageOk) {
    logger.warn('IndexedDB no disponible; usando memoria volátil');
    driver = createMemoryDriver();
  }
  const saveSystem = storageOk ? saves : createSaveSystem({ driver, bus, logger });
  mark('Almacenamiento', storageOk, storageOk ? 'IndexedDB operativo' : 'fallback memoria');

  const recovered = await saveSystem.recover();
  if (recovered) {
    state.hydrate(recovered.record.data);
    mark('Partida recuperada', true, recovered.fromBackup ? 'desde backup' : 'slot auto');
  } else {
    await saveSystem.autosave(state.snapshot());
    mark('Partida nueva', true, 'autoguardado inicial creado');
  }

  bus.emit(EVENTS.CORE_READY, { version: config.version });
  renderBootScreen(app, { config, report, registry, state, logger, bus });
  logger.info('core:ready', { version: config.version });
}

boot(document.getElementById('app')).catch((err) => {
  const app = document.getElementById('app');
  app.innerHTML = '';
  const pre = document.createElement('pre');
  pre.className = 'boot-fatal';
  pre.textContent = `Fallo de arranque: ${err?.message ?? err}`;
  app.appendChild(pre);
  console.error(err);
});
