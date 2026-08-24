// game/cards — CardComposer: monta la carta por capas canónicas (Mega §8/§10):
// fondo → ARTWORK → (efectos internos) → FRAME → decoraciones → info.
// El marco siempre encima; el artwork nunca se funde con él. Cachea por clave.

import { GEOM } from './framePainter.js';
import { roundRect } from './geom.js';

export class CardComposer {
  constructor({ framePainter, sigilPainter, textPainter, dpr = 1 }) {
    this._frame = framePainter;
    this._sigil = sigilPainter;
    this._text = textPainter;
    this._dpr = Math.min(dpr, 2); // presupuesto
    this._cache = new Map();
  }

  /**
   * Renderiza una carta completa a un canvas nuevo (o reutiliza caché).
   * @param {{def:object, rank:object, scale?:number}} input
   * @returns {HTMLCanvasElement}
   */
  compose({ def, rank, scale = 1 }) {
    const key = `${def.id}@${rank.id}@${def.visualSeed ?? 0}@${scale.toFixed(2)}`;
    if (this._cache.has(key)) return this._cache.get(key);
    const canvas = this._paint(def, rank, scale);
    if (this._cache.size > 120) this._cache.delete(this._cache.keys().next().value);
    this._cache.set(key, canvas);
    return canvas;
  }

  invalidate(cardId) {
    for (const k of [...this._cache.keys()]) if (k.startsWith(`${cardId}@`)) this._cache.delete(k);
  }

  _paint(def, rank, scale) {
    const k = this._dpr * scale;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(GEOM.W * k); canvas.height = Math.round(GEOM.H * k);
    canvas.style.width = `${GEOM.W * scale}px`; canvas.style.height = `${GEOM.H * scale}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(k, k);

    // 1 · FONDO
    ctx.beginPath();
    roundRect(ctx, 0, 0, GEOM.W, GEOM.H, GEOM.radius);
    ctx.fillStyle = '#0B0A10'; ctx.fill();

    // 2 · ARTWORK (ventana recortada; el arte existe sin marco)
    ctx.save();
    ctx.beginPath();
    roundRect(ctx, GEOM.art.x, GEOM.art.y, GEOM.art.w, GEOM.art.h, 10);
    ctx.clip();
    this._sigil.render(ctx, GEOM.art, def, def.visualSeed ?? 0);
    ctx.restore();

    // 3 · EFECTOS INTERNOS (aura bajo el marco) — reservado: perfiles por afinidad (M2)

    // 4 · FRAME (siempre encima del arte)
    this._frame.render(ctx, rank, def.visualSeed ?? 0);

    // 5 · DECORACIONES SUPERIORES — la gema ya la pinta el FramePainter (es decoración)

    // 6 · INFORMACIÓN
    const infoClip = { ...GEOM.statsBar };
    this._text.render(ctx, def, rank, infoClip);

    return canvas;
  }
}
