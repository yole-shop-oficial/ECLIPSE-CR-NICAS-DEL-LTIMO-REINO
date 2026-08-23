/**
 * ui/boot-screen.js — Pantalla de diagnóstico del arranque (FASE 1).
 * Sin emojis (GDD §2): estados con glifos geométricos y tipografía.
 */

import { RANK_ORDER } from '../../data/ranks.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderBootScreen(app, { config, report, registry, state, logger }) {
  app.innerHTML = '';

  const root = el('div', 'boot');

  const header = el('header', 'boot-header');
  header.appendChild(el('h1', 'boot-title', 'ECLIPSE'));
  header.appendChild(el('p', 'boot-subtitle', 'CRÓNICAS DEL ÚLTIMO REINO — THE ETERNAL CODEX'));
  header.appendChild(el('p', 'boot-version', `v${config.version} · Fase 1: Fundación`));
  root.appendChild(header);

  const checks = el('section', 'boot-checks');
  for (const item of report) {
    const row = el('div', `check ${item.ok ? 'check-ok' : 'check-fail'}`);
    row.appendChild(el('span', 'check-mark', item.ok ? '◆' : '✕'));
    row.appendChild(el('span', 'check-label', item.label));
    if (item.detail) row.appendChild(el('span', 'check-detail', item.detail));
    checks.appendChild(row);
  }
  root.appendChild(checks);

  const ranks = el('section', 'boot-ranks');
  ranks.appendChild(el('h2', 'boot-section-title', 'Rangos registrados'));
  const strip = el('div', 'rank-strip');
  for (const code of RANK_ORDER) {
    const def = registry.get('rank', `rank_${code}`);
    const chip = el('span', 'rank-chip', code);
    chip.style.borderColor = def?.palette?.accent ?? '#555';
    chip.style.color = def?.palette?.glow ?? '#ccc';
    chip.title = def?.name ?? code;
    strip.appendChild(chip);
  }
  ranks.appendChild(strip);
  root.appendChild(ranks);

  const next = el('section', 'boot-next');
  next.appendChild(el('h2', 'boot-section-title', 'Siguiente fase'));
  next.appendChild(el('p', 'boot-next-text',
    'FASE 2 — Motor de Cartas: CardDefinition, Card Renderer por capas, frames y arte.'));
  root.appendChild(next);

  const footer = el('footer', 'boot-footer');
  footer.appendChild(el('p', '', 'Offline-first · Data-driven · Sin emojis · Sin frameworks'));
  root.appendChild(footer);

  app.appendChild(root);

  logger.addSink((entry) => {
    const line = document.createElement('div');
    line.className = `log-line log-${entry.level}`;
    line.textContent = `[${entry.level}] ${entry.message}`;
    const box = app.querySelector('.boot-log');
    if (box) {
      box.appendChild(line);
      while (box.childElementCount > 30) box.removeChild(box.firstChild);
    }
  });
  const logBox = el('section', 'boot-log');
  root.insertBefore(logBox, footer);
  for (const entry of logger.history()) {
    const line = el('div', `log-line log-${entry.level}`, `[${entry.level}] ${entry.message}`);
    logBox.appendChild(line);
  }

  return root;
}
