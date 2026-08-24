// data/validate — Validadores de esquemas de contenido (docs/arch/data-schemas.md).
// Puros: reciben datos ya parseados, lanzan Error con diagnóstico. Testeados en Node.

export const CANONICAL_RANKS = [
  'G', 'F', 'C', 'D', 'B', 'BB', 'A', 'AA', 'AAA',
  'S', 'SS', 'SSS', 'SSSR', 'UR', 'URR', 'URRX', 'XG',
];

function fail(msg) { throw new Error(`[content] ${msg}`); }
function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }
function hasKeys(o, keys, where) {
  for (const k of keys) if (!(k in o)) fail(`${where}: falta '${k}'`);
}
function uniqueIds(list, where) {
  const seen = new Set();
  for (const it of list) {
    if (seen.has(it.id)) fail(`${where}: id duplicado '${it.id}'`);
    seen.add(it.id);
  }
}

export function validateRanks(data) {
  if (!isObj(data) || !Array.isArray(data.ranks)) fail('ranks: falta lista');
  const list = data.ranks;
  if (list.length !== 17) fail(`ranks: deben ser 17, hay ${list.length}`);
  uniqueIds(list, 'ranks');
  const ids = list.map(r => r.id).join(',');
  if (ids !== CANONICAL_RANKS.join(',')) fail('ranks: orden canónico incorrecto');
  list.forEach((r, i) => {
    hasKeys(r, ['id', 'order', 'family', 'frame'], `rank ${r.id}`);
    if (r.order !== i) fail(`ranks: order de ${r.id} debe ser ${i}`);
    hasKeys(r.frame, ['base', 'trim', 'accent', 'gem'], `rank ${r.id}.frame`);
  });
  return true;
}

export function validateProtagonists(data) {
  if (!isObj(data) || !Array.isArray(data.protagonists)) fail('protagonists: falta lista');
  const list = data.protagonists;
  if (list.length !== 12) fail(`protagonists: deben ser 12, hay ${list.length}`);
  uniqueIds(list, 'protagonists');
  const idx = new Set();
  for (const p of list) {
    hasKeys(p, ['id', 'index', 'name', 'title', 'faction', 'affinity',
      'weaponType', 'sigil', 'stats'], `protagonist ${p.id}`);
    hasKeys(p.stats, ['atk', 'def', 'ene'], `protagonist ${p.id}.stats`);
    if (!p.id.startsWith('protag/')) fail(`protagonist ${p.id}: id sin prefijo`);
    if (idx.has(p.index)) fail(`protagonists: index duplicado ${p.index}`);
    idx.add(p.index);
  }
  return true;
}

export function validateWeaponComponents(data) {
  for (const key of ['types', 'materials', 'cores', 'runes']) {
    if (!Array.isArray(data[key]) || !data[key].length) fail(`weapons: '${key}' vacío`);
    uniqueIds(data[key], `weapons.${key}`);
  }
  const effectIds = new Set((data.effects || []).map(e => e.id));
  for (const rune of data.runes) {
    if (rune.effect && !effectIds.has(rune.effect)) {
      fail(`weapons: runa '${rune.id}' usa efecto desconocido '${rune.effect}'`);
    }
  }
  return true;
}

export function validateFactions(data) {
  if (!Array.isArray(data?.factions) || !data.factions.length) fail('factions: vacío');
  uniqueIds(data.factions, 'factions');
  for (const f of data.factions) {
    hasKeys(f, ['id', 'name', 'palette', 'philosophy'], `faction ${f.id}`);
  }
  return true;
}

export function validateStory(data) {
  if (!Array.isArray(data?.scenes)) fail('story: falta scenes');
  for (const s of data.scenes) {
    hasKeys(s, ['id', 'lines'], `scene ${s.id}`);
    if (!Array.isArray(s.lines) || !s.lines.length) fail(`scene ${s.id}: sin líneas`);
  }
  return true;
}
