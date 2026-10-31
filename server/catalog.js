import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export function openCatalog(path = resolve(root, 'data/store.sqlite')) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec('CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, position INTEGER NOT NULL, payload TEXT NOT NULL)');
  const products = JSON.parse(readFileSync(resolve(root, 'config/products.json'), 'utf8'));
  const insert = db.prepare('INSERT INTO products (id, position, payload) VALUES (?, ?, ?)');
  db.exec('BEGIN');
  try {
    db.exec('DELETE FROM products');
    products.forEach((product, index) => insert.run(product.id, index, JSON.stringify(product)));
    db.exec('COMMIT');
  } catch (error) { db.exec('ROLLBACK'); db.close(); throw error; }
  return {
    all: () => db.prepare('SELECT payload FROM products ORDER BY position').all().map(row => JSON.parse(row.payload)),
    get: id => { const row = db.prepare('SELECT payload FROM products WHERE id = ?').get(id); return row ? JSON.parse(row.payload) : null; },
    close: () => db.close()
  };
}
export function getStore() { return JSON.parse(readFileSync(resolve(root, 'config/store.json'), 'utf8')); }
