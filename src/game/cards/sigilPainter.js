// game/cards — SigilPainter: artwork placeholder por Portador (original, sin
// assets externos). Fondo por afinidad + sigilo + textura de ceniza.

import { alpha } from './geom.js';
import { getMotif } from './sigilMotifs.js';
import { makeRng } from '../../core/rng.js';

export class SigilPainter {
  /** @param {object} def carta/protagonista con sigil {motif,hue} */
  render(ctx, rect, def, seed) {
    const hue = def.sigil?.hue ?? 220;
    const rng = makeRng(`sigil:${def.id}:${seed}`);
    this._backdrop(ctx, rect, hue);
    this._embers(ctx, rect, hue, rng);
    this._sigil(ctx, rect, def, hue);
    this._vignette(ctx, rect);
  }

  _backdrop(ctx, r, hue) {
    const g = ctx.createRadialGradient(r.x + r.w / 2, r.y + r.h * .42, 10,
      r.x + r.w / 2, r.y + r.h / 2, r.h * .75);
    g.addColorStop(0, `hsl(${hue} 32% 20%)`);
    g.addColorStop(.55, `hsl(${hue} 26% 12%)`);
    g.addColorStop(1, '#0B0A10');
    ctx.fillStyle = g; ctx.fillRect(r.x, r.y, r.w, r.h);
    // luz cenital tenue
    const lg = ctx.createLinearGradient(0, r.y, 0, r.y + r.h * .5);
    lg.addColorStop(0, `hsla(${hue} 40% 70% / .12)`); lg.addColorStop(1, 'transparent');
    ctx.fillStyle = lg; ctx.fillRect(r.x, r.y, r.w, r.h * .5);
  }

  _embers(ctx, r, hue, rng) {
    ctx.save();
    for (let i = 0; i < 26; i++) {
      const warm = rng.chance(.4);
      ctx.fillStyle = warm ? `hsla(${hue} 70% 62% / ${rng.float(.15, .5)})`
                           : `hsla(40 12% 70% / ${rng.float(.04, .12)})`;
      const s = rng.float(.7, 2.2);
      ctx.beginPath();
      ctx.arc(r.x + rng.float(0, r.w), r.y + rng.float(0, r.h), s, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  _sigil(ctx, r, def, hue) {
    const cx = r.x + r.w / 2, cy = r.y + r.h * .46, s = Math.min(r.w, r.h) * .46;
    ctx.save();
    ctx.translate(cx, cy);
    // anillo tenue tras el sigilo
    ctx.strokeStyle = `hsla(${hue} 45% 75% / .25)`; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, 0, s * .78, 0, Math.PI * 2); ctx.stroke();
    // sigilo principal
    ctx.shadowColor = `hsl(${hue} 70% 65%)`; ctx.shadowBlur = 18;
    ctx.strokeStyle = `hsla(${hue} 55% 82% / .95)`;
    ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    getMotif(def.sigil?.motif)(ctx, s);
    ctx.restore();
  }

  _vignette(ctx, r) {
    const g = ctx.createRadialGradient(r.x + r.w / 2, r.y + r.h / 2, r.h * .3,
      r.x + r.w / 2, r.y + r.h / 2, r.h * .8);
    g.addColorStop(0, 'transparent'); g.addColorStop(1, alpha('#000000', .55));
    ctx.fillStyle = g; ctx.fillRect(r.x, r.y, r.w, r.h);
  }
}
