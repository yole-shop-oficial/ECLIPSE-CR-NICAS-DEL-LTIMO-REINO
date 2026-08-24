# Capítulo GDD-06 — Combate

## 1. Intención

Combate **estratégico y espectacular sin volverse 3D**: campo 2D, decisiones por
turno, reacciones encadenadas y lectura clara del plan del rival. La fantasía: «cada
turno es una página que arde».

## 2. Piezas de un combate

| Elemento | Descripción |
|----------|-------------|
| Combatientes | 1 protagonista + hasta 2 aliados- carta en PvE/coop; 1v1 base en PvP |
| Campo | 2 filas (vanguardia/retaguardia) por bando; posición importa (alcance, guardia) |
| Mazo de apoyo | cartas normales del jugador (cap. 04) como acciones/invocaciones |
| Energía | reserva por turno que crece; coste de habilidades y cartas |
| Prioridad | velocidad de acción; decide orden de la pila en empates |

## 3. Estructura del turno

```
1. Alborada    (efectos de inicio, energía += ganancia, robo de eco)
2. Declaración (cada bando declara acciones: ataque, habilidad, carta, mover, guardia)
3. Reacción    (la pila se abre: contrarrestar/interrumpir/encadenar)
4. Resolución  (la Action Stack se resuelve en orden LIFO con prioridad)
5. Resaca      (estados, muertes, triggers, comprobación de victoria)
```

## 4. Action Stack (canónico, Mega §17)

- Toda acción declarada **entra en una pila**; el motor la resuelve.
- Permite: contrarrestar (anula), interrumpir (se cuela antes), reaccionar
  (responde), encadenar (combo si la firma de afinidad coincide), crear combos.
- Reglas: ventana de reacción corta (PvE generosa / PvP fija); máximo N=6 acciones
  abiertas a la vez; cada acción validada por el motor (en LAN, por el host).

## 5. Atributos y daño

- Stats base de carta: `atk` (ataque), `def` (defensa), `ene` (energía-base).
- Daño = fórmula por acción (físico/afinidad) mitigado por `def`, posición y estados.
- Las **afinidades** interaccionan (tabla de resonancia en datos): Vacío erosiona
  defensas de Voto; Raíz se apaga ante Fuego; Eco copia la última resonancia, etc.

## 6. Estados alterados (perfiles reutilizables, EffectEngine)

fuego · hielo · sangre · vacío · luz · sombra · veneno · relámpago · cristal ·
ceniza · energía espiritual. Cada estado: icono propio, VFX paleta afinidad,
reglas de acumulación, curación y sinergia. Nada de emojis: iconos originales.

## 7. XG en combate (ver cap. 03 §8)

Las capacidades XG (`ruleOverride`) se declaran en la carta y se arbitran por bus
privilegiado: orden de turnos, reglas de campo, reescritura de efectos, invocación
extra-mazo, condiciones de victoria, dimensiones, reactivación de destruidas.
En PvP, las capacidades XG quedan limitadas por el **formato de sala** (host decide:
estándar, libre, sin-XG) para sostener el juego limpio.

## 8. Jefes (PvE)

- Jefes con **fases** (2–4): cada fase cambia habilidades, tablero y música.
- «Almas de jefe»: reacciones de Card Soul si llevas cartas vínculadas al jefe.
- Rarezas: variantes con prefijo (Aojado, Coronado, Hambriento) generadas por
  EventEngine sobre jefes base.

## 9. Modos

| Modo | Descripción |
|------|-------------|
| Historia | combates scriptados con escena previa/posterior |
| Exploración | generados por EventEngine (semilla + contexto) |
| Mazmorra | gauntlet con modificadores de sala |
| Duelo PvP (LAN, M6) | host autoritativo, formato de sala |
| Coop PvE (LAN, M6) | 2 jugadores vs jefe con vida compartida escalada |

## 10. Determinismo y validación

- RNG del combate = seed compartida (partida) + contador de tick.
- Toda acción se describe como intención serializable; el motor (o el host LAN) la
  valida contra el estado antes de apilarla. **La UI nunca decide reglas.**
- Logs de pila (últimos K ticks) para depuración y antitrampas.

## 11. Legibilidad visual

- La pila se dibuja como «sello de cera» lateral que crece; cada acción, un
  sello-runa identificable por icono y color de afinidad.
- Números de daño modestos y con gravedad (sin estallidos cómicos), tipografía serif.
- La cámara respira (zoom 1.0→1.04 en clímax) y se ilumina según afinidad dominante.
