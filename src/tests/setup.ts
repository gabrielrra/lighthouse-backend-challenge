import dotenv from 'dotenv';
import { db } from '../db/database';
import fs from 'fs/promises';
import path from 'path';
let teardownHappened = false;

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

export async function createTables() {
  await db.$client.execute(`
CREATE TABLE product_discounts (
	id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	description text NOT NULL,
	source_product_sku text NOT NULL,
	target_product_sku text NOT NULL,
	source_product_units integer,
	discount_percentage integer,
	discount_unit integer,
	type text NOT NULL
);`);
  await db.$client.execute(`
CREATE TABLE products (
	sku text PRIMARY KEY NOT NULL,
	name text NOT NULL,
	description text,
	price_cents integer NOT NULL
);`);
}

export async function removeDbFile() {
  const dbPath = process.env.DB_URL!.replace('file:', '');
  const fullPath = path.resolve(dbPath);
  try {
    await fs.unlink(fullPath);
  } catch (err: any) {
    if (err?.code !== 'ENOENT') {
      throw err;
    }
  }
}

export async function setup() {
  await createTables();
}

export async function teardown() {
  if (teardownHappened) {
    throw new Error('teardown called twice');
  }
  teardownHappened = true;
  await removeDbFile();
}
declare module 'vitest' {
  export interface ProvidedContext {
    wsPort: number;
  }
}
