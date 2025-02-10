import { z } from "zod";

export const searchProductsFilterSchema = z.object({
  skus: z.string().array().optional(),
}).optional();

export const listProductsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});
export const listProductsSchema = z.object({
  query: listProductsQuerySchema,
});

export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>
