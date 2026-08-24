// game/cards — Capa de información: nombre, título, stats y gema de rango.
// Tipografía serif del sistema (offline-first; fuente propia en M8).

import { alpha, roundRect, shade } from './geom.js';
import { GEOM } from './framePainter.js';

const FONT = 'Georgia, "Times New Roman", serif';

export class TextPainter {
  render(ctx, def, rank, extras = {}) {
    this._namePlate(ctx, def);
    this._titleBar(ctx, def);
    if (def.stats) this._statsBar(ctx, def.stats, rank);
    this._gemMark(ctx, rank);
  }

  _namePlate(ctx, def) {
    const p = GEOM.namePlate;
    ctx.save();
    ctx.beginPath();
    roundRect(ctx, p.x, p.y, p.w, p.h, 8);
    ctx.fillStyle = alpha('#0B0A10', .72); ctx.fill();
    ctx.strokeStyle = alpha('#D9D2C5', .22); ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = '#D9D2C5';
    ctx.font = `600 16px ${FONT}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    fitText(ctx, def.name, p.x + p.w / 2, p.y + p.h / 2 + 1, p.w - 20, 16);
    ctx.restore();
  }

  _titleBar(ctx, def) {
    const p = GEOM.titleBar;
    ctx.save();
    ctx.fillStyle = alpha('#8C8696', .95);
    ctx.font = `italic 12.5px ${FONT}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    fitText(ctx, def.title || '', p.x + p.w / 2, p.y + p.h / 2, p.w - 12, 12.5);
    ctx.restore();
  }

  _statsBar(ctx, stats, rank) {
    const p = GEOM.statsBar;
    ctx.save();
    ctx.beginPath();
    roundRect(ctx, p.x, p.y, p.w, p.h, 10);
    ctx.fillStyle = alpha('#131117', .8); ctx.fill();
    ctx.strokeStyle = alpha(rank.frame.trim, .35); ctx.lineWidth = 1; ctx.stroke();
    const cells = [['ATQ', stats.atk], ['DEF', stats.def], ['ENE', stats.ene]];
    const cw = p.w / 3;
    cells.forEach(([label, value], i) => {
      const cx = p.x + cw * i + cw / 2;
      icon(ctx, label, cx, p.y + 22, rank.frame.trim);
      ctx.fillStyle = '#D9D2C5'; ctx.font = `700 19px ${FONT}`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(String(value), cx, p.y + 50);
      ctx.fillStyle = alpha('#8C8696', .9); ctx.font = `9px ${FONT}`;
      ctx.fillText(label, cx, p.y + 70);
    });
    // separadores rúnicos
    ctx.strokeStyle = alpha(rank.frame.trim, .3);
    for (let i = 1; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(p.x + cw * i, p.y + 12);
      ctx.lineTo(p.x + cw * i, p.y + p.h - 12); ctx.stroke();
    }
    ctx.restore();
  }

  _gemMark(ctx, rank) { // la marca del rango grabada en su gema
    const g = GEOM.gem;
    ctx.save();
    const dark = rank.family === 'sealed' || rank.family === 'awakened';
    ctx.fillStyle = dark ? alpha('#0B0A10', .85) : alpha('#FFFFFF', .9);
    ctx.font = `700 ${rank.id.length > 2 ? 9 : rank.id.length > 1 ? 11 : 13}px ${FONT}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(rank.id, g.cx, g.cy + .5);
    ctx.restore();
  }
}

function fitText(ctx, text, cx, cy, maxW, basePx) {
  let px = basePx;
  while (ctx.measureText(text).width > maxW && px > 8) {
    px -= .5; ctx.font = ctx.font.replace(/\d+(\.\d+)?px/, `${px}px`);
  }
  ctx.fillText(text, cx, cy);
}

// Iconos originales de stats (trazo propio; jamás emoji — Mega §40)
function icon(ctx, label, cx, cy, color) {
  ctx.save();
  ctx.strokeStyle = shade(color, 18); ctx.lineWidth = 1.6;
  ctx.lineCap = 'round'; ctx.translate(cx, cy);
  if (label === 'ATQ') { // filo cruzado
    ctx.beginPath(); ctx.moveTo(-5, 5); ctx.lineTo(5, -5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(2, -5); ctx.lineTo(5, -5); ctx.lineTo(5, -2); ctx.stroke();
  } else if (label === 'DEF') { // escudo
    ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(5, -4); ctx.lineTo(5, 1);
    ctx.quadraticCurveTo(5, 5, 0, 7); ctx.quadraticCurveTo(-5, 5, -5, 1);
    ctx.lineTo(-5, -4); ctx.closePath(); ctx.stroke();
  } else { // ENE: llama-corona
    ctx.beginPath(); ctx.moveTo(0, -6);
    ctx.quadraticCurveTo(4.5, -1, 3, 3.5);
    ctx.quadraticCurveTo(0, 6.5, -3, 3.5);
    ctx.quadraticCurveTo(-4.5, -1, 0, -6); ctx.stroke();
  }
  ctx.restore();
}
