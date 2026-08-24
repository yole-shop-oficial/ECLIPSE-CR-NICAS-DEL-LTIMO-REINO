// ui/components — CardView: envuelve el canvas de una carta con interacción
// (brillo de filo al hover/tacto, elevación). La carta vive en canvas; el DOM
// solo aporta el marco físico de la interfaz.

export function createCardView({ composer, def, rank, scale = 1, onSelect = null }) {
  const shell = document.createElement('div');
  shell.className = 'card-shell';
  shell.style.setProperty('--card-w', `${360 * scale}px`);

  const canvas = composer.compose({ def, rank, scale });
  canvas.className = 'card-canvas';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', `${def.name}, ${def.title || 'carta'}, rango ${rank.id}`);
  shell.appendChild(canvas);

  const sheen = document.createElement('div');
  sheen.className = 'card-sheen';
  shell.appendChild(sheen);

  if (onSelect) {
    shell.classList.add('is-selectable');
    shell.tabIndex = 0;
    const go = () => onSelect(def);
    shell.addEventListener('click', go);
    shell.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  }

  shell.addEventListener('pointermove', (e) => {
    const r = shell.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - .5;
    const ny = (e.clientY - r.top) / r.height - .5;
    shell.style.setProperty('--tilt-x', `${(-ny * 4).toFixed(2)}deg`);
    shell.style.setProperty('--tilt-y', `${(nx * 5).toFixed(2)}deg`);
    sheen.style.setProperty('--sheen-x', `${(nx * 100 + 50).toFixed(1)}%`);
  });
  shell.addEventListener('pointerleave', () => {
    shell.style.setProperty('--tilt-x', '0deg');
    shell.style.setProperty('--tilt-y', '0deg');
  });

  return shell;
}
