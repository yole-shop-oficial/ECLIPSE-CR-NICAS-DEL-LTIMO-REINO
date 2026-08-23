# GDD — ECLIPSE: CRÓNICAS DEL ÚLTIMO REINO

> **Fuente central de verdad.** Derivado del MEGA PROMPT (`Mega promts`, rev. 3fccba2).
> Subtítulo interno: **THE ETERNAL CODEX** · Versión GDD: 0.1.0 · Estado: FASE 0/1.
> Documentos hermanos: `ARCHITECTURE.md`, `VISUAL_GDD.md`, `ROADMAP.md`, `CHANGELOG.md`.

---

## 1. Visión

Videojuego de **cartas coleccionables + RPG narrativo de fantasía oscura**, distribuido como
**PWA instalable en Android**, con calidad comercial: debe sentirse como un videojuego
completo, no como una página web con cartas. Combina:

- TCG estratégico (turnos, Action Stack, energía, reacciones).
- RPG de progresión infinita (evolución, ecos, reliquias, memoria).
- Narrativa profunda **sin final definitivo**: el universo continúa tras cada arco.
- Exploración, colección, fabricación procedural de armas (miles).
- PvE, PvP y cooperativo; **multijugador LAN por Wi-Fi sin Internet**.
- **Offline First**: campaña, colección, IA, guardado y LAN funcionan sin conexión.
- Progresión infinita vía contenido procedural, expansiones y sistemas combinatorios.

Nunca se mostrará al jugador un mensaje equivalente a "has terminado el juego".

## 2. Identidad

| Campo | Valor |
|---|---|
| Nombre | ECLIPSE: CRÓNICAS DEL ÚLTIMO REINO |
| Subtítulo | THE ETERNAL CODEX |
| Género | TCG + RPG + Dark Fantasy + Narrative Adventure |
| Dirección artística | Fantasía oscura medieval: pintura digital, manuscritos, ruinas, magia prohibida |
| Prohibido | Estética anime, personajes caricaturescos, UI infantil, **emojis** dentro del juego |
| Iconografía | 100 % original, diseñada para el proyecto (ver `VISUAL_GDD.md`) |

## 3. Premisa narrativa

Hace miles de años existía **Eryndor**, protegido por doce entidades: los **Portadores del
Eclipse**, cada una vinculada a una fuerza primordial. En una guerra imposible de ganar, los
doce fueron **convertidos en cartas**: no murieron, fueron sellados. Sus recuerdos se
fragmentaron, sus armas se dispersaron, sus nombres fueron borrados… y el mundo siguió
muriendo.

Ahora las cartas despiertan. Cada jugador encuentra las doce cartas principales y **elige una**:
su Protagonista. Los otros once no desaparecen: son personajes fundamentales (rivales,
aliados, antagonistas). El protagonista empieza en **rango G** y debe crecer hasta **XG**,
descubriendo quién era, qué ocurrió durante el Eclipse y por qué se crearon las doce cartas.

## 4. Universo e historia

Estructura temporal: **Era del Eclipse** (guerra y sellado) → **Era del Silencio** (mundo
moribundo, nombres borrados) → **Era del Despertar** (presente jugable). La historia se
organiza como: Saga → Temporada → Capítulo → Misión → Evento → Encuentro → Decisión.
El mundo se expande sin destruir contenido anterior: nuevas regiones, facciones, guerras,
dimensiones y líneas temporales se añaden vía expansiones (§30).

## 5. Facciones

Sistema extensible (data-driven). Facciones fundacionales:

| Facción | Dominio | Filosofía |
|---|---|---|
| El Imperio de Ceniza | Páramos calcinados | Orden a través del fuego y la reconquista |
| La Iglesia del Eclipse | Ciudades santuario | Adora el sellado; teme el despertar |
| Los Hijos del Vacío | Grietas y ruinas | Buscan lo que hay detrás de las cartas |
| El Reino de Cristal | Mesetas vítreas | Preservar la memoria en cristal vivo |
| Los Guardianes de la Raíz | Bosque Negro | Proteger el ciclo natural corrompido |
| Los Señores de la Sangre | Criptas y corte nocturna | Poder heredado, pactos y linaje |
| La Orden de la Última Luz | Fortalezas fronterizas | Resistir hasta el último amanecer |
| Los Errantes | Caminos y mercados | Sin patria; información y comercio |

Cada facción define: cultura, arquitectura, armaduras, armas, colores, enemigos, aliados,
cartas exclusivas, personajes e historia. Añadir facciones = añadir datos, no motor.

## 6. Los 12 protagonistas

Exactamente 12. Cada uno con: nombre, título, historia, personalidad, facción, atributos,
afinidad, arma principal, habilidades, árbol evolutivo, forma inicial, formas evolucionadas,
eventos propios, finales alternativos y línea narrativa individual. Deben sentirse totalmente
distintos entre sí. Arquetipos canónicos (nombres de trabajo):

| # | Arquetipo | Afinidad (trabajo) | Arma (trabajo) |
|---|---|---|---|
| 01 | El Heredero de las Cenizas | Ceniza/Fuego | Espada rota |
| 02 | La Bruja del Eclipse | Sombra/Astro | Grimorio |
| 03 | El Caballero Sin Rostro | Vacío/Metal | Mandoble |
| 04 | La Reina de los Muertos | Muerte/Hueso | Guadaña |
| 05 | El Cazador del Abismo | Abismo/Sangre | Arco |
| 06 | El Santo Caído | Luz corrupta | Martillo |
| 07 | La Portadora del Vacío | Vacío puro | Catalizador |
| 08 | El Príncipe de la Sangre | Sangre | Daga |
| 09 | La Guardiana del Bosque Negro | Raíz/Vida | Lanza |
| 10 | El Artífice de Dioses | Forja/Runas | Amuleto |
| 11 | El Último Dragón Humano | Dragón | Hacha |
| 12 | El Niño que Recuerda el Fin | Memoria/Tiempo | Reliquia |

## 7. Sistema de rangos (17, orden canónico inalterable)

```
G → F → C → D → B → BB → A → AA → AAA → S → SS → SSS → SSSR → UR → URR → URRX → XG
```

Cada rango posee **identidad visual completa propia** (no solo color): marco, material,
ornamentación, símbolos, tipografía, iluminación, partículas, animación, sonido, bordes,
profundidad y efectos mágicos (detalle en `VISUAL_GDD.md`). Los rangos superiores deben
parecer objetos extraordinarios; **XG rompe las reglas del propio juego** (§31).

## 8. Cartas: sistema por capas

**Una carta no es una imagen.** Composición obligatoria (orden inalterable):

```
Fondo → Arte → Efectos internos → Marco → Decoraciones superiores → Información de carta
```

- El **arte** existe sin marco (PNG/WebP con transparencia).
- El **marco** va SIEMPRE encima del arte y es transparente en su zona interior.
- Nunca se aplana permanentemente arte+marco salvo necesidad justificada de rendimiento.
- Card Rendering Engine: `cardData → carta renderizada` (artwork + frame + rank effects +
  stats + texto + partículas + animación), permitiendo millones de combinaciones sin
  almacenar una imagen por carta.

`CardDefinition` (data-driven): `{ id, type, rank, art, frame, faction, name, stats,
abilities, effects, evolution, rarity, animationProfile }`.

## 9. Biblioteca de marcos

Un marco por rango en `/assets/cards/frames/<RANGO>/`. Cada marco: transparente, mismo
tamaño lógico base, escalable, reutilizable, compatible con cualquier ilustración, optimizado
para móvil y preparado para animación. Puede incluir ornamentación, runas, metales, piedra,
hueso, cristal, energía y elementos sobrenaturales.

## 10. Evolución

**Protagonistas (única excepción):** G → XG completo (17 rangos). Cada evolución cambia:
arte, marco, animación, habilidades, estadísticas, efectos, historia, descripción, apariencia,
arma, VFX, sonido y animaciones de entrada/ataque/evolución. Debe sentirse como una
transformación auténtica, no "subir un número".

**Cartas normales:** máximo **+3 rangos** sobre su rango base (p. ej. base B → BB, A, AA;
base SSSR → UR, URR, URRX). Sin evolución infinita: esto da valor estratégico a cada rango.

**Requisitos:** combinación variable de experiencia, fragmentos, ecos, memoria, materiales,
pruebas, reliquias y armas. Algunas evoluciones exigen **condiciones narrativas**
(p. ej. SSS→SSSR: derrotar a cierto jefe + descubrir una memoria + poseer una reliquia +
tomar una decisión concreta). Nunca "nivel 10 = evolución".

**Echo System:** cada protagonista conserva recuerdos de sus formas anteriores; los ecos
desbloquean habilidades, pasivas, diálogos, animaciones, formas alternativas y secretos.
Las formas antiguas siguen teniendo valor.

## 11. Armas y objetos

**Miles de armas**, sin imagen exclusiva por arma. Generación por componentes:

```
Base + Tipo + Material + Núcleo + Runa + Efecto + Rareza + Historia + Afinidad + Modificador
```

Ej.: Espada + Obsidiana + Núcleo lunar + Runa del vacío + Sangrado + UR =
*"Espada de la Luna Vacía"*. Cada componente modifica estadísticas, apariencia y
comportamiento. Visual modular: `Blade + Hilt + Guard + Gem + Rune + Glow + Particle
Profile`. Categorías: espadas, lanzas, arcos, guadañas, bastones, martillos, dagas, hachas,
escudos, grimorios, catalizadores, anillos, amuletos, reliquias, artefactos, armaduras.

**Item Generation Engine:** cada objeto con ID único, tipo/subtipo, material, nivel, rango,
calidad, modificadores, efectos, afinidades, lore, valor, apariencia, receta y procedencia.
Los generadores son procedurales con **semillas deterministas** (misma seed → mismo objeto).

## 12. Mecánicas especiales

- **Reliquary:** colección de artefactos históricos no equipables; reunir fragmentos
  (A+B+C) restaura reliquias perdidas que revelan historia mundial.
- **Memory Fragments:** cientos de fragmentos por protagonista; revelan pasado,
  relaciones, traiciones, poderes y secretos del Eclipse. La colección es herramienta narrativa.
- **World Scars:** decisiones importantes dejan cicatrices permanentes (ciudades
  destruidas, facciones extintas, jefes aliados, rutas bloqueadas), guardadas como variables.
- **Card Soul:** cada carta importante tiene personalidad, historia, afinidad, miedo, deseo,
  relaciones y conflictos; algunas reaccionan narrativamente entre sí.

## 13. Combate

Campo de batalla 2D, estratégico y espectacular sin 3D: turnos, prioridad, energía,
habilidades, efectos, posicionamiento, reacciones, combos, estados e interacciones.
**Action Stack:** las acciones entran en una pila y el motor las resuelve; permite
contrarrestar, interrumpir, reaccionar y encadenar. La resolución es **determinista**
(requisito del multijugador). Detalle de sistemas en FASE 7 del `ROADMAP.md`.

## 14. Progresión y explorión

Progresión del protagonista mediante experiencia, fragmentos, memorias, materiales,
pruebas, reliquias, armas y ecos. Mundo jerárquico: Continentes → Regiones → Ciudades →
Mazmorras → Ruinas → Santuarios → Campos de batalla → Dimensiones especiales. No todas
las regiones están disponibles al inicio: el mapa se expande con el contenido. Jefes y
mazmorras son definiciones de datos (`BossDefinition`, `DungeonDefinition`).

## 15. Narrativa

**Sin final.** Escenas cinematográficas ligeras (aptas para dispositivos modestos, sin vídeo):
ilustraciones, capas, zoom, parallax, transiciones, partículas, iluminación, texto progresivo,
retratos, cámara virtual y audio, orquestadas por el **Scene Engine**
(`background, characterLayers, dialogue, camera, effects, audio, choices, events, flags`).

Diálogos con opciones, decisiones, relaciones, variables, reputación, facciones,
consecuencias, eventos ocultos y ramas. El **Narrative Director** decide qué eventos,
personajes, diálogos, enemigos y recompensas aparecen, evaluando: `playerProgress,
storyFlags, factionReputation, protagonistRank, worldState, collection, previousChoices`.

## 16. Eventos infinitos

Event Generator combinatorio: emboscada, ruina, mercader, jefe, portal, escolta, maldición,
tesoro, decisión, duelo, invasión, guerra, aparición legendaria. Los eventos se combinan entre
sí → contenido prácticamente ilimitado sin almacenamiento manual.

## 17. Multijugador LAN Wi-Fi (sin Internet)

Modo **LAN HOST**: un jugador crea sala; los demás entran por código, QR, descubrimiento
local o dirección local. El host controla el estado; la lógica de combate es determinista; el
cliente nunca confía ciegamente en sus propios valores. PvP, PvE cooperativo y duelos.
Internet solo se usa para sincronización opcional, cuentas, copias remotas y PvP remoto.

## 18. Offline First, PWA y Android

Todo lo esencial funciona sin Internet: campaña, historia, colección, inventario, mazos, IA,
exploración, fabricación, eventos, progresión, guardado y LAN. La app arranca desde cache
(Service Worker + IndexedDB), se instala como PWA y se empaqueta para Android (instalable,
arranque rápido, adaptable a pantallas, orientación gestionada, suspensión/reanudación,
estado de conexión). Prioridad móvil: 320–430 px, luego 768/1024/desktop.

## 19. Almacenamiento, datos y seguridad

IndexedDB con colecciones separadas: `profile, cards, inventory, weapons, characters,
quests, storyFlags, worldState, deck, settings, syncQueue`. Autoguardado y recuperación
ante cierre inesperado (slot auto + backup). Seguridad: Web Crypto API, AES-GCM para datos
sensibles, sin secretos en cliente, validación de toda acción importante (nunca confiar solo en
la UI). **Sync Engine** opcional: Local → Queue → Validation → Remote → Confirm → Synced;
si falla, reintenta sin bloquear el juego offline.

## 20. Rendering, animación, VFX y audio

Arquitectura 2D avanzada: Canvas + WebGL2 + OffscreenCanvas + Web Workers, spritesheets,
texture atlases, shaders, partículas, parallax, post-procesado, cámara virtual y compositing
por capas; separación estricta Gameplay Logic / Rendering / UI. Iluminación dinámica 2D
(antorchas, magia, portales, runas): una carta URRX impone presencia visual mediante
bloom, glow, partículas, distorsión y aura, no solo color. Effect Engine con perfiles
reutilizables (fuego, hielo, sangre, vacío, luz, sombra, veneno, relámpago, cristal, ceniza,
energía espiritual). Animation Controller: `idle, hover, select, attack, damage, cast, death,
evolve, special, victory`. Evolución del protagonista = secuencia cinematográfica completa
(ver `VISUAL_GDD.md`). Audio modular por capas: Music, Ambience, Combat, UI, Card, Rank,
Evolution, Dialogue, Boss; cada rango superior y cada evolución principal tienen audio propio.

## 21. UI/UX

**Dark Fantasy Premium**: piedra, metal envejecido, pergamino, vidrio oscuro, obsidiana, oro
antiguo, plata ennegrecida, hueso. La interfaz debe sentirse como un códice mágico antiguo
convertido en videojuego. Pantallas: Menú principal, Perfil, Colección, Constructor de
mazos, Inventario, Forja, Historia, Mapa, Combate, Ajustes, Multijugador, Evolución, Códice.

## 22. Arquitectura (resumen)

Capas: UI → Game Systems → Game Engine → Rendering → Storage → Networking → Sync.
Motores: GameEngine, CardEngine, CombatEngine, EvolutionEngine, ItemEngine,
WeaponGenerator, StoryEngine, WorldEngine, EventEngine, NarrativeDirector, RenderEngine,
AnimationEngine, ParticleEngine, AudioEngine, OfflineEngine, SyncEngine, LANEngine,
CollectionEngine, SaveEngine, UIEngine. **Data-driven**: Content Registry central; expansión
= paquete de datos, cero cambios de motor. Regla estricta: **ningún archivo de código supera
200 líneas**. Detalle completo en `ARCHITECTURE.md`.

## 23. Optimización y escalabilidad

Lazy loading, texture atlases, sprite batching, object pooling, cache, compresión, WebP/AVIF,
resolution tiers, LOD 2D, descarga de recursos no usados, precarga inteligente. Niveles de
calidad **LOW / MEDIUM / HIGH / ULTRA** con adaptación automática al dispositivo.
Diseñado desde el día uno para: miles de cartas, armas, enemigos y eventos; cientos de
personajes y regiones; decenas de miles de combinaciones de objetos.

## 24. Expansiones

Una expansión añade: Cards, Characters, Weapons, Enemies, Bosses, Regions, Quests,
Dialogue, Events, Frames, VFX y Audio — exclusivamente como datos registrados. El motor
permanece estable. Nunca se destruye contenido antiguo.

## 25. Reglas de oro

1. No construir una colección de cartas: construir un **UNIVERSO**; las cartas son su
   sistema de existencia. Todo (espada, enemigo, reliquia, región, evolución) tiene historia.
2. El jugador debe sentir siempre **"¿Qué habrá después?"**: secretos, contenido oculto,
   evoluciones y cartas secretas, jefes desconocidos, finales alternativos, eventos rarísimos.
3. **XG** no son "estadísticas gigantes": son entidades que alteran sistemas (orden de turnos,
   reglas del campo, condiciones de victoria, variables narrativas, el propio mundo).
   Debe sentirse como algo que el jugador no debería haber conseguido.
4. Offline First, Local First, Data-Driven, Modular, Performance, Extensibility, Reusability,
   Security, Scalability, Narrative Depth, Visual Quality.

## 26. Vertical Slice (primera meta de producción)

Definición completa y checklist en `ROADMAP.md` (§Milestone V). Resumen: 1 protagonista,
evolución G→F→C→D, 3–5 cartas normales, 2 armas generadas, 1 enemigo, 1 jefe, 1 combate
completo, 1 escena narrativa, 1 evento, 1 región pequeña, guardado/carga offline, sala LAN +
partida, marco de carta + varios rangos visuales y una evolución animada.
