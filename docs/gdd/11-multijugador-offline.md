# Capítulo GDD-11 — Multijugador, LAN y offline

## 1. Lo que funciona SIN Internet (canónico)

Campaña, historia, colección, inventario, mazos, IA, exploración, fabricación,
eventos, progresión, guardado automático **y multijugador LAN** (Mega §35).
Internet solo: sincronización, cuenta, copias remotas, PvP remoto, actualizaciones
y contenido online.

## 2. Modos multijugador

| Modo | Jugadores | Estado objetivo |
|------|-----------|-----------------|
| Duelo PvP LAN | 1v1 | M6 (host autoritativo) |
| Coop PvE LAN | 2 (escalable 3) | M6: jefe cooperativo con escalado |
| PvP remoto | 1v1 | M7+ (Sync/Backend) — opcional |
| Intercambio LAN | 2 | M6: fragmentos/reliquias validados por host |

## 3. LAN Wi-Fi sin Internet (diseño)

- **Topología host-cliente:** el que crea la sala es autoridad de la partida.
- **Conexión:** WebRTC DataChannel directo en la red local (sin STUN en LAN); la
  señalización (offer/answer + candidatos) se intercambia **fuera de banda**:
  - Código corto (6–8 caracteres, alfabeto sin ambiguos) — HC(Huffman-compactado).
  - **QR** mostrado por el host, escaneado por el invitado (y viceversa para el answer).
  - Descubrimiento local automático *cuando la plataforma lo permita* (mDNS/Bonjour
    vía capa nativa Android; no prometido en PWA pura — ADR-005).
- **Flujo:** crear sala → código/QR → unirse → apretón de credenciales de crónica →
  lobby (formato de sala: estándar/libre/sin-XG) → partida.

## 4. Modelo de autoridad y antitrampas

- Los clientes envían **intenciones** (`action.declare`); el host valida contra el
  estado canónico, aplica, y difunde **estado + hash** por tick.
- Combate determinista (seed del combate compartida): ambos lados simulan; el host
  arbitra divergencias y expulsa estados ilegítimos (checksum por tick).
- El cliente **nunca confía en sus propios valores** (Mega §34): la UI local es
  predicción; el estado del host es verdad.
- Reconexión: ficha de sesión persistente; reingreso con resincronización
  snapshot + delta (ventana de 90 s, configurable por sala).

## 5. Protocolo de mensajes (resumen)

`room.create/join/leave/close`, `lobby.ready`, `match.start(seed, format)`,
`action.declare`, `action.reject(reason)`, `state.snapshot`, `state.delta`,
`heartbeat`, `match.end`, `trade.offer/accept/confirm`.
Detalle completo y versionado: [../arch/lan-sync.md](../arch/lan-sync.md).

## 6. Sync online (opcional, no bloqueante)

Pipeline (Mega §38): `Local → Queue → Validation → Remote → Confirm → Mark synced`;
fallos ⇒ reintento con backoff; jamás bloquea el juego offline. Conflictos:
registro sellado por dispositivo + fusión de colecciones por unión.

## 7. Suspensión y red local en Android

- Al suspender la app: pausa lógica, autosave, heartbeat «away» a la sala; al
  volver, resincroniza. Si el host se va: migración de host no disponible en v1 —
  la partida se archiva con resultado «interrumpido» y recompensas parciales.
- Consideraciones Android: WakeLock opcional durante combates LAN, vibración en
  turno propio (ajustable), aviso de batería baja como invitado.
