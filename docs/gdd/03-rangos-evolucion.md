# Capítulo GDD-03 — Rangos, evolución y Ecos

## 1. Escalera oficial (17 rangos)

```
G → F → C → D → B → BB → A → AA → AAA → S → SS → SSS → SSSR → UR → URR → URRX → XG
```

| Familia | Rangos | Idea |
|---------|--------|------|
| Sellados | G F C D | Lo común; lo que el mundo aún permite sin miedo |
| Despiertos | B BB A AA AAA | Poder reconocible; los reinos empiezan a mirar |
| Ascendidos | S SS SSS SSSR | Leyendas andantes; alteran geopolítica |
| Ultra | UR URR URRX | Objetos-entidad; los archivos los llaman «imposibles» |
| XG | XG | Fuera de la escalera; rompe sistemas (Mega §31) |

La escalera es datos (`content/ranks.json`, validada por RankService). Nunca se
hardcodea el orden «mayor que»: se calcula por índice.

## 2. Identidad visual y sonora por rango

Cada rango modifica: diseño de marco, material visual, ornamentación, símbolos,
tipografía, iluminación, partículas, animación, sonido, bordes, profundidad,
decoración y efectos mágicos. **No se cambia solo el color.**
Especificación completa: [../visual/rangos-visuales.md](../visual/rangos-visuales.md).
Una carta URRX produce presencia visual superior a una G mediante bloom, glow,
partículas, distorsión, luz ambiental y aura — no mediante «mismo marco más azul».

## 3. Reglas de evolución (canónicas)

1. **Protagonistas:** pueden evolucionar de G a XG, un rango por etapa, cumpliendo
   requisitos combinados (§4).
2. **Cartas normales:** límite = **rango base + 3** (B→BB,A,AA; SSSR→UR,URR,URRX),
   con **techo absoluto URRX**: aunque una carta base UR/URR sumara matemáticamente
   hasta XG, XG es exclusivo de los Portadores. Canon v1.
3. La regla vive en `EvolutionEngine.canEvolve(card, targetRank)`; la UI solo
   *consulta*. Pruebas: `tests/evolution.test.mjs`.
4. No existe evolución infinita para todas las cartas; los protagonistas son la
   excepción por canon, no por permiso global.
5. XG solo es alcanzable por Portadores y siempre mediante **rito narrativo** (§5).

## 4. Requisitos de evolución (protagonista)

Recursos y pruebas combinables, nunca «nivel 10 = evolución»:

| Tipo | Ejemplos |
|------|----------|
| Experiencia | afinidad alcanzada en combate (no nivel plano) |
| Fragmentos | fragmentos de forma / de memoria |
| Memorias | Memory Fragments concretos desbloqueados |
| Materiales | componentes de forja vinculados a la afinidad |
| Pruebas | hazañas: derrotar a un jefe, sobrevivir a un evento |
| Reliquias | reliquias concretas del Relicario |
| Armas | poseer/vencer con un arma vinculada |
| Ecos | ecos previos activos (§7) |
| Decisiones | una World Scar o elección narrativa específica |

**Ejemplo canónico (SSS → SSSR):** derrotar a *La Primera Mártir* + descubrir el
recuerdo «La noche de la firma» + poseer la reliquia *Corona de Cera* + haber elegido
«perdonar» en la cicatriz de Vharzia. Cada salto de familia exige al menos una
prueba narrativa.

## 5. Evolución como transformación real

Cada evolución puede cambiar (Mega §5): arte, marco, animación, habilidades,
estadísticas, efectos, historia, descripción, apariencia del personaje, arma,
efectos visuales, sonido, animación de entrada, de ataque y de evolución.
El sistema soporta nuevas formas declaradas en datos (`evolutionPath` por carta),
con desbloqueo de habilidades estadísticas artwork marcos animaciones armas y lore.

## 6. Evolución cinematográfica (10 beats canónicos)

1. La pantalla se oscurece. 2. Aparece la ilustración actual. 3. El marco actual
comienza a romperse. 4. Los fragmentos flotan. 5. La carta libera energía. 6.
Aparecen recuerdos (memorias del Portador). 7. El nuevo rango aparece. 8. Se genera
el nuevo marco. 9. La ilustración cambia. 10. La carta termina de ensamblarse y el
jugador recibe la nueva forma.
Producción: driven por AnimationEngine (timeline) + AudioEngine (secuencia única por
Portador; GDD cap. 12 §4). Duración objetivo 8–12 s, omitible tras primera vista.

## 7. Echo System

El protagonista **conserva ecos** de sus formas anteriores; evolucionar no borra el
pasado.

- Un Eco = instantánea de una forma (arte, voz, habilidad, timbre de partículas).
- Los ecos desbloquean: habilidades heredadas, pasivas, diálogos, animaciones,
  formas alternativas (visual), bonificaciones y secretos narrativos.
- **Carga de ecos:** el jugador activa un subconjunto (3 huecos iniciales); elegir
  qué recuerdos porta su forma actual es una decisión de build.
- Las cartas normales importantes también poseen alma y pueden tener 1 eco.

## 8. XG: el rango que rompe reglas

XG altera sistemas, no solo números. Catálogo permitido (data-driven, por carta XG):

- Cambiar el orden de los turnos. · Modificar reglas del campo.
- Reescribir un efecto ya declarado. · Invocar cartas fuera del mazo.
- Modificar una condición de victoria. · Crear una dimensión de batalla.
- Reactivar una carta destruida. · Alterar una variable narrativa.
- Modificar el estado del mundo (una World Scar de nivel XG).

Implementación (M2+): capacidades declaradas como `ruleOverride` en la carta y
arbitradas por CombatEngine/WorldEngine mediante un bus privilegiado `SYS:`.
XG debe sentirse como algo que el jugador **no debería haber conseguido**.

## 9. Valor estratégico de la regla +3

La limitación +3 convierte el rango base en identidad permanente: una carta base AA
es un pilar de mazos medios; una base S es pieza de élite con techo URRX. Evita
inflación, sostiene la economía y da sentido a cartas «menores» con afinidades o
habilidades únicas que no existe en rangos altos.
