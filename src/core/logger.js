/**
 * core/logger.js — Logging con niveles, ring buffer y sinks suscribibles.
 * La consola de diagnóstico de la UI se conecta como sink; nada falla en silencio.
 */

export const LOG_LEVELS = Object.freeze({
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 99,
});

const CONSOLE_METHODS = Object.freeze({
  debug: 'log',
  info: 'log',
  warn: 'warn',
  error: 'error',
});

export function createLogger(options = {}) {
  const minLevel = LOG_LEVELS[options.level ?? 'info'] ?? LOG_LEVELS.info;
  const capacity = options.capacity ?? 200;
  const quiet = options.quiet ?? false;
  const buffer = [];
  const sinks = new Set();

  function write(level, message, data) {
    const entry = Object.freeze({
      at: Date.now(),
      level,
      message: typeof message === 'string' ? message : String(message),
      data,
    });
    buffer.push(entry);
    if (buffer.length > capacity) buffer.shift();
    for (const sink of [...sinks]) {
      try {
        sink(entry);
      } catch {
        /* un sink roto no puede romper el logger */
      }
    }
    if (quiet || LOG_LEVELS[level] < minLevel) return;
    const line = `[eclipse][${level}] ${entry.message}`;
    const method = CONSOLE_METHODS[level] ?? 'log';
    if (data !== undefined) console[method](line, data);
    else console[method](line);
  }

  return Object.freeze({
    debug: (message, data) => write('debug', message, data),
    info: (message, data) => write('info', message, data),
    warn: (message, data) => write('warn', message, data),
    error: (message, data) => write('error', message, data),
    /** Registra un Error real; extrae mensaje y stack de forma segura. */
    captureError: (err, context = 'unknown') => {
      write('error', `[${context}] ${err?.message ?? String(err)}`, {
        stack: err?.stack ?? null,
      });
    },
    addSink: (fn) => {
      if (typeof fn !== 'function') throw new TypeError('logger.addSink requiere función');
      sinks.add(fn);
      return () => sinks.delete(fn);
    },
    history: () => buffer.slice(),
    clear: () => {
      buffer.length = 0;
    },
  });
}
