# Capítulo GDD-09 — Narrativa: escenas, diálogos, memorias, eventos

## 1. Calidad objetivo

Narrativa de videojuego comercial lograda con recursos ligeros: ilustración por
capas, parallax, cámara virtual, texto progresivo, retratos, partículas, audio.
**Sin vídeo pesado** (Mega §15). Toda escena es un dato interpretado por SceneEngine.

## 2. Escena como dato (SceneEngine)

```jsonc
{ "id": "scn/ch01-thrones", "background": "bg/ruined-hall",
  "characterLayers": [ { "id": "morwen", "layer": "mid", "expression": "…" } ],
  "dialogue": "dlg/ch01-awakening", "camera": [ "pan-slow", "zoom-in@climax" ],
  "effects": ["ash-fall", "corona-light"], "audio": ["amb/wind-hall"],
  "choices": "chc/…", "events": ["setFlag/…"], "flagsRequired": [] }
```

Una escena ≤6 capas, ≤2 imágenes grandes; transición <400 ms (Visual GDD §7).

## 3. Diálogos y decisiones

Sistema de conversación con opciones, relaciones, variables, reputación, facciones,
consecuencias, eventos ocultos y ramas (Mega §16):

```jsonc
{ "id": "dlg/01", "speaker": "npc/veiled", "text": "No deberías haber despertado.",
  "options": [
    { "id": "who",  "text": "¿Quién eres?",   "set": { "veiledKnown": 1 } },
    { "id": "where","text": "¿Dónde estoy?",  "set": { "askedPlace": 1 } },
    { "id": "mem",  "text": "Quiero mi memoria.", "rep": { "fact/errant": 1 },
      "requires": { "flag/protagRank>=": "D" } } ] }
```

- Las opciones escriben `storyFlags`/`worldState`; las consecuencias pueden ser
  inmediatas (combate), diferidas (evento futuro) o permanentes (World Scar).
- Tonos: las opciones no se etiquetan como «buena/mala»; el mundo juzga después.

## 4. Jerarquía narrativa y pipeline

Saga → Temporada → Capítulo → Misión → Evento → Encuentro → Decisión (Mega §14).
Pipeline de autoría (M8): plantilla de escena → validador CLI → previsualizador.
Regla de oro del misterio (Mega §52): cada capítulo responde 1 pregunta y abre 2;
contenido oculto, evoluciones ocultas, cartas secretas, eventos extremadamente raros.

## 5. Memory Fragments

- Cada protagonista posee **cientos de fragmentos** (~200 canon v1) obtenidos en
  combate, exploración, decisiones y secretos.
- Al reunirlos se revelan: pasado, relaciones, traiciones, muertes, poderes,
  antiguos enemigos y secretos del Eclipse — la colección **es** una herramienta
  narrativa (Memory Collection se lee como diario roto, no como lista).
- Estructura de fragmento: `id, portador, textura (flash/página/recuerdo-ojeno),
  contenido (50–300 palabras), pista correlativa` (forman cadenas).

## 6. World Scars (decisiones permanentes)

Variables narrativas persistentes (`worldState.scars[]`): ciudad destruida, facción
desaparecida, jefe aliado, región cambiada, ruta bloqueada, historia exclusiva.
- Presentación: la cicatriz se *muestra* en el mapa y se *recuerda* en diálogos.
- Nunca se borran; las sagas futuras las referencian (continuidad entre packs).

## 7. NarrativeDirector (canónico, Mega §26)

Decide qué eventos/personajes/diálogos/decisiones/enemigos/recompensas aparecen.

Contexto de entrada: `playerProgress, storyFlags, factionReputation,
protagonistRank, worldState (scars), collection, previousChoices`.

- Política de oferta: 40 % hilo principal, 30 % agendas de los Once, 20 % facciones,
  10 % rarezas/secretos (sesgos ajustables por datos).
- Anti-repetición: memoria de beats recientes; nunca dos eventos idénticos seguidos.
- Determinista: `director.next(ctx, seed)` reproducible (actas de QA).

## 8. EventGenerator (contenido infinito, Mega §25)

Tipos: emboscada, ruina, mercader, jefe, portal, escolta, maldición, tesoro,
decisión, duelo, invasión, guerra, aparición legendaria. **Se combinan** (emboscada+
maldición+portal) por ranuras con semilla.

- Cada evento: ranuras de enemigos (por facción/rango del jugador), recompensas
  escaladas, posibles cicatrices, peso de rareza.
- «Aparición legendaria» es el evento extremadamente raro (base 0,3 %) que la Regla
  de Oro exige; su existencia no se anuncia nunca en la UI.

## 9. Escritura: estándares

- Frase corta y concreta; cada línea revela o tensa. Cero relleno («sírvete, viajero»
  prohibido sin subtexto).
- Los PNJ mienten; el Códice no (pero puede quedarse en blanco).
- Revisión: cada escena pasa lista de «pregunta abierta», «material visual»,
  «consecuencia posible» antes de integrarse.
