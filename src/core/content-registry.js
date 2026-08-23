/**
 * core/content-registry.js — Registro data-driven de TODO el contenido del juego.
 * El motor interpreta definiciones; jamás `if (cardId === '…')` (Mega Prompt §45).
 * Las expansiones entran vía registerPack() sin tocar el motor (GDD §24).
 */

export const CONTENT_KINDS = Object.freeze([
  'rank', 'frame', 'card', 'character', 'weapon', 'item',
  'enemy', 'boss', 'region', 'city', 'dungeon', 'quest',
  'dialogue', 'event', 'faction', 'effect', 'vfx', 'animation', 'audio',
]);

export function createContentRegistry(options = {}) {
  const strictKinds = options.strictKinds ?? true;
  const tables = new Map(); // kind -> Map(id -> definition)

  function assertKind(kind) {
    if (typeof kind !== 'string' || kind.length === 0) {
      throw new TypeError('registry: el tipo debe ser un string');
    }
    if (strictKinds && !CONTENT_KINDS.includes(kind)) {
      throw new Error(`registry: tipo desconocido "${kind}"`);
    }
  }

  function table(kind) {
    assertKind(kind);
    if (!tables.has(kind)) tables.set(kind, new Map());
    return tables.get(kind);
  }

  function validate(definition, kind) {
    if (definition == null || typeof definition !== 'object') {
      throw new TypeError(`registry[${kind}]: definición inválida`);
    }
    if (typeof definition.id !== 'string' || definition.id.length === 0) {
      throw new Error(`registry[${kind}]: la definición requiere un id string`);
    }
  }

  function register(kind, definition) {
    validate(definition, kind);
    const map = table(kind);
    if (map.has(definition.id)) {
      throw new Error(`registry[${kind}]: id duplicado "${definition.id}"`);
    }
    const frozen = Object.freeze({ ...definition });
    map.set(frozen.id, frozen);
    return frozen;
  }

  /**
   * Registra un pack (expansión o contenido base):
   * { id: 'pack_core', items: { card: [...], weapon: [...] } }
   * Lanza en el primer error; devuelve contador de registros por tipo.
   */
  function registerPack(pack) {
    if (pack == null || typeof pack.id !== 'string' || pack.id.length === 0) {
      throw new Error('registry.registerPack: el pack requiere un id');
    }
    const counts = {};
    for (const [kind, definitions] of Object.entries(pack.items ?? {})) {
      counts[kind] = 0;
      for (const definition of definitions) {
        register(kind, definition);
        counts[kind] += 1;
      }
    }
    return counts;
  }

  function get(kind, id) {
    return tables.get(kind)?.get(id);
  }

  function has(kind, id) {
    return tables.get(kind)?.has(id) ?? false;
  }

  function all(kind) {
    return [...(tables.get(kind)?.values() ?? [])];
  }

  function kinds() {
    return [...tables.keys()];
  }

  function stats() {
    const out = {};
    for (const [kind, map] of tables) out[kind] = map.size;
    return out;
  }

  return Object.freeze({ register, registerPack, get, has, all, kinds, stats });
}
