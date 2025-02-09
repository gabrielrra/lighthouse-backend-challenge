import { db } from '../db/database';
import { productDiscounts } from '../db/schema';
import { searchProductDiscountsFilterSchema } from '../validators/productDiscount.validator';
import { inArray } from 'drizzle-orm';
import { z } from 'zod';

export async function search(filter: z.infer<typeof searchProductDiscountsFilterSchema> = {}) {
  return await db.select().from(productDiscounts).where(filter.product_skus ? inArray(productDiscounts.source_product_sku, filter.product_skus) : undefined);
}
