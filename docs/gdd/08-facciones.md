# Capítulo GDD-08 — Facciones y reputación

## 1. Modelo de facción (data-driven)

Cada facción define (Mega §23): cultura, arquitectura, armaduras, armas, colores
propios, filosofía, enemigos, aliados, cartas exclusivas, personajes, historia.
Esquema JSON: `content/factions/factions.json` (puede crecer por packs).

```jsonc
{ "id": "fact/ash-empire", "name": "El Imperio de Ceniza",
  "palette": ["#C0562D", "#3A3230"], "philosophy": "…",
  "relations": { "fact/eclipse-church": -2, "fact/root-keepers": 1 },
  "exclusiveCards": ["card/…"], "heraldry": "espiral de ascuas" }
```

## 2. Facciones canónicas v1 (9)

| Facción | Filosofía | Territorio | Notas |
|---------|-----------|------------|-------|
| El Imperio de Ceniza | El orden se hereda; la ceniza recuerda al legítimo | Cuencas de Ceniza | legalistas, exhaustos |
| La Iglesia del Eclipse | El eclipse fue una misericordia; no se reza, se agradece | Colinas del Voto | custodia los archivos de la firma |
| Los Hijos del Vacío | Lo profundo es la única verdad que no miente | El norte carcomido | pescadores del abismo |
| El Reino de Cristal | La belleza debe sobrevivir, aunque sea bajo el mar | Reino Hundido | memoria en vidrio |
| Los Guardianes de la Raíz | El bosque decide; nosotros escoltamos su decisión | El Umbrío | pactan con pueblos «elegidos» |
| Los Señores de la Sangre | Todo poder tiene precio; mejor conocerlo | cárteles occidentales | bancos de sangre-linaje |
| La Orden de la Última Luz | Mientras un juramento respire, el mundo no ha acabado | itinerante | caballería mendicante |
| Los Errantes | No pertenecer es la única forma de ser libre bajo el eclipse | todas partes | red de mensajeros y contrabando |
| La Corte Silente | La muerte es un umbral con aduana | necrópolis del este | cobran tributo al paso |

El set es ampliable por diseño (Mega §23: «no limitarse»).

## 3. Reputación

- Escala −3 (caza) … +3 (juramentado) por facción, en `factionReputation`.
- Efectos: precios, cartas exclusivas, rutas abiertas/cerradas, diálogos, eventos,
  ayudas en combate (escoltas), y candidatos del NarrativeDirector.
- Reputación **regional** + **global**: ser héroe en el Umbrío no limpia tu nombre
  en las Cuencas.

## 4. Guerra y campos de batalla

- Estados de guerra por pares de facciones (fría/latente/abierta), modificados por
  eventos y cicatrices del jugador.
- En guerra abierta, los nodos «Campo de batalla» ofrecen misiones de frente con
  recompensas de facción; el resultado puede generar World Scars.

## 5. Identidad visual de facción

- Heráldica (símbolo), armaduras y armas por facción componen variantes del
  WeaponGenerator/CardFrames: el mismo «mandoble» es de campana rota para la Orden
  y de vidrio funerario para el Reino Hundido.
- Paleta oficial por facción aplicada a bordes de UI contextuales (mapa, diálogos).

## 6. Los Once y las facciones

Los protagonistas no elegidos se adscriben a facciones como agentes vivos del mundo
(cap. 02 §1): su avance de agenda altera reputaciones y abre eventos en los que el
jugador no es protagonista — el mundo no espera al cronista.
