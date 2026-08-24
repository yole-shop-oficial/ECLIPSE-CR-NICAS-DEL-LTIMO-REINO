# ECLIPSE: CRÓNICAS DEL ÚLTIMO REINO — Game Design Document

**THE ETERNAL CODEX** · TCG + RPG + Dark Fantasy + Aventura Narrativa
**Estado:** Documento vivo v1.0 · Fuente de verdad de diseño junto al Mega Prompt.
**Relación con el Mega Prompt:** este GDD amplía técnicamente la visión original. Si
alguna vez hay conflicto, el Mega Prompt (`/Mega promts`) tiene prioridad canónica.

---

## 1. Visión

ECLIPSE no es un juego de cartas con una historia: es un **mundo de fantasía oscura
que utiliza cartas como su sistema de existencia**. Combinamos TCG estratégico, RPG
de progresión, narrativa cinematográfica ligera, colección, evolución, fabricación de
armas, exploración, mazmorras, jefes, PvE, PvP y multijugador local Wi-Fi, en una
aplicación PWA offline-first instalable en Android.

**El universo no tiene final definitivo.** La historia se organiza en sagas y
temporadas, pero el mundo continúa existiendo tras cada arco. Nunca se muestra al
jugador un mensaje equivalente a «has terminado el juego».

## 2. Pilares de diseño (innegociables)

| # | Pilar | Consecuencia práctica |
|---|-------|------------------------|
| 1 | **Universo, no colección** | Toda carta, arma, reliquia, enemigo y región tiene historia. |
| 2 | **Regla de oro del misterio** | El jugador siempre pregunta «¿qué habrá después?». Secretos, contenido oculto, rarezas extremas. |
| 3 | **Transformación, no incremento** | Evolucionar cambia arte, marco, animación, habilidades, arma, lore y sonido. Nunca solo números. |
| 4 | **Offline first / Local first** | Todo lo esencial funciona sin Internet. Internet solo sincroniza. |
| 5 | **Data-driven** | Cartas, armas, regiones, eventos y diálogos son DATOS interpretados por motores. |
| 6 | **Calidad comercial 2D** | Canvas/WebGL2, iluminación, partículas, composición por capas. Sensación de videojuego, no de página web. |
| 7 | **Identidad dark fantasy premium** | Piedra, metal envejecido, pergamino, obsidiana. Sin anime, sin caricatura, **sin emojis**, iconos originales. |
| 8 | **Modularidad extrema** | Ningún archivo supera 200 líneas. Sistemas pequeños, reutilizables, sin dependencias circulares. |

## 3. Reglas canónicas del sistema

1. **Exactamente 12 Cartas Principales** (Portadores del Eclipse). El jugador elige
   **una**; las otras once siguen vivas en el mundo como aliados, rivales o antagonistas.
2. La carta elegida (Protagonista) comienza en rango **G** y es la **única categoría**
   que puede evolucionar hasta **XG**.
3. Escalera oficial de rangos (menor → mayor):
   `G, F, C, D, B, BB, A, AA, AAA, S, SS, SSS, SSSR, UR, URR, URRX, XG` (17 rangos).
4. **Regla del +3:** una carta normal solo puede evolucionar hasta 3 rangos por encima
   de su rango base (B → máximo AA; SSSR → máximo URRX). Implementada en el motor de
   evolución, nunca solo en la interfaz.
5. **Una carta no es una imagen.** Se compone por capas: fondo → artwork → efectos
   internos → **marco (siempre encima, con interior transparente)** → decoraciones →
   información. Orden irreversible.
6. Todos los marcos comparten un **tamaño lógico común** (360×504) y son reutilizables
   por miles de cartas. Cada rango tiene identidad visual propia (no solo color).
7. Las armas se **generan por componentes** (tipo, base, material, hoja, empuñadura,
   guardia, núcleo, runas, afinidad, modificadores, efectos, rango) con semillas
   deterministas. No se crean miles de imágenes.
8. **XG rompe reglas del sistema**: altera turnos, campos, efectos, condiciones de
   victoria o el estado del mundo. Debe sentirse como algo que el jugador no debería haber conseguido.
9. Las decisiones importantes dejan **World Scars** permanentes almacenadas como
   variables narrativas.
10. El combate usa **Action Stack**: las acciones se apilan y se resuelven por el
    motor, permitiendo contrarrestar, interrumpir, reaccionar y encadenar.
11. Multijugador LAN sin Internet: host autoritativo, lógica determinista, validación
    del estado, reconexión, códigos/QR locales.
12. Iconografía propia. Cero emojis dentro del juego.

## 4. Mapa del GDD (capítulos)

| Capítulo | Contenido |
|----------|-----------|
| [docs/gdd/01-universo.md](docs/gdd/01-universo.md) | Eryndor, el Eclipse, premisa, tono, cosmología |
| [docs/gdd/02-protagonistas.md](docs/gdd/02-protagonistas.md) | Los 12 Portadores: identidad, afinidad, arma, arco, XG |
| [docs/gdd/03-rangos-evolucion.md](docs/gdd/03-rangos-evolucion.md) | Rangos, evolución, regla +3, Ecos, evolución cinematográfica |
| [docs/gdd/04-cartas-coleccion.md](docs/gdd/04-cartas-coleccion.md) | Anatomía de carta, Card Soul, las 8 colecciones |
| [docs/gdd/05-armas-objetos.md](docs/gdd/05-armas-objetos.md) | Generador de armas, objetos, Reliquary |
| [docs/gdd/06-combate.md](docs/gdd/06-combate.md) | Turnos, energía, prioridad, Action Stack, estados, XG |
| [docs/gdd/07-mundo.md](docs/gdd/07-mundo.md) | Continentes, regiones, mazmorras, jefes, exploración |
| [docs/gdd/08-facciones.md](docs/gdd/08-facciones.md) | Facciones, reputación, relaciones |
| [docs/gdd/09-narrativa.md](docs/gdd/09-narrativa.md) | Escenas, diálogos, decisiones, memorias, Narrative Director, eventos |
| [docs/gdd/10-progresion-economia.md](docs/gdd/10-progresion-economia.md) | Progresión infinita, economía, expansiones |
| [docs/gdd/11-multijugador-offline.md](docs/gdd/11-multijugador-offline.md) | Coop, PvE, PvP, LAN, sync, offline |
| [docs/gdd/12-audio.md](docs/gdd/12-audio.md) | Capas de audio, música adaptativa, identidad sonora |

Documentos hermanos:
[VISUAL_GDD.md](VISUAL_GDD.md) (dirección de arte),
[ARCHITECTURE.md](ARCHITECTURE.md) (ingeniería),
[ROADMAP.md](ROADMAP.md) (plan incremental),
[CHANGELOG.md](CHANGELOG.md) (decisiones y cambios).

## 5. Fantasía del jugador (player fantasy)

«Soy el Cronista que despertó a un Portador sellado. Empiezo con una carta humilde de
rango G, fragmentada y sin memoria, y a través de decisiones, batallas, ecos y
reliquias la transformo — forma a forma — hasta algo que el propio mundo teme.
Mientras tanto, los otros once Portadores despiertan, y el mundo recuerda mis
decisiones para siempre.»

## 6. Público y plataformas

- Jugadores de TCG/RPG móviles que valoran profundidad, colección y narrativa.
- **Plataforma primaria:** Android (pantallas 320–430 px, RAM/GPU modestas).
- Secundarias: tablet y escritorio (768 px+). PWA instalable en todas.

## 7. Glosario canónico

- **Portador del Eclipse**: una de las 12 entidades selladas en cartas.
- **Cronista**: el jugador; quien despierta y acompaña al Portador.
- **Códice Eterno**: artefacto-interfaz del juego; metáfora diegética de la UI.
- **Eco**: recuerdo persistente de una forma evolutiva anterior (Echo System).
- **Cicatriz del Mundo / World Scar**: consecuencia permanente de una decisión.
- **Relicario / Reliquary**: colección de artefactos históricos ensamblables por fragmentos.
- **XG**: rango final (17.º); entidades que alteran las reglas del sistema.

## 8. Mantenimiento de este documento

Este GDD es un documento vivo. Toda decisión de diseño que altere mecánicas, contenido
o canon debe reflejarse aquí y en CHANGELOG.md en el mismo cambio. Los capítulos en
`docs/gdd/` no deben superar ~200 líneas: si un capítulo crece, se subdivide.
