# ROADMAP — ECLIPSE: CRÓNICAS DEL ÚLTIMO REINO

Versión 0.1.0 · Plan por fases. Cada fase sigue el protocolo de 10 pasos
(analizar → diseñar → estructurar → implementar → probar → optimizar → integrar →
documentar → verificar no-regresión → continuar). Una fase solo está terminada cuando
cumple la Definición de Terminado (`ARCHITECTURE.md` §6.6).

---

## FASE 0 — AUDITORÍA · ✅ COMPLETADA

- [x] Analizar repositorio (solo existe `Mega promts`; no hay código, assets ni config).
- [x] Leer el MEGA PROMPT completo (1 778 líneas) como especificación principal.
- [x] Diagnóstico: nada que refactorizar; todo por construir sobre el GDD.
- [x] Entregables: `GDD.md`, `ARCHITECTURE.md`, `VISUAL_GDD.md`, `ROADMAP.md`,
      `CHANGELOG.md`, `docs/AUDIT.md`.

## FASE 1 — FUNDACIÓN · ✅ COMPLETADA (núcleo)

- [x] Configuración central (`src/core/config.js`).
- [x] Event Bus (`src/core/event-bus.js`).
- [x] State Manager (`src/core/state-manager.js`).
- [x] Content Registry (`src/core/content-registry.js`).
- [x] RNG determinista (`src/core/rng.js`).
- [x] Logger + Error Handler (`src/core/logger.js`, `error-handler.js`).
- [x] Storage: driver IndexedDB + memoria (`src/storage/`), Save System con auto+backup.
- [x] `data/ranks.js`: las 17 RankDefinitions data-driven.
- [x] PWA base: `index.html`, `manifest.webmanifest`, `sw.js`, `main.js` boot.
- [x] Tests núcleo (`tests/core/`, `tests/storage/`).

## FASE 2 — MOTOR DE CARTAS

- [ ] CardDefinition schema final + validación.
- [ ] Card Registry (sobre Content Registry).
- [ ] Card Renderer por capas (fondo→arte→efectos→marco→UI data).
- [ ] Artwork loader (WebP/PNG, transparencia), frames por rango.
- [ ] Stats, abilities, effects como datos interpretados.
- [ ] Cache de composición volátil (nunca aplanado permanente).

## FASE 3 — SISTEMA DE RANGOS

- [ ] Interpretación de las 17 RankDefinitions.
- [ ] Frame resolver → `/assets/cards/frames/<RANGO>/`.
- [ ] VFX, audio, partículas y animación por rango.
- [ ] Escalado de presencia visual G→XG.

## FASE 4 — PROTAGONISTAS

- [ ] CharacterDefinition schema (identidad, historia, memorias, armas).
- [ ] Los 12 protagonistas con carta inicial G.
- [ ] Árbol evolutivo por protagonista.
- [ ] Selección inicial (1 de 12) + estado persistente.

## FASE 5 — EVOLUCIÓN

- [ ] Fragmentos, experiencia, materiales, condiciones.
- [ ] Protagonistas G→XG; cartas normales Base→+3.
- [ ] Echo System (memorias de formas anteriores).
- [ ] Evoluciones narrativas (condiciones de historia).
- [ ] Secuencia cinematográfica de evolución (VISUAL_GDD §6.1).

## FASE 6 — SISTEMA DE ARMAS

- [ ] WeaponGenerator (seed determinista → mismo arma).
- [ ] Partes: blade/hilt/guard/gem/rune/glow; materiales; runas; modificadores.
- [ ] Nombres procedurales + lore generado.
- [ ] Weapon Rendering modular (miles de armas sin duplicar código).

## FASE 7 — COMBATE

- [ ] Turn Engine + Action Stack (contrarrestar, interrumpir, encadenar).
- [ ] Damage/Status/Victory systems como módulos separados.
- [ ] AI básica determinista.
- [ ] Resolución determinista (base del multijugador).

## FASE 8 — NARRATIVA

- [ ] Dialogue Engine (opciones, variables, reputación).
- [ ] Scene Engine (parallax, cámara, retratos, texto progresivo).
- [ ] Narrative Flags + World Scars persistentes.
- [ ] Memory Fragments + Narrative Director.

## FASE 9 — MUNDO

- [ ] Mapa: continentes → regiones → ciudades → mazmorras.
- [ ] Regions/Cities/Dungeons/Bosses como definiciones.
- [ ] Event Generator combinatorio + facciones.

## FASE 10 — RENDERING 2D

- [ ] RenderBackend abstracto: Canvas2D actual → WebGL2.
- [ ] Texture atlases, sprite batching, object pooling.
- [ ] Particle Engine + shaders de glow/distorsión.
- [ ] Parallax, post-processing, cámara virtual.
- [ ] OffscreenCanvas + Web Workers donde aporte.
- [ ] Tiers LOW/MEDIUM/HIGH/ULTRA aplicados.

## FASE 11 — PWA OFFLINE FIRST

- [ ] Cache strategy completa (shell + assets + datos).
- [ ] Offline boot verificado en frío; recovery ante corrupción.
- [ ] Sync Queue (IndexedDB) lista para backend remoto.

## FASE 12 — MULTIJUGADOR WI-FI

- [ ] LAN discovery + Host/Client (WebRTC DataChannel, señalización por QR/código).
- [ ] Lobby + Room + códigos de unión; sincronización determinista.
- [ ] Validación de estado en host; reconexión y manejo de desconexión.
- [ ] Funciona sin Internet.

## FASE 13 — ANDROID

- [ ] Empaquetado TWA/Bubblewrap; instalación y arranque rápido.
- [ ] Adaptación de pantallas, orientación, suspensión/reanudación, conexión.

## FASE 14 — AUDIO

- [ ] Music Manager + SFX; capas Combat/UI/Evolution/Boss/Ambient.
- [ ] Audio por rango y secuencias de evolución.

## FASE 15 — UI/UX

- [ ] Main Menu, Profile, Collection, Deck Builder, Inventory, Weapon Forge, Story,
      Map, Combat, Settings, Multiplayer, Evolution, Codex.
- [ ] Lenguaje visual Dark Fantasy Premium consistente.

## FASE 16 — QA

- [ ] Suites: engine, cartas, evolución, combate, guardado, offline, sync, LAN,
      rendering, UI. Cobertura de no-regresión por fase.

---

## MILESTONE V — VERTICAL SLICE (atraviesa fases 1–12)

Antes de producir contenido masivo, el slice debe funcionar completo:

- [ ] 1 protagonista (Heredero de las Cenizas) · [ ] Evolución G→F→C→D
- [ ] 3–5 cartas normales · [ ] 2 armas generadas · [ ] 1 enemigo · [ ] 1 jefe
- [ ] 1 combate completo · [ ] 1 escena narrativa · [ ] 1 evento · [ ] 1 región pequeña
- [ ] Guardado/carga offline · [ ] Sala LAN + 1 partida multijugador
- [ ] Marco de carta + varios rangos visuales · [ ] Evolución animada

## SISTEMA DE EXPANSIONES (transversal)

El motor jamás se modifica por expansión: cada expansión es un paquete de datos
(cards, characters, weapons, enemies, bosses, regions, quests, dialogue, events, frames,
vfx, audio) registrado vía Content Registry. El juego base es la "expansión cero".
