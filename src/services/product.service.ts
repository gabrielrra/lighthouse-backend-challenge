import { and, eq, inArray, SQL } from 'drizzle-orm';
import { db } from '../db/database';
import { products } from '../db/schema';
import { type SearchProductsBody } from '../validators/product.validator';

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
  return await db.query.products.findFirst({ with: { sourceDiscounts: true }, where: eq(products.sku, sku) });
}

export async function search(query: SearchProductsBody) {
  const { page = 1, limit = 10, filters } = query;
  const offset = (page - 1) * limit;

  const sqlFilters: SQL[] = [];

  if (filters.skus) {
    sqlFilters.push(inArray(products.sku, filters.skus));
  }
  const [data, total] = await Promise.all([
    db
      .select()
      .from(products)
      .where(and(...sqlFilters))
      .limit(limit)
      .offset(offset),
    db.$count(products, and(...sqlFilters))
  ]);


  return {
    data,
    total,
    page,
    pagesTotal: Math.ceil(Number(total) / limit),
    limit,
  };
}
