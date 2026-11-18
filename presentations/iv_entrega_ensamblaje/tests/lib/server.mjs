import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
export const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
export const PLAYWRIGHT_CORE_PATH = path.join(PROJECT_ROOT, 'node_modules', 'playwright-core', 'index.mjs');
export const CHROME_EXECUTABLE_PATH = '/usr/bin/google-chrome';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.wasm': 'application/wasm',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

export function verifyPreflightAssets() {
  const required = [
    { path: path.join(DIST_DIR, 'index.html'), label: 'dist/index.html (run `npm run build` first)' },
    {
      path: path.join(DIST_DIR, 'docs', 'Documento_Final_Unificado_MotoRepuestosElCentenario.pdf'),
      label: 'dist/docs/Documento_Final_Unificado_MotoRepuestosElCentenario.pdf'
    },
    {
      path: path.join(DIST_DIR, 'docs', '03_Modelo_Financiero_mrec.xlsx'),
      label: 'dist/docs/03_Modelo_Financiero_mrec.xlsx'
    },
    { path: PLAYWRIGHT_CORE_PATH, label: 'node_modules/playwright-core/index.mjs' },
    { path: CHROME_EXECUTABLE_PATH, label: '/usr/bin/google-chrome' }
  ];

  const missing = required.filter((item) => !fs.existsSync(item.path));
  if (missing.length > 0) {
    const details = missing.map((m) => `  - Missing: ${m.label} (${m.path})`).join('\n');
    throw new Error(`E2E Preflight Check Failed:\n${details}`);
  }
}

export async function startStaticServer(rootDir = DIST_DIR) {
  const resolvedRoot = path.resolve(rootDir);

  const server = http.createServer((req, res) => {
    try {
      const reqUrl = new URL(req.url || '/', 'http://127.0.0.1');
      let pathname = decodeURIComponent(reqUrl.pathname);

      if (pathname === '/') {
        pathname = '/index.html';
      }

      // Prevent path traversal outside resolvedRoot
      const safeRelPath = pathname.replace(/^\/+/, '');
      const fullPath = path.resolve(resolvedRoot, safeRelPath);
      if (fullPath !== resolvedRoot && !fullPath.startsWith(resolvedRoot + path.sep)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Forbidden');
        return;
      }

      let targetPath = fullPath;
      if (!fs.existsSync(targetPath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
        return;
      }

      let stat = fs.statSync(targetPath);
      if (stat.isDirectory()) {
        targetPath = path.join(targetPath, 'index.html');
        if (!fs.existsSync(targetPath)) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Not Found');
          return;
        }
        stat = fs.statSync(targetPath);
      }

      const ext = path.extname(targetPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const totalSize = stat.size;
      const rangeHeader = req.headers.range;

      // Support HTTP Range requests cleanly (critical for PDF.js streaming/chunking)
      if (rangeHeader) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
        if (!match) {
          res.writeHead(416, {
            'Content-Range': `bytes */${totalSize}`,
            'Content-Type': 'text/plain; charset=utf-8'
          });
          res.end('Range Not Satisfiable');
          return;
        }

        const start = match[1] === '' ? Math.max(0, totalSize - Number(match[2])) : Number(match[1]);
        const end = match[2] === '' ? totalSize - 1 : Math.min(totalSize - 1, Number(match[2]));

        if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= totalSize) {
          res.writeHead(416, {
            'Content-Range': `bytes */${totalSize}`,
            'Content-Type': 'text/plain; charset=utf-8'
          });
          res.end('Range Not Satisfiable');
          return;
        }

        const chunkSize = end - start + 1;
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${totalSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': String(chunkSize),
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        });

        if (req.method === 'HEAD') {
          res.end();
          return;
        }

        fs.createReadStream(targetPath, { start, end }).pipe(res);
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': String(totalSize),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache'
      });

      if (req.method === 'HEAD') {
        res.end();
        return;
      }

      fs.createReadStream(targetPath).pipe(res);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`Server error: ${err.message}`);
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });

  const addr = server.address();
  const baseOrigin = `http://127.0.0.1:${addr.port}`;

  return {
    server,
    port: addr.port,
    baseOrigin,
    async close() {
      await new Promise((resolve) => server.close(resolve));
    }
  };
}
