// tools/dev-server — servidor estático sin dependencias para desarrollo/preview.
// Uso: npm run dev  →  http://localhost:8000 (sirve en 0.0.0.0 para red local).

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PORT = process.env.PORT || 8000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ogg': 'audio/ogg',
  '.opus': 'audio/ogg',
  '.mp3': 'audio/mpeg',
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    let path = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, '');
    if (path.startsWith('..')) { res.writeHead(403); return res.end(); }
    let file = join(ROOT, path || 'index.html');
    const st = await stat(file).catch(() => null);
    if (!st) { res.writeHead(404); return res.end('404 — el Códice no tiene esa página'); }
    if (st.isDirectory()) file = join(file, 'index.html');
    const data = await readFile(file);
    res.writeHead(200, {
      'Content-Type': MIME[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'Service-Worker-Allowed': '/',
    });
    res.end(data);
  } catch (err) {
    res.writeHead(500); res.end(String(err));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`ECLIPSE dev-server → http://localhost:${PORT} (red local: 0.0.0.0:${PORT})`);
});
