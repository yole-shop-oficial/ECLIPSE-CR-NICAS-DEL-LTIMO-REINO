# Capítulo GDD-04 — Cartas y colección

## 1. Anatomía de una carta (canónica)

Una carta **no es una imagen**: es una composición por capas (Mega §8):

```
fondo → ARTWORK → efectos internos → FRAME → decoraciones → info
```

- **ARTWORK:** independiente del marco; PNG/WebP con transparencia cuando proceda, o
  arte procedural (SigilPainter como placeholder original).
- **FRAME:** siempre por encima del arte, interior 100 % transparente, tamaño lógico
  común 360×504, biblioteca por rango (`/assets/cards/frames/<RANGO>/` cuando se
  use atlas; hoy FramePainter procedural).
- **CARD DATA:** definición JSON (id, type, rank, faction, stats, abilities,
  evolution, rarity, animationProfile).
- El CardComposer monta artwork + frame + efectos de rango + stats + texto +
  partículas + animación ⇒ miles/millones de combinaciones sin imágenes completas.

## 2. Tipos de carta

| Tipo | Rol | Evolución |
|------|-----|-----------|
| `protagonist` | Los 12; identidad completa | G→XG (único) |
| `normal` | Criaturas, aliados, hechizos, sitios | base+3 máx. |
| `boss` | Jefes como carta-jugable rarísima (post victoria) | base+3 |
| `echo` | Instantáneas de formas (Echo System) | no evoluciona |
| `secret` | Cartas ocultas: no aparecen en índices ni se anuncian | según carta |

Subtipos de `normal`: criatura · aliado · conjuro · ritual · sitio · maldición · reliquia-menor.

## 3. Card Soul (identidad interna, Mega §22)

Las cartas importantes no son «Ataque 100 / Defensa 80». Tienen:

- `personality`, `desire`, `fear`, `history`, `bonds[]` (relaciones con otras cartas),
  `memories[]`, `conflict`.
- Reacciones narrativas: dos cartas vínculadas en el mismo campo disparan diálogos o
  sinergias (ej.: Morwen + Okhaz; cap. 02 §4). El NarrativeDirector puede priorizar
  escenas cuando el alma de dos cartas choca.
- Card Soul también alimenta la Colección de Personajes y el Códice (lore).

## 4. Datos de carta (resumen de esquema)

```jsonc
{
  "id": "card/ash-sentinel",        // id estable
  "type": "normal",                  // ver tabla
  "subtype": "creature",
  "baseRank": "B",                   // rango de adquisición
  "faction": "fact/ash-empire",
  "affinities": ["ash"],
  "stats": { "atk": 12, "def": 9, "ene": 3 },
  "abilities": ["ab/ember-guard"],
  "evolutionPath": "evp/ash-sentinel",  // formas declaradas en datos
  "art": "art/ash-sentinel",         // referencia a artwork
  "soul": { "desire": "...", "fear": "..." },
  "lore": "…"
}
```

Esquema completo y validación: [../arch/data-schemas.md](../arch/data-schemas.md).
Las **instancias** guardadas del jugador solo guardan: `cardId, rankActual, ecos,
vínculos, semillaVisual`.

## 5. Las 8 colecciones (progreso independiente)

| Colección | Contenido | Métrica |
|-----------|-----------|---------|
| Card Collection | todas las cartas obtenidas | % por región/familia |
| Weapon Collection | armas descubiertas/forjadas (por arquetipo visual) | % arquetipos |
| Relic Collection | reliquias montadas por fragmentos | n/m reliquias |
| Character Collection | almas conocidas (Card Soul revelado) | % fichas |
| Memory Collection | fragmentos de memoria reunidos | n/200 por Portador |
| Lore Collection | entradas del Códice desbloqueadas | % páginas |
| Boss Collection | jefes caídos (con variantes) | n/regionales |
| Discovery Collection | lugares, secretos, eventos raros vividos | % por región |

Cada colección tiene pantalla propia (Códice), filtros y recompensas de completado
(nunca poder directo: títulos, marcos cosméticos, páginas de lore, ecos).

## 6. Obtención (offline-first)

- Exploración y eventos (EventEngine con semilla).
- Recompensas de historia y decisiones.
- Forja de cartas menores por componentes (misma filosofía que armas).
- Intercambio LAN local (M6, opcional de sala, validado por host).
- **No hay tienda con dinero real.** La economía es interna (cap. 10).

## 7. Límites y sostén del sistema

- El motor nunca asume «pocas cartas»: índices por facción/afinidad/rango para
  scroll virtualizado con miles de entradas.
- Cartas repetidas se funden en **esquirlas de forma** (recurso de evolución),
  nunca se descartan sin valor.
- Las cartas secretas no contabilizan pistas en % hasta ser descubiertas.
