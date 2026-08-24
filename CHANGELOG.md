# Changelog — ECLIPSE: CRÓNICAS DEL ÚLTIMO REINO

Formato: [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) · SemVer.
Este archivo registra también **decisiones de diseño/arquitectura**, no solo código.

## [0.1.1] — 2026-08-24 — Corrección de arranque (hotfix)

### Corregido
- `Kernel`: las factorías async cacheaban la promesa; `SaveEngine`/`SecurityVault`
  recibían una Promise en vez de la instancia (`this._db.delete is not a function`
  en arranque). Nuevas APIs `kernel.set()` y `kernel.ready()`; `main.js` re-hidrata
  el caché para `registry` y `db` antes de resolver dependientes.
- Resiliencia: si IndexedDB está bloqueado (modo privado / iframe restringido), el
  Códice arranca con almacenamiento volátil en memoria y aviso, en lugar de morir.
- Service Worker: bump `eclipse-v0.1.1` para invalidar caché con los módulos nuevos.

## [0.1.0] — 2026-08-24 — «El Códice despierta» (M0+M1)

### Añadido — Documentación
- GDD maestro + 12 capítulos (`docs/gdd/`) derivados del Mega Prompt: universo,
  protagonistas, rangos/evolución, cartas/colección, armas/objetos, combate, mundo,
  facciones, narrativa, progresión/economía, multijugador/offline, audio.
- Visual GDD + identidad visual detallada de los 17 rangos (`docs/visual/`).
- Arquitectura técnica + especificaciones: esquemas de datos, renderizado,
  almacenamiento/seguridad, LAN/sync, Android/PWA (`docs/arch/`).
- Roadmap por hitos (M0→M10+), README con instrucciones.

### Añadido — Motor (base funcional)
- `core/`: Kernel (inyección), EventBus, RNG determinista (hash+mulberry32), Platform.
- `data/`: ContentRegistry con validación de esquemas al cargar.
- `game/rank`: RankService (escalera de 17 rangos, familias).
- `game/evolution`: reglas canónicas — protagonista G→XG; carta normal máximo +3
  sobre su rango base (implementado en motor, con tests).
- `game/cards`: CardComposer por capas (fondo→artwork→efectos→marco→decoración→info),
  tamaño lógico 360×504, DPR≤2; FramePainter procedural con identidad por rango;
  SigilPainter (artwork placeholder original por protagonista).
- `game/weapons`: WeaponGenerator por componentes con semilla determinista y
  generador de nombres en castellano.
- `storage/`: IndexedDB (stores del Mega §36) + SaveEngine con autosave.
- `security/`: utilidades AES-GCM (Web Crypto) para datos sensibles.
- `offline/`: registro de Service Worker; app-shell cache-first.
- `ui/`: UIEngine (pantallas DOM) + Splash, Prólogo, Elección de Portador (12 cartas
  renderizadas), Santuario (carta del Portador + arsenal generado).
- `content/`: `ranks.json` (17), `protagonists.json` (12 Portadores con identidad
  propia), `factions.json` (9), `weapons/components.json`, `story/prologue.json`.
- PWA: manifest, iconos originales generados, SW, arranque offline.
- Tests Node: rangos, evolución, armas, validación de contenido.
- `tools/dev-server.mjs`: servidor estático sin dependencias para desarrollo/preview.

### Decisiones (ADR)
- ADR-001 ES Modules nativos sin framework (Mega §53).
- ADR-002 Marcos y sigilos procedurales en Canvas 2D como primer backend de render;
  interfaz preparada para marcos-atlas y WebGL2 futuros.
- ADR-003 UI en DOM + escenas/cartas en Canvas (responsive + rendimiento).
- ADR-004 Determinismo por semilla persistida (armas/eventos reconstruibles).
- ADR-005 LAN host-autoritativo por intenciones (contrato en docs; implementación M6).
- ADR-006 Documentación subdividida con el mismo límite de ~200 líneas que el código.
- ADR-007 XG exclusivo de Portadores: el techo de cartas normales es
  min(base+3, URRX) aunque base+3 cayera en XG (canon añadido a GDD cap. 03 §3).
  La regla vive en EvolutionEngine con tests dedicados.
- QA visual: renders dorados M1 (`docs/visual/golden/`) generados con los módulos
  reales del CardComposer — referencia de las 17 identidades de marco y de los 12
  sigilos de Portador para futuros golden-renders automatizados (M8).

### Pendiente conocido
- Artwork final de los 12 Portadores (hoy: sigilos procedurales originales).
- Audio (capas definidas en GDD cap. 12; implementación M2+).
- LAN y Sync: contratos documentados, código en M6/M7.
