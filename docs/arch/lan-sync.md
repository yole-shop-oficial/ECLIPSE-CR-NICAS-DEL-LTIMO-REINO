# Especificación — LAN (Wi-Fi sin Internet) y Sync online

## 1. Topología y transporte (M6)

Host autoritativo, clientes-predicción. Transporte: **WebRTC DataChannel** directo
en LAN (host candidates, sin STUN). La señalización no cabe en PWA pura sin toque
humano: se intercambia **fuera de banda** como código/QR.

- `LanSignaling.encode(offer) → "ECL-7F3K-…"` (base32 sin ambiguos, chunk CRC8).
- QR: `assets/ui/qr-renderer` dibuja el payload del host; el invitado escanea con
  cámara (permiso) o introduce el código a mano; el host introduce el answer.
- Capa nativa Android (fase posterior) añade mDNS/Bonjour: `LanDiscovery` opcional;
  la PWA sigue funcionando por código/QR. **No se promete descubrimiento automático
  en PWA pura** (ADR-005).

## 2. Ciclo de vida de sala

`idle → hosting(room) → joining(answer) → lobby(formato, crónicas) →
 match(seed, format) → combat… → end | interrupted`.

- Formato de sala: `standard` (sin XG), `open`, `mirror`. Lo fija el host.
- Crónica: resumen firmado localmente (protagonista, rango, mazo); el host
  verifica coherencia (nada de stats inventados: los valores salen del save cifrado
  y se contrastan con el hash público de la crónica).

## 3. Mensajes (v1, JSON, `t` = tipo, `v` = versión)

```
room.create {t,v,roomCode,host:{name,format}}          heartbeat {t,seq,rtt}
room.join {t,v,roomCode,player}                        lobby.ready {t,ready}
match.start {t,v,seed,format,players[2]}               action.declare {t,seq,intent}
action.reject {t,seq,reason}                           state.snapshot {t,tick,state,hash}
state.delta {t,tick,patch,hash}                        match.end {t,result,proof}
trade.offer/accept/confirm {t,items,hash}
```

- `intent`: acción serializable validable por CombatEngine (jamás estado).
- `hash`: FNV-1a/xxhash del estado normalizado por tick; divergencia ⇒ resnapshot.
- Reconexión: token de sesión en IDB; ventana 90 s; `snapshot + delta` al reingresar.
- Host se va ⇒ `match.end{result:"interrupted"}` + recompensas parciales (v1 sin
  migración de host; v2 la evalúa).

## 4. Determinismo y validación

- `seed` del match repartida en `match.start`; RNG combate = `hash(seed,tick,actor)`.
- Toda acción: validación de reglas (coste, fase, objetivo) **en el host** antes de
  entrar a la Action Stack; `action.reject` motiva la corrección de la predicción.
- Log de pila (últimos 64 ticks) persistido en el match para replay/auditoría.

## 5. Sync online (M7) — pipeline canónico

`Local Data → Queue (IDB syncQueue) → Validation → Remote → Confirm → Mark synced`.
Fallo ⇒ backoff exponencial (1s,2s,…cap 5min) y reintento; **nunca bloquea el juego**.

Contrato del backend de referencia (proyecto hermano, fuera de este repo):

```
POST /v1/sync/push   { deviceId, ops[] } → { accepted[], rejected[] }
POST /v1/sync/pull   { deviceId, since } → { ops[], cursor }
GET  /v1/ops/ping    → { ok }
```

- Auth: token opaco guardado **cifrado AES-GCM** en IDB (Security).
- Resolución de conflictos: campos de dominio con estrategia declarada —
  `profile|settings`: último-escritor-por-registro-sellado; `cards|collections`:
  unión por id; `storyFlags`: OR lógico conservador; nunca se pierde progreso.

## 6. Seguridad LAN

- Sin dados de poder en el canal: solo intenciones y hashes.
- El host trata cualquier mensaje mal tipado o fuera de fase como `protocol.violation`
  ⇒ expulsión. Rate-limit de intenciones por tick (anti-flood).
- Nada de secretos en código cliente (Mega §37): la sala no requiere cuentas.
