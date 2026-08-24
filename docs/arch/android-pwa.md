# Especificación — Android y PWA

## 1. PWA (hoy)

- `manifest.webmanifest`: nombre completo + corto, `display: standalone`,
  `orientation: any`, `theme_color #0B0A10`, iconos originales 192/512 (maskable).
- `sw.js`: caché versionado `eclipse-vX`; precache del app-shell (HTML/CSS/JS/
  contenido base); estrategia cache-first con revalidación en segundo plano para
  `content/`; fallback de navegación a `index.html`.
- Actualizaciones: nuevo SW ⇒ `waiting`; la UI ofrece «Una nueva página del Códice
  está lista» (banner del Códice, jamás diálogo del sistema).

## 2. Ciclo de vida Android

- `visibilitychange` ⇒ pausa del GameLoop + autosave inmediato + muteo de AudioEngine.
- Reanudación < 500 ms: estado intacto; si estaba en combate LAN, fase de resync.
- `pagehide`/`beforeunload`: volcado final del `saveIntent` pendiente.
- Descarga por el sistema (memoria): el SW rehidrata shell; el save vive en IDB.

## 3. Pantallas y entrada

- Viewport con `viewport-fit=cover` + `env(safe-area-inset-*)` en HUD.
- Táctil: objetivos ≥44 px; gestos con inercia desactivada en zonas de precisión
  (selección de objetivo); háptica (vibración) opcional en impactos/turno.
- Orientación: retrato prioridad (colección/mapa), paisaje soportado en combate
  (layout se re-compone; no hay assets por orientación).

## 4. Rendimiento en gama media

- DPR máx 2; partículas ≤256; atlas; pooling; `requestVideoFrameCallback` no se usa.
- Audio: contexto suspendido hasta primer gesto; assets OGG/Opus.
- Red: cero llamadas en offline; sync silenciosa cuando haya red.

## 5. Empaquetado Android (fases)

1. **Ahora:** PWA instalable (Add to Home screen / prompt `beforeinstallprompt`
   diferido a un botón del Códice).
2. **M10:** TWA (Trusted Web Activity) con Digital Asset Links, o Capacitor si se
   requieren APIs nativas (mDNS para descubrimiento LAN automático, notificaciones).
   Decisión registrada como ADR al llegar; la app no tendrá que reescribirse:
   los adaptadores viven en `src/platform/`.

## 6. QA de dispositivo (M5)

- Matriz: 360×800 (gama baja), 412×915 (media), 768 tablet, Chrome/Firefox Android.
- Pruebas: instalación, arranque offline total, suspensión en combate, rotación,
  almacenamiento casi lleno, audio con pantalla apagada (debe pausar).
