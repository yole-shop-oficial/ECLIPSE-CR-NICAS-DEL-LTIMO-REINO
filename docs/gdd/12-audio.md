# Capítulo GDD-12 — Audio

## 1. Intención

El audio cuenta lo que la imagen no puede: que este mundo está roto y aún así respira.
Paleta: cuerdas graves, coro apagado, campanas lejanas, instrumentos de juglar
decaídos (viuela, salterio), texturas de ceniza/viento. Nada de brillo pop.

## 2. Capas del AudioEngine (canónicas, Mega §39)

`Music · Ambience · Combat · UI · Card · Rank · Evolution · Dialogue · Boss`

- Mezcla con *ducking*: Dialogue > Combat > Ambience; Music cede 3 dB en diálogo.
- WebAudio: nodos por capa, compresor maestro, ajustes de volumen por capa en
  `settings` y respeto del silencio del sistema.
- Desbloqueo por gesto (política móvil): el primer toque activa el contexto.

## 3. Música adaptativa

- Stems por intensidad: base (cuerdas graves), tensión (percusión sorda), clímax
  (coro). Crossfade por estado del combate y de la escena.
- Mundo: cada región tiene tema con variante día-de-ceniza/marea-hueca.
- Jamás silencio total: capa Ambience mantiene «aire» (viento, grietas, campanas
  muy lejanas) salvo en escenas que exigen vacío sonoro deliberado.

## 4. Identidad sonora por rango y evolución

- Cada familia de rango tiene firma: Sellados = piedra/cera/papel; Despiertos =
  metal que se tensiona; Ascendidos = vidrio + coro distante; Ultra = coro grave +
  catedral; XG = coro + subgrave + silenciamiento súbito del ambiente (1,2 s).
- **Evolución:** secuencia sonora única por protagonista, construida por capas del
  tema del Portador (la forma G suena a motivo desnudo; XG a orquesta completa).
- Sello de acciones en la Action Stack: cada afinidad sella con timbre propio
  (fuego=vaho, vacío=succión apagada, cristal=armónico).

## 5. SFX de UI (lenguaje)

- Botón: filo de metal corto; confirmar: sello de cera; atrás: página que gira.
- Abrir el Códice: grano de papel + bisagra; secreto revelado: armónico + respiración.
- Los sonidos de carta escalan con su rango actual, no con el de base.

## 6. Diálogo

- Sin voces dobladas en v1: «blips» de timbre por personaje (2–3 variantes, timbre
  acorde a su alma) bajo el texto progresivo. Voces completas: expansión opcional.

## 7. Producción y formatos (offline-first)

- Fuentes originales (composición propia o con licencia compatible documentada).
- Formato: OGG/Opus ~96 kbps SFX, ~128 kbps música; audio-sprites por escena para
  reducir peticiones; precache de lo esencial, streams (fetch+decode) para música.
- Presupuesto audio total app-shell ≤ 8 MB; packs añaden lo suyo bajo demanda.

## 8. Accesibilidad sonora

- Volúmenes independientes, subtítulos siempre activos, pistas visuales para cues
  críticos (flash suave del borde al recibir turno), vibración opcional en Android
  sincronizada con impactos fuertes.
