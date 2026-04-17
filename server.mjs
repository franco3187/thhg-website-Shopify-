import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));

const MIME = {
  '.html': 'text/html',
  '.js':   'text/javascript',
  '.jsx':  'text/javascript',
  '.css':  'text/css',
  '.jpeg': 'image/jpeg',
  '.jpg':  'image/jpeg',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
};

createServer(async (req, res) => {
  const url = req.url === '/' ? '/preview.html' : req.url;
  const filePath = join(ROOT, url);
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(3000, '127.0.0.1', () => console.log('Preview at http://127.0.0.1:3000'));
