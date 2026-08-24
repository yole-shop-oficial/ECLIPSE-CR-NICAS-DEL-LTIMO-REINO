# ECLIPSE — Visual GDD (Biblia de Dirección de Arte)

**Estado:** v1.0 · Documento vivo.
**Mandatos canónicos (Mega §2, §40–42):** fantasía oscura premium · pintura digital ·
códice antiguo · **sin estética anime, sin caricatura, sin interfaces infantiles, sin
emojis** · todos los iconos son originales del proyecto.

---

## 1. Pilares visuales

1. **«Un códice mágico antiguo convertido en videojuego»** — toda la UI se trata como
   material físico: piedra grabada, metal envejecido, pergamino, vidrio oscuro.
2. **La luz es narrativa** — en un mundo que agoniza bajo un eclipse, cada fuente de
   luz (antorcha, runa, hoja encantada) es un personaje. Iluminación 2D dinámica.
3. **El rango se SIENTE antes de leerse** — una carta UR inspira reverencia sin leer
   sus stats: materiales, ornamentación, partículas, profundidad, sonido.
4. **Decadencia hermosa** — nada es nuevo ni limpio; todo tiene pátina, óxido,
   ceniza, grietas. El brillo existe, pero es brillo sobre ruina.

## 2. Paleta canónica

| Token | Hex | Uso |
|-------|-----|-----|
| `--ink` | `#0B0A10` | Fondo absoluto, la nada del eclipse |
| `--charcoal` | `#16141D` | Paneles base, piedra oscura |
| `--stone` | `#232030` | Superficies elevadas |
| `--ash` | `#8C8696` | Texto secundario, ceniza |
| `--bone` | `#D9D2C5` | Texto principal, pergamino envejecido |
| `--old-gold` | `#B08D3F` | Oro antiguo (acentos nobles) |
| `--silver` | `#A9AEC1` | Plata ennegrecida (bordes, runas) |
| `--ember` | `#C0562D` | Brasa (fuego, ceniza, Imperio) |
| `--void` | `#5E3FA3` | Vacío (Hijos del Vacío, magia prohibida) |
| `--blood` | `#7E1E2B` | Sangre (Señores de la Sangre) |
| `--root` | `#3E5A3A` | Raíz (Bosque Negro) |
| `--corona` | `#C9D4E8` | Luz de corona del eclipse (lo transcendente) |

Reglas: fondo siempre por debajo de `#232030`; el `--corona` se reserva para lo
extraordinario (rangos S+, escena de eclipse); el `--ember` marca calor/peligro.

## 3. Afinidades y lenguaje de efectos

Cada afinidad tiene paleta + forma de partícula + movimiento propios:

| Afinidad | Color | Firma visual |
|----------|-------|--------------|
| Fuego/Ceniza | ember + gris cálido | ascuas que suben, distorsión de calor |
| Sombra/Luna | violeta oscuro + plata | humo que absorbe luz, halo menguante |
| Vacío | void + fuga al negro | partículas que caen hacia dentro, glitch suave |
| Sangre | blood + oro viejo | gotas pesadas, vetas pulsantes |
| Cristal | corona fría | refracciones facetadas, destellos duros |
| Raíz | root + ocre | espirales orgánicas, esporas lentas |
| Luz (Última) | corona cálida | rayos volumétricos, motas ascendentes |
| Tiempo/Eco | plata + cian apagado | fantasmas posteriores (afterimage) |

## 4. La carta: anatomía visual canónica

Tamaño lógico común: **360×504** (5:7). Capas (orden irreversible):

```
┌──────────────────────────┐
│ 6 · Info: nombre, facción, stats, gema de rango  │
│ 5 · Decoraciones superiores (gemas, cadenas, sello) │
│ 4 · MARCO DEL RANGO (siempre encima, interior transparente) │
│ 3 · Efectos internos (aura, runas encendidas)      │
│ 2 · ARTWORK (ilustración independiente del marco)  │
│ 1 · Fondo (textura de rango)                        │
└──────────────────────────┘
```

- El marco jamás tapa la lectura; su ventana interior es 100 % transparente.
- La gema de rango vive en la esquina superior derecha; su talla cambia por familia.
- Las cartas principales tienen animaciones muy más elaboradas (idle, hover, select,
  attack, damage, cast, death, evolve, special, victory).
- Los 17 diseños de marco: **[docs/visual/rangos-visuales.md](docs/visual/rangos-visuales.md)**.

## 5. Identidad visual por familias de rango (resumen)

| Familia | Rangos | Concepto |
|---------|--------|----------|
| Los Sellados | G F C D | Pergamino y piedra burda; tinta, sello de cera |
| Los Despiertos | B BB A AA AAA | Metal trabajado; primeras runas encendidas |
| Los Ascendidos | S SS SSS SSSR | Plata y cristal; luz viva, partículas persistentes |
| Los Ultra | UR URR URRX | Materiales imposibles: vacío sólido, oro líquido, fisuras |
| **XG** | XG | Rompe la composición: el marco no contiene a la carta; flota, respira, distorsiona el espacio |

Detalle completo por rango en el documento enlazado arriba.

## 6. Interfaz: materiales del Códice

- **Paneles:** piedra oscura con borde biselado de 1 px claro + sombra interior.
- **Botones:** placa de metal envejecido; hover = filo iluminado ember/corona.
- **Tipografía:** serifas de sistema (`Georgia, 'Times New Roman', serif`) para títulos
  y texto; jerarquía por tracking, mayúsculas pequeñas y color, no por familias externas
  (offline-first: sin webfonts de red; fuente propia embebida en roadmap M8).
- **Iconografía:** trazo de 1.5 px, esquinas grabadas, rellenos de metal/cristal;
  vocabulario único (`assets/icons/ui/`). Prohibido sustituir por emoji en ningún estado.
- **Motion UI:** transiciones de 160–240 ms con easing «sello» (`cubic-bezier(.2,.9,.25,1)`);
  nada rebota de forma infantil.

## 7. Escenas narrativas ligeras

Sin vídeo. Escena = ilustración por capas + parallax + cámara virtual (pan/zoom
lentos), texto progresivo, retratos con ventana de busto, partículas ambientales
(ceniza, esporas), viñeta y grano leve. Presupuesto: ≤6 capas, ≤2 imágenes grandes
por escena, transición < 400 ms. Especificación: GDD cap. 9 y `SceneEngine`.

## 8. Animación y VFX (principios)

- **Anticipación–acción–resaca** en todo ataque/evolución; la cámara nunca se mueve sin causa.
- Evolución cinematográfica (10 beats, Mega §50): oscurecer → ilustración → marco se
  quiebra → fragmentos flotan → energía → recuerdos → nuevo rango → nuevo marco →
  nueva ilustración → ensamblaje final.
- Las evoluciones NO comparten plantilla exacta entre protagonistas: cada Portador
  tiene firma de partículas propia.
- Post-proceso moderado: bloom solo en emisores; aberración cromática solo en XG/Vacío
  y durante ≤300 ms.

## 9. Responsive y Android (Mobile First)

- Breakpoints de diseño: 320 / 360 / 375 / 390 / 412 / 430 / 768 / 1024 / desktop.
- La carta escala por ancho disponible manteniendo 5:7; rejilla de colección 2→6 columnas.
- Zonas táctiles ≥44 px; gestos con pulgar en tercio inferior; HUD nunca bajo la
  barra de gestos (safe-area).
- Rendimiento: DPR máx 2, atlas + pooling, lazy-loading de artwork, tiers de
  resolución por dispositivo (`render/`), descarga de assets no usados.
- Suspensión/reanudación: loop pausado + autosave al ocultarse; restauración < 500 ms.

## 10. Audio-visual sincronizado

Cada familia de rango tiene firma sonora (GDD cap. 12): el *sellado* de una carta G
suena a piedra y cera; el *despliegue* de una URRX introduce coro grave + reverberación
de catedral. La música de evolución es única por protagonista y se reconstruye por
capas (la forma G suena a motivo desnudo; XG, a orquesta completa + coro).

## 11. Lo que NO hacemos (anti-referencias)

No anime; no chibi; no neón vaporwave; no UI móvil genérica blanca/azul; no emoji;
no iconos de stock; no tipografía sans geométrica para texto diegético; no fondos
limpios y planos. Si parece «otoño de un imperio», vamos bien.
