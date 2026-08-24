# Especificación — Almacenamiento (IndexedDB) y Seguridad

## 1. Base `eclipse-codex` (schema v1)

Stores (Mega §36): `profile · cards · inventory · weapons · characters · quests ·
storyFlags · worldState · deck · settings · syncQueue · meta`.

- Claves: `profile` por `id`; colecciones por `instanceId`; flags por `key`.
- Índices: `cards.byFaction`, `cards.byRank`, `weapons.byType`.
- Wrapper `storage/db.js`: promesas, transacciones cortas, reintento 1× en
  `QuotaExceededError` con purga de cache fría (no de datos de dominio).

## 2. SaveEngine

- **Autosave:** cada mutación de dominio encola `saveIntent` (debounce 500 ms);
  escritura transaccional multi-store.
- **Recuperación de cierre inesperado:** antes de escribir, `meta.pendingIntent =
  batch`; tras commit se borra. Al arrancar: si hay `pendingIntent`, se aplica o se
  revierte de forma segura (el batch es idempotente por diseño).
- **Versionado:** `meta.schemaVersion`; migraciones puras `vN→vN+1` testeadas.
- **Export/import:** crónica exportable a JSON cifrado (compartir entre dispositivos
  sin cuenta; base del intercambio LAN M6).

## 3. Presupuestos

- Save típico < 2 MB a los 6 meses de juego (las armas guardan semilla, no payload).
- Escrituras grandes (colección) en lotes de 200 entradas por transacción.

## 4. Seguridad local (Web Crypto, Mega §37)

- `security/crypto.js`: AES-GCM 256. Clave de dispositivo **no exportable** generada
  en primer arranque y guardada en IDB (`cryptoKey` store separado).
- Se cifra: tokens de sync, crónica exportable, cualquier campo marcado `sensitive`.
- **No se almacenan secretos en el código.** La clave nunca sale del dispositivo;
  export de crónica deriva clave temporal de frase del jugador (PBKDF2 250k).

## 5. Anti-manipulación pragmática (offline honesto)

- El juego offline es del jugador: no se combate la edición local deliberada;
  se protege la **integridad** (checksum por store + firma interna de lotes) para
  detectar corrupción, y la **limpieza competitiva**: en LAN el host valida todo
  (lan-sync §4) y el PvP remoto (M7+) pedirá pruebas de progreso verificables.

## 6. Privacidad

- Sin telemetría en v1. Cuando exista (opt-in), será eventos anónimos agregados,
  documentados en CHANGELOG y desactivables.
