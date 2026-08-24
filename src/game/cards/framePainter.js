// game/cards — FramePainter procedural: identidad por rango desde ranks.json
// (ADR-002). Interfaz compatible con un futuro ImageFrameRenderer (atlas).
// El marco se dibuja SIEMPRE sobre el artwork, con ventana interior transparente.

import { shade, alpha, ringPath } from './geom.js';
import { paintGem } from './gemPainter.js';
import { makeRng } from '../../core/rng.js';

export const GEOM = {
  W: 360, H: 504,
  band: 18,                       // grosor del marco
  radius: 26, radiusInner: 16,
  art: { x: 26, y: 60, w: 308, h: 296 },   // ventana del artwork
  gem: { cx: 322, cy: 36, r: 21 },
  namePlate: { x: 24, y: 20, w: 268, h: 30 },
  titleBar: { x: 26, y: 362, w: 308, h: 24 },
  statsBar: { x: 26, y: 394, w: 308, h: 84 },
};

export class FramePainter {
  /** @param {CanvasRenderingContext2D} ctx @param {object} rank @param {number} seed */
  render(ctx, rank, seed) {
    const f = rank.frame;
    const { W, H, band, radius, radiusInner } = GEOM;
    const rng = makeRng(`frame:${rank.id}:${seed}`);
    const outer = { x: 2, y: 2, w: W - 4, h: H - 4 };
    const inner = { x: 2 + band, y: 2 + band, w: W - 4 - band * 2, h: H - 4 - band * 2 };

    this._band(ctx, rank, outer, inner);
    this._edges(ctx, rank, outer, inner);
    if (f.ornament > 0) this._corners(ctx, rank, inner, rng);
    if (f.runes) this._runes(ctx, rank, inner);
    if (f.material === 'molten') this._cracks(ctx, rank, inner, rng);
    if (rank.family === 'ultra') this._voidEcho(ctx, rank, outer, inner);
    if (rank.family === 'xg') this._breach(ctx, rank, outer);
    this._patina(ctx, rank, band, rng);
    this._sparkles(ctx, rank, band, rng);
    paintGem(ctx, GEOM.gem.cx, GEOM.gem.cy, GEOM.gem.r, rank, seed);
  }

  _band(ctx, rank, outer, inner) {
    const f = rank.frame;
    const g = ctx.createLinearGradient(0, 0, outer.w, outer.h);
    g.addColorStop(0, shade(f.base, -18));
    g.addColorStop(.45, f.trim);
    g.addColorStop(.55, shade(f.base, 10));
    g.addColorStop(1, shade(f.base, -30));
    ctx.save();
    if (f.glow > 1) { ctx.shadowColor = alpha(f.accent, .7); ctx.shadowBlur = f.glow * 5; }
    ctx.beginPath();
    ringPath(ctx, outer, inner, GEOM.radius, GEOM.radiusInner);
    ctx.fillStyle = g; ctx.fill('evenodd');
    ctx.restore();
  }

  _edges(ctx, rank, outer, inner) {
    const f = rank.frame;
    const ultra = rank.family === 'ultra' || rank.family === 'xg';
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = alpha('#000000', .6);
    ctx.beginPath();
    ringPath(ctx, outer, outer, GEOM.radius, GEOM.radius); ctx.stroke();
    ctx.strokeStyle = ultra ? alpha('#000000', .8) : alpha('#FFFFFF', .14);
    ctx.beginPath();
    ringPath(ctx, inner, inner, GEOM.radiusInner, GEOM.radiusInner); ctx.stroke();
  }

  _corners(ctx, rank, inner, rng) {
    const f = rank.frame; const n = f.ornament;
    const pts = [
      [inner.x, inner.y], [inner.x + inner.w, inner.y],
      [inner.x, inner.y + inner.h], [inner.x + inner.w, inner.y + inner.h],
    ];
    ctx.strokeStyle = alpha(f.trim, .8); ctx.lineWidth = 1.6; ctx.lineCap = 'round';
    for (const [px, py] of pts) {
      for (let i = 0; i < Math.min(n, 3); i++) {
        const s = 12 + i * 9; const sx = px === inner.x ? 1 : -1; const sy = py === inner.y ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(px + sx * 4, py + sy * (4 + s));
        ctx.quadraticCurveTo(px + sx * (s * .9), py + sy * (s * .35), px + sx * (4 + s), py + sy * 4);
        ctx.stroke();
      }
      // remate de esquina
      ctx.fillStyle = alpha(f.accent, .9);
      ctx.beginPath(); ctx.arc(px + (px === inner.x ? 4 : -4), py + (py === inner.y ? 4 : -4), 2.4, 0, Math.PI * 2); ctx.fill();
    }
  }

  _runes(ctx, rank, inner) {
    const f = rank.frame; const rng = makeRng(`runes:${rank.id}`);
    ctx.strokeStyle = alpha(f.accent, .85); ctx.lineWidth = 1.2; ctx.lineCap = 'round';
    const rows = [inner.y - 9, inner.y + inner.h + 9];
    for (const y of rows) {
      let x = inner.x + 34; const end = inner.x + inner.w - 34;
      while (x < end) {
        const w = rng.float(3, 7); ctx.beginPath();
        ctx.moveTo(x, y - rng.float(0, 2.5)); ctx.lineTo(x + w, y + rng.float(-2, 2));
        ctx.stroke(); x += w + rng.float(4, 9);
      }
    }
  }

  _cracks(ctx, rank, inner, rng) {
    const f = rank.frame;
    ctx.save(); ctx.shadowColor = f.accent; ctx.shadowBlur = 6;
    ctx.strokeStyle = alpha(f.accent, .9); ctx.lineWidth = 1.1;
    for (let i = 0; i < 7; i++) {
      let x = rng.float(inner.x, inner.x + inner.w);
      let y = rng.chance(.5) ? inner.y - 8 : inner.y + inner.h + 8;
      ctx.beginPath(); ctx.moveTo(x, y);
      for (let s = 0; s < 3; s++) { x += rng.float(-14, 14); y += (y < inner.y ? 1 : -1) * rng.float(1, 5); ctx.lineTo(x, y); }
      ctx.stroke();
    }
    ctx.restore();
  }

  _voidEcho(ctx, rank, outer, inner) {
    const f = rank.frame; // la carta «se curva»: sombra interior + eco desfasado
    ctx.strokeStyle = alpha('#050408', .9); ctx.lineWidth = 3;
    ctx.beginPath();
    ringPath(ctx, inner, inner, GEOM.radiusInner, GEOM.radiusInner); ctx.stroke();
    if (rank.id === 'URRX') {
      ctx.strokeStyle = alpha(f.accent, .35); ctx.lineWidth = 1;
      const o2 = { x: outer.x - .8, y: outer.y - .8, w: outer.w + 1.6, h: outer.h + 1.6 };
      ctx.beginPath();
      ringPath(ctx, o2, o2, GEOM.radius + 1, GEOM.radius + 1); ctx.stroke();
    }
  }

  _breach(ctx, rank, outer) { // XG: el marco no contiene a la carta
    const f = rank.frame;
    ctx.save(); ctx.strokeStyle = alpha(f.trim, .4); ctx.lineWidth = 1; ctx.setLineDash([7, 11]);
    ctx.beginPath();
    ringPath(ctx, { x: outer.x - 3, y: outer.y - 3, w: outer.w + 6, h: outer.h + 6 }, outer, GEOM.radius + 3, GEOM.radius);
    ctx.stroke(); ctx.restore();
  }

  _patina(ctx, rank, band, rng) {
    const f = rank.frame; const n = 60 + f.ornament * 40;
    ctx.fillStyle = alpha('#000000', .25);
    for (let i = 0; i < n; i++) {
      const side = rng.int(0, 3); const t = rng.float(0, 1);
      const x = side < 2 ? t * GEOM.W : (side === 2 ? rng.float(0, band + 4) : GEOM.W - rng.float(0, band + 4));
      const y = side < 2 ? (side === 0 ? rng.float(0, band + 4) : GEOM.H - rng.float(0, band + 4)) : t * GEOM.H;
      ctx.fillRect(x, y, rng.float(.6, 1.8), rng.float(.6, 1.8));
    }
  }

  _sparkles(ctx, rank, band, rng) {
    const f = rank.frame; if (!f.particles) return;
    ctx.save(); ctx.fillStyle = alpha(f.accent, .8);
    if (f.glow) { ctx.shadowColor = f.accent; ctx.shadowBlur = 4; }
    const n = f.particles * 5;
    for (let i = 0; i < n; i++) {
      const x = rng.float(band * .5, GEOM.W - band * .5);
      const y = rng.chance(.5) ? rng.float(band * .4, band) : GEOM.H - rng.float(band * .4, band);
      ctx.beginPath(); ctx.arc(x, y, rng.float(.5, 1.3), 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
}
