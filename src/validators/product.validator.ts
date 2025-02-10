import { z } from "zod";

const searchProductsBodySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  filters: z.object({
    skus: z.string().array(),
  })
    .partial()
    .refine(
      (filters) =>
        filters.skus !== undefined,
      { message: "At least one of the filters is required. Filters available: (skus)" }
    ),
});
const listProductsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const searchProductsSchema = z.object({
  body: searchProductsBodySchema,
});
export const getProductSchema = z.object({
  params: z.object({
    sku: z.string().trim().nonempty(),
  }),
});
export const listProductsSchema = z.object({
  query: listProductsQuerySchema,
});

export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;

export type SearchProductsBody = z.infer<typeof searchProductsBodySchema>;
