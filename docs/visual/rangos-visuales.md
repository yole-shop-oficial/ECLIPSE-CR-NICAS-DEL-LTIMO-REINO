# Identidad visual de los 17 rangos (canon v1)

Regla canónica: cada rango tiene identidad propia — **no solo color** (Mega §7).
Material, ornamentación, símbolos, tipografía, iluminación, partículas, animación,
sonido, bordes, profundidad y decoración evolucionan. Tamaño lógico común 360×504.
Estos parámetros son datos (`content/ranks.json`) consumidos por FramePainter.

| Rango | Concepto | Material del marco | Ornamentación | Luz/Partículas | Gema/Símbolo | Sonido de sello |
|-------|----------|--------------------|---------------|----------------|--------------|------------------|
| **G** | El comienzo humilde; una página arrancada | pergamino tosco + cantos de piedra burda | filete simple, esquinas rectas | sin emisión; polvo | sello de cera gris «G» | papel + piedra seca |
| **F** | Página conservada por alguien que la quiso | pergamino + cuero gastado | doble filete, una muesca por esquina | mota de polvo ocasional | cera marrón «F» | papel + cuero |
| **C** | Herramienta común del mundo | madera oscura + hierro | clavos de hierro, chaflanes | vaho cálido tenue | hierro grabado «C» | madera golpeada |
| **D** | Objeto de oficio con historia | bronce pátina + madera | remaches, ola baja en cantos | brillo especular leve | bronce «D» | bronce ahogado |
| **B** | Poder reconocible por primera vez | hierro bruñido + filete de oro viejo | guarda calada en esquinas | runas apagadas que se encienden al hover | ónice «B» | metal tensionado |
| **BB** | El oficio vuelto virtud | acero + oro viejo | doble guarda, primera cadena viva | runa central encendida | ónice biselado «BB» | metal + tintineo |
| **A** | Cosa de nobles | plata ennegrecida | filigrana lateral, corona baja | hilos de luz fría recorren el canto | amatista «A» | plata limpia |
| **AA** | Herencia de linaje | plata + esmalte hundido | filigrana completa + medallón | hilos de luz + 3 partículas orbitando | amatista tallada «AA» | plata + corista lejana |
| **AAA** | Reliquia menor | platino veteado | medallón + querubines erodidos | halo interior respirando | zafiro hundido «AAA» | voz de catedral (1ª) |
| **S** | Leyenda que camina | cristal ahumado sobre platino | bordes facetados vivos | luz ambiental del escenario reacciona | cristal «S» | campana contenida |
| **SS** | Leyenda con nombre | cristal pulido | facetas dinámicas (luz corre) | estela de partículas fina | cristal estrella «SS» | campana + coro mínimo |
| **SSS** | Reliquia mayor | platino + corona pálida | aro de runas exteriores | runas exteriores girando (2 rpm) | corona pálida «SSS» | coro + metal líquido |
| **SSSR** | Lo que los archivos sellan | piedra imposible (basalto con oro líquido en grietas) | grietas iluminadas | goteo de oro líquido en esquinas | núcleo fundido «SSSR» | basalto resquebrajado |
| **UR** | Objeto-imposible | vacío sólido (absorbe borde a borde) | sin ornamento: la ausencia decora | el fondo de la carta se curva hacia dentro | pupila «UR» | succión grave |
| **URR** | Ultra-real | vacío + plata flotando en suspensión | fragmentos de plata levitando | fragmentos orbitan y chocan sin sonido | pupila plateada «URR» | silencio + subgrave |
| **URRX** | Lo que no debería existir pero existe | vacío + oro líquido distorsionado | el marco se replica 0,5 mm desfasado (eco) | aberración cromática leve en cantos | pupila dorada «URRX» | subgrave + campana partida |
| **XG** | **Fuera de la escalera** | nada material: tinta que flota sobre la carta | el marco no contiene la ilustración; esta «respira» fuera de los bordes 2–3 px | distorsión de espacio, polvo que cae hacia arriba | eclipse «XG» (corona pálida total) | el mundo se calla 1,2 s |

## Notas de implementación

- **Animación base por familia:** Sellados (estáticos + polvo), Despiertos (runas al
  hover), Ascendidos (partículas persistentes + halo), Ultra (órbita/levitación),
  XG (respiración + desborde + silencio).
- **Tipografía de gema:** la marca del rango es un grabado, no texto suelto; talla de
  gema por familia: disco (Sellados) → bisel (Despiertos) → facetas (Ascendidos) →
  pupila (Ultra) → eclipse (XG).
- **Presupuesto:** partículas por carta ≤ 12 (móvil), bloom solo en emisores
  (grietas, pupila, corona); UR/URR/URRX/XG reservan aberración cromática ≤300 ms.
- Estas firmas se extienden a la **Gema de rango** en UI (lista, mazo, combate) y al
  **sello sonoro** de la capa `Rank` del AudioEngine (GDD cap. 12 §4).
