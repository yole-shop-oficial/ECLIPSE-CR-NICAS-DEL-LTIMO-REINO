// ui/engine — UIEngine: pantallas DOM del Códice (ADR-003). Ciclo de vida:
// enter(root, params) → dispose(). Transiciones atenuadas, sin librerías.

export class UIEngine {
  constructor(rootEl) {
    this._root = rootEl;
    this._screens = new Map();
    this._current = null;
  }

  register(name, factory) { this._screens.set(name, factory); return this; }

  async show(name, params = {}) {
    const factory = this._screens.get(name);
    if (!factory) throw new Error(`ui: pantalla no registrada '${name}'`);
    if (this._current) {
      this._root.classList.add('screen-leaving');
      await wait(180);
      this._current.dispose?.();
      this._root.replaceChildren();
      this._root.classList.remove('screen-leaving');
    }
    const screen = factory(params);
    this._current = screen;
    this._root.classList.add('screen-entering');
    await screen.enter?.(this._root);
    requestAnimationFrame(() => this._root.classList.remove('screen-entering'));
    return screen;
  }

  current() { return this._current; }
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
