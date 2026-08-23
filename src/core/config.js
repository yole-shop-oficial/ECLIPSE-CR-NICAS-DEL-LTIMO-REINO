/**
 * core/config.js — Configuración central de ECLIPSE.
 * Sin estado: constantes de tuning, presets de calidad y detección de dispositivo.
 * Regla: ningún otro módulo define constantes de tuning.
 */

export const GAME_ID = 'eclipse-cronicas-del-ultimo-reino';
export const GAME_VERSION = '0.1.0';
export const SAVE_SCHEMA_VERSION = 1;

export const QUALITY_TIERS = Object.freeze(['LOW', 'MEDIUM', 'HIGH', 'ULTRA']);

/** Presets de calidad (GDD §23). Los presupuestos de partículas siguen VISUAL_GDD §5. */
export const QUALITY_PRESETS = Object.freeze({
  LOW: { particles: 40, glow: false, dynamicLight: false, postfx: false, cardSize: 256, fpsTarget: 30 },
  MEDIUM: { particles: 120, glow: 'static', dynamicLight: false, postfx: false, cardSize: 384, fpsTarget: 60 },
  HIGH: { particles: 300, glow: true, dynamicLight: true, postfx: false, cardSize: 512, fpsTarget: 60 },
  ULTRA: { particles: 600, glow: true, dynamicLight: true, postfx: true, cardSize: 768, fpsTarget: 60 },
});

/**
 * Heurística de tier para Android gama baja/media (GDD §23).
 * deviceMemory: GB (Chrome). hardwareConcurrency: núcleos lógicos.
 */
export function detectQualityTier(env = {}) {
  const memory = typeof env.deviceMemory === 'number' ? env.deviceMemory : 4;
  const cores = typeof env.hardwareConcurrency === 'number' ? env.hardwareConcurrency : 4;
  const score = memory * 2 + cores; // 12 ≈ gama media típica
  if (memory <= 2 || score <= 6) return 'LOW';
  if (memory <= 4 || score <= 12) return 'MEDIUM';
  if (memory <= 6) return 'HIGH';
  return 'ULTRA';
}

/** Nombre de eventos canónicos del bus (convención `dominio:acción`). */
export const EVENTS = Object.freeze({
  CORE_READY: 'core:ready',
  ERROR_CAPTURED: 'error:captured',
  SAVE_COMPLETED: 'save:completed',
  SAVE_FAILED: 'save:failed',
  SAVE_RECOVERED: 'save:recovered',
  STATE_CHANGED: 'state:changed',
});

/** Nombres de las colecciones de guardado (GDD §19 / Mega Prompt §36). */
export const SAVE_COLLECTIONS = Object.freeze([
  'profile', 'cards', 'inventory', 'weapons', 'characters', 'quests',
  'storyFlags', 'worldState', 'deck', 'settings', 'syncQueue',
]);

/**
 * Crea la configuración de runtime. `overrides` permite tests y ajustes de plataforma.
 */
export function createConfig(overrides = {}) {
  const env = overrides.env ?? (typeof navigator !== 'undefined' ? navigator : {});
  const qualityTier = overrides.qualityTier ?? detectQualityTier(env);
  const preset = QUALITY_PRESETS[qualityTier] ?? QUALITY_PRESETS.MEDIUM;

  return Object.freeze({
    gameId: GAME_ID,
    version: GAME_VERSION,
    saveSchemaVersion: SAVE_SCHEMA_VERSION,
    qualityTier,
    quality: Object.freeze({ ...preset }),
    breakpoints: Object.freeze([320, 360, 375, 390, 412, 430, 768, 1024]),
    language: overrides.language ?? 'es',
    debug: overrides.debug ?? false,
  });
}
