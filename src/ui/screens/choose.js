// ui/screens — Elección de Portador: las 12 cartas se muestran; el jugador
// elige UNA (canon). Confirmación en dos pasos: es una decisión de por vida.

import { createCardView } from '../components/cardView.js';

export function chooseScreen({ registry, composer, rankG, onChosen }) {
  let modal = null;

  function openDetail(root, def) {
    closeDetail();
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal__scrim"></div>
      <div class="modal__panel codex-panel" role="dialog" aria-modal="true" aria-label="${def.name}">
        <div class="modal__card"></div>
        <h3 class="modal__name">${def.name}</h3>
        <p class="modal__title">${def.title}</p>
        <p class="modal__arc">${def.arcHook}</p>
        <p class="modal__meta">Afinidad: ${def.affinity.join(' · ')} — Arma: ${def.weaponName}</p>
        <div class="modal__actions">
          <button class="codex-btn codex-btn--ghost" data-act="cancel" type="button">Aún no</button>
          <button class="codex-btn" data-act="confirm" type="button">Elegir a ${def.name.split(' ')[0]}</button>
        </div>
      </div>`;
    const big = createCardView({
      composer, def, rank: rankG, scale: detailScale(),
    });
    modal.querySelector('.modal__card').appendChild(big);
    modal.querySelector('[data-act="cancel"]').addEventListener('click', closeDetail);
    modal.querySelector('.modal__scrim').addEventListener('click', closeDetail);
    modal.querySelector('[data-act="confirm"]').addEventListener('click', () => {
      root.classList.add('choose--sealed');
      setTimeout(() => onChosen(def), 480); // transición de sellado
    });
    root.appendChild(modal);
  }

  function closeDetail() { modal?.remove(); modal = null; }
  function detailScale() { return Math.min((innerWidth - 96) / 360, .82); }

  return {
    enter(root) {
      const protagonists = [...registry.all('protagonist')]
        .sort((a, b) => a.index - b.index);
      root.innerHTML = `
        <section class="choose">
          <header class="choose__head">
            <h2 class="codex-h2">Doce cartas respiran</h2>
            <p class="codex-muted">Solo una responderá a tu mano. Las once restantes
            seguirán vivas en el mundo; esta elección no se deshace.</p>
          </header>
          <div class="choose__grid" role="list"></div>
        </section>`;
      const grid = root.querySelector('.choose__grid');
      const scale = gridScale();
      for (const def of protagonists) {
        const view = createCardView({
          composer, def, rank: rankG, scale,
          onSelect: () => openDetail(root, def),
        });
        grid.appendChild(view);
      }
    },
    dispose() { closeDetail(); },
  };
}

function gridScale() {
  const cols = innerWidth >= 900 ? 4 : 2;
  const gap = 14 * (cols - 1);
  const w = (Math.min(innerWidth - 32, 1180) - gap) / cols;
  return Math.min(w / 360, .62);
}
