import { z } from 'zod';

export const searchProductDiscountsFilterSchema = z.object({
  product_skus: z.string().array().optional(),
});
