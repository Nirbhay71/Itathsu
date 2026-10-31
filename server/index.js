import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { openCatalog } from './catalog.js';
import { createApp } from './app.js';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const catalog = openCatalog(process.env.SQLITE_PATH || resolve(root, 'data/store.sqlite'));
const app = createApp(catalog);
if (process.argv.includes('--production')) {
  app.use(express.static(resolve(root, 'dist')));
  app.get('/{*path}', (_, res) => res.sendFile(resolve(root, 'dist/index.html')));
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({ server: { middlewareMode: true } });
  app.use(vite.middlewares);
}
const portArgument = process.argv.indexOf('--port');
const port = Number(portArgument >= 0 ? process.argv[portArgument + 1] : process.env.PORT || 3000);
const server = app.listen(port, '0.0.0.0', () => console.log(`Itatshu ready at http://localhost:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => { catalog.close(); process.exit(0); }));
