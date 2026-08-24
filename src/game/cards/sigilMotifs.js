// game/cards — Sigilos de los 12 Portadores: emblemas originales por fuerza
// primordial (GDD cap. 01 §4). Placeholder de artwork hasta el arte final:
// son intencionalmente heráldicos, no sustitutos de una ilustración.

const TAU = Math.PI * 2;
function L(ctx, x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function A(ctx, x, y, r, a0, a1) { ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); }

export const MOTIFS = {
  flame(ctx, s) { // espiral de ascuas
    for (let i = 0; i < 3; i++) {
      const r = s * (.28 + i * .16);
      ctx.beginPath();
      ctx.moveTo(0, s * .34 - i * s * .1);
      ctx.quadraticCurveTo(-r, -s * .05, 0, -r - i * s * .06);
      ctx.quadraticCurveTo(r * .8, -s * .02, 0, s * .34 - i * s * .1);
      ctx.stroke();
    }
    A(ctx, 0, s * .18, s * .07, 0, TAU);
  },
  moon(ctx, s) { // corona menguante
    A(ctx, 0, 0, s * .5, .45, TAU - .45);
    ctx.save(); ctx.globalAlpha *= .75;
    A(ctx, s * .18, -s * .12, s * .42, 2.6, 5.4); ctx.restore();
    L(ctx, -s * .3, s * .52, s * .34, s * .52);
  },
  helm(ctx, s) { // yelmo sin rostro
    ctx.beginPath();
    ctx.moveTo(-s * .42, s * .4); ctx.lineTo(-s * .42, -s * .05);
    ctx.quadraticCurveTo(-s * .42, -s * .5, 0, -s * .5);
    ctx.quadraticCurveTo(s * .42, -s * .5, s * .42, -s * .05);
    ctx.lineTo(s * .42, s * .4); ctx.closePath(); ctx.stroke();
    L(ctx, -s * .3, -s * .08, s * .3, -s * .08);
    L(ctx, 0, -s * .5, 0, s * .38);
  },
  crown(ctx, s) { // corona de hueso
    ctx.beginPath(); ctx.moveTo(-s * .45, s * .3); ctx.lineTo(s * .45, s * .3);
    ctx.stroke();
    for (let i = 0; i < 5; i++) {
      const x = -s * .45 + i * (s * .9 / 4);
      L(ctx, x, s * .3, x + (i % 2 ? s * .06 : 0), s * .3 - (i % 2 ? s * .5 : s * .3));
    }
  },
  abyss(ctx, s) { // ojo hundido
    for (let i = 0; i < 4; i++) A(ctx, 0, 0, s * (.12 + i * .12), 0, TAU);
    ctx.save(); ctx.globalAlpha *= .6; A(ctx, 0, 0, s * .06, 0, TAU); ctx.restore();
    L(ctx, -s * .55, 0, s * .55, 0);
  },
  chalice(ctx, s) { // cáliz partido
    ctx.beginPath(); ctx.moveTo(-s * .35, -s * .4); ctx.lineTo(s * .35, -s * .4);
    ctx.quadraticCurveTo(s * .35, s * .1, 0, s * .1);
    ctx.quadraticCurveTo(-s * .35, s * .1, -s * .35, -s * .4); ctx.stroke();
    L(ctx, 0, s * .1, 0, s * .42); L(ctx, -s * .2, s * .42, s * .2, s * .42);
    L(ctx, s * .06, -s * .4, -s * .04, s * .06); // la grieta
  },
  void(ctx, s) { // círculo que se traga
    ctx.beginPath();
    for (let a = 0; a < TAU * 2.6; a += .15) {
      const r = s * .5 * (1 - a / (TAU * 3));
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  },
  drop(ctx, s) { // gota con linaje
    ctx.beginPath();
    ctx.moveTo(0, -s * .5);
    ctx.quadraticCurveTo(s * .38, -s * .05, s * .3, s * .2);
    ctx.quadraticCurveTo(s * .2, s * .48, 0, s * .48);
    ctx.quadraticCurveTo(-s * .2, s * .48, -s * .3, s * .2);
    ctx.quadraticCurveTo(-s * .38, -s * .05, 0, -s * .5); ctx.stroke();
    L(ctx, 0, -s * .28, 0, s * .3); L(ctx, -s * .12, s * .02, s * .12, s * .02);
  },
  root(ctx, s) { // raíz coronada
    L(ctx, 0, -s * .5, 0, s * .1);
    for (let i = 0; i < 4; i++) {
      const dir = i % 2 ? 1 : -1;
      L(ctx, 0, -s * .1 + i * s * .12, dir * s * (.14 + i * .1), s * (.05 + i * .13));
    }
    ctx.beginPath(); ctx.moveTo(-s * .25, -s * .5); ctx.lineTo(0, -s * .68); ctx.lineTo(s * .25, -s * .5); ctx.stroke();
  },
  anvil(ctx, s) { // yunque estrellado
    ctx.beginPath();
    ctx.moveTo(-s * .5, -s * .2); ctx.lineTo(s * .5, -s * .2); ctx.lineTo(s * .3, 0);
    ctx.lineTo(s * .18, 0); ctx.lineTo(s * .18, s * .34); ctx.lineTo(-s * .18, s * .34);
    ctx.lineTo(-s * .18, 0); ctx.lineTo(-s * .3, 0); ctx.closePath(); ctx.stroke();
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i - 2) * .5;
      L(ctx, Math.cos(a) * s * .62, -s * .3 + Math.sin(a) * s * .62,
        Math.cos(a) * s * .72, -s * .3 + Math.sin(a) * s * .72);
    }
  },
  dragon(ctx, s) { // colmillo en espiral
    ctx.beginPath();
    for (let a = 0; a < TAU * 1.7; a += .12) {
      const r = s * (.08 + a * .12);
      const x = Math.cos(a + 2.6) * r, y = Math.sin(a + 2.6) * r - s * .06;
      a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * .3, s * .3); ctx.lineTo(s * .5, s * .52); ctx.lineTo(s * .24, s * .44); ctx.stroke();
  },
  clock(ctx, s) { // reloj sin agujas
    A(ctx, 0, 0, s * .5, 0, TAU); A(ctx, 0, 0, s * .4, 0, TAU);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU;
      L(ctx, Math.cos(a) * s * .44, Math.sin(a) * s * .44, Math.cos(a) * s * .5, Math.sin(a) * s * .5);
    }
    L(ctx, -s * .18, s * .64, s * .18, s * .64); // pedestal roto
  },
};

export function getMotif(id) { return MOTIFS[id] || MOTIFS.flame; }
