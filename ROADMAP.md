# ECLIPSE — Roadmap de Desarrollo

**Método:** incremental y profesional. Primero el núcleo, después el contenido.
Cada hito termina *jugable y demostrable*; nada queda a medias presentado como hecho.
**Regla de contenido:** no producir miles de cartas/armas hasta que los motores que las
generan y administran estén verificados con pruebas.

Leyenda: ✅ hecho · 🚧 en curso · ⬜ pendiente

---

## M0 — Fundación documental y andamiaje ✅
- Análisis completo del Mega Prompt; GDD + capítulos, Visual GDD, Arquitectura,
  convenciones, changelog.
- Estructura de carpetas, dev-server sin dependencias, pruebas Node.

## M1 — Núcleo jugable: identidad de carta ✅ (este ciclo)
- Kernel, EventBus, RNG determinista, Platform.
- Content Registry (JSON validado): rangos (17), 12 protagonistas, facciones,
  componentes de arma, prólogo.
- RankService + EvolutionEngine (regla +3, excepción protagonista) con tests.
- CardComposer por capas (360×504), FramePainter procedural con identidad por rango,
  SigilPainter (placeholders de artwork originales).
- WeaponGenerator con semilla + nombres en castellano, con tests.
- SaveEngine (IndexedDB), PWA (manifest + SW), flujo Splash→Prólogo→Elección de
  Portador→Santuario con guardado.
- **Criterio de salida:** instalar la PWA, elegir un Portador offline, cerrar y volver
  con el progreso intacto. `npm test` en verde.

## M2 — Escena y combate: vertical slice ⬜
- RenderEngine (cámara virtual, capas, pooling), ParticleEngine (perfiles por
  afinidad), AnimationEngine (timelines, estados de carta).
- CombatEngine: turnos, prioridad, energía, Action Stack (declarar→reaccionar→
  resolver), 4 estados alterados, 1 duelo PvE contra IA básica (AIEngine v1).
- Campo de batalla 2D con iluminación simple (antorchas) y HUD del Códice.
- **Salida:** un combate completo Inicio→Victoria/Derrota, 60 fps en 360 px.

## M3 — Economía de objetos: arsenal vivo ⬜
- ItemEngine + RecipeSystem; WeaponView modular (Blade/Hilt/Guard/Gem/Rune/Glow);
  inventario y forja con costes; Reliquary v1 (3 reliquias por fragmentos);
  CollectionEngine (8 colecciones) con pantallas.
- **Salida:** fabricar un arma por componentes, equiparla al Protagonista y ver
  sus efectos reflejados en combate.

## M4 — Narrativa I: el mundo que recuerda ⬜
- StoryEngine + SceneEngine (diálogos con opciones, variables, reputación);
  primeras 200 Memory Fragments del Portador; WorldScars v1 (2 cicatrices);
  WorldEngine v1 (1 continente, 3 regiones, mapa nodal); NarrativeDirector v1.
- Capítulo I completo (≈6 escenas, 1 jefe, 2 decisiones con consecuencia).
- **Salida:** jugar el Capítulo I offline, con cicatriz persistente visible en el mundo.

## M5 — Endurecimiento offline + PWA ⬜
- Migraciones de save, recuperación de cierre inesperado, cifrado AES-GCM de datos
  sensibles, tiers de assets, descarga/lazy-load, QA de instalación Android,
  suspensión/reanudación, vibración, safe-areas.
- **Salida:** auditoría offline completa (avión mode total jugable) + instalable.

## M6 — LAN Wi-Fi ⬜
- LANEngine: salas, unión por código/QR, señalización manual, host autoritativo,
  intenciones validadas, checksum por tick, reconexión, duelo PvP 1v1 y coop PvE 2J.
- **Salida:** dos dispositivos en la misma Wi-Fi, sin Internet, completan un duelo
  con estados verificados y reingreso tras desconexión.

## M7 — Sincronización online (opcional) ⬜
- SyncEngine: cola→validación→remoto→confirmación→marca, reintentos con backoff,
  resolución de conflictos (último-escritor por registro sellado + fusión de colección).
- Backend de referencia mínimo (contrato API ya documentado) como proyecto hermano.
- **Salida:** jugar offline días → conectar → convergencia sin pérdidas.

## M8 — Herramientas de contenido y pipelines ⬜
- Validadores CLI, generador de packs, previsualizador de cartas/escenas, atlas
  builder, fuente propia embebida, localización es/en.
- **Salida:** un Content Pack de expansión (nueva facción + 30 cartas generadas)
  instalable sin tocar el núcleo.

## M9 — Alfa de contenido: «Ceniza sobre Vharzia» ⬜
- Región inicial completa, 6 jefes, 1 mazmorra, 300 cartas normales generadas,
  2.000 armas pool, facciones activas con reputación, eventos combinables v1.
- **Salida:** 8–10 h de campaña con loop completo (explorar→combatir→fabricar→evolucionar).

## M10+ — Crecimiento perpetuo ⬜
- Temporadas, nuevas regiones/facciones/protagonistas convocados como NPC,
  evoluciones ocultas, eventos extremadamente raros, backend PvP remoto,
  empaquetado Android nativo (TWA/Capacitor), WebGL2 backend si los presupuestos lo exigen.

---

### Notas de gobernanza
- Todo hito actualiza GDD/ARCHITECTURE/CHANGELOG en el mismo commit.
- Presupuestos fijos: 60 fps objetivo, archivo ≤200 líneas, app-shell < 1.5 MB
  (sin contar packs), primer arranque interactivo < 3 s en gama media.
- Lo que no pueda implementarse en su hito se documenta como contrato + interfaz,
  nunca como código falso.
