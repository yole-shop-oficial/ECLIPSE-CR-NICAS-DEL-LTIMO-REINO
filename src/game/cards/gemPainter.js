// game/cards — Gema de rango: la marca del rango es un grabado, no texto suelto
// (docs/visual/rangos-visuales.md). Tallas: disc/bevel/facet/molten/pupil/eclipse.

import { shade, alpha } from './geom.js';

export function paintGem(ctx, cx, cy, r, rank, seed) {
  const f = rank.frame;
  switch (f.gem) {
    case 'disc':   return disc(ctx, cx, cy, r, f);
    case 'bevel':  return bevel(ctx, cx, cy, r, f);
    case 'facet':  return facet(ctx, cx, cy, r, f);
    case 'molten': return molten(ctx, cx, cy, r, f);
    case 'pupil':  return pupil(ctx, cx, cy, r, f);
    case 'eclipse':return eclipse(ctx, cx, cy, r, f);
    default:       return disc(ctx, cx, cy, r, f);
  }
  // La letra del rango la graba textPainter encima (misma geometría).
}

function disc(ctx, cx, cy, r, f) {
  const g = ctx.createRadialGradient(cx - r * .3, cy - r * .3, r * .2, cx, cy, r);
  g.addColorStop(0, shade(f.accent, 20)); g.addColorStop(1, shade(f.accent, -45));
  ctx.fillStyle = g; circle(ctx, cx, cy, r); ctx.fill();
  ctx.strokeStyle = shade(f.trim, -20); ctx.lineWidth = 2; ctx.stroke();
}

function bevel(ctx, cx, cy, r, f) { // octógono biselado
  pathPoly(ctx, cx, cy, r, 8, Math.PI / 8);
  const g = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  g.addColorStop(0, '#1A1812'); g.addColorStop(.5, shade(f.accent, -10)); g.addColorStop(1, '#0B0A10');
  ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = f.trim; ctx.lineWidth = 2; ctx.stroke();
  pathPoly(ctx, cx, cy, r * .62, 8, Math.PI / 8);
  ctx.strokeStyle = alpha(f.trim, .5); ctx.lineWidth = 1; ctx.stroke();
}

function facet(ctx, cx, cy, r, f) { // rombo facetado
  pathPoly(ctx, cx, cy, r, 4, 0);
  const g = ctx.createLinearGradient(cx, cy - r, cx, cy + r);
  g.addColorStop(0, shade(f.accent, 40)); g.addColorStop(.5, f.accent); g.addColorStop(1, shade(f.accent, -60));
  ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = shade(f.trim, 10); ctx.lineWidth = 2; ctx.stroke();
  ctx.beginPath(); // aristas internas
  ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r);
  ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy);
  ctx.strokeStyle = alpha('#FFFFFF', .25); ctx.lineWidth = 1; ctx.stroke();
}

function molten(ctx, cx, cy, r, f) { // núcleo fundido
  ctx.save();
  ctx.shadowColor = f.accent; ctx.shadowBlur = r * .8;
  const g = ctx.createRadialGradient(cx, cy, r * .1, cx, cy, r);
  g.addColorStop(0, '#F5D98A'); g.addColorStop(.6, f.accent); g.addColorStop(1, '#1D1A24');
  ctx.fillStyle = g; circle(ctx, cx, cy, r); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = shade(f.accent, -30); ctx.lineWidth = 2; ctx.stroke();
}

function pupil(ctx, cx, cy, r, f) { // pupila del vacío
  ctx.save();
  circle(ctx, cx, cy, r); ctx.clip();
  ctx.fillStyle = '#050408'; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  const g = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
  g.addColorStop(0, 'transparent'); g.addColorStop(.5, f.accent); g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.ellipse(cx, cy, r, r * .28, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = f.trim; ctx.lineWidth = 2; circle(ctx, cx, cy, r); ctx.stroke();
}

function eclipse(ctx, cx, cy, r, f) { // eclipse total: corona + disco negro
  ctx.save();
  ctx.shadowColor = f.trim; ctx.shadowBlur = r * 1.1;
  ctx.strokeStyle = alpha(f.trim, .95); ctx.lineWidth = 2.5;
  circle(ctx, cx, cy, r); ctx.stroke();
  ctx.restore();
  ctx.fillStyle = '#0B0A10'; circle(ctx, cx, cy, r * .78); ctx.fill();
  for (let i = 0; i < 12; i++) { // rayos de corona cortos
    const a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r * .86, cy + Math.sin(a) * r * .86);
    ctx.lineTo(cx + Math.cos(a) * r * 1.02, cy + Math.sin(a) * r * 1.02);
    ctx.strokeStyle = alpha(f.trim, i % 2 ? .8 : .35); ctx.lineWidth = 1; ctx.stroke();
  }
}

function circle(ctx, cx, cy, r) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); }

function pathPoly(ctx, cx, cy, r, sides, rot) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const a = rot + (i / sides) * Math.PI * 2;
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath();
}
