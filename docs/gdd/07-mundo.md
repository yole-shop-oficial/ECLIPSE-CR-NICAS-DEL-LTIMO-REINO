# Capítulo GDD-07 — Mundo, regiones, mazmorras y jefes

## 1. Estructura jerárquica (canónica)

```
Continentes → Regiones → Ciudades → Mazmorras → Ruinas → Santuarios
            → Campos de batalla → Dimensiones especiales
```

- El mapa se expande mediante contenido (packs); no todo está disponible al inicio.
- Modelo de datos: grafo de nodos (`world/nodes.json` por pack) con requisitos de
  desbloqueo (rank, cicatrices, reliquias).

## 2. Continente inicial: Vharzia

«El continente que se arrodilló demasiado tarde.» Regiones de apertura (canon v1):

| Región | Identidad | Facción dominante | Amenaza |
|--------|-----------|-------------------|---------|
| Las Cuencas de Ceniza | llanuras grises donde llueve ascua | Imperio de Ceniza | sequía de ascuas |
| El Umbrío | bosque negro que se desplaza | Guardianes de la Raíz | el bosque «elige» pueblos |
| El Reino Hundido | ciudades de cristal bajo el mar de sal | Reino de Cristal | mareas huecas |
| Las Colinas del Voto | ermitas y campos de campanas rotas | Iglesia del Eclipse | procesiones sin fin |
| El Vertedero de Coronas | ruinas de la capital imperial | disputada | fantasmas de la firma |

## 3. Tipos de nodos

- **Ciudad:** servicios (forja, mercader, capilla de ecos), facción, rumores.
- **Mazmorra:** gauntlet de salas con modificadores + jefe de mazmorra.
- **Ruina:** exploración de eventos y fragmentos (alto secretismo).
- **Santuario:** descanso, diálogos de Portador, evolución y guardado ritual.
- **Campo de batalla:** guerra de facciones (estado cambia con cicatrices).
- **Dimensión especial:** reglas alteradas (cuna de capacidades XG, eventos raros).

## 4. Exploración (loop)

```
viajar por nodos → EventEngine tira evento (semilla del viaje)
→ resolver (diálogo/combate/decisión/tesoro) → consecuencias
→ el NarrativeDirector reordena ofertas según estado del mundo
```

- Viajes con «memoria de ruta»: repetir camino con cicatrices genera eventos
  distintos (la ruta recuerda).
- Los nodos desconocidos se muestran como «páginas rasgadas» en el mapa.

## 5. Mazmorras

- Generación por plantillas + semilla: salas (combate, trampa narrativa, altar,
  tesoro, eco), grafo de 6–12 salas, jefe final.
- Modificadores de sala (datos): oscuridad (visión reducida), marea hueca, ceniza
  espesa (curación reducida)…
- Persistencia offline: el estado de mazmorra cabe en el save; continuar sin red.

## 6. Jefes

- Catálogo por región + jefes de saga + jefes errantes (aparecen por Director).
- Diseño: fases, almas reactivas (cap. 06 §8), arena con identidad visual, tema
  musical propio, recompensa de evolución o reliquia.
- Los jefes caídos entran en la Boss Collection con variantes prefijadas.

## 7. Cicatrices del mundo (World Scars)

Las grandes decisiones reescriben el mapa: ciudad destruida ↔ ruta bloqueada ↔
facción desaparecida ↔ jefe aliado. Se materializan visualmente (el nodo cambia de
arte/estado) y el Director las usa como contexto permanente. Cap. 09 §6.

## 8. Expansión del mundo

- Nuevas regiones/continentes/dimensiones = nuevos packs de nodos + facciones +
  eventos; el WorldEngine los injerta al grafo sin tocar el núcleo.
- Canon: el mundo no tiene borde final; «el Códice aún tiene páginas en blanco».
