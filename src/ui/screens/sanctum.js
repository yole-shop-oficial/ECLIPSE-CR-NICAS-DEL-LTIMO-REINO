// ui/screens — Santuario: hogar del Cronista tras elegir Portador (M1).
// Muestra la carta viva, su arma legada y una demostración del WeaponGenerator
// (misma semilla ⇒ mismas armas, siempre).

import { createCardView } from '../components/cardView.js';

export function sanctumScreen({ profile, registry, composer, rankG, weaponGen, factionName, onReset }) {
  const def = registry.get('protagonist', profile.protagonistId);
  const arsenal = [0, 1, 2].map(i =>
    weaponGen.generate({ seed: `${profile.protagonistId}:${i}` }));

  return {
    enter(root) {
      root.innerHTML = `
        <section class="sanctum">
          <header class="sanctum__head">
            <h2 class="codex-h2">Santuario del Códice</h2>
            <p class="codex-muted">${profile.name} · Tu Portador despierta en rango G.
            El camino hasta XG comienza aquí.</p>
          </header>
          <div class="sanctum__body">
            <div class="sanctum__card"></div>
            <div class="sanctum__side codex-panel">
              <h3 class="codex-h3">${def.name}</h3>
              <p class="codex-muted italic">${def.title}</p>
              <dl class="sanctum__facts">
                <div><dt>Rango</dt><dd>G — el sellado inicial</dd></div>
                <div><dt>Facción</dt><dd>${factionName(def.faction)}</dd></div>
                <div><dt>Arma legada</dt><dd>«${def.weaponName}»</dd></div>
              </dl>
              <p class="sanctum__echo">Ecos: 0 — evolucionar conserva tus formas pasadas.</p>
              <div class="sanctum__actions">
                <button class="codex-btn" data-act="chapter" type="button">Capítulo I · Las Cuencas de Ceniza</button>
                <button class="codex-btn codex-btn--ghost" data-act="soon" type="button">Colección — próximamente</button>
                <button class="codex-btn codex-btn--ghost" data-act="reset" type="button">Abandonar crónica</button>
              </div>
            </div>
          </div>
          <aside class="sanctum__forge codex-panel">
            <h3 class="codex-h3">Fragua del Códice</h3>
            <p class="codex-muted">Armas generadas por componentes (semilla fija de tu crónica):</p>
            <ul class="forge__list">
              ${arsenal.map(w => `<li><strong>${w.name}</strong>
                <span class="codex-muted">${w.rank} · ${w.affinity || 'sin afinidad'} · poder ${w.power}</span></li>`).join('')}
            </ul>
          </aside>
        </section>`;

      const scale = Math.min((innerWidth - 64) / 720, .8);
      root.querySelector('.sanctum__card')
        .appendChild(createCardView({ composer, def, rank: rankG, scale }));

      root.querySelector('[data-act="chapter"]').addEventListener('click', (e) => {
        e.target.textContent = 'El Capítulo I llega en el hito M4 — el mundo ya lo espera.';
        e.target.disabled = true;
      });
      root.querySelector('[data-act="soon"]')?.addEventListener('click', (e) => {
        e.target.textContent = 'M3 · Colección — en el roadmap.';
        e.target.disabled = true;
      });
      root.querySelector('[data-act="reset"]').addEventListener('click', () => {
        if (confirm('¿Abandonar esta crónica? El Códice olvidará a tu Portador.')) onReset();
      });
    },
  };
}
