import { eq, inArray } from 'drizzle-orm';
import { db } from '../db/database';
import { productDiscounts, products } from '../db/schema';
import { z } from 'zod';
import { searchProductsFilterSchema } from '../validators/product.validator';

export async function findAllAndCount(page = 1, limit = 10) {
  if (page < 1) page = 1;

  const offset = (page - 1) * limit;

  const [items, total] = await Promise.all([
    db.select().from(products).limit(limit).offset(offset),
    db.$count(products)
  ]);

  return {
    data: items,
    total,
    page,
    pagesTotal: Math.ceil(Number(total) / limit),
    limit,
  };
};

export async function findOne(sku: string) {
  // const data = await db.select().from(products).leftJoin(productDiscounts, eq(productDiscounts.source_product_sku, products.sku)).where(eq(products.sku, sku));
  // return data;

  return await db.query.products.findFirst({ with: { sourceDiscounts: true }, where: eq(products.sku, sku) });
}

export async function search(filter: z.infer<typeof searchProductsFilterSchema> = {}) {
  return await db.select().from(products).where(filter.skus ? inArray(products.sku, filter.skus) : undefined);
}
