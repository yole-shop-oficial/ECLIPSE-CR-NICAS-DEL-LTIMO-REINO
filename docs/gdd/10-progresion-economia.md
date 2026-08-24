# Capítulo GDD-10 — Progresión, economía y expansiones

## 1. Ejes de progresión (todos offline)

1. **Protagonista:** rangos G→XG con requisitos combinados (cap. 03 §4).
2. **Mazos y cartas:** subir cartas normales hasta base+3; builds por afinidad.
3. **Colecciones:** las 8 colecciones con hitos cosméticos/narrativos (cap. 04 §5).
4. **Arsenal:** forja y reforjado de armas; armas vinculadas de los Doce.
5. **Mundo:** nodos desbloqueados, reputación, cicatrices.
6. **Cronista (meta):** títulos, sellos del Códice, plantillas cosméticas de marco.

## 2. Economía interna (sin dinero real)

| Recurso | Origen | Uso |
|---------|--------|-----|
| Esquirlas de forma | fundir cartas repetidas | evolución de cartas |
| Esencia de rango | jefes, mazmorras, eventos raros | evolución, forja de alto rango |
| Componentes | desmonte, botín | forja de armas/objetos |
| Fragmentos de memoria | combate, exploración, secretos | recuerdos, requisitos narrativos |
| Ceniza corriente | economía común | servicios de ciudad, mercaderes |
| Tributo | Corte Silente, eventos umbral | reactivaciones, pactos |

Anti-inflación: costes de evolución de familia superior crecen de forma no lineal y
siempre incluyen un requisito no monetizable (pruebas, memorias, decisiones).

## 3. Ritmo y anti-grind

- El combate da experiencia por *hazaña* (primera vez, sin bajas, combos) más que
  por repetición: moler el mismo evento rinde menos (curva decadente).
- Las preguntas abiertas guían: el Códice sugiere 3 «pistas» siempre accionables.
- Sesión respetuosa: cualquier progreso se guarda al instante; pensado para
  sesiones móviles de 5–20 min y maratones.

## 4. Progresión infinita (diseño)

- El *techo* del protagonista es XG, pero el *ancho* es infinito: builds de ecos,
  colecciones, facciones, armas procedurales, jefes variantes, eventos combinados.
- Contenido procedural con semilla + NarrativeDirector = partidas no repetibles.
- **Temporadas**: nuevas sagas y sets de contenido (packs); el mundo viejo sigue vivo.

## 5. Expansiones (modelo de crecimiento)

- Un pack = `content/<pack>/`: nodos de mundo, facciones, cartas, eventos, escenas,
  diálogos, armas vinculadas, jefes, música. Instalación = registrar el pack
  (ContentRegistry); **cero cambios de núcleo** (ADR-004 / ARCHITECTURE §6).
- Versionado de packs: dependencias declaradas; el juego avisa si falta base.
- Nunca se retira contenido: saldos narrativos hacia adelante (cicatrices referidas).

## 6. Recompensas de colección (sin pay-to-win)

Títulos del Cronista, fornituras cosméticas de marco, páginas de lore, ecos
narrativos, temas de ambiente desbloqueables. El poder directo solo procede de
jugar (sistema, no de completismo).
