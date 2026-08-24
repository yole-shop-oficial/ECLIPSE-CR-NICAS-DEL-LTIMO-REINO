// main — Arranque del Códice. Cablea kernel, datos, motores y pantallas (M1).

import { Kernel } from './core/kernel.js';
import { EventBus } from './core/events.js';
import { detectPlatform } from './core/platform.js';
import { ContentRegistry } from './data/registry.js';
import { RankService } from './game/rank/service.js';
import { EvolutionRules } from './game/evolution/rules.js';
import { FramePainter } from './game/cards/framePainter.js';
import { SigilPainter } from './game/cards/sigilPainter.js';
import { TextPainter } from './game/cards/textPainter.js';
import { CardComposer } from './game/cards/composer.js';
import { WeaponGenerator } from './game/weapons/generator.js';
import { CodexDB } from './storage/db.js';
import { SaveEngine } from './storage/saveEngine.js';
import { SecurityVault } from './security/crypto.js';
import { OfflineEngine } from './offline/offlineEngine.js';
import { UIEngine } from './ui/engine.js';
import { splashScreen } from './ui/screens/splash.js';
import { prologueScreen } from './ui/screens/prologue.js';
import { chooseScreen } from './ui/screens/choose.js';
import { sanctumScreen } from './ui/screens/sanctum.js';

// Códice volátil: misma API que CodexDB, en memoria (degradación elegante).
function createMemoryDB() {
  const stores = new Map();
  const of = (name) => stores.get(name) ?? stores.set(name, new Map()).get(name);
  return {
    get: (s, id) => Promise.resolve(of(s).get(id)),
    getAll: (s) => Promise.resolve([...of(s).values()]),
    put: (s, v) => { of(s).set(v.id, v); return Promise.resolve(v); },
    delete: (s, id) => { of(s).delete(id); return Promise.resolve(); },
    clear: (s) => { of(s).clear(); return Promise.resolve(); },
    atomic: async (writes) => { for (const w of writes) of(w.store).set(w.value.id, w.value); },
  };
}

async function boot() {
  const kernel = new Kernel();
  const events = new EventBus();
  const platform = detectPlatform();

  kernel.register('events', () => events);
  kernel.register('platform', () => platform);
  kernel.register('registry', async () => new ContentRegistry().loadAll());
  kernel.register('ranks', k => new RankService(k.get('registry').raw('rank').ranks));
  kernel.register('evolution', k => new EvolutionRules(k.get('ranks')));
  kernel.register('composer', k => new CardComposer({
    framePainter: new FramePainter(),
    sigilPainter: new SigilPainter(),
    textPainter: new TextPainter(),
    dpr: k.get('platform').dpr,
  }));
  kernel.register('weapons', k => new WeaponGenerator(
    k.get('registry').components(), k.get('ranks')));
  kernel.register('db', () => new CodexDB().open());
  kernel.register('save', k => { const s = new SaveEngine(k.get('db')); return s; });
  kernel.register('vault', k => new SecurityVault(k.get('db')));
  kernel.register('offline', () => new OfflineEngine(events));
  kernel.register('ui', () => new UIEngine(document.getElementById('app')));

  // Instanciación manual ordenada: ready() espera factorías async y re-hidrata
  // el caché del kernel para que las dependencias reciban instancias, no promesas.
  const registry = await kernel.ready('registry');     // ContentRegistry.loadAll()
  try {
    await kernel.ready('db');                          // CodexDB.open()
  } catch (err) {
    // IndexedDB bloqueado (modo privado / iframe restringido): Códice volátil.
    console.warn('[eclipse] IndexedDB no disponible; progreso solo en memoria:', err.message);
    kernel.set('db', createMemoryDB());
  }
  const save = await kernel.ready('save'); await save.init();
  await kernel.ready('vault').then(v => v.init()).catch(() => {}); // cifrado opcional
  if (platform.isBrowser) await kernel.get('offline').init('sw.js');

  const ui = kernel.get('ui');
  ui.register('splash', (p) => splashScreen(p));
  ui.register('prologue', (p) => prologueScreen(p));
  ui.register('choose', (p) => chooseScreen(p));
  ui.register('sanctum', (p) => sanctumScreen(p));
  const ranks = kernel.get('ranks');
  const composer = kernel.get('composer');
  const weapons = kernel.get('weapons');
  const rankG = ranks.get('G');
  const factionName = (id) => { try { return registry.get('faction', id).name; } catch { return id; } };

  const toSanctum = (profile) => ui.show('sanctum', {
    profile, registry, composer, rankG, weaponGen: weapons, factionName,
    onReset: async () => { await save.reset(); location.reload(); },
  });
  const toChoose = () => ui.show('choose', {
    registry, composer, rankG,
    onChosen: async (def) => {
      const profile = await save.createProfile({ protagonist: def });
      toSanctum(profile);
    },
  });
  const toPrologue = () => {
    const scene = registry.raw('story').scenes.find(s => s.id === 'scn/prologue');
    ui.show('prologue', { scene, onDone: toChoose });
  };

  const profile = await save.hasProfile() ? await save.loadProfile() : null;
  if (profile) return toSanctum(profile);    // continuar crónica offline

  ui.show('splash', { onDone: toPrologue });
}

boot().catch(err => {
  console.error('[eclipse] fallo de arranque:', err);
  const app = document.getElementById('app');
  if (app) app.innerHTML = `<div class="bootveil"><p>El Códice no pudo abrirse.</p>
    <p class="bootveil__sub">${String(err.message || err)}</p></div>`;
});
