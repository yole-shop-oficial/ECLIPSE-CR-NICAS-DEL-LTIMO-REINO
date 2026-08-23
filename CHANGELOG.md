# CHANGELOG — ECLIPSE: CRÓNICAS DEL ÚLTIMO REINO

Formato: Added / Changed / Fixed / Decisions / Pending. Versionado semántico temprano.

---

## [0.1.0] — 2026-08-23 · FASE 0 + FASE 1 (Fundación)

### Added
- Documentación fundacional: `GDD.md`, `ARCHITECTURE.md`, `VISUAL_GDD.md`,
  `ROADMAP.md`, `CHANGELOG.md`, `docs/AUDIT.md`.
- Núcleo (FASE 1): `config`, `event-bus`, `logger`, `error-handler`, `state-manager`,
  `content-registry`, `rng` determinista (xmur3+mulberry32).
- Storage: driver IndexedDB, driver memoria, `save-system` con slots, autoguardado,
  backup y recuperación (`recover`), prueba de salud (`probe`).
- `data/ranks.js`: las 17 RankDefinitions data-driven con paleta, material, partículas y
  audio; helpers `rankIndex`/`canEvolveTo` (normales +3, protagonistas G→XG).
- PWA base: `index.html`, `manifest.webmanifest`, `sw.js` (cache shell), `src/main.js`
  boot con pantalla de diagnóstico (`src/ui/boot-screen.js`), icono SVG original.
- Herramientas: `tools/dev-server.js` (servidor estático sin dependencias).
- Tests (Node nativo): `tests/core/*`, `tests/storage/*`, `tests/data/*`.

### Decisions
- **Stack:** JavaScript ES Modules nativos + cero dependencias runtime (Mega Prompt §53).
  Node solo para tests/dev-server.
- **Rendering:** Canvas2D primero con interfaz `RenderBackend` para migrar a WebGL2 en
  FASE 10 sin reescribir sistemas.
- **Persistencia:** driver inyectable → IndexedDB en navegador, memoria en tests.
- **Multijugador:** WebRTC DataChannel con señalización por QR/código (funciona sin
  Internet); relay público solo como opcional.
- **Límite 200 líneas:** aplica a código (`src/`, `data/`, `tests/`, `tools/`, `sw.js`);
  los documentos de diseño quedan exentos por ser prosa de referencia.
- El contenido base se registra como datos (Content Registry); expansiones = packs de datos.

### Fixed
- N/A (primer release del núcleo).

### Pending (siguiente: FASE 2 — Motor de Cartas)
- CardDefinition schema + Card Renderer por capas.
- Frames reales por rango (assets) y artwork loader.
- Validación de dependencias circulares automatizada.
