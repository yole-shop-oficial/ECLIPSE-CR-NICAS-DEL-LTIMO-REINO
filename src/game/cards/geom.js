// game/cards — Utilidades geométricas y de color para el compositor.

export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function shade(hex, amount) { // amount -100..100
  const { r, g, b } = hexToRgb(hex);
  const t = amount < 0 ? 0 : 255; const p = Math.abs(amount) / 100;
  const f = v => Math.round((t - v) * p + v);
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

export function alpha(hex, a) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

// roundRect AÑADE el trazado al path actual (no hace beginPath): permite
// combinar varios subpaths (anillos even-odd). El llamador hace beginPath().
export function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/** Traza un anillo (marco) rellenando entre rect exterior e interior (even-odd). */
export function ringPath(ctx, outer, inner, rOuter, rInner) {
  roundRect(ctx, outer.x, outer.y, outer.w, outer.h, rOuter);
  roundRect(ctx, inner.x, inner.y, inner.w, inner.h, rInner);
}
