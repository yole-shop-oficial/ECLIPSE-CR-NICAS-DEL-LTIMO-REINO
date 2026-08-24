// ui/screens — Prólogo: escena ligera (ilustración + texto progresivo, Mega §15).
// Los datos viven en content/story/prologue.json (SceneEngine formal en M4).

export function prologueScreen({ scene, onDone }) {
  let timer = null;
  let lineIdx = 0;
  let disposed = false;

  function finish() {
    if (disposed) return;
    disposed = true;
    clearTimeout(timer);
    onDone();
  }

  function typewrite(el, text, done) {
    el.textContent = '';
    let i = 0;
    const step = () => {
      if (disposed) return;
      el.textContent = text.slice(0, i);
      if (i++ <= text.length) setTimeout(step, 22);
      else done();
    };
    step();
  }

  return {
    enter(root) {
      root.innerHTML = `
        <section class="prologue">
          <div class="prologue__bg" style="background-image:url('${scene.background}')" aria-hidden="true"></div>
          <div class="prologue__shade" aria-hidden="true"></div>
          <p class="prologue__line" aria-live="polite"></p>
          <button class="codex-btn codex-btn--ghost prologue__skip" type="button">Omitir</button>
        </section>`;
      const lineEl = root.querySelector('.prologue__line');
      const next = () => {
        if (disposed) return;
        if (lineIdx >= scene.lines.length) return finish();
        typewrite(lineEl, scene.lines[lineIdx], () => {
          lineIdx += 1;
          timer = setTimeout(next, 1900);
        });
      };
      next();
      root.querySelector('.prologue__skip').addEventListener('click', (e) => {
        e.stopPropagation(); finish();
      });
    },
    dispose() { disposed = true; clearTimeout(timer); },
  };
}
