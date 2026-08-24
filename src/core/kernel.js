// core/kernel — Registro e inyección de módulos (puertos/adaptadores, ARCH §3).
// Los módulos se crean con una factoría que recibe el kernel; el dominio recibe
// infraestructura inyectada, nunca la importa directamente.

export class Kernel {
  constructor() {
    this._factories = new Map();
    this._instances = new Map();
    this._started = false;
  }

  register(name, factory) {
    if (this._instances.has(name)) throw new Error(`kernel: '${name}' ya instanciado`);
    this._factories.set(name, factory);
    return this;
  }

  get(name) {
    if (this._instances.has(name)) return this._instances.get(name);
    const factory = this._factories.get(name);
    if (!factory) throw new Error(`kernel: módulo no registrado: '${name}'`);
    const instance = factory(this);
    this._instances.set(name, instance);
    if (this._started && instance?.init) instance.init();
    return instance;
  }

  has(name) { return this._factories.has(name); }

  async start() {
    for (const name of this._factories.keys()) {
      const inst = this.get(name);
      if (inst?.init) await inst.init();
    }
    this._started = true;
  }

  async dispose() {
    for (const inst of this._instances.values()) {
      if (inst?.dispose) await inst.dispose();
    }
    this._instances.clear();
    this._started = false;
  }
}
