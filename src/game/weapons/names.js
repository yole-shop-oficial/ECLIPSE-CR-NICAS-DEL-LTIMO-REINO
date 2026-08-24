// game/weapons — Generador de nombres en castellano con concordancia de género.
// «Espada de la Luna Vacía» · «Lanza del Dragón que Arde» (GDD cap. 05 §3).

export function buildWeaponName(type, core, rune, material) {
  const base = type.name;                       // «Espada»
  const corePart = core ? ` ${core.epithet}` : ''; // « de la Luna»
  let runePart = '';
  if (rune) {
    const epi = typeof rune.epithet === 'string'
      ? rune.epithet
      : rune.epithet[type.gender] || rune.epithet.m;
    // Si el epíteto ya empieza con preposición («de la Espina») se enlaza con coma implícita
    runePart = epi.startsWith('de') ? ` ${epi}` : ` ${epi}`;
  }
  const name = `${base}${corePart}${runePart}`.replace(/\s+/g, ' ').trim();
  return { name, materialName: material?.name || null };
}

/** Línea de lore generada: todo objeto tiene historia (pilar 1 del GDD). */
export function buildLoreLine(rng, name, material, core) {
  const common = [
    `Encontrada entre ceniza todavía tibia. Alguien grabó su nombre anterior y lo raspó.`,
    `Pesa más de lo que debería. El ${material.name.toLowerCase()} recuerda manos que ya no existen.`,
    `Recuperada de una sala sin puertas. Nadie explica cómo llegó allí.`,
    `Lleva una marca de fragua que ningún herrero vivo reconoce.`,
  ];
  const withCore = core
    ? [`Su núcleo ${core.epithet} palpita una vez por noche, siempre a la misma hora.`]
    : [];
  return `${name}. ${rng.pick([...common, ...withCore])}`;
}
