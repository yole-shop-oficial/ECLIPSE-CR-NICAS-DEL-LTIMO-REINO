# ARCHITECTURE — ECLIPSE: CRÓNICAS DEL ÚLTIMO REINO

Versión 0.1.0 · Complementa a `GDD.md`. Cualquier conflicto de diseño gana el GDD;
cualquier conflicto técnico gana este documento.

---

## 1. Capas del sistema

```
┌────────────────────────────────────────────────────────────┐
│ UI (pantallas DOM/HTML, HUD, menús)                        │
│   solo lee estado y emite intenciones; nunca muta estado   │
└──────────────▲─────────────────────────────┬───────────────┘
               │ eventos / snapshots         │ comandos
┌──────────────┴─────────────────────────────▼───────────────┐
│ Game Systems (combat, evolution, collection, quests,       │
│ narrative director, events, forge, multiplayer session)    │
└──────────────▲─────────────────────────────┬───────────────┘
               │                             │ usa
┌──────────────┴─────────────────────────────▼───────────────┐
│ Game Engine / Core (event bus, state, content registry,    │
│ save, config, rng, logger, error handler)                  │
└──────▲──────────────▲──────────────▲──────────────▲────────┘
       │              │              │              │
┌──────┴─────┐ ┌──────┴─────┐ ┌──────┴──────┐ ┌─────┴────────┐
│ Rendering  │ │ Storage    │ │ Networking  │ │ Sync         │
│ (canvas/   │ │ (IndexedDB │ │ (LAN: RTC   │ │ (cola online │
│ webgl,     │ │  drivers,  │ │  DataChannel│ │  opcional)   │
│ card layer │ │  save sys) │ │  + señaliza)│ │              │
│ renderer)  │ │            │ │             │ │              │
└────────────┘ └────────────┘ └─────────────┘ └──────────────┘
```

**Regla de dependencia:** las flechas solo apuntan hacia abajo. Un módulo de una capa puede
importar módulos de capas inferiores; **nunca al revés**. La comunicación ascendente y entre
ramas se hace exclusivamente a través del **Event Bus** y de snapshots del **State Manager**.
Prohibidas las dependencias circulares (verificado por convención de importación y por tests).

## 2. Mapa de módulos (`/src`)

| Carpeta | Responsabilidad | Capa |
|---|---|---|
| `src/core/` | Config, Event Bus, Logger, Error Handler, State Manager, Content Registry, RNG determinista | Engine |
| `src/storage/` | Drivers de persistencia (IndexedDB, memoria), Save System con auto+backup | Storage |
| `src/cards/` | Card Registry, Card Renderer por capas, frames, stats (FASE 2) | Rendering/Systems |
| `src/ranks/` | Interpretación de RankDefinitions: frame+vfx+audio+partículas (FASE 3) | Systems |
| `src/characters/` | Protagonistas, árboles evolutivos, memorias (FASE 4) | Systems |
| `src/evolution/` | Fragmentos, condiciones, Echo System, cinemática (FASE 5) | Systems |
| `src/weapons/` | WeaponGenerator, piezas, runas, nombres procedurales (FASE 6) | Systems |
| `src/combat/` | Turn Engine, Action Stack, daño, estados, IA, victoria (FASE 7) | Systems |
| `src/story/` | Dialogue Engine, Scene Engine, flags, Narrative Director (FASE 8) | Systems |
| `src/world/` | Mapa, regiones, ciudades, mazmorras, eventos (FASE 9) | Systems |
| `src/render/` | Renderer 2D, cámara, capas, partículas, shaders (FASE 10) | Rendering |
| `src/offline/` | Estrategias de arranque y recuperación offline (FASE 11) | Storage |
| `src/network/` | LAN host/cliente, lobby, rooms, reconexión (FASE 12) | Networking |
| `src/sync/` | Sync Queue y validación remota opcional | Sync |
| `src/audio/` | Music/SFX managers por capas (FASE 14) | Rendering |
| `src/ui/` | Pantallas y componentes de interfaz (FASE 15) | UI |
| `src/security/` | Validación de acciones, cifrado local AES-GCM | Engine |

Datos (no código): `/data` contiene definiciones (`ranks.js`, futuras `cards.js`,
`weapons-parts.js`, `characters.js`, `events.js`…) que se registran en el Content Registry.
Assets: `/assets` (frames, arte, iconos, audio, fuentes). Herramientas: `/tools` (dev server,
generadores). Tests: `/tests` espejo de `/src` + `/data`.

## 3. Responsabilidades por módulo (FASE 1, implementado)

- **`core/config.js`** — constantes de tuning, versión, presets de calidad LOW/MEDIUM/
  HIGH/ULTRA y detección heurística del tier del dispositivo. Sin estado.
- **`core/event-bus.js`** — pub/sub. Eventos namespaciados (`core:ready`, `save:completed`,
  `combat:turn-end`). Errores de handlers aislados hacia el Logger, nunca rompen el bus.
- **`core/logger.js`** — niveles debug/info/warn/error, ring buffer consultable, sinks
  suscribibles (la consola de diagnóstico de la UI es un sink).
- **`core/error-handler.js`** — captura global (`error`, `unhandledrejection`), reporta al
  Logger, emite `error:captured`, mantiene contadores y último error.
- **`core/state-manager.js`** — store por rutas (`profile.name`), get/set/update con clones
  (inmutabilidad de facto), suscripciones, `snapshot()` para guardado e `hydrate()` para carga.
- **`core/content-registry.js`** — registro data-driven con tipos canónicos
  (`rank, frame, card, character, weapon, item, enemy, boss, region, city, dungeon, quest,
  dialogue, event, faction, effect, vfx, animation, audio, expansion`), validación de `id`,
  duplicados prohibidos, `registerPack()` para expansiones.
- **`core/rng.js`** — RNG determinista (xmur3 + mulberry32): misma seed → mismo contenido.
- **`storage/idb.js`** — driver IndexedDB promisificado (una object store key-value).
- **`storage/memory-driver.js`** — driver volátil para tests y fallback.
- **`storage/save-system.js`** — slots (`auto`, manuales), autoguardado con backup previo,
  `recover()` (auto → backup), `probe()` de salud del almacenamiento, eventos al bus.
- **`sw.js` / `manifest.webmanifest`** — shell PWA mínima; la estrategia completa de cache
  se endurece en FASE 11.

## 4. Contratos y flujos clave

**Render de carta (FASE 2):** `UI pide CardDefinition → CardRenderer compone capas
(fondo→arte→efectos→marco→UI data) → RenderEngine pinta`. El renderer recibe la definición
del Registry; jamás hace fetch de lógica.

**Guardado:** `State.snapshot() → SaveSystem.autoSave() → driver IndexedDB → eventos
save:completed/save:failed`. En arranque: `recover()` decide entre auto, backup o partida nueva.

**Acción multijugador (FASE 12):** `Cliente envía intención → Host valida → Host ejecuta en
el CombatEngine determinista (misma seed + mismas acciones = mismo resultado) → Host difunde
snapshot/delta → Clientes aplican`. El cliente nunca es autoridad de reglas.

**Expansión:** `pack { id, items: { card:[], weapon:[], region:[], … } } →
registry.registerPack(pack)`. El motor no se modifica. El contenido del juego base es, a
efectos del motor, la "expansión cero".

## 5. Decisiones tecnológicas

| Área | Decisión | Justificación |
|---|---|---|
| Lenguaje | JavaScript ES Modules nativos, sin transpilación | Mega Prompt §53: sin frameworks pesados; PWA directa |
| Dependencias | Cero dependencias runtime; Node solo para tooling/tests | Offline-first real; instalable sin red |
| Rendering | Canvas 2D primero, con interfaz `RenderBackend` que permite backend WebGL2 (FASE 10) | Gama baja Android: Canvas2D es ubicuo; WebGL2 llega después sin reescribir sistemas |
| OffscreenCanvas/Workers | FASE 10, tras validar el slice en hilo principal | Complejidad solo donde aporta |
| Persistencia | IndexedDB vía driver inyectable | Tests sin navegador; fallback memoria |
| LAN | WebRTC DataChannel; señalización por QR/código (SDP compacto) y descubrimiento por URL local | Funciona sin Internet (sin STUN público); relay opcional |
| Sync remota | Cola local + reintentos; nunca bloquea | Offline First |
| Cifrado | Web Crypto AES-GCM para datos sensibles locales | Mega Prompt §37 |
| Tests | `node --test` (runner nativo de Node 22), zero-deps | QA desde FASE 1 |
| Android | PWA + empaquetado TWA/Bubblewrap en FASE 13 | Instalable sin rehacer la app |

## 6. Reglas de código

1. **Ningún archivo de código supera 200 líneas.** Si crece, se divide.
2. Sin lógica de contenido en el motor: `if (cardId === "…")` está prohibido; los motores
   interpretan definiciones del Content Registry.
3. Generación masiva solo vía generadores con seed determinista
   (WeaponGenerator, CardGenerator, EnemyGenerator, LootGenerator, EventGenerator,
   NameGenerator, LoreGenerator).
4. Todo error previsto se registra en el Logger; nada falla en silencio.
5. Cada fase actualiza GDD, ARCHITECTURE, ROADMAP y CHANGELOG.
6. "Terminado" = funciona + integrado + probado + documentado + optimizado + no rompe lo
   anterior + manejo de errores + offline donde corresponda + respeta arquitectura y límites.

## 7. Estructura del repositorio

```
/ (raíz)
├── index.html, manifest.webmanifest, sw.js     # shell PWA
├── GDD.md ARCHITECTURE.md VISUAL_GDD.md ROADMAP.md CHANGELOG.md  # docs de verdad
├── docs/            # auditorías y anexos
├── data/            # definiciones data-driven (ranks.js, …)
├── src/             # código por capas (ver §2)
├── assets/          # frames/, art/, icons/, audio/, fonts/, css/
├── tests/           # node:test, espejo de src/ y data/
└── tools/           # dev-server.js, generadores y scripts
```
