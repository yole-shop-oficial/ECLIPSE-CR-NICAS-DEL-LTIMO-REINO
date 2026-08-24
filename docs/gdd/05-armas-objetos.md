# Capítulo GDD-05 — Armas, objetos y Relicario

## 1. Filosofía

El juego contiene **miles de armas** sin miles de imágenes. Toda arma es una
**receta de componentes** generada con semilla determinista: se guarda la semilla,
no el resultado (ADR-004). El mismo principio sirve para objetos, reliquias,
armaduras y futuros contenidos.

## 2. Modelo de arma por componentes

```
Tipo + Base + Material + Núcleo + Runas + Efecto + Rareza + Historia + Afinidad
   + Modificador + Nombre generado
```

Ejemplo canónico (Mega §11):
`Espada + Obsidiana + Núcleo lunar + Runa del vacío + Sangrado + UR`
→ **«Espada de la Luna Vacía»**
`Lanza + Hueso de dragón + Núcleo solar + Runa de condena + Quemadura + SSSR`
→ **«Lanza del Dragón que Arde»**

Cada componente cambia estadísticas, apariencia y comportamiento:

| Componente | Afecta a |
|------------|----------|
| Tipo (espada, lanza, arco, guadaña, bastón, martillo, daga, hacha, escudo, grimorio, catalizador, anillo, amuleto, reliquia, artefacto, armadura) | stats base, estilo de ataque, huecos |
| Material (obsidiana, hueso de dragón, plata ennegrecida, cristal del Reino…) | daño, peso, paleta visual, lore |
| Núcleo (lunar, solar, de raíz, hueco…) | afinidad activa, emisión (glow) |
| Runas (vacío, condena, tributo, eco…) | efectos de golpeo, runas visibles |
| Afinidad | sinergias con Portador y facción |
| Modificador / Efecto | pasivas, estados (sangrado, quemadura…) |
| Rango | techo de estadística + perfil de partículas |

## 3. Generación y nombres

- `WeaponGenerator.generate({ seed, constraints })` (tests en `tests/weapons.test.mjs`).
- Restricciones contextuales: botín, forja del jugador, armas vinculadas a lore.
- El nombre se compone con gramática castellana (género del sustantivo, epíteto por
  núcleo+runa): módulo `game/weapons/names.js`. Ej.: «Arco de la Vigilia Hueca».
- Armas **vinculadas** (las 12 armas dispersas de los Portadores) son piezas únicas
  declaradas en datos, no generadas: su hallazgo es evento narrativo.

## 4. Sistema visual modular (WeaponView)

Apariencia por piezas reutilizables (Mega §13):

```
Blade + Hilt + Guard + Gem + Rune + Glow + Particle Profile
```

- Biblioteca de piezas: `assets/weapons/blade/`, `/hilt/`, `/guard/`, `/gem/`, `/rune/`.
- Un arma UR no es «la misma hoja dorada»: el material cambia de verdad (gradientes,
  vetas, vetillas de luz), la gema adopta talla propia del rango y el
  `glowProfile` introduce emisión y partículas acordes a la familia de rango.
- Mismo motor para anillos, amuletos, grimorios y armaduras (piezas homólogas).

## 5. Generador procedural de objetos (ItemEngine)

Campos de todo objeto (Mega §12): ID único, tipo, subtipo, material, nivel, rango,
calidad, modificadores, efectos, afinidades, lore, valor, apariencia, receta,
procedencia e historia opcional.

- Objetos consumibles, materiales de forja, llaves de mazmorra, ofrendas de facción.
- Lore procedente: el generador cita procedencia («recuperado en la Sala de los
  Mapas Quemados») para sostener el principio «un objeto tiene historia».

## 6. Forja y economía de componentes

- La forja consume: plantilla (tipo), materiales, núcleo, runa y esencia de rango.
- Desmontar devuelve componentes (con pérdida) — nunca basura.
- Las armas tienen **huecos evolutivos**: reforjado (+1..+3) dentro de su rango, sin
  violar la regla de que el *rango* lo define la receta, no la mejora.

## 7. Relicario (Reliquary, Mega §19)

Colección de artefactos históricos que **no se equipan** como cartas:

```
Fragmento A + Fragmento B + Fragmento C → Reliquia perdida
```

- Cada reliquia desbloquea páginas de historia mundial (Lore Collection) y algunas
  abren requisitos de evolución (cap. 03 §4) o rutas del mundo.
- Los fragmentos proceden de: mazmorras, eventos raros, jefes, decisiones y
  intercambio LAN (M6).
- Estética: el Relicario es una sala del Códice con pedestales; completar una
  reliquia enciende su vitrina (luz + partículas + sonido de sello).

## 8. Escalabilidad

- Índices por tipo/material/rango/afinidad; render por lista virtualizada.
- Sprites modulares en atlas generado por pipeline (M8) con tiers de resolución.
- Presupuesto: generación de un arma < 0,2 ms (puro, sin DOM) para botines masivos.
