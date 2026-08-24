# Especificación — Renderizado 2D

## 1. Backends

`RenderEngine` elige backend por capacidad (`core/platform.js`):
- **canvas2d** (base, actual — ADR-002): composición de cartas, escenas y UI de
  escena. Suficiente para M1–M4 en gama media.
- **webgl2** (M2+ condicionado): partículas masivas, iluminación dinámica,
  post-proceso (bloom selectivo). Misma API de escena: el contenido no cambia.

## 2. Composición de carta (canónica)

Orden irreversible: `fondo → artwork → efectos internos → marco → decoraciones → info`.
- Lienzo lógico 360×504; raster a `min(DPR,2) × escalaUI`.
- El marco nunca se funde con el artwork; ventana interior alfa=0.
- `CardComposer` pinta a un canvas propio (por carta) y cachea por
  `cardId@rank@paletteVersion`; invalidación explícita al evolucionar.

## 3. FramePainter (procedural)

Identidad por rango desde `ranks.json` (material, ornament, glow, particles, gem,
palette). Técnicas: gradientes metálicos, bisel por doble trazo, runas por arcos de
trazo (geometría de la fuerza primordial — GDD cap. 01 §4), ruido de pátina por
seed de carta. Futuro: `ImageFrameRenderer` (atlas `/assets/cards/frames/<R>/`)
implementando la misma interfaz `renderFrame(ctx, rankData, geom)`.

## 4. Escenas (M2+)

- Cámara virtual 2D: posición, zoom, *dolly* para parallax por capa (`depth` 0–1).
- Layer compositing: fondo / mid / frente / fx / post. Presupuesto: ≤6 capas.
- Particles: pooling fijo (256 partículas activas máximo en móvil); perfiles por
  afinidad (shape, paleta, kinematics) declarados en datos.
- Lighting 2D: mapa de luz aditivo en offscreen (radial por emisor), «multiply»
  global oscuro + emisores por `screen`. Antorchas, runas, auras de rango (§28 Mega).

## 5. Pipeline de assets

- Formatos: WebP (fallback PNG), AVIF cuando sea estable en objetivo; audio OGG/Opus.
- Atlas: `tools/` (M8) genera spritesheets + JSON de recortes; hoy assets sueltos.
- Tiers de resolución: `1x` (≤400 px ancho), `2x`. Lazy loading + `unload` de lo no
  visible (collection scroller virtualizado).
- Presupuestos: app-shell <1,5 MB; escena ≤2 imágenes grandes; textura ≤2048²;
  60 fps objetivo / 30 fps piso en 320 px.

## 6. Workers y OffscreenCanvas

- `OffscreenCanvas` para pre-composición de cartas pesadas (colección) cuando la
  plataforma lo soporte (Platform lo detecta); fallback síncrono.
- Web Workers (M3+): generación masiva de botín/armas y empaquetado de atlas;
  mensajería por tipos, sin estado compartido.

## 7. Accesibilidad visual y seguridad de fotos

- Sin destellos >3 Hz; modo «reducir destellos» en ajustes (desactiva bloom y
  aberración, reduce partículas 50 %).
- Contraste de texto ≥ 4,5:1 sobre cualquier material de fondo.

## 8. Testing visual

- Golden renders (M8): snapshot de `CardComposer` por rango con seed fija,
  comparado en CI por umbral de distancia. Hoy: tests unitarios de geometría y
  paleta (no del píxel).
