# Especificación — Esquemas de datos (Content Packs)

Validación en carga por `data/validate.js`; fallo ⇒ pack rechazado con diagnostico.
IDs: `tipo/slug` estables. Todo contenido vive en `content/` (JSON).

## 1. ranks.json

```jsonc
{ "ranks": [ { "id": "G", "order": 0, "family": "sealed",
  "frame": { "material": "parchment", "ornament": 0, "glow": 0, "particles": 0,
             "gem": "disc", "palette": ["#6E6656", "#3A3228", "#8C8696"] },
  "audioSeal": "seal/sealed" }, … ] }
```
Reglas: 17 entradas exactas, orden único 0–16, id ∈ conjunto canónico.

## 2. protagonists.json

```jsonc
{ "protagonists": [ { "id": "protag/kael", "index": 1, "name": "Kael Vharis",
  "title": "El Heredero de las Cenizas", "faction": "fact/ash-empire",
  "affinity": ["ash"], "weaponType": "sword", "weaponId": "wpn-linked/vharis",
  "sigil": { "motif": "flame", "hue": 18 },
  "stats": { "atk": 5, "def": 4, "ene": 2 },
  "soul": { "desire": "…", "fear": "…" }, "xgConcept": "El Emperador Vacío",
  "arcHook": "…" }, …12 exactos ] }
```
Reglas: 12 exactos, index 1–12 único, rango inicial implícito G, `evolutionPath`
derivado `evp/<slug>`.

## 3. Cartas normales (cards/*.json por pack)

```jsonc
{ "id": "card/…", "type": "normal", "subtype": "creature|ally|spell|ritual|site|curse|relic-minor",
  "baseRank": "B", "faction": "fact/…", "affinities": ["ash"],
  "stats": { "atk": 12, "def": 9, "ene": 3 }, "abilities": ["ab/…"],
  "evolutionPath": "evp/…", "art": "art/…", "soul": {…}, "lore": "…",
  "secret": false }
```
Reglas: `baseRank` ≠ XG; evolución tope = base+3 (lo impone el motor, §03 GDD).

## 4. Componentes de arma (weapons/components.json)

```jsonc
{ "types": [ { "id": "sword", "name": "Espada", "gender": "f", "stats": … } ],
  "materials": [ { "id": "obsidian", "name": "Obsidiana", "palette": […], "mods": … } ],
  "cores": [ { "id": "lunar", "epithet": "de la Luna", "affinity": "moon" } ],
  "runes": [ { "id": "void", "epithet": "Vacía", "effect": "fx/erode" } ],
  "effects": [ { "id": "bleed", "name": "Sangrado", "tick": 2 } ] }
```
`WeaponGenerator` compone un `WeaponDef`: `{ id, seed, type, material, core, rune,
effect, rank, name, loreLine }`. El **seed reconstruye todo**.

## 5. Escenas y diálogos (story/*.json)

Escena: ver GDD cap. 09 §2. Diálogo: árbol de nodos `{id, speaker, text, options[]}`
con `set` (flags), `rep` (facción±), `requires` (condiciones de flags/rango).

## 6. Mundo (world/nodes.json)

```jsonc
{ "id": "node/ash-basins", "kind": "region|city|dungeon|ruin|sanctuary|battlefield|dimension",
  "links": ["node/…"], "unlock": { "rank>=": "B", "scar": "scar/…" },
  "faction": "fact/…", "biome": "ash-plain", "events": "evp/ash-basins" }
```

## 7. Persistencia: lo que se guarda INSTANCIA (no definición)

```jsonc
profile   { id, name, protagonistId, createdAt, playtime }
cards     { cardId, rank, echoes[], bonds[], visualSeed }
weapons   { instanceId, seed, name, forgeLevel }
storyFlags{ key: value }     worldState { scars[], wars{}, nodes{} }
syncQueue { opId, kind, payload, attempts, createdAt }
meta      { schemaVersion, pendingIntent }
```

## 8. Versionado

`meta.schemaVersion` (entero). Migradores `storage/migrations/vN→vN+1.js` puros y
testeados. Los packs declaran `requires.schema >= n`.
