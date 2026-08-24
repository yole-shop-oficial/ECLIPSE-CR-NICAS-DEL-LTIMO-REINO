# ECLIPSE — Arquitectura Técnica

**Estado:** v1.0 · Documento vivo. Deriva del Mega Prompt (§43–53) y del GDD.
**Stack:** JavaScript ES Modules nativos (sin frameworks pesados), Canvas 2D con ruta
de migración a WebGL2, WebAudio, IndexedDB, Service Worker, WebRTC DataChannel (LAN).

---

## 1. Principios arquitectónicos

| Principio | Regla práctica |
|-----------|----------------|
| OFFLINE FIRST | La app arranca, se juega y guarda sin red. La red es un extra. |
| LOCAL FIRST | IndexedDB es la fuente de verdad del progreso; la nube es replica. |
| DATA DRIVEN | Contenido = JSON en `/content` interpretado por motores. El núcleo no cambia al añadir contenido. |
| MODULAR | Un archivo = una responsabilidad. **Máximo 200 líneas por archivo.** |
| DETERMINISTA | RNG con semilla (hash + mulberry32). Mismo seed ⇒ mismo contenido/acción. |
| SIN CICLOS | Dependencias unidireccionales por capas (§3). Prohibido importar «hacia arriba». |
| SIN GLOBALES | Estado en motores inyectados por el Kernel; no en `window`. |
| EXTENSIBLE | Content Packs = datos + assets que se registran sin tocar el núcleo. |

## 2. Estructura de carpetas

```
/
├── index.html · manifest.webmanifest · sw.js
├── styles/                  CSS (tokens + componentes del Códice)
├── src/
│   ├── core/        Kernel, Loop, EventBus, RNG, Platform, Diagnóstico
│   ├── data/        ContentRegistry, validadores de esquemas, localización
│   ├── game/        rank/ evolution/ cards/ weapons/ items/ combat/
│   │                story/ world/ events/ factions/ collection/ narrative/ ai/
│   ├── render/      RenderEngine, Camera, Layers, Particles, Animation, Lighting, PostFX
│   ├── ui/          UIEngine (DOM), screens/, components/, hud/
│   ├── storage/     db (IndexedDB), SaveEngine, migraciones
│   ├── offline/     OfflineEngine, registro SW, caché de assets
│   ├── net/         lan/ (signaling, transport, session) sync/ (cola, adaptador remoto)
│   ├── security/    keystore, AES-GCM, validación anti-manipulación
│   ├── audio/       AudioEngine, mixer, capas
│   └── assets/      manifiesto de assets, cargadores, atlas, tiers de resolución
├── content/         DATOS del juego (JSON): ranks, protagonists, factions,
│                    weapons, story, world, events...  (los Content Packs viven aquí)
├── assets/          imágenes, audio, fuentes (binarios)
├── tests/           node --test (lógica pura, sin DOM)
└── tools/           dev-server, futuros pipelines de contenido
```

## 3. Capas y flujo de dependencias (sin ciclos)

```
ui ──▶ game ──▶ data ──▶ core        (presentación depende de dominio)
render ─▶ game                        net ──▶ game (acciones validadas por el dominio)
storage ◀── game                      game nunca importa ui/render/storage/net:
audio ◀── game                        infraestructura se INYECTA vía Kernel (puertos/adaptadores)
```

- **core/** no importa nada del proyecto; puro y testeable en Node.
- **game/**solo conoce `core` y `data`; la persistencia, red y audio llegan como puertos.
- Esto permite probar todo el dominio en Node (`npm test`) sin navegador.

## 4. Motores (contratos principales)

| Motor | Responsabilidad | Contrato clave |
|-------|------------------|----------------|
| Kernel | Ciclo de vida de módulos, inyección | `kernel.register(name, factory)`, `kernel.get(name)` |
| GameLoop | Fixed timestep + render decoupled | `update(dt)`, `render(alpha)` |
| EventBus | Pub/sub tipado por nombre | `on/off/emit` |
| ContentRegistry | Carga/validación de packs JSON | `loadPack(url)`, `get(type,id)` |
| RankService | Escalera de 17 rangos | `index(rank)`, `compare(a,b)`, `family(rank)` |
| EvolutionEngine | Regla +3 y excepción protagonista | `canEvolve(card, target)`, `requirements(card)` |
| CardEngine / CardComposer | Instancias de carta + render por capas | `compose(cardDef, rank) → canvas` |
| WeaponGenerator | Armas por componentes con seed | `generate({seed, constraints}) → WeaponDef` |
| CombatEngine | Turnos, energía, Action Stack | `declare(action) → stack → resolve()` |
| StoryEngine / SceneEngine | Escenas, diá logros, flags | `play(sceneId)`, `choose(optionId)` |
| NarrativeDirector | Qué evento/diálogo/jefe procede | `next(context) → beat` |
| WorldEngine | Mapa, regiones, cicatrices | `travel(nodeId)`, `applyScar(scar)` |
| EventEngine | Generador de eventos combinables | `roll(seed, context) → event` |
| CollectionEngine | Las 8 colecciones | `track(kind, id)` |
| SaveEngine | Autosave, versionado, recuperación | `save(slot)`, `load()`, schemaVersion |
| OfflineEngine | SW, caché, arranque sin red | `precache(shell)`, estado online/offline |
| LANEngine | Salas Wi-Fi, host autoritativo | `host()`, `join(code)`, mensajes tipados |
| SyncEngine | Cola local→remota con reintentos | `enqueue(op)`, `flush()` |
| AudioEngine | Capas Music/Ambience/Combat/UI/... | `play(layer, cueId)`, ducking |
| Security | AES-GCM, validación de acciones | `seal/open(data)`, `validateAction(a)` |

Los motores se implementan por hitos (ver ROADMAP). Las interfaces anteriores son
contratos: si un motor aún no existe, se documenta su contrato antes de codificarlo.
**No se presenta código falso como funcional.**

## 5. Renderizado 2D por capas (canónico)

Una carta = composición en canvas con orden estricto:
`fondo → artwork → efectos internos → MARCO (interior transparente) →
 decoraciones superiores → información (nombre, stats, gema de rango)`.

- **Tamaño lógico común de carta/marco:** 360×504 (ratio 5:7). Escalable por DPR.
- Los marcos se pintan **proceduralmente por rango** (FramePainter) hoy; la interfaz
  admite marcos-a-imagen (atlas) mañana sin cambiar el compositor.
- El artwork vive sin marco (PNG/WebP o arte procedural). Nunca se funde con el marco.
- Presupuestos: ≤60 fps en gama media Android; DPR cap 2; object pooling; atlas.
- Ruta WebGL2 (hitos posteriores): compositor actual queda como backend `canvas2d`;
  `RenderEngine` selecciona backend por capacidad (`Platform`).

Detalle: [docs/arch/rendering.md](docs/arch/rendering.md).

## 6. Datos y Content Packs

- Todo contenido es JSON validado en carga (esquemas en
  [docs/arch/data-schemas.md](docs/arch/data-schemas.md)).
- Un **Content Pack** = manifiesto + JSONs + assets. Instalar una expansión = añadir
  un pack al `ContentRegistry`. El núcleo no se modifica.
- IDs estables con prefijos: `rank/`, `protag/`, `card/`, `wpn/`, `fact/`, `scn/`…
- Generación procedural con semilla: el **seed se guarda, no el resultado** (armas,
  eventos). Reconstrucción exacta garantizada.

## 7. Persistencia (IndexedDB, schema v1)

Stores: `profile, cards, inventory, weapons, characters, quests, storyFlags,
worldState, deck, settings, syncQueue, meta`.
Autosave tras cada mutación de dominio; recuperación de cierre inesperado vía
transacción de intención en `meta`. Migraciones por versión.
Detalle: [docs/arch/storage-security.md](docs/arch/storage-security.md).

## 8. PWA y Android

- `manifest.webmanifest` + Service Worker con caché versionado del app-shell.
- Estrategia: cache-first estáticos; navegación con fallback a `index.html`.
- Android: instalación PWA hoy; empaquetado (TWA/Capacitor) documentado como fase.
- Consideraciones: suspensión/reanudación (pausa de loop + autosave), orientación,
  pantallas 320→desktop, vibración opcional, audio desbloqueado por gesto.
Detalle: [docs/arch/android-pwa.md](docs/arch/android-pwa.md).

## 9. LAN y sincronización

- **LAN sin Internet:** host autoritativo con WebRTC DataChannel; señalización manual
  mediante código/QR (offer/answer comprimidos). Host genera, valida y difunde estado;
  los clientes envían *intenciones*, nunca estado.
- Combate determinista (seed compartida): el host verifica checksums por tick.
- **Sync online opcional:** cola `syncQueue` → validación → remoto → confirmación →
  marca. Reintentos con backoff; nunca bloquea el juego offline.
Detalle y protocolo de mensajes: [docs/arch/lan-sync.md](docs/arch/lan-sync.md).

## 10. Seguridad

- AES-GCM (Web Crypto) para datos sensibles en reposo (p. ej. tokens de sync) con
  clave no exportable en IndexedDB. Sin secretos en el código.
- Validación de todas las acciones importantes en el dominio (host en LAN), jamás solo en UI.

## 11. Pruebas y calidad

- Lógica pura en Node: `npm test` (`node --test tests/`): rangos, evolución,
  generador de armas, validación de contenido.
- `tools/dev-server.mjs`: servidor estático sin dependencias para desarrollo/preview.
- Reglas de hygiene: archivo ≤200 líneas, sin duplicación, sin ciclos, un propósito.

## 12. Decisiones de arquitectura (ADR)

| ADR | Decisión | Motivo |
|-----|----------|--------|
| 001 | ES Modules nativos, sin framework | Mega §53; tamaño, offline, longevidad |
| 002 | Canvas 2D procedural primero, WebGL2 después | Marcos/arte por datos desde el día 1 |
| 003 | UI en DOM + escenas en Canvas | Accesibilidad, responsive, rendimiento |
| 004 | Determinismo por seed persistido | Armas/eventos infinitos sin almacenarlos |
| 005 | Host autoritativo LAN + intenciones | Anti-trampas sin servidor |
| 006 | Documentos subdivididos ≤200 líneas | Misma disciplina que el código |
