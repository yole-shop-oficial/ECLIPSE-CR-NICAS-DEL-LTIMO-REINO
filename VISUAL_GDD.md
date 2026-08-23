# VISUAL GDD — ECLIPSE: CRÓNICAS DEL ÚLTIMO REINO

Versión 0.1.0 · Dirección artística y especificación visual. Complementa `GDD.md`.

---

## 1. Dirección artística

**Fantasía oscura premium.** Pintura digital densa, manuscritos antiguos, ruinas, magia
prohibida. Referencias de tono: códices medievales iluminados, hierro envejecido, obsidiana,
velas y bruma. **Prohibido:** estética anime, caricatura, UI infantil y emojis. Todo icono es
original y comparte un mismo lenguaje de trazo.

**Paleta madre:** negros azulados `#0b0a10`–`#141320`, grises piedra `#5b574e`, oro antiguo
`#d4af37`, plata ennegrecida `#9aa2ae`, sangre `#7a1f2b`, arcano `#7f5af0`. La luz siempre
parece costar algo: velas, runas, grietas.

## 2. Tipografía

- **Display / títulos:** serif tallada de alto contraste (candidata auto-alojada WOFF2;
  mientras tanto, fallback `Georgia, 'Times New Roman', serif` con letter-spacing amplio).
- **Cuerpo / texto de cartas:** serif legible o humanist sans según soporte.
- **Números de stats:** fuente monoespaciada tallada, nunca flotante sobre el arte.
- Jerarquía por tamaño + material (oro/plata/piedra), jamás por colores chillones.

## 3. Diseño de carta y regla de marcos

- **Tamaño lógico único:** ratio 5:7 (≈ 480×672 px lógicos), compartido por TODOS los
  marcos y artes. Escalado por resolution tier (256/384/512/768 px según calidad).
- **Stack de capas (orden sagrado):** `FONDO → ARTE → EFECTOS INTERNOS → MARCO →
  DECORACIONES SUPERIORES → UI DATA` (nombre, stats, iconos).
- El marco es transparente en su ventana interior; el arte se ve completo debajo.
- Nunca aplanar arte+marco de forma permanente (solo cache de composición volátil por
  rendimiento, regenerable).
- Zonas seguras: banda superior (nombre), ventana central (arte), banda inferior (stats),
  esquinas (rango, facción, energía). El marco nunca invade texto.

## 4. Sistema de iluminación 2D

Luces dinámicas baratas: sprites de glow aditivos + modulación de alpha (fase Canvas2D);
bloom real por downsample en fase WebGL2. Fuentes típicas: antorchas, magia, fuego, rayos,
espadas encantadas, portales, jefes, runas. **Presencia por rango:** una carta URRX domina la
pantalla con halo, partículas y distorsión sutil; una carta G apenas emite polvo.

## 5. VFX y partículas

Effect Engine con perfiles reutilizables: fuego, hielo, sangre, vacío, luz, sombra, veneno,
relámpago, cristal, ceniza, energía espiritual. Cada perfil define: emisor, paleta, gravedad,
vida, blend y audio. **Presupuestos por calidad** (partículas activas máx.): LOW 40 ·
MEDIUM 120 · HIGH 300 · ULTRA 600. Pooling obligatorio; cero allocations por frame.

## 6. Animación

Animation Controller con estados: `idle, hover, select, attack, damage, cast, death, evolve,
special, victory`. Cartas normales: animaciones contenidas (2–4 s). Protagonistas: entradas,
ataques y evoluciones elaboradas con cámara virtual. Easing: ease-out pesado para golpes,
ease-in lento para magia. Ritmo objetivo 60 fps (30 fps en LOW).

### 6.1 Evolución cinematográfica (protagonista)

Beats: 1) la pantalla se oscurece → 2) aparece la ilustración actual → 3) el marco se quiebra
y sus fragmentos flotan → 4) la carta libera energía → 5) flash de recuerdos (memorias) →
6) se revela el nuevo rango → 7) se genera el nuevo marco → 8) la ilustración cambia →
9) la carta se ensambla → 10) el jugador recibe la nueva forma. Audio único por evolución.

## 7. Iconografía

Set propio (sin emojis) con trazo tallado 2 px y esquinas biseladas: vida, ataque, defensa,
energía, magia, sombra, fuego, hielo, vacío, rango, evolución, habilidades, objetos y estados.
Mismo grid 24×24; variantes por material según contexto (piedra/oro/arcano).

## 8. Menús y pantallas

Material base: **códice mágico antiguo convertido en videojuego**. Piedra, metal envejecido,
pergamino, vidrio oscuro, obsidiana, oro antiguo, plata ennegrecida, hueso. Layout móvil
prioritario en vertical (320–430 px): cabecera con recursos, contenido central, barra inferior
de navegación (5 destinos: Colección, Forja, Mapa, Combate, Códice). Transiciones entre
pantallas: tinta que se extiende / humo / **eclipse wipe** (disco negro con corona dorada).

## 9. Escenas narrativas

Capas: fondo pintado (2–3 planos parallax), retratos con iluminación intercambiable, texto
progresivo en caja de pergamino oscuro, cámara virtual con zoom/pan lento, partículas
ambientales (ceniza, polvo, brasas). Sin vídeo: todo es 2D compuesto en tiempo real.

## 10. Los 17 rangos — identidad visual

Paleta = `{base, accent, glow}`. Todas las fichas viven en `data/ranks.js` (data-driven) y
sus marcos en `/assets/cards/frames/<RANGO>/`.

| Rango | Nombre del marco | Material / ornamentación | Base | Acento | Glow | Partículas | Audio |
|---|---|---|---|---|---|---|---|
| **G** | Piedra del Iniciado | Piedra gris agrietada, sin ornamento | `#5b574e` | `#8a8375` | `#b9b29c` | Polvo leve | Golpe sordo de piedra |
| **F** | Cuero del Errante | Cuero curtido + costuras, remaches de hueso | `#6b4f37` | `#9c7a52` | `#caa06a` | Arena al viento | Cuero crujiendo |
| **C** | Bronce del Soldado | Bronce martillado, remaches militares | `#7a5a2e` | `#b98a3f` | `#e8b45a` | Chispas tenues | Metal templado |
| **D** | Hierro del Veterano | Hierro oscuro forjado, muescas de batalla | `#45464c` | `#6e7076` | `#9aa0ad` | Virutas metálicas | Choque de hierro |
| **B** | Acero de Luna | Acero azulado con filo luminoso | `#3c4a5d` | `#6f88a6` | `#a9c6e8` | Neblina fría | Viento nocturno |
| **BB** | Acero Gemelo | Doble filo de acero + incrustaciones de plata (motivo doble) | `#46536b` | `#8fa3c0` | `#d7e4f7` | Neblina doble, espejismos | Eco metálico doble |
| **A** | Plata del Juicio | Plata pulida + lapislázuli, balanza grabada | `#9aa2ae` | `#3b5aa8` | `#cfe2ff` | Destellos de plata | Campana lejana |
| **AA** | Oro del Juramento | Filigrana de oro, juramentos grabados | `#8a6d1f` | `#d4af37` | `#ffe27a` | Motas doradas | Coro grave breve |
| **AAA** | Oro Real | Oro triple + gemas rojas, corona menor | `#9c7a1a` | `#ffd24a` | `#fff3b0` | Brasas doradas | Fanfarria oscura |
| **S** | Obsidiana Solar | Obsidiana con vetas de oro fundido | `#17171c` | `#d4af37` | `#ffdf70` | Brasas + glow pulsante | Trueno contenido |
| **SS** | Obsidiana Arcana | Obsidiana doble veta arcano, runas flotantes | `#14141d` | `#7f5af0` | `#b79bff` | Runas flotantes | Susurro arcano |
| **SSS** | Cristal Prisma | Cristal prismático, refracciones lentas | `#1b2436` | `#6ee7ff` | `#ffffff` | Esquirlas de luz | Vitrail cantando |
| **SSSR** | Cristal Rúnico Vivo | Cristal vivo con runas latiendo dentro | `#201a33` | `#ff6ac1` | `#ffd6ff` | Latidos de luz rúnica | Corazón de cristal |
| **UR** | Vacío Estelar | Negro absoluto + polvo de estrellas | `#0b0b12` | `#f5f0ff` | `#fff8d9` | Estrellas en deriva | Silencio + nota única |
| **URR** | Vacío Constelar | Vacío profundo + constelaciones conectadas | `#07070d` | `#8de3ff` | `#eaffff` | Constelaciones animadas | Coro del vacío |
| **URRX** | Grieta de la Realidad | El marco se fisura; la luz escapa como herida | `#050507` | `#ff3d5a` | `#ffe9ec` | Distorsión + chispas de realidad | Rasgido grave |
| **XG** | Corona del Eclipse | Disco negro total + corona blanca/oro; rompe el borde del marco | `#000000` | `#ffffff` | `#ffd76a` | Corona solar viva, partículas orbitando | El tema del Eclipse |

**Escalado de presencia:** G–D emiten poco o nada; B–AAA ganan glow y partículas; S–SSSR
añaden luz dinámica y animación de marco; UR–URRX distorsionan el entorno de la carta;
**XG** anima el marco de forma permanente, derrama luz fuera del borde de la carta y su
aparición altera la iluminación de toda la escena.

## 11. Combate (visual)

Campo 2D horizontal en móvil apaisado-virtual: filas con posicionamiento, tarjetas grandes al
frente. Daño = número tallado + shake leve de cámara (nunco mareante). Estados alteran el
marco (quemado, congelado, maldito). La pila de acciones (Action Stack) se visualiza como
sello apilándose en el centro.

## 12. Transiciones y calidad

Transiciones globales: eclipse wipe, tinta, humo. **Tiers:** LOW desactiva glow dinámico y
reduce partículas; MEDIUM añade glow estático; HIGH activa luz dinámica; ULTRA añade
distorsión y post-procesado. El marco NUNCA pierde legibilidad de rango en ningún tier.

## 13. Pipeline de assets

- Arte de cartas: WebP (fallback PNG), sin marco, recortado a ventana + sangrado 8 px.
- Marcos: WebP/PNG con alpha real, un archivo por rango (+ variantes animadas Lottie-like
  por secuencia de frames o shader en fase WebGL2).
- Atlases: sprite atlases por categoría (iconos, partículas, armas-modulares).
- Nombrado: `card_<id>`, `frame_<RANGO>`, `wep_blade_<nn>`, `fx_<efecto>`, `sfx_<evento>`.
- Presupuesto inicial: carta final en memoria ≤ 1.5 MB (tier HIGH); frames ≤ 300 KB c/u.
