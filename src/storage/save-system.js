/**
 * storage/save-system.js — Guardado offline-first (GDD §19, Mega Prompt §36).
 * Slot `auto` + copia de seguridad previa: si `auto` falta/corrompe, `recover()`
 * restaura desde `auto:backup`. Autoguardado, slots manuales y prueba de salud.
 */

import { EVENTS, SAVE_SCHEMA_VERSION } from '../core/config.js';

export const AUTO_SLOT = 'auto';
export const BACKUP_SLOT = 'auto:backup';

export function createSaveSystem({ driver, bus = null, logger = null }) {
  if (!driver) throw new Error('save-system requiere un driver de almacenamiento');

  function keyFor(slot) {
    return `save:${slot}`;
  }

  async function save(slot, data) {
    if (typeof slot !== 'string' || slot.length === 0) {
      throw new Error('save-system: slot inválido');
    }
    const record = {
      schema: SAVE_SCHEMA_VERSION,
      slot,
      savedAt: Date.now(),
      data,
    };
    try {
      await driver.set(keyFor(slot), record);
      bus?.emit(EVENTS.SAVE_COMPLETED, { slot, savedAt: record.savedAt });
      return record;
    } catch (err) {
      logger?.captureError(err, `save:${slot}`);
      bus?.emit(EVENTS.SAVE_FAILED, { slot, message: err.message });
      throw err;
    }
  }

  async function load(slot) {
    return (await driver.get(keyFor(slot))) ?? null;
  }

  /**
   * Autoguardado: rota el slot `auto` actual hacia `auto:backup` antes de escribir.
   * Así siempre existe un punto de restauración ante cierre inesperado.
   */
  async function autosave(data) {
    const current = await load(AUTO_SLOT);
    if (current) {
      try {
        await driver.set(keyFor(BACKUP_SLOT), current);
      } catch (err) {
        logger?.captureError(err, 'save:backup');
      }
    }
    return save(AUTO_SLOT, data);
  }

  /**
   * Recuperación (arranque): intenta `auto`; si falta o está corrupto, usa el backup.
   * Devuelve { slot, record, fromBackup } o null si no hay partida.
   */
  async function recover() {
    const primary = await load(AUTO_SLOT).catch(() => null);
    if (primary && isValid(primary)) {
      return { slot: AUTO_SLOT, record: primary, fromBackup: false };
    }
    const backup = await load(BACKUP_SLOT).catch(() => null);
    if (backup && isValid(backup)) {
      logger?.warn('save:recover usando backup', { slot: BACKUP_SLOT });
      bus?.emit(EVENTS.SAVE_RECOVERED, { slot: BACKUP_SLOT });
      return { slot: BACKUP_SLOT, record: backup, fromBackup: true };
    }
    return null;
  }

  function isValid(record) {
    return record != null && typeof record === 'object' && 'data' in record && 'schema' in record;
  }

  async function listSlots() {
    const keys = await driver.keys();
    return keys
      .filter((k) => typeof k === 'string' && k.startsWith('save:'))
      .map((k) => k.slice('save:'.length))
      .filter((slot) => slot !== BACKUP_SLOT);
  }

  async function remove(slot) {
    await driver.delete(keyFor(slot));
  }

  /** Prueba de salud: escribe/lee/borra un token. Útil en el boot de diagnóstico. */
  async function probe() {
    const key = keyFor('__probe__');
    try {
      await driver.set(key, { ok: true });
      const back = await driver.get(key);
      await driver.delete(key);
      return Boolean(back && back.ok === true);
    } catch {
      return false;
    }
  }

  return Object.freeze({ save, load, autosave, recover, listSlots, remove, probe });
}
