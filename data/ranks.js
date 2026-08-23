/**
 * data/ranks.js — Los 17 rangos canónicos (Mega Prompt §7), data-driven.
 * Orden inalterable: G F C D B BB A AA AAA S SS SSS SSSR UR URR URRX XG.
 * Identidad visual completa por rango en VISUAL_GDD §10.
 */

export const RANK_ORDER = Object.freeze([
  'G', 'F', 'C', 'D', 'B', 'BB', 'A', 'AA', 'AAA',
  'S', 'SS', 'SSS', 'SSSR', 'UR', 'URR', 'URRX', 'XG',
]);

/** Las cartas normales suben como máximo 3 rangos sobre su base (GDD §10). */
export const NORMAL_MAX_EVOLUTION_STEPS = 3;

function def(code, name, tier, material, palette, ornament, particles, audioCue) {
  return {
    id: `rank_${code}`,
    code,
    name,
    tier,
    order: RANK_ORDER.indexOf(code),
    material,
    palette,
    ornament,
    particles,
    audioCue,
    frame: `frame_${code}`,
    framePath: `assets/cards/frames/${code}/`,
  };
}

export const RANK_DEFINITIONS = Object.freeze([
  def('G', 'Piedra del Iniciado', 'mortal', 'piedra gris agrietada', { base: '#5b574e', accent: '#8a8375', glow: '#b9b29c' }, 'sin ornamento', 'polvo leve', 'rank_g_sting'),
  def('F', 'Cuero del Errante', 'mortal', 'cuero curtido y costuras', { base: '#6b4f37', accent: '#9c7a52', glow: '#caa06a' }, 'remaches de hueso', 'arena al viento', 'rank_f_sting'),
  def('C', 'Bronce del Soldado', 'mortal', 'bronce martillado', { base: '#7a5a2e', accent: '#b98a3f', glow: '#e8b45a' }, 'remaches militares', 'chispas tenues', 'rank_c_sting'),
  def('D', 'Hierro del Veterano', 'mortal', 'hierro oscuro forjado', { base: '#45464c', accent: '#6e7076', glow: '#9aa0ad' }, 'muescas de batalla', 'virutas metálicas', 'rank_d_sting'),
  def('B', 'Acero de Luna', 'heroico', 'acero azulado', { base: '#3c4a5d', accent: '#6f88a6', glow: '#a9c6e8' }, 'filo luminoso', 'neblina fría', 'rank_b_sting'),
  def('BB', 'Acero Gemelo', 'heroico', 'doble acero y plata', { base: '#46536b', accent: '#8fa3c0', glow: '#d7e4f7' }, 'incrustaciones de plata, motivo doble', 'neblina doble y espejismos', 'rank_bb_sting'),
  def('A', 'Plata del Juicio', 'heroico', 'plata pulida y lapislázuli', { base: '#9aa2ae', accent: '#3b5aa8', glow: '#cfe2ff' }, 'balanza grabada', 'destellos de plata', 'rank_a_sting'),
  def('AA', 'Oro del Juramento', 'heroico', 'filigrana de oro', { base: '#8a6d1f', accent: '#d4af37', glow: '#ffe27a' }, 'juramentos grabados', 'motas doradas', 'rank_aa_sting'),
  def('AAA', 'Oro Real', 'heroico', 'oro triple y gemas', { base: '#9c7a1a', accent: '#ffd24a', glow: '#fff3b0' }, 'corona menor, gemas rojas', 'brasas doradas', 'rank_aaa_sting'),
  def('S', 'Obsidiana Solar', 'mitico', 'obsidiana con vetas de oro', { base: '#17171c', accent: '#d4af37', glow: '#ffdf70' }, 'vetas de oro fundido', 'brasas y glow pulsante', 'rank_s_sting'),
  def('SS', 'Obsidiana Arcana', 'mitico', 'obsidiana arcano', { base: '#14141d', accent: '#7f5af0', glow: '#b79bff' }, 'doble veta, runas flotantes', 'runas flotantes', 'rank_ss_sting'),
  def('SSS', 'Cristal Prisma', 'mitico', 'cristal prismático', { base: '#1b2436', accent: '#6ee7ff', glow: '#ffffff' }, 'refracciones lentas', 'esquirlas de luz', 'rank_sss_sting'),
  def('SSSR', 'Cristal Rúnico Vivo', 'mitico', 'cristal vivo', { base: '#201a33', accent: '#ff6ac1', glow: '#ffd6ff' }, 'runas latiendo dentro', 'latidos de luz rúnica', 'rank_sssr_sting'),
  def('UR', 'Vacío Estelar', 'absoluto', 'negro absoluto', { base: '#0b0b12', accent: '#f5f0ff', glow: '#fff8d9' }, 'polvo de estrellas', 'estrellas en deriva', 'rank_ur_sting'),
  def('URR', 'Vacío Constelar', 'absoluto', 'vacío profundo', { base: '#07070d', accent: '#8de3ff', glow: '#eaffff' }, 'constelaciones conectadas', 'constelaciones animadas', 'rank_urr_sting'),
  def('URRX', 'Grieta de la Realidad', 'absoluto', 'realidad fisurada', { base: '#050507', accent: '#ff3d5a', glow: '#ffe9ec' }, 'la luz escapa como herida', 'distorsión y chispas de realidad', 'rank_urrx_sting'),
  def('XG', 'Corona del Eclipse', 'singularidad', 'disco negro y corona solar', { base: '#000000', accent: '#ffffff', glow: '#ffd76a' }, 'corona viva; rompe el borde del marco', 'corona solar, partículas orbitando', 'rank_xg_theme'),
]);

export function rankIndex(code) {
  const i = RANK_ORDER.indexOf(code);
  if (i === -1) throw new Error(`rango desconocido: ${code}`);
  return i;
}

/**
 * ¿Puede una carta evolucionar de baseCode a targetCode?
 * Protagonistas: sin límite (G→XG). Normales: máximo +3 rangos (GDD §10).
 */
export function canEvolveTo(baseCode, targetCode, { protagonist = false } = {}) {
  const base = rankIndex(baseCode);
  const target = rankIndex(targetCode);
  if (target < base) return false;
  if (protagonist) return true;
  return target - base <= NORMAL_MAX_EVOLUTION_STEPS;
}

export function registerRanks(registry) {
  for (const definition of RANK_DEFINITIONS) registry.register('rank', definition);
  return RANK_DEFINITIONS.length;
}
