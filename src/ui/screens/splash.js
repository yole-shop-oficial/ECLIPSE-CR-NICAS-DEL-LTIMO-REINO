// ui/screens — Splash: portada del Códice. Un toque abre el libro.

export function splashScreen({ onDone }) {
  return {
    enter(root) {
      root.innerHTML = `
        <section class="splash">
          <div class="splash__bg" aria-hidden="true"></div>
          <img class="splash__sigil" src="assets/brand/icon-512.png" alt="Sigilo del eclipse" width="120" height="120">
          <h1 class="splash__title">ECLIPSE</h1>
          <p class="splash__subtitle">CRÓNICAS DEL ÚLTIMO REINO</p>
          <p class="splash__codex">— THE ETERNAL CODEX —</p>
          <p class="splash__hint">Toca para abrir el Códice</p>
        </section>`;
      const go = () => { root.removeEventListener('click', go); onDone(); };
      root.addEventListener('click', go);
      root.addEventListener('keydown', function key(e) {
        if (e.key === 'Enter' || e.key === ' ') { root.removeEventListener('keydown', key); onDone(); }
      });
    },
  };
}
