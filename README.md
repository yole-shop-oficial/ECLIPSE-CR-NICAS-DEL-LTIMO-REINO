# ECLIPSE: CRÓNICAS DEL ÚLTIMO REINO
### THE ETERNAL CODEX

Videojuego 2D de fantasía oscura — **TCG estratégico + RPG narrativo + colección** —
construido como PWA **offline-first** instalable en Android, con multijugador LAN
Wi-Fi sin Internet y un universo diseñado para crecer indefinidamente.

> «No construimos una colección de cartas. Construimos un universo.»

## Documentación (empieza aquí)

| Documento | Contenido |
|-----------|-----------|
| [Mega promts](Mega%20promts) | Visión canónica del proyecto (fuente de verdad) |
| [GDD.md](GDD.md) | Game Design Document maestro + capítulos en `docs/gdd/` |
| [VISUAL_GDD.md](VISUAL_GDD.md) | Dirección de arte + identidad de rangos |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Arquitectura técnica + `docs/arch/` |
| [ROADMAP.md](ROADMAP.md) | Plan incremental por hitos |
| [CHANGELOG.md](CHANGELOG.md) | Cambios y decisiones (ADR) |

## Ejecutar en desarrollo

Requisito: Node 18+ (sin dependencias externas).

```bash
npm run dev        # servidor estático en http://localhost:8000 (0.0.0.0)
npm test           # pruebas de lógica: rangos, evolución, armas, contenido
```

Abrir `http://localhost:8000`. En Android: servir en la red local e instalar como
PWA (menú del navegador → «Añadir a pantalla de inicio»). El Service Worker deja el
juego 100 % jugable offline tras la primera visita.

## Despliegue (Vercel / estático)

El juego es un sitio estático desde la raíz: **no necesita build**. En Vercel:
Framework **«Other»**, Build Command *vacío*, Output Directory `/` (raíz).
`vercel.json` ya lo fija (cabeceras correctas para `sw.js`, `manifest.webmanifest`
y cachés). Solo hay que asegurarse de desplegar la rama con el juego (la rama de
desarrollo o `main` tras mergear el PR), nunca una rama que solo tenga el Mega Prompt.

## Estructura

```
src/core      núcleo (kernel, loop, eventos, RNG, plataforma)
src/data      ContentRegistry + validación de esquemas
src/game      dominio: rangos, evolución, cartas, armas, combate, historia…
src/render    RenderEngine, partículas, animación, iluminación (hitos M2+)
src/ui        UIEngine, pantallas y componentes del Códice (DOM)
src/storage   IndexedDB + SaveEngine
src/offline   Service Worker / app-shell
src/net       LAN (M6) y Sync (M7) — contratos en docs/arch/lan-sync.md
src/security  AES-GCM y validación
content/      DATOS del juego (JSON): rangos, protagonistas, facciones, armas…
assets/       imágenes, audio, iconos originales
tests/        pruebas de lógica pura (node --test)
tools/        dev-server y pipelines
docs/         GDD por capítulos, guías visuales y specs de arquitectura
```

## Reglas del taller

1. **Ningún archivo supera 200 líneas** (código y documentos). Dividir al crecer.
2. Data-driven: el contenido vive en `/content` como JSON validado; el núcleo no
   cambia al añadir cartas, armas, regiones o capítulos.
3. Determinismo por semilla: se guarda la semilla, no el resultado.
4. Sin frameworks pesados, sin dependencias innecesarias, sin variables globales.
5. Offline first: nada esencial puede requerir Internet.
6. Sin emojis dentro del juego; iconografía propia.
7. Toda decisión actualiza GDD/ARQUITECTURA/CHANGELOG.
