# FASE 0 — AUDITORÍA DEL REPOSITORIO

Fecha: 2026-08-23 · Auditoría completa del estado inicial.

## 1. Inventario

| Elemento | Estado |
|---|---|
| `Mega promts` (26 KB, 1 778 líneas) | ✅ MEGA PROMPT / GDD principal. ÚNICA especificación. |
| Código fuente | ❌ Inexistente |
| package.json / dependencias | ❌ Inexistente |
| PWA (manifest, service worker) | ❌ Inexistente |
| Assets (frames, arte, iconos, audio) | ❌ Inexistentes |
| Código Android | ❌ Inexistente |
| Tests | ❌ Inexistentes |
| Documentación | ❌ Inexistente (solo el Mega Prompt) |
| Git | 1 commit en `main` ("Actualizar Mega promts") |

## 2. Diagnóstico

- **Qué existe:** únicamente la especificación.
- **Qué funciona:** nada (no hay código).
- **Qué está incompleto:** todo el producto.
- **Qué está mal diseñado:** nada detectado; el Mega Prompt es internamente consistente.
- **Qué conservarse:** el Mega Prompt como fuente de verdad (intacto).
- **Qué refactorizarse/reemplazarse:** nada.
- **Qué crearse desde cero:** la totalidad de la arquitectura, motor, assets y tooling.

## 3. Contradicciones/ambigüedades detectadas en el Mega Prompt

1. El orden canónico de rangos sitúa **C antes que D** (`G,F,C,D,B,…`). Se preserva tal
   cual: es regla fundamental, no un error a "corregir".
2. §13 lista "Guadañas" entre armas, y §11 pide categorías cerradas: se adoptan 16
   categorías (incl. guadañas) como base extensible.
3. El Mega Prompt exige "descubrimiento local" LAN: los navegadores no permiten escaneo
   de red puro; solución = señalización por QR/código + URL local (ver ARCHITECTURE §5).

## 4. Riesgos principales

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Gama baja Android (fps/RAM) | Alto | Tiers de calidad, Canvas2D primero, pooling, atlases |
| LAN sin Internet desde navegador | Alto | WebRTC DataChannel + señalización QR; host autoritativo |
| Alcance gigantesco | Alto | Vertical Slice antes de contenido masivo; fases con exit criteria |
| Assets pesados | Medio | Composición por capas; marcos reutilizados; WebP |
| Corrupción de guardado | Medio | Slot auto + backup + `recover()` (ya implementado) |

## 5. Veredicto

Repositorio verde. Se procede a FASE 1 (Fundación) sin tocar `Mega promts`.
