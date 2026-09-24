import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import type { ProductGroup } from "@/data/catalog";
import { seedProducts } from "./seed-data";

/**
 * The product database. One SQLite file holds every model and price, so an edit
 * in the admin panel shows on the public pages immediately.
 *
 * Files live in ./storage (override with STORAGE_DIR): webor.db and uploads/.
 * On a host, mount a persistent disk there so edits and photos survive deploys.
 */
export const storageDir = path.resolve(process.env.STORAGE_DIR || path.join(process.cwd(), "storage"));
export const uploadsDir = path.join(storageDir, "uploads");

export type Product = {
  id: number;
  category: string;
  category_group: ProductGroup;
  model: string;
  spec: string;
  price: number;
  photo: string | null;
  created_at: string;
  updated_at: string;
};

export type NewProduct = Pick<Product, "category" | "category_group" | "model" | "spec" | "price" | "photo">;

function open() {
  fs.mkdirSync(uploadsDir, { recursive: true });
  const db = new Database(path.join(storageDir, "webor.db"));
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      category_group TEXT NOT NULL,
      model TEXT NOT NULL,
      spec TEXT NOT NULL,
      price INTEGER NOT NULL,
      photo TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  const { n } = db.prepare("SELECT COUNT(*) AS n FROM products").get() as { n: number };
  if (n === 0) {
    const insert = db.prepare(
      `INSERT INTO products (category, category_group, model, spec, price, photo)
       VALUES (@category, @category_group, @model, @spec, @price, @photo)`,
    );
    db.transaction((rows: NewProduct[]) => rows.forEach((r) => insert.run(r)))(seedProducts);
  }
  return db;
}

// Reuse one connection across hot reloads in development.
const globalForDb = globalThis as unknown as { weborDb?: Database.Database };
const db = globalForDb.weborDb ?? open();
if (process.env.NODE_ENV !== "production") globalForDb.weborDb = db;

export function getProducts(group?: ProductGroup | null): Product[] {
  if (group) {
    return db.prepare("SELECT * FROM products WHERE category_group = ? ORDER BY category, price").all(group) as Product[];
  }
  return db.prepare("SELECT * FROM products ORDER BY category, price").all() as Product[];
}

export function getProduct(id: number): Product | undefined {
  return db.prepare("SELECT * FROM products WHERE id = ?").get(id) as Product | undefined;
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return db
    .prepare("SELECT * FROM products WHERE category = ? AND id != ? ORDER BY price LIMIT ?")
    .all(product.category, product.id, limit) as Product[];
}

export function getCatalogStats() {
  const row = db
    .prepare("SELECT COUNT(*) AS products, COUNT(DISTINCT category) AS categories FROM products")
    .get() as { products: number; categories: number };
  const groups = db
    .prepare("SELECT category_group AS grp, COUNT(*) AS n FROM products GROUP BY category_group")
    .all() as { grp: ProductGroup; n: number }[];
  return { ...row, byGroup: Object.fromEntries(groups.map((g) => [g.grp, g.n])) as Partial<Record<ProductGroup, number>> };
}

export function createProduct(p: NewProduct) {
  db.prepare(
    `INSERT INTO products (category, category_group, model, spec, price, photo)
     VALUES (@category, @category_group, @model, @spec, @price, @photo)`,
  ).run(p);
}

export function updateProduct(id: number, p: NewProduct) {
  db.prepare(
    `UPDATE products
     SET category = @category, category_group = @category_group, model = @model, spec = @spec,
         price = @price, photo = @photo, updated_at = datetime('now')
     WHERE id = @id`,
  ).run({ ...p, id });
}

export function deleteProduct(id: number) {
  db.prepare("DELETE FROM products WHERE id = ?").run(id);
}

/** One product per distinct photo, for the 3D scenes. */
export function getPhotoProducts(): Product[] {
  return db
    .prepare(
      `SELECT * FROM products WHERE id IN (
         SELECT MIN(id) FROM products WHERE photo IS NOT NULL GROUP BY photo
       ) ORDER BY category_group, category, price`,
    )
    .all() as Product[];
}
